export interface Feat {
  name: string;
  source: string;
  prereqs: string;
  benefits: string;
  asi?: string[]; // Ability Score Increases - array of ability scores that get +1
}

export const feats: Feat[] = [
  {
    name: "Actor",
    source: "Player's Handbook",
    prereqs: "Charisma 13",
    benefits: "Increase Charisma by 1 (max 20); advantage on Deception and Performance checks to impersonate; mimic speech or sounds",
    asi: ["charisma"]
  },
  {
    name: "Alert",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Cannot be surprised while conscious; +5 bonus to initiative; enemies never get advantage on attacks from being hidden",
    asi: []
  },
  {
    name: "Athlete",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Strength or Dexterity by 1; standing up from prone costs only 5 ft; climbing costs no extra movement; long jumps and high jumps with 5 ft running start",
    asi: ["strength", "dexterity"] // Player chooses one
  },
  {
    name: "Charger",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "If you Dash and then Attack, you can bonus-action attack or shove; if you moved ≥10 ft straight, you deal +5 damage or push target 10 ft",
    asi: []
  },
  {
    name: "Crossbow Expert",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Ignore the loading property of crossbows you use; no disadvantage on ranged attacks within 5 ft; if you attack with a one-handed weapon, bonus-action attack with hand crossbow",
    asi: []
  },
  {
    name: "Defensive Duelist",
    source: "Player's Handbook",
    prereqs: "Dexterity 13",
    benefits: "When wielding a finesse weapon and hit by a melee attack, use reaction to add proficiency bonus to AC against that attack",
    asi: []
  },
  {
    name: "Dual Wielder",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "You gain +1 bonus to AC if holding separate melee weapons in each hand; fight with two weapons even if they're not light; draw or stow two one-handed weapons at once",
    asi: []
  },
  {
    name: "Dungeon Delver",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Advantage on Perception/Investigation to notice secret doors; advantage on saving throws against traps; resistance to trap damage; no speed penalty to passive Perception",
    asi: []
  },
  {
    name: "Durable",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Constitution by 1; when you roll a Hit Die, you regain at least 2 HP (twice your Con modifier)",
    asi: ["constitution"]
  },
  {
    name: "Elemental Adept",
    source: "Player's Handbook",
    prereqs: "Spellcasting ability",
    benefits: "Choose acid, cold, fire, lightning, or thunder. Spells of that type ignore resistance; on damage rolls, treat any 1 as 2",
    asi: []
  },
  {
    name: "Grappler",
    source: "Player's Handbook",
    prereqs: "Strength 13",
    benefits: "Advantage on attack rolls against a creature you grapple; as an action, you can pin a grappled creature, restraining both on success",
    asi: []
  },
  {
    name: "Great Weapon Master",
    source: "Player's Handbook",
    prereqs: "Strength 13",
    benefits: "On a crit or kill with a melee weapon, you may bonus-action attack; before attacking with a heavy weapon, take -5 to hit for +10 damage if you hit",
    asi: []
  },
  {
    name: "Healer",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Using a healer's kit: stabilize a dying creature and grant 1 HP; as action, expend kit to restore 1d6+4 HP plus additional HP based on target's Hit Dice",
    asi: []
  },
  {
    name: "Heavily Armored",
    source: "Player's Handbook",
    prereqs: "Medium armor proficiency",
    benefits: "Increase Strength by 1; gain proficiency with heavy armor",
    asi: ["strength"]
  },
  {
    name: "Heavy Armor Master",
    source: "Player's Handbook",
    prereqs: "Heavy armor proficiency",
    benefits: "Increase Strength by 1; while wearing heavy armor, reduce bludgeoning/piercing/slashing damage from nonmagical attacks by 3",
    asi: ["strength"]
  },
  {
    name: "Inspiring Leader",
    source: "Player's Handbook",
    prereqs: "Charisma 13",
    benefits: "Spend 10 minutes inspiring up to six creatures (including yourself). Each gains temporary HP equal to your level + Charisma modifier",
    asi: []
  },
  {
    name: "Keen Mind",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Intelligence by 1; always know which way is north and how many hours till next sunrise/sunset; remember anything seen or heard in the past month",
    asi: ["intelligence"]
  },
  {
    name: "Lightly Armored",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Strength or Dexterity by 1; gain proficiency with light armor",
    asi: ["strength", "dexterity"] // Player chooses one
  },
  {
    name: "Linguist",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Intelligence by 1; learn three languages; create ciphers others cannot decode without your key",
    asi: ["intelligence"]
  },
  {
    name: "Lightly Armored",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Strength or Dexterity by 1 (max 20); you gain proficiency with light armor:contentReference[oaicite:0]{index=0}",
    asi: ["strength", "dexterity"]
  },
  {
    name: "Moderately Armored",
    source: "Player's Handbook",
    prereqs: "Light armor proficiency",
    benefits: "Increase Strength or Dexterity by 1 (max 20); you gain proficiency with medium armor and shields:contentReference[oaicite:1]{index=1}",
    asi: ["strength", "dexterity"]
  },
  {
    name: "Medium Armor Master",
    source: "Player's Handbook",
    prereqs: "Medium armor proficiency",
    benefits: "Increase Strength or Dexterity by 1 (max 20); wearing medium armor doesn’t impose disadvantage on Dexterity (Stealth) checks; add +3 to AC (instead of +2) when wearing medium armor if Dexterity is 16 or higher:contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}",
    asi: ["strength", "dexterity"]
  },
  {
    name: "Mage Slayer",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "When a creature within 5 feet casts a spell, you can use your reaction to make a melee attack against it; a creature you damage while it’s concentrating on a spell has disadvantage on its concentration saving throw; you have advantage on saving throws against spells cast by creatures within 5 feet:contentReference[oaicite:4]{index=4}",
    asi: []
  },
  {
    name: "Martial Adept",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "You learn two maneuvers of your choice from the Battle Master archetype list; you gain one superiority die (d6) which you can expend to fuel your maneuvers (replenished on a short or long rest):contentReference[oaicite:5]{index=5}",
    asi: []
  },
  {
    name: "Mounted Combatant",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Increase Strength, Dexterity, or Wisdom by 1 (max 20); while mounted, you have advantage on melee attack rolls against any unmounted creature one size smaller than your mount; if your mount succeeds on a Dexterity saving throw for half damage, it instead takes no damage (half on failure); you can force an attack that hits your mount to hit you instead:contentReference[oaicite:6]{index=6}:contentReference[oaicite:7]{index=7}",
    asi: ["strength", "dexterity", "wisdom"]
  },
  {
    name: "Savage Attacker",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Once per turn when you hit a target with a melee weapon, you can reroll the weapon’s damage dice and use either total:contentReference[oaicite:8]{index=8}",
    asi: []
  },
  {
    name: "Spell Sniper",
    source: "Player's Handbook",
    prereqs: "Ability to cast at least one spell",
    benefits: "When you cast a spell that requires an attack roll, the spell’s range is doubled; your ranged spell attacks ignore half cover and three-quarters cover; you learn one attack-roll cantrip of your choice from the bard, cleric, druid, sorcerer, warlock, or wizard list (choose the spellcasting ability accordingly):contentReference[oaicite:9]{index=9}",
    asi: []
  },
  {
    name: "Magic Initiate",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "You learn two cantrips of your choice from one class’s spell list (bard, cleric, druid, sorcerer, warlock, or wizard); you learn one 1st-level spell from that list (which you can cast once per long rest without a slot, and can also cast using spell slots); your spellcasting ability for these spells depends on the chosen class; you can replace one of these spells when you gain a level; feat can be taken multiple times (each from a different class):contentReference[oaicite:10]{index=10}",
    asi: []
  },
  {
    name: "Observant",
    source: "Player's Handbook",
    prereqs: "Intelligence or Wisdom 13",
    benefits: "Increase Intelligence or Wisdom by 1 (max 20); if you can see a creature’s mouth while it speaks a language you know, you can interpret what it’s saying by reading its lips; you gain a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores:contentReference[oaicite:11]{index=11}",
    asi: ["intelligence", "wisdom"]
  },
  {
    name: "Resilient",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "Choose one ability score in which you lack saving throw proficiency; increase that score by 1 (max 20) and gain proficiency in saving throws for that ability:contentReference[oaicite:12]{index=12}",
    asi: ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
  },
  {
    name: "Skilled",
    source: "Player's Handbook",
    prereqs: "None",
    benefits: "You gain proficiency in any three skills or tools of your choice:contentReference[oaicite:13]{index=13}",
    asi: []
  }
  
];

// Function to check if a character meets feat prerequisites
export function meetsFeatPrerequisites(feat: Feat, abilityScores: Record<string, number>, characterClasses: any[], proficiencies: string[]): boolean {
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
    const hasSpellcasting = characterClasses.some(cls => {
      if (!cls.class) return false;
      const classData = classes.find(c => c.id === cls.class);
      return classData?.spellcasting === true;
    });
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

// Function to get ASI from selected feats with specific choices
export function getFeatASIs(selectedFeatNames: string[], featASIChoices?: Record<string, string>): Record<string, number> {
  const asiBonuses: Record<string, number> = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0
  };
  
  selectedFeatNames.forEach(featName => {
    const feat = feats.find(f => f.name === featName);
    if (feat && feat.asi) {
      if (feat.asi.length === 1) {
        // Single ASI option - always apply
        const ability = feat.asi[0];
        if (ability in asiBonuses) {
          asiBonuses[ability]++;
        }
      } else if (feat.asi.length > 1 && featASIChoices) {
        // Multiple ASI options - use the chosen one
        const chosenAbility = featASIChoices[featName];
        if (chosenAbility && chosenAbility in asiBonuses) {
          asiBonuses[chosenAbility]++;
        }
      }
    }
  });
  
  return asiBonuses;
}

// Function to get feats that provide ASI for a specific ability
export function getFeatsWithASI(ability: string): Feat[] {
  return feats.filter(feat => feat.asi && feat.asi.includes(ability));
}

// Function to check if a feat provides ASI
export function hasASI(feat: Feat): boolean {
  return !!(feat.asi && feat.asi.length > 0);
}

// Function to get total ASI from all selected feats
export function getTotalFeatASIs(selectedFeatNames: string[]): number {
  let total = 0;
  selectedFeatNames.forEach(featName => {
    const feat = feats.find(f => f.name === featName);
    if (feat && feat.asi) {
      total += feat.asi.length;
    }
  });
  return total;
} 