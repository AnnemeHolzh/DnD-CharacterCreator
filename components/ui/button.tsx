import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,180,102,0.5)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[rgba(24,22,20,0.5)] border border-[rgba(212,180,102,0.7)] text-[rgba(212,180,102,0.95)] hover:text-[rgba(255,220,120,1)] hover:shadow-[0_0_12px_2px_rgba(212,180,102,0.25)] hover:border-[rgba(255,220,120,0.9)]",
        destructive:
          "bg-destructive/80 border border-destructive text-destructive-foreground hover:bg-destructive",
        outline:
          "border border-[rgba(212,180,102,0.7)] bg-transparent text-[rgba(212,180,102,0.95)] hover:bg-[rgba(212,180,102,0.08)] hover:text-[rgba(255,220,120,1)] hover:border-[rgba(255,220,120,0.9)]",
        secondary:
          "bg-[rgba(24,22,20,0.3)] border border-[rgba(212,180,102,0.4)] text-[rgba(212,180,102,0.8)] hover:bg-[rgba(212,180,102,0.08)] hover:text-[rgba(255,220,120,1)] hover:border-[rgba(255,220,120,0.7)]",
        ghost: "hover:bg-[rgba(212,180,102,0.08)] hover:text-[rgba(255,220,120,1)]",
        link: "text-[rgba(212,180,102,0.95)] underline-offset-4 hover:underline hover:text-[rgba(255,220,120,1)]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
