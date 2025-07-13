export interface Item {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

export interface ItemDetail {
  index: string
  name: string
  equipment_category: string
  cost: {
    quantity: number
    unit: string
  }
  weight: number
  description?: string
  contents?: Array<{
    item: {
      index: string
      name: string
      url: string
    }
    quantity: number
  }>
  url: string
}

export interface MagicItem {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

export interface MagicItemDetail {
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

export class ItemsService {
  /**
   * Fetch all mundane items from the DnD API (excluding weapons and armor)
   */
  static async fetchItems(): Promise<Item[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment`)
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status}`)
      }
      const data = await response.json()
      
      // Filter out weapons and armor, keep only other equipment
      const items = data.results?.filter((item: any) => {
        const category = item.equipment_category?.name || item.equipment_category
        return category !== 'Weapon' && 
               category !== 'Armor' && 
               category !== 'Shield' &&
               !item.name?.toLowerCase().includes('sword') &&
               !item.name?.toLowerCase().includes('axe') &&
               !item.name?.toLowerCase().includes('bow') &&
               !item.name?.toLowerCase().includes('dagger') &&
               !item.name?.toLowerCase().includes('spear') &&
               !item.name?.toLowerCase().includes('mace') &&
               !item.name?.toLowerCase().includes('hammer') &&
               !item.name?.toLowerCase().includes('staff') &&
               !item.name?.toLowerCase().includes('whip') &&
               !item.name?.toLowerCase().includes('crossbow') &&
               !item.name?.toLowerCase().includes('flail') &&
               !item.name?.toLowerCase().includes('glaive') &&
               !item.name?.toLowerCase().includes('halberd') &&
               !item.name?.toLowerCase().includes('lance') &&
               !item.name?.toLowerCase().includes('pike') &&
               !item.name?.toLowerCase().includes('rapier') &&
               !item.name?.toLowerCase().includes('scimitar') &&
               !item.name?.toLowerCase().includes('shortsword') &&
               !item.name?.toLowerCase().includes('trident') &&
               !item.name?.toLowerCase().includes('war pick') &&
               !item.name?.toLowerCase().includes('warhammer') &&
               !item.name?.toLowerCase().includes('net') &&
               !item.name?.toLowerCase().includes('sling') &&
               !item.name?.toLowerCase().includes('blowgun') &&
               !item.name?.toLowerCase().includes('hand crossbow') &&
               !item.name?.toLowerCase().includes('heavy crossbow') &&
               !item.name?.toLowerCase().includes('light crossbow') &&
               !item.name?.toLowerCase().includes('longbow') &&
               !item.name?.toLowerCase().includes('shortbow') &&
               !item.name?.toLowerCase().includes('plate') &&
               !item.name?.toLowerCase().includes('mail') &&
               !item.name?.toLowerCase().includes('leather') &&
               !item.name?.toLowerCase().includes('chain') &&
               !item.name?.toLowerCase().includes('breastplate') &&
               !item.name?.toLowerCase().includes('splint') &&
               !item.name?.toLowerCase().includes('ring mail') &&
               !item.name?.toLowerCase().includes('scale mail') &&
               !item.name?.toLowerCase().includes('studded leather') &&
               !item.name?.toLowerCase().includes('padded') &&
               !item.name?.toLowerCase().includes('hide') &&
               !item.name?.toLowerCase().includes('half plate') &&
               !item.name?.toLowerCase().includes('full plate') &&
               !item.name?.toLowerCase().includes('buckler') &&
               !item.name?.toLowerCase().includes('tower shield') &&
               !item.name?.toLowerCase().includes('shield')
      }) || []
      
      return items
    } catch (error) {
      console.error('Error fetching items:', error)
      throw error
    }
  }

  /**
   * Fetch all magical items from the DnD API (excluding weapons and armor)
   */
  static async fetchMagicItems(): Promise<MagicItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/magic-items`)
      if (!response.ok) {
        throw new Error(`Failed to fetch magic items: ${response.status}`)
      }
      const data = await response.json()
      
      // Filter out weapons and armor, keep only other magic items
      const magicItems = data.results?.filter((item: any) => {
        const category = item.equipment_category?.name || item.equipment_category
        return category !== 'Weapon' && 
               category !== 'Armor' && 
               category !== 'Shield' &&
               !item.name?.toLowerCase().includes('sword') &&
               !item.name?.toLowerCase().includes('axe') &&
               !item.name?.toLowerCase().includes('bow') &&
               !item.name?.toLowerCase().includes('dagger') &&
               !item.name?.toLowerCase().includes('spear') &&
               !item.name?.toLowerCase().includes('mace') &&
               !item.name?.toLowerCase().includes('hammer') &&
               !item.name?.toLowerCase().includes('staff') &&
               !item.name?.toLowerCase().includes('whip') &&
               !item.name?.toLowerCase().includes('crossbow') &&
               !item.name?.toLowerCase().includes('flail') &&
               !item.name?.toLowerCase().includes('glaive') &&
               !item.name?.toLowerCase().includes('halberd') &&
               !item.name?.toLowerCase().includes('lance') &&
               !item.name?.toLowerCase().includes('pike') &&
               !item.name?.toLowerCase().includes('rapier') &&
               !item.name?.toLowerCase().includes('scimitar') &&
               !item.name?.toLowerCase().includes('shortsword') &&
               !item.name?.toLowerCase().includes('trident') &&
               !item.name?.toLowerCase().includes('war pick') &&
               !item.name?.toLowerCase().includes('warhammer') &&
               !item.name?.toLowerCase().includes('net') &&
               !item.name?.toLowerCase().includes('sling') &&
               !item.name?.toLowerCase().includes('blowgun') &&
               !item.name?.toLowerCase().includes('hand crossbow') &&
               !item.name?.toLowerCase().includes('heavy crossbow') &&
               !item.name?.toLowerCase().includes('light crossbow') &&
               !item.name?.toLowerCase().includes('longbow') &&
               !item.name?.toLowerCase().includes('shortbow') &&
               !item.name?.toLowerCase().includes('plate') &&
               !item.name?.toLowerCase().includes('mail') &&
               !item.name?.toLowerCase().includes('leather') &&
               !item.name?.toLowerCase().includes('chain') &&
               !item.name?.toLowerCase().includes('breastplate') &&
               !item.name?.toLowerCase().includes('splint') &&
               !item.name?.toLowerCase().includes('ring mail') &&
               !item.name?.toLowerCase().includes('scale mail') &&
               !item.name?.toLowerCase().includes('studded leather') &&
               !item.name?.toLowerCase().includes('padded') &&
               !item.name?.toLowerCase().includes('hide') &&
               !item.name?.toLowerCase().includes('half plate') &&
               !item.name?.toLowerCase().includes('full plate') &&
               !item.name?.toLowerCase().includes('buckler') &&
               !item.name?.toLowerCase().includes('tower shield') &&
               !item.name?.toLowerCase().includes('shield')
      }) || []
      
      return magicItems
    } catch (error) {
      console.error('Error fetching magic items:', error)
      throw error
    }
  }

  /**
   * Fetch all items (mundane and magical)
   */
  static async fetchAllItems(): Promise<{ mundaneItems: Item[], magicalItems: MagicItem[] }> {
    try {
      const [mundaneItems, magicalItems] = await Promise.all([
        this.fetchItems(),
        this.fetchMagicItems()
      ])
      
      return {
        mundaneItems,
        magicalItems
      }
    } catch (error) {
      console.error('Error fetching all items:', error)
      throw error
    }
  }

  /**
   * Fetch a specific mundane item by index
   */
  static async fetchItemDetail(index: string): Promise<ItemDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch item detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching item detail:', error)
      throw error
    }
  }

  /**
   * Fetch a specific magical item by index
   */
  static async fetchMagicItemDetail(index: string): Promise<MagicItemDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/magic-items/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch magic item detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching magic item detail:', error)
      throw error
    }
  }

  /**
   * Group items by their category
   */
  static groupItemsByCategory(items: Item[]): Record<string, Item[]> {
    const grouped: Record<string, Item[]> = {}
    
    items.forEach(item => {
      const category = item.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(item)
    })
    
    return grouped
  }

  /**
   * Get item categories with their items
   */
  static async fetchItemCategories(): Promise<Record<string, Item[]>> {
    const items = await this.fetchItems()
    return this.groupItemsByCategory(items)
  }
} 