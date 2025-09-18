'use client'

import { 
  Users,
  Activity,
  Bot,
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  DollarSign,
  BarChart3,
  Target,
  Eye,
  Settings,
  Play,
  Pause,
  MessageSquare
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function BusinessAutomationPage() {
  const { currentTime } = useCurrentTime()
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  
  // Fetch Business Automation ecosystem data
  const { data: businessData, isLoading } = useQuery({
    queryKey: ['business-automation-ecosystem'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000
  });

  const autonomousAgents = [
    {
      id: 'api-audits',
      name: 'API Audits Agent',
      description: 'Prospection CTOs & audit automation',
      status: 'active',
      target: 'En configuration',
      current: 'En développement',
      progress: 0,
      leads: 0,
      conversions: 0,
      uptime: 'N/A',
      lastRun: 'Jamais',
      nextRun: 'Configuration requise',
      tasks: ['CTO outreach', 'Audit scheduling', 'Report generation']
    },
    {
      id: 'emergency-consulting',
      name: 'Emergency Consulting',
      description: 'Monitoring crises API & intervention',
      status: 'active',
      target: 'En configuration',
      current: 'En développement',
      progress: 0,
      leads: 0,
      conversions: 0,
      uptime: 'N/A',
      lastRun: 'Jamais',
      nextRun: 'Configuration requise',
      tasks: ['Crisis monitoring', 'Client alerts', 'Emergency response']
    },
    {
      id: 'affiliation-ecosystem',
      name: 'Affiliation Ecosystem',
      description: '87 domaines content automation',
      status: 'active',
      target: 'En configuration',
      current: 'En développement',
      progress: 0,
      leads: 0,
      conversions: 0,
      uptime: 'N/A',
      lastRun: 'Jamais',
      nextRun: 'Configuration requise',
      tasks: ['Content generation', 'SEO optimization', 'Revenue tracking']
    },
    {
      id: 'technical-writing',
      name: 'Technical Writing',
      description: 'Documentation & articles techniques',
      status: 'active',
      target: 'En configuration',
      current: 'En développement',
      progress: 0,
      leads: 0,
      conversions: 0,
      uptime: 'N/A',
      lastRun: 'Jamais',
      nextRun: 'Configuration requise',
      tasks: ['Article writing', 'Documentation updates', 'SEO content']
    },
    {
      id: 'api-troubleshooting',
      name: 'API Troubleshooting',
      description: 'Support développeurs & solutions',
      status: 'warning',
      target: 'En configuration',
      current: 'En développement',
      progress: 0,
      leads: 0,
      conversions: 0,
      uptime: 'N/A',
      lastRun: 'Jamais',
      nextRun: 'Configuration requise',
      tasks: ['Issue resolution', 'Developer support', 'Solution delivery']
    },
    {
      id: 'done-for-you',
      name: 'Done-for-You Services',
      description: 'Services delivery automation',
      status: 'active',
      target: 'En configuration',
      current: 'En développement',
      progress: 0,
      leads: 0,
      conversions: 0,
      uptime: 'N/A',
      lastRun: 'Jamais',
      nextRun: 'Configuration requise',
      tasks: ['Service delivery', 'Client onboarding', 'Quality assurance']
    },
    {
      id: 'founding-members',
      name: 'Founding Members',
      description: 'Community building & onboarding',
      status: 'active',
      target: 'En configuration',
      current: 'En développement',
      progress: 0,
      leads: 0,
      conversions: 0,
      uptime: 'N/A',
      lastRun: 'Jamais',
      nextRun: 'Configuration requise',
      tasks: ['Member recruitment', 'Onboarding flow', 'Community engagement']
    }
  ]

  const businessMetrics = [
    {
      name: 'Total Revenue',
      value: 'En config',
      target: 'À définir',
      progress: 0,
      trend: 'N/A',
      icon: <DollarSign className="h-5 w-5" />,
      status: 'warning'
    },
    {
      name: 'Active Agents',
      value: '7',
      target: '7',
      progress: 100,
      trend: 'Concepts',
      icon: <Bot className="h-5 w-5" />,
      status: 'healthy'
    },
    {
      name: 'Total Leads',
      value: '0',
      target: 'À définir',
      progress: 0,
      trend: 'En attente',
      icon: <Users className="h-5 w-5" />,
      status: 'warning'
    },
    {
      name: 'Conversions',
      value: '0',
      target: 'À définir',
      progress: 0,
      trend: 'En attente',
      icon: <Target className="h-5 w-5" />,
      status: 'warning'
    }
  ]

  const workflows = [
    {
      id: 'voice-cloning',
      name: 'Voice Cloning',
      description: 'Génération de voix synthétiques',
      status: 'inactive',
      runs: 0,
      successRate: 'N/A',
      avgDuration: 'N/A'
    },
    {
      id: 'avatar-creation',
      name: 'Avatar Creation',
      description: 'Création d\'avatars personnalisés',
      status: 'inactive',
      runs: 0,
      successRate: 'N/A',
      avgDuration: 'N/A'
    },
    {
      id: 'video-generation',
      name: 'Video Generation',
      description: 'Production vidéo automatisée',
      status: 'inactive',
      runs: 0,
      successRate: 'N/A',
      avgDuration: 'N/A'
    },
    {
      id: 'user-onboarding',
      name: 'User Onboarding',
      description: 'Processus d\'intégration utilisateur',
      status: 'inactive',
      runs: 0,
      successRate: 'N/A',
      avgDuration: 'N/A'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      timestamp: currentTime,
      event: 'Écosystème Business Automation initialisé',
      type: 'system',
      status: 'success',
      details: '7 agents configurés en attente de déploiement'
    },
    {
      id: 2,
      timestamp: currentTime,
      event: 'Configuration des workflows N8N en cours',
      type: 'config',
      status: 'warning',
      details: 'Workflows en attente de configuration'
    },
    {
      id: 3,
      timestamp: currentTime,
      event: 'Interface de supervision active',
      type: 'system',
      status: 'success',
      details: 'Dashboard NEXIA opérationnel'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'inactive':
        return <Clock className="h-5 w-5 text-gray-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'inactive':
        return 'text-gray-600 bg-gray-100 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'warning':
        return 'Attention'
      case 'error':
        return 'Erreur'
      case 'inactive':
        return 'Inactif'
      default:
        return 'Inconnu'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'text-green-600 bg-green-100'
      case 'alert':
        return 'text-yellow-600 bg-yellow-100'
      case 'content':
        return 'text-blue-600 bg-blue-100'
      case 'support':
        return 'text-purple-600 bg-purple-100'
      case 'business':
        return 'text-indigo-600 bg-indigo-100'
      case 'system':
        return 'text-blue-600 bg-blue-100'
      case 'config':
        return 'text-orange-600 bg-orange-100'
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
            <Users className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">Business Automation</h1>
              <p className="text-sm text-nexia-600">7 agents autonomes 24/7 • Phase de développement</p>
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Écosystème Business Automation</h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>7 agents en configuration</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Workflows en attente</span>
              </div>
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                <span>Phase de développement</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">0%</p>
            <p className="text-sm opacity-90">En configuration</p>
          </div>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {businessMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {metric.icon}
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.status === 'healthy' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
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
                  metric.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${metric.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-nexia-500 mt-1">{metric.progress.toFixed(1)}% de l'objectif</p>
          </div>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {autonomousAgents.map((agent) => (
          <div 
            key={agent.id} 
            className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
              selectedAgent === agent.id 
                ? 'border-purple-500 ring-2 ring-purple-500/20' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSelectedAgent(agent.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  {getStatusIcon(agent.status)}
                  <h3 className="ml-2 text-lg font-semibold text-nexia-dark">{agent.name}</h3>
                </div>
                <p className="text-sm text-nexia-600 mb-2">{agent.description}</p>
                <div className="flex items-center space-x-4 text-xs text-nexia-500">
                  <span>Uptime {agent.uptime}</span>
                  <span>{agent.leads} leads</span>
                  <span>{agent.conversions} conversions</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                {getStatusText(agent.status)}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-nexia-600">Objectif Revenue</span>
                <span className="text-sm text-nexia-500">{agent.current} / {agent.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full" 
                  style={{ width: `${agent.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-nexia-500 mt-1">{agent.progress.toFixed(1)}% de l'objectif atteint</p>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-nexia-700 font-semibold uppercase tracking-wider mb-3">Tâches Actives</p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {agent.tasks.map((task, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-nexia-700 font-medium">{task}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-nexia-500">Dernière exécution: {agent.lastRun}</span>
                <span className="text-nexia-400">Prochaine: {agent.nextRun}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* N8N Workflows */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nexia-dark">N8N Workflows</h2>
          <button className="flex items-center px-3 py-1 text-sm text-nexia-600 hover:text-nexia-800">
            <Settings className="h-4 w-4 mr-1" />
            Gérer
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-nexia-dark">{workflow.name}</h3>
                {getStatusIcon(workflow.status)}
              </div>
              <p className="text-sm text-nexia-600 mb-3">{workflow.description}</p>
              <div className="space-y-1 text-xs text-nexia-500">
                <div className="flex justify-between">
                  <span>Exécutions</span>
                  <span>{workflow.runs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Succès</span>
                  <span>{workflow.successRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée moy.</span>
                  <span>{workflow.avgDuration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nexia-dark">Activité Agents</h2>
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