# Overview

[Portugues](pt/overview.md)

FlowNN is a small experiment in meaning-first computation.

The system asks whether useful behavior can emerge from pressure, thresholds, local routing, and adaptation instead of explicit signal labels, symbolic rules, or backprop-style route credit.

## Mental Model

```text
source pressure
-> routed through valves
-> accumulated by nodes
-> stabilized into reusable meaning
```

The core idea:

```text
meaning is not carried inside the signal;
meaning is shaped by where pressure enters, where it can flow, and what patterns stabilize.
```

## What This Is

- A pressure-routing model.
- A tiny truth-table lab for testing learning dynamics.
- A place to inspect how structure, routing, and meaning can be recruited.
- A stepping stone toward temporal and generative behavior.

## What This Is Not

- Not a normal neural network: there is no hidden vector trained by backprop.
- Not symbolic logic: XOR, AND, OR, and NAND are test tasks, not built-in gates.
- Not a mature general intelligence architecture.
- Not a claim that the current prototype already solves open-ended generation.

## Current Prototype

The current app starts with source nodes, output nodes, and weak direct operation valves. When repeated cases remain ambiguous, it can recruit weak separator nodes and test whether those recruited structures survive.

The prototype also has explicit scaffolds for set/property meaning, relational reading, meta-regulation signals, and temporal-computation notes. Some are current mechanisms; others are documented future constraints.

## Reading Order

1. [Walkthrough](walkthrough.md)
2. [Core Flow](core-flow.md)
3. [Glossary](glossary.md)
4. [Pressure Network](concepts/pressure-network.md)
5. [Unified Field Math](concepts/field-math.md)
6. [Temporal Computation](concepts/temporal-computation.md)

After that, use the concept pages as deeper references.
