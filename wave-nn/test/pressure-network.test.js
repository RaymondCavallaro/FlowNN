import assert from "node:assert/strict";
import { PressureNetwork, Signal, evaluateOperation } from "../src/network.js";

function testTruthTable() {
  assert.equal(evaluateOperation(false, false, "xor"), false);
  assert.equal(evaluateOperation(false, true, "xor"), true);
  assert.equal(evaluateOperation(true, false, "and"), false);
  assert.equal(evaluateOperation(true, true, "and"), true);
  assert.equal(evaluateOperation(false, false, "or"), false);
  assert.equal(evaluateOperation(false, true, "or"), true);
  assert.equal(evaluateOperation(true, true, "nand"), false);
}

function testSignalHasNoTypeMeaning() {
  const signal = new Signal({ strength: 1 });
  assert.deepEqual(Object.keys(signal), ["strength"]);
}

function testThresholdActivation() {
  const network = new PressureNetwork();
  const node = network.getNode("H0");
  node.inject(node.threshold * 0.5);
  node.settle();
  assert.equal(node.activation, 0);
  node.inject(node.threshold * 1.2);
  node.settle();
  assert.ok(node.activation > 0);
}

function testOutputFloodsSignal() {
  const network = new PressureNetwork();
  const output = network.getNode("OUT1");
  const outgoing = network.valves.filter((valve) => valve.from === "OUT1");

  output.inject(1.2);
  output.settle();

  assert.equal(output.role, "output");
  assert.ok(output.activation > 0);
  assert.ok(output.pressure > 0);
  assert.ok(outgoing.length > 0);
}

function testPairTopologyIsStructural() {
  const network = new PressureNetwork();
  const sourceTargets = (sourceId) => network.valves
    .filter((valve) => valve.from === sourceId && !valve.trainingOnly)
    .map((valve) => valve.to)
    .sort();

  assert.deepEqual(sourceTargets("A0"), ["H0", "H1"]);
  assert.deepEqual(sourceTargets("A1"), ["H2", "H3"]);
  assert.deepEqual(sourceTargets("B0"), ["H0", "H2"]);
  assert.deepEqual(sourceTargets("B1"), ["H1", "H3"]);
}

function testReverseOutputValvesAreTrainingOnly() {
  const network = new PressureNetwork();
  const reverseOutputValves = network.valves.filter((valve) => valve.from.startsWith("OUT"));

  assert.ok(reverseOutputValves.length > 0);
  assert.ok(reverseOutputValves.every((valve) => valve.trainingOnly));
}

function testValveOpennessIsAsymptotic() {
  const network = new PressureNetwork();
  const valve = network.valves[0];

  for (let index = 0; index < 1000; index += 1) valve.adjustOpenness(0.1);
  assert.ok(valve.openness < 1);
  assert.ok(valve.resistance > 0);

  for (let index = 0; index < 2000; index += 1) valve.adjustOpenness(-0.1);
  assert.ok(valve.openness > 0);
  assert.ok(valve.resistance < 1);
}

function testSeparateEcologyModes() {
  const network = new PressureNetwork();
  const initialOpenness = network.metrics().valveStats.avg;
  const initialThreshold = network.metrics().thresholdStats.avg;

  network.trainCycle({ learning: 0.65, valveMode: "seeking", thresholdMode: "certainty" });
  const after = network.metrics();

  assert.ok(after.valveStats.avg > initialOpenness);
  assert.ok(after.thresholdStats.avg > initialThreshold);
}

function testOperationRegionPlasticityConsolidates() {
  const network = new PressureNetwork();

  network.updateOperationPlasticityFromCycle([
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
    { correct: false, ambiguous: false },
  ]);

  const initialPlasticity = network.metrics().plasticity;

  network.updateOperationPlasticityFromCycle([
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
  ]);

  assert.ok(network.metrics().plasticity < initialPlasticity);
  assert.ok(network.metrics().plasticity > 0);
}

function testTeacherStrengthBalancesRareOutputs() {
  const network = new PressureNetwork();
  network.reset("or");

  const rareCase = network.caseFor(0, 0);
  const commonCase = network.caseFor(0, 1);

  assert.equal(rareCase.expected, 0);
  assert.equal(commonCase.expected, 1);
  assert.ok(network.teacherStrengthFor(rareCase, 0.5) > network.teacherStrengthFor(commonCase, 0.5));
}

function testTeacherDurationBalancesRareOutputs() {
  const network = new PressureNetwork();
  network.reset("or");

  const rareCase = network.caseFor(0, 0);
  const commonCase = network.caseFor(0, 1);

  assert.ok(network.trainStepsFor(rareCase, 1) > network.trainStepsFor(commonCase, 1));
}

function testFloodTrainingChangesValves() {
  const network = new PressureNetwork();
  const before = network.valves.map((valve) => valve.resistance);
  for (let index = 0; index < 8; index += 1) network.trainCycle();
  const after = network.valves.map((valve) => valve.resistance);
  assert.ok(after.some((resistance, index) => Math.abs(resistance - before[index]) > 0.001));
}

function testInputOnlyProducesResultShape() {
  const network = new PressureNetwork();
  for (let index = 0; index < 12; index += 1) network.trainCycle();
  const results = network.testCycle();
  assert.equal(results.length, 4);
  for (const result of results) {
    assert.ok(result.predicted === 0 || result.predicted === 1 || result.predicted === null);
    assert.equal(typeof result.correct, "boolean");
    assert.ok(result.predictions.peak === 0 || result.predictions.peak === 1 || result.predictions.peak === null);
    assert.ok(result.predictions.area === 0 || result.predictions.area === 1 || result.predictions.area === null);
    assert.ok(result.predictions.duration === 0 || result.predictions.duration === 1 || result.predictions.duration === null);
    assert.ok(result.predictions.hybrid === 0 || result.predictions.hybrid === 1 || result.predictions.hybrid === null);
    assert.equal(typeof result.outputScores.OUT0.area, "number");
    assert.equal(typeof result.outputScores.OUT1.duration, "number");
  }
}

testTruthTable();
testSignalHasNoTypeMeaning();
testThresholdActivation();
testOutputFloodsSignal();
testPairTopologyIsStructural();
testReverseOutputValvesAreTrainingOnly();
testValveOpennessIsAsymptotic();
testSeparateEcologyModes();
testOperationRegionPlasticityConsolidates();
testTeacherStrengthBalancesRareOutputs();
testTeacherDurationBalancesRareOutputs();
testFloodTrainingChangesValves();
testInputOnlyProducesResultShape();

console.log("pressure-network tests passed");
