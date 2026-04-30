# Convergencia do nucleo

[English](../../concepts/core-convergence.md)

FlowNN nao deve crescer como um conjunto de modulos permanentes.

Fatias nomeadas de desenvolvimento sao ferramentas temporarias de estudo. Elas isolam uma capacidade por vez para que o comportamento possa ser inspecionado, testado e simplificado. O alvo de longo prazo é um substrato unico de nodes, onde tempo, predicao, precisao, probing, recrutamento e transferencia sao capacidades da mesma dinamica de pressao.

```text
fatia temporaria -> experimento isolado -> dinamica reutilizavel -> node unificado
```

## Principio Principal

O trabalho atual deve ser tratado como a linha de convergencia. Fatias historicas sao prateleiras de experimento e historia, nao um mapa da arquitetura final. Veja [Historico do projeto](../history/project-history.md) para a linhagem.

## Esboco de node unificado

```text
Node {
  pressure
  activation
  expectation
  observed_input
  error
  precision
  memory_trace
  routing_state
  plasticity_state
}
```

Loop pretendido:

```text
predizer
-> comparar com pressao real
-> calcular erro local
-> ponderar erro por precisao
-> atualizar estado, valvulas ou limiares
-> escolher proximo probe/acao
```

Isso nao autoriza injecao escondida de resposta. Pressao esperada de saida so deve ser usada em experimento supervisionado quando o caminho entre estado de fonte e estado de saida continua inspecionavel.

## Regra de documentacao

Docs centrais devem descrever dinamicas convergentes. Trabalho historico, mecanismos que falharam e mudancas de direcao pertencem em [Licoes](../lessons/index.md) ou [Historico do projeto](../history/project-history.md).
