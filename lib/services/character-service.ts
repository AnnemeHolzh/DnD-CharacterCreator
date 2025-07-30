import { ref, set, get, push, remove, query, orderByChild, equalTo } from 'firebase/database'
import { database } from '../firebase/config'
import type { z } from 'zod'
import { CharacterSchema } from '../schemas/character-schema'

export type Character = z.infer<typeof CharacterSchema>

export interface CharacterWithId extends Character {
  id: string
  createdAt: number
  updatedAt: number
}

export class CharacterService {
  private static CHARACTERS_REF = 'characters'

  /**
   * Save a character to Firebase Realtime Database
   */
  static async saveCharacter(character: Character): Promise<string> {
    try {
      console.log("CharacterService.saveCharacter - received character:", character)
      
      // Validate character data
      const validatedCharacter = CharacterSchema.parse(character)
      
      // Check if character with same name already exists
      if (validatedCharacter.name) {
        const existingCharacters = await this.getCharactersByName(validatedCharacter.name)
        if (existingCharacters.length > 0) {
          console.warn('Character with same name already exists:', validatedCharacter.name)
          // You could throw an error here if you want to prevent duplicates
          // throw new Error('Character with this name already exists')
        }
      }
      
      // Ensure wealth has default values if not provided
      const characterWithDefaults = {
        ...validatedCharacter,
        wealth: validatedCharacter.wealth || { platinum: 0, gold: 0, silver: 0, bronze: 0 }
      }
      
      // Create character with metadata
      const characterWithMetadata: Omit<CharacterWithId, 'id'> = {
        ...characterWithDefaults,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      // Generate a new reference and get the key
      const newCharacterRef = push(ref(database, this.CHARACTERS_REF))
      const characterId = newCharacterRef.key!

      // Save the character
      await set(newCharacterRef, characterWithMetadata)

      console.log('Character saved successfully with ID:', characterId)
      return characterId
    } catch (error) {
      console.error('Error saving character:', error)
      throw new Error('Failed to save character')
    }
  }

  /**
   * Update an existing character
   */
  static async updateCharacter(characterId: string, character: Character): Promise<void> {
    try {
      console.log("CharacterService.updateCharacter - received character:", character)
      
      // Validate character data
      const validatedCharacter = CharacterSchema.parse(character)
      
      // Ensure wealth has default values if not provided
      const characterWithDefaults = {
        ...validatedCharacter,
        wealth: validatedCharacter.wealth || { platinum: 0, gold: 0, silver: 0, bronze: 0 }
      }
      
      // Update character with new timestamp
      const characterWithMetadata: Omit<CharacterWithId, 'id'> = {
        ...characterWithDefaults,
        createdAt: Date.now(), // Keep original creation time
        updatedAt: Date.now()
      }

      // Update the character
      await set(ref(database, `${this.CHARACTERS_REF}/${characterId}`), characterWithMetadata)
    } catch (error) {
      console.error('Error updating character:', error)
      throw new Error('Failed to update character')
    }
  }

  /**
   * Get a character by ID
   */
  static async getCharacter(characterId: string): Promise<CharacterWithId | null> {
    try {
      const characterRef = ref(database, `${this.CHARACTERS_REF}/${characterId}`)
      const snapshot = await get(characterRef)

      if (snapshot.exists()) {
        const characterData = snapshot.val()
        return {
          id: characterId,
          ...characterData
        }
      }

      return null
    } catch (error) {
      console.error('Error getting character:', error)
      throw new Error('Failed to get character')
    }
  }

  /**
   * Get all characters
   */
  static async getAllCharacters(): Promise<CharacterWithId[]> {
    try {
      const charactersRef = ref(database, this.CHARACTERS_REF)
      const snapshot = await get(charactersRef)

      if (snapshot.exists()) {
        const characters: CharacterWithId[] = []
        snapshot.forEach((childSnapshot) => {
          characters.push({
            id: childSnapshot.key!,
            ...childSnapshot.val()
          })
        })
        return characters
      }

      return []
    } catch (error) {
      console.error('Error getting all characters:', error)
      throw new Error('Failed to get characters')
    }
  }

  /**
   * Get characters by name (search)
   */
  static async getCharactersByName(name: string): Promise<CharacterWithId[]> {
    try {
      const charactersRef = ref(database, this.CHARACTERS_REF)
      const nameQuery = query(charactersRef, orderByChild('name'), equalTo(name))
      const snapshot = await get(nameQuery)

      if (snapshot.exists()) {
        const characters: CharacterWithId[] = []
        snapshot.forEach((childSnapshot) => {
          characters.push({
            id: childSnapshot.key!,
            ...childSnapshot.val()
          })
        })
        return characters
      }

      return []
    } catch (error) {
      console.error('Error searching characters by name:', error)
      throw new Error('Failed to search characters')
    }
  }

  /**
   * Delete a character
   */
  static async deleteCharacter(characterId: string): Promise<void> {
    try {
      const characterRef = ref(database, `${this.CHARACTERS_REF}/${characterId}`)
      await remove(characterRef)
    } catch (error) {
      console.error('Error deleting character:', error)
      throw new Error('Failed to delete character')
    }
  }

  /**
   * Check if a character is complete (has both narrative and mechanical sections)
   */
  static isCharacterComplete(character: Character): boolean {
    // Check narrative section
    const hasNarrative = Boolean(character.name && 
      character.name.trim().length > 0 &&
      character.race &&
      character.classes &&
      character.classes.length > 0 &&
      character.classes[0].class)

    // Check mechanical section
    const hasMechanics = Boolean(character.abilityScores &&
      Object.values(character.abilityScores).some(score => score > 0) &&
      character.level &&
      character.level > 0)

    return hasNarrative && hasMechanics
  }

  /**
   * Get character completion status
   */
  static getCharacterCompletionStatus(character: Character): {
    isComplete: boolean
    narrativeComplete: boolean
    mechanicsComplete: boolean
    missingFields: string[]
  } {
    const missingFields: string[] = []
    
    // Check narrative fields
    if (!character.name || character.name.trim().length === 0) {
      missingFields.push('Character Name')
    }
    if (!character.race) {
      missingFields.push('Race')
    }
    if (!character.classes || character.classes.length === 0 || !character.classes[0].class) {
      missingFields.push('Class')
    }

    // Check mechanical fields
    if (!character.abilityScores || Object.values(character.abilityScores).every(score => score === 0)) {
      missingFields.push('Ability Scores')
    }
    if (!character.level || character.level <= 0) {
      missingFields.push('Level')
    }

    const narrativeComplete = Boolean(character.name && 
      character.name.trim().length > 0 &&
      character.race &&
      character.classes &&
      character.classes.length > 0 &&
      character.classes[0].class)

    const mechanicsComplete = Boolean(character.abilityScores &&
      Object.values(character.abilityScores).some(score => score > 0) &&
      character.level &&
      character.level > 0)

    const isComplete = narrativeComplete && mechanicsComplete

    return {
      isComplete,
      narrativeComplete,
      mechanicsComplete,
      missingFields
    }
  }
} 