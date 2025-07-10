"use client"

import { useFormContext, useFieldArray, useWatch } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, AlertTriangle } from "lucide-react"
import { classes, getSubclassesForClass, getMinLevelUnlock, isSubclassAvailableAtLevel } from "@/lib/data/classes"
import { useEffect } from "react"

export function ClassSection() {
  const { control, setValue, trigger, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "classes"
  })

  // Watch all class entries for validation
  const watchedClasses = useWatch({
    control,
    name: "classes"
  })

  // Calculate total level across all classes
  const totalLevel = watchedClasses?.reduce((sum: number, classEntry: any) => {
    return sum + (classEntry?.level || 0);
  }, 0) || 0;

  // Check if total level exceeds 20
  const isTotalLevelExceeded = totalLevel > 20;

  // Validate subclass when class or level changes
  useEffect(() => {
    if (watchedClasses) {
      watchedClasses.forEach((classEntry: any, index: number) => {
        if (classEntry.subclass && classEntry.class && classEntry.level) {
          const isValid = isSubclassAvailableAtLevel(classEntry.subclass, classEntry.level);
          if (!isValid) {
            setValue(`classes.${index}.subclass`, "");
            trigger(`classes.${index}.subclass`);
          }
        }
      });
    }
  }, [watchedClasses, setValue, trigger]);

  return (
    <FantasyFormSection title="Class">
      <div className="space-y-6">
        {/* Total Level Display */}
        <div className="flex items-center justify-between p-4 border border-amber-800/30 bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="font-display text-lg text-amber-200">Total Character Level:</span>
            <span className={`font-bold text-xl ${isTotalLevelExceeded ? 'text-red-400' : 'text-green-400'}`}>
              {totalLevel}/20
            </span>
          </div>
          {isTotalLevelExceeded && (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Total level cannot exceed 20</span>
            </div>
          )}
        </div>

        {fields.map((field, index) => {
          const selectedClass = watchedClasses?.[index]?.class;
          const selectedLevel = watchedClasses?.[index]?.level;
          const availableSubclasses = selectedClass ? getSubclassesForClass(selectedClass) : [];
          
          // Filter subclasses based on level requirement
          const availableSubclassesForLevel = availableSubclasses.filter(subclass => {
            if (!selectedLevel) return true;
            return isSubclassAvailableAtLevel(subclass.subclass_name, selectedLevel);
          });

          // Calculate remaining levels available for other classes
          const otherClassesLevel = watchedClasses?.reduce((sum: number, classEntry: any, i: number) => {
            if (i !== index) {
              return sum + (classEntry?.level || 0);
            }
            return sum;
          }, 0) || 0;
          
          const maxLevelForThisClass = 20 - otherClassesLevel;

          return (
            <Card key={field.id} className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-display text-lg">
                  Class {index + 1}
                </CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Class Dropdown */}
                  <FormField
                    control={control}
                    name={`classes.${index}.class`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display text-base">Class</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="placeholder" disabled>
                                -- Select a class --
                              </SelectItem>
                              {classes.map((class_) => (
                                <SelectItem key={class_.id} value={class_.id}>
                                  {class_.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Level Selector */}
                  <FormField
                    control={control}
                    name={`classes.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display text-base">
                          Level {maxLevelForThisClass < 20 && (
                            <span className="text-xs text-amber-400 ml-2">
                              (Max: {maxLevelForThisClass})
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={maxLevelForThisClass}
                            placeholder="Level"
                            className={`border-amber-800/30 bg-black/20 backdrop-blur-sm ${
                              selectedLevel && selectedLevel > maxLevelForThisClass ? 'border-red-400' : ''
                            }`}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                              // Reset subclass when level changes
                              if (value && watchedClasses?.[index]?.subclass) {
                                const currentSubclass = watchedClasses[index].subclass;
                                if (!isSubclassAvailableAtLevel(currentSubclass, value)) {
                                  setValue(`classes.${index}.subclass`, "");
                                  trigger(`classes.${index}.subclass`);
                                }
                              }
                              // Trigger validation for total level
                              trigger("classes");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {selectedLevel && selectedLevel > maxLevelForThisClass && (
                          <p className="text-xs text-red-400 mt-1">
                            Level too high. Total level would exceed 20.
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Subclass Selector */}
                  <FormField
                    control={control}
                    name={`classes.${index}.subclass`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-display text-base">Subclass</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!selectedClass || !selectedLevel}
                          >
                            <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                              <SelectValue 
                                placeholder={
                                  !selectedClass 
                                    ? "Select a class first" 
                                    : !selectedLevel 
                                    ? "Set level first" 
                                    : "Select a subclass"
                                } 
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="placeholder" disabled>
                                -- Select a subclass --
                              </SelectItem>
                              {availableSubclassesForLevel.map((subclass) => (
                                <SelectItem key={subclass.subclass_name} value={subclass.subclass_name}>
                                  {subclass.subclass_name}
                                  {getMinLevelUnlock(subclass.subclass_name) > 1 && (
                                    <span className="text-xs text-muted-foreground ml-2">
                                      (Level {getMinLevelUnlock(subclass.subclass_name)}+)
                                    </span>
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ class: "", subclass: "", level: 1 })}
          className="w-full border-amber-800/30 bg-black/20 backdrop-blur-sm hover:bg-amber-800/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>

        {/* Error message for total level */}
        {errors.classes && typeof errors.classes === 'object' && 'message' in errors.classes && (
          <div className="flex items-center space-x-2 text-red-400 p-2 border border-red-400/30 bg-red-400/10 rounded">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{errors.classes.message as string}</span>
          </div>
        )}
      </div>
    </FantasyFormSection>
  )
}