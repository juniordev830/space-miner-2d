# Space Miner 2D

**Status:** MVP inicial de jogo no navegador, com gráficos feitos em **PixiJS 8** e empacotamento pelo Vite.

## Funcionalidades atuais
- Nave pilotável com WASD/setas, asteroides gerados na área de jogo.
- Mineração de curta distância (Espaço), coleta de minério e regeneração de asteroides.
- Melhoria de potência do laser (U), gastando cinco minérios.
- Objetivo de coletar 25 minérios no total e opção para reiniciar (R).
- HUD responsivo e testes unitários das regras sem dependência do navegador.

## Executar
Requer **Node.js 20.19+**:

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (geralmente `http://localhost:5173`).

## Testes e build
```bash
npm test
npm run build
```

## Organização
- `src/main.js`: cena PixiJS, entrada do usuário e loop principal.
- `src/rules.js`: cálculos e regras independentes do renderizador.
- `src/style.css`: HUD visual.
- `tests/rules.test.js`: testes com o Node Test Runner.
- `.github/workflows/ci.yml`: execução de testes e build via GitHub Actions.

**Limitações:** demonstração local, sem salvamento de progresso, áudio ou controles de toque nesta primeira versão. Visual autoral composto por formas geométricas. O projeto ainda não foi testado em todos os navegadores/dispositivos.


## Combos de mineração (novo)

Quebrar asteroides em sequência dentro de **8 segundos** mantém o multiplicador de combo. A sequência fica limitada a cinco asteroides: os dois primeiros não dão bônus, o terceiro e o quarto concedem **+1 minério**, e o quinto ou seguintes concedem **+2 minérios** por asteroide. O bônus entra no inventário e no progresso do objetivo. Quando o cronômetro acaba, o combo volta ao início.

O indicador no HUD apresenta o multiplicador atual e o tempo restante; não existe necessidade de usar outro botão. Esse módulo está separado em `src/combo.js`, com testes `tests/combo.test.js` sobre limites, expiração e entradas inválidas. O combo é reiniciado ao recarregar a partida, assim como o restante do progresso.

## Prévia de bônus de mineração

A barra de combo agora informa também quanto minério extra será recebido ao quebrar o **próximo** asteroide antes de acabar o tempo. O valor é calculado pelas regras determinísticas de recompensa, respeitando o limite máximo do multiplicador e sem modificar o estado da partida; a prévia só considera o bônus, não o minério base de cada rocha.
