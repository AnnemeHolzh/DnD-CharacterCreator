"use client"

import { FantasyCard } from "@/components/ui/fantasy-card"
import { Shield, Heart, Zap } from "lucide-react"
import { useCharacterStats } from "@/hooks/use-character-stats"

export function CharacterStatsDisplay() {
  const { stats, isLoading } = useCharacterStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Hit Points */}
      <FantasyCard className="relative overflow-hidden">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-red-400" />
            <h3 className="font-display text-lg text-[rgba(212,180,102,0.95)] tracking-wide">
              Hit Points
            </h3>
          </div>
          <div className="text-4xl font-bold text-red-300 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {stats.hp}
          </div>
          {isLoading && (
            <div className="text-xs text-[rgba(212,180,102,0.7)]">
              Loading armor details...
            </div>
          )}
        </div>
      </FantasyCard>

      {/* Armor Class */}
      <FantasyCard className="relative overflow-hidden">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-blue-400" />
            <h3 className="font-display text-lg text-[rgba(212,180,102,0.95)] tracking-wide">
              Armor Class
            </h3>
          </div>
          <div className="text-4xl font-bold text-blue-300 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {stats.ac}
          </div>
          {isLoading && (
            <div className="text-xs text-[rgba(212,180,102,0.7)]">
              Loading armor details...
            </div>
          )}
        </div>
      </FantasyCard>

      {/* Initiative */}
      <FantasyCard className="relative overflow-hidden">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-yellow-400" />
            <h3 className="font-display text-lg text-[rgba(212,180,102,0.95)] tracking-wide">
              Initiative
            </h3>
          </div>
          <div className="text-4xl font-bold text-yellow-300 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {stats.initiative >= 0 ? `+${stats.initiative}` : stats.initiative}
          </div>
        </div>
      </FantasyCard>
    </div>
  )
} 