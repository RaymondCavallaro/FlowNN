# Relational Meaning

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
