"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { calculateModifier } from "@/lib/utils/character-utils"
import { skills } from "@/lib/data/skills"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for tools and languages
const tools = [
  "Artisan's Tools",
]

const languages = [
  "Common",
]

export function SkillSelector() {
  const { control } = useFormContext()
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}

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
            const modifier = calculateModifier(abilityScores[skill.ability] || 10)
            return (
              <TooltipProvider key={skill.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={skill.id}
                        onCheckedChange={(checked) => {
                          // Handle skill proficiency change
                        }}
                      />
                      <label
                        htmlFor={skill.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {skill.name}
                      </label>
                      <Badge variant="outline" className="ml-2">
                        {modifier >= 0 ? '+' : ''}{modifier}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ability: {skill.abilityAbbr}</p>
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
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          {Object.entries(skillsByAbility).map(([ability, abilitySkills]) => 
            renderSkillSection(ability, abilitySkills)
          )}
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Tool Proficiencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {tools.map((tool) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <Checkbox
                      id={tool}
                      onCheckedChange={(checked) => {
                        // Handle tool proficiency change
                      }}
                    />
                    <label
                      htmlFor={tool}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tool}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={language}
                      onCheckedChange={(checked) => {
                        // Handle language proficiency change
                      }}
                    />
                    <label
                      htmlFor={language}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {language}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
