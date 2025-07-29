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
    
    // COMMENTED OUT VALIDATION FOR TESTING
    /*
    // Trigger validation to ensure all validations are run
    const isValid = await methods.trigger()
    
    if (!isValid) {
      // Get specific validation errors to show which fields are missing
      const errors = methods.formState.errors
      const formValues = methods.getValues()
      const missingFields: string[] = []
      
      // Debug: Log form values to understand what's happening
      console.log('Form values:', formValues)
      console.log('Form errors:', errors)
      console.log('Ability scores:', formValues.abilityScores)
      console.log('Form state:', methods.formState)
      console.log('Is form valid:', isValid)
      
      // Check for specific field errors
      if (errors.name) missingFields.push('Character Name')
      if (errors.race) missingFields.push('Race')
      if (errors.classes) missingFields.push('Class')
      if (errors.level) missingFields.push('Level')
      
      // Check for nested class errors
      if (errors.classes && Array.isArray(errors.classes)) {
        errors.classes.forEach((classError: any, index: number) => {
          if (classError?.class) missingFields.push(`Class ${index + 1}`)
          if (classError?.subclass) missingFields.push(`Subclass ${index + 1}`)
          if (classError?.level) missingFields.push(`Class ${index + 1} Level`)
        })
      }
      
      // Also check actual form values against completion requirements
      if (!formValues.name || formValues.name.trim().length === 0) {
        if (!missingFields.includes('Character Name')) missingFields.push('Character Name')
      }
      if (!formValues.race) {
        if (!missingFields.includes('Race')) missingFields.push('Race')
      }
      if (!formValues.classes || formValues.classes.length === 0 || !formValues.classes[0].class) {
        if (!missingFields.includes('Class')) missingFields.push('Class')
      }
      if (!formValues.level || formValues.level <= 0) {
        if (!missingFields.includes('Level')) missingFields.push('Level')
      }
      
      // Check total level validation
      if (formValues.classes && formValues.classes.length > 0) {
        const totalLevel = formValues.classes.reduce((sum: number, classEntry: any) => {
          return sum + (classEntry?.level || 0);
        }, 0);
        if (totalLevel > 20) {
          missingFields.push('Total level exceeds 20')
        }
      }
      
      // Create error message with specific missing fields
      let errorMessage = "Please complete all required fields before saving"
      if (missingFields.length > 0) {
        errorMessage += `: ${missingFields.join(', ')}`
      }
      
      setSaveError(errorMessage)
      return
    }
    */

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
