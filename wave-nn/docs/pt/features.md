# Recursos

[English](../features.md)

Esta pagina nomeia explicitamente os recursos atuais do FlowNN. Um recurso so deve ser tratado como parte do prototipo atual quando tem teste automatizado, controle/metrica visivel na demo, ou documento conceitual explicando por que existe.

## Conjunto Atual

| Recurso | O que significa | Verificado por |
| --- | --- | --- |
| Operacoes de tabela-verdade | XOR, AND, OR e NAND sao a regua pequena do laboratorio. | `truth table oracle matches supported operations` |
| Sinal so com forca | O sinal carrega apenas pressao; identidade vem da fonte e da topologia. | `signal carries strength only` |
| Ativacao por limiar | Nos ativam quando a pressao cruza o limiar. | `threshold gates node activation` |
| Flood de saida | No treino, a saida desejada pode agir como fonte de pressao teacher. | `outputs can flood pressure during training` |
| Rotas teacher so de treino | Rotas reversas de saida nao devem vazar para teste so com entradas. | `reverse output valves are training-only` |
| Ecologia limitada de valvulas | Abertura se aproxima de limites sem virar exatamente aberta ou fechada. | `valve openness stays bounded` |
| Modos separados de ecologia | Valvulas e limiares podem mudar de forma independente. | `valves and thresholds use separate ecology modes` |
| Plasticidade regional | Regioes de operacao, origem e valor consolidam em ritmos diferentes. | `operation plasticity consolidates after stable cycles`; `scaffold training locks primitive regions` |
| Teacher balanceado por raridade | Saidas raras podem receber teacher mais forte ou mais longo. | `teacher strength balances rare outputs`; `teacher duration balances rare outputs` |
| Scaffold de origem/valor | Significados primitivos sao treinados separados das operacoes. | `semantic scaffold topology exists`; `scaffold training locks primitive regions` |
| Explicacao de significado | O inspector le estrutura aprendida, scaffold e relacoes. | `meaning explanations use scaffold primitives`; `relation reader extracts operation meanings` |
| Aprendizagem local de valvulas | Flood altera resistencia e peso por coativacao. | `flood training changes valves` |
| Diagnosticos de teste | Testes registram pico, area, duracao e predicao hibrida. | `input-only tests produce diagnostic result shape` |
| Topologia recrutavel | O modo principal comeca sem pares fixos. | `recruitable topology starts without fixed pairs` |
| Recrutamento de separadores | Pressao nao resolvida repetida pode criar separador fraco. | `recruitment creates separators for repeated ambiguity` |
| Formacao bitwise fim-a-fim | A topologia recrutavel forma XOR, AND, OR e NAND no laboratorio atual. | `recruitable topology forms bitwise operations` |

## Ainda Nao Sao Recursos Atuais

- raciocinio aritmetico geral;
- transferencia sem topologia fixa em dominios grandes;
- probing ativo como controle da demo;
- estado unificado de expectativa/erro/precisao em cada no;
- roteamento temporal no runtime principal.

Eles ficam como direcao ate terem teste ou comportamento visivel.
