const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014'

export interface Language {
  index: string
  name: string
  url: string
}

export interface LanguagesResponse {
  count: number
  results: Language[]
}

export class LanguagesService {
  static async fetchLanguages(): Promise<Language[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/languages`)
      if (!response.ok) {
        throw new Error(`Failed to fetch languages: ${response.status}`)
      }
      const data: LanguagesResponse = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error fetching languages:', error)
      throw error
    }
  }

  static async fetchLanguageDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/languages/${index}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch language detail: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching language detail:', error)
      throw error
    }
  }
} 