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
import { backgrounds } from '@/lib/data/backgrounds'
import { classes } from '@/lib/data/classes'
import { skills } from '@/lib/data/skills'

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

// Skill proficiency calculation utilities
export interface SkillProficiencyData {
  fixedProficiencies: string[]
  classSkillPoints: number
  globalSkillPoints: number
  availableClassSkills: string[]
  availableGlobalSkills: string[]
  selectedClassSkills: string[]
  selectedGlobalSkills: string[]
}

// Get race-based skill proficiencies
export function getRaceSkillProficiencies(raceId: string, subraceId: string): string[] {
  const race = races.find(r => r.id === raceId)
  if (!race) return []

  // Check for subrace-specific skills
  if (subraceId) {
    const subrace = race.subraces?.find(s => s.id === subraceId)
    if (subrace && 'skills' in subrace && Array.isArray(subrace.skills)) {
      return subrace.skills
    }
  }

  // Check for race-specific skills
  if ('skills' in race && Array.isArray(race.skills)) {
    return race.skills
  }

  return []
}

// Get background skill proficiencies
export function getBackgroundSkillProficiencies(backgroundId: string): string[] {
  const background = backgrounds.find(bg => bg.id === backgroundId)
  if (!background?.skills) return []
  
  // Convert skill names to skill IDs
  return background.skills.map(skillName => {
    // Handle special cases and convert to kebab-case
    const skillId = skillName.toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/of\s+/g, 'of-') // Handle "of" in "Sleight of Hand"
    
    return skillId
  })
}

// Get class skill proficiencies
export function getClassSkillProficiencies(classId: string): { skillChoices: number, skillProficiencies: string[] } {
  const classData = classes.find(c => c.id === classId)
  if (!classData) {
    return { skillChoices: 0, skillProficiencies: [] }
  }
  
  return {
    skillChoices: classData.skillChoices,
    skillProficiencies: classData.skillProficiencies
  }
}

// Calculate multiclass bonus proficiencies
export function getMulticlassSkillProficiencies(characterClasses: Array<{ class: string, level: number }>): number {
  let bonusPoints = 0
  
  // Check if this is multiclassed (more than one class)
  if (characterClasses.length > 1) {
    // Count Bard, Rogue, and Ranger classes (excluding the first class)
    const multiclassClasses = characterClasses.slice(1)
    const skillClasses = ['bard', 'rogue', 'ranger']
    
    multiclassClasses.forEach(classData => {
      if (skillClasses.includes(classData.class)) {
        bonusPoints += 1
      }
    })
  }
  
  return bonusPoints
}

// Calculate total skill proficiency data
export function calculateSkillProficiencies(
  characterClasses: Array<{ class: string, level: number }>,
  raceId: string,
  subraceId: string,
  backgroundId: string,
  selectedSkills: string[] = []
): SkillProficiencyData {
  // Get fixed proficiencies from race and background
  const raceSkills = getRaceSkillProficiencies(raceId, subraceId)
  const backgroundSkills = getBackgroundSkillProficiencies(backgroundId)
  const fixedProficiencies = [...raceSkills, ...backgroundSkills]

  // Get class skill data (use the first class for skill choices)
  const primaryClass = characterClasses[0]?.class || ""
  const classData = getClassSkillProficiencies(primaryClass)
  
  // Calculate global skill points
  const isHalfElf = raceId === "half-elf"
  const multiclassBonus = getMulticlassSkillProficiencies(characterClasses)
  const globalSkillPoints = (isHalfElf ? 2 : 0) + multiclassBonus

  // Get available skills (excluding fixed proficiencies)
  const allSkills = skills.map(s => s.id)
  const availableClassSkills = classData.skillProficiencies.filter(skill => 
    !fixedProficiencies.includes(skill)
  )
  const availableGlobalSkills = allSkills.filter(skill => 
    !fixedProficiencies.includes(skill) && 
    !availableClassSkills.includes(skill)
  )

  // Separate selected skills into class and global (excluding fixed)
  const selectedClassSkills = selectedSkills.filter(skill => 
    availableClassSkills.includes(skill)
  )
  const selectedGlobalSkills = selectedSkills.filter(skill => 
    availableGlobalSkills.includes(skill)
  )

  return {
    fixedProficiencies,
    classSkillPoints: classData.skillChoices,
    globalSkillPoints,
    availableClassSkills,
    availableGlobalSkills,
    selectedClassSkills,
    selectedGlobalSkills
  }
}

// Validate skill selections
export function validateSkillSelections(
  skillData: SkillProficiencyData,
  selectedSkills: string[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check if fixed proficiencies are included
  skillData.fixedProficiencies.forEach(skill => {
    if (!selectedSkills.includes(skill)) {
      errors.push(`Must select ${skill} (fixed proficiency)`)
    }
  })
  
  // Check class skill selections (excluding fixed skills)
  const selectedClassSkills = selectedSkills.filter(skill => 
    skillData.availableClassSkills.includes(skill)
  )
  if (selectedClassSkills.length > skillData.classSkillPoints) {
    errors.push(`Too many class skills selected (${selectedClassSkills.length}/${skillData.classSkillPoints})`)
  }
  
  // Check global skill selections (excluding fixed skills)
  const selectedGlobalSkills = selectedSkills.filter(skill => 
    skillData.availableGlobalSkills.includes(skill)
  )
  if (selectedGlobalSkills.length > skillData.globalSkillPoints) {
    errors.push(`Too many global skills selected (${selectedGlobalSkills.length}/${skillData.globalSkillPoints})`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Test function to verify skill proficiency calculation
export function testSkillProficiencies() {
  console.log("=== Testing Skill Proficiency Calculation ===")
  
  // Test 1: Basic class skills
  const test1 = calculateSkillProficiencies(
    [{ class: "fighter", level: 1 }],
    "human",
    "standard-human",
    "soldier",
    []
  )
  console.log("Fighter + Soldier:", test1)
  
  // Test 2: Half-Elf with global skills
  const test2 = calculateSkillProficiencies(
    [{ class: "rogue", level: 1 }],
    "half-elf",
    "standard-half-elf",
    "criminal",
    []
  )
  console.log("Half-Elf Rogue + Criminal:", test2)
  
  // Test 3: Elf with fixed perception
  const test3 = calculateSkillProficiencies(
    [{ class: "ranger", level: 1 }],
    "elf",
    "high-elf",
    "outlander",
    []
  )
  console.log("High Elf Ranger + Outlander:", test3)
  
  // Test 4: Multiclass with bonus proficiencies
  const test4 = calculateSkillProficiencies(
    [
      { class: "fighter", level: 1 },
      { class: "rogue", level: 1 }
    ],
    "human",
    "standard-human",
    "soldier",
    []
  )
  console.log("Fighter/Rogue Multiclass:", test4)
  
  // Test 5: Fixed skills validation
  const test5 = validateSkillSelections(test3, ["athletics", "survival"])
  console.log("Fixed skills validation:", test5)
  
  // Test 6: Fixed skills with auto-selection
  const test6 = calculateSkillProficiencies(
    [{ class: "fighter", level: 1 }],
    "elf",
    "high-elf",
    "soldier",
    ["perception", "athletics", "intimidation"]
  )
  console.log("Elf Fighter with fixed perception:", test6)
  
  // Test 7: Background skill conversion
  console.log("Background skill conversion tests:")
  console.log("Soldier skills:", getBackgroundSkillProficiencies("soldier"))
  console.log("Criminal skills:", getBackgroundSkillProficiencies("criminal"))
  console.log("Sage skills:", getBackgroundSkillProficiencies("sage"))
  
  // Test 8: Race skill proficiencies
  console.log("Race skill proficiency tests:")
  console.log("High Elf skills:", getRaceSkillProficiencies("elf", "high-elf"))
  console.log("Wood Elf skills:", getRaceSkillProficiencies("elf", "wood-elf"))
  
  console.log("=== Test Complete ===")
}
