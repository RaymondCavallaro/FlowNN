# Glossary

[Portugues](pt/glossary.md)

Short definitions for the main project terms.

## Signal

In the current runtime, a signal is pressure strength. It does not carry a semantic type.

## Pressure

The scalar quantity injected into nodes and routed through valves.

## Source Node

A node where pressure enters the graph. Source identity is structural: `A0` and `B1` differ because they are different entry points.

## PressureNode

The runtime node object. It accumulates pressure, activates past a threshold, and decays.

## InputValve

The runtime valve object. It connects one node to another and controls conductance with openness, resistance, and weight.

## Resistance

How hard it is for pressure to pass through a valve. Repeated useful co-flow can lower resistance.

## Weight

How strongly an open valve contributes to conductance.

## Meaning

A stable interpretation read from source identity, routing behavior, activation patterns, scaffold relations, and output response.

## Scaffold

An explicit, inspectable control layer used to give the system temporary conceptual structure. A scaffold should eventually be replaceable by generated or learned structure.

## Recruitment

Adding weak new structure when repeated unresolved pressure suggests the current topology is insufficient.

## Relation

An invariant pattern that remains stable across valid paths or cases.

## Time Material

Future pre-semantic temporal structure extracted from raw input, such as frequency, decay, recurrence, oscillation, and delay.

## Meta-Regulation

Observational signals about how much the system should explore, consolidate, loosen, tighten, or protect structure.
