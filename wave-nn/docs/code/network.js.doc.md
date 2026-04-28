# network.js

`src/network.js` contains the pressure engine.

The source file should stay mostly clean. This document carries the explanatory comments that would otherwise clutter the engine.

## Public Model

- `OPERATIONS`: supported truth-table operations.
- `TRUTH_TABLE`: four rows used for training and testing.
- `Signal`: pressure strength only.
- `PressureNode`: pressure accumulator and threshold activator.
- `InputValve`: directed pressure connection.
- `PressureNetwork`: graph construction, training, testing, and metrics.

Valves now belong to a region:

- `origin`: source-to-origin scaffold meanings;
- `value`: source/output-to-value scaffold meanings;
- `operation`: source-to-pair and pair-to-output operation flow.

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

## Explanation

`explainNode` exposes forward and backward signatures:

- source nodes report which scaffold meanings they support;
- pair nodes report source structure, origin/value composition, and output role;
- output nodes report value meaning and hidden-node supporters.

This is observational. It reads learned structure after training instead of adding labels to signals or giving route-level credit.

`readOperationRelations` reads compressed relational meaning from operation routes. For each output, it:

1. finds the strongest hidden-node supporters;
2. reads each supporter's origin/value scaffold meaning;
3. extracts invariants across those support paths.

Examples of extracted invariants are `mixed-value`, `same-value`, `all-value-1`, `all-value-0`, `at-least-one-value-1`, and `not-all-value-1`.

## Important Constraint

Reverse output valves are marked `trainingOnly`. In the current shaped pair-node experiment they are reserved but not conductive. Output flood participates by activating the desired output node; learning then happens locally where active pair pressure reaches that active output.
