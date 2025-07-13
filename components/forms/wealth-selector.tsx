"use client"

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"

interface WealthData {
  platinum: number
  gold: number
  silver: number
  bronze: number
}

export function WealthSelector() {
  const { control, watch, setValue } = useFormContext()
  const wealth = watch("wealth") || { platinum: 0, gold: 0, silver: 0, bronze: 0 }

  const updateCoinCount = (coinType: keyof WealthData, change: number) => {
    const currentValue = wealth[coinType] || 0
    const newValue = Math.max(0, currentValue + change)
    
    setValue("wealth", {
      ...wealth,
      [coinType]: newValue
    })
  }

  const coinTypes = [
    { key: "platinum", label: "Platinum", color: "text-purple-400" },
    { key: "gold", label: "Gold", color: "text-yellow-400" },
    { key: "silver", label: "Silver", color: "text-gray-300" },
    { key: "bronze", label: "Copper", color: "text-orange-600" }
  ] as const

  return (
    <FormField
      control={control}
      name="wealth"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-display text-lg">Wealth & Currency</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coinTypes.map(({ key, label, color }) => (
                  <Card key={key} className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className={`font-display text-lg ${color} mb-2`}>
                          {label}
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateCoinCount(key, -1)}
                            className="h-8 w-8 p-0 border-amber-800/30 hover:bg-amber-800/20"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="min-w-[3rem] text-center font-mono text-lg">
                            {wealth[key] || 0}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateCoinCount(key, 1)}
                            className="h-8 w-8 p-0 border-amber-800/30 hover:bg-amber-800/20"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 p-4 border border-amber-800/30 rounded-lg bg-black/10">
                <div className="text-sm text-amber-200/70 mb-2">Quick Entry</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {coinTypes.map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={wealth[key] || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0
                          setValue("wealth", {
                            ...wealth,
                            [key]: Math.max(0, value)
                          })
                        }}
                        className="h-8 text-sm border-amber-800/30 bg-black/20"
                      />
                      <span className="text-xs text-amber-200/70">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 