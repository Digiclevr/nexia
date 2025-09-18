'use client'

import { 
  Brain,
  Activity,
  Terminal,
  Code,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Zap,
  FileText,
  GitBranch,
  Monitor,
  Settings,
  Play,
  Pause,
  Eye,
  MessageSquare
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function ClaudeCodePage() {
  const { currentTime } = useCurrentTime()
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  
  // Fetch Claude Code ecosystem data
  const { data: claudeData, isLoading } = useQuery({
    queryKey: ['claude-code-ecosystem'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000
  });

  const claudeAgents = [
    {
      id: 'supervision-agent',
      name: 'Supervision Agent',
      description: 'Surveillance continue écosystème technique',
      status: 'active',
      uptime: '99.9%',
      sessionsToday: 47,
      commandsExecuted: 234,
      lastActivity: '2min ago',
      currentTask: 'Monitoring KREACH deployment',
      performance: 'Excellent',
      contextSize: '185k tokens',
      responseTime: '1.2s',
      successRate: '98.7%'
    },
    {
      id: 'development-agent',
      name: 'Development Agent',
      description: 'Assistance développement & debug',
      status: 'active',
      uptime: '99.2%',
      sessionsToday: 23,
      commandsExecuted: 156,
      lastActivity: '5min ago',
      currentTask: 'NEXIA supervisor development',
      performance: 'Très bon',
      contextSize: '167k tokens',
      responseTime: '1.5s',
      successRate: '96.4%'
    },
    {
      id: 'automation-agent',
      name: 'Automation Agent',
      description: 'Scripts & workflows automatisés',
      status: 'warning',
      uptime: '97.8%',
      sessionsToday: 18,
      commandsExecuted: 89,
      lastActivity: '15min ago',
      currentTask: 'CI/CD pipeline optimization',
      performance: 'Moyen',
      contextSize: '142k tokens',
      responseTime: '2.1s',
      successRate: '94.2%'
    }
  ]

  const agentMetrics = [
    {
      name: 'Sessions Actives',
      value: '3',
      target: '3',
      progress: 100,
      trend: '100%',
      icon: <Brain className="h-5 w-5" />,
      status: 'healthy'
    },
    {
      name: 'Commandes/Jour',
      value: '479',
      target: '500',
      progress: 95.8,
      trend: '+23',
      icon: <Terminal className="h-5 w-5" />,
      status: 'healthy'
    },
    {
      name: 'Temps Réponse',
      value: '1.6s',
      target: '2.0s',
      progress: 80.0,
      trend: '-0.2s',
      icon: <Zap className="h-5 w-5" />,
      status: 'healthy'
    },
    {
      name: 'Taux Succès',
      value: '96.4%',
      target: '95%',
      progress: 101.5,
      trend: '+1.2%',
      icon: <CheckCircle className="h-5 w-5" />,
      status: 'healthy'
    }
  ]

  const recentSessions = [
    {
      id: 'session-001',
      timestamp: '14:35:22',
      agent: 'Supervision Agent',
      task: 'KREACH deployment monitoring',
      status: 'active',
      duration: '45min',
      commands: 23,
      context: 'Production deployment',
      lastCommand: 'kubectl get pods -n kreach-dev'
    },
    {
      id: 'session-002',
      timestamp: '14:20:15',
      agent: 'Development Agent',
      task: 'NEXIA page creation',
      status: 'completed',
      duration: '1h 15min',
      commands: 34,
      context: 'Frontend development',
      lastCommand: 'npm run build'
    },
    {
      id: 'session-003',
      timestamp: '14:05:44',
      agent: 'Automation Agent',
      task: 'Pipeline optimization',
      status: 'paused',
      duration: '30min',
      commands: 12,
      context: 'CI/CD workflow',
      lastCommand: 'git push origin main'
    },
    {
      id: 'session-004',
      timestamp: '13:50:33',
      agent: 'Supervision Agent',
      task: 'Infrastructure health check',
      status: 'completed',
      duration: '20min',
      commands: 18,
      context: 'System monitoring',
      lastCommand: 'docker ps -a'
    }
  ]

  const codeStatistics = [
    {
      category: 'Files Created',
      count: 47,
      trend: '+12',
      icon: <FileText className="h-4 w-4" />
    },
    {
      category: 'Git Commits',
      count: 23,
      trend: '+6',
      icon: <GitBranch className="h-4 w-4" />
    },
    {
      category: 'Bugs Fixed',
      count: 18,
      trend: '+4',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      category: 'Tests Added',
      count: 31,
      trend: '+8',
      icon: <Code className="h-4 w-4" />
    }
  ]

  const recentActivity = [
    {
      id: 1,
      timestamp: '14:35:22',
      event: 'Page ecosystems/claude-code créée',
      type: 'development',
      status: 'success',
      details: 'NEXIA supervisor - nouvelle page complète'
    },
    {
      id: 2,
      timestamp: '14:30:15',
      event: 'KREACH deployment monitored',
      type: 'monitoring',
      status: 'active',
      details: 'Surveillance déploiement en cours'
    },
    {
      id: 3,
      timestamp: '14:25:44',
      event: 'API endpoint health check',
      type: 'monitoring',
      status: 'success',
      details: 'Tous endpoints opérationnels'
    },
    {
      id: 4,
      timestamp: '14:20:33',
      event: 'Docker container optimized',
      type: 'automation',
      status: 'success',
      details: 'Image size reduced by 30%'
    },
    {
      id: 5,
      timestamp: '14:15:10',
      event: 'Database migration executed',
      type: 'development',
      status: 'success',
      details: 'PostgreSQL schema updated'
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
      case 'paused':
        return <Pause className="h-5 w-5 text-gray-400" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
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
      case 'paused':
        return 'text-gray-600 bg-gray-100 border-gray-200'
      case 'completed':
        return 'text-blue-600 bg-blue-100 border-blue-200'
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
      case 'paused':
        return 'En pause'
      case 'completed':
        return 'Terminé'
      default:
        return 'Inconnu'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'development':
        return 'text-blue-600 bg-blue-100'
      case 'monitoring':
        return 'text-green-600 bg-green-100'
      case 'automation':
        return 'text-purple-600 bg-purple-100'
      case 'deployment':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active':
        return <Play className="h-4 w-4 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return 'text-green-600 bg-green-100'
      case 'Très bon':
        return 'text-blue-600 bg-blue-100'
      case 'Bon':
        return 'text-yellow-600 bg-yellow-100'
      case 'Moyen':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">Claude Code 24/7</h1>
              <p className="text-sm text-nexia-600">Agent Claude supervision technique</p>
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
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Claude Code Agent Status</h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>2 agents actifs</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>1 agent en attention</span>
              </div>
              <div className="flex items-center">
                <Terminal className="h-5 w-5 mr-2" />
                <span>479 commandes aujourd'hui</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">99.0%</p>
            <p className="text-sm opacity-90">Disponibilité moyenne</p>
          </div>
        </div>
      </div>

      {/* Agent Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {agentMetrics.map((metric, index) => (
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
                style={{ width: `${Math.min(100, metric.progress)}%` }}
              ></div>
            </div>
            <p className="text-xs text-nexia-500 mt-1">{metric.progress.toFixed(1)}% de l'objectif</p>
          </div>
        ))}
      </div>

      {/* Code Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {codeStatistics.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-nexia-dark">{stat.count}</p>
              <p className="text-xs text-nexia-500">{stat.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {claudeAgents.map((agent) => (
          <div 
            key={agent.id} 
            className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
              selectedSession === agent.id 
                ? 'border-orange-500 ring-2 ring-orange-500/20' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => setSelectedSession(agent.id)}
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
                  <span>{agent.sessionsToday} sessions</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                {getStatusText(agent.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Performance</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Niveau</span>
                    <span className={`text-xs px-1 py-0.5 rounded ${getPerformanceColor(agent.performance)}`}>
                      {agent.performance}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Temps rép.</span>
                    <span className="text-sm font-medium">{agent.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Succès</span>
                    <span className="text-sm font-medium">{agent.successRate}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-nexia-500 uppercase tracking-wider">Activité</p>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Commandes</span>
                    <span className="text-sm font-medium">{agent.commandsExecuted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Context</span>
                    <span className="text-sm font-medium">{agent.contextSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Dernière</span>
                    <span className="text-sm font-medium">{agent.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-nexia-500 uppercase tracking-wider mb-1">Tâche Actuelle</p>
              <p className="text-sm font-medium text-nexia-dark">{agent.currentTask}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sessions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-nexia-dark">Sessions Récentes</h2>
            <button className="flex items-center px-3 py-1 text-sm text-nexia-600 hover:text-nexia-800">
              <Eye className="h-4 w-4 mr-1" />
              Voir tout
            </button>
          </div>
          
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getStatusIcon(session.status)}
                    <span className="ml-2 font-medium text-nexia-dark">{session.agent}</span>
                  </div>
                  <span className="text-xs text-nexia-500">{session.timestamp}</span>
                </div>
                <p className="text-sm text-nexia-600 mb-2">{session.task}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-nexia-500">
                  <div>Durée: {session.duration}</div>
                  <div>Commandes: {session.commands}</div>
                  <div className="col-span-2">Dernière: {session.lastCommand}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-nexia-dark">Activité Agent</h2>
            <button className="flex items-center px-3 py-1 text-sm text-nexia-600 hover:text-nexia-800">
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
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
    </div>
  )
}