export async function GET() {
  return Response.json({
    timestamp: new Date().toISOString(),
    system: {
      cpu_usage: Math.floor(Math.random() * 40) + 20, // 20-60%
      memory_usage: Math.floor(Math.random() * 30) + 50, // 50-80%
      disk_usage: Math.floor(Math.random() * 20) + 30, // 30-50%
      network_latency: Math.floor(Math.random() * 50) + 10 // 10-60ms
    },
    services: {
      nexia_supervisor: {
        status: 'healthy',
        uptime: '15d 8h 32m',
        requests_per_minute: Math.floor(Math.random() * 50) + 20
      },
      directus_cms: {
        status: 'healthy',
        response_time: Math.floor(Math.random() * 100) + 50
      },
      voice_interface: {
        status: 'ready',
        commands_today: Math.floor(Math.random() * 15) + 5
      }
    }
  })
}

export async function POST() {
  return Response.json({ message: 'Metrics updated' }, { status: 200 })
}