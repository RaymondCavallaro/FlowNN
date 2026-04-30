# Visao geral

[English](../overview.md)

FlowNN é um pequeno experimento de computacao orientada por significado.

O sistema pergunta se comportamento util pode emergir de pressao, limiares, roteamento local e adaptacao em vez de rotulos explicitos de sinal, regras simbolicas ou credito de rota no estilo backprop.

## Modelo mental

```text
pressao de fonte
-> roteada por valvulas
-> acumulada por nodes
-> estabilizada como significado reutilizavel
```

A ideia central:

```text
significado nao fica dentro do sinal;
significado é moldado por onde a pressao entra, por onde ela pode fluir, e quais padroes estabilizam.
```

## O que isto é

- Um modelo de roteamento por pressao.
- Um laboratorio pequeno de tabela-verdade para testar dinamicas de aprendizagem.
- Um lugar para inspecionar como estrutura, roteamento e significado podem ser recrutados.
- Um passo em direcao a comportamento temporal e generativo.

## Posicionamento entre sistemas de fluxo

A palavra "flow" é usada por varias familias de pesquisa. FlowNN usa a palavra em um sentido especifico:

```text
flow = pressao carregando atividade pela estrutura para estabilizar significado
```

Outros sistemas de fluxo costumam focar em outras camadas:

- fluxo de distribuicao: transformar distribuicoes simples em dados complexos;
- fluxo de probabilidade: amostrar solucoes diversas em proporcao a recompensa;
- fluxo de campo vetorial: aprender direcoes em um espaco de estado continuo;
- fluxo optico: estimar movimento entre frames visuais.

FlowNN trata processamento semantico:

```text
estrutura + roteamento + tempo
-> significado estavel
-> comportamento explicavel
```

Essas outras abordagens de fluxo ainda podem ser vizinhas uteis. Por exemplo, um modelo generativo poderia propor candidatos enquanto FlowNN avalia, roteia e estabiliza significado sobre esses candidatos.

## O que isto nao é

- Nao é uma rede neural comum: nao ha vetor oculto treinado por backprop.
- Nao é logica simbolica: XOR, AND, OR e NAND sao tarefas de teste, nao portas embutidas.
- Nao é uma arquitetura madura de inteligencia geral.
- Nao é uma afirmacao de que o prototipo atual ja resolve geracao aberta.

## Prototipo atual

O app atual comeca com nodes de fonte, nodes de saida e valvulas fracas diretas de operacao. Quando casos repetidos continuam ambiguos, ele pode recrutar separadores fracos e testar se essas estruturas recrutadas sobrevivem.

O prototipo tambem tem scaffolds explicitos para significado de conjunto/propriedade, leitura relacional, sinais de meta-regulacao e notas de computacao temporal. Alguns sao mecanismos atuais; outros sao restricoes futuras documentadas.

## Ordem de leitura

1. [Walkthrough](walkthrough.md)
2. [Fluxo central](core-flow.md)
3. [Glossario](glossary.md)
4. [Rede de pressao](concepts/pressure-network.md)
5. [Modelo matematico](math/index.md)
6. [Computacao temporal](concepts/temporal-computation.md)

Depois disso, use as paginas de conceito como referencias mais profundas.
