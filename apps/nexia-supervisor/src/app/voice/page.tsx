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
    queryFn: () => nexiaApi.fetchStatus(),
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
    if (!isListening) {
      alert('🎙️ Interface vocale activée - Dites "Nexia, status BlueOcean" pour tester')
      // In real implementation, would start voice recognition
    } else {
      alert('🔇 Interface vocale désactivée')
    }
    setIsListening(!isListening)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      alert('🔇 Audio désactivé - Réponses vocales silencieuses')
    } else {
      alert('🔊 Audio activé - Réponses vocales activées')
    }
  }

  const handleVoiceConfig = () => {
    alert('⚙️ Configuration vocale - Langue: ' + voiceSettings.language + ', Sensibilité: ' + voiceSettings.sensitivity + '%')
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header Compact */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-2 lg:px-4 py-2">
          <div className="flex items-center min-w-0">
            <Mic className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 mr-2" />
            <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-semibold text-gray-900 truncate">Interface Vocale</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{currentTime}</p>
            </div>
            <button 
              onClick={handleVoiceConfig}
              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
            >
              <Settings className="h-3 w-3 mr-1 inline" />
              Config
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 p-2 lg:p-3 space-y-4">
        
        {/* Voice Control Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4">
          
          {/* Main Voice Interface - Responsive */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Contrôle Vocal</h2>
            
            <div className="flex items-center justify-center min-h-[200px] lg:min-h-[300px]">
              <div className="flex flex-col items-center space-y-3">
                {/* Voice Status Indicator - Responsive */}
                <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'border-blue-600 bg-blue-50 animate-pulse' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  {isListening ? (
                    <Mic className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
                  ) : (
                    <MicOff className="h-8 w-8 lg:h-10 lg:w-10 text-gray-400" />
                  )}
                </div>
                
                {/* Status Text - Responsive */}
                <div className="text-center">
                  <p className={`text-base lg:text-lg font-semibold ${isListening ? 'text-blue-600' : 'text-gray-600'}`}>
                    {isListening ? 'À l\'écoute...' : 'En attente'}
                  </p>
                </div>
                
                {/* Control Buttons - Responsive */}
                <div className="flex space-x-3">
                  <button
                    onClick={toggleListening}
                    className={`px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isListening ? 'Arrêter' : 'Activer'}
                  </button>
                  
                  <button
                    onClick={toggleMute}
                    className={`px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base rounded-lg font-medium border transition-colors ${
                      isMuted
                        ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4 lg:h-5 lg:w-5" /> : <Volume2 className="h-4 w-4 lg:h-5 lg:w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats - Responsive */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-2 lg:gap-3">
            <div className="bg-white p-3 lg:p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 mb-2 lg:mb-0">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Commandes</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-600">27</p>
                </div>
                <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 self-start lg:self-auto" />
              </div>
            </div>
            
            <div className="bg-white p-3 lg:p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 mb-2 lg:mb-0">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Succès</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">96.3%</p>
                </div>
                <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600 self-start lg:self-auto" />
              </div>
            </div>
            
            <div className="bg-white p-3 lg:p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 mb-2 lg:mb-0">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Réponse</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-600">1.8s</p>
                </div>
                <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 self-start lg:self-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Commands Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
          
          {/* Recent Commands - Responsive */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-3">Commandes Récentes</h2>
            <div className="space-y-2 max-h-[400px] lg:max-h-[500px] overflow-y-auto">
              {recentCommands.map((cmd) => (
                <div key={cmd.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm lg:text-base font-medium text-gray-900 truncate">"{cmd.command}"</p>
                      <p className="text-xs lg:text-sm text-gray-600 mt-1 line-clamp-2">{cmd.response}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 ml-3 ${getCommandStatusColor(cmd.status)}`}>
                      {cmd.status === 'success' ? '✓' : cmd.status === 'warning' ? '⚠' : '✗'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs lg:text-sm text-gray-500 space-x-3">
                    <span>{cmd.timestamp}</span>
                    <span>{cmd.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Available Commands - Responsive */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-3">Commandes Disponibles</h2>
            <div className="space-y-3 max-h-[400px] lg:max-h-[500px] overflow-y-auto">
              {availableCommands.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <h3 className="text-sm lg:text-base font-semibold text-blue-600 mb-2">{category.category}</h3>
                  <div className="space-y-1.5">
                    {category.commands.map((command, cmdIndex) => (
                      <div key={cmdIndex} className="flex items-center text-xs lg:text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="line-clamp-1">{command}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}