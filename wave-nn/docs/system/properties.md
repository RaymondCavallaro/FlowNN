# Property Map

[Portugues](../pt/system/properties.md)

This page separates properties by role:

- **implementation choice**: useful for the current prototype, but replaceable;
- **direct handle under review**: useful as a test knob now, but should be challenged by a flow-based replacement;
- **native target**: should become a direct part of the system mechanics;
- **emergent target**: should arise from interaction, not be hand-coded as a module.

Status means:

- **achieved**: present and tested or documented as current behavior;
- **partial**: present, but limited or still externally controlled;
- **target**: desired but not yet implemented.

| Property | Status | Role | Notes |
| --- | --- | --- | --- |
| Truth-table lab | achieved | implementation choice | XOR/AND/OR/NAND are measuring sticks, not the final domain. |
| Scalar pressure payload | achieved | native target | Signals should not carry semantic labels. |
| Structural source identity | achieved | native target | Identity comes from entry point, topology, and routed behavior. |
| Node temporal persistence | achieved | direct handle under review | Direct decay proves the effect; a drain-flow mechanism should test whether persistence can emerge through valves. |
| Conductance-shaped emission | achieved | direct handle under review | Direct openness/weight proves route support; semaphore-like flow competition should test whether proportional routing can emerge. |
| Local valve learning | achieved | native target | Learning appears as changed conductance, resistance, and route preference. |
| Input-only testing boundary | achieved | implementation choice | Useful safety boundary for the current supervised lab. |
| No output reverse valves | achieved | implementation choice | Current simplification after the reverse-flood lesson. |
| Explicit set/property scaffold | achieved | implementation choice | A control layer used to expose the mechanism before autonomy. |
| Generated scaffold from description | achieved | bridge to native target | Shows that scaffold function can be reconstructed through shared interfaces. |
| Relation-based generation | partial | emergent target | Current version generates constrained source candidates from learned relations. |
| Separator recruitment | partial | emergent target | Currently supported by explicit strategy machinery; should become more self-directed. |
| Recruitment strategy tuning | partial | direct handle under review | Axis gradients are useful scaffolds; later they should be recruited and tuned by internal pressure dynamics. |
| Meta-regulation | partial | native target | Observational now; should eventually regulate plasticity, thresholds, valves, and time windows. |
| Adaptive pressure balance | target | native target | Capacity and constraint should be regulated together. |
| Route dynamics observability | achieved | bridge to native target | External readers infer route availability from support, flow, trace, recurrence, and usefulness. |
| Path distribution tracking | partial | native target | Preserve awareness of viable alternatives through route dynamics without keeping every route active. |
| Partial reversibility / trace memory | target | native target | Trace outcomes back to contributing routes for explanation and refinement. |
| Hard constraints over flow | target | native target | Prevent invalid states while keeping pressure dynamics inspectable. |
| Field bias | target | native target | Add global directional pressure without replacing local routing. |
| Controlled routing noise | target | native target | Use structured exploration that can decay or slow its decay. |
| Option awareness | target | emergent target | The system should know which alternatives were possible before selection while allocating active resources selectively. |
| Selective persistence | target | emergent target | Availability should emerge from conductance, decay, recurrence, trace residue, and usefulness. |
| Semaphore-like gating | target | native target | One active path should be able to shape local flow conditions read by another path. |
| Flow-based decay / drains | partial | native target | Experimental budgeted flow shows ordinary high-capacity outward routes can drain source pressure. |
| Local plasticity modulation | target | native target | Plasticity should eventually come from local modulators instead of global region knobs. |
| Time material layer | target | native target | Raw temporal structure should become pre-semantic material. |
| Second-stage temporal meaning | target | emergent target | Meaning should refine through routed temporal behavior. |
| Structural self/value dynamics | target | emergent target | Values should arise after continuity, option-space, and consequence attribution. |
| Unified field math | partial | native target | The model is first-class in docs; implementation can later compress into sparse field form. |

## Rule

Do not promote an implementation choice into a principle. Do not hard-code an emergent target as a shortcut unless it is clearly marked as scaffold.
