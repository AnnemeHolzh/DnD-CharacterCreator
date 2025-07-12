import { useState, useEffect } from 'react'
import { ToolsService, Tool, ToolDetail } from '@/lib/services/tools-service'

export interface UseToolsReturn {
  tools: Tool[]
  toolCategories: Record<string, Tool[]>
  toolDetails: Record<string, ToolDetail>
  loading: boolean
  error: string | null
  fetchToolDetail: (index: string) => Promise<ToolDetail>
  refreshTools: () => Promise<void>
}

export function useTools(): UseToolsReturn {
  const [tools, setTools] = useState<Tool[]>([])
  const [toolCategories, setToolCategories] = useState<Record<string, Tool[]>>({})
  const [toolDetails, setToolDetails] = useState<Record<string, ToolDetail>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTools = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedTools = await ToolsService.fetchTools()
      const categories = ToolsService.groupToolsByCategory(fetchedTools)
      
      setTools(fetchedTools)
      setToolCategories(categories)
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

  useEffect(() => {
    fetchTools()
  }, [])

  return {
    tools,
    toolCategories,
    toolDetails,
    loading,
    error,
    fetchToolDetail,
    refreshTools
  }
} 