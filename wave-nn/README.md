# FlowNN

A meaning-first pressure network experiment.

The current prototype removes wave/timing routing and tests whether local pressure learning can form useful paths. Signal identity is structural: a pressure pulse starts at a source node such as `A0` or `B1`; the signal itself only carries strength.

## Model

- `Signal`: pressure only.
- `PressureNode`: internal pressure, threshold, decay, activation.
- `InputValve`: source node, target node, resistance, weight, pressure/activity.
- `OutputNode`: endpoint during testing, but an active pressure source during flood training.

The operation region tracks continuous plasticity. Plasticity scales future valve updates across the active operation area, so successful behavior can consolidate without permanently freezing individual valves.

Sources:

- `A0`, `A1`
- `B0`, `B1`

Outputs:

- `OUT0`
- `OUT1`

Initial valves start near middle resistance so they are neither fully open nor fully closed.

The main mode now starts without the fixed pair layer. Sources begin with weak direct routes to both outputs. When repeated bitwise cases remain ambiguous or low-margin, the network recruits weak separator nodes around the unresolved source pattern.

The earlier shaped pair topology is still available as a reference mode in tests.

## Training

Flood training injects the selected truth-table input sources and the desired output node at the same time.

Example for XOR:

```text
A0 + B1 + OUT1
```

Local co-activation lowers resistance / raises weight. Pressure that accumulates without activation can increase resistance. There is no signal type, no accepted signal type, no path history, and no backprop-style credit assignment.

Desired-output flood strength is balanced by output rarity so less frequent output meanings still receive enough teacher pressure.

Teacher duration can also be balanced by output rarity. This lets experiments compare stronger teacher pulses against longer calibration time.

## Testing

Input-only testing injects only the input sources. The predicted output is whichever output node activates more strongly after a settle window. Ambiguous or missing output counts as incorrect.

Tests also record diagnostic peak, area, duration, and hybrid output predictions so we can distinguish short strong activation from longer weak activation.

## Controls

- `+`: train one truth-table row.
- `C`: train one full truth-table cycle.
- `T`: test one full truth-table cycle.
- `A`: toggle auto-train.
- `R`: reset.
- Operation selector: XOR, AND, OR, NAND.
- `A0`, `A1`, `B0`, `B1`: manual source pulses.
- Valve mode: neutral, seeking, certainty.
- Threshold mode: neutral, seeking, certainty.

Valve mode and threshold mode are separate global ecology controls. Valve seeking/certainty changes where pressure can travel. Threshold seeking/certainty changes what pressure level counts as activation. They are experiment conditions, not route-specific feedback.

## Run

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

## Test

```bash
npm test
```

See `docs/features.md`, `docs/tests.md`, and `docs/manual-testing.md` for the explicit feature map, automated test map, and browser reproduction guide.
