# Matematica De Campo Unificada

[English](../../concepts/field-math.md)

Esta pagina atualiza o enquadramento matematico de campo do `v0.0.3` para a linha atual orientada por significado.

O grafo de objetos continua util para desenho, inspecao e experimentos incrementais. Por baixo, o modelo pode ser descrito como dinamica esparsa de campo com camadas de regulacao.

## Mudanca Central

O `v0.0.3` descrevia a rede como:

```text
estado de pressao
-> campo de condutancia
-> campo de fluxo
-> deformacao local de aprendizagem
```

A linha atual adiciona:

```text
papeis sao funcoes de fluxo estabilizadas, nao primitivas primeiras
scaffolds sao restricoes temporarias, nao verdade permanente
regulacao controla mecanismos compartilhados em vez de adicionar modulos separados
```

Entao input, output, path e papel de no devem eventualmente ser lidos como funcoes aprendidas:

```text
papel tipo entrada  = onde diferencas entram repetidamente em um sistema local
papel tipo saida    = onde atividade estabilizada afeta outra regiao
papel de roteamento = onde fluxo e redirecionado
papel de retencao   = onde pressao permanece ativa ao longo do tempo
papel de significado = onde estrutura invariante de fluxo vira reutilizavel
```

## Estado

Considere o grafo visivel indexado por nos e valvulas.

Estado de no:

```text
P      = pressao
A      = ativacao
Theta  = limiar
D      = decaimento
Role   = rotulos de papel observados atualmente
```

Estado de valvula:

```text
K      = mascara de topologia
O      = abertura
W      = peso
Q      = id de regiao
T      = mascara training-only
```

Contexto lento:

```text
R      = plasticidade regional
M      = relacoes de scaffold / significado
S      = relacoes de conjunto/propriedade
X      = traces de recrutamento nao resolvido
Z      = eixos de meta-regulacao
H      = tuner de estrategia de recrutamento
E      = sinais de evidencia
```

`Role` pode comecar como rotulo visivel para o designer, mas o alvo de longo prazo e:

```text
Role ~= funcao estavel inferida do historico de fluxo
```

## Fluxo

O campo condutivo e:

```text
G_ij = K_ij * O_ij * W_ij * active_region(Q_ij) * allowed(T_ij)
```

Condutancia de saida:

```text
C_i = sum_j G_ij
```

Fluxo por uma valvula:

```text
F_ij = A_i * G_ij / max(1, C_i)
```

Atualizacao de no:

```text
P'_j = decay_j(P_j + I_j + sum_i F_ij)
A'_j = activate(P'_j, Theta_j, Role_j)
```

Isso preserva a regra util do `v0.0.3`: pressao nao e copiada por toda rota aberta. Uma ativacao de fonte e dividida pela condutancia disponivel.

## Aprendizagem

A configuracao aprendivel e:

```text
C = {O, W, Theta, R, H}
```

Aprendizagem local:

```text
delta_valve_ij =
  coactivity(A_i, A_j, F_ij)
  * learning_rate
  * R_Q
  * local_scale_ij
```

Ecologia regional:

```text
delta_region =
  f(accuracy, ambiguity, drift, margin, survival)
```

Meta-regulacao:

```text
Z = f(E, X, stability, ambiguity, margin, recruitment_pressure)
```

A separacao importante:

```text
aprendizagem altera rotas
meta-regulacao altera quao mutavel o sistema deve ser
```

## Recrutamento Como Campo De Estrategias

Recrutamento nao e mais uma unica regra fixa de fiacao.

Traces nao resolvidos:

```text
X_signature += unresolved_pressure(case, margin, ambiguity, error)
```

Demanda de eixos dependente do caso:

```text
B = {
  sourceFocus,
  outputFocus,
  scopeBreadth,
  scaffoldUse,
  teacherFeedback
}
```

Perfis de estrategia candidatos:

```text
H_strategy = ponto no espaco B
```

Selecao de estrategia:

```text
score(strategy) =
  dot(B_case, H_strategy)
  + dot(H_learned_axis_weights, H_strategy)
  + survival_score(strategy)
  - trial_penalty(strategy)
```

Ajuste por sobrevivencia:

```text
recrutado sobrevive -> pontuacao sobe, eixos usados fortalecem
recrutado desvanece -> pontuacao cai, eixos usados enfraquecem
```

Essa e a ponte entre controle explicito e recrutamento auto-ajustado.

## Reconstrucao De Scaffold

O scaffold de conjunto/propriedade pode ser expresso como funcao:

```text
ids de fonte
-> inferir descritores de eixo/valor
-> gerar conceitos
-> gerar relacoes
-> plugar em S
```

Scaffolds manuais e gerados agora compartilham a mesma forma:

```text
S_manual    = generate(functional_description, source = manual)
S_generated = generate(functional_description, source = generated)
```

O teste de longo prazo nao e se o sistema recria a mesma forma. E se ele recria um scaffold funcionalmente equivalente:

```text
mesmos pontos de plug
mesmas restricoes uteis
mesma ou melhor estabilizacao de fluxo
```

## Regulacao E Saliencia

As notas de `13.txt` adicionam uma regra geral:

```text
muitas falhas sao mecanismos compartilhados fora de regulacao
```

Entao o modelo nao deve adicionar modulos separados para todo regime. Ele deve regular mecanismos compartilhados:

```text
memoria
roteamento
matching de padrao
simulacao
amplificacao de sinal
```

Reguladores:

```text
intensidade
limiar
especificidade
ganho de loop
confianca na fonte
peso de saliencia
```

Um modelo compacto de canal:

```text
Channel {
  baseline_weight
  amplification_gain
  detection_threshold
  routing_priority
}
```

Isso expressa falhas opostas com a mesma matematica:

```text
canal superamplificado -> atrator descontrolado / gatilhos excessivos
canal subponderado     -> acoplamento fraco / sub-reconhecimento
```

O alvo de design e calibracao adaptativa, nao amplificacao maxima.

## Teste De Emergencia De Papeis

O sistema deve eventualmente passar por um teste de remocao de scaffold:

```text
treinar com scaffold
remover ou obscurecer rotulos de papel
injetar perturbacoes brutas de pressao
observar se papeis equivalentes de entrada/saida/roteamento se reformam
```

Sucesso significa:

```text
a funcao sobreviveu a remocao da estrutura
```

Falha significa:

```text
o scaffold estava sendo usado diretamente em vez de internalizado
```

## Alvo De Implementacao

A proxima implementacao nao deve reescrever tudo em matrizes densas.

Manter:

```text
PressureNetwork = grafo de objetos inspecionavel e API experimental
```

Adicionar ou recuperar:

```text
PressureField = estado de campo esparso indexado
```

A camada de campo deve possuir:

- indices de nos;
- arrays de fonte e alvo de valvulas;
- vetores de condutancia, fluxo e entrada por alvo;
- observacoes de funcao de papel;
- vetores de eixo de recrutamento;
- eixos de regulacao.

A camada de objetos deve manter:

- rotulos de UI;
- conceitos legiveis em docs;
- controles manuais;
- testes e explicacoes.
