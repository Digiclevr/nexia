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
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">OnlyOneAPI Platform</h1>
              <p className="text-sm text-nexia-600">SaaS B2B • 4 sites web • 271 endpoints API</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
            </div>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* Global Status */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Platform OnlyOneAPI</h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>3 sites opérationnels</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>1 site en attention</span>
              </div>
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                <span>271 endpoints API</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">99.3%</p>
            <p className="text-sm opacity-90">Disponibilité moyenne</p>
          </div>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {businessMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-nexia-600">{metric.category}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${ 
                metric.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div className="mb-2">
              <p className="text-xl font-bold text-nexia-dark">{metric.current}</p>
              <p className="text-sm text-nexia-500">Objectif: {metric.target}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-nexia-primary h-2 rounded-full" 
                style={{ width: `${metric.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-nexia-500 mt-1">{metric.progress.toFixed(1)}% de l'objectif</p>
          </div>
        ))}
      </div>

      {/* API Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {apiMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {metric.icon}
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.trend.startsWith('+') || metric.trend.startsWith('-') && !metric.trend.includes('ms') && !metric.trend.includes('%')
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-nexia-dark">{metric.value}</p>
              <p className="text-xs text-nexia-500">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {onlyOneAPISites.map((site) => (
          <div 
            key={site.id} 
            className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
              selectedSite === site.id 
                ? 'border-green-500 ring-2 ring-green-500/20' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setSelectedSite(site.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  {getStatusIcon(site.status)}
                  <h3 className="ml-2 text-lg font-semibold text-nexia-dark">{site.name}</h3>
                </div>
                <p className="text-sm text-nexia-600 mb-2">{site.description}</p>
                <div className="flex items-center space-x-4 text-xs text-nexia-500">
                  <span>{site.framework}</span>
                  <span>Port {site.port}</span>
                  <span>Uptime {site.uptime}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                {getStatusText(site.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Performance</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Lighthouse</span>
                    <span className="text-sm font-medium">{site.lighthouse}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Page Speed</span>
                    <span className="text-sm font-medium">{site.pagespeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Conversion</span>
                    <span className="text-sm font-medium">{site.conversion}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Business</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Traffic</span>
                    <span className="text-sm font-medium">{site.traffic.split('/')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue</span>
                    <span className="text-sm font-medium">{site.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Version</span>
                    <span className="text-sm font-medium">{site.version}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-nexia-500">URL: {site.url.replace('https://', '')}</span>
                <span className="text-nexia-400">Déployé {site.lastDeploy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nexia-dark">Activité Platform</h2>
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