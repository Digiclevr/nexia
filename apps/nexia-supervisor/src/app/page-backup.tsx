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
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useClientTime } from '@/hooks/useClientTime'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { useBlueOceanStatus } from '@/hooks/useBlueOceanStatus'
import { getStatusColor, getStatusColorText } from '@/lib/blueocean-status'

export default function DashboardPage() {
  const { formatTime, formatRelativeTime } = useClientTime()
  const { currentTime } = useCurrentTime()
  const queryClient = useQueryClient()
  
  const handleOpenFilterMenu = () => {
    alert('Filtres de monitoring - Configuration des vues écosystème')
  }
  
  const handleCategoryFilter = (category: string) => {
    alert(`Filtrage par catégorie: ${category}`)
  }
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['nexia-status'] })
    queryClient.invalidateQueries({ queryKey: ['ecosystem-health'] })
    queryClient.invalidateQueries({ queryKey: ['active-alerts'] })
    queryClient.invalidateQueries({ queryKey: ['blueocean-status'] })
  }
  
  // Fetch BlueOcean apps status
  const { data: blueOceanStatus } = useBlueOceanStatus()
  const blueOceanApps = blueOceanStatus?.data || []
  
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
    <div className="min-h-screen flex flex-col">
      {/* Debug info - temporary */}
      {(statusError as any) && (
        <div className="mx-2 mt-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-xs">
          <strong>API Error:</strong> {(statusError as Error).message}
        </div>
      )}
    
      {/* BlueOcean Quick Access Menu */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-blue-700 flex-shrink-0">
        <div className="px-2 lg:px-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 overflow-x-auto">
              <span className="text-xs font-medium text-white mr-2 whitespace-nowrap">🌊 BlueOcean:</span>
              {blueOceanApps.map((app) => (
                <a 
                  key={app.name}
                  href={app.url} 
                  target="_blank" 
                  className={`px-1.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    app.status === 'online' 
                      ? 'bg-green-500 hover:bg-green-400 text-white' 
                      : 'bg-gray-500 hover:bg-gray-400 text-gray-200'
                  }`}
                  title={`${app.name} - Port ${app.port} - ${app.status}`}
                >
                  {app.status === 'online' ? '✓' : '✗'} {app.name}
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
              <span className="text-xs text-blue-100 whitespace-nowrap hidden sm:inline">
                {blueOceanApps.filter(app => app.status === 'online').length}/{blueOceanApps.length} UP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Compact Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-2 lg:px-4 py-2">
          <div className="flex items-center min-w-0">
            <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 mr-2 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-semibold text-gray-900 truncate">NEXIA Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{currentTime}</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
              title="Actualiser les données"
            >
              <RefreshCw className="h-3 w-3 mr-1 inline" />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
            <button 
              onClick={handleOpenFilterMenu}
              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
            >
              <Server className="h-3 w-3 mr-1 inline" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area - Fill remaining space */}
      <div className="flex-1 p-2 lg:p-3">
        {/* Ultra-Dense KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 mb-3">
          {/* Compact KPI Cards */}
          <div className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Revenus</p>
                <p className="text-sm lg:text-base font-bold text-gray-900">€6.9K</p>
                <p className="text-xs text-green-600">▲ +12.3%</p>
              </div>
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Trafic</p>
                <p className="text-sm lg:text-base font-bold text-gray-900">40.6K</p>
                <p className="text-xs text-blue-600">▲ +8.7%</p>
              </div>
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <Users className="h-3 w-3 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Conv.</p>
                <p className="text-sm lg:text-base font-bold text-gray-900">3.5%</p>
                <p className="text-xs text-green-600">▲ +0.5%</p>
              </div>
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-3 w-3 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Autorité</p>
                <p className="text-sm lg:text-base font-bold text-gray-900">61</p>
                <p className="text-xs text-orange-600">▲ +2.1</p>
              </div>
              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-3 w-3 text-orange-600" />
              </div>
            </div>
          </div>

          {/* BlueOcean Quick Access */}
          <div className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">BlueOcean</p>
                <p className="text-xs font-bold text-orange-600">4 APPS</p>
                <p className="text-xs text-gray-500">Live</p>
              </div>
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <Globe className="h-3 w-3 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-2 rounded border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">OnlyOneAPI</p>
                <p className="text-xs font-bold text-green-600">HEALTHY</p>
                <p className="text-xs text-gray-500">5 svc</p>
              </div>
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <Database className="h-3 w-3 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Dense Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          
          {/* Left Column - Performance Table */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded overflow-hidden">
            <div className="p-2 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Performance Domains</h3>
              <div className="flex items-center space-x-2">
                <select 
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="text-xs border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">Toutes</option>
                  <option value="saas">SaaS</option>
                  <option value="ai">IA</option>
                  <option value="intel">AI Intel</option>
                  <option value="premium">Premium</option>
                </select>
                <span className="text-xs text-gray-500">4 domaines</span>
              </div>
            </div>
            <div className="overflow-auto max-h-80">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-1 text-left font-medium text-gray-500">Domaine</th>
                    <th className="px-2 py-1 text-left font-medium text-gray-500 hidden sm:table-cell">Rev/M</th>
                    <th className="px-2 py-1 text-left font-medium text-gray-500 hidden md:table-cell">Trafic</th>
                    <th className="px-2 py-1 text-left font-medium text-gray-500 hidden lg:table-cell">Conv</th>
                    <th className="px-2 py-1 text-left font-medium text-gray-500 hidden xl:table-cell">SEO</th>
                    <th className="px-2 py-1 text-left font-medium text-gray-500">↗️</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 border-b">
                    <td className="px-2 py-1">
                      <div className="font-medium text-gray-900 truncate">fastcash-solutions.com</div>
                      <div className="text-gray-500">SAAS</div>
                    </td>
                    <td className="px-2 py-1 hidden sm:table-cell">
                      <div className="font-medium text-gray-900">€2.9K</div>
                      <div className="text-green-600">+12.5%</div>
                    </td>
                    <td className="px-2 py-1 hidden md:table-cell">
                      <div className="text-gray-900">15.4K</div>
                      <div className="text-gray-500">8.9K org</div>
                    </td>
                    <td className="px-2 py-1 hidden lg:table-cell">
                      <div className="text-gray-900">3.2%</div>
                      <div className="text-gray-500">45.7% rb</div>
                    </td>
                    <td className="px-2 py-1 hidden xl:table-cell">
                      <div className="text-gray-900">DA 68</div>
                      <div className="text-gray-500">142 bl</div>
                    </td>
                    <td className="px-2 py-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 border-b">
                    <td className="px-2 py-1">
                      <div className="font-medium text-gray-900 truncate">nexia.onlyoneapi.com</div>
                      <div className="text-gray-500">IA</div>
                    </td>
                    <td className="px-2 py-1 hidden sm:table-cell">
                      <div className="font-medium text-gray-900">€1.2K</div>
                      <div className="text-green-600">+8.3%</div>
                    </td>
                    <td className="px-2 py-1 hidden md:table-cell">
                      <div className="text-gray-900">8.1K</div>
                      <div className="text-gray-500">6.2K org</div>
                    </td>
                    <td className="px-2 py-1 hidden lg:table-cell">
                      <div className="text-gray-900">4.1%</div>
                      <div className="text-gray-500">32.1% rb</div>
                    </td>
                    <td className="px-2 py-1 hidden xl:table-cell">
                      <div className="text-gray-900">DA 45</div>
                      <div className="text-gray-500">87 bl</div>
                    </td>
                    <td className="px-2 py-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 border-b">
                    <td className="px-2 py-1">
                      <div className="font-medium text-gray-900 truncate">kreach.blueocean.io</div>
                      <div className="text-gray-500">AI Intel</div>
                    </td>
                    <td className="px-2 py-1 hidden sm:table-cell">
                      <div className="font-medium text-gray-900">€890</div>
                      <div className="text-orange-600">+2.1%</div>
                    </td>
                    <td className="px-2 py-1 hidden md:table-cell">
                      <div className="text-gray-900">5.3K</div>
                      <div className="text-gray-500">3.8K org</div>
                    </td>
                    <td className="px-2 py-1 hidden lg:table-cell">
                      <div className="text-gray-900">2.8%</div>
                      <div className="text-gray-500">58.2% rb</div>
                    </td>
                    <td className="px-2 py-1 hidden xl:table-cell">
                      <div className="text-gray-900">DA 32</div>
                      <div className="text-gray-500">45 bl</div>
                    </td>
                    <td className="px-2 py-1">
                      <Activity className="h-3 w-3 text-orange-600" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Stats & Alerts */}
          <div className="space-y-2">
            
            {/* Top Performers */}
            <div className="bg-white border border-gray-200 rounded p-2">
              <h3 className="text-sm font-medium text-gray-900 mb-2">📈 Top Performers</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-1 bg-green-50 rounded text-xs">
                  <span className="font-medium text-gray-900 truncate">fastcash-solutions.com</span>
                  <span className="font-bold text-green-600">+12.5%</span>
                </div>
                <div className="flex items-center justify-between p-1 bg-blue-50 rounded text-xs">
                  <span className="font-medium text-gray-900 truncate">nexia.onlyoneapi.com</span>
                  <span className="font-bold text-blue-600">+8.3%</span>
                </div>
              </div>
            </div>

            {/* BlueOcean Quick Access */}
            <div className="bg-white border border-gray-200 rounded p-2">
              <h3 className="text-sm font-medium text-gray-900 mb-2">🌊 BlueOcean Apps</h3>
              <div className="space-y-1">
                {blueOceanApps.map((app) => (
                  <a 
                    key={app.name}
                    href={app.url} 
                    target="_blank" 
                    className={`flex items-center justify-between p-1 ${
                      app.status === 'online' 
                        ? 'bg-green-50 hover:bg-green-100' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    } rounded text-xs transition-colors cursor-pointer`}
                  >
                    <span className="flex items-center">
                      <div className={`w-2 h-2 ${getStatusColor(app.status)} rounded-full mr-2`}></div>
                      {app.name}
                    </span>
                    <span className={`font-medium ${getStatusColorText(app.status)}`}>
                      {app.status === 'online' ? `✓ :${app.port}` : `✗ :${app.port}`}
                    </span>
                  </a>
                ))}
                {blueOceanApps.length === 0 && (
                  <div className="p-1 bg-gray-50 rounded text-xs text-gray-500">
                    Checking applications...
                  </div>
                )}
              </div>
            </div>

            {/* Ecosystem Status */}
            <div className="bg-white border border-gray-200 rounded p-2">
              <h3 className="text-sm font-medium text-gray-900 mb-2">🌐 System Status</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    OnlyOneAPI
                  </span>
                  <span className="text-green-600 font-medium">HEALTHY</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center">
                    <div className={`w-2 h-2 ${
                      blueOceanApps.filter(app => app.status === 'online').length > 0 
                        ? 'bg-blue-500' 
                        : 'bg-gray-400'
                    } rounded-full mr-2`}></div>
                    BlueOcean
                  </span>
                  <span className={`font-medium ${
                    blueOceanApps.filter(app => app.status === 'online').length > 0 
                      ? 'text-blue-600' 
                      : 'text-gray-500'
                  }`}>
                    {blueOceanApps.filter(app => app.status === 'online').length}/{blueOceanApps.length} UP
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Business-Auto
                  </span>
                  <span className="text-green-600 font-medium">HEALTHY</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Claude Code
                  </span>
                  <span className="text-orange-600 font-medium">WARNING</span>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white border border-gray-200 rounded p-2">
              <h3 className="text-sm font-medium text-gray-900 mb-2">⚠️ Alertes</h3>
              <div className="space-y-1">
                {alerts.length > 0 ? (
                  alerts.slice(0, 3).map((alert: any) => (
                    <div 
                      key={alert.id} 
                      className={`p-1 rounded text-xs border ${
                        alert.severity === 'critical'
                          ? 'bg-red-50 border-red-200'
                          : alert.severity === 'high'
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <p className={`font-medium ${
                        alert.severity === 'critical'
                          ? 'text-red-700'
                          : alert.severity === 'high'
                          ? 'text-orange-700'
                          : 'text-yellow-700'
                      }`}>
                        {alert.severity === 'critical' ? '🚨' : 
                         alert.severity === 'high' ? '⚡' : '⚠️'} {alert.target}
                      </p>
                      <p className="text-gray-600 truncate">{alert.message.slice(0, 40)}...</p>
                    </div>
                  ))
                ) : (
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700 font-medium">✅ Aucune alerte</p>
                    <p className="text-xs text-green-600">Systèmes opérationnels</p>
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