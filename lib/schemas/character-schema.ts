import { z } from "zod"
import { sanitizeCharacterName, sanitizeText, countWords, sanitizeRaceSelection, sanitizeClassSelection, sanitizeSubclassSelection } from "@/lib/utils/input-validation"
import { races, validateRaceSubraceCombination } from "@/lib/data/races"
import { classes, getSubclassesForClass, getMinLevelUnlock, isSubclassAvailableAtLevel } from "@/lib/data/classes"
import { getAvailableFeats, getEligibleFeats } from "@/lib/data/feats"
import { backgrounds } from "@/lib/data/backgrounds"

export const CharacterSchema = z.object({
  // Narrative section - All fields now required
  name: z.string()
    .nonempty("Character name is required")
    .max(100, "Character name must be 100 characters or less")
    .refine((val) => val.trim().length > 0, {
      message: "Character name cannot be empty or only whitespace"
    })
    .refine((val) => !/^[0-9\s]+$/.test(val.trim()), {
      message: "Character name cannot consist only of numbers and spaces"
    })
    .transform((val) => sanitizeCharacterName(val)),
  background: z.string()
    .nonempty("Background is required")
    .refine((val) => val.trim().length > 0, {
      message: "Please select a valid background"
    })
    .refine((val) => backgrounds.some(bg => bg.id === val), {
      message: "Please select a valid background from the list"
    }),
  backgroundSkillProficiencies: z.array(z.string()).optional(),
  backgroundToolProficiencies: z.array(z.string()).optional(),
  backgroundLanguages: z.number().optional(),
  backgroundEquipment: z.array(z.string()).optional(),
  alignment: z.string().optional(),
  appearance: z.string()
    .nonempty("Appearance description is required")
    .transform((val) => sanitizeText(val))
    .refine((val) => countWords(val) >= 20, {
      message: "Appearance description must be at least 20 words"
    })
    .refine((val) => countWords(val) <= 450, {
      message: "Appearance description must be 450 words or less"
    }),
  backstory: z.string()
    .nonempty("Backstory is required")
    .transform((val) => sanitizeText(val))
    .refine((val) => countWords(val) >= 200, {
      message: "Backstory must be at least 200 words"
    })
    .refine((val) => countWords(val) <= 750, {
      message: "Backstory must be 750 words or less"
    }),
  personalityTraits: z.string()
    .nonempty("Personality traits are required")
    .transform((val) => sanitizeText(val))
    .refine((val) => countWords(val) <= 250, {
      message: "Personality traits must be 250 words or less"
    }),
  ideals: z.string()
    .nonempty("Ideals are required")
    .transform((val) => sanitizeText(val))
    .refine((val) => countWords(val) <= 250, {
      message: "Ideals must be 250 words or less"
    }),
  bonds: z.string()
    .nonempty("Bonds are required")
    .transform((val) => sanitizeText(val))
    .refine((val) => countWords(val) <= 250, {
      message: "Bonds must be 250 words or less"
    }),
  flaws: z.string()
    .nonempty("Flaws are required")
    .transform((val) => sanitizeText(val))
    .refine((val) => countWords(val) <= 250, {
      message: "Flaws must be 250 words or less"
    }),

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
  tools: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  proficiencies: z.array(z.string()).optional(),
  weapons: z.array(z.string()).optional(),
  armor: z.string().optional(),
  shield: z.string().optional(),
  items: z.array(z.string()).optional(),
  wealth: z.object({
    platinum: z.number().min(0).optional(),
    gold: z.number().min(0).optional(),
    silver: z.number().min(0).optional(),
    bronze: z.number().min(0).optional(),
  }).optional(),
  equipment: z.array(z.any()).optional(),
  spells: z.array(z.string()).optional(),
  feats: z.array(z.string()).optional(),
  asiChoices: z.array(z.object({
    choice: z.enum(["single", "double"]),
    abilities: z.array(z.string())
  })).optional(),
  featASIChoices: z.record(z.string()).optional(),
  hp: z.number().optional(),
  xp: z.number().optional(),
  
  // Calculated stats
  calculatedStats: z.object({
    hp: z.number().optional(),
    ac: z.number().optional(),
    initiative: z.number().optional(),
    hpBreakdown: z.array(z.string()).optional(),
    acBreakdown: z.array(z.string()).optional(),
    initiativeBreakdown: z.array(z.string()).optional(),
  }).optional(),

  // Progression section
  levelProgression: z.array(z.object({
    level: z.number().optional(),
    featuresGained: z.string().optional(),
    spellsLearned: z.string().optional(),
    equipmentChanges: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
})
