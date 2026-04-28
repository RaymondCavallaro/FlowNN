# Language

- Versao em Portugues: [README.md](README.md)
- English version (this one)

# FlowNN

Early pressure-network experiment for meaning-first routing.

The current prototype asks whether local pressure, resistance, thresholds, regional plasticity, and flood-style training can form useful paths for small truth-table tasks without explicit signal types, path history, or backprop-style route credit.

The system keeps simulation and interface separate. The network layer manages nodes, valves, regions, and local learning. The interface emits train/test commands and renders network state.

Made largely with AI.

## Demo

- GitHub Pages: [raymondcavallaro.github.io/FlowNN](https://raymondcavallaro.github.io/FlowNN/)

## What This Is

This repository is an open prototype for exploring a small pressure-learning loop:

- structural sources emit pulses without carrying semantic type
- local valves control resistance, openness, and weight
- nodes accumulate pressure until thresholds are crossed
- training floods activate the desired output alongside the inputs
- consolidated regions reduce plasticity without fully freezing the network

It is intentionally small and browser-first.

## Current Prototype

The current version is a plain browser app with:

- visual pressure-network simulation
- truth-table training for XOR, AND, OR, and NAND
- main mode without a fixed pair layer
- separator recruitment when repeated cases do not settle cleanly
- origin/value meaning scaffold
- relational reading of learned invariants
- ecology controls for valves and thresholds
- metrics for pressure, openness, plasticity, cycles, and accuracy

## Phase Direction

The goal of this phase is not to prove a general model.

The goal is to keep a small lab where it is possible to observe:

- signal identity as source structure and topology
- local learning through co-activation and pressure
- topology growth from unresolved pressure
- continuous consolidation instead of binary freezing
- meaning read from structural invariants

Arithmetic experiments live separately on the `v0.0.4` branch.

## Project Structure

- `wave-nn/index.html` is the browser entry point
- `wave-nn/src/` contains simulation, visualizer, and styles
- `wave-nn/test/` contains network model tests
- `wave-nn/docs/` contains conceptual and implementation notes
- `.github/workflows/pages.yml` publishes the app to GitHub Pages

## Branches

- `main`: pressure-network demo and public project files
- `v0.0.1`: time working line
- `v0.0.2`: main pressure-network line
- `v0.0.3`: consolidation and sparse field work
- `v0.0.4`: arithmetic experiments

## Run Locally

```bash
cd wave-nn
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

## Tests

```bash
cd wave-nn
npm test
```

## Status

This is a concept test, not a finished product.

The goal right now is to keep the architecture easy to change while the meaning-first pressure-network idea becomes clearer.
