import { z } from "zod"
import { sanitizeCharacterName, sanitizeText, countWords, sanitizeRaceSelection, sanitizeClassSelection, sanitizeSubclassSelection } from "@/lib/utils/input-validation"
import { races, validateRaceSubraceCombination } from "@/lib/data/races"
import { classes, getSubclassesForClass, getMinLevelUnlock, isSubclassAvailableAtLevel } from "@/lib/data/classes"
import { getAvailableFeats, getEligibleFeats } from "@/lib/data/feats"

export const CharacterSchema = z.object({
  // Narrative section
  name: z.string()
    .max(100, "Character name must be 100 characters or less")
    .refine((val) => !val || val.trim().length > 0, {
      message: "Character name cannot be empty if provided"
    })
    .refine((val) => !val || !/^[0-9\s]+$/.test(val), {
      message: "Character name cannot consist only of numbers and spaces"
    })
    .transform((val) => val ? sanitizeCharacterName(val) : val)
    .optional(),
  background: z.string().optional(),
  backgroundSkillProficiencies: z.array(z.string()).optional(),
  backgroundToolProficiencies: z.array(z.string()).optional(),
  backgroundLanguages: z.number().optional(),
  backgroundEquipment: z.array(z.string()).optional(),
  alignment: z.string().optional(),
  appearance: z.string()
    .transform((val) => val ? sanitizeText(val) : val)
    .refine((val) => !val || countWords(val) <= 200, {
      message: "Appearance description must be 200 words or less"
    })
    .optional(),
  backstory: z.string()
    .transform((val) => val ? sanitizeText(val) : val)
    .refine((val) => !val || countWords(val) <= 200, {
      message: "Backstory must be 200 words or less"
    })
    .optional(),
  personalityTraits: z.string()
    .transform((val) => val ? sanitizeText(val) : val)
    .optional(),
  ideals: z.string()
    .transform((val) => val ? sanitizeText(val) : val)
    .optional(),
  bonds: z.string()
    .transform((val) => val ? sanitizeText(val) : val)
    .optional(),
  flaws: z.string()
    .transform((val) => val ? sanitizeText(val) : val)
    .optional(),

  // Mechanics section
  classes: z.array(z.object({
    class: z.string()
      .transform((val) => val ? sanitizeClassSelection(val) : val)
      .refine((val) => !val || val !== "", {
        message: "Please select a class"
      })
      .refine((val) => !val || classes.some(c => c.id === val), {
        message: "Please select a valid class"
      })
      .optional(),
    subclass: z.string()
      .transform((val) => val ? sanitizeSubclassSelection(val) : val)
      .refine((val) => !val || val !== "", {
        message: "Please select a subclass"
      })
      .refine((val) => {
        if (!val) return true;
        // This validation will be handled in the form component
        return true;
      }, {
        message: "Please select a valid subclass for the chosen class and level"
      })
      .optional(),
    level: z.number()
      .min(1, "Level must be at least 1")
      .max(20, "Level cannot exceed 20")
      .optional(),
  }))
  .refine((classesArray) => {
    if (!classesArray || classesArray.length === 0) return true;
    
    // Calculate total level across all classes
    const totalLevel = classesArray.reduce((sum, classEntry) => {
      return sum + (classEntry.level || 0);
    }, 0);
    
    return totalLevel <= 20;
  }, {
    message: "Total level across all classes cannot exceed 20",
    path: ["classes"]
  })
  .optional(),
  race: z.string()
    .transform((val) => val ? sanitizeRaceSelection(val) : val)
    .refine((val) => !val || val !== "", {
      message: "Please select a race"
    })
    .refine((val) => !val || races.some(r => r.id === val), {
      message: "Please select a valid race"
    })
    .optional(),
  subrace: z.string()
    .transform((val) => val ? sanitizeRaceSelection(val) : val)
    .refine((val) => !val || val !== "", {
      message: "Please select a subrace"
    })
    .refine((val) => {
      if (!val) return true
      // This validation will be handled in the form component
      return true
    }, {
      message: "Please select a valid subrace for the chosen race"
    })
    .optional(),
  level: z.number().optional(),
  abilityScoreMethod: z.string().optional(),
  abilityScoreAssignmentMode: z.enum(["standard", "custom"]).optional(),
  customAbilityScoreAssignments: z.record(z.string()).optional(),
  abilityScores: z.object({
    strength: z.number().optional(),
    dexterity: z.number().optional(),
    constitution: z.number().optional(),
    intelligence: z.number().optional(),
    wisdom: z.number().optional(),
    charisma: z.number().optional(),
  }).optional(),
  savingThrowProficiencies: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  proficiencies: z.array(z.string()).optional(),
  equipment: z.array(z.any()).optional(),
  spells: z.array(z.string()).optional(),
  feats: z.array(z.string()).optional(),
  hp: z.number().optional(),
  xp: z.number().optional(),

  // Progression section
  levelProgression: z.array(z.object({
    level: z.number().optional(),
    featuresGained: z.string().optional(),
    spellsLearned: z.string().optional(),
    equipmentChanges: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
})
