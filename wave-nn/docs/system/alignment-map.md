# Alignment Map

[Portugues](../pt/system/alignment-map.md)

This page connects the active system across four layers:

```text
principles -> properties -> mechanisms -> implementation
```

Use it as the project filter. If an idea cannot be placed on this map, it belongs in supporting notes, lessons, or the idea pool, not in the active core.

## Doc Tiers

### Minimal / Core

Read these to understand the active system:

- [Overview](../overview.md)
- [Core Flow](../core-flow.md)
- [Current System](current-system.md)
- [Principles](../principles/index.md)
- [Property Map](properties.md)
- [Node Anatomy](node-anatomy.md)
- [Math Model](../math/index.md)

### Supporting Docs

Use these when examining behavior or code:

- [Features](../features.md)
- [Tests](../tests.md)
- [Manual Testing](../manual-testing.md)
- [network.js Notes](../code/network.js.doc.md)
- [Borrowed Primitives](borrowed-primitives.md)

### Other / Context

These are useful, but should not define the active system by themselves:

- concept expansions in `docs/concepts`;
- lessons from failed or removed mechanisms;
- project history;
- external inspiration notes.

## Active Alignment

| Principle | Property | Mechanism | Implementation |
| --- | --- | --- | --- |
| Meaning as behavior | Structural source identity | source entry point + topology | source nodes `A0`, `A1`, `B0`, `B1`; no signal type payload |
| Process over state | Temporal persistence | pressure decay and trace residue | `PressureNode.decay`, `InputValve.flowTrace` |
| Constraint-driven intelligence | Selective allocation | thresholding and route conductance | node thresholds, valve openness, valve weight |
| Learning as behavioral change | Local valve learning | co-activation changes conductance | `learnValve`, `adjustOpenness`, valve weight updates |
| Option awareness before selection | Route availability without bucket labels | route dynamics reader | `readRouteDynamics`, `inferRouteAvailability` |
| Traceability | Relation explanation | read stable support paths and invariants | `readOutputRelation`, `explainOutput`, `generateForOutput` |
| Separation of theory and implementation | Explicit scaffold as temporary aid | manual/generated set scaffold | `injectSetScaffold`, `generateSetScaffold` |
| Coherence over time | Regional consolidation | plasticity changes after cycles | `updateOperationPlasticityFromCycle`, region plasticity |
| Emergent logic | Relation-based generation | invariants across support paths | `invariantsFromPaths`, `relationFromSources` |

## Kill Rule

An idea stays in the active system only if it clearly supports a principle, reinforces a property, and can be expressed through a mechanism or test.

If not, do one of these:

- move it to a supporting doc;
- archive it as a lesson or history note;
- keep it as an idea-pool note outside the active docs.

## Current Development Line

The next implementation work should stay on this narrow line:

```text
route dynamics observability
-> inferred route availability
-> route-supported generation
-> traceable explanation
-> later internalization of the scaffold
```

External readers are allowed as scaffolds. They should be designed so useful readings can later become internal dynamics.

## Related

- [Principles](../principles/index.md)
- [Property Map](properties.md)
- [Node Anatomy](node-anatomy.md)
- [Features](../features.md)
