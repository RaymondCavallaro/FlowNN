# Topologia

[English](../../concepts/topology.md)

A topologia principal comeca sem a camada fixa de pares da tabela-verdade.

A topologia moldada antiga ainda existe como referencia nos testes, mas o experimento principal pergunta se pressao nao resolvida consegue recrutar a estrutura intermediaria ausente.

## Modo Recrutavel

Fontes comecam com rotas fracas para `OUT0` e `OUT1`. Quando um caso fica repetidamente ambiguo, com baixa margem ou pressao nao resolvida, a rede registra a assinatura ativa e pode criar um separador fraco.

Esse separador nao é um rotulo simbolico. Ele nasce de uma falha de assentamento, e um tuner secundario de recrutamento escolhe um perfil de conexao a partir de eixos dependentes do caso, como foco em fonte, foco em saida, amplitude de escopo, uso de scaffold e feedback teacher:

```text
sinais do caso -> demanda de eixos -> estrategia de conexao -> separador recrutado
```

As estrategias podem ser estreitas ou amplas, mas a area de operacao ainda exclui nodes de scaffold/significado como `ORIGIN_A`, `VALUE_0` e `VALUE_1`.

O candidato comeca com valvulas exploratorias fracas e alta resistencia. Ele pode falhar. Essa falha é util porque mostra capacidades que ainda faltam, como poda, precisao, memoria de traco ou limites melhores entre areas.

## Modo Moldado

O modo moldado contem pares `H0` a `H3`:

```text
H0 = A0 + B0
H1 = A0 + B1
H2 = A1 + B0
H3 = A1 + B1
```

Ele existe para comparacao e explicacao, nao como topologia principal.
