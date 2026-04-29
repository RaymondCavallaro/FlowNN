# Walkthrough

[English](../walkthrough.md)

Esta pagina acompanha um caso simples, da pressao ao significado.

O runtime atual usa nodes de fonte bitwise em vez de pulsos sensoriais brutos, entao este walkthrough usa o laboratorio atual:

```text
caso de entrada: A0 + B1
saida esperada durante treino: OUT1
```

## 1. Pressao de fonte

A entrada nao carrega payload semantico.

```text
A0 injeta pressao
B1 injeta pressao
```

O sinal em si é apenas forca. A identidade vem dos nodes de fonte e das rotas disponiveis.

## 2. Roteamento

Pressao se move por valvulas abertas de operacao.

```text
A0 -> rotas candidatas
B1 -> rotas candidatas
```

Cada fonte tem pressao de saida limitada, entao a pressao é dividida pela condutancia disponivel em vez de copiada para toda rota.

## 3. Encontro local

Se a pressao do caso encontra repetidamente um lugar util, as rotas envolvidas podem ficar mais faceis de usar.

```text
coativacao repetida
-> menor resistencia
-> maior peso de rota
```

Isso é aprendizagem local. O sistema nao recebe uma resposta de caminho oculto.

## 4. Fronteira teacher

Durante o treino, a saida esperada tambem pode ficar ativa:

```text
A0 + B1 + OUT1
```

Isso deixa a pressao de entrada que chega em `OUT1` encontrar a pressao teacher localmente. A topologia atual nao cria valvulas reversas de saida para hidden.

## 5. Pressao nao resolvida

Se o caso continua ambiguo, o sistema registra a assinatura nao resolvida:

```text
A0 + B1 continua com margem baixa
-> assinatura "01" ganha evidencia
```

Evidencia repetida nao resolvida pode recrutar um separador fraco.

## 6. Recrutamento

O separador recrutado nao é um rotulo simbolico. é uma estrutura experimental que pode ajudar a separar um caso repetido de pressao.

```text
assinatura nao resolvida
-> estrategia de recrutamento
-> node separador fraco
-> sobrevivencia ou desvanecimento
```

A estrategia de recrutamento pode usar contexto de scaffold explicito de conjunto/propriedade quando ele esta disponivel, mas o scaffold ainda é uma camada de controle inspecionavel.

## 7. Significado

Significado é lido de estrutura estavel:

```text
quais fontes sustentam uma rota
qual saida estabiliza
quais conceitos de scaffold explicam o par de fontes
qual relacao permanece invariante
```

Entao o significado de `A0 + B1 -> OUT1` nao fica armazenado na pressao. Ele é reconstruido a partir de identidade de fonte, comportamento de rota, relacoes de scaffold e resposta de saida.

## Relacionados

- [Fluxo central](core-flow.md)
- [Rede de pressao](concepts/pressure-network.md)
- [Significado relacional](concepts/relational-meaning.md)
- [Computacao temporal](concepts/temporal-computation.md)
