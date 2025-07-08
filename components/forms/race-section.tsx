"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { races } from "@/lib/data/races"

export function RaceSection() {
  const { control } = useFormContext()

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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                    <SelectValue placeholder="Select a subrace" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Subrace options will be populated based on selected race */}
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