"use client"

import { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { calculateModifier, calculateTotalAbilityScoreIncreases, hasFlexibleAbilityScoreAssignment, getFlexibleBonusCount, validateCustomAbilityScoreAssignment } from "@/lib/utils/character-utils"
import { Dice6, Shuffle, Calculator, Settings, Plus, Minus } from "lucide-react"

export function AbilityScoreSelector() {
  const { control, setValue, getValues } = useFormContext()
  const [rolledScores, setRolledScores] = useState<number[]>([])
  const [isRolling, setIsRolling] = useState(false)

  const abilityScoreMethod = useWatch({ control, name: "abilityScoreMethod" }) || "standard-array"
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}
  const race = useWatch({ control, name: "race" })
  const subrace = useWatch({ control, name: "subrace" })
  const assignmentMode = useWatch({ control, name: "abilityScoreAssignmentMode" }) || "standard"
  const customAssignments = useWatch({ control, name: "customAbilityScoreAssignments" }) || {}

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

  // Get race/subrace bonuses
  const raceSubraceBonuses = useMemo(() => {
    if (!race) return {}
    return calculateTotalAbilityScoreIncreases(race, subrace || "")
  }, [race, subrace])

  // Check if flexible assignment is available
  const hasFlexibleAssignment = useMemo(() => {
    if (!race) return false
    return hasFlexibleAbilityScoreAssignment(race, subrace || "")
  }, [race, subrace])

  // Get flexible bonus count
  const flexibleBonusCount = useMemo(() => {
    if (!race) return { race: 0, subrace: 0 }
    return getFlexibleBonusCount(race, subrace || "")
  }, [race, subrace])

  // Roll 4d6 drop lowest function
  const roll4d6DropLowest = () => {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
    rolls.sort((a, b) => b - a) // Sort descending
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
  }

  // Roll all ability scores
  const rollAllScores = () => {
    setIsRolling(true)
    setTimeout(() => {
      const newRolledScores = Array.from({ length: 6 }, () => roll4d6DropLowest())
      setRolledScores(newRolledScores)
      setIsRolling(false)
    }, 500)
  }

  // Initialize rolled scores if method is roll and no scores exist
  useEffect(() => {
    if (abilityScoreMethod === "roll" && rolledScores.length === 0) {
      rollAllScores()
    }
  }, [abilityScoreMethod])

  // Reset ability scores when method changes
  useEffect(() => {
    if (abilityScoreMethod === "standard-array") {
      setValue("abilityScores", {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      })
    } else if (abilityScoreMethod === "point-buy") {
      setValue("abilityScores", {
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      })
    } else if (abilityScoreMethod === "roll") {
      // Don't auto-assign rolled scores, let user choose
      setValue("abilityScores", {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      })
    }
  }, [abilityScoreMethod, setValue])

  // Reset custom assignments when race/subrace changes
  useEffect(() => {
    if (assignmentMode === "custom") {
      setValue("customAbilityScoreAssignments", {})
    }
  }, [race, subrace, assignmentMode, setValue])

  // Track which standard array values have been used (only for standard-array method)
  const usedStandardArrayValues = abilityScoreMethod === "standard-array" 
    ? Object.values(abilityScores).filter((score) => standardArray.includes(Number(score)))
    : []
  const availableStandardArrayValues = abilityScoreMethod === "standard-array"
    ? standardArray.filter((value) => !usedStandardArrayValues.includes(value))
    : []

  // Track which rolled scores have been used (only for roll method)
  const usedRolledScores = abilityScoreMethod === "roll"
    ? Object.values(abilityScores).filter((score) => rolledScores.includes(Number(score)))
    : []
  const availableRolledScores = abilityScoreMethod === "roll"
    ? rolledScores.filter((score) => !usedRolledScores.includes(score))
    : []

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
      
      totalScores[ability.id] = baseScore + bonus
    })
    
    return totalScores
  }, [abilityScores, raceSubraceBonuses, assignmentMode, customAssignments])

  // Validation logic
  const validateAbility = (value: number, abilityId: string) => {
    if (abilityScoreMethod === "roll") {
      if (!rolledScores.includes(value) && value !== 0) return "Must use a rolled score value."
      // Prevent duplicate values
      const used = abilities.filter((ab) => ab.id !== abilityId).map((ab) => abilityScores[ab.id])
      if (used.includes(value) && value !== 0) return "Each rolled score can only be used once."
    }
    if (abilityScoreMethod === "point-buy") {
      if (value < 8 || value > 15) return "Score must be between 8 and 15 for point buy."
      // Check if total points spent exceeds 27
      const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
      const totalPoints = abilities.reduce((total, ab) => {
        const v = ab.id === abilityId ? value : Number(abilityScores[ab.id] || 8)
        return total + (pointCosts[v] ?? 0)
      }, 0)
      if (totalPoints > 27) return "Total points spent cannot exceed 27."
    }
    if (abilityScoreMethod === "standard-array") {
      if (!standardArray.includes(value) && value !== 0) return "Must use a standard array value."
      // Prevent duplicate values
      const used = abilities.filter((ab) => ab.id !== abilityId).map((ab) => abilityScores[ab.id])
      if (used.includes(value) && value !== 0) return "Each value can only be used once."
    }
    return undefined
  }

  // Calculate total points spent for point buy
  const pointBuyTotal = useMemo(() => {
    if (abilityScoreMethod !== "point-buy") return 0
    const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
    return abilities.reduce((total, ab) => {
      const v = Number(abilityScores[ab.id] || 8)
      return total + (pointCosts[v] ?? 0)
    }, 0)
  }, [abilityScores, abilityScoreMethod])

  const handleMethodChange = (method: string) => {
    setValue("abilityScoreMethod", method)
  }

  const handleAssignmentModeChange = (mode: string) => {
    setValue("abilityScoreAssignmentMode", mode)
    if (mode === "standard") {
      setValue("customAbilityScoreAssignments", {})
    }
  }

  const handleCustomAssignmentChange = (bonusType: string, abilityId: string) => {
    const currentAssignments = { ...customAssignments }
    
    // Remove any existing assignment for this bonus type
    Object.keys(currentAssignments).forEach(key => {
      if (currentAssignments[key] === bonusType) {
        delete currentAssignments[key]
      }
    })
    
    // Add new assignment
    if (abilityId) {
      currentAssignments[bonusType] = abilityId
    }
    
    setValue("customAbilityScoreAssignments", currentAssignments)
  }

  // Validate custom assignments
  const customAssignmentValidation = useMemo(() => {
    if (assignmentMode !== "custom" || !hasFlexibleAssignment) return { isValid: true, errors: [] }
    return validateCustomAbilityScoreAssignment(race, subrace || "", customAssignments)
  }, [assignmentMode, hasFlexibleAssignment, race, subrace, customAssignments])

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Ability Score Generation Method</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={abilityScoreMethod}
            onValueChange={handleMethodChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-2"
          >
            <ToggleGroupItem
              value="roll"
              className="flex flex-col items-center gap-2 p-4 h-auto data-[state=on]:bg-amber-900/40 data-[state=on]:border-amber-600/50"
            >
              <Dice6 className="h-6 w-6" />
              <div className="text-center">
                <div className="font-display font-semibold">Roll (4d6 Drop Lowest)</div>
                <div className="text-xs text-muted-foreground">Roll four dice, drop the lowest</div>
              </div>
            </ToggleGroupItem>
            
            <ToggleGroupItem
              value="standard-array"
              className="flex flex-col items-center gap-2 p-4 h-auto data-[state=on]:bg-amber-900/40 data-[state=on]:border-amber-600/50"
            >
              <Shuffle className="h-6 w-6" />
              <div className="text-center">
                <div className="font-display font-semibold">Standard Array</div>
                <div className="text-xs text-muted-foreground">Use [15, 14, 13, 12, 10, 8]</div>
              </div>
            </ToggleGroupItem>
            
            <ToggleGroupItem
              value="point-buy"
              className="flex flex-col items-center gap-2 p-4 h-auto data-[state=on]:bg-amber-900/40 data-[state=on]:border-amber-600/50"
            >
              <Calculator className="h-6 w-6" />
              <div className="text-center">
                <div className="font-display font-semibold">Point Buy</div>
                <div className="text-xs text-muted-foreground">Spend 27 points</div>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {/* Race/Subrace Bonus Assignment */}
      {race && (
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Race & Subrace Bonuses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Assignment Mode Toggle */}
            {hasFlexibleAssignment && (
              <div className="flex items-center justify-between p-3 border border-amber-800/30 rounded-md">
                <div>
                  <div className="font-display font-semibold">Assignment Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Choose how to assign your racial ability score bonuses
                  </div>
                </div>
                <ToggleGroup
                  type="single"
                  value={assignmentMode}
                  onValueChange={handleAssignmentModeChange}
                  className="flex gap-2"
                >
                  <ToggleGroupItem value="standard" className="px-3 py-1 text-sm">
                    Standard
                  </ToggleGroupItem>
                  <ToggleGroupItem value="custom" className="px-3 py-1 text-sm">
                    Custom
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}

            {/* Standard Assignment Display */}
            {assignmentMode === "standard" && Object.keys(raceSubraceBonuses).length > 0 && (
              <div className="space-y-2">
                <div className="font-display font-semibold text-sm">Standard Bonuses:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(raceSubraceBonuses).map(([ability, bonus]) => {
                    const abilityName = abilities.find(a => a.id === ability)?.name || ability
                    return (
                      <Badge key={ability} variant="outline" className="justify-between">
                        <span>{abilityName}</span>
                        <span className="text-amber-400">+{bonus}</span>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Custom Assignment Interface */}
            {assignmentMode === "custom" && hasFlexibleAssignment && (
              <div className="space-y-4">
                <div className="font-display font-semibold text-sm">Custom Assignment:</div>
                <div className="space-y-4">
                  {Array.from({ length: flexibleBonusCount.race }, (_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-sm font-medium">Flexible Bonus {index + 1} (+1):</div>
                      <Select
                        value={customAssignments[`flexible${index + 1}`] || ""}
                        onValueChange={(value) => handleCustomAssignmentChange(`flexible${index + 1}`, value)}
                      >
                        <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                          <SelectValue placeholder="Select ability score" />
                        </SelectTrigger>
                        <SelectContent>
                          {abilities.map((ability) => (
                            <SelectItem key={ability.id} value={ability.id}>
                              {ability.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                
                {!customAssignmentValidation.isValid && (
                  <div className="text-red-500 text-sm">
                    {customAssignmentValidation.errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Roll Method UI */}
      {abilityScoreMethod === "roll" && (
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">Rolled Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Roll 4d6, drop the lowest die, sum the remaining three
              </p>
              <Button
                onClick={rollAllScores}
                disabled={isRolling}
                className="bg-amber-900/40 border-amber-800/30 hover:bg-amber-900/60"
              >
                {isRolling ? "Rolling..." : "Roll New Scores"}
              </Button>
            </div>
            
            {rolledScores.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {rolledScores.map((score, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-lg font-display p-3 justify-center"
                  >
                    {score}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Point Buy Info */}
      {abilityScoreMethod === "point-buy" && (
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">Point Buy System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Start with 8 in all abilities. Spend from 27 points to increase scores.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>8 → 0 pts</div>
              <div>9 → 1 pt</div>
              <div>10 → 2 pts</div>
              <div>11 → 3 pts</div>
              <div>12 → 4 pts</div>
              <div>13 → 5 pts</div>
              <div>14 → 7 pts</div>
              <div>15 → 9 pts</div>
            </div>
            <div className="mt-3 text-sm">
              <span className="font-medium">Points spent:</span>
              <span className="ml-2">
                {pointBuyTotal}/27
              </span>
              {pointBuyTotal > 27 && (
                <span className="ml-4 text-red-500">You have exceeded the point buy limit!</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ability Score Grid */}
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
              const baseScore = Number(field.value || 0)
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
              
              const totalScore = baseScore + bonus
              const modifier = calculateModifier(totalScore)
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
                        {abilityScoreMethod === "roll" ? (
                          <select
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            className="flex h-10 w-full rounded-md border border-amber-800/30 bg-black/20 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value={0}>Select Rolled Score</option>
                            {availableRolledScores.map((score) => (
                              <option key={score} value={score}>
                                {score}
                              </option>
                            ))}
                          </select>
                        ) : abilityScoreMethod === "standard-array" ? (
                          <select
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            className="flex h-10 w-full rounded-md border border-amber-800/30 bg-black/20 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value={0}>Select Value</option>
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
                              onClick={() => field.onChange(Math.max(8, (Number(field.value || 8)) - 1))}
                              disabled={Number(field.value || 8) <= 8}
                              aria-label={`Decrease ${ability.name}`}
                            >
                              –
                            </button>
                            <Input
                              type="number"
                              min={8}
                              max={15}
                              value={field.value || 8}
                              readOnly
                              className="w-16 text-center border-amber-800/30 bg-black/20 backdrop-blur-sm cursor-default"
                              tabIndex={-1}
                            />
                            <button
                              type="button"
                              className="w-8 h-8 rounded bg-amber-900/40 text-amber-200 font-bold flex items-center justify-center border border-amber-800/30 disabled:opacity-40"
                              onClick={() => {
                                // Calculate new value and check if it would exceed 27 points
                                const current = Number(field.value || 8)
                                const next = current + 1
                                if (next > 15) return
                                const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
                                const newTotal = abilities.reduce((total, ab) => {
                                  if (ab.id === ability.id) {
                                    return total + (pointCosts[next] ?? 0)
                                  }
                                  const v = Number(abilityScores[ab.id] || 8)
                                  return total + (pointCosts[v] ?? 0)
                                }, 0)
                                if (newTotal > 27) return
                                field.onChange(next)
                              }}
                              disabled={
                                Number(field.value || 8) >= 15 || (() => {
                                  const current = Number(field.value || 8)
                                  const next = current + 1
                                  if (next > 15) return true
                                  const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
                                  const newTotal = abilities.reduce((total, ab) => {
                                    if (ab.id === ability.id) {
                                      return total + (pointCosts[next] ?? 0)
                                    }
                                    const v = Number(abilityScores[ab.id] || 8)
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
                      
                      {/* Show bonus if applicable */}
                      {bonus > 0 && (
                        <div className="text-xs text-amber-400 mt-1">
                          Base: {baseScore} + Bonus: +{bonus} = {totalScore}
                        </div>
                      )}
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
    </div>
  )
}
