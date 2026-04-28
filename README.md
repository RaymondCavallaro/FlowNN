# Lingua

- Versao em Portugues (esta)
- English version: [README.en.md](README.en.md)

# FlowNN

Experimento inicial de rede de pressao para roteamento orientado por significado.

O prototipo atual pergunta se pressao local, resistencia, limiares, plasticidade regional e treino por flood conseguem formar caminhos uteis em pequenas tabelas-verdade sem tipos explicitos de sinal, historico de rota ou credito de rota no estilo backprop.

O sistema mantem a simulacao e a interface separadas. A camada de rede gerencia nos, valvulas, regioes e aprendizagem local. A interface emite comandos de treino/teste e renderiza o estado da rede.

Feito em grande parte com IA.

## Demo

- GitHub Pages: [raymondcavallaro.github.io/FlowNN](https://raymondcavallaro.github.io/FlowNN/)

## O que e

Este repositorio e um prototipo aberto para explorar um ciclo pequeno de aprendizagem por pressao:

- fontes estruturais emitem pulsos sem carregar tipo semantico proprio
- valvulas locais controlam resistencia, abertura e peso
- nos acumulam pressao ate ultrapassar limiares
- floods de treino ativam a saida desejada junto com as entradas
- regioes consolidadas reduzem plasticidade sem congelar totalmente a rede

Ele e intencionalmente pequeno e browser-first.

## Prototipo atual

A versao atual e um app de navegador simples com:

- simulacao visual de uma rede de pressao
- treino de tabelas-verdade para XOR, AND, OR e NAND
- topologia inicial sem camada fixa de pares no modo principal
- recrutamento de separadores quando casos repetidos nao assentam bem
- scaffold de significado para origem e valor
- leitura relacional de invariantes aprendidos
- controles de ecologia para valvulas e limiares
- metricas de pressao, abertura, plasticidade, ciclos e acuracia

## Orientacao desta fase

O objetivo desta fase nao e provar um modelo geral.

O objetivo e manter um laboratorio pequeno onde seja possivel observar:

- identidade de sinal como estrutura de origem e topologia
- aprendizagem local por coativacao e pressao
- crescimento de topologia a partir de pressao nao resolvida
- consolidacao continua em vez de congelamento binario
- leitura de significado a partir de invariantes estruturais

Experimentos de aritmetica ficam separados no branch `v0.0.4`.

## Estrutura do Projeto

- `wave-nn/index.html` e a entrada da aplicacao no navegador
- `wave-nn/src/` contem simulacao, visualizador e estilos
- `wave-nn/test/` contem testes do modelo de rede
- `wave-nn/docs/` contem notas conceituais e de implementacao
- `.github/workflows/pages.yml` publica o app no GitHub Pages

## Branches

- `main`: demo da rede de pressao e arquivos publicos do projeto
- `v0.0.1`: linha de trabalho sobre tempo
- `v0.0.2`: linha principal da rede de pressao
- `v0.0.3`: consolidacao e trabalho de campo esparso
- `v0.0.4`: experimentos de aritmetica

## Rodar localmente

```bash
cd wave-nn
python3 -m http.server 4173
```

Abra:

```text
http://127.0.0.1:4173/
```

## Testes

```bash
cd wave-nn
npm test
```

## Estado atual

Isto e um teste conceitual, nao um produto finalizado.

O objetivo agora e manter a arquitetura facil de mudar enquanto a ideia de redes de pressao orientadas por significado fica mais clara.
