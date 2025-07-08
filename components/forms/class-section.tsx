"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import { classes } from "@/lib/data/classes"

export function ClassSection() {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "classes"
  })

  return (
    <FantasyFormSection title="Class">
      <div className="space-y-6">
        {fields.map((field, index) => (
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
            <CardContent className="space-y-4">
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
                      <FormLabel className="font-display text-base">Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          placeholder="Level"
                          className="border-amber-800/30 bg-black/20 backdrop-blur-sm"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                            <SelectValue placeholder="Select subclass" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Subclass options will be populated based on selected class */}
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
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ class: "", subclass: "", level: 1 })}
          className="w-full border-amber-800/30 bg-black/20 backdrop-blur-sm hover:bg-amber-800/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>
    </FantasyFormSection>
  )
}