import { useEffect, useState } from 'react'

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<string>('••:••:••')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }))
    }

    // Premier update après hydration
    updateTime()
    
    // Update toutes les minutes
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return {
    currentTime,
    mounted: true
  }
}