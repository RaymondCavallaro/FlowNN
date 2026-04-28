# Significado Relacional

[English](../../concepts/relational-meaning.md)

O scaffold atual deixa o sistema explicar nos por significados primitivos conhecidos. O proximo passo e ler significado como relacao.

## Definicao

```text
relacao = invariante que permanece estavel atraves de caminhos validos
```

Para XOR, caminhos concretos podem variar:

```text
A0 -> H1 -> OUT1
A1 -> H2 -> OUT1
```

Mas a leitura estavel pode ser:

```text
cross-origin + mixed-value -> VALUE_1
```

Isso separa:

- significado de no: o que ativa um no;
- significado de grupo: estrutura compartilhada;
- significado de relacao: mapeamento estavel entre conjuntos;
- significado de caminho: como o mapeamento e realizado.
