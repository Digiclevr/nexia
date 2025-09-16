// BlueOcean Application Status Checker
export interface BlueOceanApp {
  name: string
  port: number
  url: string
  status: 'online' | 'offline' | 'error'
  responseTime?: number
  lastCheck?: Date
}

export const BLUEOCEAN_APPS: BlueOceanApp[] = [
  {
    name: 'KREACH',
    port: 5003,
    url: 'http://localhost:5003',
    status: 'offline'
  },
  {
    name: 'KVIBE',
    port: 7005,
    url: 'http://localhost:7005',
    status: 'offline'
  },
  {
    name: 'NEXTSTEP',
    port: 7000,
    url: 'http://localhost:7000',
    status: 'offline'
  },
  {
    name: 'NEXTGEN',
    port: 7001,
    url: 'http://localhost:7001',
    status: 'offline'
  },
  {
    name: 'HOLDING',
    port: 8002,
    url: 'http://localhost:8002',
    status: 'offline'
  },
  {
    name: 'ONLYONEAPI',
    port: 9080,
    url: 'http://localhost:9080',
    status: 'offline'
  },
  {
    name: 'ENDPOINTS',
    port: 5021,
    url: 'http://localhost:5021',
    status: 'offline'
  }
]

export async function checkBlueOceanAppStatus(app: BlueOceanApp): Promise<BlueOceanApp> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3s timeout
    
    const response = await fetch(app.url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // Avoid CORS issues
    })
    
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    return {
      ...app,
      status: 'online',
      responseTime,
      lastCheck: new Date()
    }
  } catch (error) {
    return {
      ...app,
      status: 'offline',
      responseTime: Date.now() - startTime,
      lastCheck: new Date()
    }
  }
}

export async function checkAllBlueOceanApps(): Promise<BlueOceanApp[]> {
  const promises = BLUEOCEAN_APPS.map(app => checkBlueOceanAppStatus(app))
  return Promise.all(promises)
}

export function getStatusColor(status: BlueOceanApp['status']): string {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'offline':
      return 'bg-gray-400'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

export function getStatusColorText(status: BlueOceanApp['status']): string {
  switch (status) {
    case 'online':
      return 'text-green-600'
    case 'offline':
      return 'text-gray-500'
    case 'error':
      return 'text-red-600'
    default:
      return 'text-gray-500'
  }
}