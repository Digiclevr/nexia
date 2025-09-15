import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

interface ApiKeys {
  openai: string
  anthropic: string
  gemini: string
  perplexity: string
}

interface ApiKeysRequest {
  openai: string | null
  anthropic: string | null
  gemini: string | null
  perplexity: string | null
}

export default function Settings() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: '',
    anthropic: '',
    gemini: '',
    perplexity: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch current settings
  const { data: currentSettings, error: fetchError } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      console.log('Fetching settings...')
      try {
        const response = await api.get('/v1/settings/')
        console.log('Settings response:', response.data)
        return response.data
      } catch (error) {
        console.error('Error fetching settings:', error)
        throw error
      }
    }
  })

  // Fetch Claude Bridge status
  const { data: claudeBridgeStatus } = useQuery({
    queryKey: ['claude-bridge-status'],
    queryFn: async () => {
      try {
        const response = await api.get('/v1/settings/claude-bridge/status')
        console.log('Claude Bridge status:', response.data)
        return response.data
      } catch (error) {
        console.error('Error fetching Claude Bridge status:', error)
        return {
          claude_bridge_available: false,
          is_connected: false,
          status: 'Error fetching status'
        }
      }
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  // Save API keys mutation
  const saveKeysMutation = useMutation({
    mutationFn: async (keys: ApiKeysRequest) => {
      console.log('Sending keys:', keys)
      console.log('API base URL:', api.defaults.baseURL)
      
      try {
        const response = await api.post('/v1/settings/api-keys', keys)
        console.log('Response:', response.data)
        return response.data
      } catch (error: any) {
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          request: error.request,
          config: error.config
        })
        throw error
      }
    },
    onSuccess: (data) => {
      console.log('Success:', data)
      setShowSuccess(true)
      setShowError(false)
      setErrorMessage('')
      // Reset les champs après sauvegarde
      setApiKeys({
        openai: '',
        anthropic: '',
        gemini: '',
        perplexity: ''
      })
      // Masquer le message de succès après 3 secondes
      setTimeout(() => setShowSuccess(false), 3000)
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      setShowError(true)
      setShowSuccess(false)
      setErrorMessage(error.message || 'Erreur lors de la sauvegarde')
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    }
  })

  const handleSave = () => {
    // Envoyer toutes les clés, même vides
    const keysToSave: ApiKeysRequest = {
      openai: apiKeys.openai || null,
      anthropic: apiKeys.anthropic || null,
      gemini: apiKeys.gemini || null,
      perplexity: apiKeys.perplexity || null
    }

    console.log('Saving keys:', keysToSave)
    saveKeysMutation.mutate(keysToSave)
  }

  // Test Claude Bridge
  const testClaudeBridge = useMutation({
    mutationFn: async () => {
      const response = await api.post('/v1/settings/claude-bridge/test')
      return response.data
    },
    onSuccess: (data) => {
      console.log('Claude Bridge test success:', data)
      setShowSuccess(true)
      setShowError(false)
      setErrorMessage('')
      setTimeout(() => setShowSuccess(false), 5000)
    },
    onError: (error: any) => {
      console.error('Claude Bridge test error:', error)
      setShowError(true)
      setShowSuccess(false)
      setErrorMessage(error.response?.data?.detail || 'Erreur lors du test de Claude Bridge')
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 5000)
    }
  })

  // Test direct de l'API
  const testApi = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/settings/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
      const data = await response.json()
      console.log('Direct API test successful:', data)
    } catch (error) {
      console.error('Direct API test failed:', error)
    }
  }

  useEffect(() => {
    // Test l'API au chargement
    testApi()
  }, [])

  return (
    <div className="h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Paramètres
          </h1>
          <p className="text-gray-400">
            Configurez vos clés API et préférences
          </p>
        </motion.div>

        {/* Debug info */}
        {fetchError && (
          <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg text-yellow-400">
            ⚠️ Erreur de connexion à l'API: {fetchError.message}
          </div>
        )}

        {/* Messages de feedback */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-900/20 border border-green-600 rounded-lg text-green-400"
          >
            ✅ Clés API sauvegardées avec succès !
          </motion.div>
        )}

        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-900/20 border border-red-600 rounded-lg text-red-400"
          >
            ❌ Erreur lors de la sauvegarde des clés
            {errorMessage && <p className="text-sm mt-1">{errorMessage}</p>}
          </motion.div>
        )}

        {/* Claude Bridge Status */}
        {claudeBridgeStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-xl border mb-6 ${
              claudeBridgeStatus.is_connected 
                ? 'bg-green-900/20 border-green-600' 
                : claudeBridgeStatus.claude_bridge_available
                ? 'bg-yellow-900/20 border-yellow-600'
                : 'bg-gray-800 border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                🚀 Claude Bridge MCP
              </h2>
              {claudeBridgeStatus.is_connected && (
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  Actif
                </span>
              )}
            </div>
            
            <p className={`mb-4 ${
              claudeBridgeStatus.is_connected 
                ? 'text-green-300' 
                : 'text-yellow-300'
            }`}>
              {claudeBridgeStatus.status}
            </p>
            
            {claudeBridgeStatus.is_connected && (
              <div className="mb-4 p-4 bg-green-900/30 rounded-lg">
                <p className="text-green-300 text-sm">
                  ✅ Nexia utilise votre abonnement Claude Max directement ! 
                  Aucune clé API requise.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {!claudeBridgeStatus?.is_connected && (
                <button
                  onClick={() => window.open('https://claude.ai', '_blank')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ↗️ Se connecter à Claude.ai
                </button>
              )}
              <button
                onClick={() => testClaudeBridge.mutate()}
                disabled={testClaudeBridge.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testClaudeBridge.isPending ? 'Test...' : 'Tester Claude Bridge'}
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Clés API {claudeBridgeStatus?.is_connected ? '(Optionnelles)' : ''}
          </h2>
          
          {claudeBridgeStatus?.is_connected && (
            <div className="mb-4 p-4 bg-blue-900/20 rounded-lg border border-blue-600">
              <p className="text-blue-300 text-sm">
                ℹ️ Claude Bridge est actif - ces clés sont optionnelles et utilisées uniquement comme fallback.
              </p>
            </div>
          )}

          {/* Statut des clés actuelles */}
          {currentSettings && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">Clés configurées :</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className={currentSettings.api_keys.openai ? 'text-green-400' : 'text-gray-500'}>
                    {currentSettings.api_keys.openai ? '✓' : '✗'}
                  </span>
                  <span>OpenAI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={currentSettings.api_keys.anthropic ? 'text-green-400' : 'text-gray-500'}>
                    {currentSettings.api_keys.anthropic ? '✓' : '✗'}
                  </span>
                  <span>Anthropic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={currentSettings.api_keys.gemini ? 'text-green-400' : 'text-gray-500'}>
                    {currentSettings.api_keys.gemini ? '✓' : '✗'}
                  </span>
                  <span>Gemini</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={currentSettings.api_keys.perplexity ? 'text-green-400' : 'text-gray-500'}>
                    {currentSettings.api_keys.perplexity ? '✓' : '✗'}
                  </span>
                  <span>Perplexity</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                placeholder="sk-..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nexia-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Anthropic API Key
              </label>
              <input
                type="password"
                value={apiKeys.anthropic}
                onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                placeholder="sk-ant-..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nexia-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={apiKeys.gemini}
                onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                placeholder="AIza..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nexia-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Perplexity API Key
              </label>
              <input
                type="password"
                value={apiKeys.perplexity}
                onChange={(e) => setApiKeys({ ...apiKeys, perplexity: e.target.value })}
                placeholder="pplx-..."
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nexia-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saveKeysMutation.isPending}
              className="px-6 py-2 bg-nexia-600 text-white rounded-lg hover:bg-nexia-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveKeysMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            
            <button
              onClick={testApi}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Test API
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
