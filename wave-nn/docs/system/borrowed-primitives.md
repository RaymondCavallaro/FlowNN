# Borrowed Primitives

[Portugues](../pt/system/borrowed-primitives.md)

This page records useful primitives from neighboring systems without redefining FlowNN as one of those systems.

The rule:

```text
borrow primitives, not identity
```

FlowNN remains a semantic pressure-routing system. Neighboring flow, sampling, dynamical, and constraint systems are useful because they expose design primitives for moving through a space without collapsing or losing structure.

## Primitive Map

| Neighboring idea | Primitive to borrow | FlowNN interpretation |
| --- | --- | --- |
| Flow matching | directional transformation field | global bias for where meaning is evolving |
| Generative flow networks | path distribution tracking | avoid losing awareness of viable alternatives too early |
| Normalizing / reversible flows | partial reversibility | trace outputs back to contributing paths |
| Continuous dynamical systems | continuous time state | let pressure vary through decay, amplification, and oscillation |
| Diffusion-style exploration | controlled noise | explore early, stabilize later |
| Constraint systems | hard constraints | prevent invalid states and stabilize early learning |
| Option modeling | option set | compare possible paths before value-weighted selection |

## Extended Pipeline

```text
Raw Signal
-> Time Transform
-> Time Material
-> Meaning Layer 1
-> Field Bias
-> Routing with noise and constraints
-> Path Distribution Tracking
-> Continuous Temporal Evolution
-> Meaning Layer 2
-> Trace Memory
```

This is a target architecture, not the current runtime.

## Resource-Aware Option Rule

Path distribution tracking should preserve route diversity conceptually. It should not keep every possible path active forever.

```text
possible routes != active routes
```

The system should not store route lifecycle buckets as primary truth. It should store dynamics:

```text
route support
recent flow
resistance
recurrence
trace residue
prediction usefulness
reactivation potential
```

If resources are abundant:

```text
keep broader exploration alive
```

If resources are limited, actively preserve only:

- highest expected value paths;
- high-risk uncertainty paths;
- diverse fallback paths;
- paths needed for reversibility or explanation.

External scaffold readers may infer that a route is flowing, available, residual, cold, or latent. Those are readings of flow behavior, not categories stored as the mechanism.

## Phase 1: Stability And Interpretability

Highest priority:

1. path distribution tracking;
2. trace / partial reversibility;
3. hard constraints.

These support:

- better explanation;
- fewer invalid routes;
- clearer option comparison;
- stronger debugging of why an output happened.

## Phase 2: Exploration And Coherence

Next:

1. field bias;
2. controlled noise.

These support:

- more coherent long routes;
- exploration without permanent drift;
- global direction without removing local routing.

## Phase 3: Temporal And Value Depth

Later:

1. continuous time dynamics;
2. explicit option layer.

These support:

- richer temporal patterns;
- value formation under alternatives;
- future self/value dynamics.

## Constraint

None of these primitives should become hidden answer injection. Every borrowed primitive must still map back to pressure, routing, trace, constraint, or field dynamics that can be inspected.
