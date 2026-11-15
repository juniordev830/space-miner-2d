/** Pure game rules, with no dependency on PixiJS or the browser. */
export function clamp(value, low, high) {
  if (!Number.isFinite(value) || !Number.isFinite(low) || !Number.isFinite(high) || low > high) {
    throw new RangeError('Invalid clamp arguments');
  }
  return Math.max(low, Math.min(high, value));
}
export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
export function inMiningRange(distanceValue, range) {
  return Number.isFinite(distanceValue) && Number.isFinite(range) && distanceValue >= 0 && range >= 0 && distanceValue <= range;
}
export function mineHit(durability, power) {
  if (!Number.isInteger(durability) || durability <= 0 || !Number.isInteger(power) || power <= 0) {
    throw new RangeError('Durability and power must be positive integers');
  }
  return Math.max(0, durability - power);
}
export function canUpgrade(ore, cost = 5) {
  return Number.isInteger(ore) && Number.isInteger(cost) && cost > 0 && ore >= cost;
}
