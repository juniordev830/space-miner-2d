import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, distance, inMiningRange, mineHit, canUpgrade } from '../src/rules.js';

test('clamp keeps ship inside valid bounds', () => {
  assert.equal(clamp(-4, 0, 50), 0);
  assert.equal(clamp(70, 0, 50), 50);
  assert.equal(clamp(25, 0, 50), 25);
  assert.throws(() => clamp(NaN, 0, 50), RangeError);
});
test('distance uses 2D Euclidean geometry', () => {
  assert.equal(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});
test('mining range includes boundary and rejects invalid values', () => {
  assert.equal(inMiningRange(115, 115), true);
  assert.equal(inMiningRange(116, 115), false);
  assert.equal(inMiningRange(-1, 115), false);
  assert.equal(inMiningRange(NaN, 115), false);
});
test('mining consumes durability and never returns negative', () => {
  assert.equal(mineHit(5, 2), 3);
  assert.equal(mineHit(1, 3), 0);
  assert.throws(() => mineHit(0, 1), RangeError);
  assert.throws(() => mineHit(1, 0), RangeError);
});
test('upgrades require enough valid ore', () => {
  assert.equal(canUpgrade(4), false);
  assert.equal(canUpgrade(5), true);
  assert.equal(canUpgrade(15), true);
  assert.equal(canUpgrade(-1), false);
});
