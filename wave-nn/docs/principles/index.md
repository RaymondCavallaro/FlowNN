# Principles

[Portugues](../pt/principles/index.md)

These principles define constraints that should hold across implementations. They are not descriptions of the current code, node layout, or chosen algorithms.

A good test for a principle:

```text
if the implementation changed completely, should this still be true?
```

If yes, it belongs here. If no, it belongs in [Current System](../system/current-system.md), [Property Map](../system/properties.md), or a mechanism doc.

## Meta-Principles

### A. Interaction Over Representation

Things are defined by what they do in relation to other things, not by static labels or stored vectors.

### B. Process Over State

Time, change, recurrence, and stabilization matter more than any single frozen configuration.

### C. Constraint Over Idealization

The system must operate under limits. Intelligence means behavior under constraint, not infinite optimization.

## 1. Meaning As Behavior

Meaning is not stored as a static representation. Meaning emerges from how signals interact, propagate, constrain each other, and affect future behavior.

## 2. Time As Structure

Time is a primary structural dimension. Temporal patterns make structure possible and can transform first-order meaning into deeper meaning.

## 3. Emergent Logic

Logical relationships should not be imposed as permanent rules. They should arise from stable, repeatable interaction patterns inside the system.

## 4. Constraint-Driven Intelligence

The system operates with finite resources. Behavior must reflect tradeoffs, prioritization, selective allocation, and consequences.

## 5. Option Awareness Before Selection

Selection is meaningful only when alternatives were possible. The system should preserve awareness of viable possibilities before committing, even when only a subset can remain active.

## 6. Selective Persistence

Not all information, routes, or traces should be retained. The system must learn what to maintain actively, compress, or discard.

## 7. Traceability And Structural Transparency

The system should allow reconstruction of how outcomes were produced. Behavior should be explainable through structural evolution, not hidden answer injection.

## 8. Learning As Behavioral Change

Learning changes how the system responds. It should appear as changed interaction patterns, not merely as stored facts.

## 9. Coherence Over Time

The system should progressively stabilize behavior across experience. Past interactions should influence future responses without freezing adaptation.

## 10. Separation Of Theory And Implementation

Principles define what must remain true. Implementations define how those principles are realized under current constraints.

## 11. Private State And Interpretive Interaction

Agents have internal states that are not directly observable by other agents. Interaction therefore depends on partial signals, inference, and uncertainty.

The system should treat other agents as opaque and self-directed, not as fully readable extensions of itself.

## 12. Independent Agency

No external agent can fully represent another agent's priorities. Each agent must be able to express, protect, and advance its own goals under constraint.

## 13. Value Inference And Productive Mismatch

Observed behavior can be used to infer possible values, but those inferred values remain uncertain. Comparing inferred external values with internal values can produce alignment, tension, curiosity, adaptation, or differentiation.

Mismatch is not only conflict. It can become leverage for learning what matters and how this system differs from others.

## Related

- [Property Map](../system/properties.md)
- [Math Model](../math/index.md)
- [Current System](../system/current-system.md)
- [Self, Values, And Curiosity](../concepts/self-values-and-curiosity.md)
- [Lessons](../lessons/index.md)
