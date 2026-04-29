# Information Landscape

[Portugues](../pt/concepts/information-landscape.md)

Information landscape is the observer-side map of possible beliefs, uncertainty, fit, and transfer behavior.

It should not be treated as a full loss landscape or as a literal complete map of the system. The practical object is a proxy built from local network behavior:

```text
state of belief
-> uncertainty
-> prediction error
-> calibration / margin
-> transfer under perturbation
```

The purpose is to ask which interpretation the current network state supports, where it is uncertain, and what probe would reveal the most about the next useful structure.

## Core Framing

The current pressure network already has local signals that can become information-landscape measurements:

- output margin;
- ambiguity;
- unresolved pressure;
- recruitment survival;
- drift across cycles;
- stability under repeated testing.

These are not semantic labels. They are observer-side measures of how well the network has settled.

## Free-Energy Proxy

The active-inference direction is useful as an analogy and as a scoring pattern:

```text
free-energy proxy =
  prediction error
+ complexity / fragmentation
+ uncertainty cost
```

Useful uncertainty reduction can be tracked as a separate benefit:

```text
probe_value =
  uncertainty_before
- uncertainty_after
- probe_cost
```

For this project, that can become:

```text
F =
  wrong_or_ambiguous_output
+ low_margin
+ too_many_active_candidates
+ repeated_drift
- stable_transfer
```

This is not thermodynamic free energy. It is a compact score for deciding whether the network has a stable enough explanation or needs more probing/recruitment.

## Precision And Certainty

Precision is not just confidence. It is the local weight given to a signal or error:

```text
precision = how much this node/route should trust this pressure or mismatch
```

Certainty should mean calibrated confidence that survives perturbation:

```text
certainty =
  high margin
+ correct settling
+ low drift
+ stable response under perturbation
```

Low entropy alone is not enough.

Bad certainty:

```text
high confidence + wrong output
```

The next version should use this distinction when deciding whether a recruited structure is stable.

## Active Probing

Landscape probing means choosing the next test from the current uncertainty:

```text
uncertainty -> probe design -> new evidence -> belief update
```

A concrete protocol:

```text
observe uncertainty
-> choose probe
-> perturb input, state, route, or schedule
-> measure response
-> classify regime
-> update the map
```

In the bitwise lab, probes can be simple:

- repeat the most ambiguous row;
- perturb training strength or duration;
- test rows in a different order;
- withhold one row and see whether structure transfers;
- compare direct routes against recruited routes.

Later, curiosity can regulate probing by lowering resistance to unexplored paths only when uncertainty and potential impact are both high. See [Self, Values, And Curiosity](self-values-and-curiosity.md).

Useful regimes:

- confused basin: low margin, high drift, no stable explanation;
- memorization basin: correct known rows, weak transfer;
- rule basin: stable behavior under row order changes and withheld tests;
- overcompressed basin: high confidence that fails under perturbation.

## Grokking Connection

Grokking is useful here as a warning:

```text
memorization can look solved before rule-like structure appears
```

For this project, the equivalent distinction is:

```text
case-specific separator lookup
vs.
reusable concept / relation basin
```

The useful vocabulary for later experiments is:

```text
memorization basin
-> complexity pressure / noise / temperature
-> slow drift
-> phase transition
-> rule basin
```

This belongs in evaluation and later transfer experiments. It should not pull modular arithmetic work back into `main`; arithmetic can stay parked on its own branch while the convergence line studies the general dynamic.
