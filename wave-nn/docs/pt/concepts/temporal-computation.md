# Computacao Temporal

[English](../../concepts/temporal-computation.md)

Esta pagina junta os conceitos temporais em uma entrada compacta de design. Eles ainda nao sao recursos do runtime atual. Sao restricoes para a proxima etapa depois que a rede de pressao conseguir recrutar, estabilizar e inspecionar estruturas simples.

## Camada de material temporal

Entrada bruta nao deve virar significado diretamente.

```text
sinal bruto -> transformacao -> material temporal -> significado
```

A transformacao extrai estrutura temporal pre-semantica:

- frequencia;
- decaimento;
- recorrencia;
- oscilacao;
- atraso.

Essa camada produz material que depois pode ganhar significado. Ela nao decide o significado sozinha.

## Significado em duas etapas

O significado pode se formar duas vezes:

```text
estrutura temporal -> significado_1 -> roteamento temporal -> significado_2
```

`significado_1` é a interpretacao imediata de um padrao temporal. `significado_2` é a interpretacao de como esse significado se comporta no tempo.

Exemplo:

```text
pulso          -> evento
pulso repetido -> evento recorrente
```

O segundo significado nao é um rotulo colado no primeiro. Ele é um novo invariante extraido do comportamento roteado.

## Roteamento como computacao

Roteamento deve eventualmente fazer mais do que transportar pressao.

Rotas repetidas, chegadas atrasadas, estabilidade de caminho e competicao entre rotas podem agir como detectores implicitos. Nessa leitura:

```text
significado + comportamento de roteamento -> significado de ordem superior
```

Logica deve ser tratada como caso especial de comportamento de fluxo:

- `AND`: co-fluxo compativel pela mesma fronteira;
- `OR`: multiplas rotas podem satisfazer o mesmo alvo;
- `NOT`: ausencia, inibicao ou escolha de rota alternativa;
- `XOR`: roteamento cruzado onde uma de duas combinacoes incompativeis vence.

O laboratorio atual de tabela-verdade ainda usa pequenas operacoes nomeadas como regua. O alvo de longo prazo é ler esses comportamentos do fluxo e da topologia, em vez de inserir portas logicas explicitas.

## Identidade estrutural de sinal

A linha principal atual mantem a pressao escalar:

```text
payload do sinal = forca
identidade       = fonte + topologia + comportamento de rota
```

Entao a versao util de "sinais precisam ser distintos" nao é recolocar tipos de sinal no payload do runtime. é fazer fontes e historicos roteados diferentes serem estruturalmente distinguiveis.

Direcao ruim para este projeto:

```text
0 = pressao fraca
1 = pressao forte
```

Direcao melhor:

```text
comportamento tipo 0 = pressao entrando por fontes valor-0 e estruturas valor-0 reutilizaveis
comportamento tipo 1 = pressao entrando por fontes valor-1 e estruturas valor-1 reutilizaveis
```

Isso preserva comportamento condicional sem reintroduzir etiquetas semanticas explicitas.

## Valvulas como operadores primitivos

Valvulas nao sao apenas pecas de transporte. Elas sao o operador primitivo atual.

Uma valvula define:

- que fonte pode afetar que alvo;
- quanta condutancia esta disponivel;
- que regiao controla sua plasticidade;
- se coativacao repetida deve facilitar a rota.

O comportamento seletivo tipo `AND` emerge quando um alvo so ativa sob co-fluxo compativel. A valvula nao precisa saber que esta computando `AND`; ela apenas molda as condicoes onde a pressao pode se encontrar.

## Aprendizagem por fluxo

A regra atual de aprendizagem ja aponta nessa direcao:

```text
co-fluxo repetido -> menor resistencia / maior peso
```

Rotas nao usadas, enganosas ou que nao ativam podem ficar menos preferidas por resistencia, menor condutancia relativa ou poda posterior.

Isso mantem a aprendizagem local:

- nenhuma rota recebe credito global no estilo backprop;
- nenhum controlador precisa conhecer o caminho oculto correto;
- estrutura util é o resultado acumulado de encontros repetidos de pressao.

## Modelo de capacidade do node

Um node deve ser entendido como um pacote de capacidades dependente de contexto, nao como uma peca permanentemente de uma funcao so.

Capacidades possiveis:

- entrada temporal;
- entrada de significado;
- roteamento;
- memoria curta;
- emissao;
- comparacao local de erro / expectativa.

Nem todas as capacidades precisam estar ativas ao mesmo tempo. O papel de longo prazo de um node deve ser inferido pela funcao repetida:

```text
tipo entrada
tipo roteamento
tipo retencao
tipo significado
tipo saida
```

Isso combina com o modelo de campo unificado: papeis sao funcoes de fluxo estabilizadas, nao primeiros primitivos.
