"use client"

import { Scroll, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileWarning() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      {/* Background texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/dark-leather.png')",
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
        }}
      />
      
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)"
        }}
      />

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Scroll className="h-16 w-16 text-amber-500 mx-auto" />
              <AlertTriangle className="h-8 w-8 text-red-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-amber-200 mb-2 tracking-wider">
            Desktop Realm Only
          </h1>
          <p className="text-amber-300/80 text-lg">
            This mystical forge requires a larger canvas
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-[#2a2a2a]/80 border border-amber-800/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <div className="space-y-4 text-amber-100/90">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-amber-200">The Role Study</h3>
                <p className="text-sm">
                  Our character creation forge is designed for the precision and detail that only a desktop or laptop can provide.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Scroll className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-amber-200">Research Project</h3>
                <p className="text-sm">
                  This is part of an Honours research project studying D&D character creation. The full experience requires a larger screen for optimal interaction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-amber-200">Mobile Limitations</h3>
                <p className="text-sm">
                  The complex forms, detailed character sheets, and research interface are not optimized for mobile devices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-3">
          <Button 
            onClick={() => window.open('mailto:?subject=The Role Study - Desktop Only&body=Check out this D&D character creation research project: ' + window.location.href, '_blank')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
          >
            Share with a Friend
          </Button>
          
          <p className="text-xs text-amber-400/60">
            Please visit on a desktop or laptop for the full experience
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-600/30 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-600/30 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-600/30 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-600/30 rounded-br-lg"></div>
      </div>
    </div>
  )
} 