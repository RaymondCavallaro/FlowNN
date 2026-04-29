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
const RECRUIT_EXPLORATORY_RESISTANCE = 0.72;
const RECRUIT_EXPLORATORY_WEIGHT = 0.42;
const META_LOW_MARGIN_WINDOW = 16;
const RECRUITMENT_STRATEGIES = [
  "active-case-context",
  "expected-output-context",
  "set-scaffold-context",
  "broad-operation-area",
];
const RECRUITMENT_AXES = [
  "sourceFocus",
  "outputFocus",
  "scopeBreadth",
  "scaffoldUse",
  "teacherFeedback",
];
const RECRUITMENT_STRATEGY_PROFILES = {
  "active-case-context": {
    sourceFocus: 0.95,
    outputFocus: 0.7,
    scopeBreadth: 0.2,
    scaffoldUse: 0.1,
    teacherFeedback: 0.65,
  },
  "expected-output-context": {
    sourceFocus: 0.1,
    outputFocus: 1,
    scopeBreadth: 0.08,
    scaffoldUse: 0,
    teacherFeedback: 0.95,
  },
  "set-scaffold-context": {
    sourceFocus: 0.85,
    outputFocus: 0.75,
    scopeBreadth: 0.2,
    scaffoldUse: 1,
    teacherFeedback: 0.65,
  },
  "broad-operation-area": {
    sourceFocus: 0.45,
    outputFocus: 0.55,
    scopeBreadth: 1,
    scaffoldUse: 0,
    teacherFeedback: 0.8,
  },
};

const EXPLICIT_SET_CONCEPTS = [
  { id: "AXIS_A", kind: "input-axis", members: ["A0", "A1"] },
  { id: "AXIS_B", kind: "input-axis", members: ["B0", "B1"] },
  { id: "OPTION_A0", kind: "input-option", members: ["A0"] },
  { id: "OPTION_A1", kind: "input-option", members: ["A1"] },
  { id: "OPTION_B0", kind: "input-option", members: ["B0"] },
  { id: "OPTION_B1", kind: "input-option", members: ["B1"] },
  { id: "PROP_VALUE_0", kind: "shared-property", members: ["A0", "B0"] },
  { id: "PROP_VALUE_1", kind: "shared-property", members: ["A1", "B1"] },
];

const EXPLICIT_SET_RELATIONS = [
  { kind: "membership", from: "A0", to: "AXIS_A" },
  { kind: "membership", from: "A1", to: "AXIS_A" },
  { kind: "membership", from: "B0", to: "AXIS_B" },
  { kind: "membership", from: "B1", to: "AXIS_B" },
  { kind: "option", from: "A0", to: "OPTION_A0" },
  { kind: "option", from: "A1", to: "OPTION_A1" },
  { kind: "option", from: "B0", to: "OPTION_B0" },
  { kind: "option", from: "B1", to: "OPTION_B1" },
  { kind: "mutual-exclusion", members: ["A0", "A1"], scope: "AXIS_A" },
  { kind: "mutual-exclusion", members: ["B0", "B1"], scope: "AXIS_B" },
  { kind: "co-presence", members: ["A0", "B0"] },
  { kind: "co-presence", members: ["A0", "B1"] },
  { kind: "co-presence", members: ["A1", "B0"] },
  { kind: "co-presence", members: ["A1", "B1"] },
  { kind: "shared-property", members: ["A0", "B0"], property: "PROP_VALUE_0" },
  { kind: "shared-property", members: ["A1", "B1"], property: "PROP_VALUE_1" },
  { kind: "generalization", from: "A0", to: "PROP_VALUE_0" },
  { kind: "generalization", from: "B0", to: "PROP_VALUE_0" },
  { kind: "generalization", from: "A1", to: "PROP_VALUE_1" },
  { kind: "generalization", from: "B1", to: "PROP_VALUE_1" },
];

const SET_SCAFFOLD_FUNCTIONAL_DESCRIPTION = {
  sourcePattern: "axis+value",
  concepts: [
    "input-axis",
    "input-option",
    "shared-property",
  ],
  relations: [
    "membership",
    "option",
    "mutual-exclusion",
    "co-presence",
    "shared-property",
    "generalization",
  ],
  plugCompatibility: [
    "source explanations expose setConcepts",
    "set-scaffold-context recruitment strategy becomes available",
    "recruitment axis demand can use scaffoldUse",
  ],
};

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
    this.setScaffold = null;
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
      strategyStats: Object.fromEntries(RECRUITMENT_STRATEGIES.map((strategy) => [
        strategy,
        { score: 0, trials: 0, successes: 0, failures: 0 },
      ])),
      tuner: {
        axisWeights: Object.fromEntries(RECRUITMENT_AXES.map((axis) => [axis, 0])),
        axisStats: Object.fromEntries(RECRUITMENT_AXES.map((axis) => [
          axis,
          { successes: 0, failures: 0 },
        ])),
      },
    };
    this.setScaffold = this.emptySetScaffold();
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

  emptySetScaffold() {
    return {
      mode: "manual",
      injected: false,
      concepts: [],
      relations: [],
      injections: 0,
    };
  }

  injectSetScaffold({ mode = "manual", confidence = 1 } = {}) {
    this.setScaffold = {
      mode,
      injected: true,
      concepts: EXPLICIT_SET_CONCEPTS.map((concept) => ({
        ...concept,
        source: mode,
        confidence,
      })),
      relations: EXPLICIT_SET_RELATIONS.map((relation) => ({
        ...relation,
        source: mode,
        confidence,
      })),
      injections: this.setScaffold.injections + 1,
    };
    this.lastMode = "set-scaffold";
    return this.setScaffoldSummary();
  }

  describeSetScaffoldFunctionality() {
    return {
      ...SET_SCAFFOLD_FUNCTIONAL_DESCRIPTION,
      sources: this.sourceDescriptors(),
    };
  }

  sourceDescriptors() {
    return this.nodes
      .filter((node) => node.role === "source")
      .map((node) => {
        const match = node.id.match(/^([A-Z]+)([0-9]+)$/);
        return {
          id: node.id,
          axis: match?.[1] ?? node.id,
          value: match?.[2] ?? node.id,
        };
      });
  }

  generateSetScaffold({ mode = "generated", confidence = 0.82 } = {}) {
    const sources = this.sourceDescriptors();
    const axes = groupBy(sources, (source) => source.axis);
    const values = groupBy(sources, (source) => source.value);
    const concepts = [];
    const relations = [];

    for (const [axis, members] of axes.entries()) {
      const axisId = `AXIS_${axis}`;
      concepts.push({
        id: axisId,
        kind: "input-axis",
        members: members.map((source) => source.id),
      });
      for (const source of members) {
        concepts.push({
          id: `OPTION_${source.id}`,
          kind: "input-option",
          members: [source.id],
        });
        relations.push({ kind: "membership", from: source.id, to: axisId });
        relations.push({ kind: "option", from: source.id, to: `OPTION_${source.id}` });
      }
      for (const pair of uniquePairs(members.map((source) => source.id))) {
        relations.push({ kind: "mutual-exclusion", members: pair, scope: axisId });
      }
    }

    for (const [value, members] of values.entries()) {
      const propertyId = `PROP_VALUE_${value}`;
      concepts.push({
        id: propertyId,
        kind: "shared-property",
        members: members.map((source) => source.id),
      });
      for (const pair of uniquePairs(members.map((source) => source.id))) {
        relations.push({ kind: "shared-property", members: pair, property: propertyId });
      }
      for (const source of members) {
        relations.push({ kind: "generalization", from: source.id, to: propertyId });
      }
    }

    for (const left of sources) {
      for (const right of sources) {
        if (left.axis >= right.axis) continue;
        relations.push({ kind: "co-presence", members: [left.id, right.id] });
      }
    }

    return {
      mode,
      injected: true,
      concepts: sortSetRecords(concepts).map((concept) => ({
        ...concept,
        source: mode,
        confidence,
      })),
      relations: sortSetRecords(relations).map((relation) => ({
        ...relation,
        source: mode,
        confidence,
      })),
      injections: this.setScaffold.injections + 1,
      functionalDescription: this.describeSetScaffoldFunctionality(),
    };
  }

  injectGeneratedSetScaffold({ mode = "generated", confidence = 0.82 } = {}) {
    this.setScaffold = this.generateSetScaffold({ mode, confidence });
    this.lastMode = "set-scaffold";
    return this.setScaffoldSummary();
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
    this.tuneRecruitmentStrategy(node.recruitment, delta);
    if (node.recruitment.survival >= 3) node.recruitment.status = "stable";
    if (node.recruitment.survival <= -2) node.recruitment.status = "fading";
  }

  tuneRecruitmentStrategy(recruitment, delta) {
    const stats = this.recruitment.strategyStats[recruitment.strategy];
    if (!stats) return;
    stats.score = clamp(stats.score + delta * 0.18, -2, 2);
    if (delta > 0) stats.successes += 1;
    if (delta < 0) stats.failures += 1;

    const profile = recruitment.axisProfile ?? RECRUITMENT_STRATEGY_PROFILES[recruitment.strategy];
    for (const axis of RECRUITMENT_AXES) {
      const axisAmount = profile?.[axis] ?? 0;
      const axisStats = this.recruitment.tuner.axisStats[axis];
      this.recruitment.tuner.axisWeights[axis] = clamp(
        this.recruitment.tuner.axisWeights[axis] + delta * axisAmount * 0.08,
        -1,
        1,
      );
      if (delta > 0 && axisAmount > 0.5) axisStats.successes += 1;
      if (delta < 0 && axisAmount > 0.5) axisStats.failures += 1;
    }
  }

  shouldRecruitFromResult(result) {
    return result.ambiguous || !result.correct || result.margin < LOW_MARGIN_THRESHOLD;
  }

  recruitedNodeFor(signature) {
    return this.nodes.find((node) => node.recruitment?.signature === signature);
  }

  solvingAreaNodes() {
    return this.nodes.filter((node) => node.role !== "meaning");
  }

  recruitmentPolicyFor(observation) {
    const candidates = this.recruitmentStrategyCandidates(observation);
    const selected = this.selectRecruitmentStrategy(candidates, observation);
    const stats = this.recruitment.strategyStats[selected.strategy];
    if (stats) stats.trials += 1;
    return selected;
  }

  recruitmentStrategyCandidates(observation) {
    const activeInputs = observation.inputIds;
    const outputs = ["OUT0", "OUT1"];
    const concepts = [];
    for (const inputId of activeInputs) {
      for (const concept of this.explainSetMembership(inputId)) {
        concepts.push(concept);
      }
    }

    return [
      {
        strategy: "active-case-context",
        peers: [...activeInputs, observation.expectedOutputId],
        inputSources: activeInputs,
        outputTargets: [observation.expectedOutputId],
        reverseTeachers: [observation.expectedOutputId],
        concepts: [],
      },
      {
        strategy: "expected-output-context",
        peers: [observation.expectedOutputId],
        inputSources: [],
        outputTargets: [observation.expectedOutputId],
        reverseTeachers: [observation.expectedOutputId],
        concepts: [],
      },
      {
        strategy: "set-scaffold-context",
        peers: [...activeInputs, observation.expectedOutputId],
        inputSources: activeInputs,
        outputTargets: [observation.expectedOutputId],
        reverseTeachers: [observation.expectedOutputId],
        concepts,
        available: this.setScaffold.injected,
      },
      {
        strategy: "broad-operation-area",
        peers: this.solvingAreaNodes().map((node) => node.id),
        inputSources: activeInputs,
        outputTargets: outputs,
        reverseTeachers: outputs,
        concepts: [],
      },
    ].filter((candidate) => candidate.available !== false)
      .map((candidate) => ({
        ...candidate,
        protected: this.nodes.filter((node) => node.role === "meaning").map((node) => node.id),
      }));
  }

  selectRecruitmentStrategy(candidates, observation) {
    const axisDemand = this.recruitmentAxisDemand(observation);
    const scored = candidates.map((candidate) => {
      const stats = this.recruitment.strategyStats[candidate.strategy] ?? { score: 0, trials: 0 };
      const axisProfile = RECRUITMENT_STRATEGY_PROFILES[candidate.strategy];
      const confidencePenalty = Math.min(0.35, stats.trials * 0.03);
      const caseFit = dotAxes(axisDemand, axisProfile);
      const learnedFit = dotAxes(this.recruitment.tuner.axisWeights, axisProfile) * 0.35;
      return {
        candidate: {
          ...candidate,
          axisDemand,
          axisProfile,
        },
        score: caseFit + learnedFit + stats.score - confidencePenalty,
      };
    });
    const bestScore = Math.max(...scored.map((item) => item.score));
    const tied = scored.filter((item) => Math.abs(item.score - bestScore) < 0.0001);
    if (tied.length === 1) return tied[0].candidate;

    const index = stableChoiceIndex(
      `${observation.signature}:${observation.count}:${this.recruitment.nextId}:${this.time}`,
      tied.length,
    );
    return tied[index].candidate;
  }

  recruitmentAxisDemand(observation) {
    const lowMargin = clamp((LOW_MARGIN_THRESHOLD - observation.lastMargin) / LOW_MARGIN_THRESHOLD, 0, 1);
    const pressure = clamp(observation.pressure / 2, 0, 1);
    const repeated = clamp(observation.count / 6, 0, 1);
    return {
      sourceFocus: clamp(0.45 + repeated * 0.25 + lowMargin * 0.15, 0, 1),
      outputFocus: clamp(0.45 + repeated * 0.2 + pressure * 0.15, 0, 1),
      scopeBreadth: clamp(0.2 + pressure * 0.45 + lowMargin * 0.25, 0, 1),
      scaffoldUse: this.setScaffold.injected ? clamp(0.35 + repeated * 0.25, 0, 1) : 0,
      teacherFeedback: clamp(0.35 + lowMargin * 0.25 + pressure * 0.2, 0, 1),
    };
  }

  recruitSeparator(observation) {
    const id = `R${this.recruitment.nextId}`;
    this.recruitment.nextId += 1;
    const policy = this.recruitmentPolicyFor(observation);
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
        policy: policy.strategy,
        strategy: policy.strategy,
        axisDemand: policy.axisDemand,
        axisProfile: policy.axisProfile,
      },
    });

    this.nodes.splice(Math.max(0, this.nodes.length - 2), 0, node);
    for (const peerId of policy.peers) {
      if (peerId === id) continue;
      this.addValve({
        from: peerId,
        to: id,
        resistance: RECRUIT_EXPLORATORY_RESISTANCE,
        weight: RECRUIT_EXPLORATORY_WEIGHT,
        trainingOnly: policy.reverseTeachers.includes(peerId),
      });
      this.addValve({
        from: id,
        to: peerId,
        resistance: RECRUIT_EXPLORATORY_RESISTANCE,
        weight: RECRUIT_EXPLORATORY_WEIGHT,
        trainingOnly: false,
      });
    }

    const event = {
      type: "separator",
      nodeId: id,
      signature: observation.signature,
      evidence: observation.count,
      strategy: policy.strategy,
      connected: policy.peers,
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
      if (!this.canConductValve(valve, { learning, teacherOutputId })) continue;
      if (!activeRegions.includes(valve.region)) continue;
      const conductance = valve.weight * valve.openness;
      conductanceBySource.set(valve.from, (conductanceBySource.get(valve.from) ?? 0) + conductance);
    }

    for (const valve of this.valves) {
      if (!this.canConductValve(valve, { learning, teacherOutputId })) continue;
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

  canConductValve(valve, { learning, teacherOutputId }) {
    if (!valve.trainingOnly) return true;
    return learning && teacherOutputId && valve.from === teacherOutputId;
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
      setScaffold: this.setScaffoldSummary(),
      explanation: this.explainOperation(),
      metaRegulation: this.metaRegulationState(),
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

  metaRegulationState() {
    const recent = this.testHistory.slice(-META_LOW_MARGIN_WINDOW);
    const lowMarginRate = recent.length
      ? recent.filter((result) => result.margin < LOW_MARGIN_THRESHOLD).length / recent.length
      : 0;
    const accuracy = this.lastCycleSummary?.accuracy ?? this.rollingAccuracy();
    const ambiguity = this.lastCycleSummary?.ambiguity
      ?? (recent.length ? recent.filter((result) => result.ambiguous).length / recent.length : 0);
    const error = 1 - accuracy;
    const unresolvedSignatures = Array.from(this.recruitment.observations.values())
      .filter((observation) => !this.recruitedNodeFor(observation.signature)).length;
    const candidateRecruits = this.nodes.filter((node) => node.recruitment?.status === "candidate").length;
    const stableRecruits = this.nodes.filter((node) => node.recruitment?.status === "stable").length;
    const noveltyPressure = clamp((unresolvedSignatures + candidateRecruits * 0.5) / TRUTH_TABLE.length, 0, 1);
    const uncertainty = clamp(error * 0.55 + ambiguity * 0.25 + lowMarginRate * 0.2, 0, 1);
    const precision = clamp(accuracy * (1 - ambiguity) * (1 - lowMarginRate * 0.5), 0, 1);
    const plasticityDemand = clamp(uncertainty * 0.75 + noveltyPressure * 0.25, 0, 1);
    const stabilityDemand = clamp(precision * 0.75 + stableRecruits * 0.08, 0, 1);
    const explorationDemand = clamp(uncertainty * 0.7 + noveltyPressure * 0.3, 0, 1);
    const constraintHardness = clamp(precision * 0.6 + accuracy * 0.25 - ambiguity * 0.2, 0, 1);

    return {
      axes: {
        stabilityPlasticity: {
          stability: stabilityDemand,
          plasticity: plasticityDemand,
        },
        explorationExploitation: {
          exploration: explorationDemand,
          exploitation: clamp(precision, 0, 1),
        },
        certaintyDoubt: {
          certainty: precision,
          doubt: uncertainty,
        },
        constraintFreedom: {
          constraint: constraintHardness,
          freedom: clamp(1 - constraintHardness, 0, 1),
        },
      },
      signals: {
        accuracy,
        ambiguity,
        lowMarginRate,
        uncertainty,
        precision,
        noveltyPressure,
      },
      suggestedControls: {
        plasticity: plasticityDemand > 0.55 ? "raise" : stabilityDemand > 0.6 ? "lower" : "hold",
        valveMode: explorationDemand > 0.55 ? "seeking" : precision > 0.65 ? "certainty" : "neutral",
        thresholdMode: uncertainty > 0.6 ? "seeking" : precision > 0.65 ? "certainty" : "neutral",
        timeWindow: uncertainty > 0.55 && precision < 0.45 ? "extend" : "normal",
      },
    };
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
      strategyStats: this.recruitment.strategyStats,
      tuner: this.recruitment.tuner,
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

  setScaffoldSummary() {
    const relationsByKind = {};
    for (const relation of this.setScaffold.relations) {
      relationsByKind[relation.kind] = (relationsByKind[relation.kind] ?? 0) + 1;
    }

    return {
      mode: this.setScaffold.mode,
      injected: this.setScaffold.injected,
      conceptCount: this.setScaffold.concepts.length,
      relationCount: this.setScaffold.relations.length,
      injections: this.setScaffold.injections,
      relationsByKind,
    };
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
    return {
      id: sourceId,
      direction: "forward",
      meanings,
      setConcepts: this.explainSetMembership(sourceId),
    };
  }

  explainSetMembership(sourceId) {
    if (!this.setScaffold.injected) return [];
    return this.setScaffold.relations.filter((relation) => {
      if (relation.from === sourceId) return true;
      return relation.members?.includes(sourceId);
    }).map((relation) => ({
      kind: relation.kind,
      target: relation.to ?? relation.property ?? relation.scope ?? null,
      members: relation.members ?? [relation.from, relation.to].filter(Boolean),
      confidence: relation.confidence,
      source: relation.source,
    }));
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
      generativeCandidates: this.generateForOutput(outputId),
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

  generateForOutput(outputId, { supportRatio = 0.72 } = {}) {
    const relation = this.readOutputRelation(outputId, { supportRatio });
    if (!relation.invariants.length) return [];

    return sourcePairCandidates().map((candidate) => {
      const structuralMeaning = candidate.inputIds.map((sourceId) => this.explainSource(sourceId));
      const candidateRelation = relationFromSources(structuralMeaning);
      const matchedInvariants = relation.invariants.filter((invariant) => {
        return relationCandidateMatchesInvariant(candidateRelation, invariant);
      });
      return {
        ...candidate,
        relation: candidateRelation,
        matchedInvariants,
        confidence: matchedInvariants.length / relation.invariants.length,
      };
    }).filter((candidate) => candidate.confidence === 1)
      .sort((a, b) => a.signature.localeCompare(b.signature));
  }
}

function sourcePairCandidates() {
  return TRUTH_TABLE.map((row) => ({
    signature: `${row.a}${row.b}`,
    inputIds: [`A${row.a}`, `B${row.b}`],
  }));
}

function relationCandidateMatchesInvariant(relation, invariant) {
  if (invariant === "cross-origin") return relation.origin === "cross-origin";
  if (invariant === "same-origin") return relation.origin === "same-origin";
  if (invariant === "mixed-value") return relation.value === "mixed-value";
  if (invariant === "same-value") return relation.value === "same-value";
  if (invariant === "all-value-0") return relation.signature === "00";
  if (invariant === "all-value-1") return relation.signature === "11";
  if (invariant === "at-least-one-value-1") return relation.signature.includes("1");
  if (invariant === "not-all-value-1") return relation.signature !== "11";
  return false;
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

function stableChoiceIndex(seed, size) {
  if (size <= 1) return 0;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 9973;
  }
  return hash % size;
}

function dotAxes(left, right) {
  return RECRUITMENT_AXES.reduce((sum, axis) => {
    return sum + (left?.[axis] ?? 0) * (right?.[axis] ?? 0);
  }, 0) / RECRUITMENT_AXES.length;
}

function groupBy(items, keyFn) {
  const grouped = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }
  return grouped;
}

function uniquePairs(items) {
  const pairs = [];
  for (let left = 0; left < items.length; left += 1) {
    for (let right = left + 1; right < items.length; right += 1) {
      pairs.push([items[left], items[right]].sort());
    }
  }
  return pairs;
}

function sortSetRecords(records) {
  return records.slice().sort((left, right) => {
    return setRecordKey(left).localeCompare(setRecordKey(right));
  });
}

function setRecordKey(record) {
  return [
    record.kind,
    record.id,
    record.from,
    record.to,
    record.scope,
    record.property,
    record.members?.join("+"),
  ].filter(Boolean).join(":");
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
