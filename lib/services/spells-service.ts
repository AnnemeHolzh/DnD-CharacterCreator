const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014'

export interface Spell {
  index: string
  name: string
  url: string
  level: number
  school: {
    index: string
    name: string
  }
  casting_time: string
  range: string
  components: string[]
  duration: string
  description: string[]
  classes?: Array<{
    index: string
    name: string
    url: string
  }>
}

export interface SpellListItem {
  index: string
  name: string
  url: string
  level: number
  school: {
    index: string
    name: string
  }
}

export interface SpellsResponse {
  count: number
  results: SpellListItem[]
}

// Fetch spells with optional filtering
export async function getSpells(level?: number, school?: string): Promise<SpellListItem[]> {
  try {
    let url = `${API_BASE_URL}/spells`
    const params = new URLSearchParams()
    
    if (level !== undefined) {
      params.append('level', level.toString())
    }
    if (school) {
      params.append('school', school)
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: SpellsResponse = await response.json()
    return data.results
  } catch (error) {
    console.error('Error fetching spells:', error)
    throw new Error(`Failed to fetch spells: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fetch detailed spell information
export async function getSpellDetails(spellIndex: string): Promise<Spell> {
  try {
    const response = await fetch(`${API_BASE_URL}/spells/${spellIndex}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching spell details:', error)
    throw new Error(`Failed to fetch spell details: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get all available spell schools
export const SPELL_SCHOOLS = [
  { value: 'abjuration', label: 'Abjuration' },
  { value: 'conjuration', label: 'Conjuration' },
  { value: 'divination', label: 'Divination' },
  { value: 'enchantment', label: 'Enchantment' },
  { value: 'evocation', label: 'Evocation' },
  { value: 'illusion', label: 'Illusion' },
  { value: 'necromancy', label: 'Necromancy' },
  { value: 'transmutation', label: 'Transmutation' },
]

// Get spell level options (0-9)
export const SPELL_LEVELS = Array.from({ length: 10 }, (_, i) => ({
  value: i,
  label: i === 0 ? 'Cantrip' : `${i}${getOrdinalSuffix(i)} Level`
}))

function getOrdinalSuffix(num: number): string {
  if (num >= 11 && num <= 13) return 'th'
  switch (num % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
} 