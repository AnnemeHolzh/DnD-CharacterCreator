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

  const handleWeaponToggle = (weaponIndex: string, isSelected: boolean) => {
    let newSelectedWeapons = [...selectedWeapons]
    
    if (isSelected) {
      // Check if we're at the limit of 5 weapons
      if (newSelectedWeapons.length >= 5) {
        return // Don't add more weapons
      }
      if (!newSelectedWeapons.includes(weaponIndex)) {
        newSelectedWeapons.push(weaponIndex)
      }
    } else {
      newSelectedWeapons = newSelectedWeapons.filter(w => w !== weaponIndex)
    }
    
    setValue("weapons", newSelectedWeapons)
  }

  const handleRemoveWeapon = (weaponIndex: string) => {
    const newSelectedWeapons = selectedWeapons.filter((w: string) => w !== weaponIndex)
    setValue("weapons", newSelectedWeapons)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshWeapons()
    } finally {
      setRefreshing(false)
    }
  }

  const getWeaponDisplayName = (weaponIndex: string): string => {
    const weapon = weapons.find((w: any) => w.index === weaponIndex)
    const magicWeapon = magicWeapons.find((w: any) => w.index === weaponIndex)
    return weapon?.name || magicWeapon?.name || weaponIndex
  }

  const isWeaponSelected = (weaponIndex: string): boolean => {
    return selectedWeapons.includes(weaponIndex)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading weapons...</span>
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
          placeholder="Search weapons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Weapons */}
      {selectedWeapons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sword className="h-5 w-5" />
              <span>Selected Weapons ({selectedWeapons.length}/5)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedWeapons.map((weaponIndex: string) => (
                <Badge
                  key={weaponIndex}
                  variant="secondary"
                  className="flex items-center space-x-1 bg-amber-900/40 text-amber-200"
                >
                  <span>{getWeaponDisplayName(weaponIndex)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveWeapon(weaponIndex)}
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

      {/* Weapon Selection */}
      <Tabs defaultValue="mundane" className="w-full">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Magical Weapons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredMagicWeapons.map((weapon) => {
                  const isSelected = isWeaponSelected(weapon.index)
                  const isDisabled = selectedWeapons.length >= 5 && !isSelected
                  
                  return (
                    <TooltipProvider key={weapon.index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
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
        </TabsContent>
      </Tabs>

      {/* Weapon Limit Warning */}
      {selectedWeapons.length >= 5 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have reached the maximum of 5 weapons. Remove a weapon to add another.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 