# Testes

[English](../tests.md)

O arquivo de testes automatizados e `test/pressure-network.test.js`.

Cada teste e registrado com:

- `name`: comportamento verificado;
- `kind`: `feature` ou `error`;
- `covers`: recurso ou modo de falha protegido;
- `run`: funcao que executa assercoes.

## Mapa De Testes

| Tipo | Teste | Cobre |
| --- | --- | --- |
| feature | truth table oracle matches supported operations | definicoes das operacoes |
| error | signal carries strength only | nenhum tipo semantico dentro de `Signal` |
| feature | threshold gates node activation | ativacao por limiar de pressao |
| feature | outputs can flood pressure during training | saida teacher como fonte ativa |
| feature | shaped pair topology is structural | topologia de pares de referencia |
| error | reverse output valves are training-only | rotas teacher nao vazam para teste |
| error | valve openness stays bounded | ecologia assimptotica de valvulas |
| feature | valves and thresholds use separate ecology modes | controles independentes de valvula/limiar |
| feature | operation plasticity consolidates after stable cycles | consolidacao de plasticidade regional |
| feature | teacher strength balances rare outputs | pressao teacher balanceada por raridade |
| feature | teacher duration balances rare outputs | duracao teacher balanceada por raridade |
| feature | semantic scaffold topology exists | regioes primitivas de origem/valor |
| feature | set scaffold starts explicit and empty | scaffold manual de conjuntos comeca nao injetado |
| feature | inject set scaffold adds manual concepts | injecao manual de scaffold conjunto/propriedade |
| feature | scaffold training locks primitive regions | consolidacao de origem/valor |
| feature | meaning explanations use scaffold primitives | explicacao por significados primitivos |
| feature | relation reader extracts operation meanings | invariantes de operacao |
| feature | relation reader generates source candidates | geracao de fontes candidatas a partir da saida alvo |
| feature | meta regulation responds to uncertainty | eixos de tensao adaptativa sob comportamento nao resolvido |
| feature | meta regulation consolidates stable behavior | eixos de tensao adaptativa sob comportamento estavel |
| feature | flood training changes valves | aprendizagem local por coativacao |
| error | input-only tests produce diagnostic result shape | schema de resultado e diagnosticos |
| feature | recruitable topology starts without fixed pairs | topologia principal subestruturada |
| feature | recruitment creates separators for repeated ambiguity | recrutamento amplo por pressao nao resolvida |
| feature | set scaffold guides recruitment connections | politica de recrutamento guiada por scaffold conjunto/propriedade |
| feature | recruitable topology attempts bitwise operations | avaliacao exploratoria XOR/AND/OR/NAND fim-a-fim |

## Por Que Existem Testes `error`

Um teste `error` protege contra um modo de falha. Os principais aqui sao:

- tipo semantico entrando de volta em `Signal`;
- pressao teacher vazando para teste so com entradas;
- abertura de valvula chegando a limites duros;
- formato de resultado mudando sem atualizar docs e UI.

## Rodar

```bash
cd wave-nn
npm test
```

A demo no navegador nao executa esse arquivo. Use o guia manual para reproduzir os comportamentos visiveis.
