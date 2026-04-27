# visualizer.js

`src/visualizer.js` draws the current network state to the canvas.

The visualization is diagnostic rather than decorative.

It shows:

- source, hidden, and output nodes;
- valve openness from resistance;
- valve pressure and recent activity;
- node pressure, activation, and threshold progress;
- selected node or valve state through the inspector in `main.js`.

Training-only reverse valves are still drawn, so they can be inspected as reserved topology for later flood behavior.
