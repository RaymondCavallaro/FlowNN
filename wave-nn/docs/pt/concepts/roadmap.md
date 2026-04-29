# Roadmap

[English](../../concepts/roadmap.md)

O branch `main` atual e a linha de convergencia do experimento de rede de pressao.

Branches de versao sao prateleiras experimentais e checkpoints historicos, nao modulos permanentes. Os docs devem descrever primeiro a dinamica convergente dos nos, e so mencionar branches quando algum trabalho esta estacionado fora do `main`.

## Direcao Atual

```text
recrutamento sob pressao nao resolvida
-> geracao relacional a partir de invariantes aprendidos
-> estado de expectativa/erro
-> metricas de precisao/certeza
-> probing por perturbacao
-> transferencia/reuso de estrutura relacional estavel
```

Aritmetica continua util como dominio de teste, mas trabalho especifico de aritmetica deve ficar separado ate as dinamicas gerais ficarem mais claras.

## Base Conceitual Necessaria

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

## Proximo Recurso

A proxima linha principal e crescimento de topologia:

```text
topologia insuficiente -> recrutar nos/conceitos -> formar topologia
```

Depois que isso estiver estavel e inspecionavel, o projeto pode avancar para identidade de raciocinio de passo, probing ativo, transferencia e tempo.

## Uso Generativo Atual

A primeira fatia generativa em `main` deve ficar pequena:

```text
saida alvo
-> invariante relacional estavel
-> pares candidatos de fonte
```

Ela serve para testar se uma relacao aprendida pode ser usada como gerador restrito. Nao deve virar um oraculo da operacao nem um gerador de tabela-verdade escrito a mao.
