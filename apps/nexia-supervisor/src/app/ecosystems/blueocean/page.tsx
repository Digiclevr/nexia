'use client'

import { 
  Globe,
  Activity,
  Server,
  Database,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  BarChart3
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function BlueOceanPage() {
  const { currentTime } = useCurrentTime()
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const queryClient = useQueryClient()
  
  // Fetch REAL BlueOcean 6-axes data
  const { data: blueOceanData, isLoading, error } = useQuery({
    queryKey: ['blueocean-status'],
    queryFn: async () => {
      const response = await fetch('/api/blueocean/status')
      if (!response.ok) throw new Error('Failed to fetch BlueOcean status')
      return response.json()
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Transform real data into display format
  const blueOceanServices = blueOceanData?.data ? [
    {
      id: 'onlyoneapi',
      name: 'OnlyOneAPI',
      description: 'SaaS B2B API Platform',
      status: blueOceanData.data.onlyoneapi.status,
      healthScore: blueOceanData.data.onlyoneapi.healthScore,
      pods: blueOceanData.data.onlyoneapi.pods,
      services: blueOceanData.data.onlyoneapi.services,
      anomalies: blueOceanData.data.onlyoneapi.anomalies || [],
      uptime: blueOceanData.data.onlyoneapi.uptime || 'N/A',
      lastCheck: blueOceanData.data.onlyoneapi.lastCheck
    },
    {
      id: 'kreach',
      name: 'KREACH (KONQER)',
      description: 'AI Market Intelligence',
      status: blueOceanData.data.kreach.status,
      healthScore: blueOceanData.data.kreach.healthScore,
      pods: blueOceanData.data.kreach.pods,
      namespaces: blueOceanData.data.kreach.namespaces,
      anomalies: blueOceanData.data.kreach.anomalies || [],
      lastCheck: blueOceanData.data.kreach.lastCheck
    },
    {
      id: 'kvibe',
      name: 'Kvibes',
      description: 'Social Marketing Automation',
      status: blueOceanData.data.kvibe.status,
      healthScore: blueOceanData.data.kvibe.healthScore,
      pods: blueOceanData.data.kvibe.pods,
      namespaces: blueOceanData.data.kvibe.namespaces,
      storage: blueOceanData.data.kvibe.storage,
      anomalies: blueOceanData.data.kvibe.anomalies || [],
      lastCheck: blueOceanData.data.kvibe.lastCheck
    },
    {
      id: 'nextstep',
      name: 'NEXTSTEP',
      description: 'Business Orchestration Platform',
      status: blueOceanData.data.nextstep.status,
      healthScore: blueOceanData.data.nextstep.healthScore,
      pods: blueOceanData.data.nextstep.pods,
      namespaces: blueOceanData.data.nextstep.namespaces,
      anomalies: blueOceanData.data.nextstep.anomalies || [],
      lastCheck: blueOceanData.data.nextstep.lastCheck
    },
    {
      id: 'platform',
      name: 'Platform Services',
      description: 'Infrastructure centrale',
      status: blueOceanData.data.platform.status,
      healthScore: blueOceanData.data.platform.healthScore,
      nodes: blueOceanData.data.platform.nodes,
      services: blueOceanData.data.platform.services,
      anomalies: blueOceanData.data.platform.anomalies || [],
      lastCheck: blueOceanData.data.platform.lastCheck
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure & Monitoring',
      description: 'Stockage et surveillance',
      status: blueOceanData.data.infrastructure.status,
      healthScore: blueOceanData.data.infrastructure.healthScore,
      storage: blueOceanData.data.infrastructure.storage,
      namespaces: blueOceanData.data.infrastructure.namespaces,
      anomalies: blueOceanData.data.infrastructure.anomalies || [],
      lastCheck: blueOceanData.data.infrastructure.lastCheck
    }
  ] : []

  const infrastructureMetrics = [
    {
      name: 'Cluster CPU',
      value: '52%',
      status: 'healthy',
      trend: '+2%',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: 'Cluster Memory',
      value: '68%',
      status: 'healthy',
      trend: '+5%',
      icon: <Database className="h-5 w-5" />
    },
    {
      name: 'Active Pods',
      value: '24',
      status: 'healthy',
      trend: '+1',
      icon: <Server className="h-5 w-5" />
    },
    {
      name: 'Network I/O',
      value: '145MB/s',
      status: 'healthy',
      trend: '+8%',
      icon: <Activity className="h-5 w-5" />
    },
    {
      name: 'Disk Usage',
      value: '76%',
      status: 'warning',
      trend: '+12%',
      icon: <Database className="h-5 w-5" />
    },
    {
      name: 'Load Balancer',
      value: '99.8%',
      status: 'healthy',
      trend: '0%',
      icon: <Globe className="h-5 w-5" />
    }
  ]

  const recentActivity = [
    {
      id: 1,
      timestamp: '14:25:33',
      event: 'KREACH deployment started',
      type: 'deployment',
      status: 'in_progress',
      details: 'v1.2.0-dev → v1.2.1-dev'
    },
    {
      id: 2,
      timestamp: '14:20:15',
      event: 'NEXTSTEP auto-scaled',
      type: 'scaling',
      status: 'success',
      details: '2 → 3 replicas'
    },
    {
      id: 3,
      timestamp: '14:18:44',
      event: 'High memory usage detected',
      type: 'alert',
      status: 'warning',
      details: 'KREACH pods > 80% memory'
    },
    {
      id: 4,
      timestamp: '14:15:22',
      event: 'Database backup completed',
      type: 'maintenance',
      status: 'success',
      details: 'postgres-central: 2.3GB'
    },
    {
      id: 5,
      timestamp: '14:12:10',
      event: 'SSL certificate renewed',
      type: 'security',
      status: 'success',
      details: '*.blueocean.local'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'unhealthy':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Opérationnel'
      case 'warning':
        return 'Attention'
      case 'unhealthy':
        return 'Défaillant'
      default:
        return 'Inconnu'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'deployment':
        return 'text-blue-600 bg-blue-100'
      case 'scaling':
        return 'text-green-600 bg-green-100'
      case 'alert':
        return 'text-yellow-600 bg-yellow-100'
      case 'maintenance':
        return 'text-purple-600 bg-purple-100'
      case 'security':
        return 'text-indigo-600 bg-indigo-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Globe className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">BlueOcean Ecosystem</h1>
              <p className="text-sm text-nexia-600">NEXTSTEP • NEXTGEN • KREACH • Kvibes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
            </div>
            <button 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['blueocean-status'] })
              }}
              className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50 disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Actualisation...' : 'Actualiser 6 Axes'}
            </button>
          </div>
        </div>
      </header>

      {/* Global Status - REAL DATA */}
      <div className={`rounded-lg p-6 mb-6 text-white ${
        blueOceanData?.globalHealth?.status === 'critical' ? 'bg-gradient-to-r from-red-600 to-red-700' :
        blueOceanData?.globalHealth?.status === 'warning' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
        'bg-gradient-to-r from-green-600 to-green-700'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">État Global BlueOcean - 6 Axes Stratégiques</h2>
            {isLoading ? (
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Analyse en cours...</span>
              </div>
            ) : blueOceanData?.globalHealth ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>{blueOceanData.globalHealth.breakdown.healthy} axes opérationnels</span>
                </div>
                {blueOceanData.globalHealth.breakdown.warning > 0 && (
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>{blueOceanData.globalHealth.breakdown.warning} en attention</span>
                  </div>
                )}
                {blueOceanData.globalHealth.breakdown.critical > 0 && (
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span>{blueOceanData.globalHealth.breakdown.critical} axes critiques</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  <span>6 axes surveillés</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                <span>Erreur récupération données</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {blueOceanData?.globalHealth?.score || '0'}%
            </p>
            <p className="text-sm opacity-90">Santé globale</p>
            {blueOceanData?.timestamp && (
              <p className="text-xs opacity-75 mt-1">
                MAJ: {new Date(blueOceanData.timestamp).toLocaleTimeString('fr-FR')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Infrastructure Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {infrastructureMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {metric.icon}
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.status === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-nexia-dark">{metric.value}</p>
              <p className="text-xs text-nexia-500">{metric.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {blueOceanServices.map((service) => (
          <div 
            key={service.id} 
            className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
              selectedService === service.id 
                ? 'border-blue-500 ring-2 ring-blue-500/20' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  {getStatusIcon(service.status)}
                  <h3 className="ml-2 text-lg font-semibold text-nexia-dark">{service.name}</h3>
                  {service.healthScore !== undefined && (
                    <span className="ml-2 text-sm font-medium text-nexia-600">
                      {service.healthScore}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-nexia-600 mb-2">{service.description}</p>
                <div className="flex items-center space-x-4 text-xs text-nexia-500">
                  {service.pods && (
                    <span>{service.pods.running}/{service.pods.total} pods</span>
                  )}
                  {service.namespaces && (
                    <span>{service.namespaces.total} namespaces</span>
                  )}
                  {service.nodes && (
                    <span>{service.nodes.total} nodes</span>
                  )}
                  {service.uptime && <span>Uptime {service.uptime}</span>}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {getStatusText(service.status)}
              </span>
            </div>
            
            {/* Anomalies Detection - REAL TIME */}
            {service.anomalies && service.anomalies.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                  Anomalies Détectées ({service.anomalies.length})
                </h4>
                <div className="space-y-1">
                  {service.anomalies.slice(0, 3).map((anomaly: any, idx: number) => (
                    <div key={idx} className={`text-xs p-2 rounded flex items-start ${
                      anomaly.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      anomaly.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      <span className="font-medium mr-1">
                        {anomaly.severity === 'critical' ? '🚨' : 
                         anomaly.severity === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <span>{anomaly.message}</span>
                    </div>
                  ))}
                  {service.anomalies.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{service.anomalies.length - 3} autres anomalies...
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Infrastructure</p>
                <div className="mt-1 space-y-1">
                  {service.pods && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm">Pods Running</span>
                        <span className="text-sm font-medium">{service.pods.running}/{service.pods.total}</span>
                      </div>
                      {service.pods.failed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-red-600">Pods Failed</span>
                          <span className="text-sm font-medium text-red-600">{service.pods.failed}</span>
                        </div>
                      )}
                    </>
                  )}
                  {service.services && (
                    <div className="flex justify-between">
                      <span className="text-sm">Services</span>
                      <span className="text-sm font-medium">{service.services.total}</span>
                    </div>
                  )}
                  {service.nodes && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm">Nodes</span>
                        <span className="text-sm font-medium">{service.nodes.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg CPU</span>
                        <span className="text-sm font-medium">{service.nodes.avgCpuPercent}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Resources</p>
                <div className="mt-1 space-y-1">
                  {service.namespaces && (
                    <div className="flex justify-between">
                      <span className="text-sm">Namespaces</span>
                      <span className="text-sm font-medium">{service.namespaces.total}</span>
                    </div>
                  )}
                  {service.storage && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm">Storage</span>
                        <span className="text-sm font-medium">{service.storage.totalGi}Gi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">PVCs</span>
                        <span className="text-sm font-medium">{service.storage.pvcs}</span>
                      </div>
                    </>
                  )}
                  {service.healthScore !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm">Health Score</span>
                      <span className={`text-sm font-medium ${
                        service.healthScore >= 90 ? 'text-green-600' :
                        service.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {service.healthScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-nexia-500">
                  Axe: {service.name} ({service.id})
                </span>
                <span className="text-nexia-400">
                  {service.lastCheck ? 
                    `MAJ: ${new Date(service.lastCheck).toLocaleTimeString('fr-FR')}` :
                    'Dernière vérification: N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nexia-dark">Activité Récente</h2>
          <button className="flex items-center px-3 py-1 text-sm text-nexia-600 hover:text-nexia-800">
            <Eye className="h-4 w-4 mr-1" />
            Voir tout
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0 mt-1">
                {getEventStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-nexia-dark">{activity.event}</p>
                  <span className="text-xs text-nexia-500">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-nexia-600 mt-1">{activity.details}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(activity.type)}`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}