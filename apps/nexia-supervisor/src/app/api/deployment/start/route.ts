import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { app, environment } = body

    console.log(`▶️ Démarrage ${app} sur ${environment}`)

    // Déterminer la commande kubectl appropriée
    const command = getStartCommand(app, environment)
    
    if (!command) {
      return NextResponse.json({
        error: `Commande de démarrage non définie pour ${app} sur ${environment}`
      }, { status: 400 })
    }

    // Simuler le démarrage
    console.log(`🔧 Exécution: ${command}`)
    
    const result = await simulateStart(app, environment)
    
    return NextResponse.json({
      success: true,
      app,
      environment,
      command,
      message: `Service ${app} démarré sur ${environment}`,
      ...result
    })

  } catch (error) {
    console.error('❌ Erreur démarrage:', error)
    return NextResponse.json({
      error: 'Erreur lors du démarrage du service'
    }, { status: 500 })
  }
}

function getStartCommand(app: string, environment: string): string {
  if (environment === 'mac-local') {
    // Commandes locales
    const localCommands: Record<string, string> = {
      'nexia-supervisor': 'cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-supervisor && npm run dev',
      'nexia-voice': 'cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-voice && npm run dev',
      'onlyoneapi-marketing': 'cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/marketing && npm run dev',
      'onlyoneapi-developer': 'cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/developer && npm run dev',
      'onlyoneapi-portal': 'cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/portal && npm run dev',
      'onlyoneapi-community': 'cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/community && npm run dev',
      'onlyoneapi-api': 'cd /Users/ludovicpilet/PROJECTS/ONLYONEAPI/api && python main.py',
      'kreach-web': 'cd /Users/ludovicpilet/PROJECTS/KREACH && npm run dev',
      'kreach-api': 'cd /Users/ludovicpilet/PROJECTS/KREACH && npm run dev:api'
    }
    return localCommands[app] || `echo "Commande locale non définie pour ${app}"`
  } else {
    // Commandes Kubernetes
    const namespace = getKubernetesNamespace(app, environment)
    const deploymentName = getDeploymentName(app, environment)
    return `kubectl scale deployment/${deploymentName} --replicas=1 -n ${namespace}`
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

async function simulateStart(app: string, environment: string) {
  console.log(`🚀 Starting ${app} on ${environment}...`)
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log(`✅ ${app} started successfully on ${environment}`)
  
  return {
    status: 'running',
    duration: '2s',
    replicas: environment === 'mac-local' ? 1 : 2
  }
}