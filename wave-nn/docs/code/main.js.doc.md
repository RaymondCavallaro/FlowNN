# main.js

[Portugues](../pt/code/main.js.doc.md)

`src/main.js` wires the pressure engine to the browser UI.

It owns:

- button handlers;
- operation selection;
- auto-training cadence;
- manual source pulses;
- manual set/property scaffold injection;
- generated set/property scaffold injection;
- metrics display;
- inspector rendering;
- animation frame scheduling.

The UI intentionally exposes training and testing separately. Flood training should not be mixed into accuracy metrics; accuracy comes from input-only tests.
