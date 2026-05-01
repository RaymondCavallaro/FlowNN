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
| Temporal memory | Quanta pressao passada continua disponivel. | atual como decay / traces | Decay maior preserva pressao por mais tempo; decay menor faz o node esquecer rapido. |
| Emission pattern | Como ativacao sai do node. | atual por ativacao e condutancia das valvulas de saida | Rotas com mais suporte recebem mais pressao; rotas fracas recebem menos. |

## Implementacao atual

`PressureNode` implementa:

- `pressure`: pressao interna acumulada;
- `threshold`: derivado de estado de limiar limitado para nodes adaptativos;
- `decay`: quanta pressao permanece depois de assentar;
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

Decay controla quanta pressao sobrevive a cada passo de assentamento.

```text
next pressure = current pressure * decay
```

Decay alto significa persistencia. Decay baixo significa esquecimento rapido.

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

Testes:

- `emission follows valve route support`
- `valve openness stays bounded`
- `flood training changes valves`

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

## Regra

Nao torne toda capacidade do node explicita sem um teste exigindo isso. Mantenha a implementacao minima, depois adicione scaffolds de observacao ou dinamicas internas apenas quando eles explicarem uma mudanca mensuravel.

## Relacionado

- [Mapa de alinhamento](alignment-map.md)
- [Mapa de propriedades](properties.md)
- [Notas de network.js](../code/network.js.doc.md)
- [Testes](../tests.md)
