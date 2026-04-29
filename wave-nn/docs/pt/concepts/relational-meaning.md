# Significado Relacional

[English](../../concepts/relational-meaning.md)

O scaffold atual deixa o sistema explicar nos por significados primitivos conhecidos. O proximo passo e ler significado como relacao.

## Definicao

```text
relacao = invariante que permanece estavel atraves de caminhos validos
```

Para XOR, caminhos concretos podem variar:

```text
A0 -> H1 -> OUT1
A1 -> H2 -> OUT1
```

Mas a leitura estavel pode ser:

```text
cross-origin + mixed-value -> VALUE_1
```

Isso separa:

- significado de no: o que ativa um no;
- significado de grupo: estrutura compartilhada;
- significado de relacao: mapeamento estavel entre conjuntos;
- significado de caminho: como o mapeamento e realizado.

## Primeiro Uso Generativo

O proximo passo pequeno e usar a leitura relacional no sentido inverso:

```text
saida alvo
-> invariante relacional aprendido
-> conjuntos candidatos de fonte
```

No laboratorio bitwise atual, isso quer dizer que uma relacao de saida pode propor pares de fonte. Se `OUT1` tem o invariante:

```text
cross-origin + mixed-value -> VALUE_1
```

a leitura generativa pode propor:

```text
A0 + B1
A1 + B0
```

Isso ainda nao e geracao aberta. E uma reconstrucao restrita: o sistema enumera o espaco atual de pares de fonte e mantem candidatos cuja relacao de scaffold satisfaz o invariante aprendido. A ponte que queremos tornar visivel e:

```text
relacao como explicacao -> relacao como gerador
```

Depois, o trabalho generativo deve depender menos de enumerar pares conhecidos e mais de nos conceituais recrutados, probing ativo e reuso por transferencia.

## Intuicao De Conjunto E Propriedade

O experimento atual de recrutamento amplo mostra uma base que ainda falta: antes de escolher boas estrategias de recrutamento, o sistema precisa de uma intuicao primitiva de conjunto/propriedade.

Isso nao precisa comecar como teoria formal dos conjuntos. Precisa de distincoes operacionais:

```text
eixo de entrada
opcao de entrada
pertencimento
exclusao mutua
co-presenca
propriedade compartilhada
generalizacao
especializacao
```

No laboratorio bitwise atual:

```text
A0 e A1 pertencem ao eixo A
B0 e B1 pertencem ao eixo B
A0 e A1 sao opcoes mutuamente exclusivas
A0 e B1 podem co-existir em um caso
A0 e B0 compartilham VALUE_0
A1 e B1 compartilham VALUE_1
```

Essas distincoes importam porque recrutamento nao deve tratar todo no co-visivel como o mesmo tipo de vizinho. Contexto valido de caso, opcao alternativa, propriedade compartilhada e papel de saida pedem estrategias diferentes.

## Scaffold Explicito E Injetavel De Conjuntos

A implementacao atual pode trapacear de proposito ao injetar conceitos de conjunto/propriedade como scaffold explicito.

A injecao manual adiciona relacoes inspecionaveis como:

```text
A0 pertence-a AXIS_A
A1 pertence-a AXIS_A
A0 exclui A1 dentro de AXIS_A
A0 pode-coexistir-com B1
A0 compartilha PROP_VALUE_0 com B0
```

Isso nao e tratado como conhecimento descoberto. Cada conceito e relacao injetada fica marcado com `source = manual`.

O objetivo e tornar claro o mecanismo de controle antes de devolve-lo ao sistema:

```text
scaffold manual de conjuntos
-> forma inspecionavel de conceito/relacao
-> comparacao com traces aprendidos
-> recrutamento automatico posterior dos mesmos tipos de conceito
```

O modo automatico futuro deve usar pressao nao resolvida, co-presenca repetida, exclusao mutua e propriedades compartilhadas estaveis para recrutar conceitos de conjunto equivalentes dinamicamente.

## Politica De Recrutamento Por Papeis De Conjunto

O mesmo scaffold pode guiar onde um no recrutado deve se conectar.

Sem o scaffold de conjuntos, o recrutamento de separador usa a politica ampla antiga:

```text
nos da area de operacao <-> separador
```

Com o scaffold injetado, um separador especifico de caso usa uma politica de contexto mais estreita:

```text
opcoes de fonte ativas -> separador
separador -> saida esperada
saida esperada -> separador como rota teacher de treino
```

Por exemplo, `A0 + B1 -> OUT1` nao resolvido recruta um separador conectado a:

```text
A0
B1
OUT1
```

Ele nao se conecta a `A1`, `B0` ou `OUT0` so porque esses nos aparecem em relacoes proximas de co-presenca. Co-presenca continua sendo evidencia para recrutamento conceitual posterior; ela nao deve tornar todo separador de caso amplo de novo.

## Coerencia De Conjuntos Antes De CSP

Intuicao de conjunto deve vir antes de resolucao tipo CSP.

A ordem util e:

```text
agrupamento de sinais
-> conjuntos de objeto / categoria
-> conjuntos de relacao
-> conjuntos de fronteira self/mundo
-> conjuntos de opcoes
-> conjuntos de restricoes
-> resolucao tipo CSP
```

A cognicao inicial nao deve comecar resolvendo restricoes formalmente. Ela deve primeiro estabilizar mundos possiveis:

```text
o que pertence junto
o que exclui o que
o que sobrepoe
o que pode coexistir
o que nao pode coexistir
```

Exemplos de conjuntos:

```text
Self-set       = coisas que pertencem a mim
World-set      = coisas fora de mim
Action-set     = coisas que posso fazer
Forbidden-set  = coisas que quebram coerencia
Possible-set   = opcoes ainda disponiveis
```

Isso da uma direcao em tres passos:

```text
formacao de conjuntos = coerencia suave
formacao de restricoes = deteccao de conflito
resolucao CSP = resolucao estruturada posterior
```

Coerencia vem antes de maximizacao de objetivo. O sistema deve primeiro aprender que um estado nao pode ser `eu` e `nao-eu` ao mesmo tempo, que uma opcao pode ser possivel enquanto viola outro conjunto, e que uma memoria pode conflitar com a percepcao atual. So depois ele deve perguntar qual opcao coerente melhor satisfaz valores.

## Invariante Por Exclusao

Para chegar a um invariante que aponta corretamente para um novo conceito, o sistema nao deve aceitar o primeiro padrao compartilhado que encontra.

Ele deve comparar o candidato com conceitos similares que ja possui:

```text
caminhos candidatos
-> extrair propriedades compartilhadas
-> testar contra conceitos similares conhecidos
-> descartar explicacoes ja cobertas
-> manter o invariante estavel restante
-> propor novo conceito apenas se restar uma explicacao
```

Exemplo:

```text
A0 + B1 -> OUT1
A1 + B0 -> OUT1
```

Explicacoes possiveis:

- ambos sao casos validos de entrada;
- ambos contem uma opcao de A e uma opcao de B;
- ambos misturam `VALUE_0` e `VALUE_1`;
- ambos ativam `OUT1`.

As duas primeiras sao gerais demais se o sistema ja conhece pertencimento por eixo. `OUT1` e papel, nao o conceito do lado das fontes. Depois de descartar isso, o invariante explicativo restante fica mais perto de:

```text
mixed-value entre eixos de entrada diferentes
```

Esse e o tipo de invariante que pode virar um novo conceito. O ponto importante nao e apenas achar similaridade, mas subtrair similaridades conhecidas ate sobrar uma explicacao especifica o bastante.
