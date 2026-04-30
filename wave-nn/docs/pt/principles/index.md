# Principios

[English](../../principles/index.md)

Estes principios definem restricoes que devem valer entre implementacoes. Eles nao descrevem o codigo atual, o layout de nodes ou algoritmos escolhidos.

Um bom teste para um principio:

```text
se a implementacao mudasse completamente, isto ainda deveria ser verdade?
```

Se sim, pertence aqui. Se nao, pertence em [Sistema atual](../system/current-system.md), [Mapa de propriedades](../system/properties.md), ou em um doc de mecanismo.

## Meta-principios

### A. Interacao acima de representacao

Coisas sao definidas pelo que fazem em relacao a outras coisas, nao por rotulos estaticos ou vetores armazenados.

### B. Processo acima de estado

Tempo, mudanca, recorrencia e estabilizacao importam mais do que qualquer configuracao congelada.

### C. Restricao acima de idealizacao

O sistema deve operar sob limites. Inteligencia significa comportamento sob restricao, nao otimizacao infinita.

## 1. Significado como comportamento

Significado nao é armazenado como representacao estatica. Significado emerge de como sinais interagem, propagam, restringem uns aos outros e afetam comportamento futuro.

## 2. Tempo como estrutura

Tempo é uma dimensao estrutural primaria. Padroes temporais tornam estrutura possivel e podem transformar significado de primeira ordem em significado mais profundo.

## 3. Logica emergente

Relacoes logicas nao devem ser impostas como regras permanentes. Elas devem emergir de padroes de interacao estaveis e repetiveis dentro do sistema.

## 4. Inteligencia guiada por restricao

O sistema opera com recursos finitos. Comportamento deve refletir tradeoffs, priorizacao, alocacao seletiva e consequencias.

## 5. Consciencia de opcoes antes da selecao

Selecao so tem significado quando alternativas eram possiveis. O sistema deve preservar consciencia de possibilidades viaveis antes de se comprometer, mesmo quando apenas um subconjunto pode permanecer ativo.

## 6. Persistencia seletiva

Nem toda informacao, rota ou trace deve ser retido. O sistema deve aprender o que manter ativo, comprimir ou descartar.

## 7. Rastreabilidade e transparencia estrutural

O sistema deve permitir reconstruir como resultados foram produzidos. Comportamento deve ser explicavel por evolucao estrutural, nao por injecao escondida de resposta.

## 8. Aprendizagem como mudanca de comportamento

Aprendizagem muda como o sistema responde. Ela deve aparecer como padroes de interacao alterados, nao apenas como fatos armazenados.

## 9. Coerencia ao longo do tempo

O sistema deve estabilizar progressivamente comportamento ao longo da experiencia. Interacoes passadas devem influenciar respostas futuras sem congelar adaptacao.

## 10. Separacao entre teoria e implementacao

Principios definem o que deve continuar verdadeiro. Implementacoes definem como esses principios sao realizados sob restricoes atuais.

## Relacionados

- [Mapa de propriedades](../system/properties.md)
- [Modelo matematico](../math/index.md)
- [Sistema atual](../system/current-system.md)
- [Licoes](../lessons/index.md)
