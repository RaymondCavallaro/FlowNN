# network.js

[English](../../code/network.js.doc.md)

`src/network.js` contem o motor de pressao.

O arquivo de codigo deve ficar relativamente limpo. Esta pagina carrega a explicacao que ficaria barulhenta dentro do motor.

Para o alvo matematico unificado atual, veja [Modelo matematico](../math/index.md). A versao curta: `PressureNetwork` continua inspecionavel, enquanto um `PressureField` futuro pode comprimir as mesmas dinamicas em estado esparso indexado.

## Responsabilidades

- criar nodes, valvulas e regioes;
- executar treino por flood;
- executar teste somente com entradas;
- atualizar plasticidade regional;
- registrar metricas;
- observar pressao nao resolvida;
- recrutar separadores exploratorios quando ha ambiguidade repetida;
- produzir explicacoes para o inspector;
- injetar conceitos explicitos de conjunto/propriedade como scaffold manual;
- gerar pares candidatos de fonte a partir de invariantes relacionais de saida.

## Regra importante

Nao existe objeto runtime `Signal` separado. Pressao é injetada diretamente em nodes de fonte/saida como forca, e identidade continua estrutural. O sistema deve evitar tipo semantico explicito, tipo aceito por node, historico de rota e backprop.

## Dinamica de rotas

`InputValve` carrega um pequeno scaffold observacional:

- `flowTrace`: residuo decrescente de throughput recente;
- `recurrence`: quao repetidamente a rota conduziu;
- `usefulness`: se a aprendizagem tratou a rota recentemente como util ou prejudicial.

Esses campos nao sao rotulos de ciclo de vida da rota. Eles sao tracos dinamicos que permitem ao inspector inferir se a rota esta fluindo, disponivel, residual, fria ou latente.

## Teste

`testCase` injeta apenas fontes de entrada. Ele mede as saidas durante a janela de assentamento porque o pulso significativo pode acontecer antes do quadro final.

## Scaffold de conjuntos

`injectSetScaffold` injeta conceitos e relacoes explicitas sem treinar rotas de pressao. Ele usa o gerador funcional de scaffold com `source = manual`, produzindo pertencimento a eixo, opcoes de entrada, exclusao mutua, co-presenca, propriedade compartilhada de valor e generalizacao.

As relacoes injetadas sao marcadas por origem:

```text
source = manual
```

assim o recrutamento automatico posterior pode reutilizar a mesma forma sem fingir que o scaffold manual foi descoberto pela rede.

`generateSetScaffold` reconstrui essa forma a partir de uma descricao funcional e dos nodes de fonte atuais. Ele infere eixos e valores pelos ids das fontes, cria os conceitos e relacoes necessarios, e marca o resultado com:

```text
source = generated
```

`injectGeneratedSetScaffold` pluga o scaffold gerado no mesmo slot `setScaffold` usado pela injecao manual, entao explicacoes de fonte e candidatos de estrategia de recrutamento continuam funcionando.

## Recrutamento

Quando uma assinatura nao resolvida persiste, a rede cria um separador fraco. O tuner de estrategia de recrutamento escolhe quao ampla deve ser a conexao dentro da area de operacao, mantendo nodes de scaffold/significado fora. O modelo atual nao cria rotas reversas de saida para o recrutado, entao teste somente com entradas nao recebe pressao de resposta para tras.

`recruitmentPolicyFor` nao contem mais uma resposta fixa para onde um separador deve se conectar. Ele monta estrategias candidatas e deixa o controlador de recrutamento escolher uma.

Estrategias atuais:

```text
active-case-context
expected-output-context
set-scaffold-context
broad-operation-area
```

`set-scaffold-context` so fica disponivel quando o scaffold explicito de conjuntos foi injetado. As estatisticas de estrategia registram tentativas, pontuacao, sucessos e falhas. `updateRecruitmentSurvival` ajusta a pontuacao da estrategia depois que o recrutado melhora ou falha.

O tuner secundario adiciona uma camada continua por baixo desses nomes de estrategia. `recruitmentAxisDemand` le o caso e produz demanda de eixos:

```text
sourceFocus
outputFocus
scopeBreadth
scaffoldUse
teacherFeedback
```

Cada estrategia tem um perfil nesses eixos. A selecao compara demanda atual do caso, pesos de eixo aprendidos e pontuacao de sobrevivencia da estrategia. O feedback de sobrevivencia ajusta tanto a pontuacao da estrategia nomeada quanto os pesos de eixo usados por ela.

## Geracao relacional

`generateForOutput` é o primeiro uso generativo restrito das relacoes. Ele le a relacao da saida alvo, enumera o espaco atual de pares de fonte, le cada par pelos significados de scaffold, e mantem candidatos que satisfazem todos os invariantes aprendidos.

`readRouteDynamics` é um leitor externo de scaffold. Ele observa suporte, fluxo recente, resistencia, recorrencia, residuo de traco, utilidade e potencial de reativacao sem armazenar buckets explicitos como ativo, comprimido ou descartado. A disponibilidade é uma leitura diagnostica inferida das dinamicas.

`generateForOutput` tambem anexa evidencia de rota do conjunto de caminhos aprendido e ordena candidatos pelo suporte inferido. Isso ainda fica limitado ao laboratorio bitwise. A funcao testa se significado relacional pode rodar de volta, saindo de um papel alvo para estruturas de fonte possiveis.

## Meta-Regulacao

`metaRegulationState` é o primeiro scaffold para controle sobre aprendizagem. Ele le sinais observacionais:

- acuracia;
- ambiguidade;
- taxa de margem baixa;
- pressao de recrutamento nao resolvida;
- nodes recrutados candidatos e estaveis.

Ele transforma esses sinais em eixos continuos:

```text
estabilidade <-> plasticidade
exploracao <-> exploracao do conhecido
certeza <-> duvida
restricao <-> liberdade
```

e controles sugeridos para plasticidade, modo de valvula, modo de limiar e tamanho da janela temporal.

Esse estado é observacional. Ele ainda nao sobrescreve controles manuais nem muda a rede sozinho.
