"use client"

import { useState, useEffect, useCallback } from 'react'
import { getSpells, getSpellDetails, Spell, SpellListItem, SPELL_LEVELS, SPELL_SCHOOLS } from '@/lib/services/spells-service'

interface UseSpellsReturn {
  spells: SpellListItem[]
  selectedSpells: Spell[]
  loading: boolean
  error: string | null
  selectedLevel: number | undefined
  selectedSchool: string
  setSelectedLevel: (level: number | undefined) => void
  setSelectedSchool: (school: string) => void
  selectSpell: (spellIndex: string) => Promise<void>
  removeSpell: (spellIndex: string) => void
  clearFilters: () => void
}

export function useSpells(): UseSpellsReturn {
  const [spells, setSpells] = useState<SpellListItem[]>([])
  const [selectedSpells, setSelectedSpells] = useState<Spell[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>()
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [spellCache, setSpellCache] = useState<Map<string, Spell>>(new Map())

  // Fetch spells based on current filters
  const fetchSpells = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Convert "all" values to undefined for API calls
      const level = selectedLevel === undefined ? undefined : selectedLevel
      const school = selectedSchool === "all" ? undefined : selectedSchool
      
      const spellsData = await getSpells(level, school)
      console.log('Fetched spells:', spellsData)
      setSpells(spellsData)
    } catch (err) {
      console.error('Error fetching spells:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch spells')
    } finally {
      setLoading(false)
    }
  }, [selectedLevel, selectedSchool])

  // Load spells when filters change
  useEffect(() => {
    fetchSpells()
  }, [fetchSpells])

  // Select a spell and load its details
  const selectSpell = useCallback(async (spellIndex: string) => {
    // Check if already selected
    if (selectedSpells.some(spell => spell.index === spellIndex)) {
      return
    }

    // Check if in cache
    if (spellCache.has(spellIndex)) {
      const cachedSpell = spellCache.get(spellIndex)!
      setSelectedSpells(prev => [...prev, cachedSpell])
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Fetching spell details for:', spellIndex)
      const spellDetails = await getSpellDetails(spellIndex)
      console.log('Spell details:', spellDetails)
      
      // Cache the spell details
      setSpellCache(prev => new Map(prev).set(spellIndex, spellDetails))
      
      // Add to selected spells
      setSelectedSpells(prev => [...prev, spellDetails])
    } catch (err) {
      console.error('Error loading spell details:', err)
      setError(err instanceof Error ? err.message : 'Failed to load spell details')
    } finally {
      setLoading(false)
    }
  }, [selectedSpells, spellCache])

  // Remove a spell from selection
  const removeSpell = useCallback((spellIndex: string) => {
    setSelectedSpells(prev => prev.filter(spell => spell.index !== spellIndex))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedLevel(undefined)
    setSelectedSchool("all")
  }, [])

  return {
    spells,
    selectedSpells,
    loading,
    error,
    selectedLevel,
    selectedSchool,
    setSelectedLevel,
    setSelectedSchool,
    selectSpell,
    removeSpell,
    clearFilters,
  }
} 