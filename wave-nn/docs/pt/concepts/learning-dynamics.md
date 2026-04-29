# Dinamica de aprendizagem

[English](../../concepts/learning-dynamics.md)

O treino usa flooding. Para uma linha da tabela-verdade, as fontes de entrada e a saida desejada sao injetadas juntas.

Exemplo para XOR:

```text
A0 + B1 + OUT1
```

Valvulas que veem coativacao local tendem a abrir e ganhar peso. Pressao que passa sem assentamento util pode aumentar resistencia. A rede nao recebe um historico simbolico de rota nem credito global de erro.

Valvulas reversas de saida nao fazem parte da topologia atual. Quando a pressao de saida ativava todos os pares candidatos, todos os conceitos aprendiam a mesma saida. Por isso a pressao teacher agora fica local na saida esperada, ate existir um mecanismo futuro mais estreito que justifique reabrir essa linha.

## Plasticidade Regional

Regioes como `operation`, `origin` e `value` podem reduzir plasticidade quando o comportamento fica estavel. Isso consolida sem congelar totalmente.

## Teste

Teste é separado de treino. Em teste, so as fontes de entrada sao injetadas, e nao ha valvulas reversas de saida para ocultos. As saidas sao medidas por pico, area, duracao e uma leitura hibrida.
