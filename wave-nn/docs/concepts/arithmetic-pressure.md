# Arithmetic Pressure

Arithmetic can be explored as pressure behavior before trying to make it fully emergent.

## Addition

Addition is the simpler first intuition:

```text
input values -> pressure strengths
combined pressure -> output reading
```

For a first prototype, explicit signal-to-pressure converters are acceptable. They translate a value into injected pressure.

Later, those converters should become a target for the network itself:

```text
symbol/value input -> learned pressure converter -> pressure arithmetic
```

The experiment asks whether a combined pressure field can preserve enough magnitude information to be read as an arithmetic sum.

## Multiplication

Multiplication needs a different mechanism.

One useful intuition:

```text
input A pressure -> signal being routed
input B pressure -> tunes valve conductance
output pressure -> A scaled by B
```

So multiplication looks like pressure-gated conductance:

```text
flow = input_pressure * valve_conductance(other_input_pressure)
```

This is not a normal fixed valve anymore. It is a valve whose openness is temporarily modulated by another pressure source.

## Why This Belongs Here

This extends meaning-first pressure routing toward numeric operations without abandoning the concept:

- values can be represented as pressure strengths;
- operations can be represented as pressure transformations;
- learned relations can later explain what transformation occurred.

The first implementation can use explicit converters and gates. A later experiment can ask whether the same network can learn or emulate those converters and gates internally.
