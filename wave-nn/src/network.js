import { clamp, lerp, phaseDistance, rand, signedPhaseDelta, wrap01 } from "./math.js";

const MAX_SIGNALS = 260;
export const SIGNAL_TYPES = {
  zero: { label: "0", frequency: 1.3, phase: 0.08, hue: 205 },
  one: { label: "1", frequency: 5.7, phase: 0.58, hue: 52 },
  tighten: { label: "tighten", frequency: 8.2, phase: 0.04, hue: 278 },
  loosen: { label: "loosen", frequency: 0.7, phase: 0.94, hue: 24 },
  pair00: { label: "00", frequency: 1.8, phase: 0.16, hue: 220 },
  pair01: { label: "01", frequency: 4.4, phase: 0.31, hue: 170 },
  pair10: { label: "10", frequency: 4.9, phase: 0.69, hue: 92 },
  pair11: { label: "11", frequency: 6.8, phase: 0.54, hue: 38 },
};

const SIGNAL_INPUTS = {
  zero: "IN0",
  one: "IN1",
  tighten: "INT",
  loosen: "INL",
};

const OUTPUT_MAP = {
  "00": "O00",
  "01": "O01",
  "10": "O10",
  "11": "O11",
};

export class Signal {
  constructor({ nodeId, strength, frequency, phase, bornAt, hue = 190, generation = 0, type = "zero", target = null, packetId = 0, lastValveId = null, source = null, caseKey = null }) {
    this.nodeId = nodeId;
    this.strength = strength;
    this.frequency = frequency;
    this.phase = wrap01(phase);
    this.bornAt = bornAt;
    this.age = 0;
    this.hue = hue;
    this.generation = generation;
    this.type = type;
    this.target = target;
    this.packetId = packetId;
    this.lastValveId = lastValveId;
    this.source = source;
    this.caseKey = caseKey;
  }
}

export class Valve {
  constructor({ id, from, to, size, frequency, phase, looseness }) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.size = size;
    this.frequency = frequency;
    this.phase = wrap01(phase);
    this.looseness = looseness;
    this.pressure = 0;
    this.weight = 0.45;
    this.activity = 0;
    this.burst = 0;
    this.trace = 0;
    this.memory = 0;
    this.affinity = Object.fromEntries(Object.keys(SIGNAL_TYPES).map((type) => [type, rand(0.75, 1.25)]));
  }

  match(signal) {
    const freqError = Math.abs(signal.frequency - this.frequency) / 8;
    const phaseError = phaseDistance(signal.phase, this.phase);
    const error = freqError * 0.58 + phaseError * 0.42;
    const tolerance = clamp(this.looseness, 0.025, 0.9);
    const fit = Math.exp(-error / tolerance);
    const affinity = this.affinity[signal.type] ?? 1;
    return { error, fit, affinity };
  }

  adapt(signal, error, fit, learning) {
    const success = fit * signal.strength;
    const learningRate = 0.004 + learning * 0.025;

    if (fit > 0.45) {
      this.weight = clamp(this.weight + success * 0.016, 0.08, 2.4);
      this.frequency = lerp(this.frequency, signal.frequency, learningRate * success);
      this.phase = wrap01(this.phase + signedPhaseDelta(signal.phase, this.phase) * learningRate * success);
      this.looseness = clamp(this.looseness - success * 0.0008, 0.035, 0.75);
      this.memory = clamp(this.memory + success * 0.006, -0.55, 1.25);
      this.affinity[signal.type] = clamp((this.affinity[signal.type] ?? 1) + success * 0.018, 0.12, 3);
    } else {
      this.pressure += error * signal.strength * (0.55 + learning);
      this.looseness = clamp(this.looseness + this.pressure * 0.00018 * learning, 0.035, 0.82);
      this.memory = clamp(this.memory - error * signal.strength * 0.01, -0.55, 1.25);
      this.affinity[signal.type] = clamp((this.affinity[signal.type] ?? 1) - error * 0.025 * learning, 0.12, 3);
    }
  }

  reinforce(signal, amount) {
    this.weight = clamp(this.weight + amount * 0.05, 0.08, 2.8);
    this.memory = clamp(this.memory + amount * 0.08, -0.55, 1.25);
    this.affinity[signal.type] = clamp((this.affinity[signal.type] ?? 1) + amount * 0.08, 0.12, 3.2);
    this.activity = Math.max(this.activity, amount);
  }

  punish(signal, amount) {
    this.pressure += amount;
    this.looseness = clamp(this.looseness + amount * 0.012, 0.035, 0.9);
    this.weight = clamp(this.weight - amount * 0.035, 0.08, 2.8);
    this.memory = clamp(this.memory - amount * 0.06, -0.55, 1.25);
    this.affinity[signal.type] = clamp((this.affinity[signal.type] ?? 1) - amount * 0.12, 0.12, 3.2);
  }

  cool() {
    this.pressure *= 0.982;
    this.activity *= 0.9;
    this.burst *= 0.86;
    this.trace *= 0.94;
    this.memory *= 0.985;
    this.weight = clamp(this.weight * 0.9994, 0.08, 2.4);
  }
}

export class WaveNetwork {
  constructor() {
    this.nodes = [];
    this.valves = [];
    this.signals = [];
    this.time = 0;
    this.spreadEvents = 0;
    this.packetId = 0;
    this.outcomes = [];
    this.outputMap = { ...OUTPUT_MAP };
    this.outputEnergy = {};
    this.feedbackStats = { tighten: 0, loosen: 0 };
    this.completedPackets = new Set();
    this.controlEnergy = { tighten: 0, loosen: 0 };
    this.controlGain = { tighten: 1, loosen: 1, activation: 1 };
    this.operation = "xor";
    this.reset();
  }

  reset(operation = this.operation) {
    this.operation = operation;
    this.time = 0;
    this.spreadEvents = 0;
    this.packetId = 0;
    this.outcomes = [];
    this.outputMap = { ...OUTPUT_MAP };
    this.outputEnergy = {};
    this.feedbackStats = { tighten: 0, loosen: 0 };
    this.completedPackets = new Set();
    this.controlEnergy = { tighten: 0, loosen: 0 };
    this.controlGain = { tighten: 1, loosen: 1, activation: 1 };
    this.signals = [];
    this.nodes = [
      { id: "IN0", x: 0.07, y: 0.18, bias: 0.1, role: "input", label: "signal 0" },
      { id: "IN1", x: 0.07, y: 0.39, bias: 0.3, role: "input", label: "signal 1" },
      { id: "INT", x: 0.07, y: 0.64, bias: 0.12, role: "control", label: "tighten feedback" },
      { id: "INL", x: 0.07, y: 0.84, bias: 0.88, role: "control", label: "loosen feedback" },
      { id: "N0", x: 0.26, y: 0.16, bias: 0.2, role: "hidden" },
      { id: "N1", x: 0.28, y: 0.39, bias: 0.35, role: "hidden" },
      { id: "N2", x: 0.26, y: 0.63, bias: 0.52, role: "hidden" },
      { id: "N3", x: 0.28, y: 0.84, bias: 0.72, role: "hidden" },
      { id: "N4", x: 0.50, y: 0.22, bias: 0.26, role: "hidden" },
      { id: "N5", x: 0.53, y: 0.48, bias: 0.46, role: "hidden" },
      { id: "N6", x: 0.50, y: 0.74, bias: 0.66, role: "hidden" },
      { id: "N7", x: 0.73, y: 0.18, bias: 0.31, role: "hidden" },
      { id: "N8", x: 0.76, y: 0.49, bias: 0.55, role: "hidden" },
      { id: "N9", x: 0.73, y: 0.79, bias: 0.78, role: "hidden" },
      { id: "O00", x: 0.93, y: 0.18, bias: 0.14, role: "output", label: "00 sink" },
      { id: "O01", x: 0.93, y: 0.39, bias: 0.36, role: "output", label: "01 sink" },
      { id: "O10", x: 0.93, y: 0.61, bias: 0.62, role: "output", label: "10 sink" },
      { id: "O11", x: 0.93, y: 0.82, bias: 0.86, role: "output", label: "11 sink" },
    ];

    const links = [
      ["IN0", "N0"], ["IN0", "N1"], ["IN0", "N2"],
      ["IN1", "N1"], ["IN1", "N2"], ["IN1", "N3"],
      ["N0", "N4"], ["N0", "N5"], ["N1", "N4"], ["N1", "N5"], ["N1", "N6"],
      ["N2", "N5"], ["N2", "N6"], ["N3", "N5"], ["N3", "N6"],
      ["N4", "N7"], ["N4", "N8"], ["N5", "N7"], ["N5", "N8"], ["N5", "N9"], ["N6", "N8"], ["N6", "N9"],
      ["N7", "N4"], ["N8", "N5"], ["N9", "N6"],
      ["N4", "N0"], ["N5", "N0"], ["N5", "N1"], ["N6", "N2"], ["N6", "N3"],
      ["N7", "N1"], ["N8", "N2"], ["N9", "N3"],
      ["N4", "N5"], ["N5", "N4"], ["N5", "N6"], ["N6", "N5"], ["N7", "N8"], ["N8", "N7"], ["N8", "N9"], ["N9", "N8"],
      ["N4", "O00"], ["N5", "O00"], ["N7", "O00"],
      ["N4", "O01"], ["N5", "O01"], ["N8", "O01"],
      ["N5", "O10"], ["N6", "O10"], ["N8", "O10"],
      ["N6", "O11"], ["N8", "O11"], ["N9", "O11"],
    ];

    this.valves = links.map(([from, to], index) => {
      const fromNode = this.getNode(from);
      const toNode = this.getNode(to);
      const seededFreq = 1.2 + ((index * 1.7 + toNode.bias * 3) % 6.2);
      return new Valve({
        id: `${from}-${to}`,
        from,
        to,
        size: rand(0.34, 0.92),
        frequency: seededFreq,
        phase: wrap01(fromNode.bias * 0.41 + toNode.bias * 0.37 + rand(-0.12, 0.12)),
        looseness: rand(0.08, 0.22),
      });
    });
    this.outputEnergy = Object.fromEntries(Object.values(this.outputMap).map((id) => [id, 0]));
  }

  getNode(id) {
    return this.nodes.find((node) => node.id === id);
  }

  outgoing(nodeId) {
    return this.valves.filter((valve) => valve.from === nodeId);
  }

  getValve(id) {
    return this.valves.find((valve) => valve.id === id);
  }

  inject({ nodeId = null, type = "zero", strength = 1, target = null, packetId = 0, source = null, caseKey = null }) {
    const profile = SIGNAL_TYPES[type] ?? SIGNAL_TYPES.zero;
    const resolvedNode = nodeId ?? SIGNAL_INPUTS[type] ?? "IN0";
    this.signals.push(new Signal({
      nodeId: resolvedNode,
      strength,
      frequency: profile.frequency,
      phase: profile.phase,
      bornAt: this.time,
      hue: profile.hue,
      type,
      target,
      packetId,
      source: source ?? resolvedNode,
      caseKey,
    }));
  }

  injectExample({ a, b, operation }) {
    const expected = evaluateOperation(a, b, operation);
    const packetId = ++this.packetId;
    const caseKey = `${a ? 1 : 0}${b ? 1 : 0}`;
    const target = this.outputMap[caseKey];
    this.inject({ type: a ? "one" : "zero", strength: 1, target, packetId, source: "A", caseKey });
    this.inject({ type: b ? "one" : "zero", strength: 1, target, packetId, source: "B", caseKey });
    return { packetId, expected, target, caseKey };
  }

  step(dt, settings) {
    this.time += dt;
    const nextSignals = [];
    this.feedbackQueue = [];
    let routedEnergy = 0;

    for (const valve of this.valves) valve.cool();
    this.applyLearningControls(dt, settings.learning);
    const signalsToProcess = this.withMixedPacketSignals();

    for (const signal of signalsToProcess) {
      signal.age += dt;
      if (signal.type === "tighten" || signal.type === "loosen") {
        if (signal.age < 0.65 && signal.strength > 0.03) {
          nextSignals.push(new Signal({
            nodeId: signal.nodeId,
            strength: signal.strength * 0.9,
            frequency: signal.frequency,
            phase: signal.phase,
            bornAt: signal.bornAt,
            hue: signal.hue,
            generation: signal.generation,
            type: signal.type,
            source: signal.source,
          }));
        }
        continue;
      }

      const outgoing = this.outgoing(signal.nodeId);
      if (!outgoing.length || signal.strength < 0.018 || signal.age > 13) continue;

      const scored = outgoing
      .map((valve) => {
          const { error, fit, affinity } = valve.match(signal);
          const memoryBoost = 1 + clamp(valve.memory, -0.35, 0.9);
          const routeScore = fit * valve.size * valve.weight * affinity * memoryBoost;
          return { valve, error, fit, routeScore };
        })
        .sort((a, b) => b.routeScore - a.routeScore);

      const best = scored[0]?.routeScore ?? 0;
      const pressure = scored.reduce((sum, item) => sum + item.error * signal.strength * (1 - item.fit), 0);
      const shouldSpread = pressure > 0.28 || best < 0.18;
      const routeCount = shouldSpread ? Math.min(scored.length, 3) : Math.min(scored.length, 2);
      if (shouldSpread) this.spreadEvents += 1;

      for (const item of scored.slice(0, routeCount)) {
        const { valve, error, fit, routeScore } = item;
        valve.adapt(signal, error, fit, settings.learning);

        if (shouldSpread) {
          valve.pressure += 0.02 * signal.strength;
          valve.burst = Math.max(valve.burst, 1);
        }

        const share = routeScore / Math.max(0.001, scored.slice(0, routeCount).reduce((sum, part) => sum + part.routeScore, 0.001));
        const throughput = clamp(signal.strength * valve.size * (0.18 + fit * 0.92) * share, 0, valve.size);
        if (throughput < 0.012) continue;

        valve.activity = Math.max(valve.activity, throughput);
        valve.trace = clamp(valve.trace + throughput * 0.42, 0, 4);
        routedEnergy += throughput;

        if (this.outputEnergy[valve.to] !== undefined) {
          this.handleOutput(signal, valve, throughput, settings);
          continue;
        }

        nextSignals.push(new Signal({
          nodeId: valve.to,
          strength: throughput * (shouldSpread ? 0.82 : 0.95),
          frequency: lerp(signal.frequency, valve.frequency, 0.08),
          phase: wrap01(signal.phase + 0.035 + signedPhaseDelta(valve.phase, signal.phase) * 0.12),
          bornAt: this.time,
          hue: signal.hue,
          generation: signal.generation + 1,
          type: signal.type,
          target: signal.target,
          packetId: signal.packetId,
          lastValveId: valve.id,
          source: signal.source,
          caseKey: signal.caseKey,
        }));
      }
    }

    this.signals = [...nextSignals, ...this.feedbackQueue]
      .sort((a, b) => b.strength - a.strength)
      .slice(0, MAX_SIGNALS);
    this.feedbackQueue = [];

    return {
      routedEnergy,
      pressure: this.totalPressure(),
      rawPressure: this.totalPressure(),
      spreadEvents: this.spreadEvents,
      valveCount: this.valves.length,
      activeSignals: this.signals.reduce((sum, signal) => sum + signal.strength, 0),
      accuracy: this.accuracy(),
      operation: this.operation,
      outputs: { ...this.outputMap },
      feedbackStats: { ...this.feedbackStats },
      controlEnergy: { ...this.controlEnergy },
      controlGain: { ...this.controlGain },
    };
  }

  applyLearningControls(dt, learning) {
    const tightenEnergy = this.signals
      .filter((signal) => signal.type === "tighten")
      .reduce((sum, signal) => sum + signal.strength, 0);
    const loosenEnergy = this.signals
      .filter((signal) => signal.type === "loosen")
      .reduce((sum, signal) => sum + signal.strength, 0);
    const accuracy = this.modulationAccuracy();
    const activation = clamp(tightenEnergy + loosenEnergy, 0, 4);
    const activationGain = 0.55 + Math.pow(activation, 1.18) * 0.28;
    const tightenGain = (0.58 + accuracy * 1.05) * activationGain;
    const loosenGain = (0.72 + (1 - accuracy) * 1.22) * activationGain;
    const net = clamp(loosenEnergy * loosenGain - tightenEnergy * tightenGain, -3.2, 3.2);
    const amount = net * (0.0016 + learning * 0.0048) * Math.max(0.5, dt * 60);

    if (amount !== 0) {
      for (const valve of this.valves) {
        const tightness = 1 - clamp((valve.looseness - 0.025) / 0.925, 0, 1);
        const tightFocus = 0.45 + tightness * 1.85;
        const controlAmount = amount * tightFocus;
        valve.looseness = clamp(valve.looseness + controlAmount, 0.025, 0.95);
        valve.memory = clamp(valve.memory - controlAmount * 1.25, -0.55, 1.25);
        valve.pressure = clamp(valve.pressure + Math.max(0, -controlAmount) * 0.12, 0, 6);
      }
    }

    this.controlEnergy.tighten = this.controlEnergy.tighten * 0.82 + tightenEnergy;
    this.controlEnergy.loosen = this.controlEnergy.loosen * 0.82 + loosenEnergy;
    this.controlGain = { tighten: tightenGain, loosen: loosenGain, activation: activationGain };
  }

  handleOutput(signal, valve, throughput, settings) {
    this.outputEnergy[valve.to] = this.outputEnergy[valve.to] * 0.86 + throughput;
    if (!signal.type.startsWith("pair") || !signal.packetId) return;
    if (this.completedPackets.has(signal.packetId)) return;
    this.completedPackets.add(signal.packetId);

    const correct = signal.target === valve.to;
    const expected = evaluateOperation(signal.caseKey[0] === "1", signal.caseKey[1] === "1", this.operation);
    const feedbackType = correct && expected ? "tighten" : "loosen";
    const accuracy = this.modulationAccuracy();
    const feedbackGain = feedbackType === "tighten"
      ? 0.72 + accuracy * 0.9
      : 0.82 + (1 - accuracy) * 1.1;
    const feedbackStrength = (correct ? 0.75 : 0.55) * feedbackGain;

    if (correct) {
      valve.reinforce(signal, throughput);
    } else {
      valve.punish(signal, throughput * 1.8);
    }

    const profile = SIGNAL_TYPES[feedbackType];
    this.feedbackStats[feedbackType] += 1;
    this.feedbackQueue.push(new Signal({
      nodeId: SIGNAL_INPUTS[feedbackType],
      type: feedbackType,
      strength: feedbackStrength * (0.65 + settings.learning * 0.7),
      frequency: profile.frequency,
      phase: profile.phase,
      bornAt: this.time,
      hue: profile.hue,
      packetId: signal.packetId,
      source: "feedback",
      caseKey: signal.caseKey,
    }));

    this.outcomes.push({ correct, target: signal.target, actual: valve.to, at: this.time, caseKey: signal.caseKey });
    if (this.outcomes.length > 80) this.outcomes.shift();
  }

  withMixedPacketSignals() {
    const mixed = [];
    const groups = new Map();

    for (const signal of this.signals) {
      if (!signal.packetId || signal.generation < 1 || signal.source === "feedback") continue;
      const key = `${signal.nodeId}:${signal.packetId}`;
      const group = groups.get(key) ?? {};
      group[signal.source] = signal;
      groups.set(key, group);
    }

    for (const group of groups.values()) {
      if (!group.A || !group.B) continue;
      const a = group.A.type === "one" ? "1" : "0";
      const b = group.B.type === "one" ? "1" : "0";
      const type = `pair${a}${b}`;
      const profile = SIGNAL_TYPES[type];
      mixed.push(new Signal({
        nodeId: group.A.nodeId,
        strength: Math.min(group.A.strength, group.B.strength) * 1.18,
        frequency: profile.frequency,
        phase: profile.phase,
        bornAt: this.time,
        hue: profile.hue,
        generation: Math.max(group.A.generation, group.B.generation),
        type,
        target: group.A.target,
        packetId: group.A.packetId,
        source: "pair",
        caseKey: group.A.caseKey,
      }));
    }

    return [...this.signals, ...mixed].slice(0, MAX_SIGNALS);
  }

  totalPressure() {
    return this.valves.reduce((sum, valve) => sum + valve.pressure, 0);
  }

  accuracy() {
    if (!this.outcomes.length) return 0;
    const correct = this.outcomes.filter((outcome) => outcome.correct).length;
    return correct / this.outcomes.length;
  }

  modulationAccuracy() {
    if (!this.outcomes.length) return 0.5;
    const recent = this.outcomes.slice(-24);
    const correct = recent.filter((outcome) => outcome.correct).length;
    return correct / recent.length;
  }
}

export function evaluateOperation(a, b, operation) {
  if (operation === "and") return a && b;
  if (operation === "or") return a || b;
  if (operation === "nand") return !(a && b);
  return Boolean(a) !== Boolean(b);
}
