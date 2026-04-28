# Topology

The main topology now starts without the fixed truth-table pair layer.

The earlier shaped topology is still available as a reference mode, but the main experiment asks whether unresolved pressure can recruit the missing intermediate structure.

## Source Nodes

- `A0`
- `A1`
- `B0`
- `B1`

## Recruitable Operation Layer

In recruitable mode, operation flow starts with direct weak routes:

```text
A0/A1/B0/B1 -> OUT0/OUT1
```

This is intentionally under-structured for operations such as XOR. When repeated test cycles show ambiguity, low output margin, or wrong settling, the network records the active source pattern as an unresolved pressure signature.

After repeated unresolved signatures, the network recruits a weak separator node:

```text
active sources -> recruited separator -> competing outputs
```

The candidate starts with high resistance and high plasticity. It survives by improving the case that recruited it.

## Shaped Reference Mode

The previous hand-shaped pair nodes remain useful as a baseline:

- `H0`: receives `A0 + B0`
- `H1`: receives `A0 + B1`
- `H2`: receives `A1 + B0`
- `H3`: receives `A1 + B1`

The pair nodes are the first structural meaning layer.

## Scaffold Meaning Nodes

The scaffold layer gives the system primitive meanings it can later use to explain operation behavior.

Origin meanings:

- `ORIGIN_A`: trained from `A0` and `A1`
- `ORIGIN_B`: trained from `B0` and `B1`

Value meanings:

- `VALUE_0`: trained from `A0`, `B0`, and `OUT0`
- `VALUE_1`: trained from `A1`, `B1`, and `OUT1`

These meanings are trained in separate regions, then consolidated by lowering their regional plasticity. Normal operation flow uses only the operation region, so scaffold valves do not steal pressure from pair nodes during truth-table training/testing.

## Output Nodes

- `OUT0`: operation result with value-0 meaning
- `OUT1`: operation result with value-1 meaning

In shaped mode, every pair node has a forward valve to each output. Each output also has reserved reverse training-only valves back to pair nodes, but those reverse valves are not conductive in the current shaped experiment.

## Recruitment Principle

Complexity should be recruited by failure to resolve, not designed in advance.

The first implementation only recruits separator nodes. Later versions can add bridge nodes for missing route continuity and concept nodes for reusable basins across tasks.
