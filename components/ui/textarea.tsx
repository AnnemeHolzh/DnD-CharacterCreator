import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-24 w-full rounded-sm border border-bg3-gold-dark/70 bg-bg3-panel/60 px-3 py-2 text-sm",
          "shadow-inner-sm backdrop-blur-sm",
          "ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg3-gold-light/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "focus:border-bg3-gold-light/80 hover:border-bg3-gold-light/60 transition-colors",
          "scrollbar-thin scrollbar-track-bg-bg3-panel scrollbar-thumb-bg3-gold-dark/60 hover:scrollbar-thumb-bg3-gold-light/40",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
