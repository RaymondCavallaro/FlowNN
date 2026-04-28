# Paisagem De Informacao

[English](../../concepts/information-landscape.md)

A paisagem de informacao e o mapa do observador sobre crencas possiveis, incerteza, encaixe e transferencia.

Ela nao deve ser tratada como uma paisagem de perda completa. O objeto pratico e um proxy construido a partir do comportamento local:

```text
estado de crenca
-> incerteza
-> erro de predicao
-> calibracao / margem
-> transferencia sob perturbacao
```

## Proxy De Energia Livre

```text
free-energy proxy =
  prediction error
+ complexity / fragmentation
+ uncertainty cost
```

Isso nao e energia livre termodinamica. E um score compacto para decidir se a rede tem explicacao estavel ou precisa de mais probing/recrutamento.

## Precisao E Certeza

```text
precision = quanto este no/rota deve confiar neste sinal ou erro
```

Certeza boa deve sobreviver perturbacao:

```text
high margin
+ correct settling
+ low drift
+ stable response under perturbation
```

## Protocolo De Probing

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
