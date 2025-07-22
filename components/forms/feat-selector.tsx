"use client"

import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight } from "lucide-react"
import { feats, getAvailableFeats, getEligibleFeats, meetsFeatPrerequisites, hasASI, getFeatASIs } from "@/lib/data/feats"
import { classes } from "@/lib/data/classes"
import { ASISelectionDialog } from "./asi-selection-dialog"

export function FeatSelector() {
  const { control, setValue } = useFormContext()
  const [asiDialogOpen, setAsiDialogOpen] = useState(false)
  const [pendingFeatAsi, setPendingFeatAsi] = useState<{ featName: string; asiOptions: string[] } | null>(null)
  const [featASIChoices, setFeatASIChoices] = useState<Record<string, string>>({})
  const [featLevelsExpanded, setFeatLevelsExpanded] = useState(false)
  
  const abilityScores = useWatch({ control, name: "abilityScores" }) || {}
  const characterClasses = useWatch({ control, name: "classes" }) || []
  const proficiencies = useWatch({ control, name: "proficiencies" }) || []
  const selectedFeats = useWatch({ control, name: "feats" }) || []
  const asiChoices = useWatch({ control, name: "asiChoices" }) || []
  const characterLevel = useWatch({ control, name: "level" }) || 1

  // Calculate available feats
  const availableFeats = getAvailableFeats(characterLevel, characterClasses, abilityScores, proficiencies)
  
  // Get eligible feats that meet prerequisites
  const eligibleFeats = getEligibleFeats(abilityScores, characterClasses, proficiencies)
  
  // Calculate remaining feats (ASI choices count as feats)
  const remainingFeats = availableFeats - selectedFeats.length - asiChoices.length
  
  // Calculate ASI bonuses from selected feats
  const featASIs = getFeatASIs(selectedFeats)

  return (
    <div className="space-y-6">
      {/* Feat Levels by Class Info Card - Now at the top and toggleable */}
      <Collapsible open={featLevelsExpanded} onOpenChange={setFeatLevelsExpanded}>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer transition-all duration-200 bg-blue-900/20 border border-blue-800/30 hover:bg-blue-900/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-display text-blue-400">Feat Levels by Class</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs bg-blue-900/50 text-blue-300 border-blue-600/50">
                    Info
                  </Badge>
                  {featLevelsExpanded ? (
                    <ChevronDown className="h-4 w-4 text-blue-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-blue-400" />
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 bg-blue-900/10 border border-blue-800/20 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => {
                const featLevels = cls.FeatLevel || []
                return (
                  <div key={cls.id} className="text-sm">
                    <div className="font-semibold text-blue-300">{cls.name}</div>
                    <div className="text-blue-200">
                      Feat levels: {featLevels.length > 0 ? featLevels.join(', ') : 'None'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Feat Summary */}
      <div className="flex items-center justify-between p-4 bg-amber-900/20 border border-amber-800/30 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{availableFeats}</div>
            <div className="text-sm text-amber-300">Available Feats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{selectedFeats.length}</div>
            <div className="text-sm text-green-300">Selected Feats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{asiChoices.length}</div>
            <div className="text-sm text-purple-300">ASI Choices</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${remainingFeats >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {remainingFeats}
            </div>
            <div className="text-sm text-blue-300">Remaining Slots</div>
          </div>
        </div>
        
        {remainingFeats < 0 && (
          <div className="flex items-center space-x-2 text-red-400">
            <XCircle className="h-5 w-5" />
            <span className="text-sm">Too many feats selected</span>
          </div>
        )}
        
        {/* ASI Summary */}
        {Object.values(featASIs).some(bonus => bonus > 0) && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
            <div className="text-sm font-semibold text-green-400 mb-2">Ability Score Bonuses from Feats:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(featASIs).map(([ability, bonus]) => 
                bonus > 0 ? (
                  <div key={ability} className="flex justify-between">
                    <span className="text-green-300 capitalize">{ability}:</span>
                    <span className="text-green-400 font-semibold">+{bonus}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feat Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feats.map((feat) => {
          const isEligible = eligibleFeats.some(f => f.name === feat.name)
          const isSelected = selectedFeats.includes(feat.name)
          const canSelect = isEligible && (remainingFeats > 0 || isSelected)
          
          return (
            <TooltipProvider key={feat.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-green-900/30 border-green-600/50' 
                      : isEligible && remainingFeats > 0
                        ? 'bg-amber-900/20 border-amber-800/30 hover:bg-amber-900/30' 
                        : isEligible
                          ? 'bg-blue-900/20 border-blue-800/30 opacity-80'
                          : 'bg-gray-900/20 border-gray-700/50 opacity-60'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-display">{feat.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {isSelected && <CheckCircle className="h-5 w-5 text-green-400" />}
                          {!isEligible && <AlertTriangle className="h-5 w-5 text-red-400" />}
                          {hasASI(feat) && (
                            <Badge variant="secondary" className="text-xs bg-green-900/50 text-green-300 border-green-600/50">
                              ASI
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {feat.source}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-semibold text-amber-400">Prerequisites:</span>
                          <span className="text-sm ml-2">{feat.prereqs}</span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-amber-400">Benefits:</span>
                          <p className="text-sm mt-1 text-gray-300">{feat.benefits}</p>
                        </div>
                        {hasASI(feat) && (
                          <div>
                            <span className="text-sm font-semibold text-green-400">Ability Score Increase:</span>
                            <span className="text-sm ml-2 text-green-300">
                              {feat.asi?.join(" or ")}
                            </span>
                          </div>
                        )}
                        
                        <FormField
                          control={control}
                          name="feats"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked && isEligible && remainingFeats > 0) {
                                      // Check if feat has multiple ASI options
                                      if (feat.asi && feat.asi.length > 1) {
                                        setPendingFeatAsi({ featName: feat.name, asiOptions: feat.asi })
                                        setAsiDialogOpen(true)
                                      } else {
                                        field.onChange([...selectedFeats, feat.name])
                                      }
                                    } else if (!checked && isSelected) {
                                      field.onChange(selectedFeats.filter((f: string) => f !== feat.name))
                                    }
                                  }}
                                  disabled={!isEligible}
                                />
                              </FormControl>
                              <span className="text-sm">
                                {isSelected ? 'Selected' : isEligible && remainingFeats > 0 ? 'Available' : isEligible ? 'No Slots Left' : 'Not Eligible'}
                              </span>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-md">
                  <div className="space-y-2">
                    <div>
                      <strong>Prerequisites:</strong> {feat.prereqs}
                    </div>
                    <div>
                      <strong>Benefits:</strong> {feat.benefits}
                    </div>
                    {hasASI(feat) && (
                      <div>
                        <strong>Ability Score Increase:</strong> {feat.asi?.join(" or ")}
                      </div>
                    )}
                    {!isEligible && (
                      <div className="text-red-400">
                        <strong>Not Eligible:</strong> You don't meet the prerequisites for this feat.
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      {/* ASI Selection Dialog */}
      <ASISelectionDialog
        isOpen={asiDialogOpen}
        onClose={() => {
          setAsiDialogOpen(false)
          setPendingFeatAsi(null)
        }}
        featName={pendingFeatAsi?.featName || ""}
        asiOptions={pendingFeatAsi?.asiOptions || []}
        onConfirm={(selectedAbility) => {
          // Add the feat with the selected ASI
          if (pendingFeatAsi) {
            const currentFeats = selectedFeats
            if (!currentFeats.includes(pendingFeatAsi.featName)) {
              setValue("feats", [...currentFeats, pendingFeatAsi.featName])
            }
            // Track the ASI choice for this feat
            const newChoices = {
              ...featASIChoices,
              [pendingFeatAsi.featName]: selectedAbility
            }
            setFeatASIChoices(newChoices)
            // Store in form context for ability score selector to access
            setValue("featASIChoices", newChoices)
          }
          setAsiDialogOpen(false)
          setPendingFeatAsi(null)
        }}
      />
    </div>
  )
} 