"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { useEffect, useState } from "react"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getSpells, getSpellDetails } from "@/lib/dnd5e-api"

export function SpellSelector() {
  const { control } = useFormContext()

  const watchedClass = useWatch({ control, name: "class" })
  const watchedSubclass = useWatch({ control, name: "subclass" })
  const watchedLevel = useWatch({ control, name: "level" })

  const [apiSpells, setApiSpells] = useState<any[]>([])
  const [loadingSpells, setLoadingSpells] = useState(true)

  // Fetch all spells from API
  useEffect(() => {
    setLoadingSpells(true)
    getSpells().then((data) => {
      setApiSpells(data.results)
      setLoadingSpells(false)
    })
  }, [])

  // Filter spells by class, subclass, and level (details fetch for each spell)
  const [filteredSpells, setFilteredSpells] = useState<any[]>([])
  useEffect(() => {
    if (!watchedClass || !apiSpells.length) {
      setFilteredSpells([])
      return
    }
    setLoadingSpells(true)
    Promise.all(
      apiSpells.map((spell) => getSpellDetails(spell.index))
    ).then((details) => {
      const filtered = details.filter((spell) => {
        // Only show spells for the selected class
        const isClassSpell = spell.classes.some((c: any) => c.index === watchedClass)
        // Only show spells up to the character's current level
        const isLevelOk = spell.level <= (watchedLevel || 1)
        // If subclass is selected and spell has subclasses, filter for subclass
        let isSubclassOk = true
        if (watchedSubclass && spell.subclasses && spell.subclasses.length > 0) {
          isSubclassOk = spell.subclasses.some((sc: any) => sc.index === watchedSubclass)
        }
        return isClassSpell && isLevelOk && isSubclassOk
      })
      setFilteredSpells(filtered)
      setLoadingSpells(false)
    })
  }, [watchedClass, watchedSubclass, watchedLevel, apiSpells])

  // TODO: Implement spell slot calculation using API data if needed
  // For now, skip spell slot display

  if (!watchedClass) {
    return (
      <div className="text-center py-8 border border-dashed border-amber-800/30 rounded-md">
        <p className="text-muted-foreground">Select a class to see available spells.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-display text-lg">Available Spells</h4>
          <Input
            placeholder="Search spells..."
            className="w-[200px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
            // TODO: Implement search functionality
          />
        </div>

        <FormField
          control={control}
          name="spells"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                {loadingSpells ? (
                  <div className="text-center py-8 border border-dashed border-amber-800/30 rounded-md">
                    <p className="text-muted-foreground">Loading spells...</p>
                  </div>
                ) : filteredSpells.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredSpells.map((spell) => (
                      <div
                        key={spell.index}
                        className="flex items-start space-x-2 p-2 rounded-md border border-amber-800/30 bg-black/20 backdrop-blur-sm"
                      >
                        <Checkbox
                          id={spell.index}
                          checked={field.value?.includes(spell.index)}
                          onCheckedChange={(checked) => {
                            const updatedSpells = checked
                              ? [...(field.value || []), spell.index]
                              : (field.value || []).filter((id: string) => id !== spell.index)
                            field.onChange(updatedSpells)
                          }}
                        />
                        <div>
                          <label htmlFor={spell.index} className="text-sm font-medium leading-none cursor-pointer">
                            {spell.name}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} • {spell.school.name} • {spell.casting_time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-amber-800/30 rounded-md">
                    <p className="text-muted-foreground">No spells available for your class and level.</p>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
