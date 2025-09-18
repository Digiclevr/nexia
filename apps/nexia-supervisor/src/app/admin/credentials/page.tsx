'use client'

import { 
  Key,
  Database,
  Server,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Shield,
  Cloud,
  Settings,
  Globe,
  Lock
} from 'lucide-react'
import { useState } from 'react'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function CredentialsPage() {
  const { currentTime } = useCurrentTime()
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set())

  const togglePasswordVisibility = (fieldId: string) => {
    const newVisible = new Set(visiblePasswords)
    if (newVisible.has(fieldId)) {
      newVisible.delete(fieldId)
    } else {
      newVisible.add(fieldId)
    }
    setVisiblePasswords(newVisible)
  }

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      const newCopied = new Set(copiedFields)
      newCopied.add(fieldId)
      setCopiedFields(newCopied)
      setTimeout(() => {
        setCopiedFields(prev => {
          const updated = new Set(prev)
          updated.delete(fieldId)
          return updated
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const CredentialField = ({ 
    label, 
    value, 
    fieldId, 
    isPassword = false, 
    url = null 
  }: { 
    label: string
    value: string
    fieldId: string
    isPassword?: boolean
    url?: string | null
  }) => {
    const isVisible = visiblePasswords.has(fieldId)
    const isCopied = copiedFields.has(fieldId)
    
    return (
      <div className="flex items-center justify-between p-3 bg-nexia-50 rounded-lg border border-nexia-200">
        <div className="flex-1">
          <p className="text-sm font-medium text-nexia-700 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-white px-2 py-1 rounded border text-nexia-900 font-mono">
              {isPassword && !isVisible ? '••••••••••••' : value}
            </code>
            {url && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-nexia-600 hover:text-nexia-800 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {isPassword && (
            <button
              onClick={() => togglePasswordVisibility(fieldId)}
              className="p-2 text-nexia-600 hover:text-nexia-800 hover:bg-nexia-100 rounded transition-colors"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(value, fieldId)}
            className="p-2 text-nexia-600 hover:text-nexia-800 hover:bg-nexia-100 rounded transition-colors"
          >
            <Copy size={16} />
          </button>
          {isCopied && (
            <span className="text-xs text-green-600 font-medium">Copié!</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nexia-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-nexia-100 rounded-xl">
              <Key className="w-8 h-8 text-nexia-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-nexia-900">Credentials & Access</h1>
              <p className="text-nexia-600">Gestion centralisée des accès écosystème NEXIA</p>
            </div>
          </div>
          <div className="text-sm text-nexia-500 bg-nexia-50 px-4 py-2 rounded-lg border">
            Dernière mise à jour: {currentTime}
          </div>
        </div>

        {/* Security Warning */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Sécurité</h3>
          </div>
          <p className="text-sm text-amber-700">
            Ces credentials sont sensibles. Ne jamais les partager ou les committer dans du code.
            Utilisez uniquement en environnement de développement sécurisé.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* NEXIA Services */}
          <div className="bg-white rounded-xl shadow-sm border border-nexia-200 overflow-hidden">
            <div className="p-6 border-b border-nexia-200 bg-nexia-50">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-nexia-600" />
                <h2 className="text-xl font-semibold text-nexia-900">NEXIA Services</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-nexia-800 mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Directus CMS
                </h3>
                <div className="space-y-3">
                  <CredentialField
                    label="Email Admin"
                    value="admin@nexia.com"
                    fieldId="directus-email"
                  />
                  <CredentialField
                    label="Mot de passe"
                    value="NexiaAdmin2025!"
                    fieldId="directus-password"
                    isPassword={true}
                  />
                  <CredentialField
                    label="URL Admin"
                    value="http://localhost:7012/admin"
                    fieldId="directus-url"
                    url="http://localhost:7012/admin"
                  />
                </div>
              </div>

              <div className="border-t border-nexia-100 pt-4">
                <h3 className="font-medium text-nexia-800 mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  NEXIA Supervisor
                </h3>
                <div className="space-y-3">
                  <CredentialField
                    label="URL Supervisor"
                    value="http://localhost:7010"
                    fieldId="supervisor-url"
                    url="http://localhost:7010"
                  />
                  <CredentialField
                    label="BlueOcean Monitor"
                    value="http://localhost:7010/ecosystems/blueocean"
                    fieldId="blueocean-url"
                    url="http://localhost:7010/ecosystems/blueocean"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BlueOcean Cluster */}
          <div className="bg-white rounded-xl shadow-sm border border-nexia-200 overflow-hidden">
            <div className="p-6 border-b border-nexia-200 bg-blue-50">
              <div className="flex items-center gap-3">
                <Cloud className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-nexia-900">BlueOcean Cluster</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-nexia-800 mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  PostgreSQL Central
                </h3>
                <div className="space-y-3">
                  <CredentialField
                    label="Host"
                    value="postgres-central.platform.svc.cluster.local"
                    fieldId="postgres-host"
                  />
                  <CredentialField
                    label="Port"
                    value="5432"
                    fieldId="postgres-port"
                  />
                  <CredentialField
                    label="Username"
                    value="postgres"
                    fieldId="postgres-user"
                  />
                  <CredentialField
                    label="Password"
                    value="postgres"
                    fieldId="postgres-password"
                    isPassword={true}
                  />
                </div>
              </div>

              <div className="border-t border-nexia-100 pt-4">
                <h3 className="font-medium text-nexia-800 mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Redis Cache
                </h3>
                <div className="space-y-3">
                  <CredentialField
                    label="Host"
                    value="platform-pool-redis-master.platform.svc.cluster.local"
                    fieldId="redis-host"
                  />
                  <CredentialField
                    label="Port"
                    value="6379"
                    fieldId="redis-port"
                  />
                  <CredentialField
                    label="URL"
                    value="redis://platform-pool-redis-master.platform.svc.cluster.local:6379"
                    fieldId="redis-url"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Development URLs */}
          <div className="bg-white rounded-xl shadow-sm border border-nexia-200 overflow-hidden">
            <div className="p-6 border-b border-nexia-200 bg-green-50">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-nexia-900">URLs Development</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <CredentialField
                  label="NEXIA Supervisor"
                  value="http://localhost:7010"
                  fieldId="dev-supervisor"
                  url="http://localhost:7010"
                />
                <CredentialField
                  label="NEXIA Directus"
                  value="http://localhost:7012"
                  fieldId="dev-directus"
                  url="http://localhost:7012"
                />
                <CredentialField
                  label="NEXIA Voice (futur)"
                  value="http://localhost:7013"
                  fieldId="dev-voice"
                />
                <CredentialField
                  label="BlueOcean Monitor"
                  value="http://localhost:7010/ecosystems/blueocean"
                  fieldId="dev-monitor"
                  url="http://localhost:7010/ecosystems/blueocean"
                />
              </div>
            </div>
          </div>

          {/* API Keys & Secrets */}
          <div className="bg-white rounded-xl shadow-sm border border-nexia-200 overflow-hidden">
            <div className="p-6 border-b border-nexia-200 bg-purple-50">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-nexia-900">API Keys & Secrets</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-nexia-800 mb-3">Directus Internal</h3>
                <div className="space-y-3">
                  <CredentialField
                    label="Key"
                    value="nexia-directus-key-super-secure-2025"
                    fieldId="directus-key"
                    isPassword={true}
                  />
                  <CredentialField
                    label="Secret"
                    value="nexia-directus-secret-super-secure-2025"
                    fieldId="directus-secret"
                    isPassword={true}
                  />
                </div>
              </div>

              <div className="border-t border-nexia-100 pt-4">
                <h3 className="font-medium text-nexia-800 mb-3">Apollo.io (FASTCASH)</h3>
                <div className="space-y-3">
                  <CredentialField
                    label="API Key"
                    value="HN8xpRGN-TcZKqDTFZB0yw"
                    fieldId="apollo-key"
                    isPassword={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-nexia-50 rounded-xl border border-nexia-200">
          <h3 className="font-medium text-nexia-800 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="http://localhost:7012/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-nexia-200 hover:border-nexia-300 transition-colors text-nexia-700 hover:text-nexia-900"
            >
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">Directus Admin</span>
            </a>
            <a 
              href="http://localhost:7010/ecosystems/blueocean" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-nexia-200 hover:border-nexia-300 transition-colors text-nexia-700 hover:text-nexia-900"
            >
              <Server className="w-4 h-4" />
              <span className="text-sm font-medium">BlueOcean Monitor</span>
            </a>
            <a 
              href="http://localhost:7010" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-nexia-200 hover:border-nexia-300 transition-colors text-nexia-700 hover:text-nexia-900"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">NEXIA Home</span>
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-nexia-200 hover:border-nexia-300 transition-colors text-nexia-700 hover:text-nexia-900"
            >
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">Rafraîchir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}