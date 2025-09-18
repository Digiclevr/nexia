import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { app, environment } = body

    console.log(`🔄 Redémarrage ${app} sur ${environment}`)

    // Déterminer la commande de redémarrage appropriée
    const command = getRestartCommand(app, environment)
    
    if (!command) {
      return NextResponse.json({
        error: `Commande de redémarrage non définie pour ${app} sur ${environment}`
      }, { status: 400 })
    }

    // Simuler le redémarrage
    console.log(`🔧 Exécution: ${command}`)
    
    const result = await simulateRestart(app, environment)
    
    return NextResponse.json({
      success: true,
      app,
      environment,
      command,
      message: `Service ${app} redémarré sur ${environment}`,
      ...result
    })

  } catch (error) {
    console.error('❌ Erreur redémarrage:', error)
    return NextResponse.json({
      error: 'Erreur lors du redémarrage du service'
    }, { status: 500 })
  }
}

function getRestartCommand(app: string, environment: string): string {
  if (environment === 'mac-local') {
    // Commandes locales - arrêt puis redémarrage
    const localCommands: Record<string, string> = {
      'nexia-supervisor': 'lsof -ti:7010 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-supervisor && npm run dev',
      'nexia-voice': 'lsof -ti:7011 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-voice && npm run dev',
      'nexia-directus': 'lsof -ti:7012 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-directus && npm run dev',
      'nexia-claude-code': 'lsof -ti:7013 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-claude-code && npm run dev',
      'onlyoneapi-marketing': 'lsof -ti:9080 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/marketing && npm run dev',
      'onlyoneapi-developer': 'lsof -ti:9082 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/developer && npm run dev',
      'onlyoneapi-portal': 'lsof -ti:9081 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/portal && npm run dev',
      'onlyoneapi-community': 'lsof -ti:9083 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/community && npm run dev',
      'onlyoneapi-api': 'lsof -ti:8001 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/api && python main.py',
      'kreach-web': 'lsof -ti:5003 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/KREACH && npm run dev',
      'kreach-api': 'lsof -ti:8001 | xargs kill -9 && cd /Users/ludovicpilet/PROJECTS/KREACH && npm run dev:api'
    }
    return localCommands[app] || `echo "Commande de redémarrage locale non définie pour ${app}"`
  } else {
    // Commandes Kubernetes - rollout restart
    const namespace = getKubernetesNamespace(app, environment)
    const deploymentName = getDeploymentName(app, environment)
    return `kubectl rollout restart deployment/${deploymentName} -n ${namespace}`
  }
}

function getKubernetesNamespace(app: string, environment: string): string {
  const appCategory = getAppCategory(app)
  
  const namespaceMap: Record<string, Record<string, string>> = {
    'Core': {
      'cluster-dev': 'nexia-core-dev',
      'cluster-staging': 'nexia-core-staging', 
      'cluster-prod': 'nexia-core-prod'
    },
    'OnlyOneAPI': {
      'cluster-dev': 'onlyoneapi-dev',
      'cluster-staging': 'onlyoneapi-staging',
      'cluster-prod': 'onlyoneapi-prod'
    },
    'BlueOcean': {
      'cluster-dev': 'blueocean-dev',
      'cluster-staging': 'blueocean-staging',
      'cluster-prod': 'blueocean-prod'
    },
    'Automation': {
      'cluster-dev': 'automation-dev',
      'cluster-staging': 'automation-staging',
      'cluster-prod': 'automation-prod'
    }
  }
  
  return namespaceMap[appCategory]?.[environment] || `${app}-${environment}`
}

function getDeploymentName(app: string, environment: string): string {
  const envSuffix = environment.replace('cluster-', '')
  return `${app}-${envSuffix}`
}

function getAppCategory(app: string): string {
  if (app.startsWith('nexia-')) return 'Core'
  if (app.startsWith('onlyoneapi-')) return 'OnlyOneAPI'
  if (app.startsWith('nextstep-') || app.startsWith('kreach-')) return 'BlueOcean'
  if (app.includes('automation')) return 'Automation'
  return 'Other'
}

async function simulateRestart(app: string, environment: string) {
  console.log(`⏹️ Stopping ${app} on ${environment}...`)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log(`🚀 Starting ${app} on ${environment}...`)
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log(`✅ ${app} restarted successfully on ${environment}`)
  
  return {
    status: 'running',
    duration: '3s',
    replicas: environment === 'mac-local' ? 1 : 2,
    steps: ['Stop service', 'Start service', 'Health check']
  }
}