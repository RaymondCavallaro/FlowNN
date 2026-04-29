# Meta-Regulacao

[English](../../concepts/meta-regulation.md)

Meta-regulacao e a camada que decide quanto a rede pode mudar.

Ela nao resolve a tarefa diretamente. Ela regula as condicoes de aprendizagem:

```text
taxa de plasticidade
ajuste de resistencia
ganho / atencao
consolidacao de memoria
nivel de exploracao
dureza de restricao
tamanho da janela temporal
```

## Enquadramento

Inteligencia nao deve escolher um lado de cada tensao. Ela deve manter coerencia enquanto opera entre forcas opostas:

```text
preservar <-> mudar
restricao <-> liberdade
certeza <-> duvida
exploracao <-> exploracao do conhecido
estabilidade <-> plasticidade
consistencia <-> contextualidade
```

Esses eixos nao sao chaves binarias. Sao controles continuos que moldam o espaco de comportamento.

## Scaffold Atual

A implementacao atual expoe um `metaRegulationState` observacional.

Ele le:

- acuracia do ciclo;
- ambiguidade;
- margem baixa de saida;
- pressao de recrutamento nao resolvida;
- nos recrutados candidatos e estaveis.

Ele relata eixos como:

```text
stabilityPlasticity
explorationExploitation
certaintyDoubt
constraintFreedom
```

e controles sugeridos:

```text
plasticity: raise | hold | lower
valveMode: seeking | neutral | certainty
thresholdMode: seeking | neutral | certainty
timeWindow: normal | extend
```

Isso ainda e scaffold. Ele descreve como o sistema deveria regular a si mesmo, mas ainda nao dirige automaticamente os controles de treino.

## Zonas Protegidas

O sistema nao deve poder reescrever tudo livremente.

Zonas uteis:

```text
identidade / valores centrais estaveis = baixa plasticidade
areas de aprendizagem ativa = plasticidade media
areas desconhecidas / problematicas = alta plasticidade
```

No laboratorio de pressao atual, isso mapeia para:

```text
scaffold de origem/valor -> regioes primitivas protegidas
regiao de operacao       -> dinamica de tarefa adaptavel
candidatos recrutados    -> estruturas exploratorias de alta mudanca
```

## Forma Das Regras

As regras locais pretendidas sao simples:

```text
se erro e alto e confianca e baixa:
    aumentar plasticidade local

se padrao e repetido e util:
    consolidar memoria
    reduzir plasticidade

se conflito toca estrutura protegida:
    desacelerar mudanca
    exigir mais evidencia

se ambiente e novo:
    ampliar exploracao

se risco de acao e alto:
    endurecer restricoes
```

A distincao importante:

```text
camada de acao          = o que deve acontecer?
camada de meta-regulacao = quanto o sistema deve permitir que ele mesmo mude?
```

## Direcao Posterior

A versao mais profunda sao `meta-valves`: valvulas que nao roteiam conteudo diretamente, mas regulam como outras valvulas aprendem, abrem, fecham, estabilizam ou esquecem.

Isso deve vir depois que o estado observacional for util o bastante para comparar com o comportamento real de aprendizagem.
