# Lingua

- Versao em Portugues (esta)
- English version: [README.en.md](README.en.md)

# FlowNN

Experimento inicial de rede de pressao para roteamento orientado por significado.

O prototipo atual pergunta se pressao local, resistencia, limiares, plasticidade regional e treino por flood conseguem formar caminhos uteis em pequenas tabelas-verdade sem tipos explicitos de sinal, historico de rota ou credito de rota no estilo backprop.

O sistema mantem a simulacao e a interface separadas. A camada de rede gerencia nos, valvulas, regioes e aprendizagem local. A interface emite comandos de treino/teste e renderiza o estado da rede.

Feito em grande parte com IA.

## Demo

- GitHub Pages: [raymondcavallaro.github.io/FlowNN/wave-nn/](https://raymondcavallaro.github.io/FlowNN/wave-nn/)

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
- scaffold explicito e injetavel de conjuntos/propriedades
- leitura relacional de invariantes aprendidos
- geracao restrita de pares de fonte a partir de relacoes de saida
- scaffold observacional de meta-regulacao para controlar plasticidade, exploracao e certeza
- controles de ecologia para valvulas e limiares
- metricas de pressao, abertura, plasticidade, ciclos e acuracia

## Orientacao desta fase

O objetivo desta fase nao e provar um modelo geral.

O objetivo e manter um laboratorio pequeno onde seja possivel observar:

- identidade de sinal como estrutura de origem e topologia
- aprendizagem local por coativacao e pressao
- crescimento exploratorio de topologia a partir de pressao nao resolvida
- consolidacao continua em vez de congelamento binario
- leitura de significado a partir de invariantes estruturais

Experimentos de aritmetica ficam estacionados no branch `v0.0.4` enquanto `main` continua focado na convergencia do nucleo.

## Estrutura do Projeto

- `wave-nn/index.html` e a entrada da aplicacao no navegador
- `wave-nn/src/` contem simulacao, visualizador e estilos
- `wave-nn/test/` contem testes do modelo de rede
- [`wave-nn/docs/`](https://raymondcavallaro.github.io/FlowNN/wave-nn/docs/pt) contem notas conceituais, recursos, testes e guia manual
- `.github/workflows/pages.yml` publica o app no GitHub Pages

## Branches e fatias

- `main`: linha atual de convergencia da rede de pressao
- `v0.0.1`: fatia de estudo sobre tempo e roteamento temporal
- `v0.0.2`: checkpoint historico disponivel para reuso ou aposentadoria
- `v0.0.3`: prateleira de consolidacao e campo esparso
- `v0.0.4`: prateleira de experimentos de aritmetica

Esses branches sao prateleiras de experimento, nao modulos permanentes da arquitetura final.

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
