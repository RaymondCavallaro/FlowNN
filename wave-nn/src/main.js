import { PressureNetwork, TRUTH_TABLE } from "./network.js";
import { Visualizer } from "./visualizer.js";

const canvas = document.querySelector("#stage");
const visualizer = new Visualizer(canvas);
const network = new PressureNetwork();

const controls = {
  autoToggle: document.querySelector("#autoToggle"),
  autoIcon: document.querySelector("#autoIcon"),
  trainRowButton: document.querySelector("#trainRowButton"),
  trainCycleButton: document.querySelector("#trainCycleButton"),
  trainScaffoldButton: document.querySelector("#trainScaffoldButton"),
  testCycleButton: document.querySelector("#testCycleButton"),
  resetButton: document.querySelector("#resetButton"),
  operationSelect: document.querySelector("#operationSelect"),
  sourceButtons: document.querySelectorAll("[data-source]"),
  rateSlider: document.querySelector("#rateSlider"),
  learningSlider: document.querySelector("#learningSlider"),
  strengthBalanceSlider: document.querySelector("#strengthBalanceSlider"),
  durationBalanceSlider: document.querySelector("#durationBalanceSlider"),
  valveModeSelect: document.querySelector("#valveModeSelect"),
  thresholdModeSelect: document.querySelector("#thresholdModeSelect"),
  autoTest: document.querySelector("#autoTest"),
  pressureMetric: document.querySelector("#pressureMetric"),
  changeMetric: document.querySelector("#changeMetric"),
  openMetric: document.querySelector("#openMetric"),
  plasticMetric: document.querySelector("#plasticMetric"),
  thresholdMetric: document.querySelector("#thresholdMetric"),
  cycleMetric: document.querySelector("#cycleMetric"),
  rowMetric: document.querySelector("#rowMetric"),
  accuracyMetric: document.querySelector("#accuracyMetric"),
  opMetric: document.querySelector("#opMetric"),
  modeMetric: document.querySelector("#modeMetric"),
  lastMetric: document.querySelector("#lastMetric"),
  inspector: document.querySelector("#inspector"),
};

const state = {
  running: false,
  lastFrame: performance.now(),
  autoClock: 0,
  selection: null,
  metrics: network.metrics(),
};

function settings() {
  return {
    operation: network.operation,
    rate: Number(controls.rateSlider.value),
    learning: Number(controls.learningSlider.value),
    strengthBalance: Number(controls.strengthBalanceSlider.value),
    durationBalance: Number(controls.durationBalanceSlider.value),
    valveMode: controls.valveModeSelect.value,
    thresholdMode: controls.thresholdModeSelect.value,
  };
}

function trainRow() {
  const current = settings();
  state.metrics = network.trainNextRow(current);
  if (controls.autoTest.checked) network.testCycle();
  state.metrics = network.metrics();
  renderInspector();
}

function trainCycle() {
  network.trainCycle(settings());
  if (controls.autoTest.checked) network.testCycle();
  state.metrics = network.metrics();
  renderInspector();
}

function trainScaffold() {
  network.trainScaffold({ learning: settings().learning, cycles: 4, lock: true });
  state.metrics = network.metrics();
  renderInspector();
}

function testCycle() {
  network.testCycle();
  state.metrics = network.metrics();
  renderInspector();
}

controls.autoToggle.addEventListener("click", () => {
  state.running = !state.running;
  controls.autoIcon.textContent = state.running ? "II" : "A";
  controls.autoToggle.title = state.running ? "Pause auto train" : "Start auto train";
});

controls.trainRowButton.addEventListener("click", () => trainRow());
controls.trainCycleButton.addEventListener("click", () => trainCycle());
controls.trainScaffoldButton.addEventListener("click", () => trainScaffold());
controls.testCycleButton.addEventListener("click", () => testCycle());

controls.resetButton.addEventListener("click", () => {
  network.reset(controls.operationSelect.value);
  state.autoClock = 0;
  state.selection = null;
  state.metrics = network.metrics();
  renderInspector();
});

controls.operationSelect.addEventListener("change", () => {
  network.reset(controls.operationSelect.value);
  state.autoClock = 0;
  state.metrics = network.metrics();
  renderInspector();
});

controls.sourceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    network.injectSource(button.dataset.source, 1.4);
    for (let step = 0; step < 10; step += 1) network.step({ learning: false });
    state.metrics = network.metrics();
    renderInspector();
  });
});

canvas.addEventListener("click", (event) => {
  state.selection = visualizer.pick(network, event.clientX, event.clientY);
  renderInspector();
});

function updateMetrics(metrics) {
  controls.pressureMetric.textContent = metrics.activePressure.toFixed(2);
  controls.changeMetric.textContent = metrics.valveChange.toFixed(2);
  controls.openMetric.textContent = metrics.valveStats.avg.toFixed(2);
  controls.plasticMetric.textContent = metrics.regions
    .map((region) => `${region.id[0]}:${region.plasticity.toFixed(2)}`)
    .join(" ");
  controls.thresholdMetric.textContent = metrics.thresholdStats.avg.toFixed(2);
  controls.cycleMetric.textContent = String(metrics.cycleCount);
  controls.rowMetric.textContent = `${metrics.truthIndex + 1}/${TRUTH_TABLE.length}`;
  controls.accuracyMetric.textContent = `${Math.round(metrics.rollingAccuracy * 100)}%`;
  controls.opMetric.textContent = metrics.operation.toUpperCase();
  controls.modeMetric.textContent = metrics.mode;
  controls.lastMetric.textContent = formatLast(metrics.lastResult);
}

function renderInspector() {
  if (!state.selection) {
    controls.inspector.innerHTML = "<h2>Inspector</h2><p>Click a node or valve.</p>";
    return;
  }

  if (state.selection.kind === "node") {
    const node = network.getNode(state.selection.id);
    const explanation = formatExplanation(network.explainNode(node.id));
    controls.inspector.innerHTML = `
      <h2>${node.id}</h2>
      <p>${node.label}</p>
      <dl>
        <dt>Role</dt><dd>${node.role}</dd>
        <dt>Pressure</dt><dd>${node.pressure.toFixed(3)}</dd>
        <dt>Threshold</dt><dd>${node.threshold.toFixed(3)}</dd>
        <dt>Threshold state</dt><dd>${node.thresholdState.toFixed(3)}</dd>
        <dt>Activation</dt><dd>${node.activation.toFixed(3)}</dd>
        <dt>Received</dt><dd>${node.received.toFixed(3)}</dd>
        <dt>Output</dt><dd>${node.role === "output" ? node.activation.toFixed(3) : "no"}</dd>
      </dl>
      ${explanation}
    `;
    return;
  }

  const valve = network.getValve(state.selection.id);
  controls.inspector.innerHTML = `
    <h2>${valve.from} -> ${valve.to}</h2>
    <p>Input valve</p>
    <dl>
      <dt>Source</dt><dd>${valve.from}</dd>
      <dt>Target</dt><dd>${valve.to}</dd>
      <dt>Region</dt><dd>${valve.region}</dd>
      <dt>Training only</dt><dd>${valve.trainingOnly ? "yes" : "no"}</dd>
      <dt>Openness</dt><dd>${valve.openness.toFixed(3)}</dd>
      <dt>Resistance</dt><dd>${valve.resistance.toFixed(3)}</dd>
      <dt>Aperture</dt><dd>${valve.aperture.toFixed(3)}</dd>
      <dt>Region plasticity</dt><dd>${network.regionPlasticity(valve.region).toFixed(3)}</dd>
      <dt>Weight</dt><dd>${valve.weight.toFixed(3)}</dd>
      <dt>Pressure</dt><dd>${valve.pressure.toFixed(3)}</dd>
      <dt>Activity</dt><dd>${valve.activity.toFixed(3)}</dd>
      <dt>Co-active</dt><dd>${valve.coactivity.toFixed(3)}</dd>
    </dl>
  `;
}

function formatExplanation(explanation) {
  if (!explanation) return "";
  if (explanation.meanings) {
    return `<h3>Forward meaning</h3><p>${formatWeighted(explanation.meanings)}</p>`;
  }
  if (explanation.inputs) {
    const sources = explanation.sources.join(" + ");
    const meanings = explanation.structuralMeaning
      .map((source) => `${source.id}: ${formatWeighted(source.meanings)}`)
      .join("<br />");
    const roles = explanation.functionalRole
      .map((role) => `${role.id} (${role.valueMeaning?.id ?? "no value"} ${role.strength.toFixed(2)})`)
      .join("<br />");
    return `
      <h3>Reasoning</h3>
      <p>mixed: ${sources}</p>
      <p>${explanation.relation.origin}, ${explanation.relation.value}</p>
      <dl>
        <dt>Structure</dt><dd>${meanings}</dd>
        <dt>Role</dt><dd>${roles}</dd>
      </dl>
    `;
  }
  if (explanation.supporters) {
    const supporters = explanation.supporters
      .map((supporter) => `${supporter.id}: ${supporter.relation.origin}, ${supporter.relation.value} (${supporter.strength.toFixed(2)})`)
      .join("<br />");
    return `
      <h3>Backward role</h3>
      <p>${explanation.valueMeaning?.id ?? "no value meaning"}</p>
      <dl>
        <dt>Supported by</dt><dd>${supporters}</dd>
      </dl>
    `;
  }
  if (explanation.inputs) return `<h3>Meaning</h3><p>${formatWeighted(explanation.inputs)}</p>`;
  return "";
}

function formatWeighted(items) {
  if (!items?.length) return "none";
  return items
    .slice(0, 4)
    .map((item) => `${item.id} ${item.strength.toFixed(2)}`)
    .join(", ");
}

function formatLast(result) {
  if (!result) return "--";
  const peak = result.predictions.peak === null ? "?" : result.predictions.peak;
  const area = result.predictions.area === null ? "?" : result.predictions.area;
  const duration = result.predictions.duration === null ? "?" : result.predictions.duration;
  const hybrid = result.predictions.hybrid === null ? "?" : result.predictions.hybrid;
  return `${result.a}${result.b}:P${peak} A${area} D${duration} H${hybrid}/${result.expected}`;
}

function frame(now) {
  const dt = Math.min(0.08, (now - state.lastFrame) / 1000);
  state.lastFrame = now;

  if (state.running && !network.hasStableAccuracy()) {
    state.autoClock += dt;
    const every = 1 / settings().rate;
    if (state.autoClock >= every) {
      state.autoClock = 0;
      trainCycle();
    }
  }

  state.metrics = network.metrics();
  visualizer.draw(network, settings(), state.selection);
  updateMetrics(state.metrics);
  requestAnimationFrame(frame);
}

renderInspector();
requestAnimationFrame(frame);
