"use client"

import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getBackgrounds, getBackgroundDetails } from "@/lib/dnd5e-api"
import { backgrounds } from "@/lib/data/backgrounds"

interface BackgroundFeature {
  name: string
  description: string
}

interface BackgroundDetails {
  name: string
  skillProficiencies: string[]
  toolProficiencies?: string[]
  languages: number
  equipment: string[]
  feature: BackgroundFeature
}

export function BackgroundSelector() {
  const { control, setValue } = useFormContext()
  const [apiBackgrounds, setApiBackgrounds] = useState<any[]>([])
  const [selectedBackground, setSelectedBackground] = useState<BackgroundDetails | null>(null)
  const [loadingBackgrounds, setLoadingBackgrounds] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Watch for background changes
  const watchedBackground = useWatch({ control, name: "background" })

  // Fetch backgrounds from API
  useEffect(() => {
    setLoadingBackgrounds(true)
    getBackgrounds().then((data) => {
      setApiBackgrounds(data.results)
      setLoadingBackgrounds(false)
    })
  }, [])

  // Fetch background details when selected
  useEffect(() => {
    if (!watchedBackground) {
      setSelectedBackground(null)
      return
    }

    setLoadingDetails(true)
    getBackgroundDetails(watchedBackground).then((data) => {
      setSelectedBackground({
        name: data.name,
        skillProficiencies: data.skill_proficiencies?.map((p: any) => p.name) || [],
        toolProficiencies: data.tool_proficiencies?.map((p: any) => p.name),
        languages: data.language_options?.choose || 0,
        equipment: data.starting_equipment?.map((e: any) => e.equipment.name) || [],
        feature: {
          name: data.feature?.name || "",
          description: data.feature?.desc || "",
        },
      })
      setLoadingDetails(false)

      // Update form values for proficiencies and equipment
      if (data.skill_proficiencies) {
        setValue("backgroundSkillProficiencies", data.skill_proficiencies.map((p: any) => p.index))
      }
      if (data.tool_proficiencies) {
        setValue("backgroundToolProficiencies", data.tool_proficiencies.map((p: any) => p.index))
      }
      if (data.language_options) {
        setValue("backgroundLanguages", data.language_options.choose)
      }
      if (data.starting_equipment) {
        setValue("backgroundEquipment", data.starting_equipment.map((e: any) => e.equipment.index))
      }
    })
  }, [watchedBackground, setValue])

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="background"
        rules={{ required: "Background is required." }}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="font-display text-lg">Background</FormLabel>
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={loadingBackgrounds}
            >
              <FormControl>
                <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                  <SelectValue placeholder={loadingBackgrounds ? "Loading backgrounds..." : "Select a background"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {loadingBackgrounds ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  apiBackgrounds.map((background) => (
                    <SelectItem key={background.index} value={background.index}>
                      {background.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
            {fieldState.error && (
              <div className="text-red-500 text-xs mt-1">{fieldState.error.message}</div>
            )}
          </FormItem>
        )}
      />

      {selectedBackground && (
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">{selectedBackground.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skill Proficiencies */}
            {selectedBackground.skillProficiencies.length > 0 && (
              <div>
                <h4 className="font-display text-sm mb-2">Skill Proficiencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBackground.skillProficiencies.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-amber-900/40 text-amber-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tool Proficiencies */}
            {selectedBackground.toolProficiencies && selectedBackground.toolProficiencies.length > 0 && (
              <div>
                <h4 className="font-display text-sm mb-2">Tool Proficiencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBackground.toolProficiencies.map((tool) => (
                    <Badge key={tool} variant="secondary" className="bg-amber-900/40 text-amber-200">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {selectedBackground.languages > 0 && (
              <div>
                <h4 className="font-display text-sm mb-2">Languages</h4>
                <p className="text-sm text-muted-foreground">
                  Choose {selectedBackground.languages} additional language{selectedBackground.languages > 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Equipment */}
            {selectedBackground.equipment.length > 0 && (
              <div>
                <h4 className="font-display text-sm mb-2">Starting Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBackground.equipment.map((item) => (
                    <Badge key={item} variant="secondary" className="bg-amber-900/40 text-amber-200">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Feature */}
            {selectedBackground.feature.name && (
              <div>
                <h4 className="font-display text-sm mb-2">Feature: {selectedBackground.feature.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedBackground.feature.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 