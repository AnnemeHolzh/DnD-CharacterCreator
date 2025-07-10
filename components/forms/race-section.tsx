"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { races, getSubracesForRace, validateRaceSubraceCombination } from "@/lib/data/races"
import { useEffect } from "react"

export function RaceSection() {
  const { control, setValue, formState: { errors }, trigger } = useFormContext()
  
  // Watch the race field to update subrace options
  const selectedRace = useWatch({
    control,
    name: "race",
  })

  // Watch the subrace field for validation
  const selectedSubrace = useWatch({
    control,
    name: "subrace",
  })

  // Get available subraces for the selected race
  const availableSubraces = selectedRace ? getSubracesForRace(selectedRace) : []

  // Reset subrace when race changes
  useEffect(() => {
    if (selectedRace) {
      setValue("subrace", "")
      // Trigger validation for subrace field
      trigger("subrace")
    }
  }, [selectedRace, setValue, trigger])

  // Validate subrace when it changes
  useEffect(() => {
    if (selectedSubrace && selectedRace) {
      const isValid = validateRaceSubraceCombination(selectedRace, selectedSubrace)
      if (!isValid) {
        setValue("subrace", "")
      }
    }
  }, [selectedSubrace, selectedRace, setValue])

  return (
    <FantasyFormSection title="Race">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="race"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-display text-lg">Race</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                    <SelectValue placeholder="Select a race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      -- Select a race --
                    </SelectItem>
                    {races.map((race) => (
                      <SelectItem key={race.id} value={race.id}>
                        {race.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="subrace"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-display text-lg">Subrace</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!selectedRace}
                >
                  <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                    <SelectValue placeholder={selectedRace ? "Select a subrace" : "Select a race first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      -- Select a subrace --
                    </SelectItem>
                    {availableSubraces.map((subrace) => (
                      <SelectItem key={subrace.id} value={subrace.id}>
                        {subrace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FantasyFormSection>
  )
}