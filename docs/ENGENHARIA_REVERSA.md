# Engenharia reversa e estudo — Space Miner 2D

## Objetivo e fluxo

Mineração de asteroides, carga e combos em navegador. main.mjs fecha o ciclo visual em PixiJS. rules.mjs calcula alcance e mineração, e combo.mjs atualiza a sequência e a bonificação.

**Tecnologias identificadas** · JavaScript, Vite, Node.js, PixiJS.

**Revisão de referência** · `c06f703a8577`.

## Mapa do código

| Caminho | Papel de leitura | Símbolos selecionados |
| --- | --- | --- |
| [bin/demo.js](../bin/demo.js) | Implementação | — |
| [src/combo.mjs](../src/combo.mjs) | Implementação | `comboExpired`, `advanceCombo`, `awardMiningCombo`, `formatCombo`, `nextComboBonus`, `comboHudLabel` |
| [src/main.mjs](../src/main.mjs) | Ponto de leitura para entrada ou composição | `refreshHud`, `createRock`, `mineNearest` |
| [src/mineracao.js](../src/mineracao.js) | Implementação | `positivo`, `nome`, `criarNave`, `criarAsteroide`, `cargaTotal`, `coletar`, `entregar` |
| [src/rules.mjs](../src/rules.mjs) | Implementação | `clamp`, `distance`, `inMiningRange`, `mineHit`, `canUpgrade` |
| [vite.config.mjs](../vite.config.mjs) | Implementação | — |
| [index.html](../index.html) | Marcação ou estilos da interface | — |
| [src/style.css](../src/style.css) | Marcação ou estilos da interface | — |

## Configuração e referências

Ambiente e dependências: [package.json](../package.json).

## Roteiro de estudo e desenvolvimento

1. Comece pelo fluxo descrito acima e localize seus pontos de entrada no mapa. Acompanhe uma entrada válida até a transformação ou a resposta.
2. Abra um teste relacionado ao fluxo e descreva qual regra ele protege. Compare o tratamento esperado para entradas válidas, inválidas e nos limites.
3. Ao adicionar uma regra, determine qual módulo controla o dado e cubra o caso nesse nível. Em seguida, confira o efeito no comando, na API ou na interface de entrada.

**Pergunta de entrevista**

Como testar o limite de tempo de um combo sem esperar em tempo real?

## Testes versionados

Arquivos para começar a leitura dos cenários de teste: [test/mineracao.test.js](../test/mineracao.test.js), [tests/combo.test.mjs](../tests/combo.test.mjs), [tests/rules.test.mjs](../tests/rules.test.mjs).

Os comandos e versões de runtime usados no CI ficam em [.github/workflows/ci.yml](../.github/workflows/ci.yml), [.github/workflows/mining-tests.yml](../.github/workflows/mining-tests.yml).

[Voltar ao README](../README.md).
