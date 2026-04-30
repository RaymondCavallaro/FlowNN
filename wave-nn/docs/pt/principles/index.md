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

Selecao so tem significado quando alternativas eram possiveis. O sistema deve preservar consciencia de possibilidades viaveis antes de se comprometer, enquanto aloca recursos ativos seletivamente.

```text
rotas possiveis != rotas ativas
```

A teoria deve preservar diversidade de rotas conceitualmente. A implementacao deve manter ativo apenas o que os recursos permitem:

```text
muitos caminhos possiveis sao registrados
poucos caminhos ativos sao mantidos
caminhos inativos podem ser comprimidos, arquivados ou descartados
```

Quando recursos sao abundantes, exploracao mais ampla pode permanecer ativa. Quando recursos sao limitados, o sistema deve manter ativamente apenas rotas com alto valor esperado, incerteza de alto risco, valor de fallback diverso, ou importancia explicativa / reversivel.

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

## 11. Estado privado e interacao interpretativa

Agentes possuem estados internos que nao sao diretamente observaveis por outros agentes. Interacao depende de sinais parciais, inferencia e incerteza.

O sistema deve tratar outros agentes como opacos e autodirigidos, nao como extensoes totalmente legiveis de si mesmo.

## 12. Agencia independente

Nenhum agente externo consegue representar totalmente as prioridades de outro agente. Cada agente deve poder expressar, proteger e avancar seus proprios objetivos sob restricao.

## 13. Inferencia de valores e mismatch produtivo

Comportamento observado pode ser usado para inferir valores possiveis, mas esses valores inferidos continuam incertos. Comparar valores externos inferidos com valores internos pode produzir alinhamento, tensao, curiosidade, adaptacao ou diferenciacao.

Mismatch nao é apenas conflito. Ele pode virar alavanca para aprender o que importa e como este sistema difere de outros.

## Relacionados

- [Mapa de propriedades](../system/properties.md)
- [Modelo matematico](../math/index.md)
- [Sistema atual](../system/current-system.md)
- [Self, valores e curiosidade](../concepts/self-values-and-curiosity.md)
- [Licoes](../lessons/index.md)
