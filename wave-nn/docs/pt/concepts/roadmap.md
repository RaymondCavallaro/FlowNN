# Roadmap

[English](../../concepts/roadmap.md)

O branch `main` atual é a linha de convergencia do experimento de rede de pressao.

Branches de versao sao prateleiras experimentais e checkpoints historicos, nao modulos permanentes. Os docs devem descrever primeiro a dinamica convergente dos nodes, e so mencionar branches quando algum trabalho esta estacionado fora do `main`.

## Direcao atual

```text
matematica de campo unificada para os mecanismos atuais
-> testes de emergencia de papel / reconstrucao de scaffold
-> calibracao de reguladores
-> recrutamento sob pressao nao resolvida
-> geracao relacional a partir de invariantes aprendidos
-> eixos de meta-regulacao para controle de aprendizagem
-> estado de expectativa/erro
-> metricas de precisao/certeza
-> probing por perturbacao
-> transferencia/reuso de estrutura relacional estavel
```

Aritmetica continua util como dominio de teste, mas trabalho especifico de aritmetica deve ficar separado ate as dinamicas gerais ficarem mais claras.

## Base conceitual necessaria

Antes de tornar o recrutamento mais inteligente, o sistema precisa de intuicoes primitivas de conjunto/propriedade:

- pertencimento;
- exclusao mutua;
- co-presenca;
- propriedade compartilhada;
- generalizacao;
- especializacao.

Ao procurar um novo conceito, ele deve comparar invariantes candidatos com conceitos similares ja conhecidos, descartar explicacoes ja cobertas, e aceitar apenas o invariante estavel que sobra.

Valores e curiosidade-como-valor devem vir depois de continuidade do self, fronteira do self, espaco de opcoes e atribuicao de consequencia.

Coerencia de conjuntos deve vir antes de resolucao tipo CSP; escolha ponderada por valores deve vir depois da comparacao do espaco de opcoes.

## Proximo recurso

A proxima linha principal é crescimento de topologia:

```text
topologia insuficiente -> recrutar nodes/conceitos -> formar topologia
```

Depois que isso estiver estavel e inspecionavel, o projeto pode avancar para identidade de raciocinio de passo, probing ativo, transferencia e tempo.

## Uso generativo atual

A primeira fatia generativa em `main` deve ficar pequena:

```text
saida alvo
-> invariante relacional estavel
-> pares candidatos de fonte
```

Ela serve para testar se uma relacao aprendida pode ser usada como gerador restrito. Nao deve virar um oraculo da operacao nem um gerador de tabela-verdade escrito a mao.

## Uso atual de meta-regulacao

A primeira fatia em `main` tambem deve ficar observacional:

```text
acuracia / ambiguidade / margem / pressao de recrutamento
-> eixos de tensao adaptativa
-> controles de aprendizagem sugeridos
```

O proximo passo é comparar essas sugestoes com os controles manuais de ecologia antes de deixar a camada dirigir plasticidade, modo de valvula, modo de limiar ou janelas temporais automaticamente.

## Helpers de runtime estacionados

O runtime carregava helpers genericos nao usados para interpolacao, escolha aleatoria e matematica de fase. Eles foram removidos de `src/math.js` ate que um recurso atual precise deles.

Roteamento temporal pode reconstruir os helpers de fase a partir de:

```text
wrap01(value) = ((value % 1) + 1) % 1
phaseDistance(a, b) = min(abs(wrap01(a) - wrap01(b)), 1 - abs(wrap01(a) - wrap01(b)))
signedPhaseDelta(target, current):
  delta = wrap01(target) - wrap01(current)
  if delta > 0.5: delta -= 1
  if delta < -0.5: delta += 1
```
