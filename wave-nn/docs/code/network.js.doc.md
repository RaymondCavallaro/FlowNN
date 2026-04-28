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

## Runtime Loop

Each step:

1. asks `PressureField` to cool valve activity;
2. applies global ecology drift when training is active;
3. asks `PressureField` to solve the sparse flow vector;
4. applies that flow vector to receiving node pressures;
5. applies local valve learning from the same flow vector if training is active;
6. asks `PressureField` to settle every node.

Outgoing pressure is shared across open valves instead of copied into every valve. This keeps loops from amplifying energy without bound.

## Field Layer

`PressureField` is the math surface introduced in `v0.0.3`.

It indexes nodes and valves, then stores the current tick as arrays:

- source node index per valve;
- target node index per valve;
- outgoing conductance per source node;
- throughput per valve;
- summed target input per receiving node.

The object graph remains the public and visual model. The field layer is the compressed computation model:

```text
flow[valve] = activation[source] * conductance[valve] / outgoing[source]
target_input[target] = sum(flow[* -> target])
```

This is a sparse matrix operation in shape, even though the implementation keeps it as arrays for readability.

## Asymptotic State

Valves keep an internal `aperture` value. `openness` is derived with a sigmoid curve, and `resistance` is `1 - openness`.

This makes plasticity naturally asymptotic: changes near the extremes have less visible effect, and valves do not intentionally become absolutely open or closed.

## Operation Region Plasticity

The network tracks `operationRegion.plasticity`.

Plasticity is a continuous regional value, not a binary frozen/unfrozen state. It multiplies valve updates across the current operation area:

- lower plasticity means the operation area is consolidated and harder to disturb;
- higher plasticity means the operation area remains easier to reshape;
- plasticity slowly relaxes toward `1`.

Plasticity is updated by `updateOperationPlasticityFromCycle`, which receives a full input-only truth-table test cycle. Local valve events do not directly change regional plasticity.

When cycle accuracy improves or remains perfect, regional plasticity drops. When cycle accuracy falls, regional plasticity rises.

The current prototype has one operation region covering the whole network. Later versions can split this into multiple regions.

Adaptive nodes keep an internal `thresholdState`. The visible threshold is also derived through a bounded curve between a node-specific minimum and maximum.

This lets threshold ecology move nodes toward sensitivity or selectivity without hard-clamping every small update.

## Training

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

## Important Constraint

Reverse output valves are marked `trainingOnly`. In the current shaped pair-node experiment they are reserved but not conductive. Output flood participates by activating the desired output node; learning then happens locally where active pair pressure reaches that active output.
