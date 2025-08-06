import { validateRaceSubraceCombination, getSubracesForRace } from "@/lib/data/races"
import { getSubclassesForClass, getMinLevelUnlock, isSubclassAvailableAtLevel } from "@/lib/data/classes"
import { getAvailableFeats, getEligibleFeats, meetsFeatPrerequisites } from "@/lib/data/feats"
import { calculateSkillProficiencies, validateSkillSelections } from "@/lib/utils/character-utils"

export interface ValidationError {
  section: string
  field: string
  message: string
  priority: 'high' | 'medium' | 'low'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface CharacterFormData {
  // Narrative section
  name?: string
  background?: string
  backgroundSkillProficiencies?: string[]
  backgroundToolProficiencies?: string[]
  backgroundLanguages?: number
  backgroundEquipment?: string[]
  alignment?: string
  appearance?: string
  backstory?: string
  personalityTraits?: string
  ideals?: string
  bonds?: string
  flaws?: string

  // Mechanics section
  classes?: Array<{ class?: string; subclass?: string; level?: number }>
  race?: string
  subrace?: string
  level?: number
  abilityScoreMethod?: string
  abilityScoreAssignmentMode?: string
  customAbilityScoreAssignments?: Record<string, string>
  abilityScores?: {
    strength?: number
    dexterity?: number
    constitution?: number
    intelligence?: number
    wisdom?: number
    charisma?: number
  }

  savingThrowProficiencies?: string[]
  skills?: string[]
  tools?: string[]
  languages?: string[]
  proficiencies?: string[]
  weapons?: string[]
  armor?: string
  shield?: string
  items?: string[]
  wealth?: {
    platinum?: number
    gold?: number
    silver?: number
    bronze?: number
  }
  equipment?: any[]
  spells?: string[]
  feats?: string[]
  asiChoices?: Array<{ choice: "single" | "double", abilities: string[] }>
  featASIChoices?: Record<string, string>
  hp?: number
  xp?: number
  levelProgression?: Array<{
    level?: number
    featuresGained?: string
    spellsLearned?: string
    equipmentChanges?: string
    notes?: string
  }>
}

/**
 * Validates narrative section fields
 */
export function validateNarrativeSection(data: CharacterFormData): ValidationError[] {
  const errors: ValidationError[] = []

  // Validate character name
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Character Name',
      message: 'Character name is required',
      priority: 'high'
    })
  } else if (data.name.trim().length > 100) {
    errors.push({
      section: 'Narrative Section',
      field: 'Character Name',
      message: 'Character name must be 100 characters or less',
      priority: 'high'
    })
  } else if (/^[0-9\s]+$/.test(data.name.trim())) {
    errors.push({
      section: 'Narrative Section',
      field: 'Character Name',
      message: 'Character name cannot consist only of numbers and spaces',
      priority: 'high'
    })
  }

  // Validate background
  if (!data.background || data.background.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Background',
      message: 'Background is required',
      priority: 'high'
    })
  }

  // Validate appearance
  if (!data.appearance || data.appearance.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Appearance',
      message: 'Appearance description is required',
      priority: 'high'
    })
  } else {
    const wordCount = data.appearance.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount < 20) {
      errors.push({
        section: 'Narrative Section',
        field: 'Appearance',
        message: 'Appearance description must be at least 20 words',
        priority: 'high'
      })
    } else if (wordCount > 450) {
      errors.push({
        section: 'Narrative Section',
        field: 'Appearance',
        message: 'Appearance description must be 450 words or less',
        priority: 'high'
      })
    }
  }

  // Validate backstory
  if (!data.backstory || data.backstory.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Backstory',
      message: 'Backstory is required',
      priority: 'high'
    })
  } else {
    const wordCount = data.backstory.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount < 200) {
      errors.push({
        section: 'Narrative Section',
        field: 'Backstory',
        message: 'Backstory must be at least 200 words',
        priority: 'high'
      })
    } else if (wordCount > 750) {
      errors.push({
        section: 'Narrative Section',
        field: 'Backstory',
        message: 'Backstory must be 750 words or less',
        priority: 'high'
      })
    }
  }

  // Validate personality traits
  if (!data.personalityTraits || data.personalityTraits.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Personality Traits',
      message: 'Personality traits are required',
      priority: 'high'
    })
  } else {
    const wordCount = data.personalityTraits.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount > 250) {
      errors.push({
        section: 'Narrative Section',
        field: 'Personality Traits',
        message: 'Personality traits must be 250 words or less',
        priority: 'high'
      })
    }
  }

  // Validate ideals
  if (!data.ideals || data.ideals.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Ideals',
      message: 'Ideals are required',
      priority: 'high'
    })
  } else {
    const wordCount = data.ideals.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount > 250) {
      errors.push({
        section: 'Narrative Section',
        field: 'Ideals',
        message: 'Ideals must be 250 words or less',
        priority: 'high'
      })
    }
  }

  // Validate bonds
  if (!data.bonds || data.bonds.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Bonds',
      message: 'Bonds are required',
      priority: 'high'
    })
  } else {
    const wordCount = data.bonds.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount > 250) {
      errors.push({
        section: 'Narrative Section',
        field: 'Bonds',
        message: 'Bonds must be 250 words or less',
        priority: 'high'
      })
    }
  }

  // Validate flaws
  if (!data.flaws || data.flaws.trim().length === 0) {
    errors.push({
      section: 'Narrative Section',
      field: 'Flaws',
      message: 'Flaws are required',
      priority: 'high'
    })
  } else {
    const wordCount = data.flaws.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount > 250) {
      errors.push({
        section: 'Narrative Section',
        field: 'Flaws',
        message: 'Flaws must be 250 words or less',
        priority: 'high'
      })
    }
  }

  return errors
}

/**
 * Validates race and subrace selection
 */
export function validateRaceSelection(data: CharacterFormData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.race || data.race.trim() === '') {
    errors.push({
      section: 'Race Selection',
      field: 'Race',
      message: 'A valid race must be selected',
      priority: 'high'
    })
    return errors
  }

  // Get available subraces for the selected race
  const availableSubraces = getSubracesForRace(data.race)
  
  // Debug logging (commented out for production)
  // console.log('Race validation debug:', {
  //   race: data.race,
  //   subrace: data.subrace,
  //   availableSubraces: availableSubraces.map(s => s.id),
  //   hasSubraces: availableSubraces.length > 0
  // })
  
  if (availableSubraces.length === 0) {
    // Race has no subraces, so no subrace selection needed
    return errors
  }

  if (!data.subrace || data.subrace.trim() === '') {
    errors.push({
      section: 'Race Selection',
      field: 'Subrace',
      message: 'A subrace must be selected for this race',
      priority: 'high'
    })
    return errors
  }

  // Validate race/subrace combination
  const isValidCombination = validateRaceSubraceCombination(data.race, data.subrace)
  
  if (!isValidCombination) {
    errors.push({
      section: 'Race Selection',
      field: 'Subrace',
      message: `Invalid subrace '${data.subrace}' for race '${data.race}'`,
      priority: 'high'
    })
  }

  return errors
}

/**
 * Validates class selection and level requirements
 */
export function validateClassSelection(data: CharacterFormData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.classes || data.classes.length === 0) {
    errors.push({
      section: 'Class Selection',
      field: 'Classes',
      message: 'At least one class must be selected',
      priority: 'high'
    })
    return errors
  }

  let totalLevel = 0
  const validClasses = data.classes.filter(cls => cls.class && cls.class.trim() !== '')

  if (validClasses.length === 0) {
    errors.push({
      section: 'Class Selection',
      field: 'Classes',
      message: 'At least one valid class must be selected',
      priority: 'high'
    })
    return errors
  }

  // Validate each class entry
  validClasses.forEach((classEntry, index) => {
    if (!classEntry.level || classEntry.level < 1) {
      errors.push({
        section: 'Class Selection',
        field: `Class ${index + 1} Level`,
        message: 'Each class must have a level of at least 1',
        priority: 'high'
      })
    } else {
      totalLevel += classEntry.level
    }

    // Validate subclass if present
    if (classEntry.subclass && classEntry.subclass.trim() !== '') {
      const availableSubclasses = getSubclassesForClass(classEntry.class || '')
      const subclassExists = availableSubclasses.some(sub => 
        sub.subclass_name.toLowerCase() === classEntry.subclass?.toLowerCase()
      )

      if (!subclassExists) {
        errors.push({
          section: 'Class Selection',
          field: `Class ${index + 1} Subclass`,
          message: 'Invalid subclass for the selected class',
          priority: 'high'
        })
      } else if (classEntry.level) {
        // Check if subclass is available at the character's level
        const isAvailable = isSubclassAvailableAtLevel(classEntry.subclass, classEntry.level)
        if (!isAvailable) {
          const minLevel = getMinLevelUnlock(classEntry.subclass)
          errors.push({
            section: 'Class Selection',
            field: `Class ${index + 1} Subclass`,
            message: `Subclass requires level ${minLevel} or higher`,
            priority: 'high'
          })
        }
      }
    }
  })

  // Check total level cap
  if (totalLevel > 20) {
    errors.push({
      section: 'Class Selection',
      field: 'Total Level',
      message: 'Total level across all classes cannot exceed 20',
      priority: 'high'
    })
  }

  return errors
}

/**
 * Validates ability score generation method and values
 */
export function validateAbilityScores(data: CharacterFormData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.abilityScoreMethod) {
    errors.push({
      section: 'Ability Scores',
      field: 'Generation Method',
      message: 'An ability score generation method must be selected',
      priority: 'high'
    })
    return errors
  }

  if (!data.abilityScores) {
    errors.push({
      section: 'Ability Scores',
      field: 'Ability Scores',
      message: 'Ability scores must be assigned',
      priority: 'high'
    })
    return errors
  }

  const scores = data.abilityScores
  const scoreValues = Object.values(scores).filter(score => score !== undefined && score !== null)

  // Extract numeric values from roll assignments or direct values
  const numericScoreValues = scoreValues.map(score => {
    if (score && typeof score === 'object' && 'rollId' in score) {
      // Roll assignment - extract the numeric value
      return (score as { rollId: string; value: number }).value
    } else {
      // Direct numeric value
      return Number(score)
    }
  }).filter(score => !isNaN(score))

  // Check if all 6 scores are assigned
  if (numericScoreValues.length !== 6) {
    errors.push({
      section: 'Ability Scores',
      field: 'Ability Scores',
      message: 'All 6 ability scores must be assigned',
      priority: 'high'
    })
    return errors
  }

  // Check for all scores being the same (which would be invalid)
  const uniqueScores = new Set(numericScoreValues)
  if (uniqueScores.size === 1) {
    errors.push({
      section: 'Ability Scores',
      field: 'Ability Scores',
      message: 'All ability scores cannot be the same value',
      priority: 'high'
    })
  }

  // Validate based on generation method
  switch (data.abilityScoreMethod) {
    case 'standard-array':
      const standardArray = [15, 14, 13, 12, 10, 8]
      const sortedScores = [...numericScoreValues].sort((a, b) => b - a)
      const isValidStandardArray = standardArray.every((value, index) => sortedScores[index] === value)
      
      if (!isValidStandardArray) {
        errors.push({
          section: 'Ability Scores',
          field: 'Standard Array',
          message: 'Standard array must use exactly: 15, 14, 13, 12, 10, 8',
          priority: 'high'
        })
      }
      break

    case 'point-buy':
      // For point buy, we need to check if the scores are reasonable for base scores
      // Since we now save total scores, we'll be more lenient with the validation
      // Check for scores that are clearly too high for base scores (above 20)
      const highScores = numericScoreValues.filter(score => score > 20)
      if (highScores.length > 0) {
        errors.push({
          section: 'Ability Scores',
          field: 'Point Buy Range',
          message: 'Base ability scores cannot exceed 20 (total scores with bonuses may be higher)',
          priority: 'high'
        })
      }
      
      // Check for scores that are too low (below 3)
      const lowScores = numericScoreValues.filter(score => score < 3)
      if (lowScores.length > 0) {
        errors.push({
          section: 'Ability Scores',
          field: 'Point Buy Range',
          message: 'Ability scores cannot be below 3',
          priority: 'high'
        })
      }
      break

    case 'roll':
      // Roll validation - check for minimum scores
      const lowRolledScores = numericScoreValues.filter(score => score < 3)
      if (lowRolledScores.length > 0) {
        errors.push({
          section: 'Ability Scores',
          field: 'Rolled Scores',
          message: 'Rolled scores cannot be below 3',
          priority: 'high'
        })
      }
      break

    case 'manual-roll':
      // Manual roll validation - check for valid range (1-20)
      const invalidManualScores = numericScoreValues.filter(score => score < 1 || score > 20)
      if (invalidManualScores.length > 0) {
        errors.push({
          section: 'Ability Scores',
          field: 'Manual Roll Scores',
          message: 'Manual roll scores must be between 1 and 20',
          priority: 'high'
        })
      }
      break
  }

  // Check for scores that are too low (0 or negative)
  const zeroOrNegativeScores = numericScoreValues.filter(score => score <= 0)
  if (zeroOrNegativeScores.length > 0) {
    errors.push({
      section: 'Ability Scores',
      field: 'Ability Scores',
      message: 'Ability scores cannot be 0 or negative',
      priority: 'high'
    })
  }

  return errors
}

/**
 * Validates feat selections and prerequisites
 */
export function validateFeats(data: CharacterFormData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.classes || !data.abilityScores) {
    return errors // Can't validate feats without class and ability score data
  }

  // Calculate available feat slots
  const totalLevel = (data.classes || []).reduce((sum, cls) => sum + (cls.level || 0), 0)
  const availableFeats = getAvailableFeats(totalLevel, data.classes || [], data.abilityScores || {}, data.proficiencies || [])

  if (availableFeats === 0) {
    // No feat slots available, so no validation needed
    return errors
  }

  const selectedFeats = data.feats || []
  const asiChoices = data.asiChoices || []
  const eligibleFeats = getEligibleFeats(data.abilityScores || {}, data.classes || [], data.proficiencies || [])

  // Check if all feat slots are filled (feats + ASI choices)
  const totalUsedSlots = selectedFeats.length + asiChoices.length
  if (totalUsedSlots < availableFeats) {
    errors.push({
      section: 'Feats',
      field: 'Feat Selection',
      message: `All ${availableFeats} feat slot(s) must be filled (currently using ${totalUsedSlots} slots)`,
      priority: 'low'
    })
  } else if (totalUsedSlots > availableFeats) {
    errors.push({
      section: 'Feats',
      field: 'Feat Selection',
      message: `Too many feat slots used (${totalUsedSlots} used, ${availableFeats} available)`,
      priority: 'medium'
    })
  }

  // Validate each selected feat
  selectedFeats.forEach((featName, index) => {
    const feat = eligibleFeats.find(f => f.name === featName)
    
    if (!feat) {
      errors.push({
        section: 'Feats',
        field: `Feat ${index + 1}`,
        message: `Invalid feat: ${featName}`,
        priority: 'low'
      })
    } else {
      // Check prerequisites
      const meetsPrereqs = meetsFeatPrerequisites(feat, data.abilityScores || {}, data.classes || [], data.proficiencies || [])
      if (!meetsPrereqs) {
        errors.push({
          section: 'Feats',
          field: `Feat ${index + 1}`,
          message: `Feat "${featName}" prerequisites not met`,
          priority: 'low'
        })
      }
    }
  })

  return errors
}

/**
 * Validates skills and proficiencies
 */
export function validateSkillsAndProficiencies(data: CharacterFormData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.classes || !data.race || !data.background) {
    return errors // Can't validate without required data
  }

  // Filter and transform classes to match expected type
  const validClasses = (data.classes || [])
    .filter(cls => cls.class && cls.level)
    .map(cls => ({ class: cls.class!, level: cls.level! }))

  // Calculate expected skill proficiencies
  const skillData = calculateSkillProficiencies(
    validClasses,
    data.race || '',
    data.subrace || '',
    data.background || '',
    data.skills || []
  )

  // Validate skill selections
  const skillValidation = validateSkillSelections(skillData, data.skills || [])
  if (!skillValidation.isValid) {
    skillValidation.errors.forEach(error => {
      errors.push({
        section: 'Skills & Proficiencies',
        field: 'Skills',
        message: error,
        priority: 'medium'
      })
    })
  }

  // Note: Saving throw proficiencies are automatically determined by class(es)
  // No user selection required, so no validation needed

  return errors
}

/**
 * Validates equipment selections
 */
export function validateEquipment(data: CharacterFormData): ValidationError[] {
  const errors: ValidationError[] = []

  // Check for spellcasting classes that need spell components
  const hasSpellcastingClass = data.classes?.some(cls => {
    // This would need to be implemented based on your class data structure
    // For now, we'll check if they have spells selected
    return data.spells && data.spells.length > 0
  })

  if (hasSpellcastingClass && (!data.spells || data.spells.length === 0)) {
    errors.push({
      section: 'Equipment',
      field: 'Spells',
      message: 'Spellcasting classes must have spells selected',
      priority: 'medium'
    })
  }

  // Validate weapon and armor compatibility
  if (data.weapons && data.weapons.length > 0) {
    const hasTwoHandedWeapon = data.weapons.some(weapon => 
      weapon.toLowerCase().includes('greatsword') || 
      weapon.toLowerCase().includes('greataxe') ||
      weapon.toLowerCase().includes('maul')
    )

    if (hasTwoHandedWeapon && data.shield) {
      errors.push({
        section: 'Equipment',
        field: 'Weapon/Shield',
        message: 'Cannot use a shield with a two-handed weapon',
        priority: 'medium'
      })
    }
  }

  return errors
}

/**
 * Main validation function that runs all validations
 */
export function validateCharacterForm(data: CharacterFormData): ValidationResult {
  const errors: ValidationError[] = []

  // Run all validation functions
  errors.push(...validateNarrativeSection(data))
  errors.push(...validateRaceSelection(data))
  errors.push(...validateClassSelection(data))
  errors.push(...validateAbilityScores(data))
  errors.push(...validateFeats(data))
  errors.push(...validateSkillsAndProficiencies(data))
  errors.push(...validateEquipment(data))

  // Sort errors by priority (high, medium, low)
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  errors.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return {
    isValid: errors.length === 0,
    errors
  }
}



/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return ''

  const highPriorityErrors = errors.filter(e => e.priority === 'high')
  const mediumPriorityErrors = errors.filter(e => e.priority === 'medium')
  const lowPriorityErrors = errors.filter(e => e.priority === 'low')

  let message = 'Please fix the following issues:\n\n'

  if (highPriorityErrors.length > 0) {
    message += 'Critical Issues:\n'
    highPriorityErrors.forEach(error => {
      message += `• ${error.field}: ${error.message}\n`
    })
    message += '\n'
  }

  if (mediumPriorityErrors.length > 0) {
    message += 'Important Issues:\n'
    mediumPriorityErrors.forEach(error => {
      message += `• ${error.field}: ${error.message}\n`
    })
    message += '\n'
  }

  if (lowPriorityErrors.length > 0) {
    message += 'Minor Issues:\n'
    lowPriorityErrors.forEach(error => {
      message += `• ${error.field}: ${error.message}\n`
    })
  }

  return message.trim()
} 