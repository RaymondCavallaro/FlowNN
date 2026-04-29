# 001: Output Flooding

[Portugues](../pt/experiments/001-output-flooding.md)

## Question

Should outputs be passive sinks or active participants during training?

## Original Sink Version

The first meaning-first version made outputs consume pressure. That matched the idea of "meaningful endpoint," but it failed as a learning mechanism.

The desired output could not flood backward, so training had to fake target co-activation in the learning rule. That was too close to direct route credit.

## Current Version

Outputs are active pressure nodes.

During training:

- inputs are injected;
- the desired output is injected;
- teacher pressure is active at the output boundary;
- pair pressure can meet teacher pressure at the pair-to-output valve.

During testing:

- only inputs are injected;
- outputs are read as prediction endpoints.

## Lesson

If flooding is the learning mechanism, the flooded output has to physically participate in the graph. A passive sink can still be useful later, but it cannot be the teacher source for this training style.

An attempted reverse flood from outputs into every pair node caused collapse: all pair nodes learned the same output. The current topology removes those reverse output valves instead of reserving them, keeping teacher pressure local to the expected output until a narrower mechanism is justified.

## Next Lesson

After reverse conductance was removed, output assignment could work but learned routes could still drift.

Local plasticity updates made the region noisy, especially for XOR. The next mechanism moved plasticity updates to full truth-table cycles: local valves still learn from pressure, while regional plasticity responds to operation-level success.

Current result:

- `AND` and `NAND` can stay stable through long runs.
- `XOR` still reaches 100%, but later loses ambiguous cases.
- `OR` reaches 100%, but `00` can become ambiguous later.

This suggests cycle-level plasticity helps stability, but XOR/OR still need better ambiguity or zero-output separation.

## Output Balance Trial

Rare output meanings now receive stronger teacher flood pressure. This helped express output `0` and output `1` more symmetrically as meanings, but the mirror still showed the long-run `00` ambiguity for XOR and OR.

That suggests the remaining problem is not only training-frequency imbalance. It is likely an output contrast / ambiguity issue around weak `OUT0` decisions.

## Peak vs Area vs Duration Trial

Testing now records output peak, integrated area, duration above threshold, and a hybrid score.

For long-run failing `00` cases, area and duration did not recover the answer. The correct output was slightly stronger than the wrong output, but both outputs were below the minimum decision threshold and duration was zero.

This means the `00` failure is not currently a peak-vs-duration scoring problem. The `00` output path is under-energized overall.

## Strength vs Duration Balance

Teacher strength balance alone did not fix the long-run `00` ambiguity.

Duration balance was much more informative:

- For `OR`, duration balancing fixed `00` and held 100% through long runs in the mirror.
- For `XOR`, duration balancing hurt learning because the outputs are already frequency-balanced and the extra duration changed the interference dynamics.

This supports the intuition that rare outputs may need more calibration time, not just more amplitude. It also shows duration balance should be proportional to output imbalance, and possibly inactive when outputs are already balanced.
