# Walkthrough

[Portugues](pt/walkthrough.md)

This page walks through one simple case from pressure to meaning.

The current runtime uses bitwise source nodes rather than raw sensory pulses, so this walkthrough uses the current lab:

```text
input case: A0 + B1
expected output during training: OUT1
```

## 1. Source Pressure

The input does not carry a semantic payload.

```text
A0 injects pressure
B1 injects pressure
```

The signal itself is only strength. Identity comes from the source nodes and the available routes.

## 2. Routing

Pressure moves through open operation valves.

```text
A0 -> candidate routes
B1 -> candidate routes
```

Each source has limited outgoing pressure, so pressure is divided across available conductance instead of copied into every route.

## 3. Local Meeting

If pressure from the case repeatedly meets in a useful place, the involved routes can become easier to use.

```text
repeated co-activation
-> lower resistance
-> higher route weight
```

This is local learning. The system does not receive a hidden path answer.

## 4. Teacher Boundary

During training, the expected output can also be active:

```text
A0 + B1 + OUT1
```

That lets input pressure arriving at `OUT1` meet teacher pressure locally. The current topology does not create output-to-hidden reverse valves.

## 5. Unresolved Pressure

If the case remains ambiguous, the system records the unresolved signature:

```text
A0 + B1 remains low-margin
-> signature "01" gains evidence
```

Repeated unresolved evidence can recruit a weak separator.

## 6. Recruitment

The recruited separator is not a symbolic label. It is an experimental structure that may help separate a repeated pressure case.

```text
unresolved signature
-> recruitment strategy
-> weak separator node
-> survival or fading
```

The recruitment strategy can use explicit set/property scaffold context when it is available, but the scaffold is still an inspectable control layer.

## 7. Meaning

Meaning is read from stable structure:

```text
which sources support a route
which output stabilizes
which scaffold concepts explain the source pair
which relation remains invariant
```

So the meaning of `A0 + B1 -> OUT1` is not stored inside the pressure. It is reconstructed from source identity, route behavior, scaffold relations, and output response.

## Related

- [Core Flow](core-flow.md)
- [Pressure Network](concepts/pressure-network.md)
- [Relational Meaning](concepts/relational-meaning.md)
- [Temporal Computation](concepts/temporal-computation.md)
