"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, CheckCircle, Lock, BookOpen, Globe } from "lucide-react"
import { skills } from "@/lib/data/skills"
import { ToolSelector } from "./tool-selector"
import { LanguageSelector } from "./language-selector"
import { calculateSkillProficiencies, validateSkillSelections, calculateModifier, calculateTotalAbilityScoreIncreases } from "@/lib/utils/character-utils"

export function SkillSelector() {
  const { control, setValue } = useFormContext()
  const selectedSkills = useWatch({ control, name: "skills" }) || []
  const characterClasses = useWatch({ control, name: "classes" }) || []
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}
  const race = useWatch({ control, name: "race" }) || ""
  const subrace = useWatch({ control, name: "subrace" }) || ""
  const background = useWatch({ control, name: "background" }) || ""
  const assignmentMode = useWatch({ control, name: "assignmentMode" }) || "standard"
  const customAssignments = useWatch({ control, name: "customAssignments" }) || {}
  const featASIs = useWatch({ control, name: "featASIs" }) || {}
  const asiBonuses = useWatch({ control, name: "asiBonuses" }) || {}
  const abilityScoreMethod = useWatch({ control, name: "abilityScoreMethod" }) || "point-buy"
  const rolledScoresWithIds = useWatch({ control, name: "rolledScoresWithIds" }) || []
  const [skillMode, setSkillMode] = useState<"class" | "global">("class")
  const [activeTab, setActiveTab] = useState("skills")
  const processedCombinationRef = useRef<string>("")

  // Group skills by ability
  const skillsByAbility = useMemo(() => {
    const grouped: Record<string, typeof skills> = {}
    skills.forEach(skill => {
      const ability = skill.abilityAbbr.toLowerCase()
      if (!grouped[ability]) {
        grouped[ability] = []
      }
      grouped[ability].push(skill)
    })
    return grouped
  }, [])

  // Calculate skill data using proper utility functions
  const skillData = useMemo(() => {
    return calculateSkillProficiencies(
      characterClasses,
      race,
      subrace,
      background,
      selectedSkills
    )
  }, [characterClasses, race, subrace, background, selectedSkills])

  // Calculate skill modifiers based on ability scores (which now include bonuses)
  const skillModifiers = useMemo(() => {
    const modifiers: Record<string, number> = {}
    skills.forEach(skill => {
      const abilityId = skill.ability
      const abilityScore = abilityScores[abilityId] || 10
      const modifier = calculateModifier(abilityScore)
      modifiers[skill.id] = modifier
    })
    return modifiers
  }, [abilityScores])

  // Validate skill selections
  const validation = useMemo(() => {
    return validateSkillSelections(skillData, selectedSkills)
  }, [skillData, selectedSkills])

  // Auto-add fixed proficiencies when race, subrace, or background changes
  useEffect(() => {
    if (race || background) {
      const combination = `${race}-${subrace}-${background}`
      
      // Only process if this combination hasn't been processed yet
      if (processedCombinationRef.current !== combination) {
        const currentSkillData = calculateSkillProficiencies(
          characterClasses,
          race,
          subrace,
          background,
          selectedSkills
        )
        
        // Get all fixed proficiencies that should be selected
        const requiredFixedSkills = currentSkillData.fixedProficiencies
        
        // Add any missing fixed proficiencies to selectedSkills
        const missingFixedSkills = requiredFixedSkills.filter(
          skill => !selectedSkills.includes(skill)
        )
        
        if (missingFixedSkills.length > 0) {
          const updatedSkills = [...selectedSkills, ...missingFixedSkills]
          setValue("skills", updatedSkills)
        }
        
        // Mark this combination as processed
        processedCombinationRef.current = combination
      }
    }
  }, [race, subrace, background, characterClasses, selectedSkills, setValue])

  const handleSkillToggle = (skillId: string, isSelected: boolean) => {
    let newSelectedSkills = [...selectedSkills]
    
    if (isSelected) {
      // Check if skill is already selected
      if (!newSelectedSkills.includes(skillId)) {
        // Check limits based on skill type
        const isFixed = skillData.fixedProficiencies.includes(skillId)
        const isClassSkill = skillData.availableClassSkills.includes(skillId)
        const isGlobalSkill = skillData.availableGlobalSkills.includes(skillId)
        
        if (isFixed) {
          // Fixed skills are always allowed
          newSelectedSkills.push(skillId)
        } else if (isClassSkill) {
          // Check class skill limit
          if (skillData.selectedClassSkills.length < skillData.classSkillPoints) {
            newSelectedSkills.push(skillId)
          }
        } else if (isGlobalSkill) {
          // Check global skill limit
          if (skillData.selectedGlobalSkills.length < skillData.globalSkillPoints) {
            newSelectedSkills.push(skillId)
          }
        }
      }
    } else {
      // Remove skill
      newSelectedSkills = newSelectedSkills.filter(id => id !== skillId)
    }
    
    setValue("skills", newSelectedSkills)
  }

  const getSkillDisplayName = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId)
    return skill ? skill.name : skillId
  }

  const renderSkillSection = (ability: string, abilitySkills: typeof skills) => (
    <Card key={ability} className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg capitalize">{ability} Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {abilitySkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill.id)
            const isFixed = skillData.fixedProficiencies.includes(skill.id)
            const isClassSkill = skillData.availableClassSkills.includes(skill.id)
            const isGlobalSkill = skillData.availableGlobalSkills.includes(skill.id)
            
            // Determine skill type for display
            let skillType: "fixed" | "class" | "global" = "global"
            if (isFixed) skillType = "fixed"
            else if (isClassSkill) skillType = "class"
            else if (isGlobalSkill) skillType = "global"
            
            // Get modifier from memoized calculation
            const modifier = skillModifiers[skill.id] || 0
            
            // Determine if skill can be selected
            let canSelect = false
            let reason = ""
            
            if (isFixed) {
              canSelect = true
              reason = "Fixed proficiency"
            } else if (isClassSkill) {
              canSelect = skillData.selectedClassSkills.length < skillData.classSkillPoints || isSelected
              reason = `Class skill (${skillData.selectedClassSkills.length}/${skillData.classSkillPoints})`
            } else if (isGlobalSkill) {
              canSelect = skillData.selectedGlobalSkills.length < skillData.globalSkillPoints || isSelected
              reason = `Global skill (${skillData.selectedGlobalSkills.length}/${skillData.globalSkillPoints})`
            } else {
              // Skill is not available for selection (already covered by fixed/class/global)
              canSelect = false
              reason = "Not available"
            }
            
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
              type="button"
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
              type="button"
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
