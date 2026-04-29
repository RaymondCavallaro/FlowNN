# main.js

[English](../../code/main.js.doc.md)

`src/main.js` conecta o motor de pressao com a interface do navegador.

Ele controla:

- botoes de treino, teste, reset e auto-treino;
- injecao manual de scaffold conjunto/propriedade;
- injecao gerada de scaffold conjunto/propriedade;
- selecao de operacao;
- sliders de taxa, aprendizagem e balanceamento;
- metricas visiveis;
- inspector de nos e valvulas.

A UI separa treino e teste. Flood training nao deve entrar direto na metrica de acuracia; acuracia vem de testes somente com entradas.
