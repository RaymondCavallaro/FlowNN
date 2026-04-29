# Relational Meaning

[Portugues](../pt/concepts/relational-meaning.md)

The current scaffold work lets the system explain nodes through known primitive meanings. The next step is to make meaning relational.

## Core Definition

Meaning is not only stored in nodes.

```text
meaning = invariant structure across variations that lead to the same outcome
```

For relations:

```text
relation = invariant across stable paths under variation
```

So a direct reading from layer `1 -> 3` is not just a shortcut over layer `2`. It is a compressed explanatory relation that summarizes what stays true across the stable `1 -> 2 -> 3` paths.

## Example

For XOR, the positive output can be reached through:

```text
A0 + B1 -> H1 -> OUT1
A1 + B0 -> H2 -> OUT1
```

The concrete inputs and pair nodes vary.

The invariant is:

```text
cross-origin + mixed-value -> VALUE_1
```

That invariant is the relational meaning.

## Relation Candidate

The relation object should stay compact:

```text
Relation {
  sourceSet
  targetSet
  pathSet
  strength
  invariants
  role
}
```

The `pathSet` is evidence, not the meaning itself. The meaning is the invariant extracted from the path set.

## Current Reader

The current implementation reads operation relations from the learned hidden-to-output valves:

```text
pair nodes -> output node -> value meaning
```

For each output, it selects the strongest supporting pair paths and extracts invariants from their scaffold meanings.

Examples:

```text
XOR OUT1:
  H1 = A0 + B1
  H2 = A1 + B0
  invariant = mixed-value

AND OUT1:
  H3 = A1 + B1
  invariant = all-value-1

OR OUT1:
  H1, H2, H3
  invariant = at-least-one-value-1

NAND OUT1:
  H0, H1, H2
  invariant = not-all-value-1
```

This is still a reader, not a new learning rule. It asks whether the learned routes can be explained through the scaffold meanings already inside the system.

## First Generative Use

The next small step is to use the relation reader backward:

```text
target output
-> learned relation invariant
-> candidate source sets
```

In the current bitwise lab, this means an output relation can propose source pairs. For example, if `OUT1` has the invariant:

```text
cross-origin + mixed-value -> VALUE_1
```

then the generative read can propose:

```text
A0 + B1
A1 + B0
```

This is not open-ended generation yet. It is a constrained reconstruction step: the system enumerates the current source-pair space and keeps candidates whose scaffold relation satisfies the learned invariant. The purpose is to make the bridge visible:

```text
relation as explanation -> relation as generator
```

Later generative work should reduce dependence on enumerating known source pairs by letting recruited concept nodes, active probing, and transfer reuse propose candidates.

## Stability Rule

Do not store every possible path as a relation.

Only keep relation candidates that are:

- stable over repeated tests;
- repeated across more than one path or case;
- strong enough to affect output behavior;
- not contradicted by nearby competing paths.

Ambiguity means the invariant is weak, under-exposed, or conflicting with another invariant.

## Set And Property Intuition

The current broad recruitment experiment exposes a missing foundation: before the system can choose good recruitment strategies, it needs primitive set/property intuition.

This does not need to start as formal set theory. It needs operational distinctions such as:

```text
input axis
input option
membership
mutual exclusion
co-holding
shared property
generalization
specialization
```

In the current bitwise lab:

```text
A0 and A1 belong to input axis A
B0 and B1 belong to input axis B
A0 and A1 are mutually exclusive options
A0 and B1 can co-hold in one case
A0 and B0 share VALUE_0
A1 and B1 share VALUE_1
```

Those distinctions matter because recruitment should not treat every co-visible node as the same kind of neighbor. A valid case context, an alternative option, a shared property, and an output role require different strategies.

## Explicit Injectable Set Scaffold

The current implementation is allowed to cheat deliberately by injecting set/property concepts as an explicit scaffold.

Manual injection adds inspectable relations such as:

```text
A0 member-of AXIS_A
A1 member-of AXIS_A
A0 excludes A1 within AXIS_A
A0 can-co-present-with B1
A0 shares PROP_VALUE_0 with B0
```

This is not treated as discovered knowledge. Each injected concept and relation is marked with `source = manual`.

The point is to make the control mechanism clear before giving it back to the system:

```text
manual set scaffold
-> inspectable concept/relation shape
-> compare with learned traces
-> later auto-recruit the same concept types
```

The future automatic mode should use unresolved pressure, repeated co-presence, mutual exclusion, and stable shared properties to recruit equivalent set concepts dynamically.

## Functional Scaffold Reconstruction

The next step is to stop treating the scaffold as only a list of facts.

The system now also carries a functional description:

```text
source pattern = axis + value
needed concepts = axis, option, shared property
needed relations = membership, option, exclusion, co-presence, shared property, generalization
plug points = source explanations, recruitment strategy space, scaffold-use axis
```

From that description, the generator can read the current source nodes and recreate the same set/property scaffold:

```text
sources -> infer axes and values -> build concepts -> build relations -> inject generated scaffold
```

The generated scaffold is marked with `source = generated`. It must plug back into the same places as the manual scaffold:

```text
explainSource(...).setConcepts
recruitmentStrategyCandidates(...)
recruitmentAxisDemand(...).scaffoldUse
```

This is still not full autonomous discovery. It is functional self-reconstruction: the system can create the needed scaffold shape from a description of what the scaffold must do, then keep operating through the same interfaces.

## Experimental Recruitment Policy

The set scaffold should not permanently dictate where a recruited node connects. It should supply context that the recruitment system can use while it experiments with strategies.

The current strategy space still has readable named profiles:

```text
active-case-context
expected-output-context
set-scaffold-context
broad-operation-area
```

But these names are not the whole policy. Each profile is a point in a small axis space:

```text
sourceFocus
outputFocus
scopeBreadth
scaffoldUse
teacherFeedback
```

For each unresolved case, a secondary tuner computes case-dependent axis demand from repeated evidence, unresolved pressure, low margin, and whether explicit set concepts are available. Strategy selection compares:

```text
case axis demand
learned axis weights
strategy profile
strategy survival score
```

When the set scaffold is injected, `set-scaffold-context` becomes available as one candidate strategy. It can connect a separator to:

```text
active source options -> separator
separator -> expected output
expected output -> separator as training-only teacher route
```

For example, unresolved `A0 + B1 -> OUT1` can recruit a separator connected to:

```text
A0
B1
OUT1
```

The system tracks both strategy scores and axis weights. Later survival feedback changes the score and nudges the axes used by the strategy that created the recruit:

```text
recruit survives -> strategy score rises, useful axes strengthen
recruit fades    -> strategy score falls, those axes weaken
```

Co-presence remains evidence for later concept recruitment; it should not automatically make every case separator broad again.

## Set Coherence Before CSP

Set intuition should come before CSP-like constraint solving.

The useful order is:

```text
signal grouping
-> object / category sets
-> relation sets
-> self/world boundary sets
-> option sets
-> constraint sets
-> CSP-like solving
```

Early cognition should not begin by solving constraints formally. It should first stabilize possible worlds:

```text
what belongs together
what excludes what
what overlaps
what can coexist
what cannot coexist
```

Example sets:

```text
Self-set       = things belonging to me
World-set      = things outside me
Action-set     = things I can do
Forbidden-set  = things that break coherence
Possible-set   = options still available
```

This gives a three-step direction:

```text
set formation = soft coherence
constraint formation = conflict detection
CSP solving = later structured resolution
```

Coherence comes before goal maximization. The system should first learn that a state cannot be both `me` and `not-me`, an option can be possible while violating another set, and a memory can conflict with current perception. Only later should it ask which coherent option best satisfies values.

## Invariant By Exclusion

To arrive at an invariant that correctly points to a new concept, the system should not accept the first shared pattern it sees.

It should compare the candidate against similar concepts it already has:

```text
candidate paths
-> extract shared properties
-> test against known similar concepts
-> discard explanations already covered
-> keep the remaining stable invariant
-> propose a new concept only if one explanation remains
```

Example:

```text
A0 + B1 -> OUT1
A1 + B0 -> OUT1
```

Possible explanations might include:

- both are valid input cases;
- both contain one option from A and one option from B;
- both mix `VALUE_0` and `VALUE_1`;
- both activate `OUT1`.

The first two are too general if the system already knows input-axis membership. `OUT1` is a role, not the source-side concept. After those are discarded, the remaining explanatory invariant is closer to:

```text
mixed-value across different input axes
```

That is the kind of invariant that can become a new concept. The important part is not just finding similarity, but subtracting known similarities until the leftover explanation is specific enough.

## Noether-Style Analogy

The useful analogy is:

```text
variation -> invariant -> meaning
```

In physics, exact symmetry can imply conserved structure. Here, repeated pressure flow and reinforcement can reveal statistical invariants. The analogy is helpful, but the system is discovering learned invariants, not enforcing physical laws.

## Why This Matters

Relational meaning is the bridge to reuse:

```text
if the same invariant appears in two places,
the system may be seeing the same concept at different depths.
```

That gives future pattern matching something meaningful to compare.
