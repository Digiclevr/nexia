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
  BarChart3,
  Zap,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function PerformancePage() {
  const { currentTime } = useCurrentTime()
  
  // Fetch performance data
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['performance-data'],
    queryFn: () => nexiaApi.fetchMetrics(),
    refetchInterval: 10000,
    retry: 3,
    retryDelay: 1000
  });

  const performance = performanceData?.data || {};

  const systemMetrics = [
    {
      name: 'BlueOcean Cluster',
      cpu: 65,
      memory: 72,
      disk: 45,
      network: 23,
      responseTime: 245,
      throughput: 1250,
      status: 'healthy'
    },
    {
      name: 'OnlyOneAPI Platform',
      cpu: 58,
      memory: 68,
      disk: 52,
      network: 18,
      responseTime: 180,
      throughput: 890,
      status: 'healthy'
    },
    {
      name: 'Business-Automation',
      cpu: 82,
      memory: 89,
      disk: 67,
      network: 45,
      responseTime: 320,
      throughput: 650,
      status: 'warning'
    },
    {
      name: 'Claude Code 24/7',
      cpu: 35,
      memory: 42,
      disk: 28,
      network: 12,
      responseTime: 95,
      throughput: 320,
      status: 'healthy'
    }
  ]

  const performanceHistory = [
    { time: '14:00', blueocean: 245, onlyoneapi: 180, automation: 320, claude: 95 },
    { time: '14:05', blueocean: 250, onlyoneapi: 175, automation: 315, claude: 98 },
    { time: '14:10', blueocean: 240, onlyoneapi: 185, automation: 325, claude: 92 },
    { time: '14:15', blueocean: 255, onlyoneapi: 190, automation: 310, claude: 96 },
    { time: '14:20', blueocean: 245, onlyoneapi: 182, automation: 318, claude: 94 },
    { time: '14:25', blueocean: 252, onlyoneapi: 178, automation: 322, claude: 97 },
    { time: '14:30', blueocean: 248, onlyoneapi: 183, automation: 316, claude: 95 }
  ]

  const getMetricColor = (value: number, type: string) => {
    if (type === 'responseTime') {
      if (value < 200) return 'text-green-600'
      if (value < 300) return 'text-yellow-600'
      return 'text-red-600'
    }
    
    if (value < 70) return 'text-green-600'
    if (value < 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Optimal'
      case 'warning': return 'Surveillance'
      case 'critical': return 'Critique'
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
            <a href="/alerts" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <AlertTriangle className="mr-3 h-4 w-4" />
              Alertes & Incidents
            </a>
            <a href="/performance" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-primary bg-nexia-50 rounded-md">
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
                <TrendingUp className="h-6 w-6 text-nexia-primary mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-nexia-dark">Performance & Métriques</h1>
                  <p className="text-sm text-nexia-600">Monitoring des performances en temps réel de tous les écosystèmes</p>
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

          {/* Performance Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temps Réponse Moyen</p>
                  <p className="text-2xl font-bold text-green-600">210ms</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CPU Cluster Moyen</p>
                  <p className="text-2xl font-bold text-yellow-600">60%</p>
                </div>
                <Cpu className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Throughput Total</p>
                  <p className="text-2xl font-bold text-nexia-primary">3,110 req/s</p>
                </div>
                <BarChart3 className="h-8 w-8 text-nexia-primary" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibilité</p>
                  <p className="text-2xl font-bold text-green-600">99.7%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-nexia-dark mb-4">Métriques Système Détaillées</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemMetrics.map((system, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-nexia-dark">{system.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                      {getStatusText(system.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 text-nexia-500 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>CPU</span>
                          <span className={getMetricColor(system.cpu, 'cpu')}>{system.cpu}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${system.cpu < 70 ? 'bg-green-500' : system.cpu < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${system.cpu}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-nexia-500 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Mémoire</span>
                          <span className={getMetricColor(system.memory, 'memory')}>{system.memory}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${system.memory < 70 ? 'bg-green-500' : system.memory < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${system.memory}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 text-nexia-500 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Disque</span>
                          <span className={getMetricColor(system.disk, 'disk')}>{system.disk}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${system.disk < 70 ? 'bg-green-500' : system.disk < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${system.disk}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Network className="h-4 w-4 text-nexia-500 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>Réseau</span>
                          <span className={getMetricColor(system.network, 'network')}>{system.network}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${system.network < 70 ? 'bg-green-500' : system.network < 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${system.network}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-nexia-500 uppercase tracking-wider">Temps Réponse</p>
                      <p className={`text-lg font-semibold ${getMetricColor(system.responseTime, 'responseTime')}`}>
                        {system.responseTime}ms
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-nexia-500 uppercase tracking-wider">Throughput</p>
                      <p className="text-lg font-semibold text-nexia-primary">{system.throughput} req/s</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Trends */}
          <div>
            <h2 className="text-lg font-semibold text-nexia-dark mb-4">Tendances Performance (30 minutes)</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-nexia-dark">Temps de Réponse par Écosystème</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>BlueOcean</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>OnlyOneAPI</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Business-Automation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>Claude Code</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 flex items-end space-x-2">
                {performanceHistory.map((point, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center space-y-1 mb-2">
                      <div 
                        className="w-2 bg-blue-500 rounded-t"
                        style={{ height: `${point.blueocean / 4}px` }}
                        title={`BlueOcean: ${point.blueocean}ms`}
                      ></div>
                      <div 
                        className="w-2 bg-green-500 rounded-t"
                        style={{ height: `${point.onlyoneapi / 4}px` }}
                        title={`OnlyOneAPI: ${point.onlyoneapi}ms`}
                      ></div>
                      <div 
                        className="w-2 bg-yellow-500 rounded-t"
                        style={{ height: `${point.automation / 4}px` }}
                        title={`Business-Automation: ${point.automation}ms`}
                      ></div>
                      <div 
                        className="w-2 bg-purple-500 rounded-t"
                        style={{ height: `${point.claude / 4}px` }}
                        title={`Claude Code: ${point.claude}ms`}
                      ></div>
                    </div>
                    <span className="text-xs text-nexia-500">{point.time}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-nexia-500">
                Axe Y: Temps de réponse (ms) • Mise à jour toutes les 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}