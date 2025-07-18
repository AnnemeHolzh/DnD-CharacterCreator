"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { Textarea } from "@/components/ui/textarea"
import { WeaponSelector } from "./weapon-selector"
import { ArmorSelector } from "./armor-selector"
import { ItemSelector } from "./item-selector"
import { WealthSelector } from "./wealth-selector"
import { SpellSelector } from "./spell-selector"

export function EquipmentSelector() {
  const { control } = useFormContext()
  const [activeTab, setActiveTab] = useState("weapons")

  return (
    <FantasyFormSection title="Equipment & Possessions">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="weapons" className="font-display">
            Weapons
          </TabsTrigger>
          <TabsTrigger value="armor" className="font-display">
            Armor
          </TabsTrigger>
          <TabsTrigger value="spells" className="font-display">
            Spells
          </TabsTrigger>
          <TabsTrigger value="items" className="font-display">
            Items
          </TabsTrigger>
          <TabsTrigger value="wealth" className="font-display">
            Wealth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weapons">
          <WeaponSelector />
        </TabsContent>

        <TabsContent value="armor">
          <ArmorSelector />
        </TabsContent>

        <TabsContent value="spells">
          <SpellSelector />
        </TabsContent>

        <TabsContent value="items">
          <ItemSelector />
        </TabsContent>

        <TabsContent value="wealth">
          <WealthSelector />
        </TabsContent>
      </Tabs>
    </FantasyFormSection>
  )
}
