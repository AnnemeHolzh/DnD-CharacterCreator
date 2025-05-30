import { forwardRef } from "react"
import { Card, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface FantasyCardProps extends CardProps {}

export const FantasyCard = forwardRef<HTMLDivElement, FantasyCardProps>(({ className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "relative border border-[rgba(212,180,102,0.7)] bg-[rgba(24,22,20,0.7)] backdrop-blur-md shadow-[0_4px_32px_rgba(0,0,0,0.7)]",
        "before:absolute before:inset-0 before:bg-none before:pointer-events-none",
        "after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-[rgba(212,180,102,0.25)] after:shadow-[0_0_16px_2px_rgba(212,180,102,0.15)] after:pointer-events-none",
        "rounded-lg overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Ornate gold corners */}
      <img src="/images/bg3-corner-gold.svg" alt="" className="absolute top-0 left-0 w-10 h-10 pointer-events-none select-none" draggable="false" />
      <img src="/images/bg3-corner-gold.svg" alt="" className="absolute top-0 right-0 w-10 h-10 rotate-90 pointer-events-none select-none" draggable="false" />
      <img src="/images/bg3-corner-gold.svg" alt="" className="absolute bottom-0 right-0 w-10 h-10 rotate-180 pointer-events-none select-none" draggable="false" />
      <img src="/images/bg3-corner-gold.svg" alt="" className="absolute bottom-0 left-0 w-10 h-10 -rotate-90 pointer-events-none select-none" draggable="false" />
      {/* Content wrapper */}
      <div className="relative z-10">
        {props.children}
      </div>
    </Card>
  )
})
FantasyCard.displayName = "FantasyCard"
