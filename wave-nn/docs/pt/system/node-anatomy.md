# Anatomia do node

[English](../../system/node-anatomy.md)

Esta pagina explica por que um node é descrito com varias capacidades:

```text
Node {
  time intake
  meaning intake
  input valves
  activation threshold
  routing behavior
  temporal memory
  emission pattern
}
```

O ponto importante: isto nao significa que tudo seja um modulo separado no codigo atual. Sao papeis que um node pode cumprir no sistema. Alguns existem diretamente, alguns aparecem pelas valvulas ao redor, e alguns sao conceitos alvo para proximas versoes.

## Nucleo minimo

O runtime atual precisa apenas de um nucleo pequeno:

```text
pressure
threshold
decay
activation
received / pulse
```

`pressure` é o acumulo interno atual. `threshold` decide se a pressao vira ativacao. `decay` decide quanta pressao permanece depois de um passo. `activation` é a pressao utilizavel emitida para rotas que saem do node. `received` e `pulse` sao traces curtos para teste de saida e visualizacao.

Tag importante de revisao:

```text
direct handle under review
```

`decay`, ajuste de threshold, openness de valvula, weight de valvula e plasticidade regional sao handles uteis de implementacao e probes de teste. Eles nao sao automaticamente primitivas permanentes. Quando possivel, trabalho futuro deve tentar reproduzir seus efeitos por fluxo, valvulas, roteamento local e estruturas de suporte recrutadas.

## Por que o node tem muitos papeis

Um node fica entre entrada e roteamento. Se ele guardasse apenas um escalar e esquecesse imediatamente, a rede nao conseguiria expressar tempo, persistencia, seletividade ou significado reutilizavel.

Os papeis separam perguntas diferentes:

| Papel | Significado | Status atual | O que muda quando ajustado |
| --- | --- | --- | --- |
| Time intake | Como pressao chega ao longo do tempo. | parcial | Intake temporal melhor permite diferenciar pulso, recorrencia ou decaimento mesmo com a mesma pressao total. |
| Meaning intake | Qual estrutura de scaffold ou fonte chega ao node. | atual pela topologia | Mudar scaffold ou rotas de entrada muda como o node pode ser interpretado. |
| Input valves | Quais rotas alimentam o node e com qual condutancia. | atual | Abrir, fechar, adicionar ou remover valvulas muda o que pode ativar o node. |
| Activation threshold | Quanta pressao basta para ativar. | atual | Limiar menor deixa o node sensivel; limiar maior deixa seletivo. |
| Routing behavior | Para onde a ativacao pode seguir. | atual pelas valvulas de saida | Mudar rotas de saida muda o que o node contribui. |
| Temporal memory | Quanta pressao passada continua disponivel. | atual como decay direto / traces; alvo de revisao como mecanismo de drain-flow | Persistencia maior pode ser testada com decay agora, mas depois deve ser reproduzivel com rotas de dreno e controle por valvula. |
| Emission pattern | Como ativacao sai do node. | atual por ativacao e condutancia das valvulas de saida | Rotas com mais suporte recebem mais pressao; rotas fracas recebem menos. |

## Implementacao atual

`PressureNode` implementa:

- `pressure`: pressao interna acumulada;
- `threshold`: derivado de estado de limiar limitado para nodes adaptativos;
- `decay`: handle direto atual para quanta pressao permanece depois de assentar;
- `activation`: pressao disponibilizada para valvulas de saida;
- `received`: pressao recebida recentemente;
- `pulse`: pulso recente mais forte.

`InputValve` implementa a maior parte do que seria chamado informalmente de conexao do node:

- `from` / `to`;
- `resistance` / `openness`;
- `weight`;
- `activity` atual;
- `flowTrace` decrescente;
- `recurrence`;
- `usefulness`.

Essa separacao importa. Um node nao decide tudo sozinho. O comportamento do node emerge do estado do node mais as valvulas ao redor.

## Handles diretos versus mecanismos de fluxo

Alguns campos do codigo existem porque deixam o laboratorio atual pequeno, testavel e inspecionavel. Um handle direto é aceitavel quando permite provar que um comportamento é util. Ele deve ser marcado para revisao quando o alvo de longo prazo é um mecanismo gerado por fluxo.

| Handle atual | Por que existe agora | Substituto flow-first a testar |
| --- | --- | --- |
| `PressureNode.decay` | Forma barata de testar persistencia temporal. | Conectar o node a uma estrutura de dreno; regular esquecimento pela condutancia da valvula de dreno. |
| `openness` / `weight` de valvula | Forma barata de testar preferencia de rota e aprendizagem. | Deixar caminhos alternados esculpirem condutancia de rota por pressao compartilhada, plasticidade e competicao tipo semaforo. |
| Plasticidade regional | Forma barata de proteger ou soltar regioes inteiras. | Deixar moduladores locais mudarem plasticidade ao redor de regioes ativas, parecido com um recurso local ou emissor hormonal. |
| Criacao / remocao de conexao | Forma barata de testar recrutamento. | Simular criacao/destruicao pratica levando resistencia para extremos disponiveis ou indisponiveis. |

A pergunta nao é se handles diretos sao proibidos. A pergunta é se cada handle direto pode depois ser substituido por um mecanismo crivel feito de fluxo, valvulas, nodes e modulacao local.

## Como cada parte é usada

### Activation threshold

Threshold é o gate de seletividade.

```text
pressure >= threshold -> activation
pressure < threshold  -> sem ativacao oculta
```

Para nodes de saida, pressao recebida ainda fica visivel para testes detectarem evidencia fraca de saida.

Testes:

- `threshold gates node activation`

### Temporal memory

No codigo atual, decay controla quanta pressao sobrevive a cada passo de assentamento.

```text
next pressure = current pressure * decay
```

Decay alto significa persistencia. Decay baixo significa esquecimento rapido.

Isto é um probe direto de implementacao. Um mecanismo mais nativo faria esquecimento emergir de fluxo saindo do node:

```text
pressao do node -> node dreno
condutancia da valvula de dreno -> decay efetivo
```

Assim a mesma maquinaria de valvula regularia persistencia em vez de dar a cada node um knob permanente de decay.

Testes:

- `node decay controls temporal persistence`

### Meaning intake

Meaning intake nao é um tipo no payload. Um node recebe significado porque rotas estruturadas chegam ate ele.

Exemplo:

```text
A0 -> ORIGIN_A
A0 -> VALUE_0
```

Isto permite que explicacoes leiam `A0` como origem A e valor 0 sem colocar rotulo semantico dentro do sinal.

Testes:

- `semantic scaffold topology exists`
- `scaffold training locks primitive regions`
- `meaning explanations use scaffold primitives`

### Routing behavior e emission

Quando um node ativa, valvulas de saida distribuem pressao conforme condutancia:

```text
conductance = weight * openness
```

A mesma ativacao do node pode produzir efeitos diferentes a jusante dependendo do suporte das rotas.

`openness` e `weight` sao handles diretos de rota hoje. O alvo flow-first é fazer disponibilidade de rota emergir de historico de pressao e competicao:

```text
caminho A ativo -> esculpe condicoes locais de valvula
caminho B depois flui pelas condicoes moldadas
fluxo do caminho B fica proporcional ao fluxo anterior do caminho A
```

Isso exige um mecanismo tipo semaforo: um caminho muda condicoes locais, e outro caminho le essas condicoes sem precisar de prioridade manual de rota.

Testes:

- `emission follows valve route support`
- `valve openness stays bounded`
- `flood training changes valves`

### Roteamento tipo semaforo

Um semaforo é um candidato a mecanismo de apoio, nao uma primitiva central provada ainda.

Intuicao operacional:

```text
um caminho ativo muda condicoes locais de valvula/plasticidade
outro caminho é gated ou escalado por essas condicoes mudadas
```

Isso poderia apoiar comportamento tipo multiplicacao ou proporcional sem ajustar `openness` diretamente. Tambem permitiria que um node pertencesse a regioes sobrepostas, como um diagrama de Venn, onde multiplos contextos ativos modulam as mesmas rotas locais.

Alvo de revisao:

```text
provar que um grupo pequeno de nodes pode criar comportamento de semaforo
antes de promover isso ao nucleo do sistema
```

### Time intake

Time intake atualmente é implicito. Nodes recebem pressao passo a passo, e decay torna o timing visivel.

Time intake futuro deve separar:

- pulso;
- recorrencia;
- oscilacao;
- perfil de decaimento;
- atraso.

Isso permitiria que duas entradas com a mesma pressao total significassem coisas diferentes por causa da estrutura temporal.

## O que mudar ao experimentar

Use testes pequenos de knobs:

| Mudanca | Efeito esperado |
| --- | --- |
| Baixar threshold | Mais ativacao, mais sensibilidade, mais falsos positivos. |
| Subir threshold | Menos ativacao, mais seletividade, mais perda de sinais fracos. |
| Subir decay | Mais persistencia, recorrencia mais facil, mais pressao residual. |
| Baixar decay | Esquecimento mais rapido, pulsos curtos mais limpos, menos carryover temporal. |
| Subir weight/openness de saida | Contribuicao mais forte para nodes a jusante. |
| Baixar weight/openness de saida | Contribuicao mais fraca e menor preferencia de rota. |
| Adicionar rota de entrada | Nova causa possivel de ativacao. |
| Adicionar rota de saida | Novo efeito possivel da ativacao. |

Estes sao knobs de teste, nao filosofia final. Quando um knob provar utilidade, adicione um segundo teste perguntando se um mecanismo pequeno de fluxo consegue reproduzir o mesmo efeito.

## Regra

Nao torne toda capacidade do node explicita sem um teste exigindo isso. Mantenha a implementacao minima, depois adicione scaffolds de observacao ou dinamicas internas apenas quando eles explicarem uma mudanca mensuravel.

Quando uma nova propriedade direta for adicionada, documente como:

```text
direct handle under review
```

e nomeie o mecanismo de fluxo que talvez possa substitui-la.

## Resultados atuais dos probes de substituicao

Estes testes verificam de proposito se os substitutos flow-first ja sao reais:

| Probe | Resultado |
| --- | --- |
| Rota de dreno para decay | Ainda **nao** substitui decay direto. A condutancia atual envia pressao para frente, mas nao subtrai do node de origem; entao um dreno pode receber fluxo sem drenar a origem. |
| Extremos de resistencia para disponibilidade de conexao | Funciona como proxy pratico de disponibilidade de conexao. Resistencia muito alta se comporta como rota indisponivel, e resistencia muito baixa como rota disponivel. |
| Coativacao esculpindo fluxo posterior | Funciona como precursor fraco de semaforo. Coativacao pode fortalecer uma rota compartilhada que fluxo posterior le, mas ainda nao é gating completo de caminho para caminho. |

Este é o estilo desejado de desenvolvimento: deixar os testes mostrarem quais substitutos ja funcionam e quais mecanismos ainda precisam de suporte no motor.

## Relacionado

- [Mapa de alinhamento](alignment-map.md)
- [Mapa de propriedades](properties.md)
- [Notas de network.js](../code/network.js.doc.md)
- [Testes](../tests.md)
