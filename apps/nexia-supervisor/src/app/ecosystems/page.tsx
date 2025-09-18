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
  Shield
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function EcosystemsPage() {
  const { currentTime } = useCurrentTime()
  
  // Fetch ecosystem health
  const { data: ecosystemHealth, isLoading } = useQuery({
    queryKey: ['ecosystem-health'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 10000,
    retry: 3,
    retryDelay: 1000
  });

  const health = ecosystemHealth?.data || {};

  const ecosystems = [
    {
      name: 'BlueOcean',
      status: (health as any)?.blueocean || 'unknown',
      description: 'NEXTSTEP, NEXTGEN, KREACH, KVIBE',
      url: 'nextstep-api.nextstep.svc.cluster.local',
      services: 15,
      uptime: '99.2%',
      lastCheck: '2 min ago',
      icon: <Globe className="h-8 w-8" />,
      color: 'blue'
    },
    {
      name: 'OnlyOneAPI',
      status: (health as any)?.onlyoneapi || 'unknown',
      description: 'SaaS B2B Platform - 4 sites web',
      url: 'api.onlyoneapi.com',
      services: 8,
      uptime: '99.8%',
      lastCheck: '1 min ago',
      icon: <Server className="h-8 w-8" />,
      color: 'green'
    },
    {
      name: 'Business-Automation',
      status: (health as any)?.business_automation || 'unknown',
      description: 'Agents autonomes 24/7',
      url: 'business-automation.platform.svc.cluster.local',
      services: 12,
      uptime: '98.5%',
      lastCheck: '3 min ago',
      icon: <Activity className="h-8 w-8" />,
      color: 'purple'
    },
    {
      name: 'Claude Code 24/7',
      status: (health as any)?.claude_code || 'unknown',
      description: 'Agent Claude supervision technique',
      url: 'claude-agent.nexia.local',
      services: 3,
      uptime: '99.9%',
      lastCheck: '30s ago',
      icon: <Shield className="h-8 w-8" />,
      color: 'orange'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'unhealthy': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Opérationnel'
      case 'warning': return 'Alerte'
      case 'unhealthy': return 'Défaillant'
      default: return 'Inconnu'
    }
  }

  const handleRefreshEcosystems = () => {
    alert('🔄 Actualisation des écosystèmes - Vérification status: BlueOcean, OnlyOneAPI, Business-Automation, Claude Code')
  }

  return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
              <div className="flex items-center">
                <Globe className="h-6 w-6 text-nexia-primary mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-nexia-dark">Supervision Écosystèmes</h1>
                  <p className="text-sm text-nexia-600">Monitoring en temps réel de tous les écosystèmes supervisés</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
                  <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
                </div>
                <button 
                  onClick={handleRefreshEcosystems}
                  className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50"
                >
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
                  <p className="text-sm font-medium text-gray-600">Écosystèmes Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Services Totaux</p>
                  <p className="text-2xl font-bold text-gray-900">38</p>
                </div>
                <Server className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">99.4%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertes Actives</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Ecosystems Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ecosystems.map((ecosystem, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg bg-${ecosystem.color}-100 mr-4`}>
                      {ecosystem.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{ecosystem.name}</h3>
                      <p className="text-sm text-gray-500">{ecosystem.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ecosystem.status)}`}>
                    {getStatusText(ecosystem.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Services</p>
                    <p className="text-lg font-semibold text-gray-900">{ecosystem.services}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Uptime</p>
                    <p className="text-lg font-semibold text-green-600">{ecosystem.uptime}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">URL: {ecosystem.url}</span>
                    <span className="text-gray-400">Vérifié {ecosystem.lastCheck}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
    </div>
  )
}