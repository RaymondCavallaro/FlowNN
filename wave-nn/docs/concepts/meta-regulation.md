# Meta-Regulation

[Portugues](../pt/concepts/meta-regulation.md)

Meta-regulation is the layer that decides how changeable the network should be.

It does not solve the task directly. It regulates learning conditions:

```text
plasticity
resistance adjustment
gain / attention
memory consolidation
exploration level
constraint hardness
time-window length
```

## Core Framing

Intelligence should not choose one side of every tension. It should stay coherent while operating between opposing forces:

```text
preserve <-> change
constraint <-> freedom
certainty <-> doubt
exploration <-> exploitation
stability <-> plasticity
consistency <-> contextuality
```

These are not binary switches. They are continuous control axes that shape behavior space.

## Current Scaffold

The current implementation exposes an observational `metaRegulationState`.

It reads:

- cycle accuracy;
- ambiguity;
- low output margin;
- unresolved recruitment pressure;
- candidate and stable recruited nodes.

It reports axes such as:

```text
stabilityPlasticity
explorationExploitation
certaintyDoubt
constraintFreedom
```

and suggested controls:

```text
plasticity: raise | hold | lower
valveMode: seeking | neutral | certainty
thresholdMode: seeking | neutral | certainty
timeWindow: normal | extend
```

This is still a scaffold. It describes how the system should regulate itself, but it does not yet automatically drive training controls.

## Protected Zones

The system should not freely rewrite itself everywhere.

Useful zones:

```text
stable identity / core values = low plasticity
active learning areas = medium plasticity
unknown / problem areas = high plasticity
```

For the current pressure lab, that maps to:

```text
origin/value scaffold -> protected primitive regions
operation region      -> adaptable task dynamics
recruited candidates  -> exploratory high-change structures
```

## Rule Shape

The intended local rules are simple:

```text
if error is high and confidence is low:
    increase plasticity locally

if pattern is repeated and useful:
    consolidate memory
    reduce plasticity

if conflict touches protected structure:
    slow down change
    require more evidence

if environment is novel:
    widen exploration

if action risk is high:
    harden constraints
```

The important distinction:

```text
action layer          = what should happen?
meta-regulation layer = how much should the system allow itself to change?
```

## Later Direction

The deeper version is `meta-valves`: valves that do not route content directly, but regulate how other valves learn, open, close, stabilize, or forget.

That should come after the observational state is useful enough to compare against actual learning behavior.
