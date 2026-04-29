# network.js

[English](../../code/network.js.doc.md)

`src/network.js` contem o motor de pressao.

O arquivo de codigo deve ficar relativamente limpo. Esta pagina carrega a explicacao que ficaria barulhenta dentro do motor.

## Responsabilidades

- criar nos, valvulas e regioes;
- executar treino por flood;
- executar teste somente com entradas;
- atualizar plasticidade regional;
- registrar metricas;
- observar pressao nao resolvida;
- recrutar separadores exploratorios quando ha ambiguidade repetida;
- produzir explicacoes para o inspector;
- injetar conceitos explicitos de conjunto/propriedade como scaffold manual;
- gerar pares candidatos de fonte a partir de invariantes relacionais de saida.

## Regra Importante

`Signal` carrega apenas `strength`. Identidade vem da fonte e da topologia. O sistema deve evitar tipo semantico explicito, tipo aceito por no, historico de rota e backprop.

## Teste

`testCase` injeta apenas fontes de entrada. Ele mede as saidas durante a janela de assentamento porque o pulso significativo pode acontecer antes do quadro final.

## Scaffold De Conjuntos

`injectSetScaffold` injeta conceitos e relacoes explicitas sem treinar rotas de pressao. O scaffold inclui pertencimento a eixo, opcoes de entrada, exclusao mutua, co-presenca, propriedade compartilhada de valor e generalizacao.

As relacoes injetadas sao marcadas por origem:

```text
source = manual
```

assim o recrutamento automatico posterior pode reutilizar a mesma forma sem fingir que o scaffold manual foi descoberto pela rede.

## Recrutamento

Quando uma assinatura nao resolvida persiste, a rede cria um separador fraco. A estrategia atual conecta o separador de forma ampla dentro da area de operacao e exclui nos de scaffold/significado. Rotas de saida para o recrutado sao `trainingOnly`, para que teste somente com entradas nao comece injetando pressao de resposta para tras.

Quando o scaffold explicito de conjuntos esta injetado, `recruitmentPolicyFor` estreita a fiacao do separador. Em vez de conectar com toda a area de operacao, um separador de caso conecta com as opcoes de fonte ativas, a saida esperada e a rota teacher reversa dessa saida esperada.

A politica ampla continua sendo fallback quando nenhum scaffold de conjuntos foi injetado.

## Geracao Relacional

`generateForOutput` e o primeiro uso generativo restrito das relacoes. Ele le a relacao da saida alvo, enumera o espaco atual de pares de fonte, le cada par pelos significados de scaffold, e mantem candidatos que satisfazem todos os invariantes aprendidos.

Isso ainda fica limitado ao laboratorio bitwise. A funcao testa se significado relacional pode rodar de volta, saindo de um papel alvo para estruturas de fonte possiveis.

## Meta-Regulacao

`metaRegulationState` e o primeiro scaffold para controle sobre aprendizagem. Ele le sinais observacionais:

- acuracia;
- ambiguidade;
- taxa de margem baixa;
- pressao de recrutamento nao resolvida;
- nos recrutados candidatos e estaveis.

Ele transforma esses sinais em eixos continuos:

```text
estabilidade <-> plasticidade
exploracao <-> exploracao do conhecido
certeza <-> duvida
restricao <-> liberdade
```

e controles sugeridos para plasticidade, modo de valvula, modo de limiar e tamanho da janela temporal.

Esse estado e observacional. Ele ainda nao sobrescreve controles manuais nem muda a rede sozinho.
