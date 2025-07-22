"use client"

import CharacterCreationForm from "@/components/forms/character-creation-form"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDataLoading } from "@/hooks/use-data-loading"

export default function CharacterCreatorPage() {
  const router = useRouter()
  const { isInitializing, loadingProgress, loadingMessage } = useDataLoading()

  if (isInitializing) {
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
          
          {/* Loading Screen */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <LoadingSpinner size="lg" text={loadingMessage} />
            
            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div className="bg-black/50 border border-amber-800/30 rounded-full h-3 overflow-hidden animate-[progressGlow_2s_ease-in-out_infinite]">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-bg3-gold-light h-full transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-center text-bg3-gold-light mt-2 font-display tracking-wider">
                {loadingProgress}% Complete
              </p>
            </div>
            
            {/* Loading Tips */}
            <div className="text-center text-bg3-gold-light/80 max-w-md">
              <p className="font-display tracking-wider">
                Preparing the ancient tomes and mystical artifacts for your character's journey...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

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