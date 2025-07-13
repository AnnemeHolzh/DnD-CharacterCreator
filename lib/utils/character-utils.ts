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

// Language and Tool proficiency calculation utilities
export interface LanguageProficiencyData {
  fixedLanguages: string[]
  availableLanguages: string[]
  selectedLanguages: string[]
}

export interface ToolProficiencyData {
  fixedTools: string[]
  availableTools: string[]
  selectedTools: string[]
}

// Map language names from races data to API language indices
export function mapLanguageNameToIndex(languageName: string): string {
  const languageNameMap: Record<string, string> = {
    "common": "common",
    "draconic": "draconic",
    "dwarvish": "dwarvish",
    "undercommon": "undercommon",
    "elvish": "elvish",
    "gnomish": "gnomish",
    "halfling": "halfling",
    "sylvan": "sylvan",
    "orc": "orc",
    "infernal": "infernal",
    "any-one": "any-one"
  }
  
  return languageNameMap[languageName] || languageName.toLowerCase()
}

// Get class-based tool proficiencies
export function getClassToolProficiencies(classId: string): string[] {
  const classData = classes.find(c => c.id === classId)
  if (!classData) return []

  return classData.toolProficiencies.map(mapToolNameToIndex)
}

// Get race-based language proficiencies
export function getRaceLanguageProficiencies(raceId: string, subraceId: string): string[] {
  const race = races.find(r => r.id === raceId)
  if (!race) return []

  // Check for subrace-specific languages
  if (subraceId) {
    const subrace = race.subraces?.find(s => s.id === subraceId)
    if (subrace && 'languages' in subrace && Array.isArray(subrace.languages)) {
      return subrace.languages.map(mapLanguageNameToIndex)
    }
  }

  // Check for race-specific languages
  if ('languages' in race && Array.isArray(race.languages)) {
    return race.languages.map(mapLanguageNameToIndex)
  }

  return []
}

// Get background-based language proficiencies
export function getBackgroundLanguageProficiencies(backgroundId: string): string[] {
  const background = backgrounds.find(bg => bg.id === backgroundId)
  if (!background) return []

  // Handle "any language" or "choice" scenarios
  if (background.languages === "Two of your choice" || background.languages === "One of your choice" || background.languages === "Any one of your choice") {
    return [] // These will be handled as available choices
  }

  // Handle specific languages
  if (Array.isArray(background.languages)) {
    return background.languages.map(mapLanguageNameToIndex)
  }

  // Handle string-based languages (convert to array)
  if (typeof background.languages === 'string' && background.languages !== "None") {
    return [background.languages].map(mapLanguageNameToIndex)
  }

  return []
}

// Map tool names from backgrounds data to API tool indices
export function mapToolNameToIndex(toolName: string): string {
  const toolNameMap: Record<string, string> = {
    "Disguise kit": "disguise-kit",
    "Forgery kit": "forgery-kit",
    "Gaming set": "gaming-set",
    "Thieves' tools": "thieves-tools",
    "thieves' tools": "thieves-tools",
    "Musical instrument": "musical-instrument",
    "Artisan's tools": "artisans-tools",
    "artisan's tools": "artisans-tools",
    "Herbalism kit": "herbalism-kit",
    "Navigator's tools": "navigators-tools",
    "Vehicles (water)": "vehicles-water",
    "Vehicles (land)": "vehicles-land",
    "Cartographer's tools": "cartographers-tools",
    "Poisoner's kit": "poisoners-kit",
    "Fishing tackle": "fishing-tackle",
    "Carpenter's tools": "carpenters-tools",
    "Tinker's tools": "tinkers-tools",
    "tinker's tools": "tinkers-tools",
    "Mason's tools": "masons-tools",
    "mason's tools": "masons-tools",
    "Brewer's supplies": "brewers-supplies",
    "brewer's supplies": "brewers-supplies",
    "Smith's tools": "smiths-tools",
    "smith's tools": "smiths-tools"
  }
  
  return toolNameMap[toolName] || toolName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/'/g, '')
}

// Get background-based tool proficiencies
export function getBackgroundToolProficiencies(backgroundId: string): string[] {
  const background = backgrounds.find(bg => bg.id === backgroundId)
  if (!background) return []

  // Tools are always arrays in the backgrounds data
  const toolNames = Array.isArray(background.tools) ? background.tools : []
  
  // Map tool names to API indices
  return toolNames.map(mapToolNameToIndex)
}

// Get race-based tool proficiencies
export function getRaceToolProficiencies(raceId: string, subraceId: string): string[] {
  const race = races.find(r => r.id === raceId)
  if (!race) return []

  // Check for subrace-specific tools
  if (subraceId) {
    const subrace = race.subraces?.find(s => s.id === subraceId)
    if (subrace && 'tools' in subrace && Array.isArray(subrace.tools)) {
      return subrace.tools.map(mapToolNameToIndex)
    }
  }

  // Check for race-specific tools
  if ('tools' in race && Array.isArray(race.tools)) {
    return race.tools.map(mapToolNameToIndex)
  }

  return []
}

// Get background language choices count
export function getBackgroundLanguageChoices(backgroundId: string): number {
  const background = backgrounds.find(bg => bg.id === backgroundId)
  if (!background) return 0

  if (background.languages === "Two of your choice") {
    return 2
  }
  
  if (background.languages === "One of your choice" || background.languages === "Any one of your choice") {
    return 1
  }

  return 0
}

// Get race language choices count
export function getRaceLanguageChoices(raceId: string, subraceId: string): number {
  const race = races.find(r => r.id === raceId)
  if (!race) return 0

  // Check for "any-one" in race languages
  if ('languages' in race && Array.isArray(race.languages) && race.languages.includes('any-one')) {
    return 1
  }

  // Check for "any-one" in subrace languages
  if (subraceId) {
    const subrace = race.subraces?.find(s => s.id === subraceId)
    if (subrace && 'languages' in subrace && Array.isArray(subrace.languages) && subrace.languages.includes('any-one')) {
      return 1
    }
  }

  return 0
}

// Calculate total tool proficiency data
export function calculateToolProficiencies(
  characterClasses: Array<{ class: string, level: number }>,
  raceId: string,
  subraceId: string,
  backgroundId: string,
  selectedTools: string[] = []
): ToolProficiencyData {
  // Get fixed tools from race, background, and classes
  const raceTools = getRaceToolProficiencies(raceId, subraceId)
  const backgroundTools = getBackgroundToolProficiencies(backgroundId)
  const classTools = characterClasses.map(c => getClassToolProficiencies(c.class)).flat()
  const fixedTools = [...raceTools, ...backgroundTools, ...classTools]

  // Get available tools (all tools minus fixed ones)
  // This will be populated by the API data
  const availableTools: string[] = []

  // Separate selected tools (excluding fixed)
  const selectedNonFixedTools = selectedTools.filter(tool => 
    !fixedTools.includes(tool)
  )

  return {
    fixedTools,
    availableTools,
    selectedTools: selectedNonFixedTools
  }
}

// Calculate total language proficiency data
export function calculateLanguageProficiencies(
  characterClasses: Array<{ class: string, level: number }>,
  raceId: string,
  subraceId: string,
  backgroundId: string,
  selectedLanguages: string[] = []
): LanguageProficiencyData {
  // Get fixed languages from race and background (excluding "any-one")
  const raceLanguages = getRaceLanguageProficiencies(raceId, subraceId).filter(lang => lang !== 'any-one')
  const backgroundLanguages = getBackgroundLanguageProficiencies(backgroundId)
  const fixedLanguages = [...raceLanguages, ...backgroundLanguages]

  // Get available languages (all languages minus fixed ones)
  // This will be populated by the API data
  const availableLanguages: string[] = []

  // Separate selected languages (excluding fixed)
  const selectedNonFixedLanguages = selectedLanguages.filter(lang => 
    !fixedLanguages.includes(lang)
  )

  return {
    fixedLanguages,
    availableLanguages,
    selectedLanguages: selectedNonFixedLanguages
  }
}

// Validate language selections
export function validateLanguageSelections(
  languageData: LanguageProficiencyData,
  selectedLanguages: string[],
  raceId: string = "",
  subraceId: string = "",
  backgroundId: string = ""
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check if fixed languages are included
  languageData.fixedLanguages.forEach(language => {
    if (!selectedLanguages.includes(language)) {
      errors.push(`Must select ${language} (fixed language)`)
    }
  })
  
  // Validate selection limits based on allowances
  if (raceId && backgroundId) {
    const totalAllowances = calculateLanguageChoiceAllowances(raceId, subraceId, backgroundId)
    const selectedNonFixedLanguages = selectedLanguages.filter(lang => !languageData.fixedLanguages.includes(lang))
    
    if (selectedNonFixedLanguages.length > totalAllowances) {
      errors.push(`You can only select ${totalAllowances} additional language${totalAllowances !== 1 ? 's' : ''}. You have selected ${selectedNonFixedLanguages.length}.`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Check if a tool is an artisan's tool (contains "Tools" or "Supplies")
export function isArtisansTool(toolName: string): boolean {
  return toolName.toLowerCase().includes('tools') || toolName.toLowerCase().includes('supplies')
}

// Filter out non-artisan's tools from a list of tool indices
export function filterArtisansTools(toolIndices: string[], allTools: Array<{ index: string, name: string }>): string[] {
  return toolIndices.filter(toolIndex => {
    const tool = allTools.find(t => t.index === toolIndex)
    return tool ? isArtisansTool(tool.name) : false
  })
}

// Calculate total tool choice allowances from all sources
export function calculateToolChoiceAllowances(
  characterClasses: Array<{ class: string, level: number }>,
  raceId: string,
  subraceId: string,
  backgroundId: string
): number {
  let totalAllowances = 0
  
  // Check for "Artisan's tools" in fixed tools (this grants 1 choice)
  const raceTools = getRaceToolProficiencies(raceId, subraceId)
  const backgroundTools = getBackgroundToolProficiencies(backgroundId)
  const classTools = characterClasses.map(c => getClassToolProficiencies(c.class)).flat()
  const allFixedTools = [...raceTools, ...backgroundTools, ...classTools]
  
  // Count how many "artisans-tools" entries we have (each grants 1 choice)
  const artisansToolCount = allFixedTools.filter(tool => tool === 'artisans-tools').length
  totalAllowances += artisansToolCount
  
  return totalAllowances
}

// Calculate total language choice allowances from all sources
export function calculateLanguageChoiceAllowances(
  raceId: string,
  subraceId: string,
  backgroundId: string
): number {
  let totalAllowances = 0
  
  // Get background language choices
  totalAllowances += getBackgroundLanguageChoices(backgroundId)
  
  // Get race language choices
  totalAllowances += getRaceLanguageChoices(raceId, subraceId)
  
  return totalAllowances
}

// Validate tool selections
export function validateToolSelections(
  toolData: ToolProficiencyData,
  selectedTools: string[],
  allTools: Array<{ index: string, name: string }> = [],
  characterClasses: Array<{ class: string, level: number }> = [],
  raceId: string = "",
  subraceId: string = "",
  backgroundId: string = ""
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check if fixed tools are included
  toolData.fixedTools.forEach(tool => {
    if (!selectedTools.includes(tool)) {
      errors.push(`Must select ${tool} (fixed tool)`)
    }
  })
  
  // Validate that only artisan's tools are selected
  if (allTools.length > 0) {
    const nonArtisansTools = selectedTools.filter(toolIndex => {
      const tool = allTools.find(t => t.index === toolIndex)
      return tool && !isArtisansTool(tool.name)
    })
    
    if (nonArtisansTools.length > 0) {
      const toolNames = nonArtisansTools.map(toolIndex => {
        const tool = allTools.find(t => t.index === toolIndex)
        return tool ? tool.name : toolIndex
      })
      errors.push(`Only artisan's tools can be selected. Invalid selections: ${toolNames.join(', ')}`)
    }
  }
  
  // Validate selection limits based on allowances
  if (characterClasses.length > 0 && raceId && backgroundId) {
    const totalAllowances = calculateToolChoiceAllowances(characterClasses, raceId, subraceId, backgroundId)
    const selectedNonFixedTools = selectedTools.filter(tool => !toolData.fixedTools.includes(tool))
    
    if (selectedNonFixedTools.length > totalAllowances) {
      errors.push(`You can only select ${totalAllowances} additional artisan's tool${totalAllowances !== 1 ? 's' : ''}. You have selected ${selectedNonFixedTools.length}.`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
