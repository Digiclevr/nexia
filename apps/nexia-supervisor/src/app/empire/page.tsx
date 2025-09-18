'use client'

import { 
  Crown,
  Activity,
  TrendingUp,
  Users,
  Server,
  Database,
  Zap,
  Globe,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  Eye
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function EmpirePage() {
  const { currentTime } = useCurrentTime()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  
  // Fetch Empire data
  const { data: empireData, isLoading } = useQuery({
    queryKey: ['empire-dashboard'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 10000,
    retry: 3,
    retryDelay: 1000
  });

  const empireProjects = [
    {
      id: 'onlyoneapi',
      name: 'OnlyOneAPI',
      description: 'SaaS B2B Platform • 401 endpoints',
      status: 'production',
      progress: 100,
      revenue: '€42,000',
      users: 1247,
      uptime: '99.8%',
      lastDeploy: '2h ago',
      priority: 'high',
      health: 'excellent',
      ports: [9080, 9081, 9082, 9083],
      environment: 'Production'
    },
    {
      id: 'kreach',
      name: 'KREACH',
      description: 'AI Market Intelligence • KONQER brand',
      status: 'development',
      progress: 85,
      revenue: 'En dev',
      users: 23,
      uptime: '97.2%',
      lastDeploy: '1h ago',
      priority: 'high',
      health: 'good',
      ports: [5003, 8001],
      environment: 'Development'
    },
    {
      id: 'nextgen',
      name: 'NEXTGEN',
      description: 'Domain Monetization • 230 domaines',
      status: 'production',
      progress: 95,
      revenue: '€1.86M/an',
      users: 8934,
      uptime: '99.5%',
      lastDeploy: '1d ago',
      priority: 'high',
      health: 'excellent',
      ports: [7000, 7001, 7002],
      environment: 'Production'
    },
    {
      id: 'kvibe',
      name: 'KVIBE',
      description: 'Social Marketing Platform',
      status: 'development',
      progress: 85,
      revenue: 'En dev',
      users: 156,
      uptime: '98.1%',
      lastDeploy: '3h ago',
      priority: 'medium',
      health: 'good',
      ports: [7005],
      environment: 'Development'
    },
    {
      id: 'holding',
      name: 'HOLDING',
      description: 'Corporate VALDELIA',
      status: 'production',
      progress: 100,
      revenue: 'Confidentiel',
      users: 45,
      uptime: '99.9%',
      lastDeploy: '1w ago',
      priority: 'medium',
      health: 'excellent',
      ports: [8080],
      environment: 'Production'
    },
    {
      id: 'business-automation',
      name: 'Business Automation',
      description: 'Agents autonomes 24/7',
      status: 'development',
      progress: 70,
      revenue: 'En config',
      users: 7,
      uptime: '96.5%',
      lastDeploy: '30min ago',
      priority: 'medium',
      health: 'warning',
      ports: [7020, 7021],
      environment: 'Development'
    },
    {
      id: 'endpoints',
      name: 'ENDPOINTS',
      description: 'GitHub Intelligence Mining',
      status: 'production',
      progress: 100,
      revenue: 'Référence',
      users: 234,
      uptime: '99.7%',
      lastDeploy: '2d ago',
      priority: 'low',
      health: 'excellent',
      ports: [5021, 5022],
      environment: 'Production'
    },
    {
      id: 'digital-tools',
      name: 'Digital Tools',
      description: 'Suite outils support',
      status: 'production',
      progress: 90,
      revenue: 'Support',
      users: 89,
      uptime: '98.9%',
      lastDeploy: '1d ago',
      priority: 'low',
      health: 'good',
      ports: [5030, 5031],
      environment: 'Production'
    }
  ]

  const empireMetrics = [
    {
      name: 'Total Revenue',
      value: '€2.14M',
      target: '€3.0M',
      progress: 71.3,
      trend: '+€42K',
      icon: <DollarSign className="h-5 w-5" />,
      status: 'excellent'
    },
    {
      name: 'Active Projects',
      value: '8',
      target: '10',
      progress: 80,
      trend: '+2',
      icon: <Target className="h-5 w-5" />,
      status: 'good'
    },
    {
      name: 'Total Users',
      value: '11,730',
      target: '15,000',
      progress: 78.2,
      trend: '+1,247',
      icon: <Users className="h-5 w-5" />,
      status: 'good'
    },
    {
      name: 'Uptime Moyen',
      value: '98.9%',
      target: '99.5%',
      progress: 99.4,
      trend: '+0.2%',
      icon: <Activity className="h-5 w-5" />,
      status: 'excellent'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'production':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'development':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'development':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'maintenance':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'production':
        return 'Production'
      case 'development':
        return 'Développement'
      case 'maintenance':
        return 'Maintenance'
      case 'error':
        return 'Erreur'
      default:
        return 'Inconnu'
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600 bg-green-100'
      case 'good':
        return 'text-blue-600 bg-blue-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'critical':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Mock Data Warning */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-yellow-800 font-medium">DONNÉES DE DÉMONSTRATION</p>
            <p className="text-xs text-yellow-700">Les projets, métriques et revenus affichés utilisent des données factices hardcodées à des fins de présentation.</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">Empire BlueOcean Dashboard</h1>
              <p className="text-sm text-nexia-600">Supervision complète • 8 projets interconnectés</p>
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
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Empire BlueOcean Status</h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>5 projets en production</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>3 projets en développement</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>€2.14M revenue annuel</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">98.9%</p>
            <p className="text-sm opacity-90">Uptime Empire</p>
          </div>
        </div>
      </div>

      {/* Empire Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {empireMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {metric.icon}
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.status === 'excellent' ? 'bg-green-100 text-green-600' : 
                metric.status === 'good' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div className="mb-2">
              <p className="text-xl font-bold text-nexia-dark">{metric.value}</p>
              <p className="text-sm text-nexia-500">Objectif: {metric.target}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metric.status === 'excellent' ? 'bg-green-500' : 
                  metric.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(100, metric.progress)}%` }}
              ></div>
            </div>
            <p className="text-xs text-nexia-500 mt-1">{metric.progress.toFixed(1)}% de l'objectif</p>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {empireProjects.map((project) => (
          <div 
            key={project.id} 
            className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
              selectedProject === project.id 
                ? 'border-yellow-500 ring-2 ring-yellow-500/20' 
                : 'border-gray-200 hover:border-yellow-300'
            }`}
            onClick={() => setSelectedProject(project.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  {getStatusIcon(project.status)}
                  <h3 className="ml-2 text-lg font-semibold text-nexia-dark">{project.name}</h3>
                </div>
                <p className="text-sm text-nexia-600 mb-2">{project.description}</p>
                <div className="flex items-center space-x-4 text-xs text-nexia-500">
                  <span>Uptime {project.uptime}</span>
                  <span>{project.users} users</span>
                  <span>Deploy {project.lastDeploy}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Performance</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue</span>
                    <span className="text-sm font-medium">{project.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Health</span>
                    <span className={`text-xs px-1 py-0.5 rounded ${getHealthColor(project.health)}`}>
                      {project.health}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Infrastructure</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Env</span>
                    <span className="text-sm font-medium">{project.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ports</span>
                    <span className="text-sm font-medium">{project.ports.length}</span>
                  </div>
                  <div className="text-xs text-nexia-500">
                    {project.ports.join(', ')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-nexia-500">Progression: {project.progress}%</span>
                <button className="flex items-center text-nexia-600 hover:text-nexia-800">
                  <Eye className="h-4 w-4 mr-1" />
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}