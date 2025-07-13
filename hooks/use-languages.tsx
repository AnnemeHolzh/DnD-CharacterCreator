import { useState, useEffect } from 'react'
import { LanguagesService, Language } from '@/lib/services/languages-service'

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLanguages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await LanguagesService.fetchLanguages()
      setLanguages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

  return { languages, loading, error, refresh: fetchLanguages }
} 