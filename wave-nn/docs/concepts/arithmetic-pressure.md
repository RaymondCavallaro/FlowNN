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

Current implementation:

```text
aPressure = converter.toPressure(a)
bPressure = converter.toPressure(b)
outputPressure = aPressure + bPressure
readValue = converter.fromPressure(outputPressure)
```

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

Current implementation:

```text
aPressure = converter.toPressure(a)
bPressure = converter.toPressure(b)
conductance = converter.fromPressure(bPressure)
outputPressure = aPressure * conductance
readValue = converter.fromPressure(outputPressure)
```

This is explicit and intentionally simple. It gives us a target behavior before asking whether the pressure network can learn a converter or a pressure-gated valve internally.

## Chamber Multiplication

The chamber variant is closer to the pressure-network intuition.

```text
B pressure -> chamber pressure
chamber pressure -> route readiness
A pressure -> flows through prepared route
```

The passage has two parts:

```text
short-term readiness = chamber_pressure / (chamber_pressure + threshold)
long-term passage = plastic path carved by repeated A/B co-activation
```

The output is:

```text
outputPressure = A_pressure * readiness * passage
```

This is still a designed experiment, but the control is less direct than the explicit multiplication gate. `B` does not set the conductance variable directly. It fills a chamber, the chamber prepares the medium, and `A` flows through whatever readiness and passage exist.

## Why This Belongs Here

This extends meaning-first pressure routing toward numeric operations without abandoning the concept:

- values can be represented as pressure strengths;
- operations can be represented as pressure transformations;
- learned relations can later explain what transformation occurred.

The first implementation can use explicit converters and gates. A later experiment can ask whether the same network can learn or emulate those converters and gates internally.
