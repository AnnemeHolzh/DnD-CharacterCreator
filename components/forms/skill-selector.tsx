"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { calculateModifier, calculateTotalAbilityScoreIncreases, hasFlexibleAbilityScoreAssignment, getFlexibleBonusCount, calculateSkillProficiencies, validateSkillSelections, SkillProficiencyData } from "@/lib/utils/character-utils"
import { skills } from "@/lib/data/skills"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getFeatASIs } from "@/lib/data/feats"
import { useMemo, useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Lock, BookOpen, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolSelector } from "./tool-selector"
import { LanguageSelector } from "./language-selector"
import { useTools } from "@/hooks/use-tools"
import { useLanguages } from "@/hooks/use-languages"

export function SkillSelector() {
  const { control, setValue } = useFormContext()
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}
  const race = useWatch({ control, name: "race" })
  const subrace = useWatch({ control, name: "subrace" })
  const background = useWatch({ control, name: "background" })
  const characterClasses = useWatch({ control, name: "classes" }) || []
  const selectedSkills = useWatch({ control, name: "skills" }) || []
  const assignmentMode = useWatch({ control, name: "abilityScoreAssignmentMode" }) || "standard"
  const customAssignments = useWatch({ control, name: "customAbilityScoreAssignments" }) || {}
  const selectedFeats = useWatch({ control, name: "feats" }) || []
  const formFeatASIChoices = useWatch({ control, name: "featASIChoices" }) || {}
  const asiChoices = useWatch({ control, name: "asiChoices" }) || []

  // State for skill selection mode
  const [skillMode, setSkillMode] = useState<"class" | "global">("class")

  // Prefetch tools and languages data
  const { prefetchTools } = useTools()
  const { prefetchLanguages } = useLanguages()

  // Prefetch data when component mounts
  useEffect(() => {
    prefetchTools()
    prefetchLanguages()
  }, [prefetchTools, prefetchLanguages])

  const abilities = [
    { id: "strength", name: "Strength", abbr: "STR" },
    { id: "dexterity", name: "Dexterity", abbr: "DEX" },
    { id: "constitution", name: "Constitution", abbr: "CON" },
    { id: "intelligence", name: "Intelligence", abbr: "INT" },
    { id: "wisdom", name: "Wisdom", abbr: "WIS" },
    { id: "charisma", name: "Charisma", abbr: "CHA" },
  ]

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

  // Calculate skill proficiency data
  const skillData = useMemo(() => {
    return calculateSkillProficiencies(
      characterClasses,
      race || "",
      subrace || "",
      background || "",
      selectedSkills
    )
  }, [characterClasses, race, subrace, background, selectedSkills])

  // Auto-select fixed proficiencies when they change
  useEffect(() => {
    if (skillData.fixedProficiencies.length > 0) {
      const newSelectedSkills = [...selectedSkills]
      let hasChanges = false
      
      skillData.fixedProficiencies.forEach(skillId => {
        if (!newSelectedSkills.includes(skillId)) {
          newSelectedSkills.push(skillId)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        setValue("skills", newSelectedSkills)
      }
    }
  }, [skillData.fixedProficiencies, setValue])

  // Validate skill selections
  const validation = useMemo(() => {
    return validateSkillSelections(skillData, selectedSkills)
  }, [skillData, selectedSkills])

  // Handle skill selection
  const handleSkillToggle = (skillId: string, isSelected: boolean) => {
    let newSelectedSkills = [...selectedSkills]
    
    if (isSelected) {
      // Check if we can add this skill
      const isFixed = skillData.fixedProficiencies.includes(skillId)
      const isClassSkill = skillData.availableClassSkills.includes(skillId)
      const isGlobalSkill = skillData.availableGlobalSkills.includes(skillId)
      
      if (isFixed) {
        // Fixed skills are always allowed
        if (!newSelectedSkills.includes(skillId)) {
          newSelectedSkills.push(skillId)
        }
      } else if (isClassSkill && skillMode === "class") {
        // Check class skill limits
        const currentClassSkills = newSelectedSkills.filter(s => skillData.availableClassSkills.includes(s))
        if (currentClassSkills.length < skillData.classSkillPoints) {
          newSelectedSkills.push(skillId)
        }
      } else if (isGlobalSkill && skillMode === "global") {
        // Check global skill limits
        const currentGlobalSkills = newSelectedSkills.filter(s => skillData.availableGlobalSkills.includes(s))
        if (currentGlobalSkills.length < skillData.globalSkillPoints) {
          newSelectedSkills.push(skillId)
        }
      }
    } else {
      // Remove skill if it's not fixed
      if (!skillData.fixedProficiencies.includes(skillId)) {
        newSelectedSkills = newSelectedSkills.filter(s => s !== skillId)
      }
    }
    
    setValue("skills", newSelectedSkills)
  }

  // Get skill display name
  const getSkillDisplayName = (skillId: string) => {
    const skill = skills.find((s: { id: string; name: string; ability: string; abilityAbbr: string }) => s.id === skillId)
    return skill ? skill.name : skillId
  }

  // Group skills by ability
  const skillsByAbility = {
    Strength: skills.filter(s => s.ability === 'strength'),
    Dexterity: skills.filter(s => s.ability === 'dexterity'),
    Intelligence: skills.filter(s => s.ability === 'intelligence'),
    Wisdom: skills.filter(s => s.ability === 'wisdom'),
    Charisma: skills.filter(s => s.ability === 'charisma'),
  }

  const renderSkillSection = (ability: string, abilitySkills: typeof skills) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-display">{ability}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {abilitySkills.map((skill) => {
            const modifier = calculateModifier(totalAbilityScores[skill.ability] || 10)
            const isSelected = selectedSkills.includes(skill.id)
            const isFixed = skillData.fixedProficiencies.includes(skill.id)
            const isClassSkill = skillData.availableClassSkills.includes(skill.id)
            const isGlobalSkill = skillData.availableGlobalSkills.includes(skill.id)
            
            // Determine if skill can be selected in current mode
            let canSelect = false
            let reason = ""
            
            if (isFixed) {
              canSelect = true
              reason = "Fixed proficiency"
            } else if (isClassSkill && skillMode === "class") {
              const currentClassSkills = selectedSkills.filter((s: string) => skillData.availableClassSkills.includes(s))
              canSelect = currentClassSkills.length < skillData.classSkillPoints
              reason = `Class skill (${currentClassSkills.length}/${skillData.classSkillPoints})`
            } else if (isGlobalSkill && skillMode === "global") {
              const currentGlobalSkills = selectedSkills.filter((s: string) => skillData.availableGlobalSkills.includes(s))
              canSelect = currentGlobalSkills.length < skillData.globalSkillPoints
              reason = `Global skill (${currentGlobalSkills.length}/${skillData.globalSkillPoints})`
            } else {
              reason = skillMode === "class" ? "Not in class list" : "Not available"
            }

            // Determine skill type for visual indicators
            let skillType: "fixed" | "class" | "global" | "none" = "none"
            if (isFixed) skillType = "fixed"
            else if (isSelected && isClassSkill) skillType = "class"
            else if (isSelected && isGlobalSkill) skillType = "global"

            return (
              <TooltipProvider key={skill.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={skill.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSkillToggle(skill.id, checked as boolean)}
                        disabled={!canSelect && !isSelected}
                      />
                      <label
                        htmlFor={skill.id}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                          isFixed ? "text-amber-400" : ""
                        }`}
                      >
                        {skill.name}
                        {isFixed && <Lock className="inline ml-1 h-3 w-3" />}
                      </label>
                      <Badge variant="outline" className="ml-2">
                        {modifier >= 0 ? '+' : ''}{modifier}
                      </Badge>
                      {skillType === "fixed" && (
                        <Badge variant="secondary" className="ml-1 text-xs bg-amber-900/40 text-amber-200">
                          Fixed
                        </Badge>
                      )}
                      {skillType === "class" && (
                        <Badge variant="secondary" className="ml-1 text-xs bg-blue-900/40 text-blue-200">
                          Class
                        </Badge>
                      )}
                      {skillType === "global" && (
                        <Badge variant="secondary" className="ml-1 text-xs bg-green-900/40 text-green-200">
                          Global
                        </Badge>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ability: {skill.abilityAbbr}</p>
                    <p>Status: {reason}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Skill Summary */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Skill Proficiency Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fixed Proficiencies */}
          {skillData.fixedProficiencies.length > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2 text-amber-400">Fixed Proficiencies</h4>
              <div className="flex flex-wrap gap-2">
                {skillData.fixedProficiencies.map((skillId) => (
                  <Badge key={skillId} variant="secondary" className="bg-amber-900/40 text-amber-200">
                    {getSkillDisplayName(skillId)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Class Skills */}
          <div>
            <h4 className="font-display text-sm mb-2">Class Skills</h4>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {skillData.selectedClassSkills.length} of {skillData.classSkillPoints} selected
              </span>
              {skillData.classSkillPoints > 0 && (
                <span className="text-xs text-muted-foreground">
                  Choose from: {skillData.availableClassSkills.map(getSkillDisplayName).join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Global Skills */}
          {skillData.globalSkillPoints > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2">Global Skills</h4>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {skillData.selectedGlobalSkills.length} of {skillData.globalSkillPoints} selected
                </span>
                <span className="text-xs text-muted-foreground">
                  Choose from any skill
                </span>
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {!validation.isValid && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {validation.isValid && selectedSkills.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Skill proficiencies are valid! Total: {selectedSkills.length} skills
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Skill Selection Mode Toggle */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Skill Selection Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={skillMode === "class" ? "default" : "outline"}
              onClick={() => setSkillMode("class")}
              className={`flex items-center gap-2 transition-all duration-200 ${
                skillMode === "class" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg ring-2 ring-blue-400/50" 
                  : "hover:bg-gray-100/10"
              }`}
              disabled={skillData.classSkillPoints === 0}
            >
              <BookOpen className="h-4 w-4" />
              Class Skills ({skillData.selectedClassSkills.length}/{skillData.classSkillPoints})
            </Button>
            <Button
              variant={skillMode === "global" ? "default" : "outline"}
              onClick={() => setSkillMode("global")}
              className={`flex items-center gap-2 transition-all duration-200 ${
                skillMode === "global" 
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg ring-2 ring-green-400/50" 
                  : "hover:bg-gray-100/10"
              }`}
              disabled={skillData.globalSkillPoints === 0}
            >
              <Globe className="h-4 w-4" />
              Global Skills ({skillData.selectedGlobalSkills.length}/{skillData.globalSkillPoints})
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {skillMode === "class" 
              ? "Select skills from your class's skill list"
              : "Select skills from any available skill"
            }
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          {Object.entries(skillsByAbility).map(([ability, abilitySkills]) => 
            <div key={ability}>
              {renderSkillSection(ability, abilitySkills)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tools">
          <ToolSelector />
        </TabsContent>

        <TabsContent value="languages">
          <LanguageSelector />
        </TabsContent>
      </Tabs>
    </div>
  )
}
