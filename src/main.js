import { Application, Container, Graphics } from 'pixi.js';
import { clamp, distance, inMiningRange, mineHit, canUpgrade } from './rules.js';
import { advanceCombo, awardMiningCombo, formatCombo, comboHudLabel } from './combo.js';
import './style.css';

const app = new Application();
await app.init({ resizeTo: window, background: 0x050d22, antialias: true });
document.querySelector('#app').appendChild(app.canvas);

const field = new Container();
app.stage.addChild(field);

const starfield = new Graphics();
for (let i = 0; i < 145; i += 1) {
  starfield.circle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 1.4 + 0.4).fill({ color: 0xb1dcff, alpha: Math.random() * 0.6 + 0.18 });
}
field.addChild(starfield);

const ship = new Graphics();
ship.poly([-15, 17, 0, -20, 15, 17]).fill(0x57e9fd);
ship.poly([-7, 9, 0, -8, 7, 9]).fill(0x103c63);
ship.circle(0, 5, 3).fill(0xffffff);
field.addChild(ship);

const keys = new Set();
const state = {
  ore: 0, total: 0, laser: 1, cooldown: 0, complete: false,
  combo: { streak: 0, secondsRemaining: 0 }
};
const rocks = [];
const oreEl = document.querySelector('#ore');
const totalEl = document.querySelector('#total');
const laserEl = document.querySelector('#laser');
const comboEl = document.querySelector('#combo');
const statusEl = document.querySelector('#status');
const SHIP_SPEED = 4.1;
const MINE_RANGE = 115;
const GOAL = 25;

function refreshHud(message) {
  oreEl.textContent = String(state.ore);
  totalEl.textContent = `${state.total} / ${GOAL}`;
  laserEl.textContent = `Nível ${state.laser}`;
  comboEl.textContent = comboHudLabel(state.combo);
  if (message) statusEl.textContent = message;
}

function createRock() {
  const radius = 17 + Math.random() * 18;
  const padding = 115;
  const x = Math.random() * Math.max(1, app.screen.width - padding * 2) + padding;
  const y = Math.random() * Math.max(1, app.screen.height - padding * 2) + padding;
  const rock = { x, y, radius, durability: Math.ceil(radius / 9) + 1, view: new Graphics() };
  rock.view.poly([-radius, -radius * 0.35, -radius * 0.24, -radius, radius * 0.68, -radius * 0.72, radius, radius * 0.25, radius * 0.3, radius, -radius * 0.7, radius * 0.62]).fill(0x566883);
  rock.view.circle(-radius * 0.16, -radius * 0.14, radius * 0.24).fill(0xa3c8db);
  rock.view.circle(radius * 0.34, radius * 0.30, radius * 0.12).fill(0x2a3c57);
  rock.view.position.set(x, y);
  field.addChild(rock.view);
  rocks.push(rock);
}

function mineNearest() {
  if (state.cooldown > 0 || state.complete) return;
  let closest = null;
  let closestDistance = Infinity;
  for (const rock of rocks) {
    const d = distance(ship.position, rock);
    if (d < closestDistance) {
      closestDistance = d;
      closest = rock;
    }
  }
  if (!closest || !inMiningRange(closestDistance, MINE_RANGE)) {
    refreshHud('Chegue mais perto de um asteroide para minerar.');
    return;
  }
  state.cooldown = 0.22;
  closest.durability = mineHit(closest.durability, state.laser);
  closest.view.tint = closest.durability ? 0xa8d9ff : 0xffffff;
  if (closest.durability === 0) {
    const baseOre = Math.ceil(closest.radius / 11);
    state.combo = awardMiningCombo(state.combo, baseOre);
    const gained = state.combo.totalOre;
    state.ore += gained;
    state.total += gained;
    field.removeChild(closest.view);
    closest.view.destroy();
    rocks.splice(rocks.indexOf(closest), 1);
    createRock();
    if (state.total >= GOAL) {
      state.complete = true;
      refreshHud('MISSÃO CONCLUÍDA! Pressione R para jogar novamente.');
      return;
    }
    const bonusMessage = state.combo.bonusOre > 0
      ? ` (${state.combo.bonusOre} de bônus por combo)` : '';
    refreshHud(`Asteroide coletado: +${gained} minérios${bonusMessage}!`);
  } else {
    refreshHud('Laser atingiu o asteroide. Continue minerando!');
  }
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
  keys.add(key);
  if (event.repeat) return;
  if (key === 'r') window.location.reload();
  if (key === 'u' && canUpgrade(state.ore)) {
    state.ore -= 5;
    state.laser += 1;
    refreshHud('Laser melhorado! Agora ele quebra asteroides mais rápido.');
  }
});
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => keys.clear());

ship.position.set(app.screen.width * 0.5, app.screen.height * 0.5);
for (let i = 0; i < 12; i += 1) createRock();
refreshHud();

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaTime, 2);
  state.cooldown = Math.max(0, state.cooldown - ticker.deltaMS / 1000);
  const lastComboLabel = comboHudLabel(state.combo);
  state.combo = advanceCombo(state.combo, Math.max(0, ticker.deltaMS / 1000));
  if (comboHudLabel(state.combo) !== lastComboLabel) comboEl.textContent = comboHudLabel(state.combo);
  let dx = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
  let dy = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
  if (dx !== 0 || dy !== 0) {
    const norm = Math.hypot(dx, dy);
    dx /= norm;
    dy /= norm;
    ship.x = clamp(ship.x + dx * SHIP_SPEED * dt, 18, Math.max(18, app.screen.width - 18));
    ship.y = clamp(ship.y + dy * SHIP_SPEED * dt, 18, Math.max(18, app.screen.height - 18));
    ship.rotation = Math.atan2(dy, dx) + Math.PI / 2;
  }
  if (keys.has(' ')) mineNearest();
});
