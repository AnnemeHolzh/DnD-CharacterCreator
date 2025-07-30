/**
 * Browser detection utility for feedback system
 * Detects browser name, version, and other relevant information
 */

export interface BrowserInfo {
  name: string
  version: string
  userAgent: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  platform: string
}

export function detectBrowser(): BrowserInfo {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return {
      name: 'Unknown',
      version: 'Unknown',
      userAgent: 'Server-side',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      platform: 'Unknown'
    }
  }

  const userAgent = navigator.userAgent
  const platform = navigator.platform || 'Unknown'
  
  // Detect mobile/tablet/desktop
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)
  const isDesktop = !isMobile

  // Browser detection
  let name = 'Unknown'
  let version = 'Unknown'

  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) {
    name = 'Chrome'
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/)
    if (match) version = match[1]
  }
  // Edge
  else if (userAgent.includes('Edg')) {
    name = 'Edge'
    const match = userAgent.match(/Edg\/(\d+\.\d+)/)
    if (match) version = match[1]
  }
  // Firefox
  else if (userAgent.includes('Firefox')) {
    name = 'Firefox'
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/)
    if (match) version = match[1]
  }
  // Safari
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari'
    const match = userAgent.match(/Version\/(\d+\.\d+)/)
    if (match) version = match[1]
  }
  // Opera
  else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    name = 'Opera'
    const match = userAgent.match(/(?:OPR|Opera)\/(\d+\.\d+)/)
    if (match) version = match[1]
  }
  // Internet Explorer
  else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    name = 'Internet Explorer'
    const match = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)
    if (match) version = match[1]
  }

  return {
    name,
    version,
    userAgent,
    isMobile,
    isTablet,
    isDesktop,
    platform
  }
}

export function getBrowserDisplayString(): string {
  const browser = detectBrowser()
  return `${browser.name} ${browser.version} (${browser.platform})`
} 