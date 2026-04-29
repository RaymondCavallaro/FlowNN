# Paisagem de informacao

[English](../../concepts/information-landscape.md)

A paisagem de informacao é o mapa do observador sobre crencas possiveis, incerteza, encaixe e transferencia.

Ela nao deve ser tratada como uma paisagem de perda completa. O objeto pratico é um proxy construido a partir do comportamento local:

```text
estado de crenca
-> incerteza
-> erro de predicao
-> calibracao / margem
-> transferencia sob perturbacao
```

## Proxy de energia livre

```text
free-energy proxy =
  prediction error
+ complexity / fragmentation
+ uncertainty cost
```

Isso nao é energia livre termodinamica. é um score compacto para decidir se a rede tem explicacao estavel ou precisa de mais probing/recrutamento.

## Precisao e certeza

```text
precision = quanto este node/rota deve confiar neste sinal ou erro
```

Certeza boa deve sobreviver perturbacao:

```text
high margin
+ correct settling
+ low drift
+ stable response under perturbation
```

## Protocolo de probing

```text
observar incerteza
-> escolher probe
-> perturbar entrada, estado, rota ou agenda
-> medir resposta
-> classificar regime
-> atualizar mapa
```

Regimes uteis:

- bacia confusa;
- bacia de memorizacao;
- bacia de regra;
- bacia supercomprimida.

Mais tarde, curiosidade pode regular probing ao reduzir resistencia de caminhos pouco explorados apenas quando incerteza e impacto potencial sao altos. Veja [Self, valores e curiosidade](self-values-and-curiosity.md).
