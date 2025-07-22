"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { Plus, Trash2 } from "lucide-react"

export function ProgressionSection() {
  const { control, setValue, getValues } = useFormContext()

  const watchedLevel = useWatch({ control, name: "level" })
  const watchedProgression = useWatch({ control, name: "levelProgression" }) || []

  const addLevelEntry = (level: number) => {
    const currentProgression = getValues("levelProgression") || []

    // Check if entry already exists
    if (!currentProgression.find((entry) => entry.level === level)) {
      setValue("levelProgression", [
        ...currentProgression,
        {
          level,
          featuresGained: "",
          spellsLearned: "",
          equipmentChanges: "",
          notes: "",
        },
      ])
    }
  }

  const removeLevelEntry = (level: number) => {
    const currentProgression = getValues("levelProgression") || []
    setValue(
      "levelProgression",
      currentProgression.filter((entry) => entry.level !== level),
    )
  }

  // Generate array of levels from 1 to character level
  const levels = Array.from({ length: watchedLevel }, (_, i) => i + 1)

  return (
    <div className="space-y-8">
      <FantasyFormSection title="Level Progression">
        <p className="text-muted-foreground mb-4">
          Track your character's growth through each level. Add notes about features gained, spells learned, and
          equipment changes.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {levels.map((level) => {
            const hasEntry = watchedProgression.some((entry) => entry.level === level)

            return (
              <Button
                key={level}
                variant={hasEntry ? "default" : "outline"}
                size="sm"
                onClick={() => addLevelEntry(level)}
                className={`
                  font-display 
                  ${hasEntry ? "bg-emerald-900 hover:bg-emerald-800" : ""}
                `}
              >
                {level}
              </Button>
            )
          })}
        </div>

        <Accordion type="single" collapsible className="w-full">
          {watchedProgression
            .sort((a, b) => a.level - b.level)
            .map((entry, index) => (
              <AccordionItem key={index} value={`level-${entry.level}`} className="border-amber-800/30">
                <AccordionTrigger className="font-display text-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center mr-2">
                      {entry.level}
                    </div>
                    <span>Level {entry.level}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <FormField
                      control={control}
                      name={`levelProgression.${index}.featuresGained`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Features Gained</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Class features, racial abilities, etc."
                              className="min-h-[80px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`levelProgression.${index}.spellsLearned`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spells Learned</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="New spells acquired at this level"
                              className="min-h-[80px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`levelProgression.${index}.equipmentChanges`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Changes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Items acquired or lost"
                              className="min-h-[80px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`levelProgression.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Other important events or changes"
                              className="min-h-[80px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeLevelEntry(entry.level)}
                      className="mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Level {entry.level}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>

        {watchedProgression.length === 0 && (
          <div className="text-center py-8 border border-dashed border-amber-800/30 rounded-md">
            <p className="text-muted-foreground mb-4">No level progression entries yet.</p>
            <Button type="button" variant="outline" onClick={() => addLevelEntry(1)} className="group">
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
              Add Level 1
            </Button>
          </div>
        )}
      </FantasyFormSection>
    </div>
  )
}
