"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { CharacterList } from "@/components/character-list"
import CharacterCreationForm from "@/components/forms/character-creation-form"
import { useCharacters } from "@/hooks/use-characters"

export default function CharactersPage() {
  const [view, setView] = useState<"list" | "create" | "edit">("list")
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  const { loadCharacters } = useCharacters()

  // Load characters on mount
  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  const handleCreateNew = () => {
    setSelectedCharacterId(null)
    setView("create")
  }

  const handleEditCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId)
    setView("edit")
  }

  const handleViewCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId)
    setView("edit") // For now, edit view also serves as view mode
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedCharacterId(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      {view !== "list" && (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-4 border-amber-800/30 bg-black/20 hover:bg-amber-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Characters
          </Button>
          <h1 className="text-3xl font-display font-bold">
            {view === "create" ? "Create New Character" : "Edit Character"}
          </h1>
        </div>
      )}

      {/* Content */}
      {view === "list" && (
        <CharacterList
          onSelectCharacter={handleViewCharacter}
          onEditCharacter={handleEditCharacter}
          onCreateNew={handleCreateNew}
        />
      )}

      {(view === "create" || view === "edit") && (
        <div className="max-w-4xl mx-auto">
          <CharacterCreationForm
            characterId={selectedCharacterId || undefined}
          />
        </div>
      )}
    </div>
  )
} 