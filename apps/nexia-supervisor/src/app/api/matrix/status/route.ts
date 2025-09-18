import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Récupérer les statuts réels des applications
    const matrixStatus = await getRealMatrixStatus()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: matrixStatus
    })
    
  } catch (error) {
    console.error('❌ Erreur récupération status matrix:', error)
    return NextResponse.json({
      error: 'Erreur lors de la récupération du statut de la matrice'
    }, { status: 500 })
  }
}

async function getRealMatrixStatus() {
  const status: Record<string, Record<string, any>> = {}
  
  // Applications NEXIA Core
  const nexiaApps = ['nexia-supervisor', 'nexia-voice', 'nexia-directus', 'nexia-claude-code']
  
  for (const app of nexiaApps) {
    status[app] = {
      'mac-local': await checkLocalService(app),
      'cluster-dev': await checkKubernetesService(app, 'dev'),
      'cluster-staging': await checkKubernetesService(app, 'staging'),
      'cluster-prod': await checkKubernetesService(app, 'prod')
    }
  }
  
  // Applications OnlyOneAPI
  const onlyOneApiApps = ['onlyoneapi-marketing', 'onlyoneapi-developer', 'onlyoneapi-portal', 'onlyoneapi-community', 'onlyoneapi-api']
  
  for (const app of onlyOneApiApps) {
    status[app] = {
      'mac-local': await checkLocalService(app),
      'cluster-dev': await checkKubernetesService(app, 'dev'),
      'cluster-staging': await checkKubernetesService(app, 'staging'),
      'cluster-prod': await checkKubernetesService(app, 'prod')
    }
  }
  
  // Applications BlueOcean
  const blueOceanApps = ['nextstep-landing', 'nextstep-dashboard', 'nextstep-admin', 'nextstep-api', 'kreach-web', 'kreach-api']
  
  for (const app of blueOceanApps) {
    status[app] = {
      'mac-local': await checkLocalService(app),
      'cluster-dev': await checkKubernetesService(app, 'dev'),
      'cluster-staging': await checkKubernetesService(app, 'staging'),
      'cluster-prod': await checkKubernetesService(app, 'prod')
    }
  }
  
  // Business Automation
  status['business-automation'] = {
    'mac-local': await checkLocalService('business-automation'),
    'cluster-dev': await checkKubernetesService('business-automation', 'dev'),
    'cluster-staging': await checkKubernetesService('business-automation', 'staging'),
    'cluster-prod': await checkKubernetesService('business-automation', 'prod')
  }
  
  return status
}

async function checkLocalService(appId: string): Promise<any> {
  const portMappings: Record<string, number> = {
    'nexia-supervisor': 7010,
    'nexia-voice': 7011,
    'nexia-directus': 7012,
    'nexia-claude-code': 7013,
    'onlyoneapi-marketing': 9080,
    'onlyoneapi-developer': 9082,
    'onlyoneapi-portal': 9081,
    'onlyoneapi-community': 9083,
    'onlyoneapi-api': 8001,
    'kreach-web': 5003,
    'kreach-api': 8001,
    'business-automation': 7005
  }
  
  const port = portMappings[appId]
  if (!port) {
    return { status: 'unknown', reason: 'Port non défini' }
  }
  
  try {
    // Vérifier si le port est utilisé
    const { stdout } = await execAsync(`lsof -ti:${port}`)
    if (stdout.trim()) {
      return {
        status: 'running',
        port,
        url: `http://localhost:${port}`,
        lastCheck: new Date().toISOString()
      }
    } else {
      return {
        status: 'stopped',
        port,
        lastCheck: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      status: 'stopped',
      port,
      lastCheck: new Date().toISOString()
    }
  }
}

async function checkKubernetesService(appId: string, environment: string): Promise<any> {
  const namespace = getKubernetesNamespace(appId, environment)
  const deploymentName = getDeploymentName(appId, environment)
  
  try {
    // Vérifier si le déploiement existe
    const { stdout } = await execAsync(`kubectl get deployment ${deploymentName} -n ${namespace} -o jsonpath='{.status.readyReplicas}/{.spec.replicas}' 2>/dev/null`)
    
    if (stdout.trim()) {
      const [ready, desired] = stdout.split('/').map(Number)
      
      const portForward = getPortForward(appId, environment)
      const hostsUrl = getHostsUrl(appId, environment)
      const k8sUrl = getK8sServiceUrl(appId, environment, namespace)
      const portForwardCommand = getPortForwardCommand(appId, environment, namespace)
      
      return {
        status: ready > 0 ? 'running' : 'stopped',
        replicas: { ready, desired },
        portForward,
        hostsUrl,
        k8sUrl,
        portForwardCommand,
        namespace,
        deployment: deploymentName,
        accessUrls: {
          internal: k8sUrl,
          external: hostsUrl,
          portForward: `http://localhost:${portForward}`,
          command: portForwardCommand
        },
        lastCheck: new Date().toISOString()
      }
    } else {
      return {
        status: 'unknown',
        reason: 'Déploiement non trouvé',
        namespace,
        deployment: deploymentName,
        lastCheck: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      namespace,
      deployment: deploymentName,
      lastCheck: new Date().toISOString()
    }
  }
}

function getKubernetesNamespace(appId: string, environment: string): string {
  // Namespaces réels basés sur l'état actuel du cluster
  if (appId.startsWith('nexia-')) {
    switch (environment) {
      case 'dev': return 'nexia-dev'
      case 'staging': return 'nexia-staging'  
      case 'prod': return 'nexia'
      default: return `nexia-${environment}`
    }
  } else if (appId.startsWith('onlyoneapi-')) {
    return 'api-pool' // OnlyOneAPI utilise toujours api-pool
  } else if (appId.startsWith('nextstep-')) {
    switch (environment) {
      case 'dev': return 'nextstep-dev'
      case 'staging': return 'nextstep-staging'
      case 'prod': return 'nextstep-prod'
      default: return `nextstep-${environment}`
    }
  } else if (appId.startsWith('kreach-')) {
    switch (environment) {
      case 'dev': return 'kreach-dev'
      case 'staging': return 'kreach-staging'
      case 'prod': return 'kreach-prod'
      default: return `kreach-${environment}`
    }
  } else if (appId.includes('automation')) {
    return `business-automation-${environment}`
  }
  return `${appId}-${environment}`
}

function getDeploymentName(appId: string, environment: string): string {
  // Noms de déploiements réels sur le cluster
  if (appId.startsWith('nexia-')) {
    return appId // Les déploiements NEXIA utilisent juste le nom de l'app
  } else if (appId.startsWith('onlyoneapi-')) {
    return `${appId}-v7` // OnlyOneAPI utilise un versioning
  }
  return `${appId}-${environment}`
}

function getPortForward(appId: string, environment: string): number {
  const basePorts: Record<string, number> = {
    'nexia-supervisor': 7010,
    'nexia-voice': 7011,
    'nexia-directus': 7012,
    'nexia-claude-code': 7013,
    'onlyoneapi-marketing': 9080,
    'onlyoneapi-developer': 9082,
    'onlyoneapi-portal': 9081,
    'onlyoneapi-community': 9083,
    'onlyoneapi-api': 8001,
    'nextstep-api': 8020,
    'nextstep-dashboard': 8021,
    'nextstep-admin': 8022,
    'nextstep-landing': 8023,
    'kreach-web': 5003,
    'kreach-api': 8001,
    'business-automation': 7005
  }
  
  const basePort = basePorts[appId] || 8000
  const envOffset = environment === 'dev' ? 100 : environment === 'staging' ? 200 : 300
  
  return basePort + envOffset
}

function getHostsUrl(appId: string, environment: string): string {
  const envSuffix = environment === 'prod' ? '' : `-${environment}`
  
  // URLs spécifiques selon l'écosystème d'application
  if (appId.startsWith('nexia-')) {
    // NEXIA est un écosystème indépendant
    const component = appId.replace('nexia-', '')
    return `https://${component}${envSuffix}.nexia.internal`
  } else if (appId.startsWith('onlyoneapi-')) {
    // OnlyOneAPI a ses propres domaines
    const subdomain = appId.replace('onlyoneapi-', '')
    return `https://${subdomain}${envSuffix}.onlyoneapi.com`
  } else if (appId.startsWith('nextstep-')) {
    // BlueOcean NEXTSTEP est indépendant
    const component = appId.replace('nextstep-', '')
    return `https://${component}${envSuffix}.nextstep.internal`
  } else if (appId.startsWith('kreach-')) {
    // KREACH (KONQER) est indépendant
    const component = appId.replace('kreach-', '')
    return `https://${component}${envSuffix}.kreach.internal`
  } else if (appId.includes('business-automation')) {
    // Business Automation est indépendant
    return `https://automation${envSuffix}.internal`
  }
  
  // Fallback pour applications non catégorisées
  return `https://${appId}${envSuffix}.internal`
}

function getK8sServiceUrl(appId: string, environment: string, namespace: string): string {
  const servicePorts: Record<string, number> = {
    'nexia-supervisor': 7010,
    'nexia-voice': 7011,
    'nexia-directus': 7012,
    'nexia-claude-code': 7013,
    'onlyoneapi-marketing': 9080,
    'onlyoneapi-developer': 9082,
    'onlyoneapi-portal': 9081,
    'onlyoneapi-community': 9083,
    'onlyoneapi-api': 8001,
    'nextstep-api': 8020,
    'nextstep-dashboard': 8021,
    'nextstep-admin': 8022,
    'nextstep-landing': 8023,
    'kreach-web': 5003,
    'kreach-api': 8001,
    'business-automation': 7005
  }
  
  const port = servicePorts[appId] || 80
  return `http://${appId}.${namespace}.svc.cluster.local:${port}`
}

function getPortForwardCommand(appId: string, environment: string, namespace: string): string {
  const portForward = getPortForward(appId, environment)
  const servicePorts: Record<string, number> = {
    'nexia-supervisor': 7010,
    'nexia-voice': 7011,
    'nexia-directus': 7012,
    'nexia-claude-code': 7013,
    'onlyoneapi-marketing': 9080,
    'onlyoneapi-developer': 9082,
    'onlyoneapi-portal': 9081,
    'onlyoneapi-community': 9083,
    'onlyoneapi-api': 8001,
    'nextstep-api': 8020,
    'nextstep-dashboard': 8021,
    'nextstep-admin': 8022,
    'nextstep-landing': 8023,
    'kreach-web': 5003,
    'kreach-api': 8001,
    'business-automation': 7005
  }
  
  const servicePort = servicePorts[appId] || 80
  return `kubectl port-forward -n ${namespace} svc/${appId} ${portForward}:${servicePort}`
}