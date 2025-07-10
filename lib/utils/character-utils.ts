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

import { races } from '@/lib/data/races'

// Get race ability score increases
export function getRaceAbilityScoreIncreases(raceId: string): Record<string, number> {
  const race = races.find((r) => r.id === raceId)
  const increases = race?.abilityScoreIncrease || {}
  // Filter out undefined values and convert to Record<string, number>
  const filtered = Object.entries(increases)
    .filter(([_, value]) => typeof value === 'number')
    .map(([key, value]) => [key, value as number])
  return Object.fromEntries(filtered) as Record<string, number>
}

// Get subrace ability score increases
export function getSubraceAbilityScoreIncreases(raceId: string, subraceId: string): Record<string, number> {
  const race = races.find((r) => r.id === raceId)
  const subrace = race?.subraces?.find((s) => s.id === subraceId)
  const increases = subrace?.abilityScoreIncrease || {}
  // Filter out undefined values and convert to Record<string, number>
  const filtered = Object.entries(increases)
    .filter(([_, value]) => typeof value === 'number')
    .map(([key, value]) => [key, value as number])
  return Object.fromEntries(filtered) as Record<string, number>
}

// Calculate total ability score increases from race and subrace
// IMPORTANT: If a subrace is selected, use ONLY the subrace bonuses (which include race bonuses)
// If no subrace is selected, use the race bonuses
export function calculateTotalAbilityScoreIncreases(raceId: string, subraceId: string): Record<string, number> {
  if (subraceId) {
    // If subrace is selected, use only subrace bonuses (which include race bonuses)
    return getSubraceAbilityScoreIncreases(raceId, subraceId)
  } else {
    // If no subrace is selected, use race bonuses
    return getRaceAbilityScoreIncreases(raceId)
  }
}

// Check if a race/subrace combination has flexible ability score assignment
export function hasFlexibleAbilityScoreAssignment(raceId: string, subraceId: string): boolean {
  const increases = calculateTotalAbilityScoreIncreases(raceId, subraceId)
  
  // Check for flexible assignments like "any1", "any2"
  return Object.keys(increases).some(key => key.startsWith('any'))
}

// Get the number of flexible bonuses available
export function getFlexibleBonusCount(raceId: string, subraceId: string): { race: number, subrace: number } {
  const increases = calculateTotalAbilityScoreIncreases(raceId, subraceId)
  
  const flexibleCount = Object.keys(increases).filter(key => key.startsWith('any')).length
  
  // For simplicity, we'll treat all flexible bonuses as a single pool
  // In most cases, races with flexible bonuses don't have separate race/subrace flexible bonuses
  return { race: flexibleCount, subrace: 0 }
}

// Validate custom ability score assignment
export function validateCustomAbilityScoreAssignment(
  raceId: string, 
  subraceId: string, 
  customAssignments: Record<string, string>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const { race } = getFlexibleBonusCount(raceId, subraceId)
  
  // Check if we have the right number of assignments
  const totalFlexible = race
  const assignedCount = Object.keys(customAssignments).length
  
  if (assignedCount !== totalFlexible) {
    errors.push(`Expected ${totalFlexible} flexible bonus assignments, got ${assignedCount}`)
  }
  
  // Check for duplicate assignments
  const assignedAbilities = Object.values(customAssignments)
  const uniqueAbilities = new Set(assignedAbilities)
  
  if (assignedAbilities.length !== uniqueAbilities.size) {
    errors.push("Each ability score can only receive one flexible bonus")
  }
  
  // Check for valid ability score names
  const validAbilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
  const invalidAbilities = assignedAbilities.filter(ability => !validAbilities.includes(ability))
  
  if (invalidAbilities.length > 0) {
    errors.push(`Invalid ability scores: ${invalidAbilities.join(', ')}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Test function to verify race/subrace bonus calculation
export function testRaceSubraceBonuses() {
  console.log("=== Testing Race/Subrace Bonus Calculation ===")
  
  // Test 1: Dragonborn with subrace
  const dragonbornBonuses = calculateTotalAbilityScoreIncreases("dragonborn", "black-dragonborn")
  console.log("Dragonborn (Black):", dragonbornBonuses) // Should be { strength: 2, charisma: 1 }
  
  // Test 2: Dwarf with subrace
  const dwarfBonuses = calculateTotalAbilityScoreIncreases("dwarf", "hill-dwarf")
  console.log("Dwarf (Hill):", dwarfBonuses) // Should be { constitution: 2, wisdom: 1 }
  
  // Test 3: Elf with subrace
  const elfBonuses = calculateTotalAbilityScoreIncreases("elf", "high-elf")
  console.log("Elf (High):", elfBonuses) // Should be { dexterity: 2, intelligence: 1 }
  
  // Test 4: Race without subrace
  const dwarfNoSubrace = calculateTotalAbilityScoreIncreases("dwarf", "")
  console.log("Dwarf (no subrace):", dwarfNoSubrace) // Should be { constitution: 2 }
  
  // Test 5: Variant Human (flexible)
  const variantHuman = calculateTotalAbilityScoreIncreases("human", "variant-human")
  console.log("Variant Human:", variantHuman) // Should be { any1: 1, any2: 1 }
  
  console.log("=== Test Complete ===")
}
