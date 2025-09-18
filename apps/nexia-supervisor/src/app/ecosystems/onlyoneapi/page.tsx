'use client'

import { 
  Database,
  Activity,
  Server,
  Globe,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  DollarSign,
  BarChart3,
  Zap,
  Eye,
  Monitor
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function OnlyOneAPIPage() {
  const { currentTime } = useCurrentTime()
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  
  // Fetch OnlyOneAPI ecosystem data
  const { data: onlyOneAPIData, isLoading } = useQuery({
    queryKey: ['onlyoneapi-ecosystem'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000
  });

  const onlyOneAPISites = [
    {
      id: 'marketing',
      name: 'OnlyOneAPI Marketing',
      description: 'Site vitrine principal & landing pages',
      status: 'healthy',
      url: 'https://onlyoneapi.com',
      port: 9080,
      uptime: '99.8%',
      traffic: '15.2k visits/day',
      conversion: '3.2%',
      revenue: '€2,850/month',
      lighthouse: 95,
      pagespeed: '1.2s',
      endpoints: 271,
      version: 'v3.1.2',
      lastDeploy: '2h ago',
      framework: 'Next.js 15'
    },
    {
      id: 'developer',
      name: 'Developer Portal',
      description: 'Documentation API & outils développeurs',
      status: 'healthy',
      url: 'https://developer.onlyoneapi.com',
      port: 9082,
      uptime: '99.9%',
      traffic: '8.7k visits/day',
      conversion: '12.5%',
      revenue: '€1,240/month',
      lighthouse: 98,
      pagespeed: '0.8s',
      endpoints: 271,
      version: 'v2.4.1',
      lastDeploy: '4h ago',
      framework: 'Next.js 15'
    },
    {
      id: 'portal',
      name: 'Customer Portal',
      description: 'Interface client & dashboard B2B',
      status: 'healthy',
      url: 'https://portal.onlyoneapi.com',
      port: 9081,
      uptime: '99.6%',
      traffic: '4.1k visits/day',
      conversion: '8.7%',
      revenue: '€1,950/month',
      lighthouse: 92,
      pagespeed: '1.1s',
      endpoints: 271,
      version: 'v2.8.3',
      lastDeploy: '6h ago',
      framework: 'Next.js 15'
    },
    {
      id: 'community',
      name: 'Community Hub',
      description: 'Forum & support communautaire',
      status: 'warning',
      url: 'https://community.onlyoneapi.com',
      port: 9083,
      uptime: '98.9%',
      traffic: '2.8k visits/day',
      conversion: '5.1%',
      revenue: '€740/month',
      lighthouse: 89,
      pagespeed: '1.8s',
      endpoints: 271,
      version: 'v1.9.7',
      lastDeploy: '1d ago',
      framework: 'Next.js 15'
    }
  ]

  const apiMetrics = [
    {
      name: 'API Endpoints',
      value: '271',
      status: 'healthy',
      trend: '+12',
      icon: <Database className="h-5 w-5" />,
      description: 'Endpoints commercialisés'
    },
    {
      name: 'Requests/min',
      value: '8.2k',
      status: 'healthy',
      trend: '+15%',
      icon: <Activity className="h-5 w-5" />,
      description: 'Trafic API temps réel'
    },
    {
      name: 'Clients B2B',
      value: '47',
      status: 'healthy',
      trend: '+3',
      icon: <Users className="h-5 w-5" />,
      description: 'Comptes actifs'
    },
    {
      name: 'Revenue ARR',
      value: '€82k',
      status: 'healthy',
      trend: '+22%',
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Recurring revenue'
    },
    {
      name: 'API Latency',
      value: '89ms',
      status: 'healthy',
      trend: '-5ms',
      icon: <Zap className="h-5 w-5" />,
      description: 'Temps de réponse moyen'
    },
    {
      name: 'Error Rate',
      value: '0.2%',
      status: 'healthy',
      trend: '-0.1%',
      icon: <AlertTriangle className="h-5 w-5" />,
      description: 'Taux d\'erreur'
    }
  ]

  const businessMetrics = [
    {
      category: 'Revenue',
      current: '€6,780',
      target: '€8,500',
      progress: 79.8,
      trend: '+12.3%'
    },
    {
      category: 'Traffic',
      current: '31.2k',
      target: '35k',
      progress: 89.1,
      trend: '+8.7%'
    },
    {
      category: 'Conversion',
      current: '6.9%',
      target: '8%',
      progress: 86.3,
      trend: '+1.2%'
    },
    {
      category: 'Clients',
      current: '47',
      target: '60',
      progress: 78.3,
      trend: '+6.4%'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      timestamp: '14:30:22',
      event: 'Nouveau client B2B inscrit',
      type: 'business',
      status: 'success',
      details: 'TechCorp Solutions - Plan Enterprise'
    },
    {
      id: 2,
      timestamp: '14:25:15',
      event: 'Marketing site deployed',
      type: 'deployment',
      status: 'success',
      details: 'v3.1.2 - Performance optimizations'
    },
    {
      id: 3,
      timestamp: '14:20:44',
      event: 'API quota exceeded',
      type: 'alert',
      status: 'warning',
      details: 'Client ID: 4571 - Daily limit reached'
    },
    {
      id: 4,
      timestamp: '14:15:33',
      event: 'Community performance issue',
      type: 'performance',
      status: 'warning',
      details: 'Page load time increased to 1.8s'
    },
    {
      id: 5,
      timestamp: '14:12:10',
      event: 'API documentation updated',
      type: 'content',
      status: 'success',
      details: '12 nouveaux endpoints documentés'
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