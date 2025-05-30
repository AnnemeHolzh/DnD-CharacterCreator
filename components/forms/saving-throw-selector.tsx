"use client"

import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateModifier } from "@/lib/utils/character-utils"
import { classes } from "@/lib/data/classes"

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

  // Calculate proficiency bonus based on level
  const proficiencyBonus = Math.floor((watchedLevel - 1) / 4) + 2

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
            const modifier = calculateModifier(abilityScores[ability.id] || 10)
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