/** Pure reward rules: nearby asteroid breaks build a time-limited mining combo. */
export const COMBO_WINDOW_SECONDS = 8;
export const MAX_COMBO_STREAK = 5;

export function comboExpired(state) {
  return !state || state.secondsRemaining <= 0 || state.streak <= 0;
}

export function advanceCombo(state, elapsedSeconds) {
  if (!state || !Number.isInteger(state.streak) || state.streak < 0 ||
      !Number.isFinite(state.secondsRemaining) || state.secondsRemaining < 0 ||
      !Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
    throw new RangeError('Invalid combo timer');
  }
  const secondsRemaining = Math.max(0, state.secondsRemaining - elapsedSeconds);
  return secondsRemaining === 0
    ? { streak: 0, secondsRemaining: 0 }
    : { streak: state.streak, secondsRemaining };
}

export function awardMiningCombo(state, baseOre) {
  if (!state || !Number.isInteger(state.streak) || state.streak < 0 ||
      !Number.isFinite(state.secondsRemaining) || state.secondsRemaining < 0 ||
      !Number.isSafeInteger(baseOre) || baseOre < 1 || baseOre > 1000) {
    throw new RangeError('Invalid ore or combo');
  }
  const nextStreak = comboExpired(state)
    ? 1
    : Math.min(MAX_COMBO_STREAK, state.streak + 1);
  // Streaks 1-2 earn no bonus, 3-4 add one ore, 5 adds two.
  const bonusOre = Math.floor((nextStreak - 1) / 2);
  return {
    streak: nextStreak,
    secondsRemaining: COMBO_WINDOW_SECONDS,
    baseOre,
    bonusOre,
    totalOre: baseOre + bonusOre
  };
}

export function formatCombo(state) {
  if (comboExpired(state)) return 'Sem combo';
  return `x${state.streak} • ${Math.ceil(state.secondsRemaining)}s`;
}

/** Bonus ore units from the next successful asteroid break, without mutation. */
export function nextComboBonus(state) {
  return awardMiningCombo(state, 1).bonusOre;
}

/** UI summary of the remaining time and the next attainable bonus. */
export function comboHudLabel(state) {
  return `${formatCombo(state)} | Próx. bônus +${nextComboBonus(state)}`;
}
