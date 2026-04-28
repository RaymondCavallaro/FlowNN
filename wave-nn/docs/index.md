# Pressure NN

Pressure NN is an experiment in meaning-first routing.

The current prototype asks a narrow question: can pressure, thresholds, local valve adaptation, and flood-style training learn a tiny truth-table task without explicit signal labels, path traces, or backprop-style route credit?

The implementation is intentionally small. The network is shaped toward the desired solution first, so we can study the learning behavior before trying dynamic node recruitment.

## Current Shape

- Four source nodes: `A0`, `A1`, `B0`, `B1`.
- Four pair nodes: `H0`, `H1`, `H2`, `H3`.
- Two output nodes: `OUT0`, `OUT1`.
- Forward valves for input-only testing.
- Reserved reverse valves from outputs for later teacher-flood experiments.

## Reading Path

Start with [Pressure Network](concepts/pressure-network.md), then [Topology](concepts/topology.md), then [Relational Meaning](concepts/relational-meaning.md), then [Arithmetic Pressure](concepts/arithmetic-pressure.md), then the implementation notes for [network.js](code/network.js.doc.md).

For upcoming work, see [Roadmap](concepts/roadmap.md).
