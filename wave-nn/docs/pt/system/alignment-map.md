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
| Processo sobre estado | Persistencia temporal | decaimento de pressao e residuo de trace | `PressureNode.decay`, `InputValve.flowTrace` |
| Inteligencia guiada por restricao | Alocacao seletiva | limiar e condutancia de rota | thresholds de node, openness de valvula, weight |
| Aprendizagem como mudanca de comportamento | Aprendizagem local de valvulas | coativacao muda condutancia | `learnValve`, `adjustOpenness`, updates de weight |
| Consciencia de opcoes antes da selecao | Disponibilidade de rota sem buckets | leitor de dinamica de rotas | `readRouteDynamics`, `inferRouteAvailability` |
| Traceability | Explicacao relacional | ler caminhos de suporte estaveis e invariantes | `readOutputRelation`, `explainOutput`, `generateForOutput` |
| Separacao entre teoria e implementacao | Scaffold explicito como ajuda temporaria | scaffold manual/gerado de conjuntos | `injectSetScaffold`, `generateSetScaffold` |
| Coerencia ao longo do tempo | Consolidacao regional | plasticidade muda depois de ciclos | `updateOperationPlasticityFromCycle`, plasticidade regional |
| Logica emergente | Geracao baseada em relacoes | invariantes entre caminhos de suporte | `invariantsFromPaths`, `relationFromSources` |

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
-> internalizacao posterior do scaffold
```

Leitores externos sao permitidos como scaffolds. Eles devem ser desenhados para que leituras uteis possam depois virar dinamicas internas.

## Relacionado

- [Principios](../principles/index.md)
- [Mapa de propriedades](properties.md)
- [Anatomia do node](node-anatomy.md)
- [Recursos](../features.md)
