# Rede de pressao

[English](../../concepts/pressure-network.md)

A rede de pressao trata significado como estrutura, nao como campo carregado por cada sinal.

Um sinal carrega apenas forca. A identidade do sinal vem de onde ele entra no grafo e quais estruturas locais ele consegue ativar.

## Partes

- `PressureNode`: acumula pressao, ativa depois de limiar e decai.
- `InputValve`: conecta um node a outro com resistencia e peso.
- nodes de saida agem como endpoints durante teste e fontes teacher durante treino por flood.

Nao existe objeto runtime `Signal` no modelo atual. Nodes de fonte injetam pressao diretamente, e o payload de pressao nao carrega tipo semantico.

## Regra Atual

O projeto evita:

- tipo explicito de sinal;
- tipo aceito por node;
- historico dedicado de rota;
- credito de rota no estilo backprop.

A hipotese e que caminhos uteis devem emergir de encontros locais repetidos de pressao.
