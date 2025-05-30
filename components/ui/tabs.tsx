"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const GoldDiamond = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" className="mx-auto mb-1" style={{ display: 'block' }}>
    <polygon points="9,0 18,6 9,12 0,6" fill="rgba(255,220,120,0.95)" filter="drop-shadow(0 0 4px rgba(255,220,120,0.5))" />
  </svg>
)

// --- Animated Underline TabsList ---
type TabsListProps = React.PropsWithChildren<React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  function TabsListFn({ className, children, ...props }, ref) {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [underline, setUnderline] = React.useState({ left: 0, width: 0 })

    // Find the active tab and update underline position/width
    React.useEffect(() => {
      const container = containerRef.current
      if (!container) return
      const active = container.querySelector('[data-state="active"]') as HTMLElement | null
      if (active) {
        const { left, width } = active.getBoundingClientRect()
        const parentLeft = container.getBoundingClientRect().left
        setUnderline({ left: left - parentLeft, width })
      }
    }, [children])

    // Also update on window resize
    React.useEffect(() => {
      const handleResize = () => {
        const container = containerRef.current
        if (!container) return
        const active = container.querySelector('[data-state="active"]') as HTMLElement | null
        if (active) {
          const { left, width } = active.getBoundingClientRect()
          const parentLeft = container.getBoundingClientRect().left
          setUnderline({ left: left - parentLeft, width })
        }
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [children])

    return (
      <TabsPrimitive.List
        ref={node => {
          containerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn(
          "flex items-end border-b border-[rgba(212,180,102,0.25)] bg-transparent px-2 gap-8 relative",
          className
        )}
        {...props}
      >
        {children}
        {/* Animated gold underline */}
        <span
          className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-[rgba(255,220,120,0.95)] shadow-[0_0_8px_2px_rgba(255,220,120,0.4)]"
          style={{
            left: underline.left,
            width: underline.width,
            opacity: underline.width > 0 ? 1 : 0,
            zIndex: 1,
            transition: 'left 400ms cubic-bezier(0.4,0,0.2,1), width 400ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </TabsPrimitive.List>
    )
  }
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const isActive = (props as any)["data-state"] === "active"
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative flex flex-col items-center justify-end px-4 pb-2 pt-3 font-display text-[15px] tracking-widest uppercase transition-all",
        "text-[rgba(212,180,102,0.7)] font-medium hover:text-[rgba(255,220,120,1)]",
        "data-[state=active]:text-[rgba(255,220,120,1)] data-[state=active]:font-bold",
        "focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* Gold diamond above active tab */}
      {isActive && <GoldDiamond />}
      <span className="z-10">{children}</span>
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,180,102,0.5)] focus-visible:ring-offset-2",
      "animate-in fade-in-0 zoom-in-95 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
