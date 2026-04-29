# Fluxo central

[English](../core-flow.md)

Esta pagina separa camadas de processamento de mecanismos.

## Camadas

Camadas respondem: onde o sistema esta no processo?

```text
pressao de fonte
  ↓
roteamento de operacao
  ↓
ativacao local
  ↓
aprendizagem / recrutamento
  ↓
leitura relacional
  ↓
refinamento temporal futuro
```

Camadas atuais do runtime:

- pressao de fonte;
- roteamento de operacao;
- leitura de saida;
- aprendizagem local;
- recrutamento por pressao nao resolvida.

Camadas futuras ou parciais:

- transformacao de sinal bruto;
- material temporal;
- significado temporal de segunda etapa;
- reconstrucao autonoma de scaffold.

## Mecanismos

Mecanismos respondem: o que faz o trabalho?

- `PressureNode`: acumula pressao e ativa depois de um limiar.
- `InputValve`: controla por onde a pressao pode fluir.
- resistencia e peso: moldam condutancia.
- plasticidade regional: escala quanto uma area pode mudar.
- recrutamento: adiciona estrutura fraca sob ambiguidade repetida.
- relacoes de scaffold: dao contexto conceitual explicito e inspecionavel.

## Loop principal

```text
injetar pressao de fonte
-> assentar ativacoes
-> rotear pressao por valvulas
-> comparar comportamento de saida
-> adaptar valvulas / plasticidade regional
-> recrutar se pressao nao resolvida repetir
```

## Restricao de design

Nao esconda significado no payload do sinal.

```text
ruim: pressao carrega "A0" ou "OUT1" como tipo
bom: pressao entra por A0 e se comporta pelo grafo
```

Isso mantem o experimento focado em identidade estrutural e dinamicas locais de pressao.

## Relacionados

- [Glossario](glossary.md)
- [Dinamica de aprendizagem](concepts/learning-dynamics.md)
- [Topologia](concepts/topology.md)
- [Matematica de campo unificada](concepts/field-math.md)
