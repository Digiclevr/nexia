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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Settings,
  Play,
  Pause
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function VoicePage() {
  const { currentTime } = useCurrentTime()
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'fr-FR',
    voice: 'natural',
    sensitivity: 75,
    autoResponse: true
  })
  
  // Fetch voice session data
  const { data: voiceData, isLoading } = useQuery({
    queryKey: ['voice-data'],
    queryFn: () => nexiaApi.fetchVoiceData(),
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000
  });

  const voice = voiceData?.data || {};

  const recentCommands = [
    {
      id: 'CMD-001',
      command: 'Status de BlueOcean',
      response: 'BlueOcean fonctionne normalement. 15 services actifs, uptime 99.2%',
      timestamp: '14:25:33',
      duration: '2.3s',
      status: 'success'
    },
    {
      id: 'CMD-002', 
      command: 'Déployer KREACH en staging',
      response: 'Déploiement KREACH staging initié. ETA: 3 minutes',
      timestamp: '14:22:15',
      duration: '1.8s',
      status: 'success'
    },
    {
      id: 'CMD-003',
      command: 'Alertes critiques OnlyOneAPI',
      response: '1 alerte active: Latence élevée API détectée il y a 12 minutes',
      timestamp: '14:18:44',
      duration: '2.1s',
      status: 'warning'
    },
    {
      id: 'CMD-004',
      command: 'Redémarrer service business automation',
      response: 'Service business-automation redémarré avec succès',
      timestamp: '14:15:22',
      duration: '3.2s',
      status: 'success'
    }
  ]

  const availableCommands = [
    {
      category: 'Supervision',
      commands: [
        'Status de [écosystème]',
        'Alertes critiques [écosystème]',
        'Performance globale',
        'Derniers incidents'
      ]
    },
    {
      category: 'Déploiement',
      commands: [
        'Déployer [app] en [environnement]',
        'Rollback [app]',
        'Status déploiement [app]',
        'Historique déploiements'
      ]
    },
    {
      category: 'Maintenance',
      commands: [
        'Redémarrer service [nom]',
        'Vider cache [service]',
        'Backup base de données',
        'Nettoyer logs anciens'
      ]
    },
    {
      category: 'Monitoring',
      commands: [
        'CPU cluster BlueOcean',
        'Mémoire disponible',
        'Trafic réseau',
        'Uptime services'
      ]
    }
  ]

  const getCommandStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
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
            <a href="/performance" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-600 hover:text-nexia-primary hover:bg-nexia-50 rounded-md">
              <TrendingUp className="mr-3 h-4 w-4" />
              Performance
            </a>
            
            <h3 className="px-2 mt-6 text-xs font-semibold text-nexia-600 uppercase tracking-wider">Opérations</h3>
            <a href="/voice" className="flex items-center px-2 py-2 text-sm font-medium text-nexia-primary bg-nexia-50 rounded-md">
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
                <Mic className="h-6 w-6 text-nexia-primary mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-nexia-dark">Interface Vocale NEXIA</h1>
                  <p className="text-sm text-nexia-600">Contrôle vocal avancé de l'écosystème complet</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
                  <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
                </div>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </button>
              </div>
            </div>
          </header>

          {/* Voice Control Center */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Voice Interface */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-nexia-dark mb-6">Centre de Contrôle Vocal</h2>
              
              <div className="flex flex-col items-center space-y-6">
                {/* Voice Status Indicator */}
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'border-nexia-primary bg-nexia-50 animate-pulse' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  {isListening ? (
                    <Mic className="h-12 w-12 text-nexia-primary" />
                  ) : (
                    <MicOff className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                {/* Status Text */}
                <div className="text-center">
                  <p className={`text-lg font-semibold ${isListening ? 'text-nexia-primary' : 'text-gray-600'}`}>
                    {isListening ? 'À l\'écoute...' : 'En attente'}
                  </p>
                  <p className="text-sm text-nexia-500">
                    {isListening ? 'Parlez maintenant pour donner une commande' : 'Cliquez sur le microphone pour commencer'}
                  </p>
                </div>
                
                {/* Control Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={toggleListening}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-nexia-primary hover:bg-nexia-secondary text-white'
                    }`}
                  >
                    {isListening ? 'Arrêter l\'écoute' : 'Activer le micro'}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className={`px-6 py-3 rounded-lg font-medium border transition-colors ${
                      isMuted
                        ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commandes Aujourd'hui</p>
                    <p className="text-2xl font-bold text-nexia-primary">27</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-nexia-primary" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taux de Succès</p>
                    <p className="text-2xl font-bold text-green-600">96.3%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temps Réponse Moyen</p>
                    <p className="text-2xl font-bold text-nexia-primary">1.8s</p>
                  </div>
                  <Clock className="h-8 w-8 text-nexia-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Commands */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-nexia-dark mb-4">Commandes Récentes</h2>
              <div className="space-y-3">
                {recentCommands.map((cmd) => (
                  <div key={cmd.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-nexia-dark">"{cmd.command}"</p>
                        <p className="text-sm text-nexia-600 mt-1">{cmd.response}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCommandStatusColor(cmd.status)}`}>
                        {cmd.status === 'success' ? 'Succès' : cmd.status === 'warning' ? 'Attention' : 'Erreur'}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-nexia-500 space-x-4">
                      <span>⏰ {cmd.timestamp}</span>
                      <span>⌛ {cmd.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Available Commands */}
            <div>
              <h2 className="text-lg font-semibold text-nexia-dark mb-4">Commandes Disponibles</h2>
              <div className="space-y-4">
                {availableCommands.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-nexia-primary mb-3">{category.category}</h3>
                    <div className="space-y-2">
                      {category.commands.map((command, cmdIndex) => (
                        <div key={cmdIndex} className="flex items-center text-sm text-nexia-600">
                          <div className="w-2 h-2 bg-nexia-300 rounded-full mr-3"></div>
                          <span>{command}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-nexia-dark mb-6">Configuration Vocale</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-nexia-600 mb-2">Langue</label>
                <select
                  value={voiceSettings.language}
                  onChange={(e) => setVoiceSettings({...voiceSettings, language: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nexia-primary"
                >
                  <option value="fr-FR">Français (France)</option>
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nexia-600 mb-2">Type de Voix</label>
                <select
                  value={voiceSettings.voice}
                  onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nexia-primary"
                >
                  <option value="natural">Naturelle</option>
                  <option value="professional">Professionnelle</option>
                  <option value="casual">Décontractée</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nexia-600 mb-2">Sensibilité ({voiceSettings.sensitivity}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceSettings.sensitivity}
                  onChange={(e) => setVoiceSettings({...voiceSettings, sensitivity: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={voiceSettings.autoResponse}
                    onChange={(e) => setVoiceSettings({...voiceSettings, autoResponse: e.target.checked})}
                    className="w-4 h-4 text-nexia-primary bg-gray-100 border-gray-300 rounded focus:ring-nexia-primary"
                  />
                  <span className="ml-2 text-sm text-nexia-600">Réponses automatiques</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}