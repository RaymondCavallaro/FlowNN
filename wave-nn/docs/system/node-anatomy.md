# Node Anatomy

[Portugues](../pt/system/node-anatomy.md)

This page explains why a node is described with several capabilities:

```text
Node {
  time intake
  meaning intake
  input valves
  activation threshold
  routing behavior
  temporal memory
  emission pattern
}
```

The important point: these are not all separate modules in the current code. They are roles a node can play in the system. Some are implemented directly, some are represented through nearby valves, and some are target concepts for the next versions.

## Minimal Core

The current runtime only needs a small node core:

```text
pressure
threshold
decay
activation
received / pulse
```

Pressure is the current internal accumulation. Threshold decides whether pressure becomes activation. Decay decides how much pressure remains after a step. Activation is the emitted usable pressure for routes leaving the node. `received` and `pulse` are short-lived traces that help output testing and visualization.

Important review tag:

```text
direct handle under review
```

`decay`, threshold adjustment, valve openness, valve weight, and region plasticity are useful implementation handles and test probes. They are not automatically permanent primitives. When possible, future work should try to reproduce their effects through flow, valves, local routing, and recruited support structures.

## Why The Node Has Many Roles

A node sits between input and routing. If it only stored one scalar and immediately forgot it, the network could not express timing, persistence, selectivity, or reusable meaning.

The roles separate different questions:

| Role | Meaning | Current Status | What Changes When Tuned |
| --- | --- | --- | --- |
| Time intake | How incoming pressure arrives over time. | partial | Better temporal intake will let the same total pressure differ by pulse, recurrence, or decay pattern. |
| Meaning intake | Which learned scaffold or source structure reaches the node. | current through topology | Changing scaffold or incoming routes changes what the node can be interpreted as. |
| Input valves | Which routes can feed the node and with what conductance. | current | Opening, closing, adding, or removing valves changes what can activate the node. |
| Activation threshold | How much pressure is enough to activate. | current | Lower threshold makes the node sensitive; higher threshold makes it selective. |
| Routing behavior | Where activation can travel next. | current through outgoing valves | Changing outgoing routes changes what the node contributes to. |
| Temporal memory | How much past pressure remains available. | current as direct decay / traces; review target as drain-flow mechanism | Higher persistence can be tested with decay now, but should later be reproducible with drain routes and valve control. |
| Emission pattern | How activation leaves the node. | current through activation and outgoing valve conductance | Stronger supported routes receive more pressure; weak routes receive less. |

## Current Implementation

`PressureNode` implements:

- `pressure`: accumulated internal pressure;
- `threshold`: derived from a bounded threshold state for adaptive nodes;
- `decay`: current direct handle for how much pressure remains after settling;
- `activation`: pressure made available to outgoing valves;
- `received`: recent incoming pressure;
- `pulse`: strongest recent pulse.

`InputValve` implements most of what people casually call "node connections":

- `from` / `to`;
- `resistance` / `openness`;
- `weight`;
- current `activity`;
- decaying `flowTrace`;
- `recurrence`;
- `usefulness`.

This separation matters. A node does not decide everything alone. Node behavior emerges from node state plus the valves around it.

## Direct Handles Versus Flow Mechanisms

Some code fields exist because they make the current lab small, testable, and inspectable. A direct handle is acceptable when it lets us prove that a behavior is useful. It should be tagged for review when the long-term target is a flow-generated mechanism.

| Current Handle | Why It Exists Now | Flow-First Replacement To Test |
| --- | --- | --- |
| `PressureNode.decay` | Cheap way to test temporal persistence. | Connect the node to a drain structure; regulate forgetting through drain-valve conductance. |
| Valve `openness` / `weight` | Cheap way to test route preference and learning. | Let alternating paths carve route conductance through shared pressure, plasticity, and semaphore-like competition. |
| Region plasticity | Cheap way to protect or loosen whole regions. | Let local modulators change plasticity around active regions, similar to a local resource or hormone-like emitter. |
| Connection creation / removal | Cheap way to test recruitment. | Simulate practical creation/destruction by driving resistance toward available or unavailable extremes. |

The question is not whether direct handles are forbidden. The question is whether each direct handle can later be replaced by a credible mechanism made from flow, valves, nodes, and local modulation.

## How Each Part Is Used

### Activation Threshold

Threshold is the selectivity gate.

```text
pressure >= threshold -> activation
pressure < threshold  -> no hidden activation
```

For output nodes, received pressure is still visible so tests can detect weak output evidence.

Tests:

- `threshold gates node activation`

### Temporal Memory

In the current code, decay controls how much pressure survives each settle step.

```text
next pressure = current pressure * decay
```

High decay means pressure persists. Low decay means pressure fades quickly.

This is a direct implementation probe. A more native mechanism would make forgetting emerge from flow leaving the node:

```text
node pressure -> drain node
drain valve conductance -> effective decay
```

That would let the same valve machinery regulate persistence instead of giving every node a permanent decay knob.

Tests:

- `node decay controls temporal persistence`

### Meaning Intake

Meaning intake is not a payload type. A node receives meaning because structured routes reach it.

Example:

```text
A0 -> ORIGIN_A
A0 -> VALUE_0
```

This lets later explanation read `A0` as origin A and value 0 without putting a semantic label inside the signal.

Tests:

- `semantic scaffold topology exists`
- `scaffold training locks primitive regions`
- `meaning explanations use scaffold primitives`

### Routing Behavior And Emission

When a node activates, outgoing valves distribute pressure according to conductance:

```text
conductance = weight * openness
```

The same node activation can therefore produce different downstream effects depending on route support.

`openness` and `weight` are direct route handles today. The flow-first target is to make route availability emerge from pressure history and competition:

```text
path A active -> carves shared valve conditions
path B later flows through the shaped conditions
path B flow becomes proportional to prior path A flow
```

That requires a semaphore-like mechanism: one path changes local conditions, and another path reads those changed conditions without needing a manually assigned route priority.

Tests:

- `emission follows valve route support`
- `valve openness stays bounded`
- `flood training changes valves`

### Semaphore-Like Routing

A semaphore is a supporting mechanism candidate, not a proven core primitive yet.

Working intuition:

```text
one active path changes local valve/plasticity conditions
another path is gated or scaled by those changed conditions
```

This could support multiplication-like or proportional behavior without directly setting `openness`. It would also let a node belong to overlapping regions, like a Venn diagram, where multiple active contexts modulate the same local routes.

Review target:

```text
prove a small group of nodes can create semaphore behavior
before promoting it into the core system
```

### Time Intake

Time intake is currently implicit. Nodes receive pressure step by step, and decay makes the timing visible.

Future time intake should separate:

- pulse;
- recurrence;
- oscillation;
- decay profile;
- delay.

That would let two inputs with the same total pressure mean different things because their temporal structure differs.

## What To Change When Experimenting

Use small knob tests:

| Change | Expected Effect |
| --- | --- |
| Lower threshold | More activation, more sensitivity, more false positives. |
| Raise threshold | Less activation, more selectivity, more missed weak signals. |
| Raise decay | Longer persistence, easier recurrence, more lingering pressure. |
| Lower decay | Faster forgetting, cleaner short pulses, less temporal carryover. |
| Raise outgoing weight/openness | Stronger contribution to downstream nodes. |
| Lower outgoing weight/openness | Weaker contribution and lower route preference. |
| Add incoming route | New possible cause for activation. |
| Add outgoing route | New possible effect of activation. |

These are test knobs, not final philosophy. When a knob proves useful, add a second test asking whether a small flow mechanism can reproduce the same effect.

## Rule

Do not make every node capability explicit unless a test needs it. Keep the implementation minimal, then add observer scaffolds or internal dynamics only when they explain a measurable change.

When a new direct property is added, document it as:

```text
direct handle under review
```

and name the flow mechanism that might replace it.

## Current Replacement Probe Results

These tests deliberately check whether the flow-first replacements are real yet:

| Probe | Result |
| --- | --- |
| Drain route for decay | Does **not** replace direct decay yet. Current conductance sends pressure forward but does not subtract it from the source node, so a drain can receive flow without draining the source. |
| Budgeted drain flow | Works as an experimental mode. When outgoing flow consumes a source pressure budget, a normal high-capacity outward route can drain the local node without a special drain node type. |
| Resistance extremes for connection availability | Works as a practical connection-availability proxy. Very high resistance behaves like an unavailable route, and very low resistance behaves like an available route. |
| Co-activation carving later flow | Works as a weak semaphore precursor. Co-activation can strengthen a shared route that later flow reads, but it is not full path-to-path gating yet. |

This is the desired development style: let the tests show which replacements already work and which mechanisms still need engine support.

## Related

- [Alignment Map](alignment-map.md)
- [Property Map](properties.md)
- [network.js Notes](../code/network.js.doc.md)
- [Tests](../tests.md)
