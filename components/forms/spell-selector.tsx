"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, X, BookOpen, Sparkles } from "lucide-react"
import { useSpells } from "@/hooks/use-spells"
import { SPELL_LEVELS, SPELL_SCHOOLS } from "@/lib/services/spells-service"
import { canCharacterCastSpells } from "@/lib/utils/character-utils"

export function SpellSelector() {
  const { control, setValue } = useFormContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpellForDetails, setSelectedSpellForDetails] = useState<string | null>(null)

  // Watch character classes to determine spellcasting ability
  const characterClasses = useWatch({
    control,
    name: "classes",
    defaultValue: []
  })

  const canCastSpells = canCharacterCastSpells(characterClasses)

  const {
    spells,
    selectedSpells,
    loading,
    error,
    selectedLevel,
    selectedSchool,
    setSelectedLevel,
    setSelectedSchool,
    selectSpell,
    removeSpell,
    clearFilters,
  } = useSpells()

  // Filter spells by search term
  const filteredSpells = spells.filter(spell =>
    spell.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Debug: Log first spell to see structure
  if (spells.length > 0 && !loading) {
    console.log('First spell structure:', spells[0])
  }

  // Handle spell selection
  const handleSpellSelect = async (spellIndex: string) => {
    try {
      await selectSpell(spellIndex)
      // Update form value
      const currentSpells = selectedSpells.map(spell => spell.index)
      setValue("spells", currentSpells)
    } catch (error) {
      console.error("Failed to select spell:", error)
    }
  }

  // Handle spell removal
  const handleSpellRemove = (spellIndex: string) => {
    removeSpell(spellIndex)
    // Update form value
    const currentSpells = selectedSpells
      .filter(spell => spell.index !== spellIndex)
      .map(spell => spell.index)
    setValue("spells", currentSpells)
  }

  // If character cannot cast spells, show disabled state
  if (!canCastSpells) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-lg font-semibold">🔮 Spells (disabled)</h3>
        </div>
        <Card className="border-dashed border-amber-800/30 bg-muted/20">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              This character cannot cast spells.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">🔮 Spells</h3>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Level</label>
          <Select value={selectedLevel?.toString() || "all"} onValueChange={(value) => setSelectedLevel(value === "all" ? undefined : parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {SPELL_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value.toString()}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">School</label>
          <Select value={selectedSchool || "all"} onValueChange={setSelectedSchool}>
            <SelectTrigger>
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {SPELL_SCHOOLS.map((school) => (
                <SelectItem key={school.value} value={school.value}>
                  {school.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search spells..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
        />
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading spells...</span>
        </div>
      )}

      {/* Spell List */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Available Spells */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Spells</CardTitle>
              <CardDescription>
                {filteredSpells.length} spells found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {filteredSpells.filter(spell => spell && spell.index).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No spells found matching your criteria.</p>
                      <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                  ) : (
                    filteredSpells.filter(spell => spell && spell.index).map((spell) => (
                    <div
                      key={spell.index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleSpellSelect(spell.index)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{spell.name || "Unknown Spell"}</div>
                        <div className="text-sm text-muted-foreground">
                          {spell.level === 0 ? "Cantrip" : `${spell.level}${getOrdinalSuffix(spell.level)} Level`} • {spell.school?.name || "Unknown School"}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Select
                      </Button>
                    </div>
                  ))
                )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected Spells */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Selected Spells</CardTitle>
              <CardDescription>
                {selectedSpells.length} spells selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {selectedSpells.filter(spell => spell && spell.index).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No spells selected yet.</p>
                      <p className="text-sm">Select spells from the available list.</p>
                    </div>
                  ) : (
                    selectedSpells.filter(spell => spell && spell.index).map((spell) => (
                    <div
                      key={spell.index}
                      className="p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{spell.name || "Unknown Spell"}</div>
                          <div className="text-sm text-muted-foreground">
                            {spell.level === 0 ? "Cantrip" : `${spell.level}${getOrdinalSuffix(spell.level)} Level`} • {spell.school?.name || "Unknown School"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {spell.casting_time || "Unknown"} • {spell.range || "Unknown"} • {spell.components?.join(", ") || "No components"}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSpellRemove(spell.index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Spell Details Toggle */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 text-xs"
                        onClick={() => setSelectedSpellForDetails(
                          selectedSpellForDetails === spell.index ? null : spell.index
                        )}
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        {selectedSpellForDetails === spell.index ? "Hide" : "Show"} Details
                      </Button>
                      
                      {/* Spell Details */}
                      {selectedSpellForDetails === spell.index && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-md text-xs">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Duration:</span> {spell.duration || "Unknown"}
                            </div>
                            <div>
                              <span className="font-medium">Description:</span>
                              <div className="mt-1 text-muted-foreground">
                                {spell.description?.map((paragraph, index) => (
                                  <p key={index} className="mb-2 last:mb-0">
                                    {paragraph}
                                  </p>
                                )) || <p>No description available</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Form Field for React Hook Form */}
      <FormField
        control={control}
        name="spells"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <input
                type="hidden"
                value={selectedSpells.map(spell => spell.index).join(",")}
                onChange={() => {}} // Controlled by the component
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function getOrdinalSuffix(num: number): string {
  if (num >= 11 && num <= 13) return 'th'
  switch (num % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}
