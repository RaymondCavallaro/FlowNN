# Primitivas emprestadas

[English](../../system/borrowed-primitives.md)

Esta pagina registra primitivas uteis de sistemas vizinhos sem redefinir FlowNN como um desses sistemas.

A regra:

```text
emprestar primitivas, nao identidade
```

FlowNN continua sendo um sistema semantico de roteamento por pressao. Sistemas vizinhos de fluxo, amostragem, dinamica e restricao sao uteis porque expõem primitivas de design para mover por um espaco sem colapsar ou perder estrutura.

## Mapa de primitivas

| Ideia vizinha | Primitiva a emprestar | Interpretacao em FlowNN |
| --- | --- | --- |
| Flow matching | campo direcional de transformacao | vies global para onde o significado esta evoluindo |
| Generative flow networks | rastreamento de distribuicao de caminhos | evitar perder consciencia de alternativas viaveis cedo demais |
| Fluxos normalizantes / reversiveis | reversibilidade parcial | rastrear saidas de volta para caminhos contribuintes |
| Sistemas dinamicos continuos | estado de tempo continuo | deixar pressao variar por decaimento, amplificacao e oscilacao |
| Exploracao estilo difusao | ruido controlado | explorar cedo, estabilizar depois |
| Sistemas de restricao | restricoes duras | impedir estados invalidos e estabilizar aprendizagem inicial |
| Modelagem de opcoes | conjunto de opcoes | comparar caminhos possiveis antes de selecao ponderada por valor |

## Pipeline estendido

```text
Sinal bruto
-> Transformacao temporal
-> Material temporal
-> Camada de significado 1
-> Vies de campo
-> Roteamento com ruido e restricoes
-> Rastreamento de distribuicao de caminhos
-> Evolucao temporal continua
-> Camada de significado 2
-> Memoria de traces
```

Isto é uma arquitetura alvo, nao o runtime atual.

## Regra de opcoes com recursos limitados

Rastreamento de distribuicao de caminhos deve preservar diversidade de rotas conceitualmente. Ele nao deve manter todo caminho possivel ativo para sempre.

```text
rotas possiveis != rotas ativas
```

Um rastreador futuro de rotas deve separar:

```text
RouteSet {
  active_routes       // mantidas agora com recursos vivos
  compressed_routes   // lembradas como resumos
  discarded_routes    // abandonadas com motivo
}
```

Se recursos sao abundantes:

```text
manter exploracao mais ampla viva
```

Se recursos sao limitados, preserve ativamente apenas:

- caminhos de maior valor esperado;
- caminhos de incerteza de alto risco;
- caminhos diversos de fallback;
- caminhos necessarios para reversibilidade ou explicacao.

## Fase 1: estabilidade e interpretabilidade

Prioridade mais alta:

1. rastreamento de distribuicao de caminhos;
2. trace / reversibilidade parcial;
3. restricoes duras.

Isto apoia:

- explicacao melhor;
- menos rotas invalidas;
- comparacao de opcoes mais clara;
- debugging mais forte de por que uma saida aconteceu.

## Fase 2: exploracao e coerencia

Depois:

1. vies de campo;
2. ruido controlado.

Isto apoia:

- rotas longas mais coerentes;
- exploracao sem deriva permanente;
- direcao global sem remover roteamento local.

## Fase 3: profundidade temporal e de valor

Mais tarde:

1. dinamica de tempo continuo;
2. camada explicita de opcoes.

Isto apoia:

- padroes temporais mais ricos;
- formacao de valor sob alternativas;
- dinamicas futuras de self/valor.

## Restricao

Nenhuma dessas primitivas deve virar injecao escondida de resposta. Toda primitiva emprestada ainda deve mapear de volta para dinamicas inspecionaveis de pressao, roteamento, trace, restricao ou campo.
