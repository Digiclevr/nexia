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
  RefreshCw,
  Zap,
  TrendingUp,
  Shield,
  BarChart3,
  DollarSign,
  ExternalLink,
  Code,
  Gauge,
  Target
} from 'lucide-react'

export default function OnlyOneAPIPage() {
  const { currentTime } = useCurrentTime()
  // Fetch OnlyOneAPI ecosystem status
  const { data: ecosystemHealth, isLoading } = useQuery({
    queryKey: ['ecosystem-health'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000
  });

  const health = ecosystemHealth?.data || {};

  const onlyOneAPISites = [
    {
      name: 'OnlyOneAPI Marketing',
      status: health.onlyoneapi || 'unknown',
      description: 'Site vitrine principal 401 endpoints',
      url: 'api.onlyoneapi.com',
      services: 5,
      uptime: '99.8%',
      lastCheck: '15s ago',
      icon: <Globe className="h-6 w-6" />,
      color: 'green',
      port: 9080,
      revenue: '€42,000/mois',
      growth: '+12%',
      clients: 89
    },
    {
      name: 'Developer Portal',
      status: health.onlyoneapi || 'unknown',
      description: 'Documentation & API Tools',
      url: 'developer.onlyoneapi.com',
      services: 3,
      uptime: '99.9%',
      lastCheck: '10s ago',
      icon: <Code className="h-6 w-6" />,
      color: 'blue',
      port: 9082,
      revenue: '€15,000/mois',
      growth: '+8%',
      clients: 156
    },
    {
      name: 'Customer Portal',
      status: health.onlyoneapi || 'unknown',
      description: 'Interface client B2B',
      url: 'portal.onlyoneapi.com',
      services: 4,
      uptime: '99.6%',
      lastCheck: '25s ago',
      icon: <Users className="h-6 w-6" />,
      color: 'purple',
      port: 9081,
      revenue: '€28,000/mois',
      growth: '+15%',
      clients: 47
    },
    {
      name: 'Community Hub',
      status: 'warning',
      description: 'Forum & support communautaire',
      url: 'community.onlyoneapi.com',
      services: 2,
      uptime: '98.9%',
      lastCheck: '45s ago',
      icon: <Brain className="h-6 w-6" />,
      color: 'orange',
      port: 9083,
      revenue: '€8,500/mois',
      growth: '+5%',
      clients: 234
    }
  ]

  const systemMetrics = [
    { name: 'API Gateway', status: 'healthy', value: '99.8%', icon: <Activity className="h-5 w-5" /> },
    { name: 'Base de Données', status: 'healthy', value: '99.9%', icon: <Database className="h-5 w-5" /> },
    { name: 'CDN Global', status: 'healthy', value: '99.7%', icon: <Globe className="h-5 w-5" /> },
    { name: 'Load Balancer', status: 'warning', value: '97.2%', icon: <Server className="h-5 w-5" /> },
    { name: 'SSL Certificates', status: 'healthy', value: '100%', icon: <Shield className="h-5 w-5" /> },
    { name: 'Monitoring', status: 'healthy', value: '99.6%', icon: <Gauge className="h-5 w-5" /> }
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
      case 'business':
        return 'text-green-600 bg-green-100'
      case 'deployment':
        return 'text-blue-600 bg-blue-100'
      case 'alert':
        return 'text-yellow-600 bg-yellow-100'
      case 'performance':
        return 'text-orange-600 bg-orange-100'
      case 'content':
        return 'text-purple-600 bg-purple-100'
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
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header with Gradient */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    OnlyOneAPI Platform
                  </h1>
                  <p className="text-sm text-gray-500">SaaS B2B • 4 sites web • 401 endpoints API</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{currentTime}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Platform Opérationnel</span>
                </div>
                
                <button 
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue ARR</p>
                <p className="text-3xl font-bold text-green-600">€93.5k</p>
                <p className="text-sm text-gray-500 mt-1">+12% ce mois</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sites Web</p>
                <p className="text-3xl font-bold text-blue-600">4</p>
                <p className="text-sm text-gray-500 mt-1">Applications actives</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Endpoints</p>
                <p className="text-3xl font-bold text-purple-600">401</p>
                <p className="text-sm text-gray-500 mt-1">Endpoints commercialisés</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Code className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients B2B</p>
                <p className="text-3xl font-bold text-emerald-600">526</p>
                <p className="text-sm text-gray-500 mt-1">Utilisateurs actifs</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* OnlyOneAPI Sites Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {onlyOneAPISites.map((site, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 bg-${site.color}-100 rounded-xl`}>
                    {React.cloneElement(site.icon, { 
                      className: `h-6 w-6 text-${site.color}-600` 
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                    <p className="text-sm text-gray-500">{site.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(site.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(site.status)}`}>
                    {getStatusText(site.status)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Services</p>
                  <p className="text-xl font-bold text-gray-900">{site.services}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-xl font-bold text-green-600">{site.uptime}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">Check</p>
                  <p className="text-sm font-medium text-gray-700">{site.lastCheck}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600">Revenue</p>
                  <p className="text-lg font-bold text-green-800">{site.revenue}</p>
                  <p className="text-xs text-green-600">{site.growth}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600">Clients</p>
                  <p className="text-lg font-bold text-blue-800">{site.clients}</p>
                  <p className="text-xs text-blue-600">Utilisateurs</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Endpoint:</span>
                <code className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded">
                  {site.url}
                </code>
                <span className="text-xs text-gray-500">Port {site.port}</span>
              </div>
            </div>
          ))}
        </div>

        {/* System Metrics Modern Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Infrastructure OnlyOneAPI</h2>
            </div>
            <div className="text-sm text-gray-500">Temps réel</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {React.cloneElement(metric.icon, { className: 'h-5 w-5 text-blue-600' })}
                    </div>
                    <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-500">Performance</p>
                  </div>
                  
                  {/* Mini progress bar */}
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        metric.status === 'healthy' ? 'bg-green-500' : 
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: metric.value }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🕐 <strong>Paris:</strong> {currentTime.split('|')[0]?.trim() || currentTime} | 
            <strong> USA:</strong> {currentTime.split('|')[1]?.trim() || 'Calcul en cours...'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            OnlyOneAPI SaaS Platform • Supervision temps réel • Auto-refresh 5s
          </p>
        </div>
      </main>
    </div>
  )
}