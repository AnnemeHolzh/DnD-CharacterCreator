export const classes = [
  {
    id: "barbarian",
    name: "Barbarian",
    hitDie: 12,
    primaryAbility: "strength",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["strength", "constitution"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["simple", "martial"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: ["animal-handling", "athletics", "intimidation", "nature", "perception", "survival"],
    spellcasting: false,
    subclasses: [
      { id: "berserker", name: "Path of the Berserker" },
      { id: "totem-warrior", name: "Path of the Totem Warrior" },
    ],
  },
  {
    id: "bard",
    name: "Bard",
    hitDie: 8,
    primaryAbility: "charisma",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["dexterity", "charisma"],
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple", "hand-crossbow", "longsword", "rapier", "shortsword"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 3,
    skillProficiencies: [
      "acrobatics",
      "animal-handling",
      "arcana",
      "athletics",
      "deception",
      "history",
      "insight",
      "intimidation",
      "investigation",
      "medicine",
      "nature",
      "perception",
      "performance",
      "persuasion",
      "religion",
      "sleight-of-hand",
      "stealth",
      "survival",
    ],
    spellcasting: true,
    subclasses: [
      { id: "lore", name: "College of Lore" },
      { id: "valor", name: "College of Valor" },
    ],
  },
  {
    id: "cleric",
    name: "Cleric",
    hitDie: 8,
    primaryAbility: "wisdom",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["wisdom", "charisma"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["simple"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: ["history", "insight", "medicine", "persuasion", "religion"],
    spellcasting: true,
    subclasses: [
      { id: "knowledge", name: "Knowledge Domain" },
      { id: "life", name: "Life Domain" },
      { id: "light", name: "Light Domain" },
      { id: "nature", name: "Nature Domain" },
      { id: "tempest", name: "Tempest Domain" },
      { id: "trickery", name: "Trickery Domain" },
      { id: "war", name: "War Domain" },
    ],
  },
  {
    id: "druid",
    name: "Druid",
    hitDie: 8,
    primaryAbility: "wisdom",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["intelligence", "wisdom"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: [
      "club",
      "dagger",
      "dart",
      "javelin",
      "mace",
      "quarterstaff",
      "scimitar",
      "sickle",
      "sling",
      "spear",
    ],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: [
      "arcana",
      "animal-handling",
      "insight",
      "medicine",
      "nature",
      "perception",
      "religion",
      "survival",
    ],
    spellcasting: true,
    subclasses: [
      { id: "land", name: "Circle of the Land" },
      { id: "moon", name: "Circle of the Moon" },
    ],
  },
  {
    id: "fighter",
    name: "Fighter",
    hitDie: 10,
    primaryAbility: "strength",
    FeatLevel: [4, 6, 8, 12, 14, 16, 19],
    savingThrows: ["strength", "constitution"],
    armorProficiencies: ["light", "medium", "heavy", "shields"],
    weaponProficiencies: ["simple", "martial"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: [
      "acrobatics",
      "animal-handling",
      "athletics",
      "history",
      "insight",
      "intimidation",
      "perception",
      "survival",
    ],
    spellcasting: false,
    subclasses: [
      { id: "battle-master", name: "Battle Master" },
      { id: "champion", name: "Champion" },
      { id: "eldritch-knight", name: "Eldritch Knight" },
    ],
  },
  {
    id: "monk",
    name: "Monk",
    hitDie: 8,
    primaryAbility: "dexterity",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["strength", "dexterity"],
    armorProficiencies: [],
    weaponProficiencies: ["simple", "shortsword"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"],
    spellcasting: false,
    subclasses: [
      { id: "four-elements", name: "Way of the Four Elements" },
      { id: "open-hand", name: "Way of the Open Hand" },
      { id: "shadow", name: "Way of Shadow" },
    ],
  },
  {
    id: "paladin",
    name: "Paladin",
    hitDie: 10,
    primaryAbility: "strength",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["wisdom", "charisma"],
    armorProficiencies: ["light", "medium", "heavy", "shields"],
    weaponProficiencies: ["simple", "martial"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"],
    spellcasting: true,
    subclasses: [
      { id: "devotion", name: "Oath of Devotion" },
      { id: "ancients", name: "Oath of the Ancients" },
      { id: "vengeance", name: "Oath of Vengeance" },
    ],
  },
  {
    id: "ranger",
    name: "Ranger",
    hitDie: 10,
    primaryAbility: "dexterity",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["strength", "dexterity"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["simple", "martial"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 3,
    skillProficiencies: [
      "animal-handling",
      "athletics",
      "insight",
      "investigation",
      "nature",
      "perception",
      "stealth",
      "survival",
    ],
    spellcasting: true,
    subclasses: [
      { id: "beast-master", name: "Beast Master" },
      { id: "hunter", name: "Hunter" },
    ],
  },
  {
    id: "rogue",
    name: "Rogue",
    hitDie: 8,
    primaryAbility: "dexterity",
    FeatLevel: [4, 8, 10, 12, 16, 19],
    savingThrows: ["dexterity", "intelligence"],
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple", "hand-crossbow", "longsword", "rapier", "shortsword"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 4,
    skillProficiencies: [
      "acrobatics",
      "athletics",
      "deception",
      "insight",
      "intimidation",
      "investigation",
      "perception",
      "performance",
      "persuasion",
      "sleight-of-hand",
      "stealth",
    ],
    spellcasting: false,
    subclasses: [
      { id: "arcane-trickster", name: "Arcane Trickster" },
      { id: "assassin", name: "Assassin" },
      { id: "thief", name: "Thief" },
    ],
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    hitDie: 6,
    primaryAbility: "charisma",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["constitution", "charisma"],
    armorProficiencies: [],
    weaponProficiencies: ["dagger", "dart", "sling", "quarterstaff", "light-crossbow"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"],
    spellcasting: true,
    subclasses: [
      { id: "draconic", name: "Draconic Bloodline" },
      { id: "wild-magic", name: "Wild Magic" },
    ],
  },
  {
    id: "warlock",
    name: "Warlock",
    hitDie: 8,
    primaryAbility: "charisma",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["wisdom", "charisma"],
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"],
    spellcasting: true,
    subclasses: [
      { id: "archfey", name: "The Archfey" },
      { id: "fiend", name: "The Fiend" },
      { id: "great-old-one", name: "The Great Old One" },
    ],
  },
  {
    id: "wizard",
    name: "Wizard",
    hitDie: 6,
    primaryAbility: "intelligence",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["intelligence", "wisdom"],
    armorProficiencies: [],
    weaponProficiencies: ["dagger", "dart", "sling", "quarterstaff", "light-crossbow"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: ["arcana", "history", "insight", "investigation", "medicine", "religion"],
    spellcasting: true,
    subclasses: [
      { id: "abjuration", name: "School of Abjuration" },
      { id: "conjuration", name: "School of Conjuration" },
      { id: "divination", name: "School of Divination" },
      { id: "enchantment", name: "School of Enchantment" },
      { id: "evocation", name: "School of Evocation" },
      { id: "illusion", name: "School of Illusion" },
      { id: "necromancy", name: "School of Necromancy" },
      { id: "transmutation", name: "School of Transmutation" },
    ],
  },
  {
    id: "artificer",
    name: "Artificer",
    hitDie: 8,
    primaryAbility: "intelligence",
    FeatLevel: [4, 8, 12, 16, 19],
    savingThrows: ["constitution", "intelligence"],
    armorProficiencies: ["light", "medium", "shield"],
    weaponProficiencies: ["simple"],
    toolProficiencies: ["thieves’ tools", "tinker’s tools", "artisan’s tools"],
    skillChoices: 2,
    skillProficiencies: [
      "arcana",
      "history",
      "investigation",
      "medicine",
      "nature",
      "perception",
      "sleight-of-hand"
    ],
    spellcasting: true,
    subclasses: [
      { id: "alchemist", name: "Alchemist" },
      { id: "artillerist", name: "Artillerist" },
      { id: "battlesmith", name: "Battle Smith" },
      { id: "armorer", name: "Armorer" }
    ],
  },
]

// Parse DnDClassesMaster.md data for subclass information
export interface SubclassData {
  subclass_name: string;
  class: string;
  sourcebook: string;
  class_features: string[];
  level_unlocks: number[];
  cited_source: string;
}

// Parse the DnDClassesMaster.md data
const dndClassesData: SubclassData[] = [
  {
    "subclass_name": "Path of the Berserker",
    "class": "Barbarian",
    "sourcebook": "PHB",
    "class_features": [
      "Frenzy (3rd level): While raging, you can make one melee weapon attack as a bonus action on each of your turns. (ends rage causes exhaustion)",
      "Mindless Rage (6th level): You cannot be charmed or frightened while raging",
      "Intimidating Presence (10th level): Use an action to frighten a creature within 30 ft (Wis saving throw to resist)",
      "Retaliation (14th level): When hit by a creature within 5 ft, you can use your reaction to make a melee attack against it"
    ],
    "level_unlocks": [3,6,10,14],
    "cited_source": "PHB p.48-49"
  },
  {
    "subclass_name": "Path of the Wild Heart",
    "class": "Barbarian",
    "sourcebook": "PHB",
    "class_features": [
      "Totemic Attunement (3rd level): Choose a spirit (Bear, Eagle, Wolf) and gain its benefits (e.g., resistance to all damage but psychic for Bear)",
      "Unbroken (6th level): You are immune to dropping to 0 HP once per long rest while raging",
      "Aspect of the Beast (10th level): Gain special feature of chosen spirit (e.g., + flight speed for Eagle)",
      "Totemic Attunement (14th level): Additional benefit from chosen spirit (e.g., flight or swim speed equal to walking speed)"
    ],
    "level_unlocks": [3,6,10,14],
    "cited_source": "PHB p.49-50"
  },
  {
    "subclass_name": "College of Lore",
    "class": "Bard",
    "sourcebook": "PHB",
    "class_features": [
      "Bonus Proficiencies (3rd): Gain proficiency with three skills of your choice",
      "Cutting Words (3rd): Use your reaction to subtract your Bardic Inspiration die from an enemy's attack roll, ability check, or damage roll",
      "Additional Magical Secrets (6th): Learn two spells of your choice from any class",
      "Peerless Skill (14th): Add a Bardic Inspiration die to your own ability check"
    ],
    "level_unlocks": [3,6,14],
    "cited_source": "PHB p.51-52"
  },
  {
    "subclass_name": "College of Valor",
    "class": "Bard",
    "sourcebook": "PHB",
    "class_features": [
      "Bonus Proficiencies (3rd): Gain proficiency with medium armor, shields, and martial weapons",
      "Combat Inspiration (3rd): When you grant Bardic Inspiration, you or the target can use it to add to damage roll or AC instead of ability checks",
      "Extra Attack (6th): You can attack twice, instead of once, when taking the Attack action",
      "Battle Magic (14th): When you use your action to cast a bard spell, you can make one weapon attack as a bonus action"
    ],
    "level_unlocks": [3,3,6,14],
    "cited_source": "PHB p.53"
  },
  {
    "subclass_name": "Knowledge Domain",
    "class": "Cleric",
    "sourcebook": "PHB",
    "class_features": [
      "Blessings of Knowledge (1st): Gain proficiency with two skills and double proficiency on those skills",
      "Channel Divinity: Knowledge of the Ages (2nd): Temporarily gain proficiency with any skill or tool",
      "Channel Divinity: Read Thoughts (2nd): Read surface thoughts of a creature",
      "Potent Spellcasting (8th): Add Wisdom modifier to cleric cantrip damage",
      "Visions of the Past (17th): Briefly recall legends of the past, learning a secret knowledge"
    ],
    "level_unlocks": [1,2,2,8,17],
    "cited_source": "PHB p.59"
  },
  {
    "subclass_name": "Life Domain",
    "class": "Cleric",
    "sourcebook": "PHB",
    "class_features": [
      "Bonus Proficiency (1st): Gain proficiency with heavy armor",
      "Disciple of Life (1st): Healing spells restore additional hit points",
      "Channel Divinity: Preserve Life (2nd): Distribute healing equal to five times cleric level among creatures",
      "Blessed Healer (6th): When you cast a healing spell on others, you also heal yourself",
      "Divine Strike (8th): Once per turn, weapon hit deals extra radiant damage (1d8, 2d8 at 14th)",
      "Supreme Healing (17th): Maximizes healing dice of spells you cast"
    ],
    "level_unlocks": [1,1,2,6,8,17],
    "cited_source": "PHB p.60"
  },
  {
    "subclass_name": "Circle of the Land (Various)",
    "class": "Druid",
    "sourcebook": "PHB",
    "class_features": [
      "Bonus Cantrip (2nd): Learn one druid cantrip",
      "Natural Recovery (2nd): Regain expended spell slots on short rest (max level depends on land)",
      "Land's Stride (6th): Moving through nonmagical difficult terrain costs no extra movement",
      "Nature's Ward (10th): Immune to poison and disease, advantage on saving throws against poison",
      "Nature's Sanctuary (14th): Advantage on saving throws against attacks from beasts or fey",
      "Circle Spells: Gain domain-specific spells at 3rd, 5th, 7th, 9th levels"
    ],
    "level_unlocks": [2,2,6,10,14],
    "cited_source": "PHB p.68"
  },
  {
    "subclass_name": "Circle of the Moon",
    "class": "Druid",
    "sourcebook": "PHB",
    "class_features": [
      "Combat Wild Shape (2nd): Bonus action Wild Shape; regain small HP in beast form",
      "Circle Forms (2nd): Wild Shape into more powerful beasts (CR 1) and flying/swimming beasts",
      "Primal Strike (6th): Attacks in beast form count as magical",
      "Elemental Wild Shape (10th): Wild Shape into air, earth, fire, water elementals",
      "Thousand Forms (14th): Cast Alter Self at will"
    ],
    "level_unlocks": [2,2,6,10,14],
    "cited_source": "PHB p.68"
  },
  {
    "subclass_name": "Champion",
    "class": "Fighter",
    "sourcebook": "PHB",
    "class_features": [
      "Improved Critical (3rd): Score a critical hit on a roll of 19–20",
      "Remarkable Athlete (7th): Add half proficiency bonus to certain checks, jump distance increased",
      "Additional Fighting Style (10th, TCoE): Gain a second Fighting Style",
      "Superior Critical (15th): Score critical hits on 18–20",
      "Survivor (18th): Regain HP in each round if below half HP"
    ],
    "level_unlocks": [3,7,10,15,18],
    "cited_source": "PHB p.72"
  },
  {
    "subclass_name": "Battle Master",
    "class": "Fighter",
    "sourcebook": "PHB",
    "class_features": [
      "Combat Superiority (3rd): Learn 3 maneuvers and gain superiority dice to expend on attacks",
      "Student of War (3rd): Gain proficiency with one artisan's tools",
      "Know Your Enemy (7th): Learn basic details about an opponent's capabilities by observing",
      "Improved Combat Superiority (10th, TCoE): Sup die become d10",
      "Relentless (15th): Regain one superiority die on initiative roll if none remain"
    ],
    "level_unlocks": [3,3,7,10,15],
    "cited_source": "PHB p.73"
  },
  {
    "subclass_name": "Way of the Open Hand",
    "class": "Monk",
    "sourcebook": "PHB",
    "class_features": [
      "Open Hand Technique (3rd): Enhance Flurry of Blows – target falls prone, or unable to take reactions, or can't take extra action",
      "Wholeness of Body (6th): Heal self with ki points",
      "Tranquility (11th, DMG): Gain sanctuary on you when you roll initiative",
      "Quivering Palm (17th): Imprint vibrations on a creature that can be lethal after some time"
    ],
    "level_unlocks": [3,6,11,17],
    "cited_source": "PHB p.78"
  },
  {
    "subclass_name": "Oath of Devotion",
    "class": "Paladin",
    "sourcebook": "PHB",
    "class_features": [
      "Sacred Oath (3rd): Gains Channel Divinity options (Sacred Weapon, Turn the Unholy)",
      "Aura of Devotion (7th): Allies within 10 ft cannot be charmed",
      "Purity of Spirit (15th): Cannot be frightened while conscious",
      "Holy Nimbus (20th): Aura of light deals radiant damage to enemies"
    ],
    "level_unlocks": [3,7,15,20],
    "cited_source": "PHB p.84"
  },
  {
    "subclass_name": "Hunter",
    "class": "Ranger",
    "sourcebook": "PHB",
    "class_features": [
      "Hunter's Prey (3rd): Choose one of Colossus Slayer, Giant Killer, or Horde Breaker",
      "Defensive Tactics (7th): Choose one of Escape the Horde, Multiattack Defense, Steel Will",
      "Multiattack (11th): Choose one of Volley or Whirlwind Attack",
      "Superior Hunter's Defense (15th): Choose one of Evasion, Stand Against the Tide, Uncanny Dodge"
    ],
    "level_unlocks": [3,7,11,15],
    "cited_source": "PHB p.91"
  },
  {
    "subclass_name": "Beast Master",
    "class": "Ranger",
    "sourcebook": "PHB",
    "class_features": [
      "Ranger's Companion (3rd): Gain a beast companion that acts independently but obeys you",
      "Exceptional Training (7th): Companion takes Attack action, and gains extra attack on its turn",
      "Bestial Fury (11th): Companion can make two attacks when you command it to attack",
      "Share Spells (15th): When you cast a spell targeting yourself, it also affects your companion"
    ],
    "level_unlocks": [3,7,11,15],
    "cited_source": "PHB p.92"
  },
  {
    "subclass_name": "Thief",
    "class": "Rogue",
    "sourcebook": "PHB",
    "class_features": [
      "Fast Hands (3rd): Use Fast Hands with Thieves' Tools for disarming/trapping as bonus action",
      "Second-Story Work (3rd): Climbing no extra movement, jump distance +1d6",
      "Supreme Sneak (9th): Advantage on Stealth if moving slowly",
      "Use Magic Device (13th): Ignore class spell prerequisites",
      "Thief's Reflexes (17th): Two turns in first round of combat"
    ],
    "level_unlocks": [3,3,9,13,17],
    "cited_source": "PHB p.98"
  },
  {
    "subclass_name": "Assassin",
    "class": "Rogue",
    "sourcebook": "PHB",
    "class_features": [
      "Bonus Proficiencies (3rd): Disguise Kit, Poisoner's Kit",
      "Assassinate (3rd): Advantage on attack rolls against surprised enemies; auto-crit on hit",
      "Infiltration Expertise (9th): Create disguise and alter background to infiltrate",
      "Impostor (13th): Create a short-lived identity; mimic speech and behavior",
      "Death Strike (17th): On surprised or readied foe hit, double damage"
    ],
    "level_unlocks": [3,3,9,13,17],
    "cited_source": "PHB p.97"
  },
  {
    "subclass_name": "Draconic Bloodline",
    "class": "Sorcerer",
    "sourcebook": "PHB",
    "class_features": [
      "Draconic Ancestry (1st): Choose a dragon type; add that damage type to certain spells",
      "Draconic Resilience (1st): +1 HP per sorcerer level and natural armor equal to 13 + Dex",
      "Elemental Affinity (6th): Add Charisma mod to damage of spells matching your draconic type",
      "Dragon Wings (14th): Sprout dragon wings and fly at 60 ft",
      "Draconic Presence (18th): Spend 5 sorcery points to frighten or charm nearby creatures"
    ],
    "level_unlocks": [1,1,6,14,18],
    "cited_source": "PHB p.102"
  },
  {
    "subclass_name": "Wild Magic",
    "class": "Sorcerer",
    "sourcebook": "PHB",
    "class_features": [
      "Wild Magic Surge (1st): DM may roll for random magical effect when you cast a sorcerer spell",
      "Tides of Chaos (1st): Once per long rest, gain advantage on one attack or saving throw; use triggers surge",
      "Bend Luck (6th): Spend 2 sorcery points to add or subtract 1d4 to someone else's roll",
      "Controlled Chaos (14th): Reroll a Wild Magic Surge roll once",
      "Spell Bombardment (18th): When you roll maximum on a spell damage die, deal damage to another creature"
    ],
    "level_unlocks": [1,1,6,14,18],
    "cited_source": "PHB p.103"
  },
  {
    "subclass_name": "The Archfey",
    "class": "Warlock",
    "sourcebook": "PHB",
    "class_features": [
      "Fey Presence (1st): As action, cause creatures in area to become charmed or frightened",
      "Misty Escape (6th): Become invisible and teleport when damaged",
      "Beguiling Defenses (10th): Immune to being charmed, can reflect charm to attacker",
      "Dark Delirium (14th): Create a twisted dream for a creature to control them"
    ],
    "level_unlocks": [1,6,10,14],
    "cited_source": "PHB p.108"
  },
  {
    "subclass_name": "The Fiend",
    "class": "Warlock",
    "sourcebook": "PHB",
    "class_features": [
      "Dark One's Blessing (1st): Gain temporary HP equal to Cha mod + warlock level when you reduce a creature to 0 HP",
      "Dark One's Own Luck (6th): Add a d10 to an ability check or saving throw once per rest",
      "Fiendish Resilience (10th): Select damage type to resist each short rest",
      "Hurl Through Hell (14th): When you damage, send target briefly through hell for extra psychic damage"
    ],
    "level_unlocks": [1,6,10,14],
    "cited_source": "PHB p.108"
  },
  {
    "subclass_name": "Evocation School",
    "class": "Wizard",
    "sourcebook": "PHB",
    "class_features": [
      "Evocation Savant (2nd): Halve time and cost for copying evocation spells",
      "Sculpt Spells (2nd): Exclude allies from area of your evocation spells",
      "Potent Cantrip (6th): Add INT mod to half damage on a successful save vs your damaging cantrips",
      "Empowered Evocation (10th): Add INT mod to one damage die of evocation spell",
      "Overchannel (14th): Once per rest, maximize damage dice of a spell"
    ],
    "level_unlocks": [2,2,6,10,14],
    "cited_source": "PHB p.116"
  },
  {
    "subclass_name": "Illusion School",
    "class": "Wizard",
    "sourcebook": "PHB",
    "class_features": [
      "Illusion Savant (2nd): Halve time and cost for copying illusion spells",
      "Improved Minor Illusion (2nd): Create both a sound and an image with one use of Minor Illusion cantrip",
      "Malleable Illusions (6th): Change an illusion creature or object creates",
      "Illusory Self (10th): Impose disadvantage on attack targeting you by creating an illusory double",
      "Illusory Reality (14th): Make one object of an illusion real for 1 minute"
    ],
    "level_unlocks": [2,2,6,10,14],
    "cited_source": "PHB p.117"
  },
  {
    "subclass_name": "Alchemist",
    "class": "Artificer",
    "sourcebook": "TCoE / ERftLW",
    "class_features": [
      "Alchemist Spells (3rd): gain bonus spells such as *Cure Wounds* and *Healing Spirit*",
      "Experimental Elixir (3rd): create random elixirs daily with varied effects",
      "Restorative Reagents (5th): your elixirs now restore hit points to others; better at higher levels",
      "Chemical Mastery (9th): gain resistance to acid and poison, immune to poison condition",
      "Alchemical Savant (15th): add twice proficiency bonus to spell healing or damage using alchemist spells"
    ],
    "level_unlocks": [3,3,5,9,15],
    "cited_source": "TCoE p.14, Eberron: Rising from the Last War p.58; class officially recognizes four specialists per WotC including Alchemist:contentReference[oaicite:1]{index=1}"
  },
  {
    "subclass_name": "Armorer",
    "class": "Artificer",
    "sourcebook": "TCoE / ERftLW",
    "class_features": [
      "Armor Model (3rd): customize your armor—Guardian (defensive) or Infiltrator (stealth) with integrated magic weapons",
      "Arcane Armor (3rd): integrate magic into armor that can be used as a spellcasting focus",
      "Armor Modifications (5th): gain advanced modifications through infusions",
      "Extra Attack (9th): make two attacks with your armor’s built-in weapons",
      "Perfected Armor (15th): your armor grows in power with additional benefits per model"
    ],
     "level_unlocks": [3,3,5,9,15],
     "cited_source": "TCoE p.15, Eberron: Rising from the Last War p.58:contentReference[oaicite:2]{index=2}"
   },
   {
     "subclass_name": "Artillerist",
     "class": "Artificer",
     "sourcebook": "TCoE / ERftLW",
     "class_features": [
       "Arcane Firearm (3rd): enhance a wand, staff, or rod to deal extra damage",
       "Eldritch Cannon (3rd): build a magical cannon that can aid or deal damage",
       "Explosive Cannon Bonus Action (5th): empower cannon attacks with added effects",
       "Protective Field (9th): cannon grants resistance or healing to nearby creatures",
       "Fortified Position (15th): cannon becomes sturdier with more hit points and resistance"
     ],
     "level_unlocks": [3,3,5,9,15],
     "cited_source": "TCoE p.17, recognized as core Artificer specialist:contentReference[oaicite:3]{index=3}"
   },
   {
     "subclass_name": "Battle Smith",
     "class": "Artificer",
     "sourcebook": "TCoE / ERftLW",
     "class_features": [
       "Battle‑Ready (3rd): gain proficiency with martial weapons and use Intelligence for attacks",
       "Steel Defender (3rd): create a construct companion that aids you in combat",
       "Extra Attack (5th): you can attack twice when taking the Attack action",
       "Arcane Jolt (9th): heal or damage when you hit an ally or enemy with your magic weapon",
       "Improved Defender (15th): your Steel Defender grants you or allies bonuses to AC or saving throws when adjacent"
     ],
     "level_unlocks": [3,3,5,9,15],
     "cited_source": "TCoE p.18, part of official four specialists:contentReference[oaicite:4]{index=4}"
   }
 
 
];

// Function to get subclasses for a specific class
export function getSubclassesForClass(className: string): SubclassData[] {
  return dndClassesData.filter(subclass => 
    subclass.class.toLowerCase() === className.toLowerCase()
  );
}

// Function to get the minimum level unlock for a subclass
export function getMinLevelUnlock(subclassName: string): number {
  const subclass = dndClassesData.find(sub => 
    sub.subclass_name.toLowerCase() === subclassName.toLowerCase()
  );
  return subclass ? Math.min(...subclass.level_unlocks) : 1;
}

// Function to check if a subclass is available at a given level
export function isSubclassAvailableAtLevel(subclassName: string, level: number): boolean {
  const minLevel = getMinLevelUnlock(subclassName);
  return level >= minLevel;
}

// Function to sanitize class selection
export function sanitizeClassSelection(value: string): string {
  if (!value) return value;
  return value.trim().toLowerCase();
}

// Function to sanitize subclass selection
export function sanitizeSubclassSelection(value: string): string {
  if (!value) return value;
  return value.trim();
}
