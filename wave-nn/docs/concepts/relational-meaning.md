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
