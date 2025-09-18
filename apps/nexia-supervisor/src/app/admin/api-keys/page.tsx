'use client'

import React, { useState } from 'react'
import { 
  Shield, 
  RefreshCw, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  Key, 
  Calendar,
  Activity,
  Globe,
  Database,
  Clock
} from 'lucide-react'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function APIKeysPage() {
  const { currentTime } = useCurrentTime()
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const apiKeys = [
    {
      id: 'nexia-001',
      name: 'NEXIA Supervisor API',
      key: 'nex_live_sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
      scope: 'admin',
      created: '2025-09-15',
      lastUsed: '2025-09-16',
      requests: 1247,
      status: 'active',
      description: 'Clé principale pour supervision écosystème'
    },
    {
      id: 'apollo-001',
      name: 'Apollo.io Integration',
      key: 'HN8xpRGN-TcZKqDTFZB0yw',
      scope: 'external',
      created: '2025-08-20',
      lastUsed: '2025-09-16',
      requests: 2834,
      status: 'active',
      description: 'Prospection B2B pour FASTCASH domaines'
    },
    {
      id: 'onlyoneapi-001',
      name: 'OnlyOneAPI Health Check',
      key: 'ooa_prod_sk_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k',
      scope: 'readonly',
      created: '2025-09-10',
      lastUsed: '2025-09-16',
      requests: 896,
      status: 'active',
      description: 'Monitoring santé OnlyOneAPI services'
    },
    {
      id: 'blueocean-001',
      name: 'BlueOcean Cluster Access',
      key: 'boc_k8s_sk_3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y',
      scope: 'cluster',
      created: '2025-08-30',
      lastUsed: '2025-09-15',
      requests: 5621,
      status: 'active',
      description: 'Accès Kubernetes cluster BlueOcean'
    },
    {
      id: 'legacy-001',
      name: 'Legacy Development Key',
      key: 'dev_test_sk_obsolete_1234567890abcdef',
      scope: 'development',
      created: '2025-07-15',
      lastUsed: '2025-08-10',
      requests: 234,
      status: 'revoked',
      description: 'Ancienne clé développement (révoquée)'
    }
  ]

  const toggleKeyVisibility = (id: string) => {
    setShowKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = async (key: string, id: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Erreur copie:', error)
    }
  }

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'admin': return <Shield className="h-4 w-4 text-red-600" />
      case 'external': return <Globe className="h-4 w-4 text-blue-600" />
      case 'readonly': return <Eye className="h-4 w-4 text-green-600" />
      case 'cluster': return <Database className="h-4 w-4 text-purple-600" />
      case 'development': return <Activity className="h-4 w-4 text-orange-600" />
      default: return <Key className="h-4 w-4 text-gray-600" />
    }
  }

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'external': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'readonly': return 'bg-green-100 text-green-800 border-green-200'
      case 'cluster': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'development': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'revoked': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateKey = () => {
    alert('🔐 Création nouvelle API Key - Sélectionnez le scope et permissions')
  }

  const handleRevokeKey = (name: string) => {
    alert(`🚫 Révoquer la clé "${name}" - Confirmer l'action`)
  }

  const handleRefresh = () => {
    alert('🔄 Actualisation des API Keys - Vérification status et usage')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Gestion API Keys</h1>
              <p className="text-sm text-gray-600">Administration des clés d'accès NEXIA Ecosystem</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-gray-900">{currentTime}</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
            <button 
              onClick={handleCreateKey}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Clé
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clés Actives</p>
                <p className="text-2xl font-bold text-green-600">4</p>
              </div>
              <Key className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requêtes Aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">10.8K</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clés Révoquées</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dernière Activité</p>
                <p className="text-2xl font-bold text-gray-900">2min</p>
              </div>
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="flex-1 p-4">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Clés API Configurées</h2>
            <p className="text-sm text-gray-600">Gestion des accès et permissions écosystème</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clé API
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scope
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                        <div className="text-sm text-gray-500">{apiKey.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Créée le {apiKey.created} • Dernière utilisation: {apiKey.lastUsed}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border">
                          {showKey[apiKey.id] ? apiKey.key : `${apiKey.key.substring(0, 20)}...`}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {showKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {copied === apiKey.id && (
                          <span className="text-xs text-green-600 font-medium">Copié!</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getScopeIcon(apiKey.scope)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScopeColor(apiKey.scope)}`}>
                          {apiKey.scope}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{apiKey.requests.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">requêtes totales</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apiKey.status)}`}>
                        {apiKey.status === 'active' ? 'Actif' : apiKey.status === 'revoked' ? 'Révoqué' : 'Expiré'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {apiKey.status === 'active' && (
                          <button
                            onClick={() => handleRevokeKey(apiKey.name)}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Révoquer la clé"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
