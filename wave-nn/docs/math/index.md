# Math Model

[Portugues](../pt/math/index.md)

This section is first-class because the math model is the unifying layer of the project.

Code can stay inspectable and experimental. Concepts can change names. Historical lessons can be parked. The math model should keep answering the deeper question:

```text
what shared dynamics make routing, learning, recruitment, regulation, and meaning part of one system?
```

## Current Role

The current math model describes FlowNN as sparse field dynamics:

```text
pressure state
-> conductance field
-> flow field
-> local deformation
-> regulation of change
```

It is not only documentation. It is the intended bridge toward:

- cleaner implementation boundaries;
- reproducible experiments;
- scientific papers;
- comparisons with neural, symbolic, active-inference, and dynamical-systems language.

## Read First

- [Unified Field Model](unified-field.md)

## Research Rule

When implementation details conflict with the model, document the conflict explicitly. Do not hide it in code comments or historical notes.
