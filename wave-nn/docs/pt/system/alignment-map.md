# Mapa de alinhamento

[English](../../system/alignment-map.md)

Esta pagina conecta o sistema ativo em quatro camadas:

```text
principios -> propriedades -> mecanismos -> implementacao
```

Use isto como filtro do projeto. Se uma ideia nao puder ser colocada neste mapa, ela pertence a notas de apoio, licoes ou pool de ideias, nao ao nucleo ativo.

## Niveis de docs

### Minimo / nucleo

Leia estes para entender o sistema ativo:

- [Visao geral](../overview.md)
- [Fluxo central](../core-flow.md)
- [Sistema atual](current-system.md)
- [Principios](../principles/index.md)
- [Mapa de propriedades](properties.md)
- [Anatomia do node](node-anatomy.md)
- [Modelo matematico](../math/index.md)

### Docs de apoio

Use estes ao examinar comportamento ou codigo:

- [Recursos](../features.md)
- [Testes](../tests.md)
- [Teste manual](../manual-testing.md)
- [Notas de network.js](../code/network.js.doc.md)
- [Primitivas emprestadas](borrowed-primitives.md)

### Outros / contexto

Estes sao uteis, mas nao devem definir o sistema ativo sozinhos:

- expansoes conceituais em `docs/concepts`;
- licoes de mecanismos removidos ou que falharam;
- historico do projeto;
- notas de inspiracao externa.

## Alinhamento ativo

| Principio | Propriedade | Mecanismo | Implementacao |
| --- | --- | --- | --- |
| Significado como comportamento | Identidade estrutural de fonte | ponto de entrada + topologia | fontes `A0`, `A1`, `B0`, `B1`; sem tipo no payload |
| Processo sobre estado | Persistencia temporal | decay de pressao agora; alvo de drain-flow depois | `PressureNode.decay` é direct handle under review; rotas futuras de dreno devem reproduzir o efeito |
| Inteligencia guiada por restricao | Alocacao seletiva | limiar e condutancia de rota agora; alvo de semaforo depois | thresholds de node, openness de valvula e weight sao handles atuais; competicao de fluxo tipo semaforo é o alvo de revisao |
| Aprendizagem como mudanca de comportamento | Aprendizagem local de valvulas | coativacao muda condutancia | `learnValve`, `adjustOpenness`, updates de weight |
| Consciencia de opcoes antes da selecao | Disponibilidade de rota sem buckets | leitor de dinamica de rotas | `readRouteDynamics`, `inferRouteAvailability` |
| Traceability | Explicacao relacional | ler caminhos de suporte estaveis e invariantes | `readOutputRelation`, `explainOutput`, `generateForOutput` |
| Separacao entre teoria e implementacao | Scaffold explicito como ajuda temporaria | scaffold manual/gerado de conjuntos | `injectSetScaffold`, `generateSetScaffold` |
| Coerencia ao longo do tempo | Consolidacao regional | plasticidade muda depois de ciclos | `updateOperationPlasticityFromCycle`, plasticidade regional |
| Logica emergente | Geracao baseada em relacoes | invariantes entre caminhos de suporte | `invariantsFromPaths`, `relationFromSources` |

## Regra de revisao de handles diretos

Alguns handles de implementacao sao permitidos porque tornam testes possiveis antes de o sistema ter mecanismos internos mais ricos.

Exemplos:

- `decay` do node;
- `openness` e `weight` de valvula;
- plasticidade regional;
- eixos explicitos de estrategia de recrutamento.

Eles devem continuar revisaveis. Para cada um, nomeie um substituto possivel baseado em fluxo e adicione testes que comparem o handle direto com o substituto quando o substituto existir.

O objetivo nao é imitar biologia exatamente. O objetivo é um mecanismo minimo crivel: compreensivel, pratico de implementar e nao dependente de propriedades inexplicadas surgindo do nada.

## Regra de corte

Uma ideia fica no sistema ativo apenas se apoiar claramente um principio, reforcar uma propriedade e puder ser expressa por um mecanismo ou teste.

Se nao, faca uma destas coisas:

- mover para doc de apoio;
- arquivar como licao ou nota historica;
- manter como nota de pool de ideias fora dos docs ativos.

## Linha atual de desenvolvimento

O proximo trabalho de implementacao deve ficar nesta linha estreita:

```text
observabilidade de dinamica de rotas
-> disponibilidade de rota inferida
-> geracao apoiada por rotas
-> explicacao rastreavel
-> substitutos baseados em fluxo para handles diretos
-> internalizacao posterior do scaffold
```

Leitores externos sao permitidos como scaffolds. Eles devem ser desenhados para que leituras uteis possam depois virar dinamicas internas.

## Relacionado

- [Principios](../principles/index.md)
- [Mapa de propriedades](properties.md)
- [Anatomia do node](node-anatomy.md)
- [Recursos](../features.md)
