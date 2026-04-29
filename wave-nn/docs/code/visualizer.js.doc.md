# visualizer.js

[Portugues](../pt/code/visualizer.js.doc.md)

`src/visualizer.js` draws the current network state to the canvas.

The visualization is diagnostic rather than decorative.

It shows:

- source, hidden, and output nodes;
- valve openness from resistance;
- valve pressure and recent activity;
- node pressure, activation, and threshold progress;
- selected node or valve state through the inspector in `main.js`.

Training-only valves are still styled distinctly when present, but the current topology no longer reserves output-to-hidden reverse valves.
