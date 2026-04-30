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
- No output-to-hidden reverse valves in the current topology.
- Output relation reads that can propose constrained source-pair candidates.
- Observational meta-regulation axes for plasticity, exploration, certainty, and constraint pressure.
- Manual set/property scaffold injection, kept explicit so it can later become automatic recruitment.

## Reading Path

Start with [Overview](overview.md), [Walkthrough](walkthrough.md), [Core Flow](core-flow.md), and [Glossary](glossary.md).

Then read [Current System](system/current-system.md), [Principles](principles/index.md), and the [Math Model](math/index.md). After that, use [Pressure Network](concepts/pressure-network.md), [Temporal Computation](concepts/temporal-computation.md), [Topology](concepts/topology.md), [Relational Meaning](concepts/relational-meaning.md), [Information Landscape](concepts/information-landscape.md), [Meta-Regulation](concepts/meta-regulation.md), and [System Dynamics](concepts/system-dynamics.md) as deeper references.

Historical decisions and failed mechanisms live in [Lessons](lessons/index.md) and [Project History](history/project-history.md), not in the current system description.

For implementation status, read [Features](features.md), [Tests](tests.md), [Manual Testing](manual-testing.md), and the implementation notes for [network.js](code/network.js.doc.md).

For upcoming work, see [Roadmap](concepts/roadmap.md).
