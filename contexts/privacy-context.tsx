"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface PrivacyContextType {
  showPrivacyPopup: boolean
  setShowPrivacyPopup: (show: boolean) => void
  handleAgree: () => void
  handleDecline: () => void
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined)

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)
  const router = useRouter()

  const handleAgree = () => {
    setShowPrivacyPopup(false)
    router.push("/character-creator")
  }

  const handleDecline = () => {
    setShowPrivacyPopup(false)
  }

  return (
    <PrivacyContext.Provider value={{ showPrivacyPopup, setShowPrivacyPopup, handleAgree, handleDecline }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export function usePrivacy() {
  const context = useContext(PrivacyContext)
  if (context === undefined) {
    throw new Error("usePrivacy must be used within a PrivacyProvider")
  }
  return context
} 