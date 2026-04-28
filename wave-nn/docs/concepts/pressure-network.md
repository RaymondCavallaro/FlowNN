# Pressure Network

[Portugues](../pt/concepts/pressure-network.md)

The pressure network treats meaning as structure rather than as a field carried by each signal.

A signal carries only strength. The identity of a signal comes from where it enters the graph and what local structures it can activate.

## Parts

- `Signal`: pressure strength only.
- `PressureNode`: accumulates pressure, activates after a threshold, then decays.
- `InputValve`: connects one node to another with resistance and weight.
- `OutputNode`: behaves like a prediction endpoint during testing and a teacher pressure source during flood training.

## Current Rule

The project currently avoids:

- explicit signal type;
- accepted signal type;
- dedicated route history;
- backprop-style route credit.

The hypothesis is that useful pathways should emerge from repeated local pressure meetings.
