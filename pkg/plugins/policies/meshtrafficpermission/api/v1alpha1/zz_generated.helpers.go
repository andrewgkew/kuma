// Generated by tools/resource-gen.
// Run "make generate" to update this file.

// nolint:whitespace
package v1alpha1

import (
	"google.golang.org/protobuf/proto"

	core_xds "github.com/kumahq/kuma/pkg/core/xds"
)

func (x *MeshTrafficPermission_From) GetDefaultAsProto() proto.Message {
	return x.Default
}

func (x *MeshTrafficPermission) GetFromList() []core_xds.PolicyItem {
	var result []core_xds.PolicyItem
	for _, item := range x.From {
		result = append(result, item)
	}
	return result
}
