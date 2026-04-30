# Modelo matematico

[English](../../math/index.md)

Esta secao é de primeira classe porque o modelo matematico é a camada que unifica o projeto.

O codigo pode continuar inspecionavel e experimental. Conceitos podem mudar de nome. Licoes historicas podem ficar estacionadas. O modelo matematico deve continuar respondendo a pergunta mais profunda:

```text
que dinamicas compartilhadas tornam roteamento, aprendizagem, recrutamento, regulacao e significado partes de um sistema unico?
```

## Papel atual

O modelo matematico atual descreve FlowNN como dinamica esparsa de campo:

```text
estado de pressao
-> campo de condutancia
-> campo de fluxo
-> deformacao local
-> regulacao de mudanca
```

Ele nao é apenas documentacao. Ele é a ponte pretendida para:

- limites de implementacao mais limpos;
- experimentos reproduziveis;
- artigos cientificos;
- comparacoes com linguagem neural, simbolica, active-inference e sistemas dinamicos.

## Leia primeiro

- [Modelo de campo unificado](unified-field.md)

## Regra de pesquisa

Quando detalhes de implementacao entrarem em conflito com o modelo, documente o conflito explicitamente. Nao esconda isso em comentarios de codigo ou notas historicas.
