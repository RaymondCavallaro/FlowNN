# Features

[Portugues](pt/features.md)

This page names the current FlowNN features explicitly. A feature is considered part of the current prototype only when it has either an automated test, a visible demo control/metric, or a concept doc explaining why it exists.

## Current Feature Set

| Feature | What It Means | Verified By |
| --- | --- | --- |
| Truth-table operations | XOR, AND, OR, and NAND provide the small measuring stick for pressure learning. | `truth table oracle matches supported operations` |
| Strength-only signal | A signal carries pressure strength only; identity comes from source node and topology. | `signal carries strength only` |
| Threshold activation | Nodes activate only when pressure crosses their threshold. | `threshold gates node activation` |
| Output flooding | During training, the desired output can act as a teacher pressure source. | `outputs can flood pressure during training` |
| Training-only teacher routes | Reverse output routes are reserved for training and should not leak into input-only testing. | `reverse output valves are training-only` |
| Bounded valve ecology | Valve openness approaches limits without becoming exactly open or closed. | `valve openness stays bounded` |
| Separate ecology modes | Valve and threshold controls can be adjusted independently. | `valves and thresholds use separate ecology modes` |
| Regional plasticity | Operation, origin, and value regions can consolidate at different rates. | `operation plasticity consolidates after stable cycles`; `scaffold training locks primitive regions` |
| Rarity-balanced teacher pressure | Rare expected outputs can receive stronger or longer teacher pressure. | `teacher strength balances rare outputs`; `teacher duration balances rare outputs` |
| Origin/value scaffold | Primitive source/value meanings are trained separately from operation meanings. | `semantic scaffold topology exists`; `scaffold training locks primitive regions` |
| Explicit set scaffold | Set/property concepts can be injected manually as an inspectable scaffold for later autonomous recruitment. | `set scaffold starts explicit and empty`; `inject set scaffold adds manual concepts` |
| Meaning explanation | Inspector explanations read structure from learned scaffold and relations. | `meaning explanations use scaffold primitives`; `relation reader extracts operation meanings` |
| Generative relation reading | A target output relation can generate candidate source pairs from its learned invariants. | `relation reader generates source candidates` |
| Meta-regulation scaffold | The network reports adaptive tension axes and suggested learning controls from stability, ambiguity, and recruitment pressure. | `meta regulation responds to uncertainty`; `meta regulation consolidates stable behavior` |
| Local valve learning | Flood training changes valve resistance and weight through co-activation. | `flood training changes valves` |
| Input-only diagnostics | Test cycles report peak, area, duration, and hybrid predictions. | `input-only tests produce diagnostic result shape` |
| Recruitable topology | The main topology starts without fixed pair nodes. | `recruitable topology starts without fixed pairs` |
| Separator recruitment | Repeated unresolved pressure can recruit a weak separator node with broad exploratory links inside the operation area. | `recruitment creates separators for repeated ambiguity` |
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
