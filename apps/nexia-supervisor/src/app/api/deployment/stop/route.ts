import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { app, environment } = body

    console.log(`⏹️ Arrêt ${app} sur ${environment}`)

    // Déterminer la commande d'arrêt appropriée
    const command = getStopCommand(app, environment)
    
    if (!command) {
      return NextResponse.json({
        error: `Commande d'arrêt non définie pour ${app} sur ${environment}`
      }, { status: 400 })
    }

    // Simuler l'arrêt
    console.log(`🔧 Exécution: ${command}`)
    
    const result = await simulateStop(app, environment)
    
    return NextResponse.json({
      success: true,
      app,
      environment,
      command,
      message: `Service ${app} arrêté sur ${environment}`,
      ...result
    })

  } catch (error) {
    console.error('❌ Erreur arrêt:', error)
    return NextResponse.json({
      error: 'Erreur lors de l\'arrêt du service'
    }, { status: 500 })
  }
}

function getStopCommand(app: string, environment: string): string {
  if (environment === 'mac-local') {
    // Commandes locales - arrêt par PID ou port
    const localCommands: Record<string, string> = {
      'nexia-supervisor': 'lsof -ti:7010 | xargs kill -9',
      'nexia-voice': 'lsof -ti:7011 | xargs kill -9',
      'nexia-directus': 'lsof -ti:7012 | xargs kill -9',
      'nexia-claude-code': 'lsof -ti:7013 | xargs kill -9',
      'onlyoneapi-marketing': 'lsof -ti:9080 | xargs kill -9',
      'onlyoneapi-developer': 'lsof -ti:9082 | xargs kill -9',
      'onlyoneapi-portal': 'lsof -ti:9081 | xargs kill -9',
      'onlyoneapi-community': 'lsof -ti:9083 | xargs kill -9',
      'onlyoneapi-api': 'lsof -ti:8001 | xargs kill -9',
      'kreach-web': 'lsof -ti:5003 | xargs kill -9',
      'kreach-api': 'lsof -ti:8001 | xargs kill -9'
    }
    return localCommands[app] || `echo "Commande d'arrêt locale non définie pour ${app}"`
  } else {
    // Commandes Kubernetes - scale à 0 replicas
    const namespace = getKubernetesNamespace(app, environment)
    const deploymentName = getDeploymentName(app, environment)
    return `kubectl scale deployment/${deploymentName} --replicas=0 -n ${namespace}`
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

async function simulateStop(app: string, environment: string) {
  console.log(`🛑 Stopping ${app} on ${environment}...`)
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  console.log(`✅ ${app} stopped successfully on ${environment}`)
  
  return {
    status: 'stopped',
    duration: '1.5s',
    replicas: 0
  }
}