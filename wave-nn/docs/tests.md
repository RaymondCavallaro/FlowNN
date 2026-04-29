# Tests

[Portugues](pt/tests.md)

The automated test file is `test/pressure-network.test.js`.

Every test is registered with:

- `name`: the behavior being checked;
- `kind`: `feature` or `error`;
- `covers`: the feature or failure mode it protects;
- `run`: the function that performs the assertion.

## Test Map

| Kind | Test | Covers |
| --- | --- | --- |
| feature | truth table oracle matches supported operations | truth-table operation definitions |
| error | signal carries strength only | no semantic type stored in Signal |
| feature | threshold gates node activation | pressure threshold activation |
| feature | outputs can flood pressure during training | teacher output as active pressure source |
| feature | shaped pair topology is structural | reference pair-node topology |
| error | reverse output valves are training-only | teacher routes do not leak into input-only testing |
| error | valve openness stays bounded | asymptotic valve ecology |
| feature | valves and thresholds use separate ecology modes | independent valve/threshold controls |
| feature | operation plasticity consolidates after stable cycles | regional plasticity consolidation |
| feature | teacher strength balances rare outputs | rarity-balanced teacher pressure |
| feature | teacher duration balances rare outputs | rarity-balanced teacher duration |
| feature | semantic scaffold topology exists | origin/value primitive regions |
| feature | scaffold training locks primitive regions | origin/value consolidation |
| feature | meaning explanations use scaffold primitives | pair-node explanation from primitive meanings |
| feature | relation reader extracts operation meanings | operation invariants from learned structure |
| feature | relation reader generates source candidates | target output to candidate source generation |
| feature | meta regulation responds to uncertainty | adaptive tension axes under unresolved behavior |
| feature | meta regulation consolidates stable behavior | adaptive tension axes under stable behavior |
| feature | flood training changes valves | local co-activation learning |
| error | input-only tests produce diagnostic result shape | test result schema and diagnostic scores |
| feature | recruitable topology starts without fixed pairs | under-structured main topology |
| feature | recruitment creates separators for repeated ambiguity | broad separator recruitment from unresolved pressure |
| feature | recruitable topology attempts bitwise operations | end-to-end XOR/AND/OR/NAND exploratory evaluation |

## Why Some Tests Are Error Tests

An `error` test protects against a failure mode rather than proving a positive feature. For this project, the most important failure modes are:

- semantic type sneaking back into `Signal`;
- teacher output pressure leaking into normal input-only tests;
- valve openness reaching exact hard limits;
- test result shape changing without updating docs and UI expectations.

## Running

```bash
cd wave-nn
npm test
```

The browser demo does not run the automated test file. Use the manual guide when you want to reproduce the visible behavior by hand.
