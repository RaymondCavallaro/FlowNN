# Information Landscape

Information landscape is the observer-side map of uncertainty, fit, and transfer behavior.

It should not be treated as a full loss landscape. The practical object is a proxy built from local network behavior:

```text
state of belief
-> uncertainty
-> prediction error
-> calibration / margin
-> transfer under perturbation
```

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
- useful uncertainty reduction
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

## Good Certainty

Low entropy alone is not enough.

Bad certainty:

```text
high confidence + wrong output
```

Good certainty:

```text
high margin
+ correct settling
+ low drift
+ survives perturbation
```

The next version should use this distinction when deciding whether a recruited structure is stable.

## Active Probing

Landscape probing means choosing the next test from the current uncertainty:

```text
uncertainty -> probe design -> new evidence -> belief update
```

In the bitwise lab, probes can be simple:

- repeat the most ambiguous row;
- perturb training strength or duration;
- test rows in a different order;
- withhold one row and see whether structure transfers;
- compare direct routes against recruited routes.

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

This belongs in evaluation and later transfer experiments. It should not pull modular arithmetic work back into `main`; arithmetic remains on `v0.0.4`.
