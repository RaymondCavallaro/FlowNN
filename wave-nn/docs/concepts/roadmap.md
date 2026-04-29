# Roadmap

[Portugues](../pt/concepts/roadmap.md)

The current `main` branch is the convergence line for the pressure-network experiment.

Version branches are experimental shelves and historical checkpoints, not permanent modules in the architecture. The docs should describe the converging node dynamics first, and only mention branches when a piece of work is parked outside `main`.

See [Core Convergence](core-convergence.md) for the naming rule.

## Current Direction

The immediate direction is:

```text
recruitment under unresolved pressure
-> relational generation from learned invariants
-> meta-regulation axes for learning control
-> expectation/error state
-> precision/certainty metrics
-> perturbation-based landscape probing
-> transfer/reuse of stable relational structure
```

Arithmetic remains useful as a test domain, but arithmetic-specific work should stay separate until the general dynamics are clearer.

## Current Feature: Recruitment Under Unresolved Pressure

The next main-line step is topology growth.

Earlier work tested:

```text
given topology -> tune valves -> learn mapping
```

The current experiment tests:

```text
insufficient topology -> recruit nodes/concepts -> form topology
```

Recruitment should happen when the current network cannot settle cleanly:

- persistent ambiguity;
- low output margin;
- repeated drift;
- high unresolved pressure;
- the same cases interfering across cycles.

The first implementation keeps the bitwise operations as the measuring stick, but removes the fixed pair topology from the main mode. Repeated unresolved source signatures recruit weak separator candidates through the current recruitment strategy tuner. A candidate survives only if later cycles improve settling.

## Separation Of New Source Notes

The newer source notes split into different lanes:

- active inference and information-space notes belong in [Information Landscape](information-landscape.md);
- brain-like convergence requirements belong in [System Dynamics](system-dynamics.md);
- active sensing / landscape probing is a next main-line feature after recruitment is stable;
- knowledge transfer / reuse belongs after concept-node recruitment exists;
- modular arithmetic and grokking-style arithmetic tests can stay parked outside `main`;
- grokking as an evaluation idea belongs on `main` only as a generalization/memorization distinction.

Immediate main-line use:

```text
recruitment traces
-> uncertainty / margin / drift metrics
-> survival and pruning
```

Current main-line generative use:

```text
target output
-> stable relation invariant
-> candidate source pairs
```

This should remain a small bridge from relation reading to generation. It should not become an operation oracle or a hand-authored truth-table generator.

Current main-line meta-regulation use:

```text
accuracy / ambiguity / margin / recruitment pressure
-> adaptive tension axes
-> suggested learning controls
```

This remains observational for now. The next step is to compare its suggestions with manual ecology settings before letting it drive plasticity, valve mode, threshold mode, or time windows automatically.

Next main-line use:

```text
uncertainty
-> choose a probe row or perturbation
-> update recruitment/consolidation
```

## Next Feature: Step Reasoning Identity

The next feature should let the system and the UI identify which kind of reasoning a step is expressing.

Forward reasoning:

```text
inputs -> hidden meaning nodes -> output reaction
```

This is the current input-only test direction. It asks what output basin the incoming sources activate.

Backward reasoning:

```text
target/output -> candidate hidden causes -> required inputs
```

This is the target-seeking direction. It starts from an output or desired target and asks what pressure steps would be needed to explain or reach it.

The first implementation should be observational and inspectable:

- mark each step as `forward`, `backward`, or `mixed`;
- show whether pressure is moving from inputs toward outputs or from targets toward possible causes;
- keep the distinction visible in the inspector and visualizer;
- avoid turning backward reasoning into explicit route credit or backprop.

The purpose is not to teach the answer directly. The purpose is to see when the network is doing prediction-like flow versus target-seeking flow.

## Meaning Extraction Direction

The direction from `3.txt` and `4.txt` is to use forward and backward reasoning to extract meanings from internal structure.

An intermediate node or group should be explainable through two complementary signatures:

```text
meaning = what activates it
role = what it contributes to
```

Input/structural meaning:

```text
which source patterns consistently activate this node?
```

Example:

```text
H1 -> A0 + B1
H2 -> A1 + B0
```

Functional role:

```text
which output behavior does this node help produce?
```

Example in XOR:

```text
H1 and H2 both contribute to OUT1
H0 and H3 both contribute to OUT0
```

This lets the inspector derive explanations like:

```text
H1/H2:
  structural meaning = opposite input pairs
  functional role = drives OUT1
  derived concept = difference
```

The important distinction:

```text
structure explains what the concept is
function explains what the concept does
```

Forward reasoning should gather activation signatures from inputs toward outputs. Backward reasoning should gather role signatures from outputs or targets back toward candidate causes. The extracted meaning is a projection of learned structure, not an explicit label stored inside the signal.

## Current Scaffold Experiment

The first implementation trains primitive scaffold meanings before operation learning:

```text
A0/A1 -> ORIGIN_A
B0/B1 -> ORIGIN_B
A0/B0/OUT0 -> VALUE_0
A1/B1/OUT1 -> VALUE_1
```

After scaffold training, origin and value regions are locked by lowering their plasticity. Operation training then learns truth-table behavior while the inspector tries to explain pair/output behavior through those prior meanings.

This should let explanations emerge from known internal meanings:

```text
H1 = A0 + B1
A0 -> ORIGIN_A + VALUE_0
B1 -> ORIGIN_B + VALUE_1
therefore H1 can be read as cross-origin + mixed-value
```

The scaffold is allowed to teach origin and value. It should not teach operation meanings such as `same`, `different`, `xor`, or `and`.

## Relational Meaning And Invariants

The direction from `5.txt` and `6.txt` changes meaning reading from node-centric to relation-centric.

Earlier framing:

```text
relation = compressed path
```

Better framing:

```text
relation = invariant across stable paths under variation
```

This means a direct reading between arbitrary layers, such as layer `1 -> 3`, should not merely store every `1 -> 2 -> 3` path. It should extract what remains stable across the valid paths connecting those layers.

Example for XOR:

```text
A0 -> H1 -> OUT1
A1 -> H2 -> OUT1
```

The paths vary in concrete value and pair node. The invariant is:

```text
cross-origin + mixed-value -> VALUE_1
```

That invariant is the relational meaning.

This gives a cleaner hierarchy:

```text
1. node meaning        -> what activates one node
2. group meaning       -> shared structure across nodes
3. relation meaning    -> stable mapping between sets
4. path meaning        -> how a mapping is realized
5. compressed relation -> invariant across stable paths
6. pattern matching    -> reuse invariants across contexts
```

The Noether-style intuition from `6.txt` is useful but should remain an analogy:

```text
variation -> invariant -> meaning
```

In this system, invariants are learned/statistical rather than exact physical conservation laws.

Implementation guidance:

- detect relation candidates from repeated forward/backward traces;
- group paths by shared source/target meanings and output role;
- add primitive set/property intuition: membership, exclusion, co-holding, generalization, specialization, and shared property;
- test new invariants against similar known concepts and discard explanations already covered before proposing a new concept;
- keep only relations that are stable, repeated, and high-confidence;
- avoid storing every path as a relation;
- expose ambiguity as weak or conflicting invariants.

## Later Ideas

- Active probing: choose the next row, perturbation, or test from current uncertainty.
- Information-landscape metrics: track uncertainty, margin, drift, calibration quality, and transfer stability.
- Continuous unresolved-state memory with decay and competition between traces.
- Primitive set/property intuition before smarter recruitment strategies.
- Set coherence before CSP-like resolution, and value-weighted choice only after option-space comparison.
- Self-continuity, option-space, and consequence attribution before value hierarchy or curiosity-as-value.
- Time integration: keep Laplace-like transformation as an early layer, then let routed temporal behavior refine meaning.
- Bridge-node and concept-node recruitment after separator recruitment is inspectable.
- Knowledge transfer / reuse: recruit existing basins in new contexts instead of creating new nodes every time.
- Separate operation regions for input translation, pair/concept formation, output assignment, and target seeking.
- More intrinsic ambiguity and basin-depth metrics, reducing dependence on external accuracy.
- A controlled reverse-flood experiment that does not activate every hidden node at once.

## Parked Runtime Helpers

The runtime previously carried unused generic helpers for interpolation, random choice, and phase math. They were removed from `src/math.js` until a current feature needs them.

Temporal routing can reconstruct the phase helpers from:

```text
wrap01(value) = ((value % 1) + 1) % 1
phaseDistance(a, b) = min(abs(wrap01(a) - wrap01(b)), 1 - abs(wrap01(a) - wrap01(b)))
signedPhaseDelta(target, current):
  delta = wrap01(target) - wrap01(current)
  if delta > 0.5: delta -= 1
  if delta < -0.5: delta += 1
```

Possible time chain:

```text
raw sensorial signal
-> Laplace-like transform
-> first time layer
-> meaning
-> temporal routing
-> second meaning
```

The goal is not only to extract meaning from time. It is also to let meaning move through routes over repetitions, delays, and stable activations so the network can form a second-order meaning about what kind of temporal thing happened.
