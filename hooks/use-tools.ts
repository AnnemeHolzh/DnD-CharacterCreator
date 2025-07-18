import { useState, useEffect } from 'react'
import { ToolsService, Tool, ToolDetail } from '@/lib/services/tools-service'

export interface UseToolsReturn {
  tools: Tool[]
  toolCategories: Record<string, Tool[]>
  toolDetails: Record<string, ToolDetail>
  loading: boolean
  error: string | null
  hasLoaded: boolean
  fetchToolDetail: (index: string) => Promise<ToolDetail>
  refreshTools: () => Promise<void>
  prefetchTools: () => Promise<void>
}

export function useTools(): UseToolsReturn {
  const [tools, setTools] = useState<Tool[]>([])
  const [toolCategories, setToolCategories] = useState<Record<string, Tool[]>>({})
  const [toolDetails, setToolDetails] = useState<Record<string, ToolDetail>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchTools = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedTools = await ToolsService.fetchTools()
      const categories = ToolsService.groupToolsByCategory(fetchedTools)
      
      setTools(fetchedTools)
      setToolCategories(categories)
      setHasLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tools')
      console.error('Error in useTools:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchToolDetail = async (index: string): Promise<ToolDetail> => {
    // Check if we already have this tool's details
    if (toolDetails[index]) {
      return toolDetails[index]
    }

    try {
      const detail = await ToolsService.fetchToolDetail(index)
      setToolDetails(prev => ({
        ...prev,
        [index]: detail
      }))
      return detail
    } catch (err) {
      console.error('Error fetching tool detail:', err)
      throw err
    }
  }

  const refreshTools = async () => {
    await fetchTools()
  }

  const prefetchTools = async () => {
    if (!hasLoaded && !loading) {
      await fetchTools()
    }
  }

  // Only fetch on mount if not already loaded
  useEffect(() => {
    if (!hasLoaded) {
      fetchTools()
    }
  }, [])

  return {
    tools,
    toolCategories,
    toolDetails,
    loading,
    error,
    hasLoaded,
    fetchToolDetail,
    refreshTools,
    prefetchTools
  }
} 