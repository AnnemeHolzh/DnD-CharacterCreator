"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, RefreshCw, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTools } from "@/hooks/use-tools"
import { useState, useEffect, useMemo } from "react"
import { calculateToolProficiencies, validateToolSelections, ToolProficiencyData, isArtisansTool, calculateToolChoiceAllowances } from "@/lib/utils/character-utils"

export function ToolSelector() {
  const { control, setValue } = useFormContext()
  const selectedTools = useWatch({ control, name: "tools" }) || []
  const race = useWatch({ control, name: "race" })
  const subrace = useWatch({ control, name: "subrace" })
  const background = useWatch({ control, name: "background" })
  const characterClasses = useWatch({ control, name: "classes" }) || []
  const { tools, toolCategories, loading, error, refreshTools } = useTools()
  const [refreshing, setRefreshing] = useState(false)

  // Calculate tool proficiency data
  const toolData = useMemo(() => {
    return calculateToolProficiencies(
      characterClasses,
      race || "",
      subrace || "",
      background || "",
      selectedTools
    )
  }, [characterClasses, race, subrace, background, selectedTools])

  // Auto-select fixed tools when they change
  useEffect(() => {
    if (toolData.fixedTools.length > 0) {
      const newSelectedTools = [...selectedTools]
      let hasChanges = false
      
      toolData.fixedTools.forEach(toolId => {
        if (!newSelectedTools.includes(toolId)) {
          newSelectedTools.push(toolId)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        setValue("tools", newSelectedTools)
      }
    }
  }, [toolData.fixedTools, selectedTools, setValue])

  // Calculate tool choice allowances
  const toolChoiceAllowances = useMemo(() => {
    return calculateToolChoiceAllowances(characterClasses, race || "", subrace || "", background || "")
  }, [characterClasses, race, subrace, background])

  // Validate tool selections
  const validation = useMemo(() => {
    return validateToolSelections(toolData, selectedTools, tools, characterClasses, race || "", subrace || "", background || "")
  }, [toolData, selectedTools, tools, characterClasses, race, subrace, background])

  const handleToolToggle = (toolIndex: string, isSelected: boolean) => {
    let newSelectedTools = [...selectedTools]
    
    if (isSelected) {
      if (!newSelectedTools.includes(toolIndex)) {
        newSelectedTools.push(toolIndex)
      }
    } else {
      // Don't allow removing fixed tools
      if (!toolData.fixedTools.includes(toolIndex)) {
        newSelectedTools = newSelectedTools.filter(t => t !== toolIndex)
      }
    }
    
    setValue("tools", newSelectedTools)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshTools()
    } finally {
      setRefreshing(false)
    }
  }

  const getToolDisplayName = (toolIndex: string): string => {
    const tool = tools.find(t => t.index === toolIndex)
    return tool ? tool.name : toolIndex
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Tool Proficiencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading tools from D&D API...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Tool Proficiencies</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load tools: {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="ml-2"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tool Summary */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Tool Proficiency Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fixed Proficiencies */}
          {toolData.fixedTools.length > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2 text-amber-400">Fixed Proficiencies</h4>
              <div className="flex flex-wrap gap-2">
                {toolData.fixedTools.map((toolId) => (
                  <Badge key={toolId} variant="secondary" className="bg-amber-900/40 text-amber-200">
                    {getToolDisplayName(toolId)}
                    <Lock className="inline ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tool Choice Allowances */}
          {toolChoiceAllowances > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2 text-blue-400">Tool Choice Allowances</h4>
              <p className="text-sm text-muted-foreground">
                You can choose {toolChoiceAllowances} additional tool{toolChoiceAllowances !== 1 ? 's' : ''} from your race, background, or class.
                {toolData.artisansToolChoices > 0 && (
                  <span className="block mt-1 text-amber-400">
                    {toolData.artisansToolChoices} of these choices must be artisan's tools.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Selected Tools */}
          {selectedTools.length > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2">Selected Tools</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTools.map((toolIndex: string) => {
                  const isFixed = toolData.fixedTools.includes(toolIndex)
                  return (
                    <Badge 
                      key={toolIndex} 
                      variant="secondary" 
                      className={`${isFixed ? 'bg-amber-900/40 text-amber-200' : 'bg-green-900/40 text-green-200'}`}
                    >
                      {getToolDisplayName(toolIndex)}
                      {isFixed && <Lock className="inline ml-1 h-3 w-3" />}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {!validation.isValid && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {validation.errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tool Categories */}
      <div className="space-y-4">
        {Object.entries(toolCategories).map(([category, categoryTools]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg font-display">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryTools.map((tool) => {
                  const isSelected = selectedTools.includes(tool.index)
                  const isFixed = toolData.fixedTools.includes(tool.index)
                  const isArtisansToolType = isArtisansTool(tool.name)
                  
                  return (
                    <TooltipProvider key={tool.index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100/5 transition-colors">
                            <Checkbox
                              id={tool.index}
                              checked={isSelected}
                              onCheckedChange={(checked) => handleToolToggle(tool.index, checked as boolean)}
                              disabled={isFixed}
                            />
                            <label
                              htmlFor={tool.index}
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 ${
                                isFixed ? "text-amber-400" : ""
                              }`}
                            >
                              {tool.name}
                              {isFixed && <Lock className="inline ml-1 h-3 w-3" />}
                            </label>
                            {isSelected && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-green-900/40 text-green-200">
                                Selected
                              </Badge>
                            )}
                            {isFixed && (
                              <Badge variant="secondary" className="ml-1 text-xs bg-amber-900/40 text-amber-200">
                                Fixed
                              </Badge>
                            )}
                            {isArtisansToolType && (
                              <Badge variant="secondary" className="ml-1 text-xs bg-blue-900/40 text-blue-200">
                                Artisan
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Category: {category}</p>
                          {tool.description && (
                            <p className="max-w-xs">{tool.description}</p>
                          )}
                          {isFixed && (
                            <p className="text-amber-400">Fixed proficiency from race, background, or class</p>
                          )}
                          {isArtisansToolType && (
                            <p className="text-blue-400">This is an artisan's tool</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Tools
        </Button>
      </div>
    </div>
  )
} 