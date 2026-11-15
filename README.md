# Space Miner 2D

## Protótipo visual em PixiJS

**Status:** MVP inicial de jogo no navegador, com gráficos feitos em **PixiJS 8** e empacotamento pelo Vite.

### Funcionalidades atuais
- Nave pilotável com WASD/setas, asteroides gerados na área de jogo.
- Mineração de curta distância (Espaço), coleta de minério e regeneração de asteroides.
- Melhoria de potência do laser (U), gastando cinco minérios.
- Objetivo de coletar 25 minérios no total e opção para reiniciar (R).
- HUD responsivo e testes unitários das regras sem dependência do navegador.

### Executar
Requer **Node.js 20.19+**:

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (geralmente `http://localhost:5173`).

### Testes e build
```bash
npm test
npm run build
```

### Organização
- `src/main.mjs`: cena PixiJS, entrada do usuário e loop principal.
- `src/rules.mjs`: cálculos e regras independentes do renderizador.
- `src/style.css`: HUD visual.
- `tests/rules.test.mjs`: testes com o Node Test Runner.
- `.github/workflows/ci.yml`: execução de testes e build via GitHub Actions.

**Limitações:** demonstração local, sem salvamento de progresso, áudio ou controles de toque nesta primeira versão. Visual autoral composto por formas geométricas. O projeto ainda não foi testado em todos os navegadores/dispositivos.


### Combos de mineração (novo)

Quebrar asteroides em sequência dentro de **8 segundos** mantém o multiplicador de combo. A sequência fica limitada a cinco asteroides: os dois primeiros não dão bônus, o terceiro e o quarto concedem **+1 minério**, e o quinto ou seguintes concedem **+2 minérios** por asteroide. O bônus entra no inventário e no progresso do objetivo. Quando o cronômetro acaba, o combo volta ao início.

O indicador no HUD apresenta o multiplicador atual e o tempo restante; não existe necessidade de usar outro botão. Esse módulo está separado em `src/combo.mjs`, com testes `tests/combo.test.mjs` sobre limites, expiração e entradas inválidas. O combo é reiniciado ao recarregar a partida, assim como o restante do progresso.

### Prévia de bônus de mineração

A barra de combo agora informa também quanto minério extra será recebido ao quebrar o **próximo** asteroide antes de acabar o tempo. O valor é calculado pelas regras determinísticas de recompensa, respeitando o limite máximo do multiplicador e sem modificar o estado da partida; a prévia só considera o bônus, não o minério base de cada rocha.

## Núcleo de mineração no terminal

Jogo espacial 2D **planejado**, com exploração de setores, coleta de minérios e evolução de naves.

O núcleo de mineração em JavaScript inclui uma demonstração no terminal e testes das regras.

### Vertical slice sugerida

Uma nave explora um mapa compacto de asteroides. O jogador aproxima-se de um asteroide, extrai recursos até esgotá-lo e retorna à estação para converter minério em melhorias simples.

### Modelo inicial

- `Nave`: posição, combustível ou energia e capacidade de carga.
- `Asteroide`: posição, quantidade de minério e estado de exaustão.
- `Inventario`: tipo de minério e quantidade acumulada.
- `Estacao`: ponto de entrega, recarga e troca de upgrades.

### Critérios de aceitação

1. A nave se move com controle previsível e limites de mundo.
2. Um asteroide com cinco unidades permite cinco coletas válidas, não seis.
3. A carga nunca ultrapassa a capacidade configurada.
4. Uma entrega remove recursos do inventário e credita saldo equivalente.
5. Um upgrade demonstrativo modifica um atributo e pode ser testado.

### Ordem de implementação

- [ ] Escolher engine 2D e versionar dependências.
- [x] Escrever testes das regras de mineração e inventário.
- [ ] Construir mapa e nave em assets temporários.
- [ ] Adicionar HUD de carga/energia e loop de extração.
- [ ] Documentar comandos de execução e controles após rodar localmente.

Não anunciar modos online, geração procedural ou lançamento mobile antes de haver protótipos próprios para essas plataformas.

### Núcleo demonstrativo implementado

O arquivo `src/mineracao.js` contém regras de extração, capacidade de carga, estoque de asteroides e entrega na estação com saldo em créditos **fictícios**. As ações preservam as entradas originais, impedem coleta além da capacidade e rejeitam preços inválidos. A demonstração funciona em terminal, sem interface gráfica.

Requer Node.js 20+, sem pacotes de terceiros:

```bash
npm test
npm run demo
```

O workflow `.github/workflows/mining-tests.yml` executa os testes no PR. Movimento da nave, mapa, colisões, sprites, estações visuais e upgrades permanecem no planejamento.
