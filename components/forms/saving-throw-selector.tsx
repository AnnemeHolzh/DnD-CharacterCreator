"use client"

import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateModifier, calculateTotalAbilityScoreIncreases } from "@/lib/utils/character-utils"
import { classes } from "@/lib/data/classes"
import { getFeatASIs } from "@/lib/data/feats"

const abilities = [
  { id: "strength", name: "Strength", abbr: "STR" },
  { id: "dexterity", name: "Dexterity", abbr: "DEX" },
  { id: "constitution", name: "Constitution", abbr: "CON" },
  { id: "intelligence", name: "Intelligence", abbr: "INT" },
  { id: "wisdom", name: "Wisdom", abbr: "WIS" },
  { id: "charisma", name: "Charisma", abbr: "CHA" },
]

export function SavingThrowSelector() {
  const { control, setValue } = useFormContext()
  const watchedClass = useWatch({ control, name: "class" })
  const watchedLevel = useWatch({ control, name: "level" })
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}
  const race = useWatch({ control, name: "race" })
  const subrace = useWatch({ control, name: "subrace" })
  const assignmentMode = useWatch({ control, name: "abilityScoreAssignmentMode" }) || "standard"
  const customAssignments = useWatch({ control, name: "customAbilityScoreAssignments" }) || {}
  const selectedFeats = useWatch({ control, name: "feats" }) || []
  const formFeatASIChoices = useWatch({ control, name: "featASIChoices" }) || {}
  const asiChoices = useWatch({ control, name: "asiChoices" }) || []

  // Calculate proficiency bonus based on level
  const proficiencyBonus = Math.floor((watchedLevel - 1) / 4) + 2

  // Get race/subrace bonuses
  const raceSubraceBonuses = useMemo(() => {
    if (!race) return {}
    return calculateTotalAbilityScoreIncreases(race, subrace || "")
  }, [race, subrace])

  // Calculate feat ASI bonuses
  const featASIs = useMemo(() => {
    return getFeatASIs(selectedFeats, formFeatASIChoices)
  }, [selectedFeats, formFeatASIChoices])

  // Calculate ASI bonuses from user choices
  const asiBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    }
    
    asiChoices.forEach((choice: { choice: "single" | "double", abilities: string[] }) => {
      choice.abilities.forEach((ability: string) => {
        if (choice.choice === "single") {
          bonuses[ability] += 2
        } else {
          bonuses[ability] += 1
        }
      })
    })
    
    return bonuses
  }, [asiChoices])

  // Calculate total ability scores with bonuses
  const totalAbilityScores = useMemo(() => {
    const baseScores = abilityScores || {}
    const totalScores: Record<string, number> = {}
    
    abilities.forEach(ability => {
      const baseScore = Number(baseScores[ability.id]) || 0
      let bonus = 0
      
      if (assignmentMode === "standard") {
        bonus = raceSubraceBonuses[ability.id] || 0
      } else {
        // Custom mode: check if this ability is assigned any flexible bonuses
        Object.values(customAssignments).forEach(assignedAbility => {
          if (assignedAbility === ability.id) {
            bonus += 1 // Each flexible bonus gives +1
          }
        })
      }
      
      // Add feat ASI bonuses
      bonus += featASIs[ability.id] || 0
      
      // Add user ASI choices
      bonus += asiBonuses[ability.id] || 0
      
      totalScores[ability.id] = baseScore + bonus
    })
    
    return totalScores
  }, [abilityScores, raceSubraceBonuses, assignmentMode, customAssignments, featASIs, asiBonuses])

  // Update saving throw proficiencies when class changes
  useEffect(() => {
    if (watchedClass) {
      const classData = classes.find(c => c.id === watchedClass)
      if (classData) {
        // Set the class's saving throw proficiencies
        setValue("savingThrowProficiencies", classData.savingThrows)
      }
    }
  }, [watchedClass, setValue])

  return (
    <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg">Saving Throws</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {abilities.map((ability) => {
            const modifier = calculateModifier(totalAbilityScores[ability.id] || 10)
            const isProficient = watchedClass && classes.find(c => c.id === watchedClass)?.savingThrows.includes(ability.id)
            const totalBonus = modifier + (isProficient ? proficiencyBonus : 0)

            return (
              <TooltipProvider key={ability.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`saving-throw-${ability.id}`}
                        checked={isProficient}
                        disabled={true} // Saving throws are determined by class
                      />
                      <label
                        htmlFor={`saving-throw-${ability.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {ability.name}
                      </label>
                      <Badge variant="outline" className="ml-2">
                        {totalBonus >= 0 ? '+' : ''}{totalBonus}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Base Modifier: {modifier >= 0 ? '+' : ''}{modifier}</p>
                    {isProficient && (
                      <p>Proficiency Bonus: +{proficiencyBonus}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 