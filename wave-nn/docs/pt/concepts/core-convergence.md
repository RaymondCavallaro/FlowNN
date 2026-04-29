# Convergencia do nucleo

[English](../../concepts/core-convergence.md)

FlowNN nao deve crescer como um conjunto de modulos permanentes.

Branches e nomes de recursos sao fatias temporarias de estudo. Eles isolam uma capacidade por vez para que o comportamento possa ser inspecionado, testado e simplificado. O alvo de longo prazo é um substrato unico de nodes, onde tempo, predicao, precisao, probing, recrutamento e transferencia sao capacidades da mesma dinamica de pressao.

```text
fatia temporaria -> experimento isolado -> dinamica reutilizavel -> node unificado
```

## Principio Principal

O branch `main` atual é a linha de convergencia. Branches de versao sao prateleiras de experimento e historia, nao um mapa da arquitetura final.

- `v0.0.1`: fatia de tempo/roteamento temporal;
- `v0.0.2`: checkpoint historico que pode ser reutilizado ou aposentado;
- `v0.0.3`: prateleira de consolidacao/campo esparso;
- `v0.0.4`: prateleira de aritmetica enquanto aritmetica nao é o foco principal.

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

Docs devem chamar trabalho de branch de experimento, prateleira ou fatia de desenvolvimento. Docs centrais devem descrever a dinamica que converge, nao o layout dos branches.
