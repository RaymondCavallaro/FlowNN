# Field Math

`v0.0.3` keeps the pressure-network ideas from `v0.0.2`, but describes the engine as field operations over indexed state.

The object graph is still useful for drawing and inspection. The computation can be compressed into arrays:

```text
P = node pressure
A = node activation
Theta = node thresholds
O = valve openness
W = valve weight
K = topology matrix
R = regional plasticity
I = external injection
```

The conductive state of the network is:

```text
G = K * O * W
```

where `*` is elementwise masking by topology. In the implementation, `G` is stored sparsely as valve arrays instead of a dense node-by-node matrix.

## Tick Equation

One pressure tick can be read as:

```text
F = normalize_outgoing(G, A)
P' = decay(P + F + I)
A' = activate(P', Theta)
```

`F` is the flow field. Every valve contribution is computed independently, then summed into the receiving node pressure.

The current code computes:

```text
outgoing[source] = sum(G[source, *])
flow[valve] = activation[source] * G[valve] / max(1, outgoing[source])
target_input[target] = sum(flow[* -> target])
```

This keeps pressure from being copied into every open valve. A source has a pressure budget that gets shared across its available exits.

## Configuration Space

The learnable network is a point in configuration space:

```text
C = { O, W, Theta, R }
```

Learning moves that point:

```text
C' = C + local_field_deformation(P, A, F) * R + regional_ecology(E)
```

`E` is operation-level evidence such as accuracy, ambiguity, and output imbalance. It is not route credit and it is not backpropagation.

## Meaning

Meaning is represented as an attractor-like basin in the pressure landscape:

```text
input perturbation -> field response -> output basin
```

The `00` problem in `v0.0.2` can be described as a shallow rare-output basin. Longer rare-output calibration deepened that basin better than simply making the teacher pulse louder.

## Implementation Shape

`PressureField` is the sparse math layer. It owns:

- node indexes;
- valve source and target index arrays;
- a flow vector;
- a target-input vector;
- outgoing conductance per node.

`PressureNetwork` still owns the public model, training loop, testing loop, and inspector-friendly objects. This keeps the UI readable while making the engine easier to compress further later.
