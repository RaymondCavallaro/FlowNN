# Rede De Pressao

[English](../../concepts/pressure-network.md)

A rede de pressao trata significado como estrutura, nao como campo carregado por cada sinal.

Um sinal carrega apenas forca. A identidade do sinal vem de onde ele entra no grafo e quais estruturas locais ele consegue ativar.

## Partes

- `Signal`: apenas forca de pressao.
- `PressureNode`: acumula pressao, ativa depois de limiar e decai.
- `InputValve`: conecta um no a outro com resistencia e peso.
- `OutputNode`: endpoint durante teste e fonte teacher durante treino por flood.

## Regra Atual

O projeto evita:

- tipo explicito de sinal;
- tipo aceito por no;
- historico dedicado de rota;
- credito de rota no estilo backprop.

A hipotese e que caminhos uteis devem emergir de encontros locais repetidos de pressao.
