'use client'

import { 
  Globe, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Server,
  Users,
  TrendingUp,
  Database,
  Shield,
  XCircle,
  Zap,
  Bell
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function AlertsPage() {
  const { currentTime } = useCurrentTime()
  
  // Fetch alerts data
  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['alerts-data'],
    queryFn: () => nexiaApi.fetchActiveAlerts(),
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000
  });

  const alerts = alertsData?.data || {};

  const activeAlerts = [
    {
      id: 'ALERT-001',
      title: 'Latence élevée - OnlyOneAPI',
      description: 'Temps de réponse API > 2000ms détecté',
      severity: 'warning',
      ecosystem: 'OnlyOneAPI',
      timestamp: '2024-12-15 14:23:45',
      duration: '12 min',
      status: 'active',
      source: 'api.onlyoneapi.com'
    },
    {
      id: 'ALERT-002',
      title: 'Mémoire critique - Business-Automation',
      description: 'Utilisation mémoire > 85% sur agent principal',
      severity: 'critical',
      ecosystem: 'Business-Automation',
      timestamp: '2024-12-15 14:18:12',
      duration: '17 min',
      status: 'active',
      source: 'business-automation.platform.svc.cluster.local'
    },
    {
      id: 'ALERT-003',
      title: 'Connexion base de données instable',
      description: 'Timeouts intermittents PostgreSQL',
      severity: 'warning',
      ecosystem: 'BlueOcean',
      timestamp: '2024-12-15 14:15:33',
      duration: '20 min',
      status: 'investigating',
      source: 'postgres-central.platform.svc.cluster.local'
    }
  ]

  const resolvedAlerts = [
    {
      id: 'ALERT-004',
      title: 'Surcharge CPU - NEXTSTEP',
      description: 'CPU > 80% résolu par redémarrage',
      severity: 'warning',
      ecosystem: 'BlueOcean',
      timestamp: '2024-12-15 13:45:22',
      resolvedAt: '2024-12-15 14:02:15',
      duration: '17 min',
      status: 'resolved',
      source: 'nextstep-api.nextstep.svc.cluster.local'
    },
    {
      id: 'ALERT-005',
      title: 'Service indisponible - Claude Code',
      description: 'Agent Claude supervision technique offline',
      severity: 'critical',
      ecosystem: 'Claude Code 24/7',
      timestamp: '2024-12-15 12:30:18',
      resolvedAt: '2024-12-15 12:45:33',
      duration: '15 min',
      status: 'resolved',
      source: 'claude-agent.nexia.local'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'info': return <Bell className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100'
      case 'investigating': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'investigating': return 'En cours'
      case 'resolved': return 'Résolu'
      default: return 'Inconnu'
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation - NEXTSTEP Style */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 px-6 bg-nexia-gradient">
            <Globe className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-lg font-bold text-white">NEXIA</h1>
              <p className="text-xs text-nexia-100">Meta-Orchestrateur</p>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <h3 className="px-2 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Vue d'Ensemble</h3>
            <a href="/" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Activity className="mr-3 h-4 w-4" />
              Dashboard Principal
            </a>
            
            <h3 className="px-2 mt-6 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Supervision</h3>
            <a href="/ecosystems" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Globe className="mr-3 h-4 w-4" />
              Écosystèmes
            </a>
            <a href="/alerts" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-primary bg-nexia-50 rounded-md">
              <AlertTriangle className="mr-3 h-4 w-4" />
              Alertes & Incidents
            </a>
            <a href="/performance" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <TrendingUp className="mr-3 h-4 w-4" />
              Performance
            </a>
            
            <h3 className="px-2 mt-6 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Opérations</h3>
            <a href="/voice" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Users className="mr-3 h-4 w-4" />
              Interface Vocale
            </a>
          </nav>
          
          <div className="flex-shrink-0 px-4 py-4 border-t border-nexia-200">
            <div className="text-xs text-nexia-500">
              <p className="font-medium">NEXIA v2.0.0</p>
              <p>Supervision 24/7 Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-nexia-primary mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-nexia-dark">Alertes & Incidents</h1>
                  <p className="text-sm text-nexia-600">Monitoring en temps réel des incidents et alertes système</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
                  <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
                </div>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50">
                  <Activity className="h-4 w-4 mr-2" />
                  Actualiser
                </button>
              </div>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertes Actives</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critiques</p>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Résolues Aujourd'hui</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temps Résolution Moyen</p>
                  <p className="text-2xl font-bold text-nexia-primary">14 min</p>
                </div>
                <Clock className="h-8 w-8 text-nexia-primary" />
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-nexia-dark">Alertes Actives</h2>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                {activeAlerts.length} alertes
              </span>
            </div>
            
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-semibold text-nexia-dark mr-3">{alert.title}</h3>
                          <span className="text-xs text-nexia-500">#{alert.id}</span>
                        </div>
                        <p className="text-sm text-nexia-600 mb-2">{alert.description}</p>
                        <div className="flex items-center text-xs text-nexia-500 space-x-4">
                          <span>🏢 {alert.ecosystem}</span>
                          <span>🔗 {alert.source}</span>
                          <span>⏰ {alert.timestamp}</span>
                          <span>⌛ Durée: {alert.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {getStatusText(alert.status)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-nexia-primary text-white text-xs rounded hover:bg-nexia-secondary">
                      Investiguer
                    </button>
                    <button className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded hover:bg-green-200">
                      Résoudre
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Resolved Alerts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-nexia-dark">Alertes Récemment Résolues</h2>
              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                {resolvedAlerts.length} résolues
              </span>
            </div>
            
            <div className="space-y-4">
              {resolvedAlerts.map((alert) => (
                <div key={alert.id} className="bg-white border border-gray-200 rounded-lg p-6 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="p-2 rounded-lg mr-4 bg-green-100 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-semibold text-nexia-dark mr-3">{alert.title}</h3>
                          <span className="text-xs text-nexia-500">#{alert.id}</span>
                        </div>
                        <p className="text-sm text-nexia-600 mb-2">{alert.description}</p>
                        <div className="flex items-center text-xs text-nexia-500 space-x-4">
                          <span>🏢 {alert.ecosystem}</span>
                          <span>🔗 {alert.source}</span>
                          <span>📅 Détecté: {alert.timestamp}</span>
                          <span>✅ Résolu: {alert.resolvedAt}</span>
                          <span>⌛ Durée: {alert.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        RÉSOLU
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}