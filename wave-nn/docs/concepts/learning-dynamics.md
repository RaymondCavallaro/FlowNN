# Learning Dynamics

[Portugues](../pt/concepts/learning-dynamics.md)

Training uses flooding. For a truth-table row, the input sources and the desired output are injected together.

For XOR row `A0 + B1 -> OUT1`, training injects:

```text
A0 + B1 + OUT1
```

The desired output is not a passive sink. During training it becomes active, so input pressure arriving at the output boundary can meet teacher pressure locally.

Reverse output valves are not part of the current topology. Letting output pressure activate every candidate pair node made all concepts learn the same output, so teacher pressure now stays local to the expected output unless a narrower future mechanism is justified.

Teacher output strength is balanced by output rarity. Rare outputs receive stronger flood pressure using a gentle square-root balance plus a small distinctiveness boost. This makes `0` and `1` both positive output meanings instead of allowing frequent outputs to dominate purely by appearing more often.

Teacher duration can also be balanced by output rarity. This gives rare outputs more calibration steps instead of only a louder pulse. Strength and duration balance are separate experiment controls because amplitude and repeated calibration affect valves differently.

## Local Adaptation

Valves adapt from local state:

- co-active source and target pressure lowers resistance;
- co-active source and target pressure raises weight;
- pressure that fails to activate can raise resistance;
- valves into the wrong output are tightened during a teacher flood case.

The operation region has a continuous `plasticity` value. Plasticity scales valve changes across the whole active operation area.

Plasticity is updated from full truth-table test cycles, not from local valve events:

- accuracy improvement lowers plasticity;
- repeated perfect cycles lower plasticity further;
- accuracy drops raise plasticity;
- mostly ambiguous low-accuracy cycles raise plasticity slightly.

This keeps plasticity as global ecology rather than per-route credit. The current prototype has one region, but the distinction lets later versions split input translation, concept formation, and output assignment into separate plasticity regions.

Input-only tests also compare peak, area, duration, and hybrid output scores. This helps separate a short strong signal from a longer weak signal before changing the learning rule.

## Ecology Modes

Valve ecology and threshold ecology are separate controls.

Valve modes affect where pressure can travel:

- `neutral`: no global valve drift;
- `seeking`: all valves loosen slightly;
- `certainty`: all valves tighten slightly.

Threshold modes affect what amount of pressure counts as activation:

- `neutral`: no global threshold drift;
- `seeking`: adaptive node thresholds lower slightly;
- `certainty`: adaptive node thresholds rise slightly.

These modes are global. They are not route credit and they do not identify the solution. They change the search conditions so experiments can show when looseness, tightness, sensitivity, or selectivity is useful.

Valve openness uses an asymptotic internal aperture curve. A valve can become extremely open or extremely closed, but it does not intentionally snap to absolute `0` or `1`.

## Testing

Testing injects only input sources. There are no output-to-hidden reverse valves in the current topology. The prediction is whichever output reaches the stronger peak activation during the settle window.
