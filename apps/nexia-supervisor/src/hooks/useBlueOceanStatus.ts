import { useQuery } from '@tanstack/react-query'
import { BlueOceanApp } from '@/lib/blueocean-status'

interface BlueOceanStatusResponse {
  success: boolean
  data?: BlueOceanApp[]
  error?: string
  timestamp: string
}

export function useBlueOceanStatus() {
  return useQuery<BlueOceanStatusResponse>({
    queryKey: ['blueocean-status'],
    queryFn: async () => {
      const response = await fetch('/api/blueocean-status')
      if (!response.ok) {
        throw new Error('Failed to fetch BlueOcean status')
      }
      return response.json()
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
    retryDelay: 1000,
    staleTime: 15000, // Data considered fresh for 15 seconds
  })
}