import { clamp } from "./math.js";

export const OPERATIONS = ["xor", "and", "or", "nand"];
export const TRUTH_TABLE = [
  { a: 0, b: 0 },
  { a: 0, b: 1 },
  { a: 1, b: 0 },
  { a: 1, b: 1 },
];

const SETTLE_STEPS = 18;
const TRAIN_STEPS = 22;
const ROLLING_WINDOW = 32;
const VALVE_ECOLOGY_RATE = 0.006;
const THRESHOLD_ECOLOGY_RATE = 0.01;
const MIN_REGION_PLASTICITY = 0.12;
const MAX_REGION_PLASTICITY = 1.8;
const LOCKED_REGION_PLASTICITY = 0.18;
const RECRUITMENT_OBSERVATION_THRESHOLD = 2;
const LOW_MARGIN_THRESHOLD = 0.16;

function sigmoid(value) {
  if (value > 40) return 1 - 1e-12;
  if (value < -40) return 1e-12;
  return 1 / (1 + Math.exp(-value));
}

function logit(value) {
  const bounded = clamp(value, 0.001, 0.999);
  return Math.log(bounded / (1 - bounded));
}

export class Signal {
  constructor({ strength }) {
    this.strength = strength;
  }
}

export class PressureNode {
  constructor({ id, label, role, x, y, threshold = 1, decay = 0.72, recruitment = null }) {
    this.id = id;
    this.label = label;
    this.role = role;
    this.recruitment = recruitment;
    this.x = x;
    this.y = y;
    this.minThreshold = role === "source" ? threshold : threshold * 0.45;
    this.maxThreshold = role === "source" ? threshold : threshold * 1.9;
    this.thresholdState = role === "source"
      ? 0
      : logit((threshold - this.minThreshold) / (this.maxThreshold - this.minThreshold));
    this.decay = decay;
    this.pressure = 0;
    this.activation = 0;
    this.received = 0;
    this.pulse = 0;
  }

  get threshold() {
    if (this.role === "source") return this.minThreshold;
    return this.minThreshold + (this.maxThreshold - this.minThreshold) * sigmoid(this.thresholdState);
  }

  adjustThreshold(amount) {
    if (this.role === "source") return;
    this.thresholdState += amount;
  }

  resetRuntime() {
    this.pressure = 0;
    this.activation = 0;
    this.received = 0;
    this.pulse = 0;
  }

  inject(strength) {
    this.pressure += strength;
    this.received += strength;
    this.pulse = Math.max(this.pulse, strength);
  }

  settle() {
    if (this.role === "source") {
      this.activation = this.pressure;
      this.pressure *= 0.12;
    } else if (this.role === "output") {
      this.activation = this.pressure >= this.threshold ? this.pressure : this.received;
      this.pressure *= this.decay;
    } else {
      this.activation = this.pressure >= this.threshold ? this.pressure : 0;
      this.pressure *= this.decay;
    }

    this.received *= 0.58;
    this.pulse *= 0.7;
  }
}

export class InputValve {
  constructor({ id, from, to, resistance = 0.5, weight = 1, region = "operation", trainingOnly = false }) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.region = region;
    this.trainingOnly = trainingOnly;
    this.aperture = logit(1 - resistance);
    this.weight = weight;
    this.pressure = 0;
    this.activity = 0;
    this.coactivity = 0;
  }

  get openness() {
    return sigmoid(this.aperture);
  }

  get resistance() {
    return 1 - this.openness;
  }

  adjustOpenness(amount) {
    this.aperture += amount;
  }

  resetRuntime() {
    this.pressure = 0;
    this.activity = 0;
    this.coactivity = 0;
  }

  conduct(sourceActivation, totalConductance = 1) {
    const conductance = this.weight * this.openness;
    const throughput = sourceActivation * conductance / Math.max(1, totalConductance);
    this.pressure += throughput;
    this.activity = Math.max(this.activity, throughput);
    return throughput;
  }

  cool() {
    this.pressure *= 0.66;
    this.activity *= 0.62;
    this.coactivity *= 0.7;
  }
}

export class PressureNetwork {
  constructor({ topology = "recruitable" } = {}) {
    this.topology = topology;
    this.operation = "xor";
    this.nodes = [];
    this.valves = [];
    this.truthIndex = 0;
    this.cycleCount = 0;
    this.trainSteps = 0;
    this.testSteps = 0;
    this.scaffoldTrainSteps = 0;
    this.lastMode = "idle";
    this.lastCase = null;
    this.lastResult = null;
    this.testHistory = [];
    this.regions = [];
    this.operationRegion = null;
    this.lastCycleAccuracy = null;
    this.perfectCycleStreak = 0;
    this.lastCycleSummary = null;
    this.recruitment = null;
    this.time = 0;
    this.reset();
  }

  reset(operation = this.operation, { topology = this.topology } = {}) {
    this.topology = topology;
    this.operation = operation;
    this.truthIndex = 0;
    this.cycleCount = 0;
    this.trainSteps = 0;
    this.testSteps = 0;
    this.scaffoldTrainSteps = 0;
    this.lastMode = "idle";
    this.lastCase = null;
    this.lastResult = null;
    this.testHistory = [];
    this.regions = [
      { id: "origin", label: "origin", plasticity: 1, locked: false },
      { id: "value", label: "value", plasticity: 1, locked: false },
      { id: "operation", label: "operation", plasticity: 1, locked: false },
    ];
    this.operationRegion = this.getRegion("operation");
    this.lastCycleAccuracy = null;
    this.perfectCycleStreak = 0;
    this.lastCycleSummary = null;
    this.recruitment = {
      enabled: this.topology === "recruitable",
      nextId: 0,
      observations: new Map(),
      events: [],
    };
    this.time = 0;

    this.nodes = [
      new PressureNode({ id: "A0", label: "A = 0", role: "source", x: 0.08, y: 0.22 }),
      new PressureNode({ id: "A1", label: "A = 1", role: "source", x: 0.08, y: 0.40 }),
      new PressureNode({ id: "B0", label: "B = 0", role: "source", x: 0.08, y: 0.60 }),
      new PressureNode({ id: "B1", label: "B = 1", role: "source", x: 0.08, y: 0.78 }),
      new PressureNode({ id: "ORIGIN_A", label: "origin A", role: "meaning", x: 0.26, y: 0.14, threshold: 0.75, decay: 0.58 }),
      new PressureNode({ id: "ORIGIN_B", label: "origin B", role: "meaning", x: 0.26, y: 0.90, threshold: 0.75, decay: 0.58 }),
      new PressureNode({ id: "VALUE_0", label: "value 0", role: "meaning", x: 0.55, y: 0.12, threshold: 0.75, decay: 0.58 }),
      new PressureNode({ id: "VALUE_1", label: "value 1", role: "meaning", x: 0.55, y: 0.90, threshold: 0.75, decay: 0.58 }),
      new PressureNode({ id: "OUT0", label: "output 0", role: "output", x: 0.88, y: 0.38, threshold: 0.8 }),
      new PressureNode({ id: "OUT1", label: "output 1", role: "output", x: 0.88, y: 0.64, threshold: 0.8 }),
    ];

    const pairNodes = [
      new PressureNode({ id: "H0", label: "pair 00", role: "hidden", x: 0.38, y: 0.26, threshold: 1, decay: 0.5 }),
      new PressureNode({ id: "H1", label: "pair 01", role: "hidden", x: 0.38, y: 0.44, threshold: 1, decay: 0.5 }),
      new PressureNode({ id: "H2", label: "pair 10", role: "hidden", x: 0.38, y: 0.62, threshold: 1, decay: 0.5 }),
      new PressureNode({ id: "H3", label: "pair 11", role: "hidden", x: 0.38, y: 0.80, threshold: 1, decay: 0.5 }),
    ];
    if (this.topology === "shaped") this.nodes.splice(8, 0, ...pairNodes);

    const originLinks = [
      ["A0", "ORIGIN_A"], ["A1", "ORIGIN_A"],
      ["B0", "ORIGIN_B"], ["B1", "ORIGIN_B"],
    ];

    const valueLinks = [
      ["A0", "VALUE_0"], ["B0", "VALUE_0"], ["OUT0", "VALUE_0"],
      ["A1", "VALUE_1"], ["B1", "VALUE_1"], ["OUT1", "VALUE_1"],
    ];

    const pairSourceLinks = [
      ["A0", "H0"], ["B0", "H0"],
      ["A0", "H1"], ["B1", "H1"],
      ["A1", "H2"], ["B0", "H2"],
      ["A1", "H3"], ["B1", "H3"],
    ];

    const reversibleLinks = [
      ["H0", "OUT0"], ["H0", "OUT1"], ["H1", "OUT0"], ["H1", "OUT1"],
      ["H2", "OUT0"], ["H2", "OUT1"], ["H3", "OUT0"], ["H3", "OUT1"],
    ];

    const directOperationLinks = [
      ["A0", "OUT0"], ["A0", "OUT1"],
      ["A1", "OUT0"], ["A1", "OUT1"],
      ["B0", "OUT0"], ["B0", "OUT1"],
      ["B1", "OUT0"], ["B1", "OUT1"],
    ];

    const operationLinks = this.topology === "shaped"
      ? [
        ...pairSourceLinks.map(([from, to]) => ({ from, to, region: "operation" })),
        ...reversibleLinks.map(([from, to]) => ({ from, to, region: "operation" })),
        ...reversibleLinks.map(([from, to]) => ({ from: to, to: from, region: "operation", trainingOnly: true })),
      ]
      : directOperationLinks.map(([from, to]) => ({ from, to, region: "operation" }));

    const links = [
      ...originLinks.map(([from, to]) => ({ from, to, region: "origin" })),
      ...valueLinks.map(([from, to]) => ({ from, to, region: "value" })),
      ...operationLinks,
    ];

    this.valves = links.map(({ from, to, region = "operation", trainingOnly = false }) => {
      return new InputValve({
        id: `${from}->${to}`,
        from,
        to,
        region,
        trainingOnly,
        resistance: this.topology === "recruitable" && region === "operation" ? 0.72 : 0.5,
        weight: this.topology === "recruitable" && region === "operation" ? 0.55 : 1,
      });
    });
  }

  getNode(id) {
    return this.nodes.find((node) => node.id === id);
  }

  getValve(id) {
    return this.valves.find((valve) => valve.id === id);
  }

  getRegion(id) {
    return this.regions.find((region) => region.id === id);
  }

  regionPlasticity(id) {
    return this.getRegion(id)?.plasticity ?? 1;
  }

  trainScaffold({ learning = 0.65, cycles = 1, lock = true } = {}) {
    const scaffoldCases = [
      { inputs: ["A0"], target: "ORIGIN_A" },
      { inputs: ["A1"], target: "ORIGIN_A" },
      { inputs: ["B0"], target: "ORIGIN_B" },
      { inputs: ["B1"], target: "ORIGIN_B" },
      { inputs: ["A0"], target: "VALUE_0" },
      { inputs: ["B0"], target: "VALUE_0" },
      { inputs: ["OUT0"], target: "VALUE_0" },
      { inputs: ["A1"], target: "VALUE_1" },
      { inputs: ["B1"], target: "VALUE_1" },
      { inputs: ["OUT1"], target: "VALUE_1" },
    ];

    this.lastMode = "scaffold";
    for (let cycle = 0; cycle < cycles; cycle += 1) {
      for (const scaffoldCase of scaffoldCases) {
        this.trainScaffoldCase(scaffoldCase, { learning });
      }
    }

    if (lock) this.lockScaffoldRegions();
    return this.metrics();
  }

  trainScaffoldCase(scaffoldCase, { learning = 0.65 } = {}) {
    this.clearRuntime();
    this.lastMode = "scaffold";
    this.lastCase = null;

    for (let step = 0; step < Math.round(TRAIN_STEPS * 0.75); step += 1) {
      for (const inputId of scaffoldCase.inputs) this.getNode(inputId).inject(1.1);
      this.getNode(scaffoldCase.target).inject(1.25);
      this.step({
        learning: true,
        learningRate: learning,
        teacherNodeId: scaffoldCase.target,
        activeRegions: [this.getNode(scaffoldCase.target).id.startsWith("ORIGIN_") ? "origin" : "value"],
      });
    }

    this.scaffoldTrainSteps += 1;
  }

  lockScaffoldRegions() {
    for (const id of ["origin", "value"]) {
      const region = this.getRegion(id);
      region.plasticity = LOCKED_REGION_PLASTICITY;
      region.locked = true;
    }
  }

  nextTruthCase() {
    const row = TRUTH_TABLE[this.truthIndex % TRUTH_TABLE.length];
    const truthCase = this.caseFor(row.a, row.b);
    this.truthIndex += 1;
    if (this.truthIndex % TRUTH_TABLE.length === 0) this.cycleCount += 1;
    return truthCase;
  }

  caseFor(a, b) {
    const expected = evaluateOperation(Boolean(a), Boolean(b), this.operation) ? 1 : 0;
    return {
      a,
      b,
      inputIds: [`A${a}`, `B${b}`],
      expected,
      expectedOutputId: `OUT${expected}`,
      outputRarity: this.outputRarityFor(expected),
    };
  }

  outputRarityFor(expected) {
    const count = TRUTH_TABLE.filter((row) => {
      return evaluateOperation(Boolean(row.a), Boolean(row.b), this.operation) === Boolean(expected);
    }).length;
    return TRUTH_TABLE.length / Math.max(1, count);
  }

  teacherStrengthFor(truthCase, strengthBalance = 0.5) {
    const rarity = truthCase.outputRarity;
    const distinctiveness = 1 + (rarity - 1) * 0.12;
    return 1.1 * Math.pow(rarity, strengthBalance) * distinctiveness;
  }

  trainStepsFor(truthCase, durationBalance = 0) {
    return Math.max(1, Math.round(TRAIN_STEPS * Math.pow(truthCase.outputRarity, durationBalance)));
  }

  trainNextRow({
    learning = 0.65,
    valveMode = "neutral",
    thresholdMode = "neutral",
    strengthBalance = 0.5,
    durationBalance = 0,
  } = {}) {
    return this.trainCase(this.nextTruthCase(), {
      learning,
      valveMode,
      thresholdMode,
      strengthBalance,
      durationBalance,
    });
  }

  trainCycle({
    learning = 0.65,
    valveMode = "neutral",
    thresholdMode = "neutral",
    strengthBalance = 0.5,
    durationBalance = 0,
  } = {}) {
    const results = [];
    for (let index = 0; index < TRUTH_TABLE.length; index += 1) {
      results.push(this.trainNextRow({
        learning,
        valveMode,
        thresholdMode,
        strengthBalance,
        durationBalance,
      }));
    }
    return results;
  }

  trainCase(truthCase, {
    learning = 0.65,
    valveMode = "neutral",
    thresholdMode = "neutral",
    strengthBalance = 0.5,
    durationBalance = 0,
  } = {}) {
    this.clearRuntime();
    this.lastMode = "flood";
    this.lastCase = truthCase;
    const trainSteps = this.trainStepsFor(truthCase, durationBalance);
    const teacherStrength = this.teacherStrengthFor(truthCase, strengthBalance);

    for (let step = 0; step < trainSteps; step += 1) {
      this.injectCase(truthCase, { floodOutput: true, strength: 1, teacherStrength });
      this.step({
        learning: true,
        learningRate: learning,
        teacherOutputId: truthCase.expectedOutputId,
        valveMode,
        thresholdMode,
      });
    }

    this.trainSteps += 1;
    return this.metrics();
  }

  testNextRow() {
    return this.testCase(this.nextTruthCase());
  }

  testCycle() {
    const results = [];
    for (const row of TRUTH_TABLE) {
      results.push(this.testCase(this.caseFor(row.a, row.b)));
    }
    this.updateOperationPlasticityFromCycle(results);
    this.observeRecruitmentFromCycle(results);
    return results;
  }

  testCase(truthCase) {
    this.clearRuntime();
    this.lastMode = "test";
    this.lastCase = truthCase;

    this.injectCase(truthCase, { floodOutput: false, strength: 1.15 });
    const outputScores = {
      OUT0: { peak: 0, area: 0, duration: 0 },
      OUT1: { peak: 0, area: 0, duration: 0 },
    };

    for (let step = 0; step < SETTLE_STEPS; step += 1) {
      this.step({ learning: false });
      this.recordOutputScore(outputScores.OUT0, this.getNode("OUT0").activation);
      this.recordOutputScore(outputScores.OUT1, this.getNode("OUT1").activation);
    }

    const peakPrediction = predictFromScores(outputScores.OUT0.peak, outputScores.OUT1.peak, {
      min: 0.12,
      margin: 0.08,
    });
    const areaPrediction = predictFromScores(outputScores.OUT0.area, outputScores.OUT1.area, {
      min: 0.4,
      margin: 0.18,
    });
    const durationPrediction = predictFromScores(outputScores.OUT0.duration, outputScores.OUT1.duration, {
      min: 2,
      margin: 1,
    });
    const hybrid0 = outputScores.OUT0.peak + outputScores.OUT0.area * 0.12 + outputScores.OUT0.duration * 0.035;
    const hybrid1 = outputScores.OUT1.peak + outputScores.OUT1.area * 0.12 + outputScores.OUT1.duration * 0.035;
    const peakMargin = Math.abs(outputScores.OUT1.peak - outputScores.OUT0.peak);
    const hybridPrediction = predictFromScores(hybrid0, hybrid1, {
      min: 0.16,
      margin: 0.1,
    });
    const predicted = peakPrediction;
    const correct = predicted === truthCase.expected;
    const result = {
      ...truthCase,
      out0: outputScores.OUT0.peak,
      out1: outputScores.OUT1.peak,
      margin: peakMargin,
      outputScores,
      predictions: {
        peak: peakPrediction,
        area: areaPrediction,
        duration: durationPrediction,
        hybrid: hybridPrediction,
      },
      predicted,
      correct,
      ambiguous: predicted === null,
    };

    this.lastResult = result;
    this.testHistory.push(result);
    if (this.testHistory.length > ROLLING_WINDOW) this.testHistory.shift();
    this.testSteps += 1;
    return result;
  }

  observeRecruitmentFromCycle(results) {
    if (!this.recruitment.enabled) return;

    for (const result of results) {
      this.updateRecruitmentSurvival(result);
      if (!this.shouldRecruitFromResult(result)) continue;
      const signature = `${result.a}${result.b}`;
      const observation = this.recruitment.observations.get(signature) ?? {
        signature,
        count: 0,
        inputIds: result.inputIds,
        expectedOutputId: result.expectedOutputId,
        pressure: 0,
        lastMargin: 0,
      };
      observation.count += 1;
      observation.expectedOutputId = result.expectedOutputId;
      observation.pressure += result.out0 + result.out1;
      observation.lastMargin = result.margin;
      this.recruitment.observations.set(signature, observation);

      if (
        observation.count >= RECRUITMENT_OBSERVATION_THRESHOLD
        && !this.recruitedNodeFor(signature)
      ) {
        this.recruitSeparator(observation);
      }
    }
  }

  updateRecruitmentSurvival(result) {
    const node = this.recruitedNodeFor(`${result.a}${result.b}`);
    if (!node) return;

    const delta = result.correct && result.margin >= LOW_MARGIN_THRESHOLD ? 1 : -0.5;
    node.recruitment.survival = clamp(node.recruitment.survival + delta, -3, 6);
    if (node.recruitment.survival >= 3) node.recruitment.status = "stable";
    if (node.recruitment.survival <= -2) node.recruitment.status = "fading";
  }

  shouldRecruitFromResult(result) {
    return result.ambiguous || !result.correct || result.margin < LOW_MARGIN_THRESHOLD;
  }

  recruitedNodeFor(signature) {
    return this.nodes.find((node) => node.recruitment?.signature === signature);
  }

  recruitSeparator(observation) {
    const id = `R${this.recruitment.nextId}`;
    this.recruitment.nextId += 1;
    const node = new PressureNode({
      id,
      label: `sep ${observation.signature}`,
      role: "hidden",
      x: 0.42,
      y: yForSignature(observation.signature),
      threshold: 0.75,
      decay: 0.52,
      recruitment: {
        kind: "separator",
        signature: observation.signature,
        status: "candidate",
        evidence: observation.count,
        survival: 0,
        createdAt: this.time,
      },
    });

    this.nodes.splice(Math.max(0, this.nodes.length - 2), 0, node);
    for (const inputId of observation.inputIds) {
      this.addValve({ from: inputId, to: id, resistance: 0.35, weight: 1.3 });
    }
    const otherOutputId = observation.expectedOutputId === "OUT1" ? "OUT0" : "OUT1";
    this.addValve({ from: id, to: observation.expectedOutputId, resistance: 0.35, weight: 1.15 });
    this.addValve({ from: id, to: otherOutputId, resistance: 0.78, weight: 0.45 });
    this.addValve({ from: observation.expectedOutputId, to: id, resistance: 0.72, weight: 0.58, trainingOnly: true });

    const event = {
      type: "separator",
      nodeId: id,
      signature: observation.signature,
      evidence: observation.count,
      expectedOutputId: observation.expectedOutputId,
      createdAt: this.time,
    };
    this.recruitment.events.push(event);
    this.lastRecruitment = event;
  }

  addValve({ from, to, region = "operation", trainingOnly = false, resistance = 0.5, weight = 1 }) {
    const id = `${from}->${to}`;
    if (this.getValve(id)) return this.getValve(id);
    const valve = new InputValve({ id, from, to, region, trainingOnly, resistance, weight });
    this.valves.push(valve);
    return valve;
  }

  recordOutputScore(score, activation) {
    score.peak = Math.max(score.peak, activation);
    score.area += activation;
    if (activation >= 0.12) score.duration += 1;
  }

  injectCase(truthCase, { floodOutput, strength, teacherStrength = 1.1 }) {
    for (const inputId of truthCase.inputIds) {
      this.getNode(inputId).inject(strength);
    }

    if (floodOutput) {
      this.getNode(truthCase.expectedOutputId).inject(strength * teacherStrength);
    }
  }

  injectSource(nodeId, strength = 1) {
    const node = this.getNode(nodeId);
    if (!node || node.role !== "source") return;
    node.inject(strength);
    this.lastMode = "manual";
  }

  step({
    learning,
    learningRate = 0.65,
    teacherOutputId = null,
    teacherNodeId = null,
    valveMode = "neutral",
    thresholdMode = "neutral",
    activeRegions = ["operation"],
  } = {}) {
    this.time += 1;

    for (const valve of this.valves) valve.cool();
    for (const region of this.regions) {
      if (!region.locked) region.plasticity += (1 - region.plasticity) * 0.002;
    }
    if (learning) this.applyEcology({ valveMode, thresholdMode, learningRate });

    const conductanceBySource = new Map();
    for (const valve of this.valves) {
      if (valve.trainingOnly) continue;
      if (!activeRegions.includes(valve.region)) continue;
      const conductance = valve.weight * valve.openness;
      conductanceBySource.set(valve.from, (conductanceBySource.get(valve.from) ?? 0) + conductance);
    }

    for (const valve of this.valves) {
      if (valve.trainingOnly) continue;
      if (!activeRegions.includes(valve.region)) continue;
      const from = this.getNode(valve.from);
      const to = this.getNode(valve.to);
      const throughput = valve.conduct(from.activation, conductanceBySource.get(valve.from));
      if (throughput <= 0.001) continue;

      to.pressure += throughput;
      to.received += throughput;
      to.pulse = Math.max(to.pulse, throughput);

      if (learning) this.learnValve(valve, from, to, throughput, learningRate, teacherOutputId, teacherNodeId);
    }

    for (const node of this.nodes) node.settle();
  }

  learnValve(valve, from, to, throughput, learningRate, teacherOutputId, teacherNodeId) {
    const targetActive = this.isLearningTargetActive(valve, from, to, teacherOutputId, teacherNodeId);
    const sourceActive = from.activation > 0.05;
    const coactive = sourceActive && targetActive;
    const amount = throughput
      * (0.006 + learningRate * 0.02)
      * this.regionPlasticity(valve.region)
      * this.learningScaleForValve(valve, from, to);

    if (sourceActive && to.role === "output" && teacherOutputId && to.id !== teacherOutputId) {
      valve.weight = clamp(valve.weight - amount * 0.55, 0.15, 3.2);
      valve.adjustOpenness(-amount);
      return;
    }

    if (coactive) {
      valve.weight = clamp(valve.weight + amount, 0.15, 3.2);
      valve.adjustOpenness(amount * 0.7);
      valve.coactivity = Math.max(valve.coactivity, throughput);
    } else if (to.role !== "output" && valve.pressure > 0.18 && to.activation <= 0.01) {
      valve.adjustOpenness(-valve.pressure * (0.0005 + learningRate * 0.0015));
    }
  }

  learningScaleForValve(valve, from, to) {
    if (this.topology !== "recruitable" || valve.region !== "operation") return 1;

    const touchesRecruit = from.recruitment || to.recruitment;
    const stableRecruit = [from.recruitment, to.recruitment].some((recruitment) => {
      return recruitment?.status === "stable";
    });

    if (stableRecruit) return 0.18;
    if (touchesRecruit) return 1.35;
    if (from.role === "source" && to.role === "output") return 0.2;
    return 1;
  }

  updateOperationPlasticityFromCycle(results) {
    const correct = results.filter((result) => result.correct).length;
    const ambiguous = results.filter((result) => result.ambiguous).length;
    const accuracy = correct / results.length;
    const ambiguity = ambiguous / results.length;
    const previous = this.lastCycleAccuracy;

    if (previous === null) {
      this.lastCycleAccuracy = accuracy;
      this.perfectCycleStreak = accuracy === 1 ? 1 : 0;
      this.lastCycleSummary = { accuracy, ambiguity, delta: 0 };
      return;
    }

    const delta = accuracy - previous;
    if (delta > 0.001) {
      this.adjustOperationPlasticity(-0.05 * delta);
    } else if (delta < -0.001) {
      this.adjustOperationPlasticity(0.08 * Math.abs(delta));
    }

    if (accuracy === 1) {
      this.perfectCycleStreak += 1;
      this.adjustOperationPlasticity(-0.02 * Math.min(this.perfectCycleStreak, 5));
    } else {
      this.perfectCycleStreak = 0;
    }

    if (accuracy < 0.5 && ambiguity > 0.5) {
      this.adjustOperationPlasticity(0.015);
    }

    this.lastCycleAccuracy = accuracy;
    this.lastCycleSummary = { accuracy, ambiguity, delta };
  }

  adjustOperationPlasticity(amount) {
    this.operationRegion.plasticity = clamp(
      this.operationRegion.plasticity + amount,
      MIN_REGION_PLASTICITY,
      MAX_REGION_PLASTICITY,
    );
  }

  applyEcology({ valveMode, thresholdMode, learningRate }) {
    const valveDirection = valveMode === "seeking" ? 1 : valveMode === "certainty" ? -1 : 0;
    const thresholdDirection = thresholdMode === "seeking" ? -1 : thresholdMode === "certainty" ? 1 : 0;
    const valveAmount = valveDirection * VALVE_ECOLOGY_RATE * (0.35 + learningRate);
    const thresholdAmount = thresholdDirection * THRESHOLD_ECOLOGY_RATE * (0.35 + learningRate);

    if (valveAmount !== 0) {
      for (const valve of this.valves) valve.adjustOpenness(valveAmount * this.regionPlasticity(valve.region));
    }

    if (thresholdAmount !== 0) {
      for (const node of this.nodes) node.adjustThreshold(thresholdAmount);
    }
  }

  isLearningTargetActive(valve, from, to, teacherOutputId, teacherNodeId = null) {
    if (teacherNodeId) {
      return to.id === teacherNodeId && to.activation > 0.05;
    }

    if (to.role === "output") {
      return to.id === teacherOutputId && to.activation > 0.05;
    }

    if (valve.trainingOnly && from.role === "output") {
      return from.id === teacherOutputId && to.activation > 0.05;
    }

    if (valve.trainingOnly) {
      return to.activation > 0.05;
    }

    return to.activation > 0;
  }

  clearRuntime() {
    for (const node of this.nodes) node.resetRuntime();
    for (const valve of this.valves) valve.resetRuntime();
  }

  metrics() {
    const activePressure = this.nodes.reduce((sum, node) => sum + node.pressure + node.activation, 0);
    const valveChange = this.valves.reduce((sum, valve) => sum + Math.abs(valve.resistance - 0.5), 0);
    const forwardValves = this.valves.filter((valve) => !valve.trainingOnly);
    const adaptiveNodes = this.nodes.filter((node) => node.role !== "source");
    const valveStats = summarize(forwardValves.map((valve) => valve.openness));
    const thresholdStats = summarize(adaptiveNodes.map((node) => node.threshold));
    const hiddenActivity = summarize(this.nodes
      .filter((node) => node.role === "hidden")
      .map((node) => node.activation));

    return {
      operation: this.operation,
      mode: this.lastMode,
      cycleCount: this.cycleCount,
      trainSteps: this.trainSteps,
      testSteps: this.testSteps,
      scaffoldTrainSteps: this.scaffoldTrainSteps,
      truthIndex: this.truthIndex % TRUTH_TABLE.length,
      activePressure,
      valveChange,
      valveStats,
      plasticity: this.operationRegion.plasticity,
      regions: this.regions,
      topology: this.topology,
      recruitment: this.recruitmentSummary(),
      scaffold: this.scaffoldSummary(),
      explanation: this.explainOperation(),
      lastCycleAccuracy: this.lastCycleAccuracy,
      perfectCycleStreak: this.perfectCycleStreak,
      lastCycleSummary: this.lastCycleSummary,
      thresholdStats,
      hiddenActivity,
      rollingAccuracy: this.rollingAccuracy(),
      lastResult: this.lastResult,
      lastCase: this.lastCase,
      lastTeacher: this.lastCase
        ? {
          rarity: this.lastCase.outputRarity,
          strength: this.teacherStrengthFor(this.lastCase),
          steps: this.trainStepsFor(this.lastCase),
        }
        : null,
      outputPressure: {
        OUT0: this.getNode("OUT0").activation,
        OUT1: this.getNode("OUT1").activation,
      },
    };
  }

  rollingAccuracy() {
    if (!this.testHistory.length) return 0;
    const correct = this.testHistory.filter((result) => result.correct).length;
    return correct / this.testHistory.length;
  }

  hasStableAccuracy() {
    return this.testHistory.length >= ROLLING_WINDOW && this.testHistory.every((result) => result.correct);
  }

  recruitmentSummary() {
    const recruited = this.nodes.filter((node) => node.recruitment);
    const latestEvent = this.recruitment.events[this.recruitment.events.length - 1] ?? null;
    return {
      enabled: this.recruitment.enabled,
      nodeCount: recruited.length,
      pending: Array.from(this.recruitment.observations.values())
        .filter((observation) => !this.recruitedNodeFor(observation.signature))
        .map((observation) => ({
          signature: observation.signature,
          count: observation.count,
          lastMargin: observation.lastMargin,
        })),
      latest: latestEvent,
      nodes: recruited.map((node) => ({
        id: node.id,
        ...node.recruitment,
      })),
    };
  }

  scaffoldSummary() {
    const origin = ["ORIGIN_A", "ORIGIN_B"].map((id) => this.describeMeaningNode(id));
    const value = ["VALUE_0", "VALUE_1"].map((id) => this.describeMeaningNode(id));
    return { origin, value };
  }

  describeMeaningNode(nodeId) {
    const inputs = this.valves
      .filter((valve) => valve.to === nodeId && !valve.trainingOnly)
      .map((valve) => ({
        id: valve.from,
        strength: valve.weight * valve.openness,
      }))
      .sort((a, b) => b.strength - a.strength);
    return { id: nodeId, kind: "meaning", inputs };
  }

  explainNode(nodeId) {
    const node = this.getNode(nodeId);
    if (!node) return null;
    if (node.role === "source") return this.explainSource(nodeId);
    if (node.role === "hidden") return this.explainPairNode(nodeId);
    if (node.role === "output") return this.explainOutput(nodeId);
    if (node.role === "meaning") return this.describeMeaningNode(nodeId);
    return { id: nodeId };
  }

  explainSource(sourceId) {
    const meanings = this.valves
      .filter((valve) => valve.from === sourceId && this.getNode(valve.to)?.role === "meaning")
      .map((valve) => ({
        id: valve.to,
        strength: valve.weight * valve.openness,
      }))
      .sort((a, b) => b.strength - a.strength);
    return { id: sourceId, direction: "forward", meanings };
  }

  explainPairNode(nodeId) {
    const node = this.getNode(nodeId);
    const sources = this.valves
      .filter((valve) => valve.to === nodeId && this.getNode(valve.from)?.role === "source")
      .map((valve) => valve.from);
    const structure = sources.map((sourceId) => this.explainSource(sourceId));
    const outputs = this.valves
      .filter((valve) => valve.from === nodeId && this.getNode(valve.to)?.role === "output")
      .map((valve) => ({
        id: valve.to,
        strength: valve.weight * valve.openness,
        valueMeaning: this.strongestMeaningFor(valve.to),
      }))
      .sort((a, b) => b.strength - a.strength);

    return {
      id: nodeId,
      kind: node?.recruitment?.kind ?? "pair",
      direction: "mixed",
      recruitment: node?.recruitment ?? null,
      sources,
      structuralMeaning: structure,
      functionalRole: outputs,
      relation: relationFromSources(structure),
    };
  }

  explainOutput(outputId) {
    const supporters = this.valves
      .filter((valve) => valve.to === outputId && this.getNode(valve.from)?.role === "hidden")
      .map((valve) => ({
        id: valve.from,
        strength: valve.weight * valve.openness,
        relation: this.explainPairNode(valve.from).relation,
      }))
      .sort((a, b) => b.strength - a.strength);

    return {
      id: outputId,
      kind: "output",
      direction: "backward",
      valueMeaning: this.strongestMeaningFor(outputId),
      supporters,
      relationReading: this.readOutputRelation(outputId),
    };
  }

  strongestMeaningFor(nodeId) {
    const candidates = this.valves
      .filter((valve) => valve.from === nodeId && this.getNode(valve.to)?.role === "meaning")
      .map((valve) => ({
        id: valve.to,
        strength: valve.weight * valve.openness,
      }))
      .sort((a, b) => b.strength - a.strength);
    return candidates[0] ?? null;
  }

  explainOperation() {
    const hiddenIds = this.nodes
      .filter((node) => node.role === "hidden")
      .map((node) => node.id);
    const relations = this.readOperationRelations();
    return {
      forward: hiddenIds.map((id) => this.explainPairNode(id)),
      backward: ["OUT0", "OUT1"].map((id) => this.explainOutput(id)),
      relations,
    };
  }

  readOperationRelations() {
    return ["OUT0", "OUT1"].map((outputId) => this.readOutputRelation(outputId));
  }

  readOutputRelation(outputId, { supportRatio = 0.72 } = {}) {
    const valueMeaning = this.strongestMeaningFor(outputId);
    const candidates = this.valves
      .filter((valve) => valve.to === outputId && this.getNode(valve.from)?.role === "hidden")
      .map((valve) => {
        const pair = this.explainPairNode(valve.from);
        return {
          id: valve.from,
          strength: valve.weight * valve.openness,
          sources: pair.sources,
          relation: pair.relation,
        };
      })
      .sort((a, b) => b.strength - a.strength);
    const strongest = candidates[0]?.strength ?? 0;
    const pathSet = candidates.filter((candidate) => {
      return strongest > 0 && candidate.strength >= strongest * supportRatio;
    });

    return {
      sourceSet: Array.from(new Set(pathSet.flatMap((path) => path.sources))).sort(),
      targetSet: [outputId, valueMeaning?.id].filter(Boolean),
      pathSet,
      strength: pathSet.reduce((sum, path) => sum + path.strength, 0),
      invariants: invariantsFromPaths(pathSet),
      role: valueMeaning ? `produces ${valueMeaning.id}` : `produces ${outputId}`,
    };
  }
}

function relationFromSources(structuralMeaning) {
  const origins = new Set();
  const values = [];

  for (const source of structuralMeaning) {
    const bestOrigin = source.meanings.find((meaning) => meaning.id.startsWith("ORIGIN_"));
    const bestValue = source.meanings.find((meaning) => meaning.id.startsWith("VALUE_"));
    if (bestOrigin) origins.add(bestOrigin.id);
    if (bestValue) values.push(bestValue.id);
  }

  return {
    origin: origins.size > 1 ? "cross-origin" : "same-origin",
    value: new Set(values).size > 1 ? "mixed-value" : "same-value",
    values,
    signature: valueSignature(values),
  };
}

function invariantsFromPaths(paths) {
  if (!paths.length) return [];
  const invariants = [];
  const relations = paths.map((path) => path.relation);
  const signatures = relations.map((relation) => relation.signature).filter(Boolean);

  if (relations.every((relation) => relation.origin === "cross-origin")) {
    invariants.push("cross-origin");
  }

  if (relations.every((relation) => relation.value === "mixed-value")) {
    invariants.push("mixed-value");
  }

  if (relations.every((relation) => relation.value === "same-value")) {
    invariants.push("same-value");
  }

  if (signatures.length && signatures.every((signature) => signature === "00")) {
    invariants.push("all-value-0");
  }

  if (signatures.length && signatures.every((signature) => signature === "11")) {
    invariants.push("all-value-1");
  }

  if (signatures.length && !signatures.includes("00")) {
    invariants.push("at-least-one-value-1");
  }

  if (signatures.length && !signatures.includes("11")) {
    invariants.push("not-all-value-1");
  }

  return Array.from(new Set(invariants));
}

function valueSignature(values) {
  return values.map((value) => value.replace("VALUE_", "")).join("");
}

function yForSignature(signature) {
  const positions = {
    "00": 0.28,
    "01": 0.44,
    "10": 0.62,
    "11": 0.78,
  };
  return positions[signature] ?? 0.52;
}

export function evaluateOperation(a, b, operation) {
  if (operation === "and") return a && b;
  if (operation === "or") return a || b;
  if (operation === "nand") return !(a && b);
  return Boolean(a) !== Boolean(b);
}

function summarize(values) {
  if (!values.length) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return { min, max, avg };
}

function predictFromScores(out0, out1, { min, margin }) {
  const diff = Math.abs(out1 - out0);
  if (diff < margin || Math.max(out0, out1) < min) return null;
  return out1 > out0 ? 1 : 0;
}
