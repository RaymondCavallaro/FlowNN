# Glossario

[English](../glossary.md)

Definicoes curtas para os principais termos do projeto.

## Sinal

No runtime atual, sinal é forca de pressao. Ele nao carrega tipo semantico.

## Pressao

A quantidade escalar injetada em nodes e roteada por valvulas.

## Node de fonte

Um node onde a pressao entra no grafo. Identidade de fonte é estrutural: `A0` e `B1` diferem porque sao pontos de entrada diferentes.

## PressureNode

O objeto node do runtime. Ele acumula pressao, ativa depois de um limiar e decai.

## InputValve

O objeto valvula do runtime. Ele conecta um node a outro e controla condutancia com abertura, resistencia e peso.

## Resistencia

Quao dificil é para a pressao passar por uma valvula. Co-fluxo util repetido pode reduzir resistencia.

## Peso

Quanto uma valvula aberta contribui para condutancia.

## Significado

Uma interpretacao estavel lida a partir de identidade de fonte, comportamento de rota, padroes de ativacao, relacoes de scaffold e resposta de saida.

## Scaffold

Uma camada explicita e inspecionavel de controle usada para dar estrutura conceitual temporaria ao sistema. Um scaffold deve eventualmente poder ser substituido por estrutura gerada ou aprendida.

## Recrutamento

Adicionar estrutura nova e fraca quando pressao nao resolvida repetida sugere que a topologia atual é insuficiente.

## Relacao

Um padrao invariante que permanece estavel entre caminhos ou casos validos.

## Material temporal

Estrutura temporal pre-semantica futura extraida de entrada bruta, como frequencia, decaimento, recorrencia, oscilacao e atraso.

## Meta-regulacao

Sinais observacionais sobre quanto o sistema deve explorar, consolidar, afrouxar, apertar ou proteger estrutura.
