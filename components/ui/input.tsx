import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border border-bg3-gold-dark/70 bg-bg3-panel/60 px-3 py-2 text-sm",
          "ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg3-gold-light/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "shadow-inner-sm backdrop-blur-sm transition-colors",
          "focus:border-bg3-gold-light/80 hover:border-bg3-gold-light/60",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
