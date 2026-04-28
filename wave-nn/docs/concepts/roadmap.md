# Roadmap

This branch keeps the `v0.0.2` object engine as the main development base. The math compression work is saved separately on `v0.0.3`.

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

## Later Ideas

- Time integration from `2.txt`: keep Laplace-like transformation as an early layer, then let routed temporal behavior refine meaning.
- Dynamic node recruiting when the current topology cannot separate a meaning cleanly.
- Separate operation regions for input translation, pair/concept formation, output assignment, and target seeking.
- More intrinsic ambiguity and basin-depth metrics, reducing dependence on external accuracy.
- A controlled reverse-flood experiment that does not activate every hidden node at once.
- A math/field implementation path, preserved on `v0.0.3`, if performance or clarity calls for it later.

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
