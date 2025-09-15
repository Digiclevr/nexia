'use client'

import { 
  Activity,
  AlertCircle, 
  BarChart3, 
  Brain,
  Globe,
  Mic,
  Server,
  Shield,
  Target,
  Users,
  Database,
  Clock,
  Zap,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useClientTime } from '@/hooks/useClientTime'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function DashboardPage() {
  const { formatTime, formatRelativeTime } = useClientTime()
  const { currentTime } = useCurrentTime()
  
  // Fetch real-time NEXIA status
  const { data: nexiaStatus, isLoading: statusLoading, error: statusError } = useQuery({
    queryKey: ['nexia-status'],
    queryFn: () => nexiaApi.fetchStatus(),
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Fetch ecosystem health
  const { data: ecosystemHealth, error: healthError } = useQuery({
    queryKey: ['ecosystem-health'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
    retryDelay: 1000
  });

  // Fetch active alerts
  const { data: activeAlerts } = useQuery({
    queryKey: ['active-alerts'],
    queryFn: () => nexiaApi.fetchActiveAlerts(),
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: 3,
    retryDelay: 1000
  });

  const status = nexiaStatus?.data;
  const health = ecosystemHealth?.data || {};
  const alerts = activeAlerts?.data || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation - NEXTSTEP Style */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-nexia-200">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 px-6 bg-nexia-gradient">
            <Brain className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-lg font-bold text-white">NEXIA</h1>
              <p className="text-xs text-nexia-100">Meta-Orchestrateur</p>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <h3 className="px-2 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Vue d'Ensemble</h3>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-primary bg-nexia-50 rounded-md">
              <Activity className="mr-3 h-4 w-4" />
              Dashboard Principal
            </a>
            
            <h3 className="px-2 mt-6 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Supervision</h3>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Globe className="mr-3 h-4 w-4" />
              Écosystèmes
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <AlertCircle className="mr-3 h-4 w-4" />
              Alertes & Incidents
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <BarChart3 className="mr-3 h-4 w-4" />
              Performance
            </a>
            
            <h3 className="px-2 mt-6 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Intelligence Business</h3>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <TrendingUp className="mr-3 h-4 w-4" />
              Analytics Revenus
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Target className="mr-3 h-4 w-4" />
              Optimisation Coûts
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Eye className="mr-3 h-4 w-4" />
              Monitoring Temps Réel
            </a>
            
            <h3 className="px-2 mt-6 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Opérations</h3>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Users className="mr-3 h-4 w-4" />
              Clients & Locations
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <Mic className="mr-3 h-4 w-4" />
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
          {/* Debug info - temporary */}
          {(statusError as any) && (
            <div className="mb-4 p-4 bg-nexia-error/10 border border-nexia-error/30 text-nexia-error rounded">
              <h3 className="font-bold">API Error:</h3>
              <p>{(statusError as Error).message}</p>
            </div>
          )}
        
          {/* Header - NEXTSTEP Style */}
          <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
              <div className="flex items-center">
                <BarChart3 className="h-6 w-6 text-nexia-primary mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-nexia-dark">Performance Portfolio</h1>
                  <p className="text-sm text-nexia-600">Analyse détaillée des performances et métriques de vos écosystèmes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
                  <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
                </div>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50">
                  <Server className="h-4 w-4 mr-2" />
                  Filtres
                </button>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-nexia-primary rounded-md hover:bg-nexia-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Exporter
                </button>
              </div>
            </div>
          </header>

        {/* KPI Cards - NEXTSTEP Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* KPI Card - Revenus Totaux */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-gray-900">€{(6901.8).toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium text-nexia-success">▲ +12.3%</span>
                  <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
            </div>
          </div>

          {/* KPI Card - Trafic Total */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Trafic Total</p>
                <p className="text-2xl font-bold text-gray-900">{(40590).toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium text-blue-600">▲ +8.7%</span>
                  <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* KPI Card - Conversion Moyenne */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Conversion Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">3.5%</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium text-nexia-success">▲ +0.5%</span>
                  <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          {/* KPI Card - Autorité Moyenne */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Autorité Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">61</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium text-orange-600">▲ +2.1</span>
                  <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                </div>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et Contrôles */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Catégorie</label>
                <select className="mt-1 block w-32 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-nexia-primary focus:border-nexia-primary rounded-md">
                  <option>Toutes</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Trier par</label>
                <select className="mt-1 block w-32 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-nexia-primary focus:border-nexia-primary rounded-md">
                  <option>Revenus</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">4 domaines affichés</span>
            </div>
          </div>
        </div>

        {/* Table de Performance - NEXTSTEP Style */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus/Mois</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trafic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Croissance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tendance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">fastcash-solutions.com</div>
                      <div className="text-sm text-gray-500">SAAS</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">€2,850.5</div>
                    <div className="text-sm text-nexia-success">+12.5%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">15,420</div>
                    <div className="text-sm text-gray-500">8,920 organiques</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">3.2%</div>
                    <div className="text-sm text-gray-500">45.7% rebond</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">DA 68</div>
                    <div className="text-sm text-gray-500">142 backlinks</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-nexia-success">+12.5% revenus</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-nexia-success mr-1" />
                      <span className="text-sm text-nexia-success">Up</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Widgets Analytics supplémentaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Top Performers */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Top Performers</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">fastcash-solutions.com</span>
                <span className="text-sm font-bold text-nexia-success">+12.5%</span>
              </div>
            </div>
          </div>

          {/* Points d'Attention */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">⚠️ Points d'Attention</h3>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.slice(0, 3).map((alert: any) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'critical'
                        ? 'bg-nexia-error/10 border-nexia-error/30'
                        : alert.severity === 'high'
                        ? 'bg-nexia-warning/10 border-nexia-warning/30'
                        : 'bg-nexia-warning/5 border-nexia-warning/20'
                    }`}
                  >
                    <p className={`text-sm font-medium ${
                      alert.severity === 'critical'
                        ? 'text-nexia-error'
                        : alert.severity === 'high'
                        ? 'text-nexia-warning'
                        : 'text-nexia-warning'
                    }`}>
                      {alert.severity === 'critical' ? '🚨 CRITIQUE' : 
                       alert.severity === 'high' ? '⚡ URGENT' : '⚠️ ALERTE'}
                    </p>
                    <p className={`text-sm ${
                      alert.severity === 'critical'
                        ? 'text-nexia-800'
                        : alert.severity === 'high'
                        ? 'text-nexia-700'
                        : 'text-nexia-600'
                    }`}>
                      {alert.target} - {alert.message.slice(0, 60)}...
                    </p>
                    <p className={`text-xs mt-1 ${
                      alert.severity === 'critical'
                        ? 'text-nexia-700'
                        : alert.severity === 'high'
                        ? 'text-nexia-600'
                        : 'text-nexia-500'
                    }`}>
                      {formatTime(alert.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-nexia-success/10 rounded-lg border border-nexia-success/30">
                  <p className="text-sm text-nexia-success font-medium">Aucune alerte critique</p>
                  <p className="text-xs text-nexia-600 mt-1">Tous systèmes opérationnels</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        </div>
      </div>
    </div>
  )
}