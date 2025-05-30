"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { AbilityScoreSelector } from "@/components/forms/ability-score-selector"
import { SkillSelector } from "@/components/forms/skill-selector"
import { EquipmentSelector } from "@/components/forms/equipment-selector"
import { classes } from "@/lib/data/classes"
import { races } from "@/lib/data/races"

export function MechanicsSection() {
  const { control } = useFormContext()

  return (
    <div className="space-y-8">
      <FantasyFormSection title="Class & Race">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-lg">Class</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((class_) => (
                        <SelectItem key={class_.id} value={class_.id}>
                          {class_.name}
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
        </div>

        <FormField
          control={control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-display text-lg">Level</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Enter character level (1-20)"
                  className="border-amber-800/30 bg-black/20 backdrop-blur-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FantasyFormSection>

      <FantasyFormSection title="Ability Scores">
        <AbilityScoreSelector />
      </FantasyFormSection>

      <FantasyFormSection title="Skills & Proficiencies">
        <SkillSelector />
      </FantasyFormSection>

      <FantasyFormSection title="Equipment">
        <EquipmentSelector />
      </FantasyFormSection>
    </div>
  )
}
