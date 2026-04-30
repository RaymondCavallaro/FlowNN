# Core Convergence

[Portugues](../pt/concepts/core-convergence.md)

FlowNN should not grow into a set of permanent feature modules.

Named development slices are temporary study tools. They isolate one capacity at a time so the behavior can be inspected, tested, and simplified. The long-term target is a unified node substrate where timing, prediction, precision, probing, recruitment, and transfer are different capacities of the same pressure dynamics.

```text
temporary slice -> isolated experiment -> reusable dynamic -> unified node
```

## Main Principle

The current work should be treated as the convergence line. Historical slices are shelves for experiments and history, not a map of final architecture. See [Project History](../history/project-history.md) for lineage.

## Unified Node Sketch

A mature node should have several local capacities, but they should still be one node dynamic:

```text
Node {
  pressure
  activation
  expectation
  observed_input
  error
  precision
  memory_trace
  routing_state
  plasticity_state
}
```

The intended loop is:

```text
predict
-> compare with actual pressure
-> compute local error
-> weight error by precision
-> update state, valves, or thresholds
-> choose the next probe/action
```

This is not a license for hidden answer injection. Expected output pressure can be used for supervised experiments only when the route from source state to output state remains inspectable. Learning should still be explainable through local pressure, valve adaptation, recruitment, and perturbation response.

## Capacity Slices

The useful slices right now are:

- topology recruitment from unresolved pressure;
- expectation and local error;
- precision and calibrated certainty;
- landscape probing through perturbation;
- transfer and reuse of stable relational structure;
- temporal routing and time-material extraction.

Each slice should answer a small question:

```text
What local dynamic makes this capacity appear?
How can we inspect it?
How can we test it without math magic?
What part should converge back into the node substrate?
```

## Documentation Rule

Core docs should describe converging dynamics. Historical work, failed mechanisms, and changes of direction belong in [Lessons](../lessons/index.md) or [Project History](../history/project-history.md).
