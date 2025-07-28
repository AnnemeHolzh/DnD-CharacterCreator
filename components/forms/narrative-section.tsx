"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { WordLimitedTextarea } from "@/components/ui/word-limited-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { backgrounds } from "@/lib/data/backgrounds"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { AlignmentSelector } from "@/components/forms/alignment-selector"

export function NarrativeSection() {
  const { control } = useFormContext()
  const [activeTraitTab, setActiveTraitTab] = useState("personality")

  return (
    <div className="space-y-8">
      <FantasyFormSection title="Identity & Origins">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-lg">Character Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your character's name"
                      maxLength={100}
                      {...field}
                      className="border-amber-800/30 bg-black/20 backdrop-blur-sm pr-16"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                      {field.value?.length || 0}/100
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="background"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-lg">Background</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                      <SelectValue placeholder="Select a background" />
                    </SelectTrigger>
                    <SelectContent>
                      {backgrounds.map((background) => (
                        <SelectItem key={background.id} value={background.id}>
                          {background.name}
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

        <FormField
          control={control}
          name="alignment"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-display text-lg">Alignment</FormLabel>
              <FormControl>
                <AlignmentSelector value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="appearance"
          rules={{
            validate: (value) => {
              if (!value || value.trim().length === 0) return true // Allow empty
              const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length
              if (wordCount < 20) {
                return `Appearance description must be at least 20 words (currently ${wordCount} words)`
              }
              return true
            }
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-display text-lg">Appearance</FormLabel>
              <FormControl>
                <WordLimitedTextarea
                  placeholder="Describe your character's physical appearance..."
                  className="min-h-[100px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                  maxWords={450}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="text-xs text-muted-foreground">
                  Word count: {field.value.trim().split(/\s+/).filter((word: string) => word.length > 0).length}/450
                  {field.value.trim().split(/\s+/).filter((word: string) => word.length > 0).length < 20 && (
                    <span className="text-amber-400 ml-2">(Minimum 20 words required)</span>
                  )}
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="backstory"
          rules={{
            validate: (value) => {
              if (!value || value.trim().length === 0) return true // Allow empty
              const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length
              if (wordCount < 200) {
                return `Backstory must be at least 200 words (currently ${wordCount} words)`
              }
              return true
            }
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="font-display text-lg">Backstory</FormLabel>
              <FormControl>
                <WordLimitedTextarea
                  placeholder="Share your character's history and origins..."
                  className="min-h-[150px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                  maxWords={750}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="text-xs text-muted-foreground">
                  Word count: {field.value.trim().split(/\s+/).filter((word: string) => word.length > 0).length}/750
                  {field.value.trim().split(/\s+/).filter((word: string) => word.length > 0).length < 200 && (
                    <span className="text-amber-400 ml-2">(Minimum 200 words required)</span>
                  )}
                </div>
              )}
            </FormItem>
          )}
        />
      </FantasyFormSection>

      <FantasyFormSection title="Character Traits">
        <Tabs value={activeTraitTab} onValueChange={setActiveTraitTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="personality" className="font-display">
              Traits
            </TabsTrigger>
            <TabsTrigger value="ideals" className="font-display">
              Ideals
            </TabsTrigger>
            <TabsTrigger value="bonds" className="font-display">
              Bonds
            </TabsTrigger>
            <TabsTrigger value="flaws" className="font-display">
              Flaws
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personality">
            <FormField
              control={control}
              name="personalityTraits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-lg">Personality Traits</FormLabel>
                  <FormControl>
                    <WordLimitedTextarea
                      placeholder="What traits define your character's personality?"
                      className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                      maxWords={250}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="ideals">
            <FormField
              control={control}
              name="ideals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-lg">Ideals</FormLabel>
                  <FormControl>
                    <WordLimitedTextarea
                      placeholder="What principles does your character believe in?"
                      className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                      maxWords={250}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="bonds">
            <FormField
              control={control}
              name="bonds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-lg">Bonds</FormLabel>
                  <FormControl>
                    <WordLimitedTextarea
                      placeholder="What connections tie your character to the world?"
                      className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                      maxWords={250}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="flaws">
            <FormField
              control={control}
              name="flaws"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-lg">Flaws</FormLabel>
                  <FormControl>
                    <WordLimitedTextarea
                      placeholder="What weaknesses or shortcomings does your character have?"
                      className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                      maxWords={250}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </FantasyFormSection>
    </div>
  )
}
