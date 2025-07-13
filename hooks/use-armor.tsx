import { useState, useEffect } from 'react'
import { ArmorService, Armor, ArmorDetail, MagicArmor, MagicArmorDetail } from '@/lib/services/armor-service'

export interface UseArmorReturn {
  mundaneArmor: Armor[]
  mundaneShields: Armor[]
  magicArmor: MagicArmor[]
  magicShields: MagicArmor[]
  armorCategories: Record<string, Armor[]>
  shieldCategories: Record<string, Armor[]>
  armorDetails: Record<string, ArmorDetail>
  magicArmorDetails: Record<string, MagicArmorDetail>
  loading: boolean
  error: string | null
  fetchArmorDetail: (index: string) => Promise<ArmorDetail>
  fetchMagicArmorDetail: (index: string) => Promise<MagicArmorDetail>
  refreshArmor: () => Promise<void>
  prefetchArmor: () => Promise<void>
}

export function useArmor(): UseArmorReturn {
  const [mundaneArmor, setMundaneArmor] = useState<Armor[]>([])
  const [mundaneShields, setMundaneShields] = useState<Armor[]>([])
  const [magicArmor, setMagicArmor] = useState<MagicArmor[]>([])
  const [magicShields, setMagicShields] = useState<MagicArmor[]>([])
  const [armorCategories, setArmorCategories] = useState<Record<string, Armor[]>>({})
  const [shieldCategories, setShieldCategories] = useState<Record<string, Armor[]>>({})
  const [armorDetails, setArmorDetails] = useState<Record<string, ArmorDetail>>({})
  const [magicArmorDetails, setMagicArmorDetails] = useState<Record<string, MagicArmorDetail>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchArmor = async () => {
    try {
      setLoading(true)
      setError(null)
      const { mundaneArmor, mundaneShields, magicalArmor, magicalShields } = await ArmorService.fetchAllArmor()
      const armorCategories = ArmorService.groupArmorByCategory(mundaneArmor)
      const shieldCategories = ArmorService.groupArmorByCategory(mundaneShields)
      
      setMundaneArmor(mundaneArmor)
      setMundaneShields(mundaneShields)
      setMagicArmor(magicalArmor)
      setMagicShields(magicalShields)
      setArmorCategories(armorCategories)
      setShieldCategories(shieldCategories)
      setHasLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch armor')
      console.error('Error in useArmor:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchArmorDetail = async (index: string): Promise<ArmorDetail> => {
    // Check if we already have this armor's details
    if (armorDetails[index]) {
      return armorDetails[index]
    }

    try {
      const detail = await ArmorService.fetchArmorDetail(index)
      setArmorDetails(prev => ({
        ...prev,
        [index]: detail
      }))
      return detail
    } catch (err) {
      console.error('Error fetching armor detail:', err)
      throw err
    }
  }

  const fetchMagicArmorDetail = async (index: string): Promise<MagicArmorDetail> => {
    // Check if we already have this magic armor's details
    if (magicArmorDetails[index]) {
      return magicArmorDetails[index]
    }

    try {
      const detail = await ArmorService.fetchMagicArmorDetail(index)
      setMagicArmorDetails(prev => ({
        ...prev,
        [index]: detail
      }))
      return detail
    } catch (err) {
      console.error('Error fetching magic armor detail:', err)
      throw err
    }
  }

  const refreshArmor = async () => {
    await fetchArmor()
  }

  const prefetchArmor = async () => {
    if (!hasLoaded && !loading) {
      await fetchArmor()
    }
  }

  // Only fetch on mount if not already loaded
  useEffect(() => {
    if (!hasLoaded) {
      fetchArmor()
    }
  }, [])

  return {
    mundaneArmor,
    mundaneShields,
    magicArmor,
    magicShields,
    armorCategories,
    shieldCategories,
    armorDetails,
    magicArmorDetails,
    loading,
    error,
    fetchArmorDetail,
    fetchMagicArmorDetail,
    refreshArmor,
    prefetchArmor
  }
} 