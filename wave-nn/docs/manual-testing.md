# Manual Testing Guide

[Portugues](pt/manual-testing.md)

This guide reproduces the important automated behaviors in the running demo.

## Start The Demo

```bash
cd wave-nn
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

The page title and top-left brand should read `FlowNN`.

## Basic Formation Test

For each operation: XOR, AND, OR, NAND.

1. Select the operation.
2. Click `R` to reset.
3. Click `S` once to train the origin/value scaffold.
4. Keep `Test cycles` checked.
5. Click `C` about 20 times, or press `A` and let auto-train run.
6. Click `T`.
7. Check `Accuracy`.

Expected result: the system should recruit and attempt the operation. Accuracy may reach `100%`, but with broad exploratory recruits it may also fail or oscillate. Treat failure as evidence for missing pruning, precision, or better area-boundary dynamics.

## Recruitment Test

1. Reset the demo.
2. Watch `Topo`; it should show `Grow`.
3. Watch `Recruits`; it should start at `0`.
4. Train cycles with `C` or `A`.
5. Watch for recruited hidden nodes appearing between sources and outputs.

Expected result: the main mode starts without fixed `H0` to `H3` pair nodes. Recruited separator nodes should appear only after repeated unresolved pressure. Each recruit should connect broadly inside the operation area while leaving scaffold/meaning nodes out.

## Teacher Flood Test

1. Select an operation.
2. Click `S`.
3. Click `C`.
4. Click an output-side node or valve in the canvas after training.
5. Open the inspector.

Expected result: output-related pressure participates during training, but accuracy still comes from `T`, which injects inputs only.

## Ecology Controls Test

1. Set `Valves` to `Seeking`.
2. Set `Thresholds` to `Certainty`.
3. Click `C` several times.
4. Watch `Open` and `Thresh`.

Expected result: valve openness and threshold averages move independently.

## Scaffold Explanation Test

1. Click `S`.
2. Train a few cycles.
3. Click source, scaffold, recruited, or output nodes.
4. Read the inspector explanation.

Expected result: explanations should mention origin/value primitives, recruitment signatures, or relation/invariant readings when enough structure exists.

## Set Scaffold Injection Test

1. Reset the demo.
2. Click `∈`.
3. Watch `Sets`; it should show the injected concept count.
4. Click `A0`, `A1`, `B0`, or `B1`.
5. Read `Set concepts` in the inspector.

Expected result: source explanations should show manual set/property relations such as axis membership, mutual exclusion, co-presence, and shared value property. This is an explicit scaffold, not discovered knowledge yet.

## Generated Set Scaffold Test

1. Reset the demo.
2. Click `G`.
3. Watch `Sets`; it should show the generated concept count.
4. Click a source node.
5. Read `Set concepts` in the inspector.

Expected result: the generated scaffold should expose the same kind of source concepts as the manual scaffold. It should be marked internally as generated and remain compatible with recruitment strategy selection.

## Manual Source Pulse Test

1. Click `A0`, `A1`, `B0`, or `B1`.
2. Watch pressure move from that source.
3. Click nodes or valves to inspect current pressure and activation.

Expected result: manual pulses inject source pressure only. The signal itself does not carry a semantic type.
