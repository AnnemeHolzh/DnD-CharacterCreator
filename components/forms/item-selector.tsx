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

  const handleItemToggle = (itemIndex: string, isSelected: boolean) => {
    let newSelectedItems = [...selectedItems]
    
    if (isSelected) {
      if (!newSelectedItems.includes(itemIndex)) {
        newSelectedItems.push(itemIndex)
      }
    } else {
      newSelectedItems = newSelectedItems.filter(i => i !== itemIndex)
    }
    
    setValue("items", newSelectedItems)
  }

  const handleRemoveItem = (itemIndex: string) => {
    const newSelectedItems = selectedItems.filter((i: string) => i !== itemIndex)
    setValue("items", newSelectedItems)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshItems()
    } finally {
      setRefreshing(false)
    }
  }

  const getItemDisplayName = (itemIndex: string): string => {
    const item = mundaneItems.find((i: any) => i.index === itemIndex)
    const magicItem = magicItems.find((i: any) => i.index === itemIndex)
    return item?.name || magicItem?.name || itemIndex
  }

  const isItemSelected = (itemIndex: string): boolean => {
    return selectedItems.includes(itemIndex)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading items...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-2"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
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
          className="pl-10"
        />
      </div>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Selected Items ({selectedItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((itemIndex: string) => (
                <Badge
                  key={itemIndex}
                  variant="secondary"
                  className="flex items-center space-x-1 bg-amber-900/40 text-amber-200"
                >
                  <span>{getItemDisplayName(itemIndex)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(itemIndex)}
                    className="h-4 w-4 p-0 hover:bg-amber-800/40"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Item Selection */}
      <Tabs defaultValue="mundane" className="w-full">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Magical Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredMagicItems.map((item) => {
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
        </TabsContent>
      </Tabs>

      {/* Items Info */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You can carry as many items as you want. Items include adventuring gear, tools, mounts, vehicles, trade goods, poisons, kits, packs, and ammunition.
        </AlertDescription>
      </Alert>
    </div>
  )
} 