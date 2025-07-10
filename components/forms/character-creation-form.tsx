"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, Save } from "lucide-react"
import { NarrativeSection } from "@/components/forms/narrative-section"
import { MechanicsSection } from "@/components/forms/mechanics-section"
import { ProgressionSection } from "@/components/forms/progression-section"
import { CharacterSchema } from "@/lib/schemas/character-schema"
import { FantasyCard } from "@/components/ui/fantasy-card"
import type { z } from "zod"

type CharacterFormData = z.infer<typeof CharacterSchema>

export default function CharacterCreationForm() {
  const [activeTab, setActiveTab] = useState("narrative")
  const [isSaving, setIsSaving] = useState(false)

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
      hp: 0,
      xp: 0,
      levelProgression: [],
    },
  })

  const onSubmit = async (data: CharacterFormData) => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Form submitted:", data)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <FantasyCard className="relative overflow-hidden">
          <div className="relative z-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="narrative">Narrative</TabsTrigger>
                <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
                <TabsTrigger value="progression">Progression</TabsTrigger>
              </TabsList>

              <TabsContent value="narrative">
                <NarrativeSection />
              </TabsContent>

              <TabsContent value="mechanics">
                <MechanicsSection />
              </TabsContent>

              <TabsContent value="progression">
                <ProgressionSection />
              </TabsContent>

              <div className="flex justify-end space-x-4 mt-6">
                <Button type="submit" disabled={isSaving} className="group">
                  {isSaving ? (
                    <>
                      Saving <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
                    </>
                  ) : (
                    <>
                      Save Character <Save className="ml-2 h-4 w-4" />
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
    </FormProvider>
  )
}
