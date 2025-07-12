"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { useEffect, useState } from "react"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
// import { getSpells, getSpellDetails } from "@/lib/dnd5e-api"

export function SpellSelector() {
  // TODO: Implement spell selector with D&D API integration
  return (
    <div className="text-center py-8 border border-dashed border-amber-800/30 rounded-md">
      <p className="text-muted-foreground">Spell selector coming soon...</p>
    </div>
  )
}
