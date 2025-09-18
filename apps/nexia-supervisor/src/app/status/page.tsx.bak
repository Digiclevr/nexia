'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Server,
  Database,
  Globe,
  Users,
  Brain,
  Wifi,
  HardDrive,
  Cpu,
  RefreshCw
} from 'lucide-react'

export default function StatusPage() {
  const { currentTime } = useCurrentTime()

  // Fetch ecosystem status
  const { data: ecosystemHealth, isLoading } = useQuery({
    queryKey: ['ecosystem-health'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000
  });

  const health = ecosystemHealth?.data || {};

  const ecosystemsStatus = [
    {
      name: 'BlueOcean',
      status: health.blueocean || 'unknown',
      description: 'NEXTSTEP, NEXTGEN, KREACH, KVIBE',
      url: 'nextstep-api.nextstep.svc.cluster.local',
      services: 15,
      uptime: '99.2%',
      lastCheck: '30s ago',
      icon: <Globe className="h-6 w-6" />,
      color: 'blue'
    },
    {
      name: 'OnlyOneAPI',
      status: health.onlyoneapi || 'unknown',
      description: 'SaaS B2B Platform - 4 sites web',
      url: 'api.onlyoneapi.com',
      services: 8,
      uptime: '99.8%',
      lastCheck: '15s ago',
      icon: <Server className="h-6 w-6" />,
      color: 'green'
    },
    {
      name: 'Business-Automation',
      status: health.business_automation || 'unknown',
      description: 'Agents autonomes 24/7',
      url: 'business-automation.platform.svc.cluster.local',
      services: 12,
      uptime: '98.5%',
      lastCheck: '45s ago',
      icon: <Users className="h-6 w-6" />,
      color: 'purple'
    },
    {
      name: 'Claude Code 24/7',
      status: health.claude_code || 'unknown',
      description: 'Agent Claude supervision technique',
      url: 'claude-agent.nexia.local',
      services: 3,
      uptime: '99.9%',
      lastCheck: '10s ago',
      icon: <Brain className="h-6 w-6" />,
      color: 'orange'
    }
  ]

  const systemMetrics = [
    { name: 'Infrastructure Kubernetes', status: 'healthy', value: '99.7%', icon: <Server className="h-5 w-5" /> },
    { name: 'Base de Données', status: 'healthy', value: '99.9%', icon: <Database className="h-5 w-5" /> },
    { name: 'Réseau Interne', status: 'healthy', value: '99.8%', icon: <Wifi className="h-5 w-5" /> },
    { name: 'Stockage Cluster', status: 'warning', value: '85.2%', icon: <HardDrive className="h-5 w-5" /> },
    { name: 'CPU Cluster', status: 'healthy', value: '65.1%', icon: <Cpu className="h-5 w-5" /> },
    { name: 'API Gateway', status: 'healthy', value: '99.6%', icon: <Activity className="h-5 w-5" /> }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'unhealthy': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'unhealthy': return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Compact */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-2 lg:px-4 py-2">
          <div className="flex items-center min-w-0">
            <Activity className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 mr-2" />
            <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-semibold text-gray-900 truncate">Status Écosystème</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{currentTime}</p>
            </div>
            <button className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
              <RefreshCw className="h-3 w-3 mr-1 inline" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - No Scroll Layout */}
      <div className="flex-1 overflow-hidden p-2 lg:p-3">
        
        {/* Global Status + Ecosystems */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2 h-1/3">
          
          {/* Global Status Compact */}
          <div className="bg-white border border-gray-200 rounded p-2">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center min-w-0">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-gray-900 truncate">État Global</h2>
                  <p className="text-xs text-gray-600">Systèmes opérationnels</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">99.6%</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          </div>

          {/* Quick Ecosystem Status */}
          {ecosystemsStatus.slice(0, 2).map((ecosystem, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded p-2">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center min-w-0">
                  <div className={`p-1.5 rounded bg-${ecosystem.color}-100 mr-2 flex-shrink-0`}>
                    {React.cloneElement(ecosystem.icon, { className: 'h-3 w-3' })}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{ecosystem.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{ecosystem.services} services</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(ecosystem.status)}
                  <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ecosystem.status)}`}>
                    {getStatusText(ecosystem.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Ecosystems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2 h-1/3">
          {ecosystemsStatus.map((ecosystem, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center min-w-0">
                  <div className={`p-1.5 rounded bg-${ecosystem.color}-100 mr-2 flex-shrink-0`}>
                    {React.cloneElement(ecosystem.icon, { className: 'h-4 w-4' })}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{ecosystem.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{ecosystem.description}</p>
                  </div>
                </div>
                {getStatusIcon(ecosystem.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-xs text-gray-500">Services</p>
                  <p className="text-sm font-semibold text-gray-900">{ecosystem.services}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="text-sm font-semibold text-green-600">{ecosystem.uptime}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-1">
                <p className="text-xs text-gray-500 truncate">{ecosystem.url}</p>
              </div>
            </div>
          ))}
        </div>

        {/* System Metrics - Dense Grid */}
        <div className="h-1/3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Métriques Système</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 h-full">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded p-2">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center min-w-0">
                    {React.cloneElement(metric.icon, { className: 'h-4 w-4 mr-2 flex-shrink-0' })}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{metric.name}</p>
                      <p className="text-sm font-bold text-gray-700">{metric.value}</p>
                    </div>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}