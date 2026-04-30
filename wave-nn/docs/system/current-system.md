# Current System

[Portugues](../pt/system/current-system.md)

This page describes what the current system is, without historical detours.

## Current Goal

FlowNN currently studies whether a small pressure-routing system can learn and explain tiny truth-table behavior without explicit signal labels, symbolic gates, path traces, or backprop-style route credit.

## Runtime Shape

- source nodes: `A0`, `A1`, `B0`, `B1`;
- output nodes: `OUT0`, `OUT1`;
- operation valves from sources or recruited structures toward outputs;
- scaffold regions for origin/value meanings;
- optional explicit set/property scaffold;
- recruitment of weak separator nodes under repeated unresolved pressure;
- relation reader that extracts invariants from learned support;
- meta-regulation state that observes uncertainty and suggests controls.

## Current Boundaries

- Pressure payloads do not carry semantic types.
- Testing injects only input sources.
- Output-to-hidden reverse valves are not part of the current topology.
- Meta-regulation is observational; it does not yet drive controls automatically.
- Generative use is constrained to source-pair candidates from learned output relations.

## Current Success Criteria

The project values inspectability over raw performance. A useful change should make at least one of these clearer:

- how pressure moves;
- why a route became easier or harder;
- why recruitment happened;
- what relation was learned;
- how the math model explains the mechanism.

## Related

- [Core Flow](../core-flow.md)
- [Features](../features.md)
- [Math Model](../math/index.md)
- [Principles](../principles/index.md)
