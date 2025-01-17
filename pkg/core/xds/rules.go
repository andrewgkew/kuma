package xds

import (
	"sort"

	"google.golang.org/protobuf/proto"

	common_api "github.com/kumahq/kuma/api/common/v1alpha1"
	mesh_proto "github.com/kumahq/kuma/api/mesh/v1alpha1"
	core_model "github.com/kumahq/kuma/pkg/core/resources/model"
	util_proto "github.com/kumahq/kuma/pkg/util/proto"
)

// Tag is a key-value pair. If Not is true then Key != Value
type Tag struct {
	Key   string
	Value string
	Not   bool
}

// Subset represents a group of proxies
type Subset []Tag

// IsSubset returns true if 'other' is a subset of the current set.
// Empty set is a superset for all subsets.
func (ss Subset) IsSubset(other Subset) bool {
	if len(ss) == 0 {
		return true
	}
	otherByKeys := map[string][]Tag{}
	for _, t := range other {
		otherByKeys[t.Key] = append(otherByKeys[t.Key], t)
	}
	for _, tag := range ss {
		oTags, ok := otherByKeys[tag.Key]
		if !ok {
			return false
		}
		for _, otherTag := range oTags {
			if otherTag.Value == tag.Value && otherTag.Not != tag.Not {
				return false
			}
			if otherTag.Value != tag.Value && !otherTag.Not {
				return false
			}
		}
	}
	return true
}

func MeshService(name string) Subset {
	return Subset{{
		Key: mesh_proto.ServiceTag, Value: name,
	}}
}

// NumPositive returns a number of tags without negation
func (ss Subset) NumPositive() int {
	pos := 0
	for _, t := range ss {
		if !t.Not {
			pos++
		}
	}
	return pos
}

func (ss Subset) IndexOfPositive() int {
	for i, t := range ss {
		if !t.Not {
			return i
		}
	}
	return -1
}

// Rule contains a configuration for the given Subset. When rule is an inbound rule (from),
// then Subset represents a group of clients. When rule is an outbound (to) then Subset
// represents destinations.
type Rule struct {
	Subset Subset
	Conf   proto.Message
	// todo(lobkovilya): add support for Origin to implement Inspect API
	Origin []core_model.ResourceMeta
}

type Rules []*Rule

// Compute returns configuration for the given subset.
func (rs Rules) Compute(sub Subset) proto.Message {
	for _, rule := range rs {
		if rule.Subset.IsSubset(sub) {
			return rule.Conf
		}
	}
	return nil
}

// BuildRules creates a list of rules with negations sorted by the number of positive tags.
// If rules with negative tags are filtered out then the order becomes 'most specific to less specific'.
// Filtering out of negative rules could be useful for XDS generators that don't have a way to configure negations.
//
// See the detailed algorithm description in docs/madr/decisions/007-mesh-traffic-permission.md
func BuildRules(list []PolicyItem) Rules {
	rules := Rules{}

	// 1. Each targetRef should be represented as a list of tags
	tagSet := map[Tag]bool{}
	for _, item := range list {
		for _, t := range asSubset(item.GetTargetRef()) {
			tagSet[t] = true
		}
	}
	tags := []Tag{}
	for tag := range tagSet {
		tags = append(tags, tag)
	}

	sort.Slice(tags, func(i, j int) bool {
		if tags[i].Key != tags[j].Key {
			return tags[i].Key < tags[j].Key
		}
		return tags[i].Value < tags[j].Value
	})

	// 2. Iterate over all possible combinations with negations
	iter := NewSubsetIter(tags)
	for {
		ss := iter.Next()
		if ss == nil {
			break
		}
		// 3. For each combination determine a configuration
		var conf proto.Message
		for i := 0; i < len(list); i++ {
			item := list[i]
			if asSubset(item.GetTargetRef()).IsSubset(ss) {
				if conf == nil {
					conf = proto.Clone(item.GetDefaultAsProto())
				} else {
					// todo(lobkovilya): util_proto.Merge appends lists,
					// create a custom Merge func for list replacements
					util_proto.Merge(conf, item.GetDefaultAsProto())
				}
			}
		}
		if conf != nil {
			rules = append(rules, &Rule{
				Subset: ss,
				Conf:   conf,
			})
		}
	}

	sort.SliceStable(rules, func(i, j int) bool {
		return rules[i].Subset.NumPositive() > rules[j].Subset.NumPositive()
	})

	return rules
}

func asSubset(tr *common_api.TargetRef) Subset {
	if tr == nil {
		// syntactic sugar, empty targetRef means targetRef{kind: Mesh}
		return Subset{}
	}
	switch tr.GetKindEnum() {
	case common_api.TargetRef_Mesh:
		return Subset{}
	case common_api.TargetRef_MeshSubset:
		ss := Subset{}
		for k, v := range tr.GetTags() {
			ss = append(ss, Tag{Key: k, Value: v})
		}
		return ss
	case common_api.TargetRef_MeshService:
		return Subset{{Key: mesh_proto.ServiceTag, Value: tr.GetName()}}
	case common_api.TargetRef_MeshServiceSubset:
		ss := Subset{{Key: mesh_proto.ServiceTag, Value: tr.GetName()}}
		for k, v := range tr.GetTags() {
			ss = append(ss, Tag{Key: k, Value: v})
		}
		return ss
	default:
		panic("unsupported type to represent as tags")
	}
}

type SubsetIter struct {
	current  []Tag
	finished bool
}

func NewSubsetIter(tags []Tag) *SubsetIter {
	return &SubsetIter{
		current: tags,
	}
}

// Next returns the next subset of the partition. When reaches the end Next returns 'nil'
func (c *SubsetIter) Next() Subset {
	if c.finished {
		return nil
	}
	for {
		hasNext := c.next()
		if !hasNext {
			c.finished = true
			return c.simplified()
		}
		if result := c.simplified(); result != nil {
			return result
		}
	}
}

func (c *SubsetIter) next() bool {
	for idx := 0; idx < len(c.current); idx++ {
		if c.current[idx].Not {
			c.current[idx].Not = false
		} else {
			c.current[idx].Not = true
			return true
		}
	}
	return false
}

// simplified returns copy of c.current and deletes redundant tags, for example:
//   - env: dev
//   - env: !prod
//
// could be simplified to:
//   - env: dev
//
// If tags are contradicted (same keys have different positive value) then the function
// returns nil.
func (c *SubsetIter) simplified() Subset {
	result := Subset{}

	ssByKey := map[string]Subset{}
	keyOrder := []string{}
	for _, t := range c.current {
		if _, ok := ssByKey[t.Key]; !ok {
			keyOrder = append(keyOrder, t.Key)
		}
		ssByKey[t.Key] = append(ssByKey[t.Key], Tag{Key: t.Key, Value: t.Value, Not: t.Not})
	}

	for _, key := range keyOrder {
		ss := ssByKey[key]
		positive := ss.NumPositive()
		switch {
		case positive == 0:
			result = append(result, ss...)
		case positive == 1:
			result = append(result, ss[ss.IndexOfPositive()])
		case positive >= 2:
			// contradicted, at least 2 positive values for the same key, i.e 'key1: value1' and 'key1: value2'
			return nil
		}
	}

	return result
}
