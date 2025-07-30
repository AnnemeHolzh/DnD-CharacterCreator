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
import { getFeatASIs, getAvailableFeats } from "@/lib/data/feats"
import { ASISelectionDialog } from "./asi-selection-dialog"
import { ASIChoiceDialog } from "./asi-choice-dialog"

// Type for tracking rolled scores with unique IDs
type RolledScoreWithId = {
  id: string
  value: number
  used: boolean
}

export function AbilityScoreSelector() {
  const { control, setValue, getValues } = useFormContext()
  const [rolledScoresWithIds, setRolledScoresWithIds] = useState<RolledScoreWithId[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [asiDialogOpen, setAsiDialogOpen] = useState(false)
  const [pendingFeatAsi, setPendingFeatAsi] = useState<{ featName: string; asiOptions: string[] } | null>(null)
  const [asiChoiceDialogOpen, setAsiChoiceDialogOpen] = useState(false)
  const [asiChoices, setAsiChoices] = useState<Array<{ choice: "single" | "double", abilities: string[] }>>([])
  const [featASIChoices, setFeatASIChoices] = useState<Record<string, string>>({})

  const abilityScoreMethod = useWatch({ control, name: "abilityScoreMethod" }) || "standard-array"
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}
  const race = useWatch({ control, name: "race" })
  const subrace = useWatch({ control, name: "subrace" })
  const assignmentMode = useWatch({ control, name: "abilityScoreAssignmentMode" }) || "standard"
  const customAssignments = useWatch({ control, name: "customAbilityScoreAssignments" }) || {}
  const selectedFeats = useWatch({ control, name: "feats" }) || []
  const characterClasses = useWatch({ control, name: "classes" }) || []
  const characterLevel = useWatch({ control, name: "level" }) || 1
  const proficiencies = useWatch({ control, name: "proficiencies" }) || []
  const formFeatASIChoices = useWatch({ control, name: "featASIChoices" }) || {}

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

  // Roll all ability scores with unique IDs
  const rollAllScores = () => {
    setIsRolling(true)
    setTimeout(() => {
      const newRolledScores = Array.from({ length: 6 }, (_, index) => ({
        id: `Roll${index + 1}`,
        value: roll4d6DropLowest(),
        used: false
      }))
      setRolledScoresWithIds(newRolledScores)
      setIsRolling(false)
    }, 500)
  }

  // Initialize rolled scores if method is roll and no scores exist
  useEffect(() => {
    if (abilityScoreMethod === "roll" && rolledScoresWithIds.length === 0) {
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

  // Get available rolled scores (only unused ones)
  const availableRolledScores = useMemo(() => {
    if (abilityScoreMethod !== "roll") return []
    
    return rolledScoresWithIds
      .filter(score => !score.used)
      .map(score => ({ id: score.id, value: score.value }))
  }, [rolledScoresWithIds, abilityScoreMethod])

  // Update used status based on current ability scores
  useEffect(() => {
    if (abilityScoreMethod === "roll") {
      const newRolledScores = rolledScoresWithIds.map(score => {
        // Check if this roll ID is currently assigned to any ability
        const isUsed = Object.values(abilityScores).some(value => value === score.id)
        return { ...score, used: isUsed }
      })
      setRolledScoresWithIds(newRolledScores)
    }
  }, [abilityScores, abilityScoreMethod])

  // Calculate feat ASI bonuses
  const featASIs = useMemo(() => {
    return getFeatASIs(selectedFeats, formFeatASIChoices)
  }, [selectedFeats, formFeatASIChoices])

  // Calculate available feats for ASI choice
  const availableFeats = useMemo(() => {
    return getAvailableFeats(characterLevel, characterClasses, abilityScores, proficiencies)
  }, [characterLevel, characterClasses, abilityScores, proficiencies])

  // Calculate remaining feats after ASI choices
  const remainingFeats = availableFeats - asiChoices.length

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
    
    asiChoices.forEach(choice => {
      choice.abilities.forEach(ability => {
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
      let baseScore = 0
      
      // For roll method, convert roll ID to actual value
      if (abilityScoreMethod === "roll") {
        const rollId = baseScores[ability.id]
        if (rollId) {
          const rollData = rolledScoresWithIds.find(score => score.id === rollId)
          baseScore = rollData ? rollData.value : 0
        }
      } else {
        baseScore = Number(baseScores[ability.id]) || 0
      }
      
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
  }, [abilityScores, raceSubraceBonuses, assignmentMode, customAssignments, featASIs, asiBonuses, abilityScoreMethod, rolledScoresWithIds])

  // Validation logic
  const validateAbility = (value: string | number, abilityId: string) => {
    if (abilityScoreMethod === "roll") {
      // For roll method, value should be a roll ID
      if (typeof value === "string") {
        const rollExists = rolledScoresWithIds.some(score => score.id === value)
        if (!rollExists && value !== "") return "Must select a valid rolled score."
        
        // Check if this roll is already used by another ability
        if (value !== "") {
          const isUsedByOther = Object.entries(abilityScores).some(([key, val]) => 
            key !== abilityId && val === value
          )
          if (isUsedByOther) return "This rolled score has already been assigned to another ability."
        }
      }
    }
    if (abilityScoreMethod === "point-buy") {
      const numValue = Number(value)
      if (numValue < 8 || numValue > 15) return "Score must be between 8 and 15 for point buy."
      // Check if total points spent exceeds 27
      const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
      const totalPoints = abilities.reduce((total, ab) => {
        const v = ab.id === abilityId ? numValue : Number(abilityScores[ab.id] || 8)
        return total + (pointCosts[v] ?? 0)
      }, 0)
      if (totalPoints > 27) return "Total points spent cannot exceed 27."
    }
    if (abilityScoreMethod === "standard-array") {
      const numValue = Number(value)
      if (!standardArray.includes(numValue) && numValue !== 0) return "Must use a standard array value."
      // Prevent duplicate values
      const used = abilities.filter((ab) => ab.id !== abilityId).map((ab) => abilityScores[ab.id])
      if (used.includes(numValue) && numValue !== 0) return "Each value can only be used once."
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
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ability Score Generation Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => handleMethodChange("roll")}
              className={`relative p-6 rounded-lg border transition-all duration-200 text-left ${
                abilityScoreMethod === "roll"
                  ? "border-amber-600/50 bg-gradient-to-br from-amber-900/40 via-amber-900/20 to-amber-800/10 shadow-[0_0_20px_rgba(232,193,112,0.15)]"
                  : "border-amber-800/30 bg-black/20 hover:border-amber-600/40 hover:bg-amber-900/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  abilityScoreMethod === "roll" 
                    ? "bg-amber-600/30 text-amber-200" 
                    : "bg-amber-900/30 text-amber-400"
                }`}>
                  <Dice6 className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg">Roll</div>
              </div>
              <div className="text-sm text-muted-foreground">
                4d6 drop lowest - Roll four dice, drop the lowest
              </div>
              {abilityScoreMethod === "roll" && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>
            
            <button
              type="button"
              onClick={() => handleMethodChange("standard-array")}
              className={`relative p-6 rounded-lg border transition-all duration-200 text-left ${
                abilityScoreMethod === "standard-array"
                  ? "border-amber-600/50 bg-gradient-to-br from-amber-900/40 via-amber-900/20 to-amber-800/10 shadow-[0_0_20px_rgba(232,193,112,0.15)]"
                  : "border-amber-800/30 bg-black/20 hover:border-amber-600/40 hover:bg-amber-900/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  abilityScoreMethod === "standard-array" 
                    ? "bg-amber-600/30 text-amber-200" 
                    : "bg-amber-900/30 text-amber-400"
                }`}>
                  <Shuffle className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg">Standard Array</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Use [15, 14, 13, 12, 10, 8] - Balanced starting scores
              </div>
              {abilityScoreMethod === "standard-array" && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>
            
            <button
              type="button"
              onClick={() => handleMethodChange("point-buy")}
              className={`relative p-6 rounded-lg border transition-all duration-200 text-left ${
                abilityScoreMethod === "point-buy"
                  ? "border-amber-600/50 bg-gradient-to-br from-amber-900/40 via-amber-900/20 to-amber-800/10 shadow-[0_0_20px_rgba(232,193,112,0.15)]"
                  : "border-amber-800/30 bg-black/20 hover:border-amber-600/40 hover:bg-amber-900/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  abilityScoreMethod === "point-buy" 
                    ? "bg-amber-600/30 text-amber-200" 
                    : "bg-amber-900/30 text-amber-400"
                }`}>
                  <Calculator className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg">Point Buy</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Spend 27 points - Customize your ability scores
              </div>
              {abilityScoreMethod === "point-buy" && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>
          </div>
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
              <div className="p-4 border border-amber-800/30 rounded-lg bg-gradient-to-r from-amber-900/10 to-amber-800/5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-display font-semibold text-amber-100">Assignment Mode</div>
                    <div className="text-sm text-amber-300/80">
                      Choose how to assign your racial ability score bonuses
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAssignmentModeChange("standard")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      assignmentMode === "standard"
                        ? "bg-amber-600/30 text-amber-200 border border-amber-600/50 shadow-sm"
                        : "bg-black/20 text-amber-300/70 border border-amber-800/30 hover:bg-amber-900/20 hover:text-amber-200"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAssignmentModeChange("custom")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      assignmentMode === "custom"
                        ? "bg-amber-600/30 text-amber-200 border border-amber-600/50 shadow-sm"
                        : "bg-black/20 text-amber-300/70 border border-amber-800/30 hover:bg-amber-900/20 hover:text-amber-200"
                    }`}
                  >
                    Custom
                  </button>
                </div>
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
                type="button"
                onClick={rollAllScores}
                disabled={isRolling}
                className="bg-amber-900/40 border-amber-800/30 hover:bg-amber-900/60"
              >
                {isRolling ? "Rolling..." : "Roll New Scores"}
              </Button>
            </div>
            
            {rolledScoresWithIds.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {rolledScoresWithIds.map((score, index) => {
                  const isUsed = Object.values(abilityScores).some(value => value === score.id)
                  return (
                    <Badge
                      key={score.id}
                      variant="outline"
                      className={`text-lg font-display p-3 justify-center ${isUsed ? 'opacity-50' : ''}`}
                    >
                      {score.value} {isUsed ? '(Used)' : '(Available)'}
                    </Badge>
                  )
                })}
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

      {/* ASI vs Feat Choice */}
      {remainingFeats > 0 && (
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">Ability Score Improvements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              You have {remainingFeats} ability score improvement(s) remaining. You can either:
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-800/30 bg-green-900/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-display text-green-400">Option 1: Increase Two Abilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-300 mb-3">
                    Increase one ability score by 2, or increase two ability scores by 1 each.
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-800/30 bg-green-900/20 hover:bg-green-900/40 text-green-300"
                    onClick={() => setAsiChoiceDialogOpen(true)}
                  >
                    Choose ASI
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-blue-800/30 bg-blue-900/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-display text-blue-400">Option 2: Take a Feat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-blue-300 mb-3">
                    Choose a feat instead of an ability score improvement.
                  </div>
                  <div className="text-xs text-blue-400">
                    (Feat selection is available in the Feats section)
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ASI Choices Summary */}
      {asiChoices.length > 0 && (
        <Card className="border-purple-800/30 bg-purple-900/10">
          <CardHeader>
            <CardTitle className="font-display text-lg text-purple-400">ASI Choices Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {asiChoices.map((choice, index) => (
                <div key={index} className="text-sm">
                  <span className="text-purple-300">Choice {index + 1}:</span>
                  <span className="text-purple-400 ml-2">
                    {choice.choice === "single" 
                      ? `+2 to ${choice.abilities[0]}`
                      : `+1 to ${choice.abilities.join(" and ")}`
                    }
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feat ASI Summary */}
      {Object.values(featASIs).some(bonus => bonus > 0) && (
        <Card className="border-green-800/30 bg-green-900/10">
          <CardHeader>
            <CardTitle className="font-display text-lg text-green-400">Feat Ability Score Bonuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(featASIs).map(([ability, bonus]) => 
                bonus > 0 ? (
                  <Badge key={ability} variant="outline" className="justify-between border-green-600/50 bg-green-900/20">
                    <span className="text-green-300 capitalize">{ability}</span>
                    <span className="text-green-400 font-semibold">+{bonus}</span>
                  </Badge>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ability Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {abilities.map((ability) => (
          <FormField
            key={ability.id}
            control={control}
            name={`abilityScores.${ability.id}`}
            rules={{
              validate: (value) => validateAbility(value, ability.id)
            }}
            render={({ field, fieldState }) => {
              let baseScore = 0
              
              // For roll method, convert roll ID to actual value
              if (abilityScoreMethod === "roll") {
                const rollId = field.value
                if (rollId) {
                  const rollData = rolledScoresWithIds.find(score => score.id === rollId)
                  baseScore = rollData ? rollData.value : 0
                }
              } else {
                // Use the current value from the form state to ensure reactivity
                const currentValue = abilityScores[ability.id]
                baseScore = Number(currentValue || field.value || 0)
              }
              
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
              
              // Add ASI bonuses to the total
              const featAsiBonus = featASIs[ability.id] || 0
              const userAsiBonus = asiBonuses[ability.id] || 0
              const totalScore = baseScore + bonus + featAsiBonus + userAsiBonus
              const modifier = calculateModifier(totalScore)
              const modifierText = modifier >= 0 ? `+${modifier}` : modifier

              return (
                <FormItem>
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-amber-800/20 bg-black/10 backdrop-blur-sm hover:bg-amber-900/5 transition-all duration-200">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 flex items-center justify-center border-2 border-amber-800/40 shadow-lg">
                      <span className="font-display text-xl font-bold text-emerald-200">{ability.abbr}</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <FormLabel className="font-display text-lg font-semibold text-amber-100">{ability.name}</FormLabel>
                      <div className="flex items-center gap-3">
                        {/* Base Score Display */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-16 h-10 rounded-lg border border-amber-800/30 bg-amber-900/20 flex items-center justify-center">
                            <span className="font-display text-lg font-bold text-amber-200">
                              {baseScore || "—"}
                            </span>
                          </div>
                          <span className="text-xs text-amber-300/70">Base</span>
                        </div>
                        
                        {abilityScoreMethod === "roll" ? (
                          <Select
                            value={abilityScores[ability.id] || field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                              <SelectValue placeholder="Select Rolled Score">
                                {(abilityScores[ability.id] || field.value) ? (
                                  (() => {
                                    const rollData = rolledScoresWithIds.find(score => score.id === (abilityScores[ability.id] || field.value))
                                    return rollData ? `Rolled: ${rollData.value}` : "Select Rolled Score"
                                  })()
                                ) : "Select Rolled Score"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {availableRolledScores.map((score) => (
                                <SelectItem key={score.id} value={score.id}>
                                  Rolled: {score.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : abilityScoreMethod === "standard-array" ? (
                          <Select
                            value={(abilityScores[ability.id] || field.value)?.toString() || ""}
                            onValueChange={(value) => field.onChange(Number.parseInt(value) || 0)}
                          >
                            <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                              <SelectValue placeholder="Select Value">
                                {(abilityScores[ability.id] || field.value) ? `Score: ${abilityScores[ability.id] || field.value}` : "Select Value"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {availableStandardArrayValues.map((value) => (
                                <SelectItem key={value} value={value.toString()}>
                                  Score: {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : abilityScoreMethod === "point-buy" ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-800/30 text-amber-200 font-bold flex items-center justify-center border border-amber-800/30 hover:bg-amber-900/60 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                              onClick={() => {
                                const currentValue = Number(abilityScores[ability.id] || field.value || 8)
                                field.onChange(Math.max(8, currentValue - 1))
                              }}
                              disabled={Number(abilityScores[ability.id] || field.value || 8) <= 8}
                              aria-label={`Decrease ${ability.name}`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="w-20 h-10 rounded-lg border border-amber-800/30 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                              <span className="font-display text-lg font-semibold text-amber-200">
                                {abilityScores[ability.id] || field.value || 8}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-800/30 text-amber-200 font-bold flex items-center justify-center border border-amber-800/30 hover:bg-amber-900/60 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                              onClick={() => {
                                // Calculate new value and check if it would exceed 27 points
                                const current = Number(abilityScores[ability.id] || field.value || 8)
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
                                Number(abilityScores[ability.id] || field.value || 8) >= 15 || (() => {
                                  const current = Number(abilityScores[ability.id] || field.value || 8)
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
                              <Plus className="h-4 w-4" />
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
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 flex items-center justify-center border-2 border-emerald-700/40 shadow-md">
                            <span className="font-display text-lg font-bold text-emerald-200">{modifierText}</span>
                          </div>
                          <span className="text-xs text-emerald-300/70">Mod</span>
                        </div>
                      </div>
                      
                      {/* Show bonus breakdown if applicable */}
                      {(raceSubraceBonuses[ability.id] || 0) > 0 || (featASIs[ability.id] || 0) > 0 || (asiBonuses[ability.id] || 0) > 0 && (
                        <div className="space-y-1 pt-2 border-t border-amber-800/20">
                          {(raceSubraceBonuses[ability.id] || 0) > 0 && (
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                              <span className="text-amber-300">Race/Subrace: +{raceSubraceBonuses[ability.id] || 0}</span>
                            </div>
                          )}
                          {(featASIs[ability.id] || 0) > 0 && (
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                              <span className="text-green-300">Feat ASI: +{featASIs[ability.id] || 0}</span>
                            </div>
                          )}
                          {(asiBonuses[ability.id] || 0) > 0 && (
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                              <span className="text-purple-300">ASI Choice: +{asiBonuses[ability.id] || 0}</span>
                            </div>
                          )}
                          {(bonus > 0 || featAsiBonus > 0 || userAsiBonus > 0) && (
                            <div className="flex items-center gap-2 text-xs font-semibold">
                              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                              <span className="text-blue-300">Total: {baseScore} + {bonus + featAsiBonus + userAsiBonus} = {totalScore}</span>
                            </div>
                          )}
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

      {/* ASI Selection Dialog */}
      <ASISelectionDialog
        isOpen={asiDialogOpen}
        onClose={() => setAsiDialogOpen(false)}
        featName={pendingFeatAsi?.featName || ""}
        asiOptions={pendingFeatAsi?.asiOptions || []}
        onConfirm={(selectedAbility) => {
          // TODO: Handle ASI selection
          console.log("Selected ASI:", selectedAbility)
        }}
      />

      {/* ASI Choice Dialog */}
      <ASIChoiceDialog
        isOpen={asiChoiceDialogOpen}
        onClose={() => setAsiChoiceDialogOpen(false)}
        onConfirm={(choice, abilities) => {
          setAsiChoices([...asiChoices, { choice, abilities }])
          setAsiChoiceDialogOpen(false)
        }}
      />
    </div>
  )
}
