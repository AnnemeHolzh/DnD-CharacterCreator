import { useState, useEffect } from 'react'
import { ItemsService, Item, ItemDetail, MagicItem, MagicItemDetail } from '@/lib/services/items-service'

export interface UseItemsReturn {
  mundaneItems: Item[]
  magicItems: MagicItem[]
  itemCategories: Record<string, Item[]>
  itemDetails: Record<string, ItemDetail>
  magicItemDetails: Record<string, MagicItemDetail>
  loading: boolean
  error: string | null
  hasLoaded: boolean
  fetchItemDetail: (index: string) => Promise<ItemDetail>
  fetchMagicItemDetail: (index: string) => Promise<MagicItemDetail>
  refreshItems: () => Promise<void>
  prefetchItems: () => Promise<void>
}

export function useItems(): UseItemsReturn {
  const [mundaneItems, setMundaneItems] = useState<Item[]>([])
  const [magicItems, setMagicItems] = useState<MagicItem[]>([])
  const [itemCategories, setItemCategories] = useState<Record<string, Item[]>>({})
  const [itemDetails, setItemDetails] = useState<Record<string, ItemDetail>>({})
  const [magicItemDetails, setMagicItemDetails] = useState<Record<string, MagicItemDetail>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const { mundaneItems, magicalItems } = await ItemsService.fetchAllItems()
      const categories = ItemsService.groupItemsByCategory(mundaneItems)
      
      setMundaneItems(mundaneItems)
      setMagicItems(magicalItems)
      setItemCategories(categories)
      setHasLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
      console.error('Error in useItems:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchItemDetail = async (index: string): Promise<ItemDetail> => {
    // Check if we already have this item's details
    if (itemDetails[index]) {
      return itemDetails[index]
    }

    try {
      const detail = await ItemsService.fetchItemDetail(index)
      setItemDetails(prev => ({
        ...prev,
        [index]: detail
      }))
      return detail
    } catch (err) {
      console.error('Error fetching item detail:', err)
      throw err
    }
  }

  const fetchMagicItemDetail = async (index: string): Promise<MagicItemDetail> => {
    // Check if we already have this magic item's details
    if (magicItemDetails[index]) {
      return magicItemDetails[index]
    }

    try {
      const detail = await ItemsService.fetchMagicItemDetail(index)
      setMagicItemDetails(prev => ({
        ...prev,
        [index]: detail
      }))
      return detail
    } catch (err) {
      console.error('Error fetching magic item detail:', err)
      throw err
    }
  }

  const refreshItems = async () => {
    await fetchItems()
  }

  const prefetchItems = async () => {
    if (!hasLoaded && !loading) {
      await fetchItems()
    }
  }

  // Only fetch on mount if not already loaded
  useEffect(() => {
    if (!hasLoaded) {
      fetchItems()
    }
  }, [])

  return {
    mundaneItems,
    magicItems,
    itemCategories,
    itemDetails,
    magicItemDetails,
    loading,
    error,
    hasLoaded,
    fetchItemDetail,
    fetchMagicItemDetail,
    refreshItems,
    prefetchItems
  }
} 