'use client'

import React, { useState } from 'react'
import { 
  Settings, 
  RefreshCw, 
  Save, 
  Bell, 
  Shield, 
  Globe, 
  Mic, 
  Brain, 
  Monitor,
  Database,
  Zap,
  Clock,
  Users,
  MessageCircle
} from 'lucide-react'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function AgentSettingsPage() {
  const { currentTime } = useCurrentTime()
  const [settings, setSettings] = useState({
    // Agent Core Settings
    agentName: 'NEXIA Meta-Orchestrateur',
    agentVersion: '1.0.0',
    environment: 'development',
    
    // Voice Settings
    voiceEnabled: true,
    voiceLanguage: 'fr-FR',
    voiceSensitivity: 75,
    voiceAutoResponse: true,
    
    // Monitoring Settings
    monitoringInterval: 30,
    alertThreshold: 85,
    escalationEnabled: true,
    healthCheckFrequency: 10,
    
    // Ecosystem Settings
    blueoceanEnabled: true,
    onlyoneapiEnabled: true,
    businessAutomationEnabled: true,
    claudeCodeEnabled: true,
    
    // Notification Settings
    emailNotifications: true,
    slackNotifications: false,
    discordNotifications: true,
    webhookNotifications: false,
    
    // Security Settings
    apiKeyRotation: 90,
    sessionTimeout: 60,
    mfaRequired: false,
    auditLogging: true,
    
    // Performance Settings
    cacheEnabled: true,
    cacheTTL: 300,
    maxConcurrentRequests: 100,
    requestTimeout: 30
  })

  const [activeTab, setActiveTab] = useState('general')

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    alert('⚙️ Configuration sauvegardée - Redémarrage des services nécessaire pour certains paramètres')
  }

  const handleReset = () => {
    alert('🔄 Reset configuration - Retour aux paramètres par défaut')
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: <Settings className="h-4 w-4" /> },
    { id: 'voice', label: 'Vocal', icon: <Mic className="h-4 w-4" /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Monitor className="h-4 w-4" /> },
    { id: 'ecosystems', label: 'Écosystèmes', icon: <Globe className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Sécurité', icon: <Shield className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance', icon: <Zap className="h-4 w-4" /> }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'Agent</label>
              <input
                type="text"
                value={settings.agentName}
                onChange={(e) => handleSettingChange('agentName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
              <input
                type="text"
                value={settings.agentVersion}
                onChange={(e) => handleSettingChange('agentVersion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Environnement</label>
              <select
                value={settings.environment}
                onChange={(e) => handleSettingChange('environment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="development">Développement</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>
        )
      
      case 'voice':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Interface Vocale</h3>
                <p className="text-xs text-gray-500">Activer/désactiver le contrôle vocal</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => handleSettingChange('voiceEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select
                value={settings.voiceLanguage}
                onChange={(e) => handleSettingChange('voiceLanguage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fr-FR">Français (France)</option>
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sensibilité Micro: {settings.voiceSensitivity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.voiceSensitivity}
                onChange={(e) => handleSettingChange('voiceSensitivity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Réponse Automatique</h3>
                <p className="text-xs text-gray-500">Répondre automatiquement aux commandes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voiceAutoResponse}
                  onChange={(e) => handleSettingChange('voiceAutoResponse', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )
      
      case 'monitoring':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervalle Monitoring (secondes): {settings.monitoringInterval}s
              </label>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={settings.monitoringInterval}
                onChange={(e) => handleSettingChange('monitoringInterval', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seuil d'Alerte (%): {settings.alertThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.alertThreshold}
                onChange={(e) => handleSettingChange('alertThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Escalation Automatique</h3>
                <p className="text-xs text-gray-500">Escalader les alertes critiques</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.escalationEnabled}
                  onChange={(e) => handleSettingChange('escalationEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )
      
      case 'ecosystems':
        return (
          <div className="space-y-6">
            {[
              { key: 'blueoceanEnabled', label: 'BlueOcean Cluster', desc: 'NEXTSTEP, NEXTGEN, KREACH, KVIBE' },
              { key: 'onlyoneapiEnabled', label: 'OnlyOneAPI Platform', desc: 'SaaS B2B API Platform' },
              { key: 'businessAutomationEnabled', label: 'Business Automation', desc: 'Agents autonomes 24/7' },
              { key: 'claudeCodeEnabled', label: 'Claude Code Agent', desc: 'Agent supervision technique' }
            ].map((ecosystem) => (
              <div key={ecosystem.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">{ecosystem.label}</h3>
                  <p className="text-xs text-gray-500">{ecosystem.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[ecosystem.key as keyof typeof settings] as boolean}
                    onChange={(e) => handleSettingChange(ecosystem.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  key: 'emailNotifications', 
                  label: 'Notifications Email', 
                  desc: 'Alertes par email',
                  icon: <MessageCircle className="h-5 w-5 text-blue-600" />
                },
                { 
                  key: 'slackNotifications', 
                  label: 'Notifications Slack', 
                  desc: 'Intégration Slack workspace',
                  icon: <MessageCircle className="h-5 w-5 text-green-600" />
                },
                { 
                  key: 'discordNotifications', 
                  label: 'Notifications Discord', 
                  desc: 'Bot Discord pour alertes',
                  icon: <MessageCircle className="h-5 w-5 text-purple-600" />
                },
                { 
                  key: 'webhookNotifications', 
                  label: 'Webhooks', 
                  desc: 'Endpoints personnalisés',
                  icon: <Zap className="h-5 w-5 text-orange-600" />
                }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    {notification.icon}
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-700">{notification.label}</h3>
                      <p className="text-xs text-gray-500">{notification.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[notification.key as keyof typeof settings] as boolean}
                      onChange={(e) => handleSettingChange(notification.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Configuration Email</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Admin</label>
                  <input
                    type="email"
                    placeholder="admin@nexia.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                  <input
                    type="text"
                    placeholder="smtp.nexia.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-amber-600 mr-2" />
                <h4 className="text-sm font-medium text-amber-800">Paramètres de Sécurité</h4>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Ces paramètres affectent la sécurité globale de NEXIA. Modifications sensibles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation API Keys (jours): {settings.apiKeyRotation}
                </label>
                <input
                  type="range"
                  min="30"
                  max="365"
                  step="30"
                  value={settings.apiKeyRotation}
                  onChange={(e) => handleSettingChange('apiKeyRotation', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30 jours</span>
                  <span>365 jours</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout Session (minutes): {settings.sessionTimeout}
                </label>
                <input
                  type="range"
                  min="15"
                  max="480"
                  step="15"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15 min</span>
                  <span>8h</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Authentification Multi-Facteurs</h3>
                  <p className="text-xs text-gray-500">Exiger 2FA pour accès admin</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.mfaRequired}
                    onChange={(e) => handleSettingChange('mfaRequired', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Logging Audit</h3>
                  <p className="text-xs text-gray-500">Enregistrer toutes les actions admin</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.auditLogging}
                    onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="text-sm font-medium text-green-800">Optimisation Performance</h4>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Configuration cache et limites de performance système.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Cache Activé</h3>
                <p className="text-xs text-gray-500">Mise en cache des réponses API</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cacheEnabled}
                  onChange={(e) => handleSettingChange('cacheEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TTL Cache (secondes): {settings.cacheTTL}s
                </label>
                <input
                  type="range"
                  min="60"
                  max="3600"
                  step="60"
                  value={settings.cacheTTL}
                  onChange={(e) => handleSettingChange('cacheTTL', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 min</span>
                  <span>1h</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requêtes Concurrentes Max: {settings.maxConcurrentRequests}
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={settings.maxConcurrentRequests}
                  onChange={(e) => handleSettingChange('maxConcurrentRequests', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10</span>
                  <span>500</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout Requête (secondes): {settings.requestTimeout}s
              </label>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.requestTimeout}
                onChange={(e) => handleSettingChange('requestTimeout', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5s</span>
                <span>2 min</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Métriques Performance</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">CPU Usage</p>
                  <p className="text-lg font-semibold text-blue-900">12%</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Memory</p>
                  <p className="text-lg font-semibold text-green-900">1.2GB</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">Cache Hit</p>
                  <p className="text-lg font-semibold text-purple-900">87%</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-orange-600 font-medium">Uptime</p>
                  <p className="text-lg font-semibold text-orange-900">99.8%</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Sélectionnez un onglet pour configurer les paramètres</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Configuration Agent</h1>
              <p className="text-sm text-gray-600">Paramètres NEXIA Meta-Orchestrateur</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-gray-900">{currentTime}</p>
            </div>
            <button 
              onClick={handleReset}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                <span className="ml-3">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
