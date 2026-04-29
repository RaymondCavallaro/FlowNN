import assert from "node:assert/strict";
import {
  PressureNetwork,
  Signal,
  evaluateOperation,
} from "../src/network.js";

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
  const network = new PressureNetwork({ topology: "shaped" });
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
  const network = new PressureNetwork({ topology: "shaped" });
  const sourceTargets = (sourceId) => network.valves
    .filter((valve) => valve.from === sourceId && valve.region === "operation" && !valve.trainingOnly)
    .map((valve) => valve.to)
    .sort();

  assert.deepEqual(sourceTargets("A0"), ["H0", "H1"]);
  assert.deepEqual(sourceTargets("A1"), ["H2", "H3"]);
  assert.deepEqual(sourceTargets("B0"), ["H0", "H2"]);
  assert.deepEqual(sourceTargets("B1"), ["H1", "H3"]);
}

function testReverseOutputValvesAreTrainingOnly() {
  const network = new PressureNetwork({ topology: "shaped" });
  const reverseOutputValves = network.valves.filter((valve) => {
    return valve.from.startsWith("OUT") && network.getNode(valve.to)?.role === "hidden";
  });

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

function testSemanticScaffoldTopology() {
  const network = new PressureNetwork();

  assert.ok(network.getNode("ORIGIN_A"));
  assert.ok(network.getNode("ORIGIN_B"));
  assert.ok(network.getNode("VALUE_0"));
  assert.ok(network.getNode("VALUE_1"));
  assert.equal(network.getValve("OUT0->VALUE_0").region, "value");
  assert.equal(network.getValve("A0->ORIGIN_A").region, "origin");
}

function testScaffoldTrainingLocksPrimitiveRegions() {
  const network = new PressureNetwork();
  network.trainScaffold({ cycles: 2, lock: true });

  assert.ok(network.regionPlasticity("origin") < network.regionPlasticity("operation"));
  assert.ok(network.regionPlasticity("value") < network.regionPlasticity("operation"));
  assert.ok(network.getRegion("origin").locked);
  assert.ok(network.getValve("A0->ORIGIN_A").weight > 1);
  assert.ok(network.getValve("OUT1->VALUE_1").weight > 1);
}

function testMeaningExplanationUsesScaffold() {
  const network = new PressureNetwork({ topology: "shaped" });
  network.trainScaffold({ cycles: 2, lock: true });

  const explanation = network.explainPairNode("H1");
  assert.equal(explanation.relation.origin, "cross-origin");
  assert.equal(explanation.relation.value, "mixed-value");
  assert.deepEqual(explanation.sources.sort(), ["A0", "B1"]);
}

function testRelationReaderExtractsOperationMeanings() {
  const cases = {
    xor: {
      OUT0: ["same-value"],
      OUT1: ["mixed-value"],
    },
    and: {
      OUT0: ["not-all-value-1"],
      OUT1: ["all-value-1"],
    },
    or: {
      OUT0: ["all-value-0"],
      OUT1: ["at-least-one-value-1"],
    },
    nand: {
      OUT0: ["all-value-1"],
      OUT1: ["not-all-value-1"],
    },
  };

  for (const [operation, expected] of Object.entries(cases)) {
    const network = new PressureNetwork({ topology: "shaped" });
    imprintOperation(network, operation);
    const relations = Object.fromEntries(
      network.readOperationRelations().map((relation) => [relation.targetSet[0], relation]),
    );

    for (const [outputId, invariants] of Object.entries(expected)) {
      for (const invariant of invariants) {
        assert.ok(
          relations[outputId].invariants.includes(invariant),
          `${operation} ${outputId} should include ${invariant}; got ${relations[outputId].invariants.join(", ")}`,
        );
      }
    }
  }
}

function testRelationReaderGeneratesSourceCandidates() {
  const cases = {
    xor: {
      OUT0: ["00", "11"],
      OUT1: ["01", "10"],
    },
    and: {
      OUT0: ["00", "01", "10"],
      OUT1: ["11"],
    },
    or: {
      OUT0: ["00"],
      OUT1: ["01", "10", "11"],
    },
    nand: {
      OUT0: ["11"],
      OUT1: ["00", "01", "10"],
    },
  };

  for (const [operation, expected] of Object.entries(cases)) {
    const network = new PressureNetwork({ topology: "shaped" });
    imprintOperation(network, operation);

    for (const [outputId, signatures] of Object.entries(expected)) {
      assert.deepEqual(
        network.generateForOutput(outputId).map((candidate) => candidate.signature),
        signatures,
        `${operation} ${outputId} should generate ${signatures.join(", ")}`,
      );
    }
  }
}

function testMetaRegulationRespondsToUncertainty() {
  const network = new PressureNetwork();
  network.updateOperationPlasticityFromCycle([
    { correct: false, ambiguous: true },
    { correct: false, ambiguous: true },
    { correct: false, ambiguous: true },
    { correct: false, ambiguous: true },
  ]);

  const state = network.metaRegulationState();

  assert.ok(state.axes.stabilityPlasticity.plasticity > state.axes.stabilityPlasticity.stability);
  assert.ok(state.axes.explorationExploitation.exploration > state.axes.explorationExploitation.exploitation);
  assert.equal(state.suggestedControls.plasticity, "raise");
  assert.equal(state.suggestedControls.valveMode, "seeking");
}

function testMetaRegulationConsolidatesStableBehavior() {
  const network = new PressureNetwork();
  const stableCycle = [
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
    { correct: true, ambiguous: false },
  ];

  network.updateOperationPlasticityFromCycle(stableCycle);
  network.updateOperationPlasticityFromCycle(stableCycle);
  const state = network.metaRegulationState();

  assert.ok(state.axes.stabilityPlasticity.stability > state.axes.stabilityPlasticity.plasticity);
  assert.ok(state.axes.certaintyDoubt.certainty > state.axes.certaintyDoubt.doubt);
  assert.equal(state.suggestedControls.plasticity, "lower");
  assert.equal(state.suggestedControls.thresholdMode, "certainty");
}

function testFloodTrainingChangesValves() {
  const network = new PressureNetwork();
  const before = network.valves.map((valve) => valve.resistance);
  for (let index = 0; index < 8; index += 1) network.trainCycle();
  const after = network.valves.map((valve) => valve.resistance);
  assert.ok(after.some((resistance, index) => Math.abs(resistance - before[index]) > 0.001));
}

function imprintOperation(network, operation) {
  network.reset(operation, { topology: "shaped" });
  network.trainScaffold({ cycles: 2, lock: true });
  const pairByCase = {
    "0,0": "H0",
    "0,1": "H1",
    "1,0": "H2",
    "1,1": "H3",
  };

  for (const row of [
    { a: 0, b: 0 },
    { a: 0, b: 1 },
    { a: 1, b: 0 },
    { a: 1, b: 1 },
  ]) {
    const hiddenId = pairByCase[`${row.a},${row.b}`];
    const expected = evaluateOperation(Boolean(row.a), Boolean(row.b), operation) ? 1 : 0;
    const correct = network.getValve(`${hiddenId}->OUT${expected}`);
    const wrong = network.getValve(`${hiddenId}->OUT${1 - expected}`);
    correct.weight = 3;
    wrong.weight = 0.2;
  }
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

function testRecruitableTopologyStartsWithoutFixedPairs() {
  const network = new PressureNetwork();

  assert.equal(network.topology, "recruitable");
  assert.equal(network.getNode("H0"), undefined);
  assert.deepEqual(
    network.nodes.filter((node) => node.role === "hidden").map((node) => node.id),
    [],
  );
  assert.ok(network.getValve("A0->OUT0"));
  assert.ok(network.getValve("A0->OUT1"));
}

function testRecruitmentCreatesSeparatorForRepeatedAmbiguity() {
  const network = new PressureNetwork();
  const ambiguous = {
    a: 0,
    b: 1,
    inputIds: ["A0", "B1"],
    expected: 1,
    expectedOutputId: "OUT1",
    out0: 0.2,
    out1: 0.22,
    margin: 0.02,
    correct: false,
    ambiguous: true,
  };

  network.observeRecruitmentFromCycle([ambiguous]);
  assert.equal(network.metrics().recruitment.nodeCount, 0);

  network.observeRecruitmentFromCycle([ambiguous]);
  const recruited = network.nodes.find((node) => node.recruitment?.signature === "01");

  assert.ok(recruited);
  assert.equal(recruited.recruitment.kind, "separator");
  assert.ok(network.getValve("A0->R0"));
  assert.ok(network.getValve("A1->R0"));
  assert.ok(network.getValve("B0->R0"));
  assert.ok(network.getValve("B1->R0"));
  assert.ok(network.getValve("R0->A0"));
  assert.ok(network.getValve("R0->A1"));
  assert.ok(network.getValve("R0->B0"));
  assert.ok(network.getValve("R0->B1"));
  assert.ok(network.getValve("R0->OUT0"));
  assert.ok(network.getValve("R0->OUT1"));
  assert.ok(network.getValve("OUT0->R0").trainingOnly);
  assert.ok(network.getValve("OUT1->R0").trainingOnly);
  assert.equal(network.getValve("ORIGIN_A->R0"), undefined);
  assert.equal(network.getValve("VALUE_0->R0"), undefined);
}

function testRecruitableTopologyAttemptsBitwiseOperations() {
  for (const operation of ["xor", "and", "or", "nand"]) {
    const network = new PressureNetwork();
    network.reset(operation);
    network.trainScaffold({ cycles: 3, lock: true });

    for (let cycle = 0; cycle < 20; cycle += 1) {
      network.trainCycle({
        learning: 0.7,
        strengthBalance: 0.5,
        durationBalance: 0.15,
      });
      network.testCycle();
    }

    const results = network.testCycle();
    assert.equal(results.length, 4);
    assert.equal(typeof results.filter((result) => result.correct).length, "number");
    assert.ok(network.metrics().recruitment.nodeCount > 0);
  }
}

const TEST_CASES = [
  {
    name: "truth table oracle matches supported operations",
    kind: "feature",
    covers: "truth-table operation definitions",
    run: testTruthTable,
  },
  {
    name: "signal carries strength only",
    kind: "error",
    covers: "no semantic type stored in Signal",
    run: testSignalHasNoTypeMeaning,
  },
  {
    name: "threshold gates node activation",
    kind: "feature",
    covers: "pressure threshold activation",
    run: testThresholdActivation,
  },
  {
    name: "outputs can flood pressure during training",
    kind: "feature",
    covers: "teacher output as active pressure source",
    run: testOutputFloodsSignal,
  },
  {
    name: "shaped pair topology is structural",
    kind: "feature",
    covers: "reference pair-node topology",
    run: testPairTopologyIsStructural,
  },
  {
    name: "reverse output valves are training-only",
    kind: "error",
    covers: "teacher routes do not leak into input-only testing",
    run: testReverseOutputValvesAreTrainingOnly,
  },
  {
    name: "valve openness stays bounded",
    kind: "error",
    covers: "asymptotic valve ecology",
    run: testValveOpennessIsAsymptotic,
  },
  {
    name: "valves and thresholds use separate ecology modes",
    kind: "feature",
    covers: "independent valve/threshold controls",
    run: testSeparateEcologyModes,
  },
  {
    name: "operation plasticity consolidates after stable cycles",
    kind: "feature",
    covers: "regional plasticity consolidation",
    run: testOperationRegionPlasticityConsolidates,
  },
  {
    name: "teacher strength balances rare outputs",
    kind: "feature",
    covers: "rarity-balanced teacher pressure",
    run: testTeacherStrengthBalancesRareOutputs,
  },
  {
    name: "teacher duration balances rare outputs",
    kind: "feature",
    covers: "rarity-balanced teacher duration",
    run: testTeacherDurationBalancesRareOutputs,
  },
  {
    name: "semantic scaffold topology exists",
    kind: "feature",
    covers: "origin/value primitive regions",
    run: testSemanticScaffoldTopology,
  },
  {
    name: "scaffold training locks primitive regions",
    kind: "feature",
    covers: "origin/value consolidation",
    run: testScaffoldTrainingLocksPrimitiveRegions,
  },
  {
    name: "meaning explanations use scaffold primitives",
    kind: "feature",
    covers: "pair-node explanation from primitive meanings",
    run: testMeaningExplanationUsesScaffold,
  },
  {
    name: "relation reader extracts operation meanings",
    kind: "feature",
    covers: "operation invariants from learned structure",
    run: testRelationReaderExtractsOperationMeanings,
  },
  {
    name: "relation reader generates source candidates",
    kind: "feature",
    covers: "target output to candidate source generation",
    run: testRelationReaderGeneratesSourceCandidates,
  },
  {
    name: "meta regulation responds to uncertainty",
    kind: "feature",
    covers: "adaptive tension axes under unresolved behavior",
    run: testMetaRegulationRespondsToUncertainty,
  },
  {
    name: "meta regulation consolidates stable behavior",
    kind: "feature",
    covers: "adaptive tension axes under stable behavior",
    run: testMetaRegulationConsolidatesStableBehavior,
  },
  {
    name: "flood training changes valves",
    kind: "feature",
    covers: "local co-activation learning",
    run: testFloodTrainingChangesValves,
  },
  {
    name: "input-only tests produce diagnostic result shape",
    kind: "error",
    covers: "test result schema and diagnostic scores",
    run: testInputOnlyProducesResultShape,
  },
  {
    name: "recruitable topology starts without fixed pairs",
    kind: "feature",
    covers: "under-structured main topology",
    run: testRecruitableTopologyStartsWithoutFixedPairs,
  },
  {
    name: "recruitment creates separators for repeated ambiguity",
    kind: "feature",
    covers: "broad separator recruitment from unresolved pressure",
    run: testRecruitmentCreatesSeparatorForRepeatedAmbiguity,
  },
  {
    name: "recruitable topology attempts bitwise operations",
    kind: "feature",
    covers: "end-to-end XOR/AND/OR/NAND exploratory evaluation",
    run: testRecruitableTopologyAttemptsBitwiseOperations,
  },
];

for (const testCase of TEST_CASES) {
  assert.ok(testCase.kind === "feature" || testCase.kind === "error");
  assert.ok(testCase.covers);
  testCase.run();
}

console.log("pressure-network tests passed");
