'use client'

import { 
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Users,
  MessageSquare,
  Zap,
  Settings,
  ArrowUp,
  ArrowDown,
  Bell,
  Phone,
  Mail
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function EscalationPage() {
  const { currentTime } = useCurrentTime()
  const [selectedRule, setSelectedRule] = useState<string | null>(null)
  
  // Fetch escalation data
  const { data: escalationData, isLoading } = useQuery({
    queryKey: ['escalation-rules'],
    queryFn: () => nexiaApi.fetchStatus(),
    refetchInterval: 10000,
    retry: 3,
    retryDelay: 1000
  });

  const escalationRules = [
    {
      id: 'critical-system',
      name: 'Alertes Système Critiques',
      description: 'Défaillance totale ou dégradation majeure',
      severity: 'critical',
      status: 'active',
      triggerTime: '0 min',
      escalationPath: ['On-call Engineer', 'Team Lead', 'CTO'],
      currentLevel: 1,
      activeAlerts: 3,
      lastTriggered: '5min ago',
      channels: ['Slack', 'SMS', 'Phone'],
      conditions: 'Service down > 30s OR Error rate > 50%'
    },
    {
      id: 'high-performance',
      name: 'Performance Dégradée',
      description: 'Latence élevée ou charge excessive',
      severity: 'high',
      status: 'active',
      triggerTime: '5 min',
      escalationPath: ['DevOps Team', 'Engineering Lead'],
      currentLevel: 0,
      activeAlerts: 7,
      lastTriggered: '15min ago',
      channels: ['Slack', 'Email'],
      conditions: 'Latency > 2s OR CPU > 90% for 5min'
    },
    {
      id: 'medium-capacity',
      name: 'Capacité et Ressources',
      description: 'Utilisation élevée des ressources',
      severity: 'medium',
      status: 'active',
      triggerTime: '15 min',
      escalationPath: ['Infrastructure Team'],
      currentLevel: 0,
      activeAlerts: 2,
      lastTriggered: '1h ago',
      channels: ['Slack'],
      conditions: 'Memory > 85% OR Disk > 90% for 15min'
    },
    {
      id: 'business-impact',
      name: 'Impact Business',
      description: 'Problèmes affectant les revenus',
      severity: 'critical',
      status: 'active',
      triggerTime: '1 min',
      escalationPath: ['Product Owner', 'VP Engineering', 'CEO'],
      currentLevel: 2,
      activeAlerts: 1,
      lastTriggered: '2min ago',
      channels: ['Phone', 'SMS', 'Slack'],
      conditions: 'Payment system down OR API quota exceeded'
    },
    {
      id: 'security-breach',
      name: 'Sécurité et Intrusion',
      description: 'Tentatives d\'intrusion ou failles',
      severity: 'critical',
      status: 'paused',
      triggerTime: '0 min',
      escalationPath: ['Security Team', 'CISO', 'Legal'],
      currentLevel: 0,
      activeAlerts: 0,
      lastTriggered: '2d ago',
      channels: ['Secure Phone', 'Encrypted Email'],
      conditions: 'Failed login > 100/min OR Suspicious API access'
    }
  ]

  const escalationStats = [
    {
      name: 'Règles Actives',
      value: '4',
      total: '5',
      status: 'healthy',
      trend: '0',
      icon: <Target className="h-5 w-5" />
    },
    {
      name: 'Alertes Escaladées',
      value: '13',
      total: '25',
      status: 'warning',
      trend: '+8',
      icon: <ArrowUp className="h-5 w-5" />
    },
    {
      name: 'Niveau Moyen',
      value: '0.8',
      total: '3',
      status: 'healthy',
      trend: '+0.2',
      icon: <Activity className="h-5 w-5" />
    },
    {
      name: 'Temps Résolution',
      value: '12min',
      total: '30min',
      status: 'healthy',
      trend: '-3min',
      icon: <Clock className="h-5 w-5" />
    }
  ]

  const recentEscalations = [
    {
      id: 'esc-001',
      timestamp: '14:35:22',
      rule: 'Impact Business',
      alert: 'OnlyOneAPI payment system timeout',
      level: 2,
      escalatedTo: 'VP Engineering',
      status: 'active',
      duration: '8min',
      channel: 'Phone + SMS'
    },
    {
      id: 'esc-002',
      timestamp: '14:20:15',
      rule: 'Alertes Système Critiques',
      alert: 'KREACH database connection lost',
      level: 1,
      escalatedTo: 'Team Lead',
      status: 'resolved',
      duration: '15min',
      channel: 'Slack + SMS'
    },
    {
      id: 'esc-003',
      timestamp: '14:05:44',
      rule: 'Performance Dégradée',
      alert: 'BlueOcean API latency > 3s',
      level: 0,
      escalatedTo: 'DevOps Team',
      status: 'acknowledged',
      duration: '22min',
      channel: 'Slack'
    },
    {
      id: 'esc-004',
      timestamp: '13:45:33',
      rule: 'Capacité et Ressources',
      alert: 'Kubernetes node memory 95%',
      level: 0,
      escalatedTo: 'Infrastructure Team',
      status: 'resolved',
      duration: '35min',
      channel: 'Slack'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'paused':
        return <Clock className="h-5 w-5 text-gray-400" />
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'acknowledged':
        return <Bell className="h-5 w-5 text-yellow-500" />
      default:
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'paused':
        return 'text-gray-600 bg-gray-100 border-gray-200'
      case 'resolved':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'acknowledged':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      default:
        return 'text-red-600 bg-red-100 border-red-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'paused':
        return 'En pause'
      case 'resolved':
        return 'Résolu'
      case 'acknowledged':
        return 'Acquitté'
      default:
        return 'Erreur'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getChannelIcon = (channel: string) => {
    if (channel.includes('Phone')) return <Phone className="h-4 w-4" />
    if (channel.includes('SMS')) return <MessageSquare className="h-4 w-4" />
    if (channel.includes('Email')) return <Mail className="h-4 w-4" />
    return <MessageSquare className="h-4 w-4" />
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-nexia-primary mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">Escalation Manager</h1>
              <p className="text-sm text-nexia-600">Gestion automatique des escalades d'alertes</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {escalationStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-red-100 text-red-600' : 
                stat.trend.startsWith('-') ? 'bg-green-100 text-green-600' : 
                'bg-gray-100 text-gray-600'
              }`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-nexia-dark">{stat.value}</p>
              <p className="text-sm text-nexia-500">{stat.name}</p>
              {stat.total && (
                <p className="text-xs text-nexia-400">sur {stat.total}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Escalation Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {escalationRules.map((rule) => (
          <div 
            key={rule.id} 
            className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
              selectedRule === rule.id 
                ? 'border-nexia-primary ring-2 ring-nexia-primary/20' 
                : 'border-gray-200 hover:border-nexia-300'
            }`}
            onClick={() => setSelectedRule(rule.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  {getStatusIcon(rule.status)}
                  <h3 className="ml-2 text-lg font-semibold text-nexia-dark">{rule.name}</h3>
                </div>
                <p className="text-sm text-nexia-600 mb-2">{rule.description}</p>
                <div className="flex items-center space-x-4 text-xs text-nexia-500">
                  <span>Trigger: {rule.triggerTime}</span>
                  <span>{rule.activeAlerts} alertes actives</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                  {getStatusText(rule.status)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(rule.severity)}`}>
                  {rule.severity}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-nexia-500 uppercase tracking-wider mb-2">Chemin d'Escalade</p>
              <div className="flex items-center space-x-2">
                {rule.escalationPath.map((level, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`px-2 py-1 text-xs rounded ${
                      index <= rule.currentLevel 
                        ? 'bg-nexia-primary text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {level}
                    </div>
                    {index < rule.escalationPath.length - 1 && (
                      <ArrowUp className="h-3 w-3 text-gray-400 mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-nexia-500 uppercase tracking-wider mb-1">Canaux de Notification</p>
              <div className="flex items-center space-x-2">
                {rule.channels.map((channel, index) => (
                  <div key={index} className="flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                    {getChannelIcon(channel)}
                    <span className="ml-1">{channel}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-nexia-500 mb-1">Conditions</p>
              <p className="text-sm text-nexia-600 mb-2">{rule.conditions}</p>
              <p className="text-xs text-nexia-400">Dernière activation: {rule.lastTriggered}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Escalations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nexia-dark">Escalades Récentes</h2>
          <button className="flex items-center px-3 py-1 text-sm text-nexia-600 hover:text-nexia-800">
            <Settings className="h-4 w-4 mr-1" />
            Configurer
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alerte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Règle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escaladé vers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentEscalations.map((escalation) => (
                <tr key={escalation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-nexia-dark">
                        {escalation.alert}
                      </div>
                      <div className="text-xs text-nexia-500">
                        {escalation.timestamp} • {escalation.channel}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-nexia-600">{escalation.rule}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-nexia-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {escalation.level}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-nexia-600">{escalation.escalatedTo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(escalation.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(escalation.status)}`}>
                        {getStatusText(escalation.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-nexia-600">{escalation.duration}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}