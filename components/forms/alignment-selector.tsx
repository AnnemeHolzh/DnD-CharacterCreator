"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type AlignmentType =
  | "lawful-good"
  | "neutral-good"
  | "chaotic-good"
  | "lawful-neutral"
  | "true-neutral"
  | "chaotic-neutral"
  | "lawful-evil"
  | "neutral-evil"
  | "chaotic-evil"

interface AlignmentSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function AlignmentSelector({ value, onChange }: AlignmentSelectorProps) {
  const alignments: { id: AlignmentType; name: string; description: string }[] = [
    {
      id: "lawful-good",
      name: "Lawful Good",
      description: "Honor and compassion, following rules and traditions",
    },
    {
      id: "neutral-good",
      name: "Neutral Good",
      description: "Doing good without bias toward order or chaos",
    },
    {
      id: "chaotic-good",
      name: "Chaotic Good",
      description: "Freedom and kindness, following their own moral compass",
    },
    {
      id: "lawful-neutral",
      name: "Lawful Neutral",
      description: "Order and organization above all else",
    },
    {
      id: "true-neutral",
      name: "True Neutral",
      description: "Balance between all alignments, or indifference",
    },
    {
      id: "chaotic-neutral",
      name: "Chaotic Neutral",
      description: "Following whims, valuing freedom above all",
    },
    {
      id: "lawful-evil",
      name: "Lawful Evil",
      description: "Order for personal gain, methodical and organized",
    },
    {
      id: "neutral-evil",
      name: "Neutral Evil",
      description: "Self-interest without compunction or ideology",
    },
    {
      id: "chaotic-evil",
      name: "Chaotic Evil",
      description: "Destruction and discord, freedom to hurt others",
    },
  ]

  const [hoveredAlignment, setHoveredAlignment] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {alignments.map((alignment) => (
          <button
            key={alignment.id}
            type="button"
            onClick={() => onChange(alignment.id)}
            onMouseEnter={() => setHoveredAlignment(alignment.id)}
            onMouseLeave={() => setHoveredAlignment(null)}
            className={cn(
              "relative h-16 rounded-md border border-amber-800/30 bg-black/20 backdrop-blur-sm transition-all overflow-hidden",
              value === alignment.id
                ? "border-[rgba(232,193,112,0.7)] bg-gradient-to-br from-[rgba(232,193,112,0.22)] via-[rgba(232,193,112,0.13)] to-[rgba(191,155,74,0.18)] shadow-[0_0_16px_4px_rgba(232,193,112,0.18)]"
                : "hover:border-[rgba(232,193,112,0.4)] hover:bg-[rgba(232,193,112,0.06)]",
            )}
          >
            <span className="font-display text-sm">{alignment.name}</span>

            {/* Magical glow effect when selected */}
            {value === alignment.id && (
              <span className="absolute inset-0 rounded-md pointer-events-none bg-gradient-to-br from-[rgba(232,193,112,0.13)] via-[rgba(232,193,112,0.10)] to-transparent shadow-[0_0_24px_6px_rgba(232,193,112,0.18)] animate-glow-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {/* Description of hovered or selected alignment */}
      <div className="h-12 p-2 text-sm text-muted-foreground">
        {hoveredAlignment && alignments.find((a) => a.id === hoveredAlignment)?.description}
        {!hoveredAlignment && value && alignments.find((a) => a.id === value)?.description}
      </div>
    </div>
  )
}
