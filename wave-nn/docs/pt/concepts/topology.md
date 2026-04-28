# Topologia

[English](../../concepts/topology.md)

A topologia principal comeca sem a camada fixa de pares da tabela-verdade.

A topologia moldada antiga ainda existe como referencia nos testes, mas o experimento principal pergunta se pressao nao resolvida consegue recrutar a estrutura intermediaria ausente.

## Modo Recrutavel

Fontes comecam com rotas fracas para `OUT0` e `OUT1`. Quando um caso fica repetidamente ambiguo, com baixa margem ou pressao nao resolvida, a rede registra a assinatura ativa e pode criar um separador fraco.

Esse separador nao e um rotulo simbolico. Ele e uma estrutura de pressao ligada ao padrao que continuou aparecendo.

## Modo Moldado

O modo moldado contem pares `H0` a `H3`:

```text
H0 = A0 + B0
H1 = A0 + B1
H2 = A1 + B0
H3 = A1 + B1
```

Ele existe para comparacao e explicacao, nao como topologia principal.
