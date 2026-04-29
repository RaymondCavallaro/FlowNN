# FlowNN

[English](../index.md)

FlowNN é um experimento de roteamento orientado por significado.

O prototipo atual pergunta uma coisa estreita: pressao, limiares, adaptacao local de valvulas e treino por flood conseguem aprender pequenas tabelas-verdade sem rotulos explicitos de sinal, historico de caminho ou credito de rota no estilo backprop?

A implementacao e pequena de proposito. A topologia principal comeca subestruturada e recruta separadores fracos quando casos bitwise repetidos nao assentam bem.

## Forma Atual

- Quatro fontes: `A0`, `A1`, `B0`, `B1`.
- Nodes ocultos recrutaveis criados a partir de assinaturas repetidas de pressao nao resolvida.
- Duas saidas: `OUT0`, `OUT1`.
- Valvulas diretas para teste somente com entradas.
- Sem valvulas reversas de saida para ocultos na topologia atual.
- Leituras relacionais de saida que podem propor pares candidatos de fonte.
- Eixos observacionais de meta-regulacao para plasticidade, exploracao, certeza e pressao de restricao.
- Injecao manual de scaffold conjunto/propriedade, mantida explicita para depois virar recrutamento automatico.

## Caminho de leitura

Comece por [Visao geral](overview.md), [Walkthrough](walkthrough.md), [Fluxo central](core-flow.md) e [Glossario](glossary.md).

Depois leia [Convergencia do nucleo](concepts/core-convergence.md), [Rede de pressao](concepts/pressure-network.md), [Matematica de campo unificada](concepts/field-math.md), [Computacao temporal](concepts/temporal-computation.md), [Topologia](concepts/topology.md), [Significado relacional](concepts/relational-meaning.md), [Paisagem de informacao](concepts/information-landscape.md), [Meta-Regulacao](concepts/meta-regulation.md) e [Dinamica do sistema](concepts/system-dynamics.md). Notas de fase posterior ficam em [Self, valores e curiosidade](concepts/self-values-and-curiosity.md).

Para status de implementacao, leia [Recursos](features.md), [Testes](tests.md), [Teste Manual](manual-testing.md), e as notas de implementacao de [network.js](code/network.js.doc.md).

Para proximos passos, veja [Roadmap](concepts/roadmap.md).
