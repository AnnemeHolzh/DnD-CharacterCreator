"use client"

import { useFormContext } from "react-hook-form"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { AbilityScoreSelector } from "@/components/forms/ability-score-selector"
import { SkillSelector } from "@/components/forms/skill-selector"
import { EquipmentSelector } from "@/components/forms/equipment-selector"
import { RaceSection } from "@/components/forms/race-section"
import { ClassSection } from "@/components/forms/class-section"
import { FeatSelector } from "@/components/forms/feat-selector"
import { CharacterStatsDisplay } from "@/components/forms/character-stats-display"

export function MechanicsSection() {
  const { control } = useFormContext()

  return (
    <div className="space-y-8">
      <RaceSection />
      <ClassSection />

      <FantasyFormSection title="Ability Scores">
        <AbilityScoreSelector />
      </FantasyFormSection>

      <FantasyFormSection title="Character Stats">
        <CharacterStatsDisplay />
      </FantasyFormSection>

      <FantasyFormSection title="Feats">
        <FeatSelector />
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
