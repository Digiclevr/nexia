import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Récupérer l'état des 6 axes stratégiques BlueOcean
    const blueOceanStatus = await getBlueOceanSixAxes()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: blueOceanStatus,
      globalHealth: calculateGlobalHealth(blueOceanStatus)
    })
    
  } catch (error) {
    console.error('❌ Erreur récupération BlueOcean status:', error)
    return NextResponse.json({
      error: 'Erreur lors de la récupération du statut BlueOcean'
    }, { status: 500 })
  }
}

async function getBlueOceanSixAxes() {
  // AXE 1: OnlyOneAPI
  const onlyOneAPIStatus = await getOnlyOneAPIStatus()
  
  // AXE 2: KREACH  
  const kreachStatus = await getKreachStatus()
  
  // AXE 3: KVIBE
  const kvibeStatus = await getKvibeStatus()
  
  // AXE 4: NEXTSTEP
  const nextstepStatus = await getNextstepStatus()
  
  // AXE 5: Platform Services
  const platformStatus = await getPlatformStatus()
  
  // AXE 6: Infrastructure & Monitoring
  const infrastructureStatus = await getInfrastructureStatus()
  
  return {
    onlyoneapi: onlyOneAPIStatus,
    kreach: kreachStatus,
    kvibe: kvibeStatus,
    nextstep: nextstepStatus,
    platform: platformStatus,
    infrastructure: infrastructureStatus
  }
}

async function getOnlyOneAPIStatus() {
  try {
    // Pods OnlyOneAPI
    const { stdout: pods } = await execAsync(`kubectl get pods --all-namespaces | grep -E "(onlyoneapi|api-pool)" | grep -v "Terminating"`)
    const podLines = pods.trim().split('\n').filter(line => line.length > 0)
    
    // Services OnlyOneAPI
    const { stdout: services } = await execAsync(`kubectl get services --all-namespaces | grep onlyoneapi`)
    const serviceLines = services.trim().split('\n').filter(line => line.length > 0)
    
    // Analyse des anomalies
    const runningPods = podLines.filter(line => line.includes('Running')).length
    const totalPods = podLines.length
    const healthScore = totalPods > 0 ? (runningPods / totalPods) * 100 : 0
    
    // Détection anomalies
    const anomalies = []
    if (healthScore < 90) {
      anomalies.push({
        type: 'critical',
        message: `Pods non opérationnels: ${totalPods - runningPods}/${totalPods}`,
        severity: healthScore < 50 ? 'critical' : 'warning'
      })
    }
    
    // Analyse uptime des pods anciens
    const oldPods = podLines.filter(line => {
      const match = line.match(/(\d+)d/)
      return match && parseInt(match[1]) > 15
    })
    
    if (oldPods.length > 0) {
      anomalies.push({
        type: 'maintenance',
        message: `${oldPods.length} pods anciens (>15j) - Redémarrage recommandé`,
        severity: 'warning'
      })
    }
    
    return {
      name: 'OnlyOneAPI',
      status: healthScore >= 90 ? 'healthy' : healthScore >= 70 ? 'warning' : 'critical',
      healthScore: Math.round(healthScore),
      pods: {
        running: runningPods,
        total: totalPods,
        details: podLines.slice(0, 5) // Top 5 pods
      },
      services: {
        total: serviceLines.length,
        details: serviceLines.slice(0, 3) // Top 3 services
      },
      anomalies,
      uptime: '99.2%', // À calculer avec vraies métriques
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'OnlyOneAPI',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      anomalies: [{
        type: 'critical',
        message: 'Impossible de récupérer les données Kubernetes',
        severity: 'critical'
      }],
      lastCheck: new Date().toISOString()
    }
  }
}

async function getKreachStatus() {
  try {
    // Pods KREACH
    const { stdout: pods } = await execAsync(`kubectl get pods --all-namespaces | grep kreach`)
    const podLines = pods.trim().split('\n').filter(line => line.length > 0)
    
    // Namespaces KREACH
    const { stdout: namespaces } = await execAsync(`kubectl get namespaces | grep kreach`)
    const namespaceLines = namespaces.trim().split('\n').filter(line => line.length > 0)
    
    const runningPods = podLines.filter(line => line.includes('Running')).length
    const totalPods = podLines.length
    const healthScore = totalPods > 0 ? (runningPods / totalPods) * 100 : 0
    
    const anomalies = []
    if (healthScore < 100 && totalPods > 0) {
      anomalies.push({
        type: 'warning',
        message: `${totalPods - runningPods} pods non opérationnels`,
        severity: 'warning'
      })
    }
    
    return {
      name: 'KREACH (KONQER)',
      status: healthScore >= 90 ? 'healthy' : healthScore >= 70 ? 'warning' : 'critical',
      healthScore: Math.round(healthScore),
      pods: {
        running: runningPods,
        total: totalPods,
        details: podLines
      },
      namespaces: {
        total: namespaceLines.length,
        list: namespaceLines.map(line => line.split(/\s+/)[0])
      },
      anomalies,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'KREACH',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      anomalies: [{
        type: 'critical',
        message: 'Impossible de récupérer les données KREACH',
        severity: 'critical'
      }],
      lastCheck: new Date().toISOString()
    }
  }
}

async function getKvibeStatus() {
  try {
    // Pods KVIBE (kvibe ET kvibes)
    const { stdout: pods } = await execAsync(`kubectl get pods --all-namespaces | grep -E "(kvibe|kvibes)"`)
    const podLines = pods.trim().split('\n').filter(line => line.length > 0)
    
    // Namespaces KVIBE
    const { stdout: namespaces } = await execAsync(`kubectl get namespaces | grep -E "(kvibe|kvibes)"`)
    const namespaceLines = namespaces.trim().split('\n').filter(line => line.length > 0)
    
    // PVCs KVIBE
    const { stdout: pvcs } = await execAsync(`kubectl get pvc --all-namespaces | grep -E "(kvibe|kvibes)"`)
    const pvcLines = pvcs.trim().split('\n').filter(line => line.length > 0)
    
    const runningPods = podLines.filter(line => line.includes('Running')).length
    const failedPods = podLines.filter(line => line.includes('Pending') || line.includes('Error') || line.includes('CrashLoopBackOff')).length
    const totalPods = podLines.length
    
    // Calcul stockage total
    const totalStorage = pvcLines.reduce((sum, line) => {
      const match = line.match(/(\d+)Gi/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)
    
    // Détection anomalies critiques
    const anomalies = []
    
    // Namespace explosion
    if (namespaceLines.length > 4) {
      anomalies.push({
        type: 'critical',
        message: `Explosion namespaces: ${namespaceLines.length} namespaces (kvibe vs kvibes)`,
        severity: 'critical'
      })
    }
    
    // Pods en échec
    if (failedPods > 0) {
      anomalies.push({
        type: 'critical',
        message: `${failedPods} pods en échec (Pending/Error/CrashLoop)`,
        severity: 'critical'
      })
    }
    
    // Stockage surdimensionné
    if (totalStorage > 15) {
      anomalies.push({
        type: 'warning',
        message: `Stockage surdimensionné: ${totalStorage}Gi (recommandé: <10Gi)`,
        severity: 'warning'
      })
    }
    
    const healthScore = totalPods > 0 ? Math.max(0, (runningPods / totalPods) * 100 - (anomalies.length * 20)) : 0
    
    return {
      name: 'Kvibes',
      status: anomalies.some(a => a.severity === 'critical') ? 'critical' : 
              anomalies.length > 0 ? 'warning' : 'healthy',
      healthScore: Math.round(healthScore),
      pods: {
        running: runningPods,
        failed: failedPods,
        total: totalPods,
        details: podLines.slice(0, 10)
      },
      namespaces: {
        total: namespaceLines.length,
        list: namespaceLines.map(line => line.split(/\s+/)[0])
      },
      storage: {
        totalGi: totalStorage,
        pvcs: pvcLines.length
      },
      anomalies,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'Kvibes',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      anomalies: [{
        type: 'critical',
        message: 'Impossible de récupérer les données Kvibes',
        severity: 'critical'
      }],
      lastCheck: new Date().toISOString()
    }
  }
}

async function getNextstepStatus() {
  try {
    // Pods NEXTSTEP
    const { stdout: pods } = await execAsync(`kubectl get pods --all-namespaces | grep nextstep`)
    const podLines = pods.trim().split('\n').filter(line => line.length > 0)
    
    // Namespaces NEXTSTEP
    const { stdout: namespaces } = await execAsync(`kubectl get namespaces | grep nextstep`)
    const namespaceLines = namespaces.trim().split('\n').filter(line => line.length > 0)
    
    const runningPods = podLines.filter(line => line.includes('Running')).length
    const totalPods = podLines.length
    const healthScore = totalPods > 0 ? (runningPods / totalPods) * 100 : 0
    
    const anomalies = []
    if (healthScore < 90 && totalPods > 0) {
      anomalies.push({
        type: 'warning',
        message: `${totalPods - runningPods} pods non opérationnels`,
        severity: 'warning'
      })
    }
    
    // Architecture mature = bon point
    if (namespaceLines.length >= 6) {
      anomalies.push({
        type: 'info',
        message: `Architecture mature: ${namespaceLines.length} environnements séparés`,
        severity: 'info'
      })
    }
    
    return {
      name: 'NEXTSTEP',
      status: healthScore >= 90 ? 'healthy' : healthScore >= 70 ? 'warning' : 'critical',
      healthScore: Math.round(healthScore),
      pods: {
        running: runningPods,
        total: totalPods,
        details: podLines
      },
      namespaces: {
        total: namespaceLines.length,
        list: namespaceLines.map(line => line.split(/\s+/)[0])
      },
      anomalies,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'NEXTSTEP',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      lastCheck: new Date().toISOString()
    }
  }
}

async function getPlatformStatus() {
  try {
    // Noeuds platform-pool
    const { stdout: nodes } = await execAsync(`kubectl top nodes | grep platform-pool`)
    const nodeLines = nodes.trim().split('\n').filter(line => line.length > 0)
    
    // Services platform critiques
    const { stdout: platformPods } = await execAsync(`kubectl get pods -n platform`)
    const platformPodLines = platformPods.trim().split('\n').filter(line => line.length > 0 && !line.includes('NAME'))
    
    // Analyse CPU/Memory des noeuds
    const avgCpuPercent = nodeLines.reduce((sum, line) => {
      const match = line.match(/(\d+)%/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0) / nodeLines.length || 0
    
    const anomalies = []
    if (avgCpuPercent > 70) {
      anomalies.push({
        type: 'warning',
        message: `CPU élevé sur platform-pool: ${avgCpuPercent.toFixed(1)}%`,
        severity: 'warning'
      })
    }
    
    // Vérification services critiques
    const runningPlatformPods = platformPodLines.filter(line => line.includes('Running')).length
    const totalPlatformPods = platformPodLines.length
    
    if (runningPlatformPods < totalPlatformPods) {
      anomalies.push({
        type: 'critical',
        message: `Services platform: ${runningPlatformPods}/${totalPlatformPods} opérationnels`,
        severity: 'critical'
      })
    }
    
    return {
      name: 'Platform Services',
      status: anomalies.some(a => a.severity === 'critical') ? 'critical' : 
              anomalies.length > 0 ? 'warning' : 'healthy',
      healthScore: Math.round((runningPlatformPods / totalPlatformPods) * 100),
      nodes: {
        total: nodeLines.length,
        avgCpuPercent: Math.round(avgCpuPercent)
      },
      services: {
        running: runningPlatformPods,
        total: totalPlatformPods,
        details: platformPodLines.slice(0, 5)
      },
      anomalies,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'Platform Services',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      lastCheck: new Date().toISOString()
    }
  }
}

async function getInfrastructureStatus() {
  try {
    // PVCs total cluster
    const { stdout: pvcs } = await execAsync(`kubectl get pvc --all-namespaces`)
    const pvcLines = pvcs.trim().split('\n').filter(line => line.length > 0 && !line.includes('NAMESPACE'))
    
    // Calcul stockage total
    const totalStorage = pvcLines.reduce((sum, line) => {
      const match = line.match(/(\d+)Gi/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)
    
    // Namespaces total
    const { stdout: namespaces } = await execAsync(`kubectl get namespaces | grep -v "NAME\\|kube\\|default" | wc -l`)
    const totalNamespaces = parseInt(namespaces.trim())
    
    // Détection anomalies stockage
    const anomalies = []
    
    if (totalStorage > 100) {
      const waste = Math.round(totalStorage * 0.63) // 63% estimé gaspillé selon analyse
      anomalies.push({
        type: 'critical',
        message: `Stockage surdimensionné: ${totalStorage}Gi total (~${waste}Gi gaspillés)`,
        severity: 'critical'
      })
    }
    
    if (totalNamespaces > 60) {
      anomalies.push({
        type: 'warning',
        message: `Trop de namespaces: ${totalNamespaces} (recommandé: <50)`,
        severity: 'warning'
      })
    }
    
    // Analyse PVCs les plus gros
    const bigPVCs = pvcLines
      .map(line => {
        const parts = line.split(/\s+/)
        const sizeMatch = line.match(/(\d+)Gi/)
        return {
          namespace: parts[0],
          name: parts[1],
          size: sizeMatch ? parseInt(sizeMatch[1]) : 0
        }
      })
      .filter(pvc => pvc.size > 5)
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
    
    return {
      name: 'Infrastructure & Monitoring',
      status: anomalies.some(a => a.severity === 'critical') ? 'critical' : 
              anomalies.length > 0 ? 'warning' : 'healthy',
      healthScore: Math.max(0, 100 - (anomalies.length * 25)),
      storage: {
        totalGi: totalStorage,
        pvcs: pvcLines.length,
        biggestPVCs: bigPVCs
      },
      namespaces: {
        total: totalNamespaces
      },
      anomalies,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'Infrastructure',
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      lastCheck: new Date().toISOString()
    }
  }
}

function calculateGlobalHealth(axes: any) {
  const axesList = Object.values(axes)
  const healthScores = axesList
    .filter((axe: any) => axe.healthScore !== undefined)
    .map((axe: any) => axe.healthScore)
  
  const avgHealth = healthScores.length > 0 
    ? healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length 
    : 0
  
  const criticalCount = axesList.filter((axe: any) => axe.status === 'critical').length
  const warningCount = axesList.filter((axe: any) => axe.status === 'warning').length
  
  return {
    score: Math.round(avgHealth),
    status: criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy',
    breakdown: {
      healthy: axesList.filter((axe: any) => axe.status === 'healthy').length,
      warning: warningCount,
      critical: criticalCount,
      error: axesList.filter((axe: any) => axe.status === 'error').length
    }
  }
}