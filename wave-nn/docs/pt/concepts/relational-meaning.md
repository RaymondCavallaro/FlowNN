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
