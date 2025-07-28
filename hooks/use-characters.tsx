import { useState, useCallback } from 'react'
import { CharacterService, type Character, type CharacterWithId } from '@/lib/services/character-service'
import { useToast } from '@/hooks/use-toast'

export type { CharacterWithId }

export function useCharacters() {
  const [characters, setCharacters] = useState<CharacterWithId[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Load all characters
  const loadCharacters = useCallback(async () => {
    setLoading(true)
    try {
      const allCharacters = await CharacterService.getAllCharacters()
      setCharacters(allCharacters)
    } catch (error) {
      console.error('Error loading characters:', error)
      toast({
        title: "Error",
        description: "Failed to load characters. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Save a new character
  const saveCharacter = useCallback(async (character: Character): Promise<string | null> => {
    setSaving(true)
    try {
      // COMMENTED OUT VALIDATION FOR TESTING
      /*
      // Check if character is complete
      const completionStatus = CharacterService.getCharacterCompletionStatus(character)
      
      if (!completionStatus.isComplete) {
        toast({
          title: "Incomplete Character",
          description: `Please complete the following fields: ${completionStatus.missingFields.join(', ')}`,
          variant: "destructive"
        })
        return null
      }
      */

      const characterId = await CharacterService.saveCharacter(character)
      
      // Reload characters to get the updated list
      await loadCharacters()
      
      toast({
        title: "Success",
        description: "Character saved successfully!",
      })
      
      return characterId
    } catch (error) {
      console.error('Error saving character:', error)
      toast({
        title: "Error",
        description: "Failed to save character. Please try again.",
        variant: "destructive"
      })
      return null
    } finally {
      setSaving(false)
    }
  }, [loadCharacters, toast])

  // Update an existing character
  const updateCharacter = useCallback(async (characterId: string, character: Character): Promise<boolean> => {
    setSaving(true)
    try {
      // COMMENTED OUT VALIDATION FOR TESTING
      /*
      // Check if character is complete
      const completionStatus = CharacterService.getCharacterCompletionStatus(character)
      
      if (!completionStatus.isComplete) {
        toast({
          title: "Incomplete Character",
          description: `Please complete the following fields: ${completionStatus.missingFields.join(', ')}`,
          variant: "destructive"
        })
        return false
      }
      */

      await CharacterService.updateCharacter(characterId, character)
      
      // Reload characters to get the updated list
      await loadCharacters()
      
      toast({
        title: "Success",
        description: "Character updated successfully!",
      })
      
      return true
    } catch (error) {
      console.error('Error updating character:', error)
      toast({
        title: "Error",
        description: "Failed to update character. Please try again.",
        variant: "destructive"
      })
      return false
    } finally {
      setSaving(false)
    }
  }, [loadCharacters, toast])

  // Load a single character
  const loadCharacter = useCallback(async (characterId: string): Promise<CharacterWithId | null> => {
    setLoading(true)
    try {
      const character = await CharacterService.getCharacter(characterId)
      return character
    } catch (error) {
      console.error('Error loading character:', error)
      toast({
        title: "Error",
        description: "Failed to load character. Please try again.",
        variant: "destructive"
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Delete a character
  const deleteCharacter = useCallback(async (characterId: string): Promise<boolean> => {
    try {
      await CharacterService.deleteCharacter(characterId)
      
      // Reload characters to get the updated list
      await loadCharacters()
      
      toast({
        title: "Success",
        description: "Character deleted successfully!",
      })
      
      return true
    } catch (error) {
      console.error('Error deleting character:', error)
      toast({
        title: "Error",
        description: "Failed to delete character. Please try again.",
        variant: "destructive"
      })
      return false
    }
  }, [loadCharacters, toast])

  // Search characters by name
  const searchCharacters = useCallback(async (name: string): Promise<CharacterWithId[]> => {
    try {
      const results = await CharacterService.getCharactersByName(name)
      return results
    } catch (error) {
      console.error('Error searching characters:', error)
      toast({
        title: "Error",
        description: "Failed to search characters. Please try again.",
        variant: "destructive"
      })
      return []
    }
  }, [toast])

  // Get character completion status
  const getCharacterCompletionStatus = useCallback((character: Character) => {
    return CharacterService.getCharacterCompletionStatus(character)
  }, [])

  // Check if character is complete
  const isCharacterComplete = useCallback((character: Character) => {
    return CharacterService.isCharacterComplete(character)
  }, [])

  return {
    characters,
    loading,
    saving,
    loadCharacters,
    saveCharacter,
    updateCharacter,
    loadCharacter,
    deleteCharacter,
    searchCharacters,
    getCharacterCompletionStatus,
    isCharacterComplete
  }
} 