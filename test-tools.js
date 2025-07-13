// Test tool proficiencies calculation
const classes = [
  {
    id: "barbarian",
    name: "Barbarian",
    toolProficiencies: ["thieves' tools", "tinker's tools", "artisan's tools"],
  },
  {
    id: "fighter",
    name: "Fighter",
    toolProficiencies: ["thieves' tools", "tinker's tools", "artisan's tools"],
  }
]

const backgrounds = [
  {
    id: "charlatan",
    name: "Charlatan",
    tools: ["Disguise kit", "Forgery kit"],
  },
  {
    id: "criminal",
    name: "Criminal",
    tools: ["Gaming set", "Thieves' tools"],
  }
]

const races = [
  {
    id: "dwarf",
    name: "Dwarf",
    subraces: [
      {
        id: "hill-dwarf",
        name: "Hill Dwarf",
        tools: ["mason's-tools", "brewer's-supplies", "smith's-tools"],
      }
    ]
  }
]

function mapToolNameToIndex(toolName) {
  const toolNameMap = {
    "Disguise kit": "disguise-kit",
    "Forgery kit": "forgery-kit",
    "Gaming set": "gaming-set",
    "Thieves' tools": "thieves-tools",
    "thieves' tools": "thieves-tools",
    "Musical instrument": "musical-instrument",
    "Artisan's tools": "artisans-tools",
    "artisan's tools": "artisans-tools",
    "Herbalism kit": "herbalism-kit",
    "Navigator's tools": "navigators-tools",
    "Vehicles (water)": "vehicles-water",
    "Vehicles (land)": "vehicles-land",
    "Cartographer's tools": "cartographers-tools",
    "Poisoner's kit": "poisoners-kit",
    "Fishing tackle": "fishing-tackle",
    "Carpenter's tools": "carpenters-tools",
    "Tinker's tools": "tinkers-tools",
    "tinker's tools": "tinkers-tools",
    "Mason's tools": "masons-tools",
    "mason's tools": "masons-tools",
    "Brewer's supplies": "brewers-supplies",
    "brewer's supplies": "brewers-supplies",
    "Smith's tools": "smiths-tools",
    "smith's tools": "smiths-tools"
  }
  
  return toolNameMap[toolName] || toolName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/'/g, '')
}

function getClassToolProficiencies(classId) {
  const classData = classes.find(c => c.id === classId)
  if (!classData) return []
  return classData.toolProficiencies.map(mapToolNameToIndex)
}

function getBackgroundToolProficiencies(backgroundId) {
  const background = backgrounds.find(bg => bg.id === backgroundId)
  if (!background) return []
  const toolNames = Array.isArray(background.tools) ? background.tools : []
  return toolNames.map(mapToolNameToIndex)
}

function getRaceToolProficiencies(raceId, subraceId) {
  const race = races.find(r => r.id === raceId)
  if (!race) return []

  if (subraceId) {
    const subrace = race.subraces?.find(s => s.id === subraceId)
    if (subrace && 'tools' in subrace && Array.isArray(subrace.tools)) {
      return subrace.tools.map(mapToolNameToIndex)
    }
  }

  return []
}

function calculateToolProficiencies(characterClasses, raceId, subraceId, backgroundId) {
  const raceTools = getRaceToolProficiencies(raceId, subraceId)
  const backgroundTools = getBackgroundToolProficiencies(backgroundId)
  const classTools = characterClasses.map(c => getClassToolProficiencies(c.class)).flat()
  const fixedTools = [...raceTools, ...backgroundTools, ...classTools]

  console.log('Tool calculation:', {
    raceTools,
    backgroundTools,
    classTools,
    fixedTools
  })

  return {
    fixedTools,
    availableTools: [],
    selectedTools: []
  }
}

// Test scenarios
console.log('=== Testing Tool Proficiencies ===')

console.log('\n1. Fighter + Criminal background:')
const fighterCriminal = calculateToolProficiencies(
  [{ class: "fighter", level: 1 }],
  "dwarf",
  "hill-dwarf",
  "criminal"
)

console.log('\n2. Barbarian + Charlatan background:')
const barbarianCharlatan = calculateToolProficiencies(
  [{ class: "barbarian", level: 1 }],
  "dwarf",
  "hill-dwarf",
  "charlatan"
) 