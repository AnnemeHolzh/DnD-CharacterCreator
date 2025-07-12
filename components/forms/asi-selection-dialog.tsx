"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Plus } from "lucide-react"

interface ASISelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  featName: string
  asiOptions: string[]
  onConfirm: (selectedAbility: string) => void
  title?: string
  description?: string
}

export function ASISelectionDialog({
  isOpen,
  onClose,
  featName,
  asiOptions,
  onConfirm,
  title = "Choose Ability Score Increase",
  description = "Select which ability score to increase by 1"
}: ASISelectionDialogProps) {
  const [selectedAbility, setSelectedAbility] = useState<string>("")

  const handleConfirm = () => {
    if (selectedAbility) {
      onConfirm(selectedAbility)
      onClose()
      setSelectedAbility("")
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedAbility("")
  }

  const abilityNames: Record<string, string> = {
    strength: "Strength",
    dexterity: "Dexterity", 
    constitution: "Constitution",
    intelligence: "Intelligence",
    wisdom: "Wisdom",
    charisma: "Charisma"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-amber-800/30 bg-black/20 backdrop-blur-sm max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-amber-400">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-amber-800/30 bg-amber-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display text-amber-300">
                Feat: {featName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Plus className="h-4 w-4 text-green-400" />
                <span>Choose one ability score to increase by 1</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-amber-400">Available Options:</div>
            <div className="grid grid-cols-2 gap-2">
              {asiOptions.map((ability) => (
                <Button
                  key={ability}
                  variant={selectedAbility === ability ? "default" : "outline"}
                  className={`h-auto p-3 flex flex-col items-center gap-1 ${
                    selectedAbility === ability 
                      ? 'bg-green-900/40 border-green-600/50 text-green-300' 
                      : 'border-amber-800/30 bg-black/20 hover:bg-amber-900/20'
                  }`}
                  onClick={() => setSelectedAbility(ability)}
                >
                  <span className="font-display text-sm">{abilityNames[ability]}</span>
                  <Badge variant="secondary" className="text-xs bg-green-900/50 text-green-300">
                    +1
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

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
              disabled={!selectedAbility}
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