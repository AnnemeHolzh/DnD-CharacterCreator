"use client"

import { useState, useEffect } from 'react'

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      // Check for mobile devices
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // Check screen size (mobile if width is less than 768px)
      const isSmallScreen = window.innerWidth < 768
      
      // Consider it mobile if either condition is true
      setIsMobile(isMobileDevice || isSmallScreen)
      setIsLoading(false)
    }

    // Check immediately
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return { isMobile, isLoading }
} 