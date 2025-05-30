"use client"

import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { calculateModifier } from "@/lib/utils/character-utils"

export function AbilityScoreSelector() {
  const { control, setValue, getValues } = useFormContext()

  const abilityScoreMethod = useWatch({ control, name: "abilityScoreMethod" })
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}

  // Set up standard array when that method is selected
  useEffect(() => {
    if (abilityScoreMethod === "standard-array") {
      // Reset to default values
      setValue("abilityScores", {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      })
    }
  }, [abilityScoreMethod, setValue])

  const abilities = [
    { id: "strength", name: "Strength", abbr: "STR" },
    { id: "dexterity", name: "Dexterity", abbr: "DEX" },
    { id: "constitution", name: "Constitution", abbr: "CON" },
    { id: "intelligence", name: "Intelligence", abbr: "INT" },
    { id: "wisdom", name: "Wisdom", abbr: "WIS" },
    { id: "charisma", name: "Charisma", abbr: "CHA" },
  ]

  // Standard array values
  const standardArray = [15, 14, 13, 12, 10, 8]

  // Track which standard array values have been used
  const usedStandardArrayValues = Object.values(abilityScores).filter((score) => standardArray.includes(Number(score)))

  // Get available standard array values
  const availableStandardArrayValues = standardArray.filter((value) => !usedStandardArrayValues.includes(value))

  // Validation logic
  const validateAbility = (value: number, abilityId: string) => {
    if (abilityScoreMethod === "manual") {
      if (value < 3 || value > 18) return "Score must be between 3 and 18."
    }
    if (abilityScoreMethod === "point-buy") {
      if (value < 8 || value > 15) return "Score must be between 8 and 15 for point buy."
      // Check if total points spent exceeds 27
      const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
      const totalPoints = abilities.reduce((total, ab) => {
        const v = ab.id === abilityId ? value : Number(abilityScores[ab.id]) || 8
        return total + (pointCosts[v] ?? 0)
      }, 0)
      if (totalPoints > 27) return "Total points spent cannot exceed 27."
    }
    if (abilityScoreMethod === "standard-array") {
      if (!standardArray.includes(value)) return "Must use a standard array value."
      // Prevent duplicate values
      const used = abilities.filter((ab) => ab.id !== abilityId).map((ab) => abilityScores[ab.id])
      if (used.includes(value)) return "Each value can only be used once."
    }
    return undefined
  }

  // Calculate total points spent for point buy
  const pointBuyTotal = useMemo(() => {
    if (abilityScoreMethod !== "point-buy") return 0
    const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
    return abilities.reduce((total, ab) => {
      const v = Number(abilityScores[ab.id]) || 8
      return total + (pointCosts[v] ?? 0)
    }, 0)
  }, [abilityScores, abilityScoreMethod])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {abilities.map((ability) => (
          <FormField
            key={ability.id}
            control={control}
            name={`abilityScores.${ability.id}`}
            rules={{
              validate: (value) => validateAbility(value, ability.id)
            }}
            render={({ field, fieldState }) => {
              const modifier = calculateModifier(field.value)
              const modifierText = modifier >= 0 ? `+${modifier}` : modifier

              return (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center border border-amber-800/30">
                      <span className="font-display text-lg">{ability.abbr}</span>
                    </div>
                    <div className="flex-1">
                      <FormLabel className="font-display">{ability.name}</FormLabel>
                      <div className="flex items-center gap-2">
                        {abilityScoreMethod === "standard-array" ? (
                          <select
                            value={field.value}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            className="flex h-10 w-full rounded-md border border-amber-800/30 bg-black/20 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value={field.value}>{field.value === 0 ? "Select" : field.value}</option>
                            {availableStandardArrayValues.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        ) : abilityScoreMethod === "point-buy" ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="w-8 h-8 rounded bg-amber-900/40 text-amber-200 font-bold flex items-center justify-center border border-amber-800/30 disabled:opacity-40"
                              onClick={() => field.onChange(Math.max(8, (Number(field.value) || 8) - 1))}
                              disabled={Number(field.value) <= 8}
                              aria-label={`Decrease ${ability.name}`}
                            >
                              –
                            </button>
                            <Input
                              type="number"
                              min={8}
                              max={15}
                              value={field.value}
                              readOnly
                              className="w-16 text-center border-amber-800/30 bg-black/20 backdrop-blur-sm cursor-default"
                              tabIndex={-1}
                            />
                            <button
                              type="button"
                              className="w-8 h-8 rounded bg-amber-900/40 text-amber-200 font-bold flex items-center justify-center border border-amber-800/30 disabled:opacity-40"
                              onClick={() => {
                                // Calculate new value and check if it would exceed 27 points
                                const current = Number(field.value) || 8
                                const next = current + 1
                                if (next > 15) return
                                const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
                                const newTotal = abilities.reduce((total, ab) => {
                                  if (ab.id === ability.id) {
                                    return total + (pointCosts[next] ?? 0)
                                  }
                                  const v = Number(abilityScores[ab.id]) || 8
                                  return total + (pointCosts[v] ?? 0)
                                }, 0)
                                if (newTotal > 27) return
                                field.onChange(next)
                              }}
                              disabled={
                                Number(field.value) >= 15 || (() => {
                                  const current = Number(field.value) || 8
                                  const next = current + 1
                                  if (next > 15) return true
                                  const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
                                  const newTotal = abilities.reduce((total, ab) => {
                                    if (ab.id === ability.id) {
                                      return total + (pointCosts[next] ?? 0)
                                    }
                                    const v = Number(abilityScores[ab.id]) || 8
                                    return total + (pointCosts[v] ?? 0)
                                  }, 0)
                                  return newTotal > 27
                                })()
                              }
                              aria-label={`Increase ${ability.name}`}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <Input
                            type="number"
                            min={1}
                            max={20}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            className="border-amber-800/30 bg-black/20 backdrop-blur-sm"
                          />
                        )}
                        <div className="w-10 h-10 rounded-md bg-emerald-900/20 flex items-center justify-center border border-amber-800/30">
                          <span className="font-display text-sm">{modifierText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                  {fieldState.error && (
                    <div className="text-red-500 text-xs mt-1">{fieldState.error.message}</div>
                  )}
                </FormItem>
              )
            }}
          />
        ))}
      </div>

      {abilityScoreMethod === "point-buy" && (
        <div className="p-4 border border-amber-800/30 rounded-md bg-black/20 backdrop-blur-sm">
          <h4 className="font-display text-lg mb-2">Point Buy</h4>
          <p className="text-sm text-muted-foreground">
            You have 27 points to spend. Scores cost: 8 (0), 9 (1), 10 (2), 11 (3), 12 (4), 13 (5), 14 (7), 15 (9).
          </p>
          <div className="mt-2 text-sm">
            <span className="font-medium">Points spent:</span>
            <span className="ml-2">
              {pointBuyTotal}/27
            </span>
            {pointBuyTotal > 27 && (
              <span className="ml-4 text-red-500">You have exceeded the point buy limit!</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
