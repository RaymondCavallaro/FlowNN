# Guia de teste manual

[English](../manual-testing.md)

Este guia reproduz os comportamentos importantes na demo rodando no navegador.

## Iniciar a demo

```bash
cd wave-nn
python3 -m http.server 4173
```

Abra:

```text
http://127.0.0.1:4173/
```

O titulo da pagina e a marca no canto superior esquerdo devem dizer `FlowNN`.

## Teste basico de formacao

Para cada operacao: XOR, AND, OR, NAND.

1. Selecione a operacao.
2. Clique `R` para resetar.
3. Clique `S` uma vez para treinar o scaffold de origem/valor.
4. Deixe `Test cycles` marcado.
5. Clique `C` cerca de 20 vezes, ou pressione `A` e deixe o auto-treino rodar.
6. Clique `T`.
7. Confira `Accuracy`.

Resultado esperado: o sistema deve recrutar e tentar a operacao. A acuracia pode chegar a `100%`, mas recrutados exploratorios tambem podem falhar ou oscilar. Trate a falha como evidencia de que ainda faltam poda, precisao ou melhores limites entre areas.

## Teste de recrutamento

1. Resete a demo.
2. Veja `Topo`; deve mostrar `Grow`.
3. Veja `Recruits`; deve comecar em `0`.
4. Treine ciclos com `C` ou `A`.
5. Observe nodes ocultos recrutados aparecendo entre fontes e saidas.

Resultado esperado: o modo principal comeca sem os pares fixos `H0` a `H3`. Separadores recrutados aparecem depois de pressao nao resolvida repetida. Cada recrutado deve usar uma estrategia de conexao selecionada, mantendo os nodes de scaffold/significado fora.

## Teste de teacher flood

1. Selecione uma operacao.
2. Clique `S`.
3. Clique `C`.
4. Clique em uma saida ou valvula do lado de saida no canvas.
5. Abra o inspector.

Resultado esperado: a pressao de saida participa no treino, mas a acuracia vem de `T`, que injeta apenas entradas.

## Teste dos controles de ecologia

1. Defina `Valves` como `Seeking`.
2. Defina `Thresholds` como `Certainty`.
3. Clique `C` algumas vezes.
4. Observe `Open` e `Thresh`.

Resultado esperado: abertura de valvulas e media de limiares mudam de forma independente.

## Teste de explicacao do scaffold

1. Clique `S`.
2. Treine alguns ciclos.
3. Clique fontes, scaffold, recrutados ou saidas.
4. Leia a explicacao no inspector.

Resultado esperado: explicacoes mencionam primitivas de origem/valor, assinaturas de recrutamento ou leituras de relacao/invariante quando ha estrutura suficiente.

## Teste de injecao do scaffold de conjuntos

1. Resete a demo.
2. Clique `∈`.
3. Veja `Sets`; ele deve mostrar a quantidade de conceitos injetados.
4. Clique `A0`, `A1`, `B0` ou `B1`.
5. Leia `Set concepts` no inspector.

Resultado esperado: explicacoes de fonte mostram relacoes manuais de conjunto/propriedade como pertencimento a eixo, exclusao mutua, co-presenca e propriedade compartilhada de valor. Isso é scaffold explicito, ainda nao conhecimento descoberto.

## Teste do scaffold de conjuntos gerado

1. Resete a demo.
2. Clique `G`.
3. Veja `Sets`; ele deve mostrar a quantidade de conceitos gerados.
4. Clique um node de fonte.
5. Leia `Set concepts` no inspector.

Resultado esperado: o scaffold gerado deve expor o mesmo tipo de conceitos de fonte que o scaffold manual. Ele deve ficar marcado internamente como gerado e continuar compativel com a selecao de estrategia de recrutamento.

## Teste de pulso manual

1. Clique `A0`, `A1`, `B0` ou `B1`.
2. Observe a pressao sair daquela fonte.
3. Clique em nodes ou valvulas para inspecionar pressao e ativacao.

Resultado esperado: pulsos manuais injetam apenas pressao de fonte. O sinal em si nao carrega tipo semantico.
