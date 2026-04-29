# Pressure Network

[Portugues](../pt/concepts/pressure-network.md)

The pressure network treats meaning as structure rather than as a field carried by each signal.

A signal carries only strength. The identity of a signal comes from where it enters the graph and what local structures it can activate.

## Parts

- `PressureNode`: accumulates pressure, activates after a threshold, then decays.
- `InputValve`: connects one node to another with resistance and weight.
- output nodes behave like prediction endpoints during testing and teacher pressure sources during flood training.

There is no runtime `Signal` object in the current model. Source nodes inject pressure directly, and the pressure payload does not carry semantic type.

## Current Rule

The project currently avoids:

- explicit signal type;
- accepted signal type;
- dedicated route history;
- backprop-style route credit.

The hypothesis is that useful pathways should emerge from repeated local pressure meetings.
