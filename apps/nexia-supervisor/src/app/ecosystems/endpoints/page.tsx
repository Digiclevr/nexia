'use client'

import { 
  Target,
  Search,
  Star,
  TrendingUp,
  Database,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  GitBranch,
  Eye,
  ExternalLink,
  Zap
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function EndpointsPage() {
  const { currentTime } = useCurrentTime()

  // Données réelles ENDPOINTS Mining
  const { data: miningResponse, isLoading } = useQuery({
    queryKey: ['endpoints-mining'],
    queryFn: async () => {
      const response = await fetch('/api/ecosystems/endpoints')
      if (!response.ok) throw new Error('Failed to fetch ENDPOINTS data')
      return response.json()
    },
    refetchInterval: 30000
  })

  const miningData = miningResponse?.data
  const realDataSources = miningResponse?.realDataSources
  
  // Version simulée pour fallback si l'API ne répond pas
  const fallbackData = {
      overview: {
        totalRepositories: 2847,
        opportunitiesFound: 156,
        goldOpportunities: 12,
        silverOpportunities: 34,
        bronzeOpportunities: 110,
        activeScans: 8
      },
      recentFindings: [
        {
          id: 'opp_001',
          title: 'API Gateway Open Source - 15K+ stars',
          repository: 'kong/kong',
          category: 'GOLD',
          score: 95,
          description: 'Cloud-native API gateway with massive community',
          metrics: {
            stars: 15400,
            forks: 2100,
            contributors: 450,
            lastUpdate: '2 hours ago'
          },
          opportunity: 'Enterprise plugin marketplace potential',
          estimatedValue: '€50K-150K',
          tags: ['API Gateway', 'Cloud Native', 'Enterprise']
        },
        {
          id: 'opp_002', 
          title: 'GraphQL Schema Generator',
          repository: 'hasura/graphql-engine',
          category: 'SILVER',
          score: 78,
          description: 'Auto-generate GraphQL APIs from databases',
          metrics: {
            stars: 8920,
            forks: 890,
            contributors: 180,
            lastUpdate: '1 day ago'
          },
          opportunity: 'SaaS offering for small businesses',
          estimatedValue: '€15K-40K',
          tags: ['GraphQL', 'Database', 'Code Generation']
        },
        {
          id: 'opp_003',
          title: 'Real-time WebSocket Framework',
          repository: 'socketio/socket.io',
          category: 'SILVER',
          score: 82,
          description: 'Real-time bidirectional event-based communication',
          metrics: {
            stars: 12500,
            forks: 1800,
            contributors: 220,
            lastUpdate: '3 days ago'
          },
          opportunity: 'Managed hosting service for WebSocket apps',
          estimatedValue: '€25K-60K', 
          tags: ['WebSocket', 'Real-time', 'Communication']
        },
        {
          id: 'opp_004',
          title: 'API Documentation Tool',
          repository: 'stoplightio/spectral',
          category: 'BRONZE',
          score: 65,
          description: 'JSON/YAML linter with OpenAPI support',
          metrics: {
            stars: 4200,
            forks: 380,
            contributors: 85,
            lastUpdate: '1 week ago'
          },
          opportunity: 'Enhanced SaaS version with team features',
          estimatedValue: '€8K-20K',
          tags: ['Documentation', 'OpenAPI', 'Validation']
        }
      ],
      scanStatus: [
        {
          name: 'GitHub Trending Scan',
          status: 'running',
          progress: 67,
          found: 23,
          lastRun: '2 minutes ago'
        },
        {
          name: 'ProductHunt Mining',
          status: 'completed',
          progress: 100,
          found: 8,
          lastRun: '1 hour ago'
        },
        {
          name: 'HackerNews Analysis', 
          status: 'queued',
          progress: 0,
          found: 0,
          lastRun: '3 hours ago'
        },
        {
          name: 'Stack Overflow Trends',
          status: 'running',
          progress: 34,
          found: 12,
          lastRun: '15 minutes ago'
        }
      ]
    }
    
    // Utiliser miningData ou fallbackData
    const finalData = miningData || fallbackData

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'GOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'SILVER': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'BRONZE': return 'bg-orange-100 text-orange-800 border-orange-300'
      default: return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'GOLD': return '🥇'
      case 'SILVER': return '🥈'
      case 'BRONZE': return '🥉'
      default: return '⭐'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'running': return 'text-blue-600 bg-blue-50'
      case 'completed': return 'text-green-600 bg-green-50'
      case 'queued': return 'text-gray-600 bg-gray-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading || !finalData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Scanning GitHub repositories en temps réel...</span>
      </div>
    )
  }

  // Indicateur des sources de données réelles
  const hasRealData = realDataSources && (realDataSources.githubAPI || realDataSources.endpointsService)

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Target className="mr-3 h-8 w-8" />
              ENDPOINTS Intelligence Mining
            </h1>
            <p className="text-indigo-100 mb-4">GitHub Intelligence Mining - Découverte automatique d'opportunités stratégiques</p>
            <div className="text-xs text-indigo-200">{currentTime}</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{finalData.overview.opportunitiesFound}</div>
            <div className="text-indigo-100 text-sm">Opportunités Trouvées</div>
            <div className="mt-2 flex items-center justify-end space-x-2 text-xs">
              {hasRealData ? (
                <>
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-green-200">Données réelles</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-yellow-200">Mode démo</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Métriques Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <Database className="h-6 w-6 mx-auto text-gray-600 mb-2" />
            <p className="text-sm text-gray-600">Repositories</p>
            <p className="text-xl font-bold text-gray-900">{finalData.overview.totalRepositories.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🥇</div>
            <p className="text-sm text-gray-600">Gold</p>
            <p className="text-xl font-bold text-yellow-600">{finalData.overview.goldOpportunities}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🥈</div>
            <p className="text-sm text-gray-600">Silver</p>
            <p className="text-xl font-bold text-gray-600">{finalData.overview.silverOpportunities}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🥉</div>
            <p className="text-sm text-gray-600">Bronze</p>
            <p className="text-xl font-bold text-orange-600">{finalData.overview.bronzeOpportunities}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <Activity className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Scans Actifs</p>
            <p className="text-xl font-bold text-blue-600">{finalData.overview.activeScans}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Score Moyen</p>
            <p className="text-xl font-bold text-green-600">78</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunités Récentes */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Dernières Découvertes
          </h3>
          <div className="space-y-4">
            {finalData.recentFindings.map((finding: any) => (
              <div key={finding.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{getCategoryIcon(finding.category)}</span>
                      <h4 className="font-semibold text-gray-900">{finding.title}</h4>
                      <div className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(finding.category)}`}>
                        {finding.category}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <GitBranch className="h-4 w-4 mr-1" />
                      <span className="mr-4">{finding.repository}</span>
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span>{finding.metrics.stars.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Score: {finding.score}/100</div>
                    <div className="text-xs text-green-600 font-medium">{finding.estimatedValue}</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{finding.description}</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <p className="text-sm text-blue-800">
                    <strong>Opportunité:</strong> {finding.opportunity}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>👥 {finding.metrics.contributors} contributors</span>
                    <span>🔱 {finding.metrics.forks} forks</span>
                    <span>🕐 Updated {finding.metrics.lastUpdate}</span>
                  </div>
                  <div className="flex space-x-2">
                    {finding.tags.map((tag: string, index: number) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status des Scans */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Scans en Cours
            </h3>
            <div className="space-y-4">
              {finalData.scanStatus.map((scan: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{scan.name}</h4>
                    <div className={`px-2 py-1 rounded text-xs ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </div>
                  </div>
                  
                  {scan.status === 'running' && (
                    <div className="mb-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${scan.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{scan.progress}% completed</div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{scan.found} opportunités trouvées</span>
                    <span>🕐 {scan.lastRun}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                <Search className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Nouveau Scan</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium text-green-600">Export Rapport</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                <Target className="h-4 w-4 mr-2 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Config Mining</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}