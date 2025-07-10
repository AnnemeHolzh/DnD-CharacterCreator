export interface Feat {
  name: string;
  source: string;
  prereqs: string;
  benefits: string;
}

export const feats: Feat[] = [
  {
    name: "Actor",
    source: "Player's Handbook",
    prereqs: "Charisma 13",
    benefits: "Increase Charisma by 1 (max 20); advantage on Deception and Performance checks to impersonate; mimic speech or sounds"
  },
  {
    name: "Alert",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Cannot be surprised while conscious; +5 bonus to initiative; enemies never get advantage on attacks from being hidden"
  },
  {
    name: "Athlete",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Strength or Dexterity by 1; standing up from prone costs only 5 ft; climbing costs no extra movement; long jumps and high jumps with 5 ft running start"
  },
  {
    name: "Charger",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "If you Dash and then Attack, you can bonus-action attack or shove; if you moved ≥10 ft straight, you deal +5 damage or push target 10 ft"
  },
  {
    name: "Crossbow Expert",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Ignore the loading property of crossbows you use; no disadvantage on ranged attacks within 5 ft; if you attack with a one-handed weapon, bonus-action attack with hand crossbow"
  },
  {
    name: "Defensive Duelist",
    source: "Player's Handbook",
    prereqs: "Dexterity 13",
    benefits: "When wielding a finesse weapon and hit by a melee attack, use reaction to add proficiency bonus to AC against that attack"
  },
  {
    name: "Dual Wielder",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "You gain +1 bonus to AC if holding separate melee weapons in each hand; fight with two weapons even if they're not light; draw or stow two one-handed weapons at once"
  },
  {
    name: "Dungeon Delver",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Advantage on Perception/Investigation to notice secret doors; advantage on saving throws against traps; resistance to trap damage; no speed penalty to passive Perception"
  },
  {
    name: "Durable",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Constitution by 1; when you roll a Hit Die, you regain at least 2 HP (twice your Con modifier)"
  },
  {
    name: "Elemental Adept",
    source: "Player's Handbook",
    prereqs: "Spellcasting ability",
    benefits: "Choose acid, cold, fire, lightning, or thunder. Spells of that type ignore resistance; on damage rolls, treat any 1 as 2"
  },
  {
    name: "Grappler",
    source: "Player's Handbook",
    prereqs: "Strength 13",
    benefits: "Advantage on attack rolls against a creature you grapple; as an action, you can pin a grappled creature, restraining both on success"
  },
  {
    name: "Great Weapon Master",
    source: "Player's Handbook",
    prereqs: "Strength 13",
    benefits: "On a crit or kill with a melee weapon, you may bonus-action attack; before attacking with a heavy weapon, take -5 to hit for +10 damage if you hit"
  },
  {
    name: "Healer",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Using a healer's kit: stabilize a dying creature and grant 1 HP; as action, expend kit to restore 1d6+4 HP plus additional HP based on target's Hit Dice"
  },
  {
    name: "Heavily Armored",
    source: "Player's Handbook",
    prereqs: "Medium armor proficiency",
    benefits: "Increase Strength by 1; gain proficiency with heavy armor"
  },
  {
    name: "Heavy Armor Master",
    source: "Player's Handbook",
    prereqs: "Heavy armor proficiency",
    benefits: "Increase Strength by 1; while wearing heavy armor, reduce bludgeoning/piercing/slashing damage from nonmagical attacks by 3"
  },
  {
    name: "Inspiring Leader",
    source: "Player's Handbook",
    prereqs: "Charisma 13",
    benefits: "Spend 10 minutes inspiring up to six creatures (including yourself). Each gains temporary HP equal to your level + Charisma modifier"
  },
  {
    name: "Keen Mind",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Intelligence by 1; always know which way is north and how many hours till next sunrise/sunset; remember anything seen or heard in the past month"
  },
  {
    name: "Lightly Armored",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Strength or Dexterity by 1; gain proficiency with light armor"
  },
  {
    name: "Linguist",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Intelligence by 1; learn three languages; create ciphers others cannot decode without your key"
  }
];

// Function to check if a character meets feat prerequisites
export function meetsFeatPrerequisites(feat: Feat, abilityScores: Record<string, number>, classes: any[], proficiencies: string[]): boolean {
  const prereqs = feat.prereqs.toLowerCase();
  
  if (prereqs === "none") return true;
  
  // Check ability score prerequisites
  if (prereqs.includes("charisma 13")) {
    if (!abilityScores.charisma || abilityScores.charisma < 13) return false;
  }
  if (prereqs.includes("strength 13")) {
    if (!abilityScores.strength || abilityScores.strength < 13) return false;
  }
  if (prereqs.includes("dexterity 13")) {
    if (!abilityScores.dexterity || abilityScores.dexterity < 13) return false;
  }
  
  // Check spellcasting ability prerequisite
  if (prereqs.includes("spellcasting ability")) {
    const hasSpellcasting = classes.some(cls => cls.class && classes.find(c => c.id === cls.class)?.spellcasting);
    if (!hasSpellcasting) return false;
  }
  
  // Check armor proficiency prerequisites
  if (prereqs.includes("medium armor proficiency")) {
    if (!proficiencies.some(p => p.toLowerCase().includes("medium armor"))) return false;
  }
  if (prereqs.includes("heavy armor proficiency")) {
    if (!proficiencies.some(p => p.toLowerCase().includes("heavy armor"))) return false;
  }
  
  return true;
}

// Function to calculate available feats based on character level and class
export function getAvailableFeats(characterLevel: number, characterClasses: any[], abilityScores: Record<string, number>, proficiencies: string[]): number {
  let totalFeats = 0;
  
  // Calculate feats from class levels
  characterClasses.forEach(cls => {
    if (cls.class && cls.level) {
      const classData = classes.find((c: any) => c.id === cls.class);
      if (classData && classData.FeatLevel) {
        totalFeats += classData.FeatLevel.filter((level: number) => level <= cls.level).length;
      }
    }
  });
  
  return totalFeats;
}

import { classes } from './classes';

// Function to get feat levels for a specific class
export function getFeatLevelsForClass(className: string): number[] {
  const classData = classes.find((c: any) => c.id === className);
  return classData?.FeatLevel || [];
}

// Function to get all available feats that meet prerequisites
export function getEligibleFeats(abilityScores: Record<string, number>, characterClasses: any[], proficiencies: string[]): Feat[] {
  return feats.filter(feat => meetsFeatPrerequisites(feat, abilityScores, characterClasses, proficiencies));
} 