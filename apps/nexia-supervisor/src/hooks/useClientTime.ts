import { useEffect, useState } from 'react'

export function useClientTime() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTime = (dateString: string) => {
    if (!mounted) {
      return '••:••:••' // Placeholder during SSR
    }
    
    try {
      return new Date(dateString).toLocaleTimeString('fr-FR')
    } catch (error) {
      return '••:••:••'
    }
  }

  const formatRelativeTime = (dateString: string) => {
    if (!mounted) {
      return 'Il y a quelques instants'
    }

    try {
      const now = new Date().getTime()
      const then = new Date(dateString).getTime()
      const diffMs = now - then
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      
      if (diffMinutes < 1) return 'À l\'instant'
      if (diffMinutes < 60) return `Il y a ${diffMinutes} min`
      
      const diffHours = Math.floor(diffMinutes / 60)
      if (diffHours < 24) return `Il y a ${diffHours}h`
      
      const diffDays = Math.floor(diffHours / 24)
      return `Il y a ${diffDays}j`
    } catch (error) {
      return 'Il y a quelques instants'
    }
  }

  return {
    mounted,
    formatTime,
    formatRelativeTime
  }
}