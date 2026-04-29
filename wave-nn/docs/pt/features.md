# Recursos

[English](../features.md)

Esta pagina nomeia explicitamente os recursos atuais do FlowNN. Um recurso so deve ser tratado como parte do prototipo atual quando tem teste automatizado, controle/metrica visivel na demo, ou documento conceitual explicando por que existe.

## Conjunto Atual

| Recurso | O que significa | Verificado por |
| --- | --- | --- |
| Operacoes de tabela-verdade | XOR, AND, OR e NAND sao a regua pequena do laboratorio. | `truth table oracle matches supported operations` |
| Identidade estrutural de fonte | A pressao carrega apenas forca; identidade vem da fonte e da topologia. | `source identity is structural` |
| Ativacao por limiar | Nos ativam quando a pressao cruza o limiar. | `threshold gates node activation` |
| Flood de saida | No treino, a saida desejada pode agir como fonte de pressao teacher. | `outputs can flood pressure during training` |
| Rotas teacher reversas omitidas | Rotas reversas de saida para ocultos nao existem; a pressao teacher fica local na saida esperada. | `output reverse valves are omitted` |
| Ecologia limitada de valvulas | Abertura se aproxima de limites sem virar exatamente aberta ou fechada. | `valve openness stays bounded` |
| Modos separados de ecologia | Valvulas e limiares podem mudar de forma independente. | `valves and thresholds use separate ecology modes` |
| Plasticidade regional | Regioes de operacao, origem e valor consolidam em ritmos diferentes. | `operation plasticity consolidates after stable cycles`; `scaffold training locks primitive regions` |
| Teacher balanceado por raridade | Saidas raras podem receber teacher mais forte ou mais longo. | `teacher strength balances rare outputs`; `teacher duration balances rare outputs` |
| Scaffold de origem/valor | Significados primitivos sao treinados separados das operacoes. | `semantic scaffold topology exists`; `scaffold training locks primitive regions` |
| Scaffold explicito de conjuntos | Conceitos de conjunto/propriedade podem ser injetados manualmente como scaffold inspecionavel para recrutamento autonomo posterior. | `set scaffold starts explicit and empty`; `inject set scaffold adds manual concepts` |
| Scaffold gerado de conjuntos | Uma descricao funcional do scaffold pode regenerar o mesmo comportamento conjunto/propriedade e plugar de volta no recrutamento. | `generated set scaffold matches manual functionality`; `generated set scaffold plugs into recruitment` |
| Explicacao de significado | O inspector le estrutura aprendida, scaffold e relacoes. | `meaning explanations use scaffold primitives`; `relation reader extracts operation meanings` |
| Leitura relacional generativa | Uma relacao de saida pode gerar pares candidatos de fonte a partir dos invariantes aprendidos. | `relation reader generates source candidates` |
| Scaffold de meta-regulacao | A rede relata eixos de tensao adaptativa e controles sugeridos de aprendizagem a partir de estabilidade, ambiguidade e pressao de recrutamento. | `meta regulation responds to uncertainty`; `meta regulation consolidates stable behavior` |
| Aprendizagem local de valvulas | Flood altera resistencia e peso por coativacao. | `flood training changes valves` |
| Diagnosticos de teste | Testes registram pico, area, duracao e predicao hibrida. | `input-only tests produce diagnostic result shape` |
| Topologia recrutavel | O modo principal comeca sem pares fixos. | `recruitable topology starts without fixed pairs` |
| Recrutamento de separadores | Pressao nao resolvida repetida pode criar separador fraco usando o tuner atual de estrategia de recrutamento. | `recruitment creates separators for repeated ambiguity` |
| Politica experimental de recrutamento | O recrutamento de separadores usa um tuner secundario de eixos para escolher e refinar estrategias de conexao a partir do contexto do caso e feedback de sobrevivencia. | `set scaffold guides recruitment connections`; `recruitment strategy space includes scaffold option`; `recruitment axis demand is case dependent`; `recruitment strategies tune from survival` |
| Avaliacao bitwise exploratoria | A topologia recrutavel tenta XOR, AND, OR e NAND com recrutados amplos; sucesso nao e garantido por este recurso. | `recruitable topology attempts bitwise operations` |

## Ainda Nao Sao Recursos Atuais

- raciocinio aritmetico geral;
- geracao aberta fora do laboratorio atual de pares de fonte;
- transferencia sem topologia fixa em dominios grandes;
- probing ativo como controle da demo;
- estado unificado de expectativa/erro/precisao em cada no;
- roteamento temporal no runtime principal.

Eles ficam como direcao ate terem teste ou comportamento visivel.
