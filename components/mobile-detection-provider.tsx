"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useMobileDetection } from '@/hooks/use-mobile-detection'
import MobileWarning from './mobile-warning'

interface MobileDetectionContextType {
  isMobile: boolean
  isLoading: boolean
}

const MobileDetectionContext = createContext<MobileDetectionContextType | undefined>(undefined)

export function useMobileDetectionContext() {
  const context = useContext(MobileDetectionContext)
  if (context === undefined) {
    throw new Error('useMobileDetectionContext must be used within a MobileDetectionProvider')
  }
  return context
}

interface MobileDetectionProviderProps {
  children: ReactNode
}

export function MobileDetectionProvider({ children }: MobileDetectionProviderProps) {
  const { isMobile, isLoading } = useMobileDetection()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Show mobile warning if on mobile
  if (isMobile) {
    return <MobileWarning />
  }

  // Show normal content for desktop
  return (
    <MobileDetectionContext.Provider value={{ isMobile, isLoading }}>
      {children}
    </MobileDetectionContext.Provider>
  )
} 