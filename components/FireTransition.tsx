// components/FireTransition.tsx
"use client"

import { useState, useEffect } from "react"

export default function FireTransition() {
  const [showTransition, setShowTransition] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Start exit animation after 2 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, 2000)

    // Hide component after exit animation completes
    const hideTimer = setTimeout(() => {
      setShowTransition(false)
    }, 3000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!showTransition) return null

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Use your existing embers video with enhanced effects */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/Embers.mp4"
        autoPlay
        muted
        playsInline
        style={{ 
          filter: "brightness(1.8) contrast(1.5) saturate(1.3)",
          mixBlendMode: "screen"
        }}
      />
      
      {/* Fire gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center bottom, 
              rgba(255, 69, 0, 0.6) 0%, 
              rgba(255, 140, 0, 0.4) 30%, 
              rgba(255, 165, 0, 0.2) 60%,
              transparent 100%),
            linear-gradient(to top,
              rgba(255, 69, 0, 0.8) 0%,
              rgba(255, 140, 0, 0.3) 40%,
              transparent 80%)
          `,
          animation: "fireFlicker 0.1s infinite alternate"
        }}
      />

      <style jsx>{`
        @keyframes fireFlicker {
          0% { opacity: 0.9; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.02); }
          100% { opacity: 0.95; transform: scaleY(0.98); }
        }
      `}</style>
    </div>
  )
}