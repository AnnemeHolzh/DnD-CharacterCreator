"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Scroll } from "lucide-react"
import { usePathname } from "next/navigation"
import { usePrivacy } from "@/contexts/privacy-context"

export default function Navigation() {
  const pathname = usePathname()
  const { setShowPrivacyPopup } = usePrivacy()

  const handleCharacterCreatorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPrivacyPopup(true)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/60 border-b border-amber-900/40 shadow-md h-14 flex items-center">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="flex justify-between items-center w-full h-full">
          <Link href="/" className="font-display text-2xl font-bold text-amber-200 tracking-wider" style={{ letterSpacing: '0.05em' }}>
            D&D Creator
          </Link>
          <div className="flex gap-2 items-center">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className={`bg-transparent text-amber-200 hover:text-yellow-400 hover:bg-amber-900/30 transition-colors duration-150 px-3 py-1.5 rounded-md ${pathname === "/" ? "font-bold underline underline-offset-4" : ""}`}
                style={{ boxShadow: "none" }}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/character-creator" onClick={handleCharacterCreatorClick}>
              <Button
                variant={pathname === "/character-creator" ? "default" : "ghost"}
                size="sm"
                className={`bg-transparent text-amber-200 hover:text-yellow-400 hover:bg-amber-900/30 transition-colors duration-150 px-3 py-1.5 rounded-md ${pathname === "/character-creator" ? "font-bold underline underline-offset-4" : ""}`}
                style={{ boxShadow: "none" }}
              >
                <Scroll className="mr-2 h-4 w-4" />
                Character Creator
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  )
}