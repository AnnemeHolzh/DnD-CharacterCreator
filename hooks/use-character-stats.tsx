"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { useState, useEffect, useMemo } from "react"
import { ArmorService, ArmorDetail } from "@/lib/services/armor-service"
import {
  calculateTotalAbilityScore,
  calculateModifier,
  calculateHitPointsWithBreakdown,
  calculateArmorClass,
  calculateInitiative
} from "@/lib/utils/character-utils"

interface CalculatedStats {
  hp: number
  ac: number
  initiative: number
  hpBreakdown: string[]
  acBreakdown: string[]
  initiativeBreakdown: string[]
}

export function useCharacterStats() {
  const { control, setValue } = useFormContext()
  const [armorDetails, setArmorDetails] = useState<ArmorDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Watch form values that affect calculations
  const abilityScores = useWatch({ control, name: "abilityScores" })
  const classes = useWatch({ control, name: "classes" })
  const race = useWatch({ control, name: "race" })
  const subrace = useWatch({ control, name: "subrace" })
  const armor = useWatch({ control, name: "armor" })
  const shield = useWatch({ control, name: "shield" })
  const feats = useWatch({ control, name: "feats" })
  const featASIChoices = useWatch({ control, name: "featASIChoices" })

  // Calculate stats with memoization
  const stats = useMemo((): CalculatedStats => {
    if (!abilityScores || !classes || classes.length === 0) {
      return {
        hp: 0,
        ac: 10,
        initiative: 0,
        hpBreakdown: ["No class selected"],
        acBreakdown: ["Base AC: 10"],
        initiativeBreakdown: ["No dexterity score"]
      }
    }

    // Use ability scores (which now include bonuses)
    const totalConstitution = abilityScores.constitution || 10
    const totalDexterity = abilityScores.dexterity || 10

    const constitutionModifier = calculateModifier(totalConstitution)
    const dexterityModifier = calculateModifier(totalDexterity)

    // Calculate HP
    const { hp, breakdown: hpBreakdown } = calculateHitPointsWithBreakdown(
      classes,
      constitutionModifier
    )

    // Calculate AC
    const { ac, breakdown: acBreakdown } = calculateArmorClass(
      dexterityModifier,
      armor,
      shield,
      armorDetails
    )

    // Calculate Initiative
    const { initiative, breakdown: initiativeBreakdown } = calculateInitiative(
      dexterityModifier,
      feats || []
    )

    return {
      hp,
      ac,
      initiative,
      hpBreakdown,
      acBreakdown,
      initiativeBreakdown
    }
  }, [abilityScores, classes, race, subrace, armor, shield, feats, featASIChoices, armorDetails])

  // Fetch armor details when armor changes
  useEffect(() => {
    if (!armor || armor === "none") {
      setArmorDetails(null)
      return
    }

    const fetchArmorDetails = async () => {
      setIsLoading(true)
      try {
        const details = await ArmorService.fetchArmorDetail(armor)
        setArmorDetails(details)
      } catch (error) {
        console.error("Failed to fetch armor details:", error)
        setArmorDetails(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArmorDetails()
  }, [armor])

  // Update form with calculated stats when they change
  useEffect(() => {
    setValue("calculatedStats", {
      hp: stats.hp,
      ac: stats.ac,
      initiative: stats.initiative,
      hpBreakdown: stats.hpBreakdown,
      acBreakdown: stats.acBreakdown,
      initiativeBreakdown: stats.initiativeBreakdown
    })
  }, [stats, setValue])

  return {
    stats,
    isLoading,
    armorDetails
  }
} 