// Code generated by protoc-gen-deepcopy. DO NOT EDIT.

package v1alpha1

import (
	proto "google.golang.org/protobuf/proto"
)

// DeepCopyInto supports using MeshAccessLog within kubernetes types, where deepcopy-gen is used.
func (in *MeshAccessLog) DeepCopyInto(out *MeshAccessLog) {
	p := proto.Clone(in).(*MeshAccessLog)
	*out = *p
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MeshAccessLog. Required by controller-gen.
func (in *MeshAccessLog) DeepCopy() *MeshAccessLog {
	if in == nil {
		return nil
	}
	out := new(MeshAccessLog)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInterface is an autogenerated deepcopy function, copying the receiver, creating a new MeshAccessLog. Required by controller-gen.
func (in *MeshAccessLog) DeepCopyInterface() interface{} {
	return in.DeepCopy()
}
