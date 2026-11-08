import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceCombo,
  awardMiningCombo,
  comboExpired,
  formatCombo,
  COMBO_WINDOW_SECONDS,
  MAX_COMBO_STREAK
} from '../src/combo.js';

test('first and second asteroids award normal ore without bonus', () => {
  const first = awardMiningCombo({ streak: 0, secondsRemaining: 0 }, 3);
  assert.equal(first.streak, 1);
  assert.equal(first.totalOre, 3);
  assert.equal(first.bonusOre, 0);
  assert.equal(first.secondsRemaining, COMBO_WINDOW_SECONDS);
  const second = awardMiningCombo(first, 2);
  assert.equal(second.streak, 2);
  assert.equal(second.totalOre, 2);
});

test('third rapid asteroid grants a bonus without changing base ore', () => {
  let state = { streak: 0, secondsRemaining: 0 };
  for (let i = 0; i < 3; i += 1) {
    state = awardMiningCombo(state, 2);
  }
  assert.equal(state.streak, 3);
  assert.equal(state.baseOre, 2);
  assert.equal(state.bonusOre, 1);
  assert.equal(state.totalOre, 3);
});

test('streak caps at five and bonuses cannot grow without bound', () => {
  let state = { streak: 0, secondsRemaining: 0 };
  for (let i = 0; i < 20; i += 1) state = awardMiningCombo(state, 1);
  assert.equal(state.streak, MAX_COMBO_STREAK);
  assert.equal(state.bonusOre, 2);
  assert.equal(state.totalOre, 3);
});

test('timer expiration resets the streak before the next asteroid', () => {
  const state = awardMiningCombo({ streak: 0, secondsRemaining: 0 }, 1);
  const pending = advanceCombo(state, 7.75);
  assert.equal(pending.streak, 1);
  assert.equal(pending.secondsRemaining, 0.25);
  assert.equal(comboExpired(pending), false);
  const expired = advanceCombo(pending, 0.25);
  assert.deepEqual(expired, { streak: 0, secondsRemaining: 0 });
  assert.equal(comboExpired(expired), true);
  assert.equal(awardMiningCombo(expired, 4).bonusOre, 0);
  assert.equal(formatCombo(expired), 'Sem combo');
});

test('formatted combo timer rounds up and no mutation occurs', () => {
  const state = { streak: 3, secondsRemaining: 2.2 };
  assert.equal(formatCombo(state), 'x3 • 3s');
  const next = advanceCombo(state, 0.8);
  assert.equal(formatCombo(next), 'x3 • 2s');
  assert.deepEqual(state, { streak: 3, secondsRemaining: 2.2 });
});

test('invalid ore amounts, durations, and streaks are rejected', () => {
  const valid = { streak: 1, secondsRemaining: 4 };
  for (const bad of [0, -1, 1.5, Infinity, 1001]) {
    assert.throws(() => awardMiningCombo(valid, bad), RangeError);
  }
  for (const bad of [-1, NaN, Infinity]) {
    assert.throws(() => advanceCombo(valid, bad), RangeError);
  }
  assert.throws(() => awardMiningCombo({ streak: -1, secondsRemaining: 8 }, 1), RangeError);
  assert.throws(() => advanceCombo({ streak: 1, secondsRemaining: -2 }, 2), RangeError);
});
