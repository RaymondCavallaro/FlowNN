# Dinamica do sistema

[English](../../concepts/system-dynamics.md)

O projeto deve evitar implementar propriedades tipo cerebro como modulos isolados. A direcao util é definir dinamicas que facam essas propriedades aparecerem naturalmente.

## Requisitos

- estado interno continuo;
- recorrencia;
- representacoes distribuidas;
- roteamento dependente de estado;
- sensibilidade temporal;
- erro como sinal de primeira classe;
- estrutura adaptativa;
- amplificacao seletiva por ganho, limiar e plasticidade;
- tempos multiplos;
- completamento de padrao;
- equilibrio entre estabilidade e flexibilidade.

## Traducao atual

```text
pressao nao resolvida -> recrutamento de separador -> sobrevivencia/desvanecimento
```

O proximo passo nao deve adicionar muitos recursos de uma vez. Primeiro vem memoria continua de estado nao resolvido. Depois:

```text
expected_pressure
actual_pressure
error = actual_pressure - expected_pressure
precision = trust assigned to that error
```

A ideia de active inference deve entrar como dinamica local de node e rota, nao como controlador externo que sabe a resposta.

## Direcao posterior de self e valores

Valores nao devem entrar como rotulos externos de recompensa. Eles precisam de dinamicas inferiores primeiro:

```text
continuidade de experiencia
-> modelo de self
-> fronteira do self
-> atribuicao de consequencia
-> estabilidade de preferencia
-> hierarquia de valores
```

A ponte importante é o espaco de opcoes. O sistema deve comparar a acao escolhida contra opcoes que estavam disponiveis sob as mesmas restricoes antes de atualizar arrependimento, reforco ou hierarquia de valores. Veja [Self, valores e curiosidade](self-values-and-curiosity.md).
