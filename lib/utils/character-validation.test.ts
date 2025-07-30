import { validateCharacterForm, validateRaceSelection, validateClassSelection, validateAbilityScores } from './character-validation'

// Test data for validation
const validCharacterData = {
  name: "Test Character",
  background: "soldier",
  appearance: "A tall human with brown hair and green eyes. He wears leather armor and carries a longsword.",
  backstory: "Born in a small village, this character grew up learning to fight from his father, a retired soldier. He joined the local militia and eventually decided to become an adventurer to see the world and make a difference.",
  personalityTraits: "Brave and loyal, always willing to help others in need.",
  ideals: "Justice and protection of the innocent.",
  bonds: "His family and the village he grew up in.",
  flaws: "Sometimes too trusting of authority figures.",
  classes: [{ class: "fighter", subclass: "champion", level: 1 }],
  race: "human",
  subrace: "standard-human",
  level: 1,
  abilityScoreMethod: "standard-array",
  abilityScores: {
    strength: 15,
    dexterity: 14,
    constitution: 13,
    intelligence: 12,
    wisdom: 10,
    charisma: 8
  },
  savingThrowProficiencies: ["strength", "constitution"],
  skills: ["athletics", "intimidation"],
  weapons: ["longsword"],
  armor: "leather",
  spells: [],
  feats: []
}

const invalidCharacterData = {
  name: "",
  background: "",
  appearance: "",
  backstory: "",
  personalityTraits: "",
  ideals: "",
  bonds: "",
  flaws: "",
  classes: [],
  race: "",
  subrace: "",
  level: 0,
  abilityScoreMethod: "",
  abilityScores: {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0
  },
  savingThrowProficiencies: [],
  skills: [],
  weapons: [],
  armor: "",
  spells: [],
  feats: []
}

// Test function to demonstrate validation
export function testCharacterValidation() {
  console.log("=== Character Validation System Tests ===\n")

  // Test 1: Valid character
  console.log("Test 1: Valid Character")
  const validResult = validateCharacterForm(validCharacterData)
  console.log("Valid character result:", validResult.isValid)
  if (!validResult.isValid) {
    console.log("Errors:", validResult.errors)
  }
  console.log()

  // Test 2: Invalid character
  console.log("Test 2: Invalid Character")
  const invalidResult = validateCharacterForm(invalidCharacterData)
  console.log("Invalid character result:", invalidResult.isValid)
  console.log("Errors:", invalidResult.errors)
  console.log()

  // Test 3: Race validation
  console.log("Test 3: Race Validation")
  const raceErrors = validateRaceSelection(invalidCharacterData)
  console.log("Race validation errors:", raceErrors)
  console.log()

  // Test 4: Class validation
  console.log("Test 4: Class Validation")
  const classErrors = validateClassSelection(invalidCharacterData)
  console.log("Class validation errors:", classErrors)
  console.log()

  // Test 5: Ability score validation
  console.log("Test 5: Ability Score Validation")
  const abilityErrors = validateAbilityScores(invalidCharacterData)
  console.log("Ability score validation errors:", abilityErrors)
  console.log()

  // Test 6: Specific validation scenarios
  console.log("Test 6: Specific Validation Scenarios")

  // Test invalid race/subrace combination
  const invalidRaceData = {
    ...validCharacterData,
    race: "human",
    subrace: "invalid-subrace"
  }
  const invalidRaceResult = validateCharacterForm(invalidRaceData)
  console.log("Invalid race/subrace combination:", invalidRaceResult.errors.filter(e => e.section === 'Race Selection'))

  // Test total level exceeding 20
  const invalidLevelData = {
    ...validCharacterData,
    classes: [
      { class: "fighter", subclass: "champion", level: 15 },
      { class: "wizard", subclass: "evocation", level: 10 }
    ]
  }
  const invalidLevelResult = validateCharacterForm(invalidLevelData)
  console.log("Total level > 20:", invalidLevelResult.errors.filter(e => e.field === 'Total Level'))

  // Test invalid ability scores (all same value)
  const invalidAbilityData = {
    ...validCharacterData,
    abilityScoreMethod: "standard-array",
    abilityScores: {
      strength: 8, // All scores are 8 (invalid)
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8
    }
  }
  const invalidAbilityResult = validateCharacterForm(invalidAbilityData)
  console.log("Invalid ability scores:", invalidAbilityResult.errors.filter(e => e.section === 'Ability Scores'))

  console.log("\n=== Validation Tests Complete ===")
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testCharacterValidation = testCharacterValidation
} 