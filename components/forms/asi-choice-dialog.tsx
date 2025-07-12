"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Plus, Target } from "lucide-react"

interface ASIChoiceDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (choice: "single" | "double", abilities: string[]) => void
  title?: string
  description?: string
}

export function ASIChoiceDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Choose Ability Score Improvement",
  description = "You can increase one ability score by 2, or increase two ability scores by 1 each."
}: ASIChoiceDialogProps) {
  const [choice, setChoice] = useState<"single" | "double" | null>(null)
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>([])

  const abilityNames: Record<string, string> = {
    strength: "Strength",
    dexterity: "Dexterity", 
    constitution: "Constitution",
    intelligence: "Intelligence",
    wisdom: "Wisdom",
    charisma: "Charisma"
  }

  const abilities = Object.keys(abilityNames)

  const handleConfirm = () => {
    if (choice && selectedAbilities.length > 0) {
      onConfirm(choice, selectedAbilities)
      onClose()
      setChoice(null)
      setSelectedAbilities([])
    }
  }

  const handleClose = () => {
    onClose()
    setChoice(null)
    setSelectedAbilities([])
  }

  const handleAbilityToggle = (ability: string) => {
    if (choice === "single") {
      setSelectedAbilities([ability])
    } else if (choice === "double") {
      if (selectedAbilities.includes(ability)) {
        setSelectedAbilities(selectedAbilities.filter(a => a !== ability))
      } else if (selectedAbilities.length < 2) {
        setSelectedAbilities([...selectedAbilities, ability])
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-amber-800/30 bg-black/20 backdrop-blur-sm max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-amber-400">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Choice Selection */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-amber-400">Choose your ASI type:</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  choice === "single" 
                    ? 'bg-green-900/30 border-green-600/50' 
                    : 'border-amber-800/30 bg-black/20 hover:bg-amber-900/20'
                }`}
                onClick={() => setChoice("single")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-display text-green-400 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Single Ability +2
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-green-300">
                    Increase one ability score by 2 points.
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  choice === "double" 
                    ? 'bg-blue-900/30 border-blue-600/50' 
                    : 'border-amber-800/30 bg-black/20 hover:bg-amber-900/20'
                }`}
                onClick={() => setChoice("double")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-display text-blue-400 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Two Abilities +1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-blue-300">
                    Increase two ability scores by 1 point each.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ability Selection */}
          {choice && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-amber-400">
                {choice === "single" ? "Select one ability to increase by 2:" : "Select two abilities to increase by 1 each:"}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {abilities.map((ability) => (
                  <Button
                    key={ability}
                    variant={selectedAbilities.includes(ability) ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col items-center gap-1 ${
                      selectedAbilities.includes(ability) 
                        ? choice === "single" 
                          ? 'bg-green-900/40 border-green-600/50 text-green-300' 
                          : 'bg-blue-900/40 border-blue-600/50 text-blue-300'
                        : 'border-amber-800/30 bg-black/20 hover:bg-amber-900/20'
                    }`}
                    onClick={() => handleAbilityToggle(ability)}
                    disabled={choice === "double" && selectedAbilities.length >= 2 && !selectedAbilities.includes(ability)}
                  >
                    <span className="font-display text-sm">{abilityNames[ability]}</span>
                    <Badge variant="secondary" className="text-xs bg-green-900/50 text-green-300">
                      {choice === "single" ? "+2" : "+1"}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-amber-800/30 bg-black/20 hover:bg-amber-900/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!choice || selectedAbilities.length === 0 || (choice === "double" && selectedAbilities.length !== 2)}
              className="bg-green-900/40 border-green-600/50 hover:bg-green-900/60 text-green-300"
            >
              Confirm Selection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 