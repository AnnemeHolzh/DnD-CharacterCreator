"use client"

import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { backgrounds } from "@/lib/data/backgrounds"

interface BackgroundFeature {
  name: string
  description: string
}

interface BackgroundDetails {
  name: string
  skills: string[]
  tools?: string[]
  languages: string
  features: BackgroundFeature[]
  source: string
  abilityScoreOptions?: string[]
  originFeat?: string
}

export function BackgroundSelector() {
  const { control, setValue } = useFormContext()
  const [selectedBackground, setSelectedBackground] = useState<BackgroundDetails | null>(null)

  // Watch for background changes
  const watchedBackground = useWatch({ control, name: "background" })

  // Update selected background when background changes
  useEffect(() => {
    if (!watchedBackground) {
      setSelectedBackground(null)
      return
    }

    const background = backgrounds.find(bg => bg.id === watchedBackground)
    if (background) {
      setSelectedBackground({
        name: background.name,
        skills: background.skills,
        tools: background.tools,
        languages: background.languages,
        features: background.features,
        source: background.source,
        abilityScoreOptions: background.abilityScoreOptions,
        originFeat: background.originFeat
      })

      // Update form values for metadata
      setValue("backgroundMetadata", {
        id: background.id,
        name: background.name,
        source: background.source,
        skills: background.skills,
        tools: background.tools,
        languages: background.languages,
        features: background.features,
        abilityScoreOptions: background.abilityScoreOptions,
        originFeat: background.originFeat
      })
    }
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
            >
              <FormControl>
                <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                  <SelectValue placeholder="Select a background" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {backgrounds.map((background) => (
                  <SelectItem key={background.id} value={background.id}>
                    {background.name}
                  </SelectItem>
                ))}
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
            {selectedBackground.skills.length > 0 && (
              <div>
                <h4 className="font-display text-sm mb-2">Skill Proficiencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBackground.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-amber-900/40 text-amber-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tool Proficiencies */}
            {selectedBackground.tools && selectedBackground.tools.length > 0 && (
              <div>
                <h4 className="font-display text-sm mb-2">Tool Proficiencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBackground.tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="bg-amber-900/40 text-amber-200">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {selectedBackground.languages && selectedBackground.languages !== "None" && (
              <div>
                <h4 className="font-display text-sm mb-2">Languages</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedBackground.languages}
                </p>
              </div>
            )}

            {/* Features */}
            {selectedBackground.features && selectedBackground.features.length > 0 && (
              <div>
                <h4 className="font-display text-sm mb-2">Features</h4>
                {selectedBackground.features.map((feature, index) => (
                  <div key={index} className="mb-2">
                    <h5 className="text-sm font-semibold text-amber-400">{feature.name}</h5>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Source */}
            <div>
              <h4 className="font-display text-sm mb-2">Source</h4>
              <Badge variant="outline" className="text-xs">
                {selectedBackground.source}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 