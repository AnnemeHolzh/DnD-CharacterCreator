"use client"

import { useState, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, RefreshCw, Search, X, Shield, Sparkles, HardHat } from "lucide-react"
import { useArmor } from "@/hooks/use-armor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ArmorSelector() {
  const { control, setValue } = useFormContext()
  const selectedArmor = useWatch({ control, name: "armor" }) || ""
  const selectedShield = useWatch({ control, name: "shield" }) || ""
  const { mundaneArmor, mundaneShields, magicArmor, magicShields, armorCategories, shieldCategories, loading, error, refreshArmor } = useArmor()
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Filter armor based on search term
  const filteredMundaneArmor = useMemo(() => {
    if (!searchTerm) return mundaneArmor
    return mundaneArmor.filter(armor =>
      armor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [mundaneArmor, searchTerm])

  const filteredMundaneShields = useMemo(() => {
    if (!searchTerm) return mundaneShields
    return mundaneShields.filter(shield =>
      shield.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [mundaneShields, searchTerm])

  const filteredMagicArmor = useMemo(() => {
    if (!searchTerm) return magicArmor
    return magicArmor.filter(armor =>
      armor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [magicArmor, searchTerm])

  const filteredMagicShields = useMemo(() => {
    if (!searchTerm) return magicShields
    return magicShields.filter(shield =>
      shield.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [magicShields, searchTerm])

  // Group filtered armor by category
  const filteredArmorCategories = useMemo(() => {
    const grouped: Record<string, typeof mundaneArmor> = {}
    
    filteredMundaneArmor.forEach((armor: any) => {
      const category = armor.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(armor)
    })
    
    return grouped
  }, [filteredMundaneArmor])

  const filteredShieldCategories = useMemo(() => {
    const grouped: Record<string, typeof mundaneShields> = {}
    
    filteredMundaneShields.forEach((shield: any) => {
      const category = shield.equipment_category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(shield)
    })
    
    return grouped
  }, [filteredMundaneShields])

  const handleArmorSelect = (armorIndex: string) => {
    setValue("armor", armorIndex)
  }

  const handleShieldSelect = (shieldIndex: string) => {
    setValue("shield", shieldIndex)
  }

  const handleRemoveArmor = () => {
    setValue("armor", "")
  }

  const handleRemoveShield = () => {
    setValue("shield", "")
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshArmor()
    } finally {
      setRefreshing(false)
    }
  }

  const getArmorDisplayName = (armorIndex: string): string => {
    const armor = mundaneArmor.find((a: any) => a.index === armorIndex)
    const magicArmorItem = magicArmor.find((a: any) => a.index === armorIndex)
    return armor?.name || magicArmorItem?.name || armorIndex
  }

  const getShieldDisplayName = (shieldIndex: string): string => {
    const shield = mundaneShields.find((s: any) => s.index === shieldIndex)
    const magicShield = magicShields.find((s: any) => s.index === shieldIndex)
    return shield?.name || magicShield?.name || shieldIndex
  }

  const isArmorSelected = (armorIndex: string): boolean => {
    return selectedArmor === armorIndex
  }

  const isShieldSelected = (shieldIndex: string): boolean => {
    return selectedShield === shieldIndex
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading armor...</span>
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
          placeholder="Search armor and shields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Armor Slot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardHat className="h-5 w-5" />
              <span>Armor Slot</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedArmor ? (
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-blue-900/40 text-blue-200">
                  {getArmorDisplayName(selectedArmor)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveArmor}
                  className="h-6 w-6 p-0 hover:bg-blue-800/40"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No armor equipped</p>
            )}
          </CardContent>
        </Card>

        {/* Shield Slot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Shield Slot</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedShield ? (
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-green-900/40 text-green-200">
                  {getShieldDisplayName(selectedShield)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveShield}
                  className="h-6 w-6 p-0 hover:bg-green-800/40"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No shield equipped</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Equipment Selection */}
      <Tabs defaultValue="mundane" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mundane" className="flex items-center space-x-2">
            <HardHat className="h-4 w-4" />
            <span>Mundane</span>
          </TabsTrigger>
          <TabsTrigger value="magical" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Magical</span>
          </TabsTrigger>
          <TabsTrigger value="shields" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Shields</span>
          </TabsTrigger>
          <TabsTrigger value="magical-shields" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <Shield className="h-4 w-4" />
            <span>Magical Shields</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mundane" className="space-y-4">
          {Object.entries(filteredArmorCategories).map(([category, categoryArmor]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categoryArmor.map((armor) => {
                    const isSelected = isArmorSelected(armor.index)
                    
                    return (
                      <TooltipProvider key={armor.index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto p-3 ${
                                isSelected ? "bg-blue-600 hover:bg-blue-700" : ""
                              }`}
                              onClick={() => handleArmorSelect(armor.index)}
                            >
                              <div className="flex flex-col items-start space-y-1">
                                <span className="font-medium">{armor.name}</span>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs bg-blue-900/40 text-blue-200">
                                    Equipped
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{armor.name}</p>
                            <p className="text-blue-200">Mundane Armor</p>
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
              <CardTitle className="text-lg">Magical Armor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredMagicArmor.map((armor) => {
                  const isSelected = isArmorSelected(armor.index)
                  
                  return (
                    <TooltipProvider key={armor.index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            className={`w-full justify-start text-left h-auto p-3 ${
                              isSelected ? "bg-purple-600 hover:bg-purple-700" : ""
                            }`}
                            onClick={() => handleArmorSelect(armor.index)}
                          >
                            <div className="flex flex-col items-start space-y-1">
                              <span className="font-medium">{armor.name}</span>
                              {isSelected && (
                                <Badge variant="secondary" className="text-xs bg-purple-900/40 text-purple-200">
                                  Equipped
                                </Badge>
                              )}
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{armor.name}</p>
                          <p className="text-purple-200">Magical Armor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="magical-shields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Magical Shields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredMagicShields.map((shield) => {
                  const isSelected = isShieldSelected(shield.index)
                  
                  return (
                    <TooltipProvider key={shield.index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            className={`w-full justify-start text-left h-auto p-3 ${
                              isSelected ? "bg-purple-600 hover:bg-purple-700" : ""
                            }`}
                            onClick={() => handleShieldSelect(shield.index)}
                          >
                            <div className="flex flex-col items-start space-y-1">
                              <span className="font-medium">{shield.name}</span>
                              {isSelected && (
                                <Badge variant="secondary" className="text-xs bg-purple-900/40 text-purple-200">
                                  Equipped
                                </Badge>
                              )}
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{shield.name}</p>
                          <p className="text-purple-200">Magical Shield</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shields" className="space-y-4">
          {Object.entries(filteredShieldCategories).map(([category, categoryShields]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categoryShields.map((shield) => {
                    const isSelected = isShieldSelected(shield.index)
                    
                    return (
                      <TooltipProvider key={shield.index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto p-3 ${
                                isSelected ? "bg-green-600 hover:bg-green-700" : ""
                              }`}
                              onClick={() => handleShieldSelect(shield.index)}
                            >
                              <div className="flex flex-col items-start space-y-1">
                                <span className="font-medium">{shield.name}</span>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs bg-green-900/40 text-green-200">
                                    Equipped
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{shield.name}</p>
                            <p className="text-green-200">Shield</p>
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
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You can equip one suit of armor and one shield at a time. Armor and shields occupy separate slots and cannot be stacked.
        </AlertDescription>
      </Alert>
    </div>
  )
} 