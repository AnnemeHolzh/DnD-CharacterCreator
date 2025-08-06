"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Sparkles, Save, CheckCircle, AlertCircle, AlertTriangle, ArrowRight } from "lucide-react"
import { NarrativeSection } from "@/components/forms/narrative-section"
import { MechanicsSection } from "@/components/forms/mechanics-section"
import { FeedbackSection } from "@/components/forms/feedback-section"
import { CharacterSchema } from "@/lib/schemas/character-schema"
import { FantasyCard } from "@/components/ui/fantasy-card"
import { useCharacters } from "@/hooks/use-characters"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateCharacterForm, formatValidationErrors } from "@/lib/utils/character-validation"
import { calculateTotalAbilityScoreIncreases } from "@/lib/utils/character-utils"
import { getFeatASIs } from "@/lib/data/feats"
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
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false)
  const { saveCharacter, updateCharacter, loadCharacter, getCharacterCompletionStatus, saving } = useCharacters()

  const methods = useForm<CharacterFormData>({
    resolver: zodResolver(CharacterSchema),
    mode: "onSubmit",
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
      asiChoices: [],
      featASIChoices: {},
      hp: 0,
      xp: 0,
      levelProgression: [],
    },
  })

  // Load existing character if editing
  useEffect(() => {
    if (characterId) {
      setIsLoadingCharacter(true)
      loadCharacter(characterId).then((character) => {
        if (character) {
          // Remove the id field before setting form values
          const { id, createdAt, updatedAt, ...characterData } = character
          

          
          methods.reset(characterData)
        }
      }).finally(() => {
        setIsLoadingCharacter(false)
      })
    }
  }, [characterId, loadCharacter, methods])

  // Scroll to top when switching to mechanics tab
  useEffect(() => {
    if (activeTab === "mechanics") {
      // Use setTimeout to ensure the tab content is rendered before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }, [activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Prevent any automatic focus behavior
    if (value === "mechanics") {
      // Blur any focused element to prevent automatic scrolling
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }
  }

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Get form data
    const formData = methods.getValues()
    
    // Run comprehensive validation
    const validationResult = validateCharacterForm(formData)
    
    if (!validationResult.isValid) {
      // Format validation errors for display
      const errorMessage = formatValidationErrors(validationResult.errors)
      setSaveError(errorMessage)
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

    // Trigger form validation to ensure all fields are updated
    await methods.trigger()

    // Add a small delay to ensure form is fully updated
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get the form data
    const formData = methods.getValues()
    
    // Calculate total ability scores with bonuses before saving
    const abilityScores = formData.abilityScores || {}
    const race = formData.race || ""
    const subrace = formData.subrace || ""
    const assignmentMode = formData.abilityScoreAssignmentMode || "standard"
    const customAssignments = formData.customAbilityScoreAssignments || {}
    const feats = formData.feats || []
    const asiChoices = formData.asiChoices || []
    const featASIChoices = formData.featASIChoices || {}
    
    // Calculate total ability scores
    const totalScores: Record<string, number> = {}
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
    
    // Get race/subrace bonuses
    const raceSubraceBonuses = calculateTotalAbilityScoreIncreases(race, subrace)
    
    // Calculate feat ASI bonuses
    const featASIs: Record<string, number> = {}
    if (feats.length > 0) {
      const featASIBonuses = getFeatASIs(feats, featASIChoices)
      Object.entries(featASIBonuses).forEach(([ability, bonus]) => {
        featASIs[ability] = bonus
      })
    }
    
    // Calculate ASI bonuses from user choices
    const asiBonuses: Record<string, number> = {}
    asiChoices.forEach((choice: { choice: "single" | "double", abilities: string[] }) => {
      choice.abilities.forEach(ability => {
        if (choice.choice === "single") {
          asiBonuses[ability] = (asiBonuses[ability] || 0) + 2
        } else {
          asiBonuses[ability] = (asiBonuses[ability] || 0) + 1
        }
      })
    })
    
    // Calculate total scores
    abilities.forEach(abilityId => {
      let baseScore = 0
      const assignment = (abilityScores as Record<string, any>)[abilityId]
      
      // Handle roll assignments or direct numeric values
      if (assignment && typeof assignment === 'object' && 'rollId' in assignment) {
        // Roll assignment - extract the numeric value
        baseScore = assignment.value
      } else {
        // Direct numeric value (for standard array and point buy)
        baseScore = Number(assignment) || 0
      }
      
      let bonus = 0
      
      if (assignmentMode === "standard") {
        bonus = (raceSubraceBonuses as Record<string, number>)[abilityId] || 0
      } else {
        Object.values(customAssignments).forEach(assignedAbility => {
          if (assignedAbility === abilityId) {
            bonus += 1
          }
        })
      }
      
      bonus += featASIs[abilityId] || 0
      bonus += asiBonuses[abilityId] || 0
      
      totalScores[abilityId] = baseScore + bonus
    })
    
    // Update the form with total ability scores
    methods.setValue("abilityScores", totalScores)
    
    // Get the updated form data
    const updatedFormData = methods.getValues()
    console.log("Saving character data:", updatedFormData)
    console.log("Total ability scores being saved:", updatedFormData.abilityScores)
    
    const validationResult = validateCharacterForm(updatedFormData)
    
    if (!validationResult.isValid) {
      console.log("Form validation failed during save")
      const errorMessage = formatValidationErrors(validationResult.errors)
      setSaveError(errorMessage)
      return
    }

    setIsSubmitting(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      if (characterId) {
        // Update existing character
        await updateCharacter(characterId, updatedFormData)
        console.log("Character updated successfully")
        setSaveSuccess(true)
      } else {
        // Save new character
        const newCharacterId = await saveCharacter(updatedFormData)
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

  // Show loading state while character is being loaded
  if (isLoadingCharacter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <LoadingSpinner size="lg" text="Loading character data..." />
        <p className="text-bg3-gold-light/80 font-display tracking-wider">
          Retrieving your character from the ancient archives...
        </p>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form className="space-y-8">
        <FantasyCard className="relative overflow-hidden">
          <div className="relative z-10">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                {activeTab === "narrative" ? (
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("mechanics")}
                    className="group bg-gradient-to-r from-amber-900/40 to-amber-800/30 border-amber-600/50 hover:from-amber-900/60 hover:to-amber-800/50 text-amber-200"
                  >
                    Continue to Mechanics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      onClick={() => {
                        console.log('Current form values:', methods.getValues())
                        console.log('Form errors:', methods.formState.errors)
                        console.log('Form state:', methods.formState)
                      }}
                      className="group bg-gradient-to-r from-blue-900/40 to-blue-800/30 border-blue-600/50 hover:from-blue-900/60 hover:to-blue-800/50 text-blue-200"
                    >
                      Debug Form
                    </Button>
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
                  </>
                )}
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
                type="button"
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
                type="button"
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
