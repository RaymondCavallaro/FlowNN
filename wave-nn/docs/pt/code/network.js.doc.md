# network.js

[English](../../code/network.js.doc.md)

`src/network.js` contem o motor de pressao.

O arquivo de codigo deve ficar relativamente limpo. Esta pagina carrega a explicacao que ficaria barulhenta dentro do motor.

## Responsabilidades

- criar nos, valvulas e regioes;
- executar treino por flood;
- executar teste somente com entradas;
- atualizar plasticidade regional;
- registrar metricas;
- observar pressao nao resolvida;
- recrutar separadores quando ha ambiguidade repetida;
- produzir explicacoes para o inspector.

## Regra Importante

`Signal` carrega apenas `strength`. Identidade vem da fonte e da topologia. O sistema deve evitar tipo semantico explicito, tipo aceito por no, historico de rota e backprop.

## Teste

`testCase` injeta apenas fontes de entrada. Ele mede as saidas durante a janela de assentamento porque o pulso significativo pode acontecer antes do quadro final.
