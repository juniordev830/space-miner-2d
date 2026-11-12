# Space Miner 2D

Jogo espacial 2D **planejado**, com exploração de setores, coleta de minérios e evolução de naves.

> **Estado desta branch:** lógica de mineração em JavaScript implementada e coberta por testes. Não há nave visual, mundo 2D ou build jogável.

## Vertical slice sugerida

Uma nave explora um mapa compacto de asteroides. O jogador aproxima-se de um asteroide, extrai recursos até esgotá-lo e retorna à estação para converter minério em melhorias simples.

## Modelo inicial

- `Nave`: posição, combustível ou energia e capacidade de carga.
- `Asteroide`: posição, quantidade de minério e estado de exaustão.
- `Inventario`: tipo de minério e quantidade acumulada.
- `Estacao`: ponto de entrega, recarga e troca de upgrades.

## Critérios de aceitação

1. A nave se move com controle previsível e limites de mundo.
2. Um asteroide com cinco unidades permite cinco coletas válidas, não seis.
3. A carga nunca ultrapassa a capacidade configurada.
4. Uma entrega remove recursos do inventário e credita saldo equivalente.
5. Um upgrade demonstrativo modifica um atributo e pode ser testado.

## Ordem de implementação

- [ ] Escolher engine 2D e versionar dependências.
- [x] Escrever testes das regras de mineração e inventário.
- [ ] Construir mapa e nave em assets temporários.
- [ ] Adicionar HUD de carga/energia e loop de extração.
- [ ] Documentar comandos de execução e controles após rodar localmente.

Não anunciar modos online, geração procedural ou lançamento mobile antes de haver protótipos próprios para essas plataformas.

## Núcleo demonstrativo implementado

O arquivo `src/mineracao.js` contém regras de extração, capacidade de carga, estoque de asteroides e entrega na estação com saldo em créditos **fictícios**. As ações preservam as entradas originais, impedem coleta além da capacidade e rejeitam preços inválidos. A demonstração funciona em terminal, sem interface gráfica.

Requer Node.js 20+, sem pacotes de terceiros:

```bash
npm test
npm run demo
```

O workflow `.github/workflows/mining-tests.yml` executa os testes no PR. Movimento da nave, mapa, colisões, sprites, estações visuais e upgrades permanecem no planejamento.
