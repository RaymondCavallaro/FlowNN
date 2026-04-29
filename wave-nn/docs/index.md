# FlowNN

[Portugues](pt/index.md)

FlowNN is an experiment in meaning-first routing.

The current prototype asks a narrow question: can pressure, thresholds, local valve adaptation, and flood-style training learn a tiny truth-table task without explicit signal labels, path traces, or backprop-style route credit?

The implementation is intentionally small. The main topology now starts under-structured and recruits weak separator nodes when repeated bitwise cases cannot settle cleanly.

## Current Shape

- Four source nodes: `A0`, `A1`, `B0`, `B1`.
- Recruitable hidden nodes created from repeated unresolved pressure signatures.
- Two output nodes: `OUT0`, `OUT1`.
- Forward valves for input-only testing.
- Reserved reverse valves from outputs for later teacher-flood experiments.

## Reading Path

Start with [Core Convergence](concepts/core-convergence.md), then [Pressure Network](concepts/pressure-network.md), then [Topology](concepts/topology.md), then [Relational Meaning](concepts/relational-meaning.md), then [Information Landscape](concepts/information-landscape.md), then [System Dynamics](concepts/system-dynamics.md). Later-stage notes live in [Self, Values, And Curiosity](concepts/self-values-and-curiosity.md). Then read [Features](features.md), [Tests](tests.md), [Manual Testing](manual-testing.md), and the implementation notes for [network.js](code/network.js.doc.md).

For upcoming work, see [Roadmap](concepts/roadmap.md).
