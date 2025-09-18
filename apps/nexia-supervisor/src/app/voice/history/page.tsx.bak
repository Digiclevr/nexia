'use client'

import { 
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mic,
  Volume2,
  Search,
  Filter,
  Download,
  Calendar
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { useClientTime } from '@/hooks/useClientTime'

export default function VoiceHistoryPage() {
  const { currentTime } = useCurrentTime()
  const { formatTime, formatRelativeTime } = useClientTime()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  
  // Fetch voice history data
  const { data: historyData, isLoading } = useQuery({
    queryKey: ['voice-history'],
    queryFn: () => nexiaApi.fetchStatus(),
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000
  });

  const voiceHistory = [
    {
      id: 'VH-001',
      timestamp: '2025-09-15T14:25:33Z',
      command: 'Status de BlueOcean',
      response: 'BlueOcean fonctionne normalement. 15 services actifs, uptime 99.2%',
      duration: '2.3s',
      status: 'success',
      source: 'Siri Shortcuts',
      ecosystem: 'BlueOcean',
      confidence: 0.95
    },
    {
      id: 'VH-002',
      timestamp: '2025-09-15T14:22:15Z',
      command: 'Déployer KREACH en staging',
      response: 'Déploiement KREACH staging initié. ETA: 3 minutes',
      duration: '1.8s',
      status: 'success',
      source: 'Siri Shortcuts',
      ecosystem: 'KREACH',
      confidence: 0.92
    },
    {
      id: 'VH-003',
      timestamp: '2025-09-15T14:18:44Z',
      command: 'Alertes critiques OnlyOneAPI',
      response: '1 alerte active: Latence élevée API détectée il y a 12 minutes',
      duration: '2.1s',
      status: 'warning',
      source: 'Interface Web',
      ecosystem: 'OnlyOneAPI',
      confidence: 0.88
    },
    {
      id: 'VH-004',
      timestamp: '2025-09-15T14:15:22Z',
      command: 'Redémarrer service business automation',
      response: 'Service business-automation redémarré avec succès',
      duration: '3.2s',
      status: 'success',
      source: 'Siri Shortcuts',
      ecosystem: 'Business-Automation',
      confidence: 0.97
    },
    {
      id: 'VH-005',
      timestamp: '2025-09-15T14:12:10Z',
      command: 'Performance cluster Kubernetes',
      response: 'CPU: 65%, Mémoire: 78%, 12 pods actifs',
      duration: '1.5s',
      status: 'success',
      source: 'Interface Web',
      ecosystem: 'Infrastructure',
      confidence: 0.91
    },
    {
      id: 'VH-006',
      timestamp: '2025-09-15T14:08:55Z',
      command: 'Status Claude Code agent',
      response: 'Erreur de connexion au service Claude Code',
      duration: '4.1s',
      status: 'error',
      source: 'Siri Shortcuts',
      ecosystem: 'Claude Code 24/7',
      confidence: 0.83
    },
    {
      id: 'VH-007',
      timestamp: '2025-09-15T14:05:12Z',
      command: 'Backup base de données',
      response: 'Backup PostgreSQL terminé - 2.3GB sauvegardés',
      duration: '2.8s',
      status: 'success',
      source: 'Interface Web',
      ecosystem: 'Infrastructure',
      confidence: 0.94
    },
    {
      id: 'VH-008',
      timestamp: '2025-09-15T14:02:45Z',
      command: 'Historique déploiements NEXTGEN',
      response: '3 déploiements ce mois: 2 réussis, 1 en cours',
      duration: '1.9s',
      status: 'success',
      source: 'Siri Shortcuts',
      ecosystem: 'NEXTGEN',
      confidence: 0.89
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Succès'
      case 'warning':
        return 'Attention'
      case 'error':
        return 'Erreur'
      default:
        return 'Inconnu'
    }
  }

  const getSourceIcon = (source: string) => {
    return source === 'Siri Shortcuts' 
      ? <Mic className="h-4 w-4 text-purple-500" />
      : <Volume2 className="h-4 w-4 text-blue-500" />
  }

  const filteredHistory = voiceHistory.filter(item => {
    const matchesSearch = item.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.response.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: voiceHistory.length,
    success: voiceHistory.filter(h => h.status === 'success').length,
    warning: voiceHistory.filter(h => h.status === 'warning').length,
    error: voiceHistory.filter(h => h.status === 'error').length,
    avgDuration: '2.3s',
    avgConfidence: '92%'
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <RefreshCw className="h-6 w-6 text-nexia-primary mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">Historique Vocal NEXIA</h1>
              <p className="text-sm text-nexia-600">Journal complet des commandes vocales et réponses</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
            </div>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-nexia-primary">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
            <p className="text-sm text-gray-600">Succès</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
            <p className="text-sm text-gray-600">Alertes</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.error}</p>
            <p className="text-sm text-gray-600">Erreurs</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-nexia-primary">{stats.avgDuration}</p>
            <p className="text-sm text-gray-600">Durée Moy.</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.avgConfidence}</p>
            <p className="text-sm text-gray-600">Confiance</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les commandes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nexia-primary"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nexia-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="success">Succès</option>
              <option value="warning">Attention</option>
              <option value="error">Erreur</option>
            </select>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nexia-primary"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="all">Tout l'historique</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réponse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horodatage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-nexia-dark">
                        "{item.command}"
                      </div>
                      <div className="text-xs text-nexia-500">
                        {item.ecosystem} • Confiance: {Math.round(item.confidence * 100)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-nexia-600 max-w-xs truncate">
                      {item.response}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(item.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getSourceIcon(item.source)}
                      <span className="ml-2 text-sm text-nexia-600">{item.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-nexia-600">{item.duration}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-nexia-600">
                      {formatTime(item.timestamp)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun résultat trouvé pour les filtres sélectionnés
          </div>
        )}
      </div>
    </div>
  )
}