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
| Temporal memory | How much past pressure remains available. | current as decay / traces | Higher decay preserves pressure longer; lower decay makes the node forget quickly. |
| Emission pattern | How activation leaves the node. | current through activation and outgoing valve conductance | Stronger supported routes receive more pressure; weak routes receive less. |

## Current Implementation

`PressureNode` implements:

- `pressure`: accumulated internal pressure;
- `threshold`: derived from a bounded threshold state for adaptive nodes;
- `decay`: how much pressure remains after settling;
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

Decay controls how much pressure survives each settle step.

```text
next pressure = current pressure * decay
```

High decay means pressure persists. Low decay means pressure fades quickly.

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

Tests:

- `emission follows valve route support`
- `valve openness stays bounded`
- `flood training changes valves`

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

## Rule

Do not make every node capability explicit unless a test needs it. Keep the implementation minimal, then add observer scaffolds or internal dynamics only when they explain a measurable change.

## Related

- [Alignment Map](alignment-map.md)
- [Property Map](properties.md)
- [network.js Notes](../code/network.js.doc.md)
- [Tests](../tests.md)
