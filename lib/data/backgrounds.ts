export const backgrounds = [
  {
    id: "acolyte",
    name: "Acolyte",
    source: "Player's Handbook",
    skills: ["Insight", "Religion"],
    tools: [],
    languages: "Two of your choice",
    features: [{"name": "Shelter of the Faithful", "prereqs": "", "description": "Free healing and care at a temple of your faith for you and your companions; you can call upon priests of your faith for assistance."}],
    abilityScoreOptions: ["Charisma","Intelligence","Wisdom"],
    originFeat: "Magic Initiate (Cleric)"
  },
  {
    id: "charlatan",
    name: "Charlatan",
    source: "Player's Handbook",
    skills: ["Deception", "Sleight of Hand"],
    tools: ["Disguise kit", "Forgery kit"],
    languages: "None",
    features: [{"name": "False Identity", "prereqs": "", "description": "Maintain a second identity with documentation and disguises; you can assume this persona to hide your true identity."}],
    abilityScoreOptions: ["Charisma","Constitution","Dexterity"],
    originFeat: "Skilled"
  },
  {
    id: "criminal",
    name: "Criminal",
    source: "Player's Handbook",
    skills: ["Sleight of Hand", "Stealth"],
    tools: ["dice-set", "thieves-tools"],
    languages: "None",
    features: [{"name": "Criminal Contact", "prereqs": "", "description": "You have a reliable contact in the criminal underworld who provides information and assistance."}],
    abilityScoreOptions: ["Constitution","Dexterity","Intelligence"],
    originFeat: "Alert"
  },
  {
    id: "entertainer",
    name: "Entertainer",
    source: "Player's Handbook",
    skills: ["Acrobatics", "Performance"],
    tools: ["disguise-kit", "lute"],
    languages: "None",
    features: [{"name": "By Popular Demand", "prereqs": "", "description": "Perform in public to earn free lodging and food; you often find places to perform and earn money."}],
    abilityScoreOptions: ["Charisma","Dexterity","Strength"],
    originFeat: "Musician"
  },
  {
    id: "farmer",
    name: "Farmer",
    source: "Player's Handbook (2024)",
    skills: ["Animal Handling", "Nature"],
    tools: [],
    languages: "None",
    features: [{"name": "Hardy", "prereqs": "", "description": "Advantage on saving throws against exhaustion and disease; you regain more hit points when you roll Hit Dice."}],
    abilityScoreOptions: ["Constitution","Strength","Wisdom"],
    originFeat: "Tough"
  },
  {
    id: "artisan",
    name: "Artisan",
    source: "Player's Handbook (2024)",
    skills: ["Investigation", "Persuasion"],
    tools: ["Artisan's tools"],
    languages: "None",
    features: [{"name": "Guild Membership", "prereqs": "", "description": "Your guild provides lodging and aid; you can request assistance from fellow craftsmen."}],
    abilityScoreOptions: ["Dexterity","Intelligence","Strength"],
    originFeat: "Crafter"
  },
  {
    id: "hermit",
    name: "Hermit",
    source: "Player's Handbook",
    skills: ["Medicine", "Religion"],
    tools: ["Herbalism kit"],
    languages: "None",
    features: [{"name": "Discovery", "prereqs": "", "description": "You have uncovered a unique and important secret (DM's choice) through your solitude."}],
    abilityScoreOptions: ["Charisma","Constitution","Wisdom"],
    originFeat: "Healer"
  },
  {
    id: "noble",
    name: "Noble",
    source: "Player's Handbook",
    skills: ["History", "Persuasion"],
    tools: ["playing-card-set"],
    languages: "None",
    features: [{"name": "Position of Privilege", "prereqs": "", "description": "People of noble birth treat you with respect; commoners provide free food and lodging."}],
    abilityScoreOptions: ["Charisma","Intelligence","Strength"],
    originFeat: "Skilled"
  },
  {
    id: "sage",
    name: "Sage",
    source: "Player's Handbook",
    skills: ["Arcana", "History"],
    tools: [],
    languages: "Two of your choice",
    features: [{"name": "Researcher", "prereqs": "", "description": "When you try to learn or recall knowledge, you often know where to turn for information."}],
    abilityScoreOptions: ["Constitution","Intelligence","Wisdom"],
    originFeat: "Magic Initiate (Wizard)"
  },
  {
    id: "sailor",
    name: "Sailor",
    source: "Player's Handbook",
    skills: ["Acrobatics", "Perception"],
    tools: ["Navigator's tools", "Vehicles (water)"],
    languages: "None",
    features: [{"name": "Ship's Passage", "prereqs": "", "description": "You can secure free passage on a ship for you and companions by working as a crew member."}],
    abilityScoreOptions: ["Dexterity","Strength","Wisdom"],
    originFeat: "Tavern Brawler"
  },
  {
    id: "soldier",
    name: "Soldier",
    source: "Player's Handbook",
    skills: ["Athletics", "Intimidation"],
    tools: ["dice-set", "vehicles-land"],
    languages: "None",
    features: [{"name": "Military Rank", "prereqs": "", "description": "Your military rank grants you respect among soldiers; they will aid you or provide accommodation."}],
    abilityScoreOptions: ["Constitution","Dexterity","Strength"],
    originFeat: "Savage Attacker"
  },
  {
    id: "guard",
    name: "Guard",
    source: "Player's Handbook (2024)",
    skills: ["History", "Persuasion"],
    tools: [],
    languages: "None",
    features: [{"name": "Watcher's Eye", "prereqs": "", "description": "You have advantage on Insight or Perception checks related to law enforcement or criminals."}],
    abilityScoreOptions: ["Intelligence","Strength","Wisdom"],
    originFeat: "Alert"
  },
  {
    id: "guide",
    name: "Guide",
    source: "Player's Handbook (2024)",
    skills: ["Arcana", "History"],
    tools: [],
    languages: "None",
    features: [{"name": "Streetwise", "prereqs": "", "description": "You know many urban secrets and shortcuts; you gain advantage on checks to navigate cities and find shelter."}],
    abilityScoreOptions: ["Constitution","Dexterity","Wisdom"],
    originFeat: "Magic Initiate (Druid)"
  },
  {
    id: "merchant",
    name: "Merchant",
    source: "Player's Handbook (2024)",
    skills: ["Animal Handling", "Persuasion"],
    tools: [],
    languages: "None",
    features: [{"name": "Haggler", "prereqs": "", "description": "You can negotiate better deals; you have advantage on Charisma checks with merchants."}],
    abilityScoreOptions: ["Charisma","Constitution","Intelligence"],
    originFeat: "Lucky"
  },
  {
    id: "scribe",
    name: "Scribe",
    source: "Player's Handbook (2024)",
    skills: ["Investigation", "Perception"],
    tools: [],
    languages: "None",
    features: [{"name": "Scripturist", "prereqs": "", "description": "You can create and decipher codes; you can copy written documents more efficiently."}],
    abilityScoreOptions: ["Dexterity","Intelligence","Wisdom"],
    originFeat: "Skilled"
  },
  {
    id: "wayfarer",
    name: "Wayfarer",
    source: "Player's Handbook (2024)",
    skills: ["Insight", "Stealth"],
    tools: [],
    languages: "None",
    features: [{"name": "Nomadic Explorer", "prereqs": "", "description": "You excel at finding food and water in the wild and navigating natural environments."}],
    abilityScoreOptions: ["Charisma","Dexterity","Wisdom"],
    originFeat: "Lucky"
  },
  {
    id: "city-watch",
    name: "City Watch",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Athletics", "Insight"],
    tools: ["dice-set"],
    languages: "None",
    features: [{"name": "Watcher's Eye", "prereqs": "", "description": "Advantage on Investigation checks to track or identify criminals; advantage on saves against being charmed by criminals."}]
  },
  {
    id: "clan-crafter",
    name: "Clan Crafter",
    source: "Sword Coast Adventurer's Guide",
    skills: ["History", "Insight"],
    tools: ["Artisan's tools"],
    languages: "None",
    features: [{"name": "Guild Membership", "prereqs": "", "description": "Membership in a crafting guild grants you resources; you can call on fellow craftsmen for assistance."}]
  },
  {
    id: "cloistered-scholar",
    name: "Cloistered Scholar",
    source: "Sword Coast Adventurer's Guide",
    skills: ["History", "Arcana or Nature or Religion"],
    tools: [],
    languages: "Two of your choice",
    features: [{"name": "Library Access", "prereqs": "", "description": "Free access to monastery libraries and similar institutions; you can research and find hidden lore easily."}]
  },
  {
    id: "courtier",
    name: "Courtier",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Insight", "Persuasion"],
    tools: [],
    languages: "Two of your choice",
    features: [{"name": "Court Functionary", "prereqs": "", "description": "Access to royal courts; you can secure audience with officials and receive favors from nobility."}]
  },
  {
    id: "faction-agent",
    name: "Faction Agent",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Insight", "Special"],
    tools: ["dice-set"],
    languages: "None",
    features: [{"name": "Faction Membership", "prereqs": "", "description": "Connections in a powerful organization; you can rely on faction contacts for help and information."}]
  },
  {
    id: "far-traveler",
    name: "Far Traveler",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Insight", "Perception"],
    tools: ["lute"],
    languages: "Any one of your choice",
    features: [{"name": "All Eyes on You", "prereqs": "", "description": "You receive free room and board in foreign lands due to hospitality."}]
  },
  {
    id: "inheritor",
    name: "Inheritor",
    source: "Sword Coast Adventurer's Guide",
    skills: ["History", "Persuasion"],
    tools: [],
    languages: "None",
    features: [{"name": "Inherited Fate", "prereqs": "", "description": "You have inherited a legacy (item, prophecy, or duty) that guides your destiny (DM's discretion)."}]
  },
  {
    id: "knight-of-the-order",
    name: "Knight of the Order",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Persuasion", "Special"],
    tools: [],
    languages: "None",
    features: [{"name": "Knightly Regard", "prereqs": "", "description": "As a respected knight, fellow knights and nobles offer assistance and sanctuary."}]
  },
  {
    id: "mercenary-veteran",
    name: "Mercenary Veteran",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Athletics", "Persuasion"],
    tools: ["dice-set", "vehicles-land"],
    languages: "None",
    features: [{"name": "Soldier's Scars", "prereqs": "", "description": "Veteran of many battles; you know battlefield tactics and have contacts among soldiers."}]
  },
  {
    id: "urban-bounty-hunter",
    name: "Urban Bounty Hunter",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Investigation", "Stealth"],
    tools: ["dice-set"],
    languages: "None",
    features: [{"name": "Ear to the Ground", "prereqs": "", "description": "You have a network of informants; you can gather rumors and pursue bounties easily in cities."}]
  },
  {
    id: "uthgardt-tribe-member",
    name: "Uthgardt Tribe Member",
    source: "Sword Coast Adventurer's Guide",
    skills: ["Athletics", "Survival"],
    tools: ["drum"],
    languages: "None",
    features: [{"name": "Tied to the Land", "prereqs": "", "description": "You are bound to your tribal lands; you cannot be forced away from your home territory."}]
  },
  {
    id: "waterdhavian-noble",
    name: "Waterdhavian Noble",
    source: "Sword Coast Adventurer's Guide",
    skills: ["History", "Persuasion"],
    tools: ["playing-card-set"],
    languages: "None",
    features: [{"name": "Position of Privilege", "prereqs": "", "description": "As a noble of Waterdeep, commoners respect you and local officials will assist you."}]
  },
  {
    id: "anthropologist",
    name: "Anthropologist",
    source: "Tales of the Yawning Portal",
    skills: ["Insight", "Religion"],
    tools: [],
    languages: "Two of your choice",
    features: [{"name": "Expedition Experience", "prereqs": "", "description": "Studying cultures gives you advantage on lore checks and insight into local customs."}]
  },
  {
    id: "archaeologist",
    name: "Archaeologist",
    source: "Tales of the Yawning Portal",
    skills: ["History", "Survival"],
    tools: ["Cartographer's tools or Navigator's tools"],
    languages: "None",
    features: [{"name": "Keen Eye", "prereqs": "", "description": "Your experience gives advantage on checks to spot traps and hidden doors; you quickly find hidden artifacts."}]
  },
  {
    id: "haunted-one",
    name: "Haunted One",
    source: "Van Richten's Guide to Ravenloft",
    skills: ["Choice"],
    tools: [],
    languages: "None",
    features: [{"name": "Heart of Darkness", "prereqs": "", "description": "Advantage on saves against being frightened; others sense your resolve in horrors."}]
  },
  {
    id: "lorehold-student",
    name: "Lorehold Student",
    source: "Strixhaven: Curriculum of Chaos",
    skills: ["History", "Religion"],
    tools: [],
    languages: "None",
    features: [{"name": "See the Unseen", "prereqs": "", "description": "Gain proficiency in Insight; learn the Identify spell and can cast it once per long rest."}]
  },
  {
    id: "prismari-student",
    name: "Prismari Student",
    source: "Strixhaven: Curriculum of Chaos",
    skills: ["Acrobatics", "Performance"],
    tools: [],
    languages: "None",
    features: [{"name": "Eye for Artistry", "prereqs": "", "description": "Gain proficiency in Acrobatics; learn the Minor Illusion cantrip and can cast it."}]
  },
  {
    id: "quandrix-student",
    name: "Quandrix Student",
    source: "Strixhaven: Curriculum of Chaos",
    skills: ["Arcana", "Nature"],
    tools: ["Artisan's tools"],
    languages: "None",
    features: [{"name": "Up to Scratch", "prereqs": "", "description": "Gain proficiency in Arcana; learn the Guidance cantrip and can cast it."}]
  },
  {
    id: "silverquill-student",
    name: "Silverquill Student",
    source: "Strixhaven: Curriculum of Chaos",
    skills: ["Intimidation", "Persuasion"],
    tools: [],
    languages: "None",
    features: [{"name": "Silver-Tongued", "prereqs": "", "description": "Gain proficiency in Persuasion; learn the Prestidigitation cantrip and can cast it."}]
  },
  {
    id: "witherbloom-student",
    name: "Witherbloom Student",
    source: "Strixhaven: Curriculum of Chaos",
    skills: ["Nature", "Survival"],
    tools: ["Herbalism kit"],
    languages: "None",
    features: [{"name": "Natural Affinity", "prereqs": "", "description": "Gain proficiency in Survival; learn the Druidcraft cantrip and can cast it."}]
  },
  {
    id: "grinner",
    name: "Grinner",
    source: "Explorer's Guide to Wildemount",
    skills: ["Deception", "Performance"],
    tools: ["Disguise kit", "Thieves' tools"],
    languages: "None",
    features: [{"name": "Master of Disguise", "prereqs": "", "description": "You can convincingly pass as nobility or con artist, easily creating convincing personas."}]
  },
  {
    id: "volstrucker-agent",
    name: "Volstrucker Agent",
    source: "Explorer's Guide to Wildemount",
    skills: ["Deception", "Stealth"],
    tools: ["Poisoner's kit"],
    languages: "None",
    features: [{"name": "Dark Secret", "prereqs": "", "description": "Secret operative of the Clovis Concorde; you have knowledge of espionage and covert operations."}]
  },
  {
    id: "feylost",
    name: "Feylost",
    source: "The Wild Beyond the Witchlight",
    skills: ["Deception", "Survival"],
    tools: ["pan-flute"],
    languages: "One: Elvish, Gnomish, Goblin, or Sylvan",
    features: [{"name": "Feywild Canny", "prereqs": "", "description": "Advantage on saving throws against being charmed or frightened by fey magic."}]
  },
  {
    id: "witchlight-hand",
    name: "Witchlight Hand",
    source: "The Wild Beyond the Witchlight",
    skills: ["Performance", "Sleight of Hand"],
    tools: ["disguise-kit"],
    languages: "None",
    features: [{"name": "Carnival Flair", "prereqs": "", "description": "Gain proficiency with a riding horse; after a 1-hour performance, you grant an ally advantage on one attack or saving throw."}]
  },
  {
    id: "fisher",
    name: "Fisher",
    source: "Ghosts of Saltmarsh",
    skills: ["History", "Survival"],
    tools: ["Fishing tackle"],
    languages: "None",
    features: [{"name": "Ship's Passage", "prereqs": "", "description": "You can secure free passage on waterborne vessels as a skilled sailor; captains know you are reliable."}]
  },
  {
    id: "marine",
    name: "Marine",
    source: "Ghosts of Saltmarsh",
    skills: ["Athletics", "Survival"],
    tools: ["Navigator's tools", "Vehicles (water)"],
    languages: "None",
    features: [{"name": "Military Rank", "prereqs": "", "description": "Former naval servicemember; sailors and officers defer to you and you can seek assistance aboard naval vessels."}]
  },
  {
    id: "shipwright",
    name: "Shipwright",
    source: "Ghosts of Saltmarsh",
    skills: ["History", "Perception"],
    tools: ["Carpenter's tools", "Vehicles (water)"],
    languages: "None",
    features: [{"name": "Woodcraft", "prereqs": "", "description": "Skilled boat builder; you can repair and maintain ships, fixing damage with minimal supplies."}]
  },
  {
    id: "smuggler",
    name: "Smuggler",
    source: "Ghosts of Saltmarsh",
    skills: ["Athletics", "Deception"],
    tools: ["Vehicles (water)"],
    languages: "None",
    features: [{"name": "Run Network", "prereqs": "", "description": "Connections in coastal towns; you can find hidden routes for smuggling and escape notice in port areas."}]
  }
]
