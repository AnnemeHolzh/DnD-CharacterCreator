import { useState, useEffect } from 'react'
import { WeaponsService, Weapon, WeaponDetail, MagicWeapon, MagicWeaponDetail } from '@/lib/services/weapons-service'

export interface UseWeaponsReturn {
  weapons: Weapon[]
  magicWeapons: MagicWeapon[]
  weaponCategories: Record<string, Weapon[]>
  weaponDetails: Record<string, WeaponDetail>
  magicWeaponDetails: Record<string, MagicWeaponDetail>
  loading: boolean
  error: string | null
  hasLoaded: boolean
  fetchWeaponDetail: (index: string) => Promise<WeaponDetail>
  fetchMagicWeaponDetail: (index: string) => Promise<MagicWeaponDetail>
  refreshWeapons: () => Promise<void>
  prefetchWeapons: () => Promise<void>
}

export function useWeapons(): UseWeaponsReturn {
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [magicWeapons, setMagicWeapons] = useState<MagicWeapon[]>([])
  const [weaponCategories, setWeaponCategories] = useState<Record<string, Weapon[]>>({})
  const [weaponDetails, setWeaponDetails] = useState<Record<string, WeaponDetail>>({})
  const [magicWeaponDetails, setMagicWeaponDetails] = useState<Record<string, MagicWeaponDetail>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchWeapons = async () => {
    try {
      setLoading(true)
      setError(null)
      const { mundane, magical } = await WeaponsService.fetchAllWeapons()
      const categories = WeaponsService.groupWeaponsByCategory(mundane)
      
      setWeapons(mundane)
      setMagicWeapons(magical)
      setWeaponCategories(categories)
      setHasLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weapons')
      console.error('Error in useWeapons:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeaponDetail = async (index: string): Promise<WeaponDetail> => {
    // Check if we already have this weapon's details
    if (weaponDetails[index]) {
      return weaponDetails[index]
    }

    try {
      const detail = await WeaponsService.fetchWeaponDetail(index)
      setWeaponDetails(prev => ({
        ...prev,
        [index]: detail
      }))
      return detail
    } catch (err) {
      console.error('Error fetching weapon detail:', err)
      throw err
    }
  }

  const fetchMagicWeaponDetail = async (index: string): Promise<MagicWeaponDetail> => {
    // Check if we already have this magic weapon's details
    if (magicWeaponDetails[index]) {
      return magicWeaponDetails[index]
    }

    try {
      const detail = await WeaponsService.fetchMagicWeaponDetail(index)
      setMagicWeaponDetails(prev => ({
        ...prev,
        [index]: detail
      }))
      return detail
    } catch (err) {
      console.error('Error fetching magic weapon detail:', err)
      throw err
    }
  }

  const refreshWeapons = async () => {
    await fetchWeapons()
  }

  const prefetchWeapons = async () => {
    if (!hasLoaded && !loading) {
      await fetchWeapons()
    }
  }

  // Only fetch on mount if not already loaded
  useEffect(() => {
    if (!hasLoaded) {
      fetchWeapons()
    }
  }, [])

  return {
    weapons,
    magicWeapons,
    weaponCategories,
    weaponDetails,
    magicWeaponDetails,
    loading,
    error,
    hasLoaded,
    fetchWeaponDetail,
    fetchMagicWeaponDetail,
    refreshWeapons,
    prefetchWeapons
  }
} 