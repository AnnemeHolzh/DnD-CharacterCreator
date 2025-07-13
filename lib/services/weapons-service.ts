export interface Weapon {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

export interface WeaponDetail {
  index: string
  name: string
  equipment_category: string
  weapon_category?: string
  weapon_range?: string
  category_range?: string
  cost: {
    quantity: number
    unit: string
  }
  damage?: {
    damage_dice: string
    damage_type: {
      index: string
      name: string
      url: string
    }
  }
  range?: {
    normal: number
    long?: number
  }
  weight: number
  properties?: Array<{
    index: string
    name: string
    url: string
  }>
  two_handed_damage?: {
    damage_dice: string
    damage_type: {
      index: string
      name: string
      url: string
    }
  }
  url: string
}

export interface MagicWeapon {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

export interface MagicWeaponDetail {
  index: string
  name: string
  equipment_category: string
  rarity: {
    name: string
  }
  attunement: boolean
  desc: string[]
  url: string
}

const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014'

export class WeaponsService {
  /**
   * Fetch all mundane weapons from the DnD API
   */
  static async fetchWeapons(): Promise<Weapon[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment-categories/weapon`)
      if (!response.ok) {
        throw new Error(`Failed to fetch weapons: ${response.status}`)
      }
      const data = await response.json()
      return data.equipment || []
    } catch (error) {
      console.error('Error fetching weapons:', error)
      throw error
    }
  }

  /**
   * Fetch all magical weapons from the DnD API
   */
  static async fetchMagicWeapons(): Promise<MagicWeapon[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/magic-items`)
      if (!response.ok) {
        throw new Error(`Failed to fetch magic items: ${response.status}`)
      }
      const data = await response.json()
      
      // Filter for weapons only
      const weaponItems = data.results?.filter((item: any) => 
        item.equipment_category?.includes?.('Weapon') || 
        item.name?.toLowerCase().includes('sword') ||
        item.name?.toLowerCase().includes('axe') ||
        item.name?.toLowerCase().includes('bow') ||
        item.name?.toLowerCase().includes('dagger') ||
        item.name?.toLowerCase().includes('spear') ||
        item.name?.toLowerCase().includes('mace') ||
        item.name?.toLowerCase().includes('hammer') ||
        item.name?.toLowerCase().includes('staff') ||
        item.name?.toLowerCase().includes('whip') ||
        item.name?.toLowerCase().includes('crossbow') ||
        item.name?.toLowerCase().includes('flail') ||
        item.name?.toLowerCase().includes('glaive') ||
        item.name?.toLowerCase().includes('halberd') ||
        item.name?.toLowerCase().includes('lance') ||
        item.name?.toLowerCase().includes('pike') ||
        item.name?.toLowerCase().includes('rapier') ||
        item.name?.toLowerCase().includes('scimitar') ||
        item.name?.toLowerCase().includes('shortsword') ||
        item.name?.toLowerCase().includes('trident') ||
        item.name?.toLowerCase().includes('war pick') ||
        item.name?.toLowerCase().includes('warhammer') ||
        item.name?.toLowerCase().includes('net') ||
        item.name?.toLowerCase().includes('sling') ||
        item.name?.toLowerCase().includes('blowgun') ||
        item.name?.toLowerCase().includes('hand crossbow') ||
        item.name?.toLowerCase().includes('heavy crossbow') ||
        item.name?.toLowerCase().includes('light crossbow') ||
        item.name?.toLowerCase().includes('longbow') ||
        item.name?.toLowerCase().includes('shortbow')
      ) || []
      
      return weaponItems
    } catch (error) {
      console.error('Error fetching magic weapons:', error)
      throw error
    }
  }

  /**
   * Fetch all weapons (mundane and magical)
   */
  static async fetchAllWeapons(): Promise<{ mundane: Weapon[], magical: MagicWeapon[] }> {
    try {
      const [mundaneWeapons, magicalWeapons] = await Promise.all([
        this.fetchWeapons(),
        this.fetchMagicWeapons()
      ])
      
      return {
        mundane: mundaneWeapons,
        magical: magicalWeapons
      }
    } catch (error) {
      console.error('Error fetching all weapons:', error)
      throw error
    }
  }

  /**
   * Fetch a specific mundane weapon by index
   */
  static async fetchWeaponDetail(index: string): Promise<WeaponDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch weapon detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching weapon detail:', error)
      throw error
    }
  }

  /**
   * Fetch a specific magical weapon by index
   */
  static async fetchMagicWeaponDetail(index: string): Promise<MagicWeaponDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/magic-items/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch magic weapon detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching magic weapon detail:', error)
      throw error
    }
  }

  /**
   * Group weapons by their category
   */
  static groupWeaponsByCategory(weapons: Weapon[]): Record<string, Weapon[]> {
    const grouped: Record<string, Weapon[]> = {}
    
    weapons.forEach(weapon => {
      const category = weapon.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(weapon)
    })
    
    return grouped
  }

  /**
   * Get weapon categories with their weapons
   */
  static async fetchWeaponCategories(): Promise<Record<string, Weapon[]>> {
    const weapons = await this.fetchWeapons()
    return this.groupWeaponsByCategory(weapons)
  }
} 