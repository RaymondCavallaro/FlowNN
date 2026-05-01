# Features

[Portugues](pt/features.md)

This page names the current FlowNN features explicitly. A feature is considered part of the current prototype only when it has either an automated test, a visible demo control/metric, or a concept doc explaining why it exists.

## Current Feature Set

| Feature | What It Means | Verified By |
| --- | --- | --- |
| Truth-table operations | XOR, AND, OR, and NAND provide the small measuring stick for pressure learning. | `truth table oracle matches supported operations` |
| Structural source identity | Pressure carries strength only; identity comes from source node and topology. | `source identity is structural` |
| Threshold activation | Nodes activate only when pressure crosses their threshold. | `threshold gates node activation` |
| Node temporal memory | Node decay controls how much pressure persists after activation. | `node decay controls temporal persistence` |
| Conductance-shaped emission | Node activation is distributed through outgoing valve support. | `emission follows valve route support` |
| Output flooding | During training, the desired output can act as a teacher pressure source. | `outputs can flood pressure during training` |
| Omitted reverse teacher routes | Output-to-hidden reverse routes are absent; teacher pressure stays local to the expected output. | `output reverse valves are omitted` |
| Bounded valve ecology | Valve openness approaches limits without becoming exactly open or closed. | `valve openness stays bounded` |
| Separate ecology modes | Valve and threshold controls can be adjusted independently. | `valves and thresholds use separate ecology modes` |
| Regional plasticity | Operation, origin, and value regions can consolidate at different rates. | `operation plasticity consolidates after stable cycles`; `scaffold training locks primitive regions` |
| Rarity-balanced teacher pressure | Rare expected outputs can receive stronger or longer teacher pressure. | `teacher strength balances rare outputs`; `teacher duration balances rare outputs` |
| Origin/value scaffold | Primitive source/value meanings are trained separately from operation meanings. | `semantic scaffold topology exists`; `scaffold training locks primitive regions` |
| Explicit set scaffold | Set/property concepts can be injected manually as an inspectable scaffold for later autonomous recruitment. | `set scaffold starts explicit and empty`; `inject set scaffold adds manual concepts` |
| Generated set scaffold | A functional scaffold description can regenerate the same set/property behavior and plug it back into recruitment. | `generated set scaffold matches manual functionality`; `generated set scaffold plugs into recruitment` |
| Meaning explanation | Inspector explanations read structure from learned scaffold and relations. | `meaning explanations use scaffold primitives`; `relation reader extracts operation meanings` |
| Generative relation reading | A target output relation can generate candidate source pairs from its learned invariants. | `relation reader generates source candidates` |
| Route dynamics reader | External scaffold reads route support, recent flow, resistance, recurrence, trace residue, and usefulness to infer availability without storing lifecycle buckets. | `route dynamics reader infers availability` |
| Route-supported generation | Generated candidates carry route evidence and are ranked by inferred support from learned dynamics. | `generated candidates carry route evidence` |
| Meta-regulation scaffold | The network reports adaptive tension axes and suggested learning controls from stability, ambiguity, and recruitment pressure. | `meta regulation responds to uncertainty`; `meta regulation consolidates stable behavior` |
| Local valve learning | Flood training changes valve resistance and weight through co-activation. | `flood training changes valves` |
| Input-only diagnostics | Test cycles report peak, area, duration, and hybrid predictions. | `input-only tests produce diagnostic result shape` |
| Recruitable topology | The main topology starts without fixed pair nodes. | `recruitable topology starts without fixed pairs` |
| Separator recruitment | Repeated unresolved pressure can recruit a weak separator node using the current recruitment strategy tuner. | `recruitment creates separators for repeated ambiguity` |
| Experimental recruitment policy | Separator recruitment uses a secondary axis tuner to choose and refine connection strategies from case context and survival feedback. | `set scaffold guides recruitment connections`; `recruitment strategy space includes scaffold option`; `recruitment axis demand is case dependent`; `recruitment strategies tune from survival` |
| Bitwise exploratory evaluation | Recruitable topology attempts XOR, AND, OR, and NAND with broad recruits; success is not guaranteed by this feature. | `recruitable topology attempts bitwise operations` |

## Not Current Features Yet

These are roadmap directions, not finished claims:

- general arithmetic reasoning;
- open-ended generation beyond the current source-pair lab;
- fixed topology-free transfer across large domains;
- active landscape probing as a browser control;
- unified expectation/error/precision state inside every node;
- temporal routing as part of the main runtime.

They stay in docs as direction until they have tests or visible demo behavior.
