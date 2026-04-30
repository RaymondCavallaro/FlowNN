# 001: Flooding de saida

[English](../../lessons/output-flooding.md)

## Pergunta

Saidas devem ser apenas sinks passivos ou participantes ativos durante treino?

## Hipotese

Durante treino, a saida desejada deve emitir pressao junto com as entradas. Isso cria encontro local de pressao entre causas e resultado esperado sem armazenar tipo de sinal ou credito global de rota.

Durante teste, as saidas voltam a ser endpoints. Acuracia deve vir de teste somente com entradas.

## Risco

Se a pressao teacher vazar para teste, a rede parece saber a resposta sem ter formado rota inspecionavel. Por isso a topologia atual nao cria rotas reversas de saida para hidden ou recrutados.
