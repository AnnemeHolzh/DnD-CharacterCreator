"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTools } from "@/hooks/use-tools"
import { useState } from "react"

export function ToolSelector() {
  const { control, setValue } = useFormContext()
  const selectedTools = useWatch({ control, name: "tools" }) || []
  const { tools, toolCategories, loading, error, refreshTools } = useTools()
  const [refreshing, setRefreshing] = useState(false)

  const handleToolToggle = (toolIndex: string, isSelected: boolean) => {
    let newSelectedTools = [...selectedTools]
    
    if (isSelected) {
      if (!newSelectedTools.includes(toolIndex)) {
        newSelectedTools.push(toolIndex)
      }
    } else {
      newSelectedTools = newSelectedTools.filter(t => t !== toolIndex)
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
          {selectedTools.length > 0 ? (
            <div>
              <h4 className="font-display text-sm mb-2 text-amber-400">Selected Tools</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTools.map((toolIndex: string) => (
                  <Badge key={toolIndex} variant="secondary" className="bg-amber-900/40 text-amber-200">
                    {getToolDisplayName(toolIndex)}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tools selected</p>
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
                  
                  return (
                    <TooltipProvider key={tool.index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100/5 transition-colors">
                            <Checkbox
                              id={tool.index}
                              checked={isSelected}
                              onCheckedChange={(checked) => handleToolToggle(tool.index, checked as boolean)}
                            />
                            <label
                              htmlFor={tool.index}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                              {tool.name}
                            </label>
                            {isSelected && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-green-900/40 text-green-200">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Category: {category}</p>
                          {tool.description && (
                            <p className="max-w-xs">{tool.description}</p>
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