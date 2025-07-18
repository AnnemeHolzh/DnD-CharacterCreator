"use client"

import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative animate-[loadingPulse_2s_ease-in-out_infinite]">
        <Loader2 className={cn("animate-spin text-bg3-gold-light", sizeClasses[size])} />
        <Sparkles className="absolute inset-0 animate-pulse text-amber-400 opacity-60" />
      </div>
      {text && (
        <p 
          className="text-bg3-gold-light text-center font-display tracking-wider"
          style={{
            background: "linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
            backgroundSize: "200% 100%",
            animation: "textShimmer 3s ease-in-out infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          {text}
        </p>
      )}
    </div>
  )
} 