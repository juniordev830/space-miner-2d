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
