import { z } from "zod"
import { sanitizeCharacterName, sanitizeText } from "@/lib/utils/input-validation"

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
    .optional(),
  backstory: z.string()
    .transform((val) => val ? sanitizeText(val) : val)
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
  class: z.string().optional(),
  subclass: z.string().optional(),
  race: z.string().optional(),
  subrace: z.string().optional(),
  level: z.number().optional(),
  abilityScoreMethod: z.string().optional(),
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
