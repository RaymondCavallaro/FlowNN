# Unified Field Math

[Portugues](../pt/math/unified-field.md)

This page defines the current unified field-math model for the meaning-first line.

The object graph remains useful for drawing, inspection, and incremental experiments. The model underneath can be described as sparse field dynamics with regulation layers.

## Core Shift

The earlier sparse-field model described the network as:

```text
pressure state
-> conductance field
-> flow field
-> local learning deformation
```

The current line adds:

```text
roles are stabilized flow functions, not first primitives
scaffolds are temporary constraints, not permanent truth
regulation controls shared mechanisms instead of adding separate modules
```

So input, output, path, and node role should eventually be read as learned functions:

```text
entry-like role       = where differences repeatedly enter a local system
exit-like role        = where stabilized activity affects another region
routing role          = where flow is redirected
holding role          = where pressure remains active across time
meaning role          = where invariant flow structure becomes reusable
```

## State

Let the visible graph be indexed by nodes and valves.

Node state:

```text
P      = pressure
A      = activation
Theta  = threshold
D      = decay
Role   = current observed role labels
```

Valve state:

```text
K      = topology mask
O      = openness
W      = weight
Q      = region id
T      = training-only mask
```

Slow context:

```text
R      = regional plasticity
M      = scaffold / meaning relations
S      = set/property relations
X      = unresolved recruitment traces
Z      = meta-regulation axes
H      = recruitment strategy tuner
E      = evidence signals
```

`Role` is allowed to start as a designer-facing label, but the long-term target is:

```text
Role ~= stable function inferred from flow history
```

## Flow

The conductive field is:

```text
G_ij = K_ij * O_ij * W_ij * active_region(Q_ij) * allowed(T_ij)
```

Outgoing conductance:

```text
C_i = sum_j G_ij
```

Flow over a valve:

```text
F_ij = A_i * G_ij / max(1, C_i)
```

Node update:

```text
P'_j = decay_j(P_j + I_j + sum_i F_ij)
A'_j = activate(P'_j, Theta_j, Role_j)
```

This preserves a core field rule: pressure is not copied through every open route. A source activation is divided across available conductance.

## Learning

The learnable configuration is:

```text
C = {O, W, Theta, R, H}
```

Local learning:

```text
delta_valve_ij =
  coactivity(A_i, A_j, F_ij)
  * learning_rate
  * R_Q
  * local_scale_ij
```

Regional ecology:

```text
delta_region =
  f(accuracy, ambiguity, drift, margin, survival)
```

Meta-regulation:

```text
Z = f(E, X, stability, ambiguity, margin, recruitment_pressure)
```

The important separation:

```text
learning changes routes
meta-regulation changes how changeable the system is
```

## Adaptive Pressure Balance

The system should not treat pressure alone as optimization. Pressure without capacity can collapse into rigidity. Capacity without pressure can drift without selection.

The useful design gradient is:

```text
optimization ~= capacity * constraint
```

In this model:

```text
capacity   = option space available for change
constraint = selection pressure that makes some changes survive
```

Capacity comes from:

- multiple possible routes;
- flexible thresholds and valve openness;
- recruited nodes;
- scaffold or relation alternatives;
- enough regional plasticity to move.

Constraint comes from:

- valve topology and conductance;
- resistance and competition between routes;
- output-margin requirements;
- temporal consistency;
- survival feedback for recruited structure.

So the adaptive target is:

```text
too little capacity   -> no useful change
too little constraint -> no direction
too much constraint   -> brittle collapse
balanced gradient     -> adaptive structure
```

## Recruitment As Strategy Field

Recruitment is no longer a single hard-coded wiring rule.

Unresolved traces:

```text
X_signature += unresolved_pressure(case, margin, ambiguity, error)
```

Case-dependent axis demand:

```text
B = {
  sourceFocus,
  outputFocus,
  scopeBreadth,
  scaffoldUse,
  teacherFeedback
}
```

Candidate strategy profiles:

```text
H_strategy = point in B-space
```

Strategy selection:

```text
score(strategy) =
  dot(B_case, H_strategy)
  + dot(H_learned_axis_weights, H_strategy)
  + survival_score(strategy)
  - trial_penalty(strategy)
```

Survival tuning:

```text
recruit survives -> strategy score rises, used axes strengthen
recruit fades    -> strategy score falls, used axes weaken
```

This is the bridge from explicit control to self-tuned recruitment.

## Scaffold Reconstruction

The set/property scaffold can be expressed as a function:

```text
source ids
-> infer axis/value descriptors
-> generate concepts
-> generate relations
-> plug into S
```

Manual and generated scaffolds now share the same form:

```text
S_manual    = generate(functional_description, source = manual)
S_generated = generate(functional_description, source = generated)
```

The long-term test is not whether the system recreates the same shape. It is whether it recreates a functionally equivalent scaffold:

```text
same plug points
same useful constraints
same or better flow stabilization
```

## Regulation And Salience

A general regulation rule:

```text
many failures are shared mechanisms pushed out of regulation
```

So the model should not add separate modules for every regime. It should regulate shared mechanisms:

```text
memory
routing
pattern matching
simulation
signal amplification
```

Regulators:

```text
intensity
threshold
specificity
loop gain
source trust
salience weight
```

A compact channel model:

```text
Channel {
  baseline_weight
  amplification_gain
  detection_threshold
  routing_priority
}
```

This can express opposite failures with the same math:

```text
over-amplified channel -> runaway attractor / over-triggering
underweighted channel  -> weak coupling / under-recognition
```

The design target is adaptive calibration, not maximum amplification.

## Role Emergence Test

The system should eventually pass a scaffold-removal test:

```text
train with scaffold
remove or obscure role labels
inject raw pressure perturbations
observe whether equivalent entry/exit/routing roles reform
```

Success means:

```text
function survived structure removal
```

Failure means:

```text
the scaffold was being used directly rather than internalized
```

## Implementation Target

The next implementation should not rewrite everything into dense matrices.

Keep:

```text
PressureNetwork = inspectable object graph and experiment API
```

Add or recover:

```text
PressureField = sparse indexed field state
```

The field layer should own:

- node indexes;
- valve source and target arrays;
- conductance, flow, and target-input vectors;
- role-function observations;
- recruitment axis vectors;
- regulation axes.

The object layer should keep:

- UI labels;
- docs-friendly concepts;
- manual controls;
- tests and explanations.
