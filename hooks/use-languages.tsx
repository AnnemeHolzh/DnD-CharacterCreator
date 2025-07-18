import { useState, useEffect } from 'react'
import { LanguagesService, Language } from '@/lib/services/languages-service'

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchLanguages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await LanguagesService.fetchLanguages()
      setLanguages(data)
      setHasLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages')
    } finally {
      setLoading(false)
    }
  }

  const prefetchLanguages = async () => {
    if (!hasLoaded && !loading) {
      await fetchLanguages()
    }
  }

  // Only fetch on mount if not already loaded
  useEffect(() => {
    if (!hasLoaded) {
      fetchLanguages()
    }
  }, [])

  return { 
    languages, 
    loading, 
    error, 
    hasLoaded,
    refresh: fetchLanguages,
    prefetchLanguages
  }
} 