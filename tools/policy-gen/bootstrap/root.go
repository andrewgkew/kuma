package main

import (
	"fmt"
	"os"
	"os/exec"
	"path"
	"strings"
	"text/template"

	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

var cfg = config{}

type config struct {
	name              string
	skipValidator     bool
	force             bool
	basePath          string
	gomodule          string
	version           string
	generateTargetRef bool
	generateTo        bool
	generateFrom      bool
}

func (c config) policyPath() string {
	return path.Join(c.basePath, c.lowercase())
}

func (c config) lowercase() string {
	return strings.ToLower(c.name)
}

var rootCmd = &cobra.Command{
	Use:   "bootstrap",
	Short: "Bootstrap a new policy",
	RunE: func(cmd *cobra.Command, args []string) error {
		if cfg.name == "" {
			return errors.New("-name is required")
		}
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "Bootstraping policy: %s at path %s\n", cfg.name, cfg.policyPath())
		if !cfg.force {
			_, err := os.Stat(cfg.policyPath())
			if err == nil {
				return fmt.Errorf("path %s already exists use -force to overwrite it", cfg.policyPath())
			}
		} else {
			_, _ = fmt.Fprintf(cmd.OutOrStdout(), "Deleting old policy code\n")
			if err := os.RemoveAll(cfg.policyPath()); err != nil {
				return err
			}
		}
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "Generating proto file\n")
		if err := generateProto(cfg); err != nil {
			return err
		}
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "Generating plugin file\n")
		if err := generatePlugin(cfg); err != nil {
			return err
		}
		if err := exec.Command("make", "generate/policy/"+cfg.lowercase()).Run(); err != nil {
			return err
		}
		_, _ = cmd.OutOrStdout().Write([]byte(fmt.Sprintf(`
Successfully bootstrapped policy
regenerate auto generated files with: make generate/policy/%s

Useful files:
  - %s the proto definition
  - %s the validator
  - %s the plugin implementation
`,
			cfg.lowercase(),
			fmt.Sprintf("%s/api/%s/%s.proto", cfg.policyPath(), cfg.version, cfg.lowercase()),
			fmt.Sprintf("%s/api/%s/validator.go", cfg.policyPath(), cfg.version),
			fmt.Sprintf("%s/plugin/%s/plugin.go", cfg.policyPath(), cfg.version),
		)))
		return nil
	},
}

func generateProto(c config) error {
	apiPath := path.Join(c.policyPath(), "api", c.version)
	if err := os.MkdirAll(apiPath, os.ModePerm); err != nil {
		return err
	}
	f, err := os.Create(path.Join(apiPath, c.lowercase()+".proto"))
	if err != nil {
		return err
	}
	err = protoTemplate.Execute(f, map[string]interface{}{
		"name":              c.name,
		"nameLower":         c.lowercase(),
		"module":            path.Join(c.gomodule, c.basePath),
		"version":           c.version,
		"generateTargetRef": c.generateTargetRef,
		"generateTo":        c.generateTo,
		"generateFrom":      c.generateFrom,
	})
	if err != nil {
		return err
	}
	if c.skipValidator {
		return nil
	}
	f, err = os.Create(path.Join(apiPath, "validator.go"))
	if err != nil {
		return err
	}
	return validatorTemplate.Execute(f, map[string]interface{}{
		"name":              c.name,
		"version":           c.version,
		"generateTargetRef": c.generateTargetRef,
		"generateTo":        c.generateTo,
		"generateFrom":      c.generateFrom,
	})
}

func generatePlugin(c config) error {
	dir := path.Join(c.policyPath(), "plugin", c.version)
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		return err
	}
	f, err := os.Create(path.Join(dir, "plugin.go"))
	if err != nil {
		return err
	}
	return pluginTemplate.Execute(f, map[string]interface{}{
		"name":              c.name,
		"version":           c.version,
		"package":           fmt.Sprintf("%s/%s/%s/api/%s", c.gomodule, c.basePath, c.lowercase(), c.version),
		"generateTargetRef": c.generateTargetRef,
		"generateTo":        c.generateTo,
		"generateFrom":      c.generateFrom,
	})
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.Flags().StringVar(&cfg.name, "name", "", "The name of the policy (UpperCamlCase)")
	rootCmd.Flags().StringVar(&cfg.basePath, "path", "pkg/plugins/policies", "Where to put the generated code")
	rootCmd.Flags().StringVar(&cfg.gomodule, "gomodule", "github.com/kumahq/kuma", "Where to put the generated code")
	rootCmd.Flags().StringVar(&cfg.version, "version", "v1alpha1", "The version to use")
	rootCmd.Flags().BoolVar(&cfg.skipValidator, "skip-validator", false, "don't generator a validator empty file")
	rootCmd.Flags().BoolVar(&cfg.force, "force", false, "Overwrite any existing code")
	rootCmd.Flags().BoolVar(&cfg.generateTargetRef, "generate-target-ref", true, "Generate top-level TargetRef for dataplane proxy matching")
	rootCmd.Flags().BoolVar(&cfg.generateTo, "generate-to", false, "Generate 'to' array for outgoing traffic configuration")
	rootCmd.Flags().BoolVar(&cfg.generateFrom, "generate-from", false, "Generate 'from' array for incoming traffic configuration")
}

var protoTemplate = template.Must(template.New("").Option("missingkey=error").Parse(
	`syntax = "proto3";

package kuma.plugins.policies.{{ .nameLower }}.{{ .version }};

import "mesh/options.proto";
option go_package = "{{ .module }}/{{.nameLower}}/api/{{ .version }}";
{{ if or .generateTargetRef (or .generateTo .generateFrom) }}
import "common/v1alpha1/targetref.proto";
{{- end}}
import "kuma-doc/config.proto";

option (doc.config) = {
  type : Policy,
  name : "{{ .name }}",
  file_name : "{{ .nameLower }}"
};

// {{ .name }}
message {{ .name }} {
  option (kuma.mesh.policy) = {
    // Toggle this to have the policy registered or not in Kuma
    skip_registration : false,
  };

  {{- if .generateTargetRef }}

  // TargetRef is a reference to the resource the policy takes an effect on.
  // The resource could be either a real store object or virtual resource
  // defined inplace.
  kuma.common.v1alpha1.TargetRef targetRef = 1;
  {{- end }}

  message Conf {
    // TODO add configuration fields
  }

  {{- if .generateTo }}

  message To {
    // TargetRef is a reference to the resource that represents a group of
    // destinations.
    kuma.common.v1alpha1.TargetRef targetRef = 1 [ (doc.required) = true ];

    // Default is a configuration specific to the group of destinations referenced in
    // 'targetRef'
    Conf default = 2 [ (doc.required) = true ];
  }

  repeated To to = 2;
  {{- end}}

  {{- if .generateFrom }}

  message From {
    // TargetRef is a reference to the resource that represents a group of
    // clients.
    kuma.common.v1alpha1.TargetRef targetRef = 1 [ (doc.required) = true ];

    // Default is a configuration specific to the group of clients referenced in
    // 'targetRef'
    Conf default = 2 [ (doc.required) = true ];
  }

  repeated From from = 3;

  {{- end}}
}
`))

var pluginTemplate = template.Must(template.New("").Option("missingkey=error").Parse(
	`package {{ .version }}

import (
	"github.com/kumahq/kuma/pkg/core"

	core_plugins "github.com/kumahq/kuma/pkg/core/plugins"
	core_mesh "github.com/kumahq/kuma/pkg/core/resources/apis/mesh"
	core_xds "github.com/kumahq/kuma/pkg/core/xds"
	{{- if .generateTargetRef }}
	"github.com/kumahq/kuma/pkg/plugins/policies/matchers"
	api "{{ .package }}"
	{{- end}}
	xds_context "github.com/kumahq/kuma/pkg/xds/context"
)

var _ core_plugins.PolicyPlugin = &plugin{}
var log = core.Log.WithName("{{.name}}")

type plugin struct {
}

func NewPlugin() core_plugins.Plugin {
	return &plugin{}
}

func (p plugin) MatchedPolicies(dataplane *core_mesh.DataplaneResource, resources xds_context.Resources) (core_xds.TypedMatchingPolicies, error) {
	{{- if not .generateTargetRef }}
	panic("implement me")
	{{- else }}
	return matchers.MatchedPolicies(api.{{ .name }}Type, dataplane, resources)
	{{- end }}
}

func (p plugin) Apply(rs *core_xds.ResourceSet, ctx xds_context.Context, proxy *core_xds.Proxy) error {
	log.Info("apply is not implemented")
	return nil
}
`))

var validatorTemplate = template.Must(template.New("").Option("missingkey=error").Parse(
	`package {{.version}}

import (
	{{- if or .generateTargetRef (or .generateTo .generateFrom) }}
	common_proto "github.com/kumahq/kuma/api/common/v1alpha1"
	matcher_validators "github.com/kumahq/kuma/pkg/plugins/policies/matchers/validators"
	{{- end}}
	"github.com/kumahq/kuma/pkg/core/validators"
)

func (r *{{.name}}Resource) validate() error {
	var verr validators.ValidationError
	path := validators.RootedAt("spec")
	{{- if .generateTargetRef }}
	verr.AddErrorAt(path.Field("targetRef"), validateTop(r.Spec.GetTargetRef()))
	{{- end }}
	{{- if and .generateTo .generateFrom }}
	if len(r.Spec.GetTo()) == 0 && len(r.Spec.GetFrom()) == 0 {
		verr.AddViolationAt(path, "at least one of 'from', 'to' has to be defined")
	}
	{{- else if .generateTo }}
	if len(r.Spec.GetTo()) == 0 {
		verr.AddErrorAt(path.Field("to"), "needs at least one item")
	}
	{{- else if .generateFrom }}
	if len(r.Spec.GetFrom()) == 0 {
		verr.AddErrorAt(path.Field("from"), "needs at least one item")
	}
	{{- end }}
	{{- if .generateTo }}
	verr.AddErrorAt(path, validateTo(r.Spec.GetTo()))
	{{- end }}
	{{- if .generateFrom }}
	verr.AddErrorAt(path, validateFrom(r.Spec.GetFrom()))
	{{- end }}
	return verr.OrNil()
}

{{- if .generateTargetRef }}
func validateTop(targetRef *common_proto.TargetRef) validators.ValidationError {
	targetRefErr := matcher_validators.ValidateTargetRef(targetRef, &matcher_validators.ValidateTargetRefOpts{
		SupportedKinds: []common_proto.TargetRef_Kind{
			// TODO add supported TargetRef kinds for this policy
		},
	})
	return targetRefErr
}
{{- end }}

{{- if .generateFrom }}
func validateFrom(from []*{{.name}}_From) validators.ValidationError {
	var verr validators.ValidationError
	for idx, fromItem := range from {
		path := validators.RootedAt("from").Index(idx)
		 verr.AddErrorAt(path.Field("targetRef"), matcher_validators.ValidateTargetRef(fromItem.GetTargetRef(), &matcher_validators.ValidateTargetRefOpts{
			 SupportedKinds: []common_proto.TargetRef_Kind{
				 // TODO add supported TargetRef for 'from' item
			 },
		 }))

		 defaultField := path.Field("default")
		 if fromItem.GetDefault() == nil {
			 verr.AddViolationAt(defaultField, "must be defined")
		 } else {
			 verr.AddErrorAt(defaultField, validateDefault(fromItem.Default))
		 }
	}
	return verr
}
{{- end }}

{{- if .generateTo }}
func validateTo(to []*{{.name}}_To) validators.ValidationError {
	var verr validators.ValidationError
	for idx, toItem := range to {
		path := validators.RootedAt("to").Index(idx)
		 verr.AddErrorAt(path.Field("targetRef"), matcher_validators.ValidateTargetRef(toItem.GetTargetRef(), &matcher_validators.ValidateTargetRefOpts{
			 SupportedKinds: []common_proto.TargetRef_Kind{
				 // TODO add supported TargetRef for 'to' item
			 },
		 }))

		 defaultField := path.Field("default")
		 if toItem.GetDefault() == nil {
			 verr.AddViolationAt(defaultField, "must be defined")
		 } else {
			 verr.AddErrorAt(defaultField, validateDefault(toItem.Default))
		 }
	}
	return verr
}
{{- end }}

func validateDefault(conf *{{.name}}_Conf) validators.ValidationError {
	var verr validators.ValidationError
	// TODO add default conf validation
	return verr
}
`))
