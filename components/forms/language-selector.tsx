"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguages } from "@/hooks/use-languages"
import { useState, useEffect, useMemo } from "react"
import { calculateLanguageProficiencies, validateLanguageSelections, LanguageProficiencyData, getBackgroundLanguageChoices, getRaceLanguageChoices, calculateLanguageChoiceAllowances } from "@/lib/utils/character-utils"

export function LanguageSelector() {
  const { control, setValue } = useFormContext()
  const selectedLanguages = useWatch({ control, name: "languages" }) || []
  const race = useWatch({ control, name: "race" })
  const subrace = useWatch({ control, name: "subrace" })
  const background = useWatch({ control, name: "background" })
  const characterClasses = useWatch({ control, name: "classes" }) || []
  const { languages, loading, error, refresh } = useLanguages()

  // Calculate language proficiency data
  const languageData = useMemo(() => {
    return calculateLanguageProficiencies(
      characterClasses,
      race || "",
      subrace || "",
      background || "",
      selectedLanguages
    )
  }, [characterClasses, race, subrace, background, selectedLanguages])

  // Get background language choices
  const backgroundLanguageChoices = useMemo(() => {
    return getBackgroundLanguageChoices(background || "")
  }, [background])

  // Get race language choices
  const raceLanguageChoices = useMemo(() => {
    return getRaceLanguageChoices(race || "", subrace || "")
  }, [race, subrace])

  // Calculate total language choice allowances
  const totalLanguageAllowances = useMemo(() => {
    return calculateLanguageChoiceAllowances(race || "", subrace || "", background || "")
  }, [race, subrace, background])

  // Auto-select fixed languages when they change
  useEffect(() => {
    if (languageData.fixedLanguages.length > 0) {
      const newSelectedLanguages = [...selectedLanguages]
      let hasChanges = false
      
      languageData.fixedLanguages.forEach(languageId => {
        if (!newSelectedLanguages.includes(languageId)) {
          newSelectedLanguages.push(languageId)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        setValue("languages", newSelectedLanguages)
      }
    }
  }, [languageData.fixedLanguages, setValue])

  // Validate language selections
  const validation = useMemo(() => {
    return validateLanguageSelections(languageData, selectedLanguages, race || "", subrace || "", background || "")
  }, [languageData, selectedLanguages, race, subrace, background])

  const handleLanguageToggle = (languageIndex: string, isSelected: boolean) => {
    let newSelectedLanguages = [...selectedLanguages]
    
    if (isSelected) {
      if (!newSelectedLanguages.includes(languageIndex)) {
        newSelectedLanguages.push(languageIndex)
      }
    } else {
      // Don't allow removing fixed languages
      if (!languageData.fixedLanguages.includes(languageIndex)) {
        newSelectedLanguages = newSelectedLanguages.filter(l => l !== languageIndex)
      }
    }
    
    setValue("languages", newSelectedLanguages)
  }

  const getLanguageDisplayName = (languageIndex: string): string => {
    const language = languages.find(l => l.index === languageIndex)
    return language ? language.name : languageIndex
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading languages...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load languages: {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refresh}
                className="ml-2"
              >
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
      {/* Language Summary */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Language Proficiency Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fixed Proficiencies */}
          {languageData.fixedLanguages.length > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2 text-amber-400">Fixed Proficiencies</h4>
              <div className="flex flex-wrap gap-2">
                {languageData.fixedLanguages.map((languageId) => (
                  <Badge key={languageId} variant="secondary" className="bg-amber-900/40 text-amber-200">
                    {getLanguageDisplayName(languageId)}
                    <Lock className="inline ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Background Language Choices */}
          {backgroundLanguageChoices > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2 text-blue-400">Background Language Choices</h4>
              <p className="text-sm text-muted-foreground">
                Your background allows you to choose {backgroundLanguageChoices} additional language{backgroundLanguageChoices !== 1 ? 's' : ''}.
              </p>
            </div>
          )}

          {/* Race Language Choices */}
          {raceLanguageChoices > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2 text-blue-400">Race Language Choices</h4>
              <p className="text-sm text-muted-foreground">
                Your race allows you to choose {raceLanguageChoices} additional language{raceLanguageChoices !== 1 ? 's' : ''}.
              </p>
            </div>
          )}

          {/* Total Language Allowances */}
          {totalLanguageAllowances > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2 text-green-400">Total Language Allowances</h4>
              <p className="text-sm text-muted-foreground">
                You can choose {totalLanguageAllowances} additional language{totalLanguageAllowances !== 1 ? 's' : ''} from your race and background.
              </p>
            </div>
          )}

          {/* Selected Languages */}
          {selectedLanguages.length > 0 && (
            <div>
              <h4 className="font-display text-sm mb-2">Selected Languages</h4>
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((languageIndex: string) => (
                  <Badge key={languageIndex} variant="secondary" className="bg-amber-900/40 text-amber-200">
                    {getLanguageDisplayName(languageIndex)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {selectedLanguages.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
              </AlertDescription>
            </Alert>
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

      {/* Language Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Available Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {languages.map((language) => {
              const isSelected = selectedLanguages.includes(language.index)
              const isFixed = languageData.fixedLanguages.includes(language.index)
              
              return (
                <div key={language.index} className="flex items-center space-x-2">
                  <Checkbox
                    id={language.index}
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleLanguageToggle(language.index, checked as boolean)
                    }
                    disabled={isFixed}
                  />
                  <label
                    htmlFor={language.index}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      isFixed ? "text-amber-400" : ""
                    }`}
                  >
                    {language.name}
                    {isFixed && <Lock className="inline ml-1 h-3 w-3" />}
                  </label>
                  {isFixed && (
                    <Badge variant="secondary" className="ml-1 text-xs bg-amber-900/40 text-amber-200">
                      Fixed
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 