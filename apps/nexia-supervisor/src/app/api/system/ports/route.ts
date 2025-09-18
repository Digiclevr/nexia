import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
  try {
    const ports = [
      // BlueOcean services
      { name: 'kreach-web', port: 5003, ecosystem: 'blueocean' },
      { name: 'kreach-api', port: 8001, ecosystem: 'blueocean' },
      { name: 'nextstep-api', port: 8020, ecosystem: 'blueocean' },
      { name: 'nextstep-dashboard', port: 8021, ecosystem: 'blueocean' },
      
      // OnlyOneAPI services
      { name: 'marketing-site', port: 9080, ecosystem: 'onlyoneapi' },
      { name: 'developer-portal', port: 9082, ecosystem: 'onlyoneapi' },
      { name: 'portal-app', port: 9081, ecosystem: 'onlyoneapi' },
      { name: 'community-site', port: 9083, ecosystem: 'onlyoneapi' },
      
      // NEXIA services
      { name: 'nexia-supervisor', port: 7010, ecosystem: 'nexia' },
      { name: 'nexia-api', port: 7011, ecosystem: 'nexia' },
      { name: 'nexia-directus', port: 7012, ecosystem: 'nexia' }
    ]
    
    const portStatuses = await Promise.all(
      ports.map(async (service) => {
        const isActive = await checkPort(service.port)
        return {
          ...service,
          status: isActive ? 'running' : 'down',
          last_check: new Date().toISOString()
        }
      })
    )
    
    const ecosystemSummary = {
      blueocean: {
        total: portStatuses.filter(p => p.ecosystem === 'blueocean').length,
        running: portStatuses.filter(p => p.ecosystem === 'blueocean' && p.status === 'running').length
      },
      onlyoneapi: {
        total: portStatuses.filter(p => p.ecosystem === 'onlyoneapi').length,
        running: portStatuses.filter(p => p.ecosystem === 'onlyoneapi' && p.status === 'running').length
      },
      nexia: {
        total: portStatuses.filter(p => p.ecosystem === 'nexia').length,
        running: portStatuses.filter(p => p.ecosystem === 'nexia' && p.status === 'running').length
      }
    }
    
    return Response.json({
      ports: portStatuses,
      summary: ecosystemSummary,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error checking ports:', error)
    return Response.json({
      error: 'Failed to check port status',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

async function checkPort(port: number): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`lsof -i :${port}`)
    return stdout.trim().length > 0
  } catch (error) {
    // lsof returns exit code 1 when no process is found on the port
    return false
  }
}