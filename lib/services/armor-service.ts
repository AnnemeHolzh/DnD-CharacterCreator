export interface Armor {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

export interface ArmorDetail {
  index: string
  name: string
  equipment_category: string
  armor_category?: string
  armor_class: {
    base: number
    dex_bonus?: boolean
    max_bonus?: number
  }
  str_minimum?: number
  stealth_disadvantage?: boolean
  cost: {
    quantity: number
    unit: string
  }
  weight: number
  url: string
}

export interface MagicArmor {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

export interface MagicArmorDetail {
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

export class ArmorService {
  /**
   * Fetch all mundane armor from the DnD API
   */
  static async fetchArmor(): Promise<Armor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment-categories/armor`)
      if (!response.ok) {
        throw new Error(`Failed to fetch armor: ${response.status}`)
      }
      const data = await response.json()
      return data.equipment || []
    } catch (error) {
      console.error('Error fetching armor:', error)
      throw error
    }
  }

  /**
   * Fetch all shields from the DnD API
   */
  static async fetchShields(): Promise<Armor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment-categories/shields`)
      if (!response.ok) {
        throw new Error(`Failed to fetch shields: ${response.status}`)
      }
      const data = await response.json()
      return data.equipment || []
    } catch (error) {
      console.error('Error fetching shields:', error)
      throw error
    }
  }

  /**
   * Fetch all magical armor and shields from the DnD API
   */
  static async fetchMagicArmor(): Promise<{ magicalArmor: MagicArmor[], magicalShields: MagicArmor[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/magic-items`)
      if (!response.ok) {
        throw new Error(`Failed to fetch magic items: ${response.status}`)
      }
      const data = await response.json()
      
      // Filter for armor and shields only
      const armorItems = data.results?.filter((item: any) => 
        item.equipment_category?.includes?.('Armor') || 
        item.equipment_category?.includes?.('Shield') ||
        item.name?.toLowerCase().includes('armor') ||
        item.name?.toLowerCase().includes('shield') ||
        item.name?.toLowerCase().includes('plate') ||
        item.name?.toLowerCase().includes('mail') ||
        item.name?.toLowerCase().includes('leather') ||
        item.name?.toLowerCase().includes('chain') ||
        item.name?.toLowerCase().includes('breastplate') ||
        item.name?.toLowerCase().includes('splint') ||
        item.name?.toLowerCase().includes('ring mail') ||
        item.name?.toLowerCase().includes('scale mail') ||
        item.name?.toLowerCase().includes('studded leather') ||
        item.name?.toLowerCase().includes('padded') ||
        item.name?.toLowerCase().includes('hide') ||
        item.name?.toLowerCase().includes('half plate') ||
        item.name?.toLowerCase().includes('full plate') ||
        item.name?.toLowerCase().includes('buckler') ||
        item.name?.toLowerCase().includes('tower shield')
      ) || []
      
      // Separate magical armor from magical shields
      const magicalArmor: MagicArmor[] = []
      const magicalShields: MagicArmor[] = []
      
      armorItems.forEach((item: any) => {
        const isShield = item.equipment_category?.includes?.('Shield') ||
                        item.name?.toLowerCase().includes('shield') ||
                        item.name?.toLowerCase().includes('buckler') ||
                        item.name?.toLowerCase().includes('tower shield')
        
        if (isShield) {
          magicalShields.push(item)
        } else {
          magicalArmor.push(item)
        }
      })
      
      return { magicalArmor, magicalShields }
    } catch (error) {
      console.error('Error fetching magic armor:', error)
      throw error
    }
  }

  /**
   * Fetch all armor and shields (mundane and magical)
   */
  static async fetchAllArmor(): Promise<{ 
    mundaneArmor: Armor[], 
    mundaneShields: Armor[], 
    magicalArmor: MagicArmor[],
    magicalShields: MagicArmor[]
  }> {
    try {
      const [mundaneArmor, mundaneShields, magicalItems] = await Promise.all([
        this.fetchArmor(),
        this.fetchShields(),
        this.fetchMagicArmor()
      ])
      
      return {
        mundaneArmor,
        mundaneShields,
        magicalArmor: magicalItems.magicalArmor,
        magicalShields: magicalItems.magicalShields
      }
    } catch (error) {
      console.error('Error fetching all armor:', error)
      throw error
    }
  }

  /**
   * Fetch a specific mundane armor by index
   */
  static async fetchArmorDetail(index: string): Promise<ArmorDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch armor detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching armor detail:', error)
      throw error
    }
  }

  /**
   * Fetch a specific magical armor by index
   */
  static async fetchMagicArmorDetail(index: string): Promise<MagicArmorDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/magic-items/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch magic armor detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching magic armor detail:', error)
      throw error
    }
  }

  /**
   * Group armor by their category
   */
  static groupArmorByCategory(armor: Armor[]): Record<string, Armor[]> {
    const grouped: Record<string, Armor[]> = {}
    
    armor.forEach(item => {
      const category = item.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(item)
    })
    
    return grouped
  }

  /**
   * Get armor categories with their armor
   */
  static async fetchArmorCategories(): Promise<Record<string, Armor[]>> {
    const armor = await this.fetchArmor()
    return this.groupArmorByCategory(armor)
  }

  /**
   * Get shield categories with their shields
   */
  static async fetchShieldCategories(): Promise<Record<string, Armor[]>> {
    const shields = await this.fetchShields()
    return this.groupArmorByCategory(shields)
  }
} 