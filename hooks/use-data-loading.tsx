import { useState, useEffect } from 'react'
import { useWeapons } from './use-weapons'
import { useItems } from './use-items'
import { useArmor } from './use-armor'
import { useTools } from './use-tools'
import { useLanguages } from './use-languages'
import { useSpells } from './use-spells'

export function useDataLoading() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("Initializing...")

  // Get loading states from all hooks
  const { loading: weaponsLoading, hasLoaded: weaponsLoaded } = useWeapons()
  const { loading: itemsLoading, hasLoaded: itemsLoaded } = useItems()
  const { loading: armorLoading, hasLoaded: armorLoaded } = useArmor()
  const { loading: toolsLoading, hasLoaded: toolsLoaded } = useTools()
  const { loading: languagesLoading, hasLoaded: languagesLoaded } = useLanguages()
  const { loading: spellsLoading } = useSpells()

  // Calculate overall loading state
  useEffect(() => {
    const totalDataSources = 5 // weapons, items, armor, tools, languages
    const loadedSources = [
      weaponsLoaded,
      itemsLoaded,
      armorLoaded,
      toolsLoaded,
      languagesLoaded
    ].filter(Boolean).length

    const isLoading = [
      weaponsLoading,
      itemsLoading,
      armorLoading,
      toolsLoading,
      languagesLoading,
      spellsLoading
    ].some(Boolean)

    const progress = Math.round((loadedSources / totalDataSources) * 100)
    
    setLoadingProgress(progress)

    if (isLoading) {
      const messages = [
        "Gathering ancient weapons...",
        "Collecting mystical items...",
        "Forging protective armor...",
        "Assembling artisan tools...",
        "Learning ancient languages...",
        "Studying arcane spells..."
      ]
      
      const messageIndex = Math.min(loadedSources, messages.length - 1)
      setLoadingMessage(messages[messageIndex])
    } else if (loadedSources === totalDataSources) {
      setLoadingMessage("Ready to forge your champion!")
      setIsInitializing(false)
    }
  }, [
    weaponsLoading, weaponsLoaded,
    itemsLoading, itemsLoaded,
    armorLoading, armorLoaded,
    toolsLoading, toolsLoaded,
    languagesLoading, languagesLoaded,
    spellsLoading
  ])

  return {
    isInitializing,
    loadingProgress,
    loadingMessage,
    weaponsLoading,
    itemsLoading,
    armorLoading,
    toolsLoading,
    languagesLoading,
    spellsLoading
  }
} 