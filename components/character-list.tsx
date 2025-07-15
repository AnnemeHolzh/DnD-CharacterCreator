"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User
} from "lucide-react"
import { useCharacters, type CharacterWithId } from "@/hooks/use-characters"
import { formatDistanceToNow } from "date-fns"

interface CharacterListProps {
  onSelectCharacter?: (characterId: string) => void
  onEditCharacter?: (characterId: string) => void
  onCreateNew?: () => void
}

export function CharacterList({ onSelectCharacter, onEditCharacter, onCreateNew }: CharacterListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCharacters, setFilteredCharacters] = useState<CharacterWithId[]>([])
  const { characters, loading, deleteCharacter, searchCharacters, getCharacterCompletionStatus } = useCharacters()

  // Load characters on mount
  useEffect(() => {
    // This would be called from the parent component or on mount
  }, [])

  // Filter characters based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCharacters(characters)
    } else {
      const filtered = characters.filter(character =>
        character.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.race?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.classes?.some(c => c.class?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredCharacters(filtered)
    }
  }, [characters, searchTerm])

  const handleDeleteCharacter = async (characterId: string, characterName: string) => {
    if (confirm(`Are you sure you want to delete "${characterName}"? This action cannot be undone.`)) {
      await deleteCharacter(characterId)
    }
  }

  const getCompletionStatus = (character: CharacterWithId) => {
    const status = getCharacterCompletionStatus(character)
    return {
      isComplete: status.isComplete,
      narrativeComplete: status.narrativeComplete,
      mechanicsComplete: status.mechanicsComplete,
      missingFields: status.missingFields
    }
  }

  const getCharacterSummary = (character: CharacterWithId) => {
    const classes = character.classes?.map((c: any) => `${c.class} ${c.level}`).join(" / ") || "No Class"
    const race = character.race || "No Race"
    const level = character.level || 1
    
    return {
      classes,
      race,
      level
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading characters...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Your Characters</h2>
          <p className="text-muted-foreground">
            {filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button onClick={onCreateNew} className="bg-amber-900/40 border-amber-800/30 hover:bg-amber-900/60">
          <Plus className="h-4 w-4 mr-2" />
          Create New Character
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search characters by name, race, or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-amber-800/30 bg-black/20 backdrop-blur-sm"
        />
      </div>

      {/* Character Grid */}
      {filteredCharacters.length === 0 ? (
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-display mb-2">No characters found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "No characters match your search." : "Create your first character to get started!"}
            </p>
            {!searchTerm && (
              <Button onClick={onCreateNew} variant="outline" className="border-amber-800/30">
                <Plus className="h-4 w-4 mr-2" />
                Create Character
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharacters.map((character) => {
            const completion = getCompletionStatus(character)
            const summary = getCharacterSummary(character)
            
            return (
              <Card key={character.id} className="border-amber-800/30 bg-black/20 backdrop-blur-sm hover:border-amber-600/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-display text-lg mb-2">
                        {character.name || "Unnamed Character"}
                      </CardTitle>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {summary.race} • {summary.classes}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Level {summary.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {completion.isComplete ? (
                        <Badge variant="outline" className="border-green-600/50 bg-green-900/20 text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-yellow-600/50 bg-yellow-900/20 text-yellow-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Incomplete
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Completion Status */}
                    {!completion.isComplete && completion.missingFields.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <p className="mb-1">Missing: {completion.missingFields.slice(0, 3).join(", ")}</p>
                        {completion.missingFields.length > 3 && (
                          <p>...and {completion.missingFields.length - 3} more</p>
                        )}
                      </div>
                    )}

                    {/* Last Updated */}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Updated {formatDistanceToNow(character.updatedAt, { addSuffix: true })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {onSelectCharacter && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-amber-800/30 bg-black/20 hover:bg-amber-900/20"
                          onClick={() => onSelectCharacter(character.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                      {onEditCharacter && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-amber-800/30 bg-black/20 hover:bg-amber-900/20"
                          onClick={() => onEditCharacter(character.id)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-800/30 bg-red-900/20 hover:bg-red-900/40 text-red-300"
                        onClick={() => handleDeleteCharacter(character.id, character.name || "this character")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 