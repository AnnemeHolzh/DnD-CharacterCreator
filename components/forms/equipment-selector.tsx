"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { Textarea } from "@/components/ui/textarea"

export function EquipmentSelector() {
  const { control } = useFormContext()

  return (
    <FantasyFormSection title="Equipment & Possessions">
      <Tabs defaultValue="weapons" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="weapons" className="font-display">
            Weapons
          </TabsTrigger>
          <TabsTrigger value="armor" className="font-display">
            Armor
          </TabsTrigger>
          <TabsTrigger value="items" className="font-display">
            Items
          </TabsTrigger>
          <TabsTrigger value="wealth" className="font-display">
            Wealth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weapons">
          <FormField
            control={control}
            name="weapons"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-lg">Weapons</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your character's weapons..."
                    className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="armor">
          <FormField
            control={control}
            name="armor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-lg">Armor</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your character's armor..."
                    className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="items">
          <FormField
            control={control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-lg">Items</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your character's items..."
                    className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="wealth">
          <FormField
            control={control}
            name="wealth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-display text-lg">Wealth</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your character's wealth and currency..."
                    className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
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
  )
}
