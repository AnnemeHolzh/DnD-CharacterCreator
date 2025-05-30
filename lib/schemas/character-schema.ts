import { z } from "zod"

export const CharacterSchema = z.object({
  // Narrative section
  name: z.string().optional(),
  background: z.string().optional(),
  backgroundSkillProficiencies: z.array(z.string()).optional(),
  backgroundToolProficiencies: z.array(z.string()).optional(),
  backgroundLanguages: z.number().optional(),
  backgroundEquipment: z.array(z.string()).optional(),
  alignment: z.string().optional(),
  appearance: z.string().optional(),
  backstory: z.string().optional(),
  personalityTraits: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),

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
