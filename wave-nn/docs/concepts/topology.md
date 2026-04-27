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

## Output Nodes

- `OUT0`
- `OUT1`

Every pair node has a forward valve to each output. Each output also has reserved reverse training-only valves back to pair nodes, but those reverse valves are not conductive in the current shaped experiment.

## Deferred Idea

Dynamic node recruitment should come after this shaped network can demonstrate reliable learning. Otherwise topology discovery and learning dynamics become tangled too early.

Another deferred idea is a translation operation: a constructed or learned layer can translate raw structural inputs into composed meanings such as `00`, `01`, `10`, and `11`. The current pair nodes are a manual version of that idea.
