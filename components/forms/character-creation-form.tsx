"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, Save, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"
import { NarrativeSection } from "@/components/forms/narrative-section"
import { MechanicsSection } from "@/components/forms/mechanics-section"
import { FeedbackSection } from "@/components/forms/feedback-section"
import { CharacterSchema } from "@/lib/schemas/character-schema"
import { FantasyCard } from "@/components/ui/fantasy-card"
import { useCharacters } from "@/hooks/use-characters"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { z } from "zod"

type CharacterFormData = z.infer<typeof CharacterSchema>

interface CharacterCreationFormProps {
  characterId?: string // For editing existing characters
}

export default function CharacterCreationForm({ characterId }: CharacterCreationFormProps) {
  const [activeTab, setActiveTab] = useState("narrative")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const { saveCharacter, updateCharacter, loadCharacter, getCharacterCompletionStatus, saving } = useCharacters()

  const methods = useForm<CharacterFormData>({
    resolver: zodResolver(CharacterSchema),
    defaultValues: {
      name: "",
      background: "",
      alignment: "true-neutral",
      appearance: "",
      backstory: "",
      personalityTraits: "",
      ideals: "",
      bonds: "",
      flaws: "",
      classes: [{ class: "", subclass: "", level: 1 }],
      race: "",
      subrace: "",
      level: 1,
      abilityScoreMethod: "standard-array",
      abilityScoreAssignmentMode: "standard",
      customAbilityScoreAssignments: {},
      abilityScores: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      },
      skills: [],
      proficiencies: [],
      equipment: [],
      spells: [],
      feats: [],
      featASIChoices: {},
      hp: 0,
      xp: 0,
      levelProgression: [],
    },
  })

  // Load existing character if editing
  useEffect(() => {
    if (characterId) {
      loadCharacter(characterId).then((character) => {
        if (character) {
          // Remove the id field before setting form values
          const { id, createdAt, updatedAt, ...characterData } = character
          methods.reset(characterData)
        }
      })
    }
  }, [characterId, loadCharacter, methods])

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Check if form is valid
    const isValid = methods.formState.isValid
    if (!isValid) {
      setSaveError("Please complete all required fields before saving")
      return
    }

    // Show confirmation dialog
    setShowSaveConfirmation(true)
  }

  const handleConfirmSave = async () => {
    // Prevent multiple submissions
    if (isSubmitting || saving) {
      console.log("Form submission blocked - already submitting")
      return
    }

    setIsSubmitting(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const formData = methods.getValues()
      
      if (characterId) {
        // Update existing character
        await updateCharacter(characterId, formData)
        console.log("Character updated successfully")
        setSaveSuccess(true)
      } else {
        // Save new character
        const newCharacterId = await saveCharacter(formData)
        console.log("Character saved successfully with ID:", newCharacterId)
        setSaveSuccess(true)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSaveError("Failed to save character. Please try again.")
    } finally {
      setIsSubmitting(false)
      setShowSaveConfirmation(false)
    }
  }

  const handleCancelSave = () => {
    setShowSaveConfirmation(false)
    setSaveError(null)
  }

  return (
    <FormProvider {...methods}>
      <form className="space-y-8">
        <FantasyCard className="relative overflow-hidden">
          <div className="relative z-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="narrative">Narrative</TabsTrigger>
                <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="narrative">
                <NarrativeSection />
              </TabsContent>

              <TabsContent value="mechanics">
                <MechanicsSection />
              </TabsContent>

              <TabsContent value="feedback">
                <FeedbackSection />
              </TabsContent>

              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  type="button" 
                  onClick={handleSaveClick}
                  disabled={saving || isSubmitting} 
                  className="group"
                >
                  {saving || isSubmitting ? (
                    <>
                      Saving <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
                    </>
                  ) : (
                    <>
                      {characterId ? 'Update' : 'Save'} Character <Save className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </Tabs>
          </div>
        </FantasyCard>
        
        {/* Arcane runes at bottom of form */}
        <div className="flex justify-center mt-4 opacity-60">
          <div className="w-64 h-16 bg-[url('/images/bg3-runes.png')] bg-no-repeat bg-contain bg-center"
               style={{ animation: "glyphPulse 7s infinite ease-in-out" }}></div>
        </div>
      </form>

      {/* Save Confirmation Dialog */}
      {showSaveConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/90 border border-amber-800/30 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
              <h3 className="text-lg font-display font-semibold">Confirm Save</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to {characterId ? 'update' : 'save'} this character? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={handleConfirmSave}
                disabled={saving || isSubmitting}
                className="flex-1 bg-amber-900/40 border-amber-800/30 hover:bg-amber-900/60"
              >
                {saving || isSubmitting ? (
                  <>
                    Saving <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    {characterId ? 'Update' : 'Save'} Character
                  </>
                )}
              </Button>
              <Button 
                onClick={handleCancelSave}
                variant="outline"
                className="flex-1 border-amber-800/30"
                disabled={saving || isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {saveSuccess && (
        <Alert className="border-green-800/30 bg-green-900/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            Character {characterId ? 'updated' : 'saved'} successfully!
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert className="border-red-800/30 bg-red-900/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            {saveError}
          </AlertDescription>
        </Alert>
      )}
    </FormProvider>
  )
}
