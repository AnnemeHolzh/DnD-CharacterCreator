"use client"

import { useFormContext } from "react-hook-form"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { AbilityScoreSelector } from "@/components/forms/ability-score-selector"
import { SkillSelector } from "@/components/forms/skill-selector"
import { EquipmentSelector } from "@/components/forms/equipment-selector"
import { RaceSection } from "@/components/forms/race-section"
import { ClassSection } from "@/components/forms/class-section"

export function MechanicsSection() {
  const { control } = useFormContext()

  return (
    <div className="space-y-8">
      <RaceSection />
      <ClassSection />

      <FantasyFormSection title="Ability Scores">
        <AbilityScoreSelector />
      </FantasyFormSection>

      <FantasyFormSection title="Skills & Proficiencies">
        <SkillSelector />
      </FantasyFormSection>

      <FantasyFormSection title="Equipment">
        <EquipmentSelector />
      </FantasyFormSection>
    </div>
  )
}
