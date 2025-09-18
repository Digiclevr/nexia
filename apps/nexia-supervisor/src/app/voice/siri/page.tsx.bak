'use client'

import { 
  Zap,
  Smartphone,
  MessageSquare,
  Play,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  BarChart3,
  Mic
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function SiriPage() {
  const { currentTime } = useCurrentTime()
  const [selectedShortcut, setSelectedShortcut] = useState<string | null>(null)
  
  // Fetch Siri shortcuts data
  const { data: siriData, isLoading } = useQuery({
    queryKey: ['siri-shortcuts'],
    queryFn: () => nexiaApi.fetchStatus(),
    refetchInterval: 10000,
    retry: 3,
    retryDelay: 1000
  });

  const shortcuts = [
    {
      id: 'eco-status',
      name: 'Status Écosystème',
      phrase: 'Dis Siri, "Status NEXIA"',
      description: 'Obtient l\'état de tous les écosystèmes supervisés',
      category: 'Monitoring',
      icon: <Activity className="h-6 w-6" />,
      status: 'active',
      usage: 45,
      lastUsed: '2h ago'
    },
    {
      id: 'deploy-app',
      name: 'Déploiement Rapide',
      phrase: 'Dis Siri, "Déployer KREACH"',
      description: 'Lance un déploiement d\'application spécifique',
      category: 'Déploiement',
      icon: <Zap className="h-6 w-6" />,
      status: 'active',
      usage: 23,
      lastUsed: '4h ago'
    },
    {
      id: 'critical-alerts',
      name: 'Alertes Critiques',
      phrase: 'Dis Siri, "Alertes NEXIA"',
      description: 'Liste les alertes critiques actives',
      category: 'Alertes',
      icon: <AlertTriangle className="h-6 w-6" />,
      status: 'active',
      usage: 67,
      lastUsed: '30min ago'
    },
    {
      id: 'performance-kpi',
      name: 'KPIs Performance',
      phrase: 'Dis Siri, "Performance globale"',
      description: 'Résumé des métriques de performance',
      category: 'Analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'active',
      usage: 34,
      lastUsed: '1h ago'
    },
    {
      id: 'restart-service',
      name: 'Redémarrer Service',
      phrase: 'Dis Siri, "Redémarrer [service]"',
      description: 'Redémarre un service spécifique',
      category: 'Maintenance',
      icon: <Settings className="h-6 w-6" />,
      status: 'active',
      usage: 12,
      lastUsed: '3h ago'
    },
    {
      id: 'team-status',
      name: 'Status Équipe',
      phrase: 'Dis Siri, "Équipe NEXIA"',
      description: 'État des agents et équipes actives',
      category: 'Supervision',
      icon: <Users className="h-6 w-6" />,
      status: 'inactive',
      usage: 8,
      lastUsed: '2 days ago'
    }
  ]

  const categories = ['Tous', 'Monitoring', 'Déploiement', 'Alertes', 'Analytics', 'Maintenance', 'Supervision']
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const filteredShortcuts = selectedCategory === 'Tous' 
    ? shortcuts 
    : shortcuts.filter(s => s.category === selectedCategory)

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'text-green-600 bg-green-100' 
      : 'text-gray-600 bg-gray-100'
  }

  const getStatusIcon = (status: string) => {
    return status === 'active'
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <Clock className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-nexia-primary mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">Commandes Siri NEXIA</h1>
              <p className="text-sm text-nexia-600">Contrôle vocal avancé via Siri Shortcuts</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
            </div>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50">
              <Smartphone className="h-4 w-4 mr-2" />
              Installer Shortcuts
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shortcuts Actifs</p>
              <p className="text-2xl font-bold text-nexia-primary">5</p>
            </div>
            <Zap className="h-8 w-8 text-nexia-primary" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commandes Aujourd'hui</p>
              <p className="text-2xl font-bold text-green-600">189</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de Succès</p>
              <p className="text-2xl font-bold text-orange-600">98.3%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-nexia-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredShortcuts.map((shortcut) => (
          <div 
            key={shortcut.id} 
            className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
              selectedShortcut === shortcut.id 
                ? 'border-nexia-primary ring-2 ring-nexia-primary/20' 
                : 'border-gray-200 hover:border-nexia-300'
            }`}
            onClick={() => setSelectedShortcut(shortcut.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-nexia-50 rounded-lg mr-4">
                  {shortcut.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-nexia-dark">{shortcut.name}</h3>
                  <p className="text-sm text-nexia-600">{shortcut.description}</p>
                </div>
              </div>
              {getStatusIcon(shortcut.status)}
            </div>
            
            <div className="mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center">
                  <Mic className="h-4 w-4 text-nexia-primary mr-2" />
                  <span className="text-sm font-mono text-nexia-dark">
                    {shortcut.phrase}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(shortcut.status)}`}>
                  {shortcut.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
                <span className="text-xs text-gray-500">
                  {shortcut.usage} utilisations
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {shortcut.lastUsed}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Installation Guide */}
      <div className="bg-nexia-50 rounded-lg p-6">
        <div className="flex items-start">
          <Smartphone className="h-6 w-6 text-nexia-primary mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-nexia-dark mb-2">
              Installation des Siri Shortcuts
            </h3>
            <div className="space-y-2 text-sm text-nexia-700">
              <p>1. Ouvrir l'app <strong>Raccourcis</strong> sur votre iPhone</p>
              <p>2. Appuyer sur <strong>+</strong> pour créer un nouveau raccourci</p>
              <p>3. Rechercher <strong>"Obtenir le contenu d'une URL"</strong></p>
              <p>4. Configurer l'URL de l'API NEXIA correspondante</p>
              <p>5. Ajouter <strong>"Parler le texte"</strong> pour la réponse vocale</p>
              <p>6. Définir la phrase d'activation personnalisée</p>
            </div>
            <div className="mt-4">
              <button className="flex items-center px-4 py-2 bg-nexia-primary text-white rounded-md hover:bg-nexia-600 transition-colors">
                <Play className="h-4 w-4 mr-2" />
                Guide Détaillé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}