# Temporal Computation

[Portugues](../pt/concepts/temporal-computation.md)

This page collects the temporal concepts from the numbered notes into a compact design entry. They are not current runtime features yet. They are constraints for the next stage after the pressure network can recruit, stabilize, and inspect simple structure.

## Time Material Layer

Raw input should not become meaning directly.

```text
raw signal -> transform -> time material -> meaning
```

The transform extracts pre-semantic temporal structure:

- frequency;
- decay;
- recurrence;
- oscillation;
- delay.

This layer produces material that can later become meaningful. It does not decide the meaning by itself.

## Two-Stage Meaning

Meaning can form twice:

```text
time structure -> meaning_1 -> temporal routing -> meaning_2
```

`meaning_1` is the immediate interpretation of a temporal pattern. `meaning_2` is the interpretation of how that meaning behaves over time.

Example:

```text
pulse          -> event
repeated pulse -> recurring event
```

The second meaning is not a label attached to the first. It is a new invariant extracted from routed behavior.

## Routing As Computation

Routing should eventually do more than transport pressure.

Repeated paths, delayed arrivals, path stability, and route competition can act as implicit detectors. In that framing:

```text
meaning + routing behavior -> higher-order meaning
```

Logic should be treated as a special case of flow behavior:

- `AND`: compatible co-flow through the same boundary;
- `OR`: multiple routes can satisfy the same target;
- `NOT`: absence, inhibition, or alternate-route selection;
- `XOR`: cross-routing where one of two incompatible pairings wins.

The current truth-table lab still uses tiny named operations as a measuring stick. The longer-term target is for these behaviors to be read from flow and topology rather than inserted as explicit gates.

## Structural Signal Identity

The current mainline keeps pressure scalar:

```text
signal payload = strength
identity       = source + topology + route behavior
```

So the useful version of "signals must be distinct" is not to add runtime signal types back into the payload. It is to make different sources and routed histories structurally distinguishable.

Bad direction for this project:

```text
0 = weak pressure
1 = strong pressure
```

Better direction:

```text
0-like behavior = pressure entering through value-0 sources and reusable value-0 structures
1-like behavior = pressure entering through value-1 sources and reusable value-1 structures
```

This preserves conditional behavior without reintroducing explicit semantic tags.

## Valves As Primitive Operators

Valves are not only transport parts. They are the current primitive operator.

A valve defines:

- what source can affect what target;
- how much conductance is available;
- which region controls its plasticity;
- whether repeated co-activation should make the route easier.

Selective `AND` behavior emerges when a target only activates under compatible co-flow. The valve does not need to know that it is computing `AND`; it only shapes the conditions under which pressure can meet.

## Flow-Based Learning

The current learning rule already points in this direction:

```text
repeated co-flow -> lower resistance / higher weight
```

Unused, misleading, or non-activating routes can become less preferred through resistance, lower relative conductance, or later pruning.

This keeps learning local:

- no route receives global backprop-style credit;
- no controller needs to know the correct hidden path;
- useful structure is the accumulated result of repeated pressure meetings.

## Node Capacity Model

A node should be understood as a context-dependent capacity bundle, not a permanently single-purpose part.

Possible capacities:

- time intake;
- meaning intake;
- routing;
- short memory;
- emission;
- local error / expectation comparison.

Not all capacities must be active at once. The long-term role of a node should be inferred from repeated function:

```text
entry-like
routing-like
holding-like
meaning-like
output-like
```

This matches the unified field model: roles are stabilized flow functions, not first primitives.
