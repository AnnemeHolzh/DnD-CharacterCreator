// Calculate ability score modifier
export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

// Calculate hit points based on class hit die, level, and constitution modifier
export function calculateHitPoints(hitDie: number, level: number, conModifier: number): number {
  // First level: max hit die + con modifier
  const firstLevelHP = hitDie + conModifier

  // Additional levels: average hit die roll (hitDie/2 + 1) + con modifier per level
  const averageRoll = Math.floor(hitDie / 2) + 1
  const additionalLevelsHP = (level - 1) * (averageRoll + conModifier)

  return firstLevelHP + additionalLevelsHP
}

// Calculate spell save DC
export function calculateSpellSaveDC(spellcastingAbilityModifier: number, proficiencyBonus: number): number {
  return 8 + spellcastingAbilityModifier + proficiencyBonus
}

// Calculate proficiency bonus based on level
export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1
}
