# network.js

[Portugues](../pt/code/network.js.doc.md)

`src/network.js` contains the pressure engine.

The source file should stay mostly clean. This document carries the explanatory comments that would otherwise clutter the engine.

For the current unified math target, see [Math Model](../math/index.md). The short version is: `PressureNetwork` stays inspectable, while a future `PressureField` can compress the same dynamics into sparse indexed state.

## Public Model

- `OPERATIONS`: supported truth-table operations.
- `TRUTH_TABLE`: four rows used for training and testing.
- `PressureNode`: pressure accumulator and threshold activator.
- `InputValve`: directed pressure connection.
- `PressureNetwork`: graph construction, training, testing, and metrics.

There is no separate runtime `Signal` object. Pressure is injected directly into source/output nodes as strength, and identity remains structural.

`PressureNetwork` supports two topology modes:

- `recruitable`: the main mode; starts without fixed pair nodes and recruits separator nodes from repeated unresolved pressure;
- `shaped`: reference mode with the earlier `H0`-`H3` pair topology.

Valves now belong to a region:

- `origin`: source-to-origin scaffold meanings;
- `value`: source/output-to-value scaffold meanings;
- `operation`: source-to-pair and pair-to-output operation flow.

`InputValve` also carries a small observer scaffold:

- `flowTrace`: decaying residue of recent throughput;
- `recurrence`: how repeatedly the route has conducted;
- `usefulness`: whether learning recently treated the route as helpful or harmful.

These are not route lifecycle labels. They are dynamic traces that let the inspector infer whether a route is currently flowing, available, residual, cold, or latent.

## Runtime Loop

Each step:

1. cools valve activity;
2. applies global ecology drift when training is active;
3. computes total outgoing conductance per source node for the active regions;
4. sends source activation through active-region valves;
5. applies local valve learning if training is active;
6. settles every node.

Outgoing pressure is shared across open valves instead of copied into every valve. This keeps loops from amplifying energy without bound.

## Asymptotic State

Valves keep an internal `aperture` value. `openness` is derived with a sigmoid curve, and `resistance` is `1 - openness`.

This makes plasticity naturally asymptotic: changes near the extremes have less visible effect, and valves do not intentionally become absolutely open or closed.

## Regional Plasticity

The network tracks region plasticity values.

Plasticity is continuous, not a binary frozen/unfrozen state. It multiplies valve updates inside a region:

- lower plasticity means the region is consolidated and harder to disturb;
- higher plasticity means the region remains easier to reshape;
- unlocked regions slowly relax toward `1`.

The current regions are `origin`, `value`, and `operation`.

`trainScaffold` trains the primitive origin/value meanings and then lowers plasticity for those scaffold regions. Operation training can then learn truth-table behavior while the primitive meanings remain relatively stable.

`injectSetScaffold` is a separate explicit scaffold. It does not train pressure routes. It uses the functional scaffold generator with `source = manual`, producing inspectable set/property concepts and relations such as axis membership, input options, mutual exclusion, co-presence, shared value property, and generalization.

Injected set relations are marked by source:

```text
source = manual
```

so later automatic recruitment can use the same shape without pretending the manual scaffold was discovered.

`generateSetScaffold` reconstructs that shape from a functional description and current source nodes. It infers axes and values from source ids, builds the needed concepts and relations, and marks the result with:

```text
source = generated
```

`injectGeneratedSetScaffold` plugs the generated scaffold into the same `setScaffold` slot used by manual injection, so source explanations and recruitment strategy candidates continue to work.

Operation plasticity is updated by `updateOperationPlasticityFromCycle`, which receives a full input-only truth-table test cycle. Local valve events do not directly change operation plasticity.

When cycle accuracy improves or remains perfect, regional plasticity drops. When cycle accuracy falls, regional plasticity rises.

Adaptive nodes keep an internal `thresholdState`. The visible threshold is also derived through a bounded curve between a node-specific minimum and maximum.

This lets threshold ecology move nodes toward sensitivity or selectivity without hard-clamping every small update.

## Training

`trainScaffold` injects primitive meaning cases:

```text
A0 -> ORIGIN_A
A1 -> ORIGIN_A
B0 -> ORIGIN_B
B1 -> ORIGIN_B
A0/B0/OUT0 -> VALUE_0
A1/B1/OUT1 -> VALUE_1
```

Those scaffold cases conduct only through their scaffold region.

`trainCase` injects the row inputs and the desired output repeatedly.

The `teacherOutputId` marks which output is currently being flooded. It is used only at the learning boundary so wrong output valves can be tightened.

`teacherStrengthFor` scales desired-output flood pressure by how rare that output is in the current operation truth table. The current formula is:

```text
1.1 * rarity^strengthBalance * distinctiveness
```

where `distinctiveness` is a small extra boost for rare outputs.

`trainStepsFor` scales teacher duration:

```text
TRAIN_STEPS * rarity^durationBalance
```

This lets experiments compare stronger teacher pressure against longer calibration time.

## Testing

`testCase` injects only the input sources. It records peak output activation during the settle window because the meaningful output pulse may happen before the final frame.

It also records alternative output scores:

- `peak`: strongest activation during the settle window;
- `area`: integrated activation over the settle window;
- `duration`: number of settle steps above the active-output threshold;
- `hybrid`: peak plus small area and duration terms.

The default prediction still uses peak while the other modes are diagnostic.

## Recruitment

In recruitable mode, `testCycle` also feeds results into the recruitment monitor.

A result is unresolved when it is ambiguous, incorrect, or has a low output margin. The monitor groups repeated unresolved results by source signature such as `00`, `01`, `10`, or `11`.

When a signature persists, the network recruits a weak separator node:

```text
operation-area nodes <-> separator candidate
```

The candidate is not a symbolic label. It is a pressure structure born from unresolved pressure. The recruitment strategy tuner chooses how broadly it connects inside the operation area while excluding scaffold/meaning nodes. Later test cycles update its survival state:

- stable when it improves margin and correctness;
- fading when it continues to fail.

In recruitable mode, direct source-to-output operation routes learn slowly. Separator routes learn more strongly while they are candidates, then slow down after they become stable. Recruited separator nodes start with weak exploratory routes. The current model does not create output-to-recruit reverse routes, so normal input-only testing does not begin by injecting answer pressure backward.

`recruitmentPolicyFor` no longer contains one fixed answer for where a separator should connect. It builds candidate strategies and lets the recruitment controller select one.

Current strategies:

```text
active-case-context
expected-output-context
set-scaffold-context
broad-operation-area
```

`set-scaffold-context` is available only when the explicit set scaffold has been injected. Strategy stats track trials, score, successes, and failures. `updateRecruitmentSurvival` tunes the strategy score after the recruited node improves or fails.

The secondary tuner adds a continuous layer under those strategy names. `recruitmentAxisDemand` reads the case and produces axis demand:

```text
sourceFocus
outputFocus
scopeBreadth
scaffoldUse
teacherFeedback
```

Each strategy has an axis profile. Selection compares the current case demand, learned axis weights, and strategy survival score. Survival feedback tunes both the named strategy score and the axis weights used by that strategy.

## Explanation

`explainNode` exposes forward and backward signatures:

- source nodes report which scaffold meanings they support;
- source nodes report injected set/property relations when the set scaffold is active;
- hidden nodes report source structure, origin/value composition, output role, and recruitment state when present;
- output nodes report value meaning and hidden-node supporters.

This is observational. It reads learned structure after training instead of adding labels to signals or giving route-level credit.

`readOperationRelations` reads compressed relational meaning from operation routes. For each output, it:

1. finds the strongest hidden-node supporters;
2. reads each supporter's origin/value scaffold meaning;
3. extracts invariants across those support paths.

Examples of extracted invariants are `mixed-value`, `same-value`, `all-value-1`, `all-value-0`, `at-least-one-value-1`, and `not-all-value-1`.

`readRouteDynamics` is an external scaffold reader. It observes route dynamics without storing explicit buckets such as active, compressed, or discarded. For each route it reports:

- support from current weight and openness;
- recent flow from transient pressure/activity;
- resistance;
- recurrence;
- trace residue;
- usefulness;
- reactivation potential;
- an inferred availability reading.

The availability reading is diagnostic. The network stores pressure dynamics; the reader infers route state from those dynamics.

`generateForOutput` is the first constrained generative use of those relations. It:

1. reads the target output relation;
2. enumerates the current source-pair space;
3. reads each candidate pair through the scaffold meanings;
4. keeps candidates whose relation satisfies every learned invariant;
5. attaches route evidence from the learned path set and ranks candidates by inferred route support.

This is still bounded to the current bitwise lab. It is meant to test whether relation meaning can run backward from target role to possible source structure.

## Meta-Regulation

`metaRegulationState` is the first scaffold for control over learning. It reads observer-side signals:

- accuracy;
- ambiguity;
- low-margin rate;
- unresolved recruitment pressure;
- candidate and stable recruited nodes.

It turns them into continuous axes:

```text
stability <-> plasticity
exploration <-> exploitation
certainty <-> doubt
constraint <-> freedom
```

and suggested controls for plasticity, valve mode, threshold mode, and time window length.

This state is observational. It does not yet override the manual controls or mutate the network by itself.

## Important Constraint

Output flood participates by activating the desired output node during training. The current model does not reserve reverse output valves. Learning happens locally where active route pressure reaches the active teacher output.
