import { SIGNAL_TYPES, WaveNetwork } from "./network.js";
import { Visualizer } from "./visualizer.js";

const canvas = document.querySelector("#stage");
const visualizer = new Visualizer(canvas);
const network = new WaveNetwork();

const controls = {
  playToggle: document.querySelector("#playToggle"),
  playIcon: document.querySelector("#playIcon"),
  trainButton: document.querySelector("#trainButton"),
  resetButton: document.querySelector("#resetButton"),
  operationSelect: document.querySelector("#operationSelect"),
  signalButtons: document.querySelectorAll("[data-signal]"),
  rateSlider: document.querySelector("#rateSlider"),
  pulseModeSelect: document.querySelector("#pulseModeSelect"),
  learningSlider: document.querySelector("#learningSlider"),
  autoPulse: document.querySelector("#autoPulse"),
  signalMetric: document.querySelector("#signalMetric"),
  pressureMetric: document.querySelector("#pressureMetric"),
  spreadMetric: document.querySelector("#spreadMetric"),
  valveMetric: document.querySelector("#valveMetric"),
  accuracyMetric: document.querySelector("#accuracyMetric"),
  opMetric: document.querySelector("#opMetric"),
  pulseMetric: document.querySelector("#pulseMetric"),
  controlMetric: document.querySelector("#controlMetric"),
  inspector: document.querySelector("#inspector"),
};

const state = {
  running: true,
  lastFrame: performance.now(),
  pulseClock: 0,
  settleClock: 0,
  truthIndex: 0,
  selection: null,
  metrics: {
    routedEnergy: 0,
    pressure: 0,
    spreadEvents: 0,
    valveCount: network.valves.length,
    activeSignals: 0,
    accuracy: 0,
    feedbackStats: { tighten: 0, loosen: 0 },
    controlEnergy: { tighten: 0, loosen: 0 },
    controlGain: { tighten: 1, loosen: 1, activation: 1 },
  },
};

function settings() {
  return {
    operation: network.operation,
    rate: Number(controls.rateSlider.value),
    pulseMode: controls.pulseModeSelect.value,
    learning: Number(controls.learningSlider.value),
  };
}

function injectTrainingExample() {
  const truthTable = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const [a, b] = truthTable[state.truthIndex % truthTable.length];
  state.truthIndex += 1;
  network.injectExample({ a: Boolean(a), b: Boolean(b), operation: network.operation });
}

function injectManualSignal(type) {
  network.inject({
    type,
    strength: type === "tighten" || type === "loosen" ? 1.25 : 1,
  });
}

function updateMetrics(metrics) {
  controls.signalMetric.textContent = metrics.activeSignals.toFixed(2);
  controls.pressureMetric.textContent = metrics.pressure.toFixed(2);
  controls.spreadMetric.textContent = String(metrics.spreadEvents);
  controls.valveMetric.textContent = String(metrics.valveCount);
  controls.accuracyMetric.textContent = `${Math.round(metrics.accuracy * 100)}%`;
  controls.opMetric.textContent = (metrics.operation || network.operation).toUpperCase();
  controls.pulseMetric.textContent = controls.pulseModeSelect.value === "wait" ? "Wait" : "Clock";
  const controlsNet = (metrics.controlEnergy?.loosen ?? 0) - (metrics.controlEnergy?.tighten ?? 0);
  controls.controlMetric.textContent = controlsNet.toFixed(2);
}

controls.playToggle.addEventListener("click", () => {
  state.running = !state.running;
  controls.playIcon.textContent = state.running ? "II" : ">";
  controls.playToggle.title = state.running ? "Pause simulation" : "Resume simulation";
});

controls.trainButton.addEventListener("click", () => injectTrainingExample());

controls.resetButton.addEventListener("click", () => {
  network.reset(controls.operationSelect.value);
  state.pulseClock = 0;
  state.settleClock = 0;
  state.truthIndex = 0;
  state.selection = null;
  injectTrainingExample();
  renderInspector();
});

controls.signalButtons.forEach((button) => {
  button.addEventListener("click", () => injectManualSignal(button.dataset.signal));
});

controls.operationSelect.addEventListener("change", () => {
  controls.opMetric.textContent = controls.operationSelect.value.toUpperCase();
});

controls.pulseModeSelect.addEventListener("change", () => {
  state.pulseClock = 0;
  state.settleClock = 0;
  controls.pulseMetric.textContent = controls.pulseModeSelect.value === "wait" ? "Wait" : "Clock";
});

canvas.addEventListener("click", (event) => {
  state.selection = visualizer.pick(network, event.clientX, event.clientY);
  renderInspector();
});

function renderInspector() {
  if (!state.selection) {
    controls.inspector.innerHTML = "<h2>Inspector</h2><p>Click a node or valve.</p>";
    return;
  }

  if (state.selection.kind === "node") {
    const node = network.getNode(state.selection.id);
    const signals = network.signals.filter((signal) => signal.nodeId === node.id);
    const signalText = signals.length
      ? signals.map((signal) => SIGNAL_TYPES[signal.type]?.label ?? signal.type).join(", ")
      : "none";
    const outputEnergy = network.outputEnergy?.[node.id] ?? 0;
    controls.inspector.innerHTML = `
      <h2>${node.id}</h2>
      <p>${node.label || node.role}</p>
      <dl>
        <dt>Role</dt><dd>${node.role}</dd>
        <dt>Output</dt><dd>${outputLabel(node.id)}</dd>
        <dt>Control</dt><dd>${controlLabel(node.id)}</dd>
        <dt>Feedback</dt><dd>T ${network.feedbackStats.tighten} / L ${network.feedbackStats.loosen}</dd>
        <dt>Sink energy</dt><dd>${outputEnergy.toFixed(2)}</dd>
        <dt>Active signals</dt><dd>${signals.length}</dd>
        <dt>Types</dt><dd>${signalText}</dd>
      </dl>
    `;
    return;
  }

  const valve = network.getValve(state.selection.id);
  const affinity = Object.entries(valve.affinity)
    .map(([type, value]) => `${SIGNAL_TYPES[type]?.label ?? type}: ${value.toFixed(2)}`)
    .join("<br>");
  controls.inspector.innerHTML = `
    <h2>${valve.from} -> ${valve.to}</h2>
    <p>Valve ${valve.id}</p>
    <dl>
      <dt>Size</dt><dd>${valve.size.toFixed(2)}</dd>
      <dt>Frequency</dt><dd>${valve.frequency.toFixed(2)}</dd>
      <dt>Phase</dt><dd>${valve.phase.toFixed(2)}</dd>
      <dt>Looseness</dt><dd>${valve.looseness.toFixed(3)}</dd>
      <dt>Pressure</dt><dd>${valve.pressure.toFixed(2)}</dd>
      <dt>Weight</dt><dd>${valve.weight.toFixed(2)}</dd>
      <dt>Trace</dt><dd>${valve.trace.toFixed(2)}</dd>
      <dt>Memory</dt><dd>${valve.memory.toFixed(2)}</dd>
      <dt>Affinity</dt><dd>${affinity}</dd>
    </dl>
  `;
}

injectTrainingExample();

function frame(now) {
  const dt = Math.min(0.05, (now - state.lastFrame) / 1000);
  state.lastFrame = now;
  const current = settings();

  if (state.running) {
    state.pulseClock += dt;
    state.metrics = network.step(dt, current);
    const pulseEvery = Math.max(0.16, 1 / current.rate);
    const isSettled = state.metrics.activeSignals < 0.16;
    state.settleClock = isSettled ? state.settleClock + dt : 0;

    if (controls.autoPulse.checked && shouldSendPulse(current, pulseEvery)) {
      state.pulseClock = 0;
      state.settleClock = 0;
      injectTrainingExample();
    }
  }

  visualizer.draw(network, current, state.selection);
  updateMetrics(state.metrics);
  if (state.selection && Math.floor(network.time * 5) % 5 === 0) renderInspector();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

function outputLabel(nodeId) {
  const entry = Object.entries(network.outputMap).find(([, id]) => id === nodeId);
  if (!entry) return "no";
  return `${entry[0]} for ${network.operation.toUpperCase()}`;
}

function controlLabel(nodeId) {
  if (nodeId === "INT") return `tighten ${network.controlEnergy.tighten.toFixed(2)} x${network.controlGain.tighten.toFixed(2)}`;
  if (nodeId === "INL") return `loosen ${network.controlEnergy.loosen.toFixed(2)} x${network.controlGain.loosen.toFixed(2)}`;
  return "no";
}

function shouldSendPulse(current, pulseEvery) {
  if (current.pulseMode === "clock") return state.pulseClock >= pulseEvery;
  const waitedLongEnough = state.pulseClock >= 0.28;
  const settledEnough = state.settleClock >= 0.22;
  const timeout = state.pulseClock >= 2.6;
  return waitedLongEnough && (settledEnough || timeout);
}
