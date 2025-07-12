export interface Tool {
  index: string
  name: string
  url: string
  equipment_category?: string
  description?: string
}

export interface ToolCategory {
  index: string
  name: string
  url: string
  tools: Tool[]
}

export interface ToolsResponse {
  count: number
  results: Tool[]
}

export interface ToolDetail {
  index: string
  name: string
  equipment_category: string
  description: string
  url: string
}

const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014'

export class ToolsService {
  /**
   * Fetch all tools from the DnD API
   */
  static async fetchTools(): Promise<Tool[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment-categories/tools`)
      if (!response.ok) {
        throw new Error(`Failed to fetch tools: ${response.status}`)
      }
      const data = await response.json()
      return data.equipment || []
    } catch (error) {
      console.error('Error fetching tools:', error)
      throw error
    }
  }

  /**
   * Fetch a specific tool by index
   */
  static async fetchToolDetail(index: string): Promise<ToolDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch tool detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching tool detail:', error)
      throw error
    }
  }

  /**
   * Group tools by their category
   */
  static groupToolsByCategory(tools: Tool[]): Record<string, Tool[]> {
    const grouped: Record<string, Tool[]> = {}
    
    tools.forEach(tool => {
      const category = tool.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(tool)
    })
    
    return grouped
  }

  /**
   * Get tool categories with their tools
   */
  static async fetchToolCategories(): Promise<Record<string, Tool[]>> {
    const tools = await this.fetchTools()
    return this.groupToolsByCategory(tools)
  }
} 