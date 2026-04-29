# Core Flow

[Portugues](pt/core-flow.md)

This page separates processing layers from mechanisms.

## Layers

Layers answer: where is the system in the process?

```text
source pressure
  ↓
operation routing
  ↓
local activation
  ↓
learning / recruitment
  ↓
relation reading
  ↓
future temporal refinement
```

Current runtime layers:

- source pressure;
- operation routing;
- output reading;
- local learning;
- recruitment from unresolved pressure.

Future or partial layers:

- raw signal transform;
- time material;
- second-stage temporal meaning;
- autonomous scaffold reconstruction.

## Mechanisms

Mechanisms answer: what does the work?

- `PressureNode`: accumulates pressure and activates past a threshold.
- `InputValve`: controls where pressure can flow.
- resistance and weight: shape conductance.
- regional plasticity: scales how much an area can change.
- recruitment: adds weak structure under repeated ambiguity.
- scaffold relations: provide explicit, inspectable concept context.

## Main Loop

```text
inject source pressure
-> settle activations
-> route pressure through valves
-> compare output behavior
-> adapt valves / region plasticity
-> recruit if unresolved pressure repeats
```

## Design Constraint

Do not hide meaning inside the signal payload.

```text
bad: pressure carries "A0" or "OUT1" as a type
good: pressure enters through A0 and behaves through the graph
```

This keeps the experiment focused on structural identity and local pressure dynamics.

## Related

- [Glossary](glossary.md)
- [Learning Dynamics](concepts/learning-dynamics.md)
- [Topology](concepts/topology.md)
- [Unified Field Math](concepts/field-math.md)
