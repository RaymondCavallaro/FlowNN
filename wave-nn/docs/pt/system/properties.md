# Mapa de propriedades

[English](../../system/properties.md)

Esta pagina separa propriedades por papel:

- **escolha de implementacao**: util para o prototipo atual, mas substituivel;
- **alvo nativo**: deve virar parte direta da mecanica do sistema;
- **alvo emergente**: deve emergir da interacao, nao ser escrito a mao como modulo.

Status significa:

- **alcancado**: presente e testado ou documentado como comportamento atual;
- **parcial**: presente, mas limitado ou ainda controlado externamente;
- **alvo**: desejado, mas ainda nao implementado.

| Propriedade | Status | Papel | Notas |
| --- | --- | --- | --- |
| Laboratorio de tabela-verdade | alcancado | escolha de implementacao | XOR/AND/OR/NAND sao reguas, nao o dominio final. |
| Payload escalar de pressao | alcancado | alvo nativo | Sinais nao devem carregar rotulos semanticos. |
| Identidade estrutural de fonte | alcancado | alvo nativo | Identidade vem de ponto de entrada, topologia e comportamento roteado. |
| Persistencia temporal do node | alcancado | alvo nativo | Decay deixa pressao continuar disponivel entre passos. |
| Emissao moldada por condutancia | alcancado | alvo nativo | Nodes ativados emitem pelo suporte das valvulas de saida. |
| Aprendizagem local de valvulas | alcancado | alvo nativo | Aprendizagem aparece como mudanca de condutancia, resistencia e preferencia de rota. |
| Fronteira de teste somente com entradas | alcancado | escolha de implementacao | Limite util de seguranca para o laboratorio supervisionado atual. |
| Sem valvulas reversas de saida | alcancado | escolha de implementacao | Simplificacao atual depois da licao de reverse flood. |
| Scaffold explicito de conjunto/propriedade | alcancado | escolha de implementacao | Camada de controle usada para expor o mecanismo antes da autonomia. |
| Scaffold gerado por descricao | alcancado | ponte para alvo nativo | Mostra que a funcao do scaffold pode ser reconstruida por interfaces compartilhadas. |
| Geracao baseada em relacao | parcial | alvo emergente | A versao atual gera candidatos restritos de fonte a partir de relacoes aprendidas. |
| Recrutamento de separadores | parcial | alvo emergente | Atualmente apoiado por maquinaria explicita de estrategia; deve ficar mais autodirigido. |
| Ajuste de estrategia de recrutamento | parcial | alvo nativo | Gradientes de eixo devem virar controle do sistema, nao prioridade manual. |
| Meta-regulacao | parcial | alvo nativo | Observacional agora; deve eventualmente regular plasticidade, limiares, valvulas e janelas temporais. |
| Balanco adaptativo de pressao | alvo | alvo nativo | Capacidade e restricao devem ser reguladas juntas. |
| Observabilidade de dinamica de rotas | alcancado | ponte para alvo nativo | Leitores externos inferem disponibilidade de rota por suporte, fluxo, trace, recorrencia e utilidade. |
| Rastreamento de distribuicao de caminhos | parcial | alvo nativo | Preservar consciencia de alternativas viaveis por dinamica de rotas sem manter toda rota ativa. |
| Reversibilidade parcial / memoria de traces | alvo | alvo nativo | Rastrear resultados de volta para rotas contribuintes para explicacao e refinamento. |
| Restricoes duras sobre fluxo | alvo | alvo nativo | Impedir estados invalidos mantendo dinamicas de pressao inspecionaveis. |
| Vies de campo | alvo | alvo nativo | Adicionar pressao direcional global sem substituir roteamento local. |
| Ruido controlado de roteamento | alvo | alvo nativo | Usar exploracao estruturada que pode decair ou ter seu decaimento desacelerado. |
| Consciencia de opcoes | alvo | alvo emergente | O sistema deve saber quais alternativas eram possiveis antes da selecao enquanto aloca recursos ativos seletivamente. |
| Persistencia seletiva | alvo | alvo emergente | Disponibilidade deve emergir de condutancia, decay, recorrencia, residuo de trace e utilidade. |
| Camada de material temporal | alvo | alvo nativo | Estrutura temporal bruta deve virar material pre-semantico. |
| Significado temporal de segunda etapa | alvo | alvo emergente | Significado deve refinar por comportamento temporal roteado. |
| Dinamicas estruturais de self/valor | alvo | alvo emergente | Valores devem emergir depois de continuidade, espaco de opcoes e atribuicao de consequencia. |
| Matematica de campo unificada | parcial | alvo nativo | O modelo é primeira classe nos docs; implementacao pode depois comprimir para forma de campo esparso. |

## Regra

Nao promova uma escolha de implementacao a principio. Nao escreva um alvo emergente a mao como atalho, a menos que esteja claramente marcado como scaffold.
