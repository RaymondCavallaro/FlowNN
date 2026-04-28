# FlowNN

FlowNN is a pressure-network experiment for meaning-first routing.

The current app explores whether local pressure, resistance, thresholds, regional plasticity, and flood-style training can learn small truth-table behaviors without explicit signal labels, path history, or backprop-style route credit.

## App

The browser demo lives in [`wave-nn`](wave-nn/).

Run locally:

```bash
cd wave-nn
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Branches

- `main`: pressure-network demo and public project files.
- `v0.0.1`: time-routing working branch.
- `v0.0.2`: main pressure-network line.
- `v0.0.3`: consolidation and sparse field work.
- `v0.0.4`: arithmetic experiments.

## Tests

```bash
cd wave-nn
npm test
```
