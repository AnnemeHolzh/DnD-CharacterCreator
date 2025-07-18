"use client"

import { useState, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, RefreshCw, Search, X, Package, Sparkles } from "lucide-react"
import { useItems } from "@/hooks/use-items"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ItemSelector() {
  const { control, setValue } = useFormContext()
  const selectedItems = useWatch({ control, name: "items" }) || []
  const { mundaneItems, magicItems, itemCategories, loading, error, refreshItems } = useItems()
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("mundane")

  // Filter items based on search term
  const filteredMundaneItems = useMemo(() => {
    if (!searchTerm) return mundaneItems
    return mundaneItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [mundaneItems, searchTerm])

  const filteredMagicItems = useMemo(() => {
    if (!searchTerm) return magicItems
    return magicItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [magicItems, searchTerm])

  // Group filtered items by category
  const filteredItemCategories = useMemo(() => {
    const grouped: Record<string, typeof mundaneItems> = {}
    
    filteredMundaneItems.forEach((item: any) => {
      const category = item.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(item)
    })
    
    return grouped
  }, [filteredMundaneItems])

  // Group filtered magic items by category
  const filteredMagicItemCategories = useMemo(() => {
    const grouped: Record<string, typeof magicItems> = {}
    
    filteredMagicItems.forEach((item: any) => {
      const category = item.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(item)
    })
    
    return grouped
  }, [filteredMagicItems])

  const handleItemToggle = (itemIndex: string, isSelected: boolean) => {
    if (isSelected) {
      setValue("items", [...selectedItems, itemIndex])
    } else {
      setValue("items", selectedItems.filter((i: string) => i !== itemIndex))
    }
  }

  const isItemSelected = (itemIndex: string) => {
    return selectedItems.includes(itemIndex)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshItems()
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="ml-2 text-amber-400">Loading items...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load items. Please try again.
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-2"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-amber-800/30 bg-black/20 backdrop-blur-sm"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
          <h4 className="font-display text-lg mb-3 text-blue-400">Selected Items ({selectedItems.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedItems.map((itemIndex: string) => {
              const item = mundaneItems.find((i: any) => i.index === itemIndex) || 
                          magicItems.find((i: any) => i.index === itemIndex)
              return (
                <div key={itemIndex} className="flex items-center justify-between p-2 bg-blue-900/30 border border-blue-600/50 rounded">
                  <span className="text-blue-300 text-sm">{item?.name || itemIndex}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleItemToggle(itemIndex, false)}
                    className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Item Selection Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mundane" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Mundane Items</span>
          </TabsTrigger>
          <TabsTrigger value="magical" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Magical Items</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mundane" className="space-y-4">
          {Object.entries(filteredItemCategories).map(([category, categoryItems]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categoryItems.map((item) => {
                    const isSelected = isItemSelected(item.index)
                    
                    return (
                      <TooltipProvider key={item.index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto p-3 ${
                                isSelected ? "bg-blue-600 hover:bg-blue-700" : ""
                              }`}
                              onClick={() => handleItemToggle(item.index, !isSelected)}
                            >
                              <div className="flex flex-col items-start space-y-1">
                                <span className="font-medium">{item.name}</span>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs bg-blue-900/40 text-blue-200">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.name}</p>
                            <p className="text-blue-200">Mundane Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="magical" className="space-y-4">
          {Object.entries(filteredMagicItemCategories).map(([category, categoryItems]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categoryItems.map((item) => {
                    const isSelected = isItemSelected(item.index)
                    
                    return (
                      <TooltipProvider key={item.index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto p-3 ${
                                isSelected ? "bg-purple-600 hover:bg-purple-700" : ""
                              }`}
                              onClick={() => handleItemToggle(item.index, !isSelected)}
                            >
                              <div className="flex flex-col items-start space-y-1">
                                <span className="font-medium">{item.name}</span>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs bg-purple-900/40 text-purple-200">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.name}</p>
                            <p className="text-purple-200">Magical Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Equipment Rules Info */}
      <div className="p-4 bg-amber-900/20 border border-amber-800/30 rounded-lg">
        <h4 className="font-display text-lg mb-3 text-amber-400">Item Rules</h4>
        <div className="text-sm text-amber-300 space-y-2">
          <p>• You can select unlimited items for your character</p>
          <p>• Items include both mundane and magical options</p>
          <p>• Selected items will be available for your character to use</p>
          <p>• You can remove items by clicking the X button on selected items</p>
        </div>
      </div>
    </div>
  )
} 