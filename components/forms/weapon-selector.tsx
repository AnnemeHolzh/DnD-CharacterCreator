"use client"

import { useState, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, RefreshCw, Search, X, Sword, Sparkles } from "lucide-react"
import { useWeapons } from "@/hooks/use-weapons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WeaponSelector() {
  const { control, setValue } = useFormContext()
  const selectedWeapons = useWatch({ control, name: "weapons" }) || []
  const { weapons, magicWeapons, weaponCategories, loading, error, refreshWeapons } = useWeapons()
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("mundane")

  // Filter weapons based on search term
  const filteredWeapons = useMemo(() => {
    if (!searchTerm) return weapons
    return weapons.filter(weapon =>
      weapon.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [weapons, searchTerm])

  const filteredMagicWeapons = useMemo(() => {
    if (!searchTerm) return magicWeapons
    return magicWeapons.filter(weapon =>
      weapon.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [magicWeapons, searchTerm])

  // Group filtered weapons by category
  const filteredWeaponCategories = useMemo(() => {
    const grouped: Record<string, typeof weapons> = {}
    
    filteredWeapons.forEach((weapon: any) => {
      const category = weapon.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(weapon)
    })
    
    return grouped
  }, [filteredWeapons])

  // Group filtered magic weapons by category
  const filteredMagicWeaponCategories = useMemo(() => {
    const grouped: Record<string, typeof magicWeapons> = {}
    
    filteredMagicWeapons.forEach((weapon: any) => {
      const category = weapon.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(weapon)
    })
    
    return grouped
  }, [filteredMagicWeapons])

  const handleWeaponToggle = (weaponIndex: string, isSelected: boolean) => {
    if (isSelected) {
      setValue("weapons", [...selectedWeapons, weaponIndex])
    } else {
      setValue("weapons", selectedWeapons.filter((w: string) => w !== weaponIndex))
    }
  }

  const isWeaponSelected = (weaponIndex: string) => {
    return selectedWeapons.includes(weaponIndex)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshWeapons()
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="ml-2 text-amber-400">Loading weapons...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weapons. Please try again.
          <Button
            type="button"
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
          placeholder="Search weapons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-amber-800/30 bg-black/20 backdrop-blur-sm"
        />
        {searchTerm && (
                            <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
        )}
      </div>

      {/* Selected Weapons Display */}
      {selectedWeapons.length > 0 && (
        <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
          <h4 className="font-display text-lg mb-3 text-green-400">Selected Weapons ({selectedWeapons.length}/5)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedWeapons.map((weaponIndex: string) => {
              const weapon = weapons.find((w: any) => w.index === weaponIndex) || 
                           magicWeapons.find((w: any) => w.index === weaponIndex)
              return (
                <div key={weaponIndex} className="flex items-center justify-between p-2 bg-green-900/30 border border-green-600/50 rounded">
                  <span className="text-green-300 text-sm">{weapon?.name || weaponIndex}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleWeaponToggle(weaponIndex, false)}
                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Weapon Selection Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mundane" className="flex items-center space-x-2">
            <Sword className="h-4 w-4" />
            <span>Mundane Weapons</span>
          </TabsTrigger>
          <TabsTrigger value="magical" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Magical Weapons</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mundane" className="space-y-4">
          {Object.entries(filteredWeaponCategories).map(([category, categoryWeapons]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categoryWeapons.map((weapon) => {
                    const isSelected = isWeaponSelected(weapon.index)
                    const isDisabled = selectedWeapons.length >= 5 && !isSelected
                    
                    return (
                      <TooltipProvider key={weapon.index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto p-3 ${
                                isSelected ? "bg-green-600 hover:bg-green-700" : ""
                              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                              onClick={() => handleWeaponToggle(weapon.index, !isSelected)}
                              disabled={isDisabled}
                            >
                              <div className="flex flex-col items-start space-y-1">
                                <span className="font-medium">{weapon.name}</span>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs bg-green-900/40 text-green-200">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{weapon.name}</p>
                            {isDisabled && (
                              <p className="text-red-200">Maximum 5 weapons allowed</p>
                            )}
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
          {Object.entries(filteredMagicWeaponCategories).map(([category, categoryWeapons]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categoryWeapons.map((weapon) => {
                    const isSelected = isWeaponSelected(weapon.index)
                    const isDisabled = selectedWeapons.length >= 5 && !isSelected
                    
                    return (
                      <TooltipProvider key={weapon.index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto p-3 ${
                                isSelected ? "bg-purple-600 hover:bg-purple-700" : ""
                              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                              onClick={() => handleWeaponToggle(weapon.index, !isSelected)}
                              disabled={isDisabled}
                            >
                              <div className="flex flex-col items-start space-y-1">
                                <span className="font-medium">{weapon.name}</span>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs bg-purple-900/40 text-purple-200">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{weapon.name}</p>
                            <p className="text-purple-200">Magical Weapon</p>
                            {isDisabled && (
                              <p className="text-red-200">Maximum 5 weapons allowed</p>
                            )}
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
        <h4 className="font-display text-lg mb-3 text-amber-400">Weapon Rules</h4>
        <div className="text-sm text-amber-300 space-y-2">
          <p>• You can select up to 5 weapons for your character</p>
          <p>• Weapons include both mundane and magical options</p>
          <p>• Selected weapons will be available for your character to use</p>
          <p>• You can remove weapons by clicking the X button on selected items</p>
        </div>
      </div>
    </div>
  )
} 