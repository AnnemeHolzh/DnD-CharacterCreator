"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguages } from "@/hooks/use-languages"

export function LanguageSelector() {
  const { control, setValue } = useFormContext()
  const selectedLanguages = useWatch({ control, name: "languages" }) || []
  const { languages, loading, error, refresh } = useLanguages()

  const handleLanguageToggle = (languageIndex: string, isSelected: boolean) => {
    let newSelectedLanguages = [...selectedLanguages]
    
    if (isSelected) {
      if (!newSelectedLanguages.includes(languageIndex)) {
        newSelectedLanguages.push(languageIndex)
      }
    } else {
      newSelectedLanguages = newSelectedLanguages.filter(l => l !== languageIndex)
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Languages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Summary */}
        {selectedLanguages.length > 0 && (
          <div className="mb-4">
            <h4 className="font-display text-sm mb-2 text-amber-400">Selected Languages</h4>
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

        {/* Language Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {languages.map((language) => (
            <div key={language.index} className="flex items-center space-x-2">
              <Checkbox
                id={language.index}
                checked={selectedLanguages.includes(language.index)}
                onCheckedChange={(checked) => 
                  handleLanguageToggle(language.index, checked as boolean)
                }
              />
              <label
                htmlFor={language.index}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {language.name}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 