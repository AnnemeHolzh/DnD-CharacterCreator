"use client"

import CharacterCreationForm from "@/components/forms/character-creation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CharacterCreatorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg3-bg bg-[url('/images/bg3-background.jpg')] bg-cover bg-fixed bg-center">
      {/* Arcane mist overlay */}
      <div 
        className="fixed inset-0 bg-purple-900/10 mix-blend-soft-light pointer-events-none z-10"
        style={{
          backgroundImage: "url('/images/bg3-mist.png')",
          backgroundSize: "cover",
          animation: "bg3-mist 20s infinite alternate ease-in-out",
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,0,20,0.6) 100%)"
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-30">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-display text-center flex-1 text-bg3-gold-light tracking-wider drop-shadow-lg">Forge Your Champion</h1>
        </div>
        <CharacterCreationForm />
      </div>
    </div>
  )
} 