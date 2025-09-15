'use client'

import { useQuery } from '@tanstack/react-query'
import { nexiaApi, getDirectusContentQueryKey } from '@/lib/api'
import { Settings, Database, AlertTriangle, Mic, CheckCircle, XCircle } from 'lucide-react'

export default function ConfigPage() {
  const { data: ecosystemConfigs, isLoading: configsLoading } = useQuery({
    queryKey: getDirectusContentQueryKey('ecosystem_configs'),
    queryFn: () => nexiaApi.fetchDirectusContent('ecosystem_configs'),
    refetchInterval: 30000,
  })

  const { data: alertRules, isLoading: rulesLoading } = useQuery({
    queryKey: getDirectusContentQueryKey('alert_rules'),
    queryFn: () => nexiaApi.fetchDirectusContent('alert_rules'),
    refetchInterval: 60000,
  })

  const { data: voiceCommands, isLoading: commandsLoading } = useQuery({
    queryKey: getDirectusContentQueryKey('voice_commands'),
    queryFn: () => nexiaApi.fetchDirectusContent('voice_commands'),
    refetchInterval: 60000,
  })

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="flex-1 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-nexia-primary mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuration NEXIA</h1>
            <p className="text-sm text-gray-500">Gestion centralisée via Directus CMS</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Ecosystem Configurations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-nexia-primary mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Configurations Écosystème</h2>
                {configsLoading && (
                  <div className="ml-3 animate-spin rounded-full h-4 w-4 border-2 border-nexia-primary border-t-transparent"></div>
                )}
              </div>
            </div>
            <div className="p-6">
              {ecosystemConfigs?.data ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {ecosystemConfigs.data.map((config: any) => (
                    <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {getStatusIcon(config.status)}
                            <h3 className="ml-2 font-medium text-gray-900">{config.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            <div>Priorité: {config.priority}</div>
                            <div>Monitoring: {config.monitoring_enabled ? 'Activé' : 'Désactivé'}</div>
                            <div>Health Check: {config.health_check_url}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chargement des configurations...
                </div>
              )}
            </div>
          </div>

          {/* Alert Rules */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Règles d'Alerte</h2>
                {rulesLoading && (
                  <div className="ml-3 animate-spin rounded-full h-4 w-4 border-2 border-nexia-primary border-t-transparent"></div>
                )}
              </div>
            </div>
            <div className="p-6">
              {alertRules?.data ? (
                <div className="space-y-4">
                  {alertRules.data.map((rule: any) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">{rule.name}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getSeverityColor(rule.severity)}`}>
                              {rule.severity}
                            </span>
                            {rule.enabled && (
                              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                Actif
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                          <div className="mt-2 text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded">
                            Condition: {rule.condition}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Écosystème: {rule.ecosystem}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chargement des règles d'alerte...
                </div>
              )}
            </div>
          </div>

          {/* Voice Commands */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Mic className="h-5 w-5 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Commandes Vocales</h2>
                {commandsLoading && (
                  <div className="ml-3 animate-spin rounded-full h-4 w-4 border-2 border-nexia-primary border-t-transparent"></div>
                )}
              </div>
            </div>
            <div className="p-6">
              {voiceCommands?.data ? (
                <div className="space-y-4">
                  {voiceCommands.data.map((command: any) => (
                    <div key={command.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">"{command.command}"</h3>
                            {command.enabled && (
                              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                Actif
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{command.description}</p>
                          <div className="mt-2 text-xs bg-purple-50 text-purple-700 p-2 rounded">
                            Réponse: {command.response_template}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chargement des commandes vocales...
                </div>
              )}
            </div>
          </div>

          {/* CMS Status */}
          <div className="bg-nexia-50 rounded-xl p-6">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-nexia-primary mr-2" />
              <h3 className="font-medium text-nexia-900">Directus CMS Status</h3>
            </div>
            <p className="text-sm text-nexia-700 mt-2">
              Interface de gestion de contenu connectée. Toute modification dans Directus 
              sera automatiquement reflétée dans l'interface NEXIA.
            </p>
            <div className="mt-4 flex items-center text-xs text-nexia-600">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
              Connecté à {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} CMS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}