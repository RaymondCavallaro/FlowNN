# System Dynamics

This project should avoid implementing brain-like properties as isolated modules.

The useful direction is to define dynamics that make those properties appear naturally:

```text
continuous state
+ recurrent routing
+ adaptive valves
+ structured signals
+ state-dependent behavior
```

## Core Requirements

The main long-term requirements are:

- continuous internal state instead of stateless input/output calls;
- recurrence, where outputs and internal state can influence future flow;
- distributed representations, where meaning is a pattern across nodes and paths;
- state-dependent routing, where the same source pressure can behave differently in different network states;
- temporal sensitivity, where order and delay can become part of meaning;
- error as a first-class signal, not just a final score;
- adaptive structure, including valve changes and node recruitment;
- selective amplification through gain, threshold, and plasticity;
- multi-scale time, with fast pressure and slow learning coexisting;
- pattern completion from partial pressure signatures;
- stability/flexibility balance through reinforcement, decay, and exploration;
- energy pressure against unnecessary activation.

## Mapping To Current Terms

```text
valves        -> routing + attention
resistance    -> plasticity / ease of passage
co-flow       -> local learning
recruitment   -> topology growth under unresolved pressure
thresholds    -> selectivity
regions       -> plasticity context
```

## Near-Term Translation

The current recruitable topology only implements a small part of this:

```text
unresolved pressure -> separator recruitment -> survival/fading
```

The next system-dynamics step should not add many brain-like features at once. It should add one deeper dynamic:

```text
continuous unresolved-state memory
```

That means recruitment should be driven by traces that persist across cycles, decay when not reinforced, and compete with other traces.

## Later Translation

After separator recruitment is stable and inspectable, the next dynamics can be introduced in this order:

1. recurrent teacher/target-seeking paths;
2. bridge-node recruitment for missing routes;
3. concept-node recruitment for reused structure;
4. perturbation-based probing;
5. temporal routing.
