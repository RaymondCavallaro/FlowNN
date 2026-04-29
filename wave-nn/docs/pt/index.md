# FlowNN

[English](../index.md)

FlowNN e um experimento de roteamento orientado por significado.

O prototipo atual pergunta uma coisa estreita: pressao, limiares, adaptacao local de valvulas e treino por flood conseguem aprender pequenas tabelas-verdade sem rotulos explicitos de sinal, historico de caminho ou credito de rota no estilo backprop?

A implementacao e pequena de proposito. A topologia principal comeca subestruturada e recruta separadores fracos quando casos bitwise repetidos nao assentam bem.

## Forma Atual

- Quatro fontes: `A0`, `A1`, `B0`, `B1`.
- Nos ocultos recrutaveis criados a partir de assinaturas repetidas de pressao nao resolvida.
- Duas saidas: `OUT0`, `OUT1`.
- Valvulas diretas para teste somente com entradas.
- Valvulas reversas de saida reservadas para treino com teacher flood.
- Leituras relacionais de saida que podem propor pares candidatos de fonte.
- Eixos observacionais de meta-regulacao para plasticidade, exploracao, certeza e pressao de restricao.

## Caminho De Leitura

Comece por [Convergencia do Nucleo](concepts/core-convergence.md), depois [Rede de Pressao](concepts/pressure-network.md), [Topologia](concepts/topology.md), [Significado Relacional](concepts/relational-meaning.md), [Paisagem de Informacao](concepts/information-landscape.md), [Meta-Regulacao](concepts/meta-regulation.md), [Dinamica do Sistema](concepts/system-dynamics.md). Notas de fase posterior ficam em [Self, Valores E Curiosidade](concepts/self-values-and-curiosity.md). Depois leia [Recursos](features.md), [Testes](tests.md), [Teste Manual](manual-testing.md), e as notas de implementacao de [network.js](code/network.js.doc.md).

Para proximos passos, veja [Roadmap](concepts/roadmap.md).
