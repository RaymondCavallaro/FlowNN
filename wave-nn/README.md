# Wave NN

A small browser simulation for pressure-shaped wave routing.

Each node routes incoming signals through outgoing valves. The current prototype has four dedicated input/control nodes:

- IN0: `0` signal
- IN1: `1` signal
- INT: tighten feedback
- INL: loosen feedback

Four signal types are available:

- `0`
- `1`
- `tighten`
- `loosen`

A signal carries:

- strength
- frequency
- phase
- time through the simulation loop

Each valve has:

- size: maximum throughput
- frequency: preferred repetition pattern
- phase: preferred timing alignment
- looseness: tolerance around frequency and phase
- pressure: accumulated mismatch
- weight: pathway usefulness after repeated successful routing

Good matches strengthen and tune the valve. Poor matches create pressure. Pressure loosens valves and can trigger spread, pushing signal through more pathways to search for new patterns.

Training examples inject two bit signals through the `0` and `1` input nodes. Four fixed output sinks receive `00`, `01`, `10`, and `11` patterns. When a paired pattern reaches its assigned output and the selected operation says that case is true, `tighten` feedback is injected. Otherwise, `loosen` feedback is injected. Output nodes are sinks: they receive signal and consume it.

The tighten and loosen inputs are isolated control inputs. They do not route through the graph; instead, their active signal energy globally nudges every valve's looseness down or up. Reactor feedback injects these controls automatically, while manual `T` and `L` pulses are still available for experiments.

The graph includes recurrent links, so waves can travel forward, loop back, and form circulating pathways. There is no explicit path-history credit assignment. Learning pressure stays local: valves adapt from their current fit, pressure, and memory. Tighten and loosen controls act hardest on valves that are already tight, without using flow trace as a shortcut.

Control pulses have adaptive amplitude. Stronger activation produces stronger control. Recent accuracy biases the control gains: higher accuracy amplifies tighten feedback to stabilize useful narrow pathways, while lower accuracy amplifies loosen feedback to encourage exploration.

## Run

From this folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Controls

- Pause/resume the simulation.
- Inject a training example.
- Reset the network.
- Pick XOR, AND, OR, or NAND, then reset to restart the fixed output task.
- Inject manual `0`, `1`, `tighten`, or `loosen` signals through their dedicated input/control nodes.
- Adjust learning strength.
- Toggle automatic pulsing.
- Switch pulse mode between clocked pulses and wait-until-settled pulses.
- Click a node or valve to inspect active signals, pressure, tuning, and type affinity.

## Visual Language

- Bright teal glow: active signal.
- Red glow: accumulated pressure.
- Thicker lines: looser or higher-throughput valves.
- Brighter valve lines: recently used routes.
- Spread count: pressure-forced routing events.
