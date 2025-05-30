import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface FantasyFormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  titleHidden?: boolean
}

export const FantasyFormSection = forwardRef<HTMLDivElement, FantasyFormSectionProps>(
  ({ className, title, titleHidden = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative p-6 border border-[rgba(212,180,102,0.7)] rounded-lg bg-[rgba(24,22,20,0.6)] backdrop-blur-md",
          "before:absolute before:inset-0 before:bg-none before:pointer-events-none",
          "after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-[rgba(212,180,102,0.18)] after:shadow-[0_0_12px_2px_rgba(212,180,102,0.10)] after:pointer-events-none",
          "hover:shadow-[0_0_10px_rgba(212,180,102,0.10)] transition-shadow duration-300",
          className,
        )}
        {...props}
      >
        {/* Ornate gold corners */}
        <img src="/images/bg3-corner-gold.svg" alt="" className="absolute top-0 left-0 w-8 h-8 pointer-events-none select-none" draggable="false" />
        <img src="/images/bg3-corner-gold.svg" alt="" className="absolute top-0 right-0 w-8 h-8 rotate-90 pointer-events-none select-none" draggable="false" />
        <img src="/images/bg3-corner-gold.svg" alt="" className="absolute bottom-0 right-0 w-8 h-8 rotate-180 pointer-events-none select-none" draggable="false" />
        <img src="/images/bg3-corner-gold.svg" alt="" className="absolute bottom-0 left-0 w-8 h-8 -rotate-90 pointer-events-none select-none" draggable="false" />
        {title && !titleHidden && (
          <h3 className="font-display text-xl mb-5 text-[rgba(212,180,102,0.95)] relative tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            <span className="relative z-10">{title}</span>
          </h3>
        )}
        {children}
      </div>
    )
  },
)
FantasyFormSection.displayName = "FantasyFormSection"
