# Topology

The topology is deliberately constructed toward the current truth-table task.

That is a design choice. Before asking the network to recruit nodes dynamically, we want a stable minimal graph where the intended solution is reachable.

## Source Nodes

- `A0`
- `A1`
- `B0`
- `B1`

## Pair Nodes

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

Every pair node has a forward valve to each output. Each output also has reserved reverse training-only valves back to pair nodes, but those reverse valves are not conductive in the current shaped experiment.

## Deferred Idea

Dynamic node recruitment should come after this shaped network can demonstrate reliable learning. Otherwise topology discovery and learning dynamics become tangled too early.

Another deferred idea is a translation operation: a constructed or learned layer can translate raw structural inputs into composed meanings such as `00`, `01`, `10`, and `11`. The current pair nodes are a manual version of that idea.
