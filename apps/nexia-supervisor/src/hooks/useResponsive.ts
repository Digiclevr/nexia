'use client'

import { useState, useEffect } from 'react'

export interface BreakpointConfig {
  mobile: number
  tablet: number  
  desktop: number
  wide: number
}

export interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isWide: boolean
  screenSize: 'mobile' | 'tablet' | 'desktop' | 'wide'
  width: number
  height: number
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,   // < 768px
  tablet: 1024,  // 768px - 1024px  
  desktop: 1440, // 1024px - 1440px
  wide: 1440     // > 1440px
}

export function useResponsive(customBreakpoints?: Partial<BreakpointConfig>): ResponsiveState {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints }
  
  const [state, setState] = useState<ResponsiveState>(() => {
    // Default fallback for SSR
    return {
      isMobile: false,
      isTablet: false, 
      isDesktop: true,
      isWide: false,
      screenSize: 'desktop',
      width: 1200,
      height: 800
    }
  })

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      let screenSize: ResponsiveState['screenSize']
      let isMobile = false
      let isTablet = false
      let isDesktop = false
      let isWide = false

      if (width < breakpoints.mobile) {
        screenSize = 'mobile'
        isMobile = true
      } else if (width < breakpoints.tablet) {
        screenSize = 'tablet'
        isTablet = true
      } else if (width < breakpoints.wide) {
        screenSize = 'desktop'
        isDesktop = true
      } else {
        screenSize = 'wide'
        isWide = true
      }

      setState({
        isMobile,
        isTablet,
        isDesktop,
        isWide,
        screenSize,
        width,
        height
      })
    }

    // Set initial state
    updateState()

    // Listen for changes
    window.addEventListener('resize', updateState)
    return () => window.removeEventListener('resize', updateState)
  }, [breakpoints.desktop, breakpoints.mobile, breakpoints.tablet, breakpoints.wide])

  return state
}

// Hook utilitaire pour media queries spécifiques
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Hook pour orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }
    
    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    return () => window.removeEventListener('resize', updateOrientation)
  }, [])
  
  return orientation
}