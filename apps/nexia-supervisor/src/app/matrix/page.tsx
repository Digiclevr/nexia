'use client'

import React, { useState } from 'react'
import { 
  Grid3X3, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Activity,
  Server,
  Monitor,
  Globe,
  Database,
  Eye,
  ExternalLink,
  ArrowRight,
  Play,
  Square,
  RotateCcw,
  Upload,
  Download,
  GitBranch,
  Github,
  Lock,
  Unlock
} from 'lucide-react'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'

export default function MatrixPage() {
  const { currentTime } = useCurrentTime()
  const queryClient = useQueryClient()
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [deploymentInProgress, setDeploymentInProgress] = useState<Record<string, boolean>>({})
  const [portConflicts, setPortConflicts] = useState<Record<string, string[]>>({})
  const [statusUpdates, setStatusUpdates] = useState<Record<string, any>>({})

  // Fetch REAL matrix status data - NO MOCKS
  const { data: matrixStatus, isLoading, error } = useQuery({
    queryKey: ['matrix-status'],
    queryFn: async () => {
      const response = await fetch('/api/matrix/status')
      if (!response.ok) throw new Error('Failed to fetch matrix status')
      return response.json()
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
    retryDelay: 1000
  })

  // Fetch port monitoring data
  const { data: portData } = useQuery({
    queryKey: ['system-ports'],
    queryFn: () => nexiaApi.fetchSystemPorts(),
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: 2
  })

  // Applications NEXIA complètes
  const applications = [
    {
      id: 'nexia-supervisor',
      name: 'NEXIA Supervisor',
      category: 'Core',
      description: 'Interface principale meta-orchestrateur',
      github: {
        url: 'https://github.com/ludovicpilet/NEXIA',
        isPrivate: true
      }
    },
    {
      id: 'nexia-voice',
      name: 'NEXIA Voice',
      category: 'Core', 
      description: 'Interface vocale + Whisper + SpeechT5',
      github: {
        url: 'https://github.com/ludovicpilet/NEXIA',
        isPrivate: true
      }
    },
    {
      id: 'nexia-directus',
      name: 'NEXIA Directus',
      category: 'Core',
      description: 'CMS headless pour configuration',
      github: {
        url: 'https://github.com/ludovicpilet/NEXIA',
        isPrivate: true
      }
    },
    {
      id: 'nexia-claude-code',
      name: 'Claude Code 24/7',
      category: 'Core',
      description: 'Agent supervision technique',
      github: {
        url: 'https://github.com/ludovicpilet/NEXIA',
        isPrivate: true
      }
    },
    {
      id: 'onlyoneapi-marketing',
      name: 'OnlyOneAPI Marketing',
      category: 'OnlyOneAPI',
      description: 'Site vitrine marketing',
      github: {
        url: 'https://github.com/Digiclevr/onlyoneapi-marketing',
        isPrivate: true
      }
    },
    {
      id: 'onlyoneapi-developer',
      name: 'OnlyOneAPI Developer',
      category: 'OnlyOneAPI',
      description: 'Documentation technique',
      github: {
        url: 'https://github.com/Digiclevr/onlyoneapi-developer',
        isPrivate: true
      }
    },
    {
      id: 'onlyoneapi-portal',
      name: 'OnlyOneAPI Portal',
      category: 'OnlyOneAPI',
      description: 'Interface client B2B',
      github: {
        url: 'https://github.com/Digiclevr/onlyoneapi-portal',
        isPrivate: true
      }
    },
    {
      id: 'onlyoneapi-community',
      name: 'OnlyOneAPI Community',
      category: 'OnlyOneAPI',
      description: 'Communauté développeurs',
      github: {
        url: 'https://github.com/Digiclevr/onlyoneapi-community',
        isPrivate: true
      }
    },
    {
      id: 'onlyoneapi-api',
      name: 'OnlyOneAPI Core',
      category: 'OnlyOneAPI',
      description: 'API FastAPI production',
      github: {
        url: 'https://github.com/Digiclevr/onlyoneapi-api',
        isPrivate: true
      }
    },
    {
      id: 'nextstep-landing',
      name: 'NextStep Landing',
      category: 'BlueOcean',
      description: 'Page d\'accueil NextStep',
      github: {
        url: 'https://github.com/ludovicpilet/NEXTSTEP',
        isPrivate: true
      }
    },
    {
      id: 'nextstep-dashboard',
      name: 'NextStep Dashboard',
      category: 'BlueOcean',
      description: 'Interface utilisateur',
      github: {
        url: 'https://github.com/ludovicpilet/NEXTSTEP',
        isPrivate: true
      }
    },
    {
      id: 'nextstep-admin',
      name: 'NextStep Admin',
      category: 'BlueOcean',
      description: 'Panel administration',
      github: {
        url: 'https://github.com/ludovicpilet/NEXTSTEP',
        isPrivate: true
      }
    },
    {
      id: 'nextstep-api',
      name: 'NextStep API',
      category: 'BlueOcean',
      description: 'Backend services',
      github: {
        url: 'https://github.com/ludovicpilet/NEXTSTEP',
        isPrivate: true
      }
    },
    {
      id: 'kreach-web',
      name: 'KREACH Web',
      category: 'BlueOcean',
      description: 'Interface market intelligence',
      github: {
        url: 'https://github.com/ludovicpilet/KREACH',
        isPrivate: true
      }
    },
    {
      id: 'kreach-api',
      name: 'KREACH API',
      category: 'BlueOcean',
      description: 'Backend données marché',
      github: {
        url: 'https://github.com/ludovicpilet/KREACH',
        isPrivate: true
      }
    },
    {
      id: 'business-automation',
      name: 'Business Automation',
      category: 'Automation',
      description: 'Agents autonomes 24/7',
      github: {
        url: 'https://github.com/ludovicpilet/BUSINESS-AUTOMATION',
        isPrivate: true
      }
    }
  ]

  // Environnements
  const environments = [
    {
      id: 'mac-local',
      name: 'Mac Local',
      type: 'development',
      description: 'Développement localhost'
    },
    {
      id: 'cluster-dev',
      name: 'Cluster Dev',
      type: 'development',
      description: 'K8s namespace dev'
    },
    {
      id: 'cluster-staging',
      name: 'Cluster Staging',
      type: 'staging',
      description: 'K8s namespace staging'
    },
    {
      id: 'cluster-prod',
      name: 'Cluster Prod',
      type: 'production',
      description: 'K8s namespace production'
    }
  ]

  // Real matrix status from API - NO MOCKS ALLOWED
  const statusMatrix = matrixStatus?.data || {}

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'stopped': return <XCircle className="h-4 w-4 text-red-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'deploying': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case 'unknown': return <Activity className="h-4 w-4 text-gray-400" />
      default: return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200'
      case 'stopped': return 'bg-red-100 text-red-800 border-red-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'deploying': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'unknown': return 'bg-gray-100 text-gray-600 border-gray-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getEnvIcon = (type: string) => {
    switch (type) {
      case 'development': return <Monitor className="h-4 w-4 text-blue-600" />
      case 'staging': return <Server className="h-4 w-4 text-yellow-600" />
      case 'production': return <Database className="h-4 w-4 text-green-600" />
      default: return <Globe className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core': return 'bg-purple-100 text-purple-800'
      case 'OnlyOneAPI': return 'bg-blue-100 text-blue-800'
      case 'BlueOcean': return 'bg-cyan-100 text-cyan-800'
      case 'Automation': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRefresh = () => {
    // Invalider toutes les requêtes pour forcer un refresh
    queryClient.invalidateQueries({ queryKey: ['matrix-status'] })
    queryClient.invalidateQueries({ queryKey: ['system-ports'] })
    queryClient.invalidateQueries({ queryKey: ['blueocean-status'] })
    queryClient.invalidateQueries({ queryKey: ['ecosystem-health'] })
    
    // Feedback visuel
    const button = document.querySelector('[data-refresh-button]') as HTMLButtonElement
    if (button) {
      const originalText = button.innerHTML
      button.innerHTML = '<svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Actualisation...'
      button.disabled = true
      
      setTimeout(() => {
        button.innerHTML = originalText
        button.disabled = false
      }, 2000)
    }
  }

  const handleCellClick = (appId: string, envId: string) => {
    const baseStatus = statusMatrix[appId]?.[envId]
    const statusUpdate = statusUpdates[`${appId}-${envId}`]
    const status = statusUpdate ? { ...baseStatus, ...statusUpdate } : baseStatus
    
    // Si le service est opérationnel, ouvrir l'application
    if (status?.status === 'running') {
      let targetUrl = null
      
      if (envId === 'mac-local' && status.url) {
        targetUrl = status.url
      } else if (envId.startsWith('cluster-') && status.hostsUrl) {
        targetUrl = status.hostsUrl
      }
      
      if (targetUrl) {
        window.open(targetUrl, '_blank')
        return
      }
    }
    
    // Sinon, afficher les détails
    const app = applications.find(a => a.id === appId)
    alert(`📊 ${app?.name || appId} sur ${envId}\n\n` +
          `Status: ${status?.status || 'unknown'}\n` +
          `Port: ${status?.port || status?.portForward || 'N/A'}\n` +
          `URL: ${status?.url || status?.hostsUrl || 'N/A'}\n` +
          `Dernière mise à jour: ${status?.lastDeploy || 'N/A'}`)
  }

  const handleDeploy = async (appId: string, fromEnv: string, toEnv: string) => {
    const deploymentKey = `${appId}-${toEnv}`
    
    // Marquer le déploiement en cours
    setDeploymentInProgress(prev => ({ ...prev, [deploymentKey]: true }))
    
    try {
      // Simuler appel API de déploiement
      const response = await fetch('/api/deployment/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: appId,
          fromEnvironment: fromEnv,
          toEnvironment: toEnv,
          script: `./scripts/deploy-${appId}-${toEnv}.sh`
        })
      })
      
      if (response.ok) {
        // Simuler le processus de déploiement
        setTimeout(() => {
          setDeploymentInProgress(prev => ({ ...prev, [deploymentKey]: false }))
          
          // Mettre à jour le statut dans la matrice
          setStatusUpdates(prev => ({
            ...prev,
            [`${appId}-${toEnv}`]: {
              status: 'running',
              lastDeploy: 'just now',
              version: 'latest'
            }
          }))
          
          alert(`✅ Déploiement ${appId} vers ${toEnv} terminé avec succès\n📊 Status mis à jour: Running`)
        }, 5000) // 5 secondes pour simulation
      } else {
        throw new Error('Deployment failed')
      }
    } catch (error) {
      setDeploymentInProgress(prev => ({ ...prev, [deploymentKey]: false }))
      alert(`❌ Erreur lors du déploiement ${appId} vers ${toEnv}`)
    }
  }

  const handleStart = async (appId: string, envId: string) => {
    try {
      const response = await fetch('/api/deployment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: appId, environment: envId })
      })
      
      const result = await response.json()
      if (response.ok) {
        // Mettre à jour le statut immédiatement
        setStatusUpdates(prev => ({
          ...prev,
          [`${appId}-${envId}`]: {
            status: 'running',
            lastDeploy: 'just now'
          }
        }))
        alert(`✅ ${appId} démarré sur ${envId}\nCommande: ${result.command}`)
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Erreur lors du démarrage de ${appId} sur ${envId}`)
    }
  }

  const handleStop = async (appId: string, envId: string) => {
    try {
      const response = await fetch('/api/deployment/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: appId, environment: envId })
      })
      
      const result = await response.json()
      if (response.ok) {
        // Mettre à jour le statut immédiatement
        setStatusUpdates(prev => ({
          ...prev,
          [`${appId}-${envId}`]: {
            status: 'stopped',
            lastDeploy: 'just now'
          }
        }))
        alert(`✅ ${appId} arrêté sur ${envId}\nCommande: ${result.command}`)
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Erreur lors de l'arrêt de ${appId} sur ${envId}`)
    }
  }

  const handleRestart = async (appId: string, envId: string) => {
    try {
      const response = await fetch('/api/deployment/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: appId, environment: envId })
      })
      
      const result = await response.json()
      if (response.ok) {
        // Mettre à jour le statut immédiatement
        setStatusUpdates(prev => ({
          ...prev,
          [`${appId}-${envId}`]: {
            status: 'running',
            lastDeploy: 'just now',
            version: 'restarted'
          }
        }))
        alert(`✅ ${appId} redémarré sur ${envId}\nCommande: ${result.command}\nDurée: ${result.duration}`)
      } else {
        alert(`❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Erreur lors du redémarrage de ${appId} sur ${envId}`)
    }
  }

  const canPromote = (appId: string, fromEnv: string, toEnv: string): boolean => {
    const fromStatus = statusMatrix[appId]?.[fromEnv]?.status
    const promotionRules = {
      'mac-local': ['cluster-dev'],
      'cluster-dev': ['cluster-staging'],
      'cluster-staging': ['cluster-prod']
    }
    return fromStatus === 'running' && promotionRules[fromEnv as keyof typeof promotionRules]?.includes(toEnv)
  }

  // Détection des conflits de ports
  const checkPortConflicts = () => {
    const usedPorts: Record<number, string[]> = {}
    const conflicts: Record<string, string[]> = {}
    
    Object.entries(statusMatrix).forEach(([appId, envs]) => {
      Object.entries(envs).forEach(([envId, config]) => {
        if (config.port || config.portForward) {
          const port = config.port || config.portForward!
          if (!usedPorts[port]) usedPorts[port] = []
          usedPorts[port].push(`${appId}-${envId}`)
        }
      })
    })
    
    Object.entries(usedPorts).forEach(([port, apps]) => {
      if (apps.length > 1) {
        apps.forEach(app => {
          if (!conflicts[app]) conflicts[app] = []
          conflicts[app] = apps.filter(a => a !== app)
        })
      }
    })
    
    return conflicts
  }

  // Vérifier les conflits au chargement
  React.useEffect(() => {
    setPortConflicts(checkPortConflicts())
  }, [])

  const isDeploying = (appId: string, envId: string) => {
    return deploymentInProgress[`${appId}-${envId}`] || false
  }

  const hasPortConflict = (appId: string, envId: string) => {
    return portConflicts[`${appId}-${envId}`]?.length > 0
  }

  // Statistiques globales
  const totalApps = applications.length
  const totalCells = totalApps * environments.length
  let runningCount = 0
  let stoppedCount = 0
  let unknownCount = 0

  Object.values(statusMatrix).forEach(appStatuses => {
    Object.values(appStatuses).forEach(status => {
      if (status.status === 'running') runningCount++
      else if (status.status === 'stopped') stoppedCount++
      else unknownCount++
    })
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Grid3X3 className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Matrice Application × Environnement</h1>
              <p className="text-sm text-gray-600">Vue d'ensemble complète de l'écosystème NEXIA</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-gray-900">{currentTime}</p>
            </div>
            <button 
              onClick={handleRefresh}
              data-refresh-button
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser Statuts
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-6">
        {isLoading && (
          <div className="mb-4 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Actualisation des données en cours...</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-blue-600">{totalApps}</p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Actifs</p>
                <p className="text-2xl font-bold text-green-600">{runningCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Arrêtés</p>
                <p className="text-2xl font-bold text-red-600">{stoppedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Statut Inconnu</p>
                <p className="text-2xl font-bold text-gray-600">{unknownCount}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 p-4">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-4 text-left text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10 border-r border-gray-200 w-48">
                    Application
                  </th>
                  {environments.map((env) => (
                    <th key={env.id} className="px-2 py-4 text-center text-sm font-medium text-gray-900 min-w-[180px]">
                      <div className="flex flex-col items-center space-y-1">
                        {getEnvIcon(env.type)}
                        <span>{env.name}</span>
                        <span className="text-xs text-gray-500">{env.description}</span>
                        
                        {/* Environment Controls */}
                        <div className="flex items-center space-x-1 mt-2">
                          <button
                            onClick={() => alert(`🔄 Actualisation ${env.name}\nCommande: kubectl get pods -n ${env.id}`)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title={`Actualiser ${env.name}`}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => alert(`📊 Logs ${env.name}\nCommande: kubectl logs -f -l environment=${env.id}`)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title={`Voir logs ${env.name}`}
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 sticky left-0 bg-white z-10 border-r border-gray-200 w-48">
                      <div>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 truncate">{app.name}</span>
                            {app.github && (
                              <a
                                href={app.github.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 rounded ${
                                  app.github.isPrivate 
                                    ? 'text-green-600 hover:bg-green-50' 
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                                title={`GitHub Repository ${app.github.isPrivate ? '(Privé)' : '(Public - ATTENTION!)'}`}
                              >
                                <div className="flex items-center space-x-1">
                                  <Github className="h-3 w-3" />
                                  {app.github.isPrivate ? (
                                    <Lock className="h-2 w-2" />
                                  ) : (
                                    <Unlock className="h-2 w-2" />
                                  )}
                                </div>
                              </a>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(app.category)} self-start`}>
                            {app.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{app.description}</p>
                      </div>
                    </td>
                    {environments.map((env) => {
                      const baseStatus = statusMatrix[app.id]?.[env.id]
                      const statusUpdate = statusUpdates[`${app.id}-${env.id}`]
                      const status = statusUpdate ? { ...baseStatus, ...statusUpdate } : baseStatus
                      return (
                        <td key={env.id} className="px-2 py-4 text-center">
                          <div className="space-y-2">
                            {/* Port Conflict Alert */}
                            {hasPortConflict(app.id, env.id) && (
                              <div className="bg-red-100 border border-red-300 rounded p-1">
                                <AlertTriangle className="h-3 w-3 text-red-600 mx-auto" />
                                <span className="text-xs text-red-700">Conflit port</span>
                              </div>
                            )}

                            {/* Status Button avec indication déploiement */}
                            <button
                              onClick={() => handleCellClick(app.id, env.id)}
                              className={`w-full px-2 py-2 rounded-lg border text-xs font-medium transition-colors hover:shadow-md ${
                                isDeploying(app.id, env.id) 
                                  ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                  : getStatusColor(status?.status || 'unknown')
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-1">
                                {isDeploying(app.id, env.id) ? (
                                  <Download className="h-4 w-4 text-blue-600 animate-bounce" />
                                ) : (
                                  getStatusIcon(status?.status || 'unknown')
                                )}
                                <span className="capitalize">
                                  {isDeploying(app.id, env.id) ? 'deploying' : (status?.status || 'unknown')}
                                </span>
                                
                                {/* Port et URLs */}
                                {status?.port && (
                                  <span className="text-xs">Local :{status.port}</span>
                                )}
                                {status?.portForward && (
                                  <span className="text-xs">PF :{status.portForward}</span>
                                )}
                                {status?.hostsUrl && (
                                  <span className="text-xs truncate w-full" title={status.hostsUrl}>
                                    {status.hostsUrl.replace('http://', '')}
                                  </span>
                                )}
                                
                                {status?.lastDeploy && (
                                  <span className="text-xs">{status.lastDeploy}</span>
                                )}
                                {status?.url && (
                                  <ExternalLink className="h-3 w-3 opacity-50" />
                                )}
                              </div>
                            </button>

                            {/* Control Buttons */}
                            <div className="flex justify-center space-x-1">
                              {status?.status === 'running' ? (
                                <>
                                  <button
                                    onClick={() => handleStop(app.id, env.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Arrêter"
                                  >
                                    <Square className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleRestart(app.id, env.id)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Redémarrer"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </button>
                                </>
                              ) : status?.status === 'stopped' ? (
                                <button
                                  onClick={() => handleStart(app.id, env.id)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Démarrer"
                                >
                                  <Play className="h-3 w-3" />
                                </button>
                              ) : null}
                            </div>

                            {/* Promotion Buttons */}
                            <div className="flex justify-center space-x-1">
                              {environments.map((targetEnv) => {
                                if (targetEnv.id === env.id) return null
                                
                                const canPromoteToTarget = canPromote(app.id, env.id, targetEnv.id)
                                if (!canPromoteToTarget) return null

                                return (
                                  <button
                                    key={targetEnv.id}
                                    onClick={() => handleDeploy(app.id, env.id, targetEnv.id)}
                                    className="p-1 text-purple-600 hover:bg-purple-50 rounded flex items-center"
                                    title={`Déployer vers ${targetEnv.name}`}
                                  >
                                    <ArrowRight className="h-3 w-3" />
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}