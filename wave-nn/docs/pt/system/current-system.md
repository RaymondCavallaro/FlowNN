# Sistema atual

[English](../../system/current-system.md)

Esta pagina descreve o que o sistema atual é, sem desvios historicos.

## Objetivo atual

FlowNN atualmente estuda se um pequeno sistema de roteamento por pressao consegue aprender e explicar comportamento minimo de tabela-verdade sem rotulos explicitos de sinal, portas simbolicas, traces de caminho ou credito de rota no estilo backprop.

## Categoria do sistema

FlowNN deve ser descrito como um sistema semantico de roteamento por pressao.

Seu "flow" nao é principalmente massa de probabilidade, transformacao de distribuicao, movimento de pixels ou geracao direta de dados. No sistema atual:

```text
flow = pressao de ativacao movendo por valvulas e nodes
```

O eixo de pesquisa é:

```text
identidade de fonte
-> pressao roteada
-> adaptacao local
-> estrutura recrutada
-> significado relacional
```

Isso aproxima FlowNN de um modelo de processo para significado e raciocinio, nao de um gerador autonomo de dados. Hibridos futuros ainda podem usar sistemas generativos ou de amostragem como produtores de candidatos, enquanto FlowNN cuida de roteamento semantico, checagem de restricoes e estabilizacao de significado.

## Forma do runtime

- nodes de fonte: `A0`, `A1`, `B0`, `B1`;
- nodes de saida: `OUT0`, `OUT1`;
- valvulas de operacao de fontes ou estruturas recrutadas em direcao a saidas;
- regioes de scaffold para significados de origem/valor;
- scaffold explicito opcional de conjunto/propriedade;
- recrutamento de nodes separadores fracos sob pressao nao resolvida repetida;
- leitor relacional que extrai invariantes de suporte aprendido;
- estado de meta-regulacao que observa incerteza e sugere controles.

## Limites atuais

- Payloads de pressao nao carregam tipos semanticos.
- Teste injeta apenas fontes de entrada.
- Valvulas reversas de saida para hidden nao fazem parte da topologia atual.
- Meta-regulacao é observacional; ela ainda nao dirige controles automaticamente.
- Uso generativo é restrito a pares candidatos de fonte a partir de relacoes aprendidas de saida.

## Criterios atuais de sucesso

O projeto valoriza inspecionabilidade acima de performance bruta. Uma mudanca util deve deixar pelo menos um destes pontos mais claro:

- como a pressao se move;
- por que uma rota ficou mais facil ou dificil;
- por que recrutamento aconteceu;
- que relacao foi aprendida;
- como o modelo matematico explica o mecanismo.

## Relacionados

- [Fluxo central](../core-flow.md)
- [Mapa de propriedades](properties.md)
- [Recursos](../features.md)
- [Modelo matematico](../math/index.md)
- [Principios](../principles/index.md)
