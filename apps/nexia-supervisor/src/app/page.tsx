'use client'

import { 
  Activity,
  AlertCircle, 
  BarChart3, 
  Brain,
  Globe,
  Mic,
  Server,
  Shield,
  Target,
  Users,
  Database,
  Clock,
  Zap,
  Eye,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { useBlueOceanStatus } from '@/hooks/useBlueOceanStatus'
import { getStatusColor, getStatusColorText } from '@/lib/blueocean-status'

// Import our new responsive system
import { PageLayout, SectionLayout, QuickAction } from '@/components/layouts/PageLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { ResponsiveGrid, ResponsiveContainer } from '@/components/ui/ResponsiveContainer'
import { useResponsive } from '@/hooks/useResponsive'

// Import VoiceControl component
import { VoiceControl } from '@/components/VoiceControl'

export default function DashboardPage() {
  const { currentTime } = useCurrentTime()
  const { isMobile, isTablet } = useResponsive()
  const queryClient = useQueryClient()
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['nexia-status'] })
    queryClient.invalidateQueries({ queryKey: ['ecosystem-health'] })
    queryClient.invalidateQueries({ queryKey: ['active-alerts'] })
    queryClient.invalidateQueries({ queryKey: ['blueocean-status'] })
  }
  
  // Fetch data with our existing hooks
  const { data: blueOceanStatus, isLoading: blueOceanLoading } = useBlueOceanStatus()
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['nexia-status'],
    queryFn: nexiaApi.fetchStatus,
    refetchInterval: 30000
  })

  const { data: ecosystemData, isLoading: ecosystemLoading } = useQuery({
    queryKey: ['ecosystem-health'],
    queryFn: nexiaApi.fetchEcosystemHealth,
    refetchInterval: 10000
  })

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['active-alerts'],
    queryFn: nexiaApi.fetchActiveAlerts,
    refetchInterval: 5000
  })

  const blueOceanApps = blueOceanStatus?.data || []
  const ecosystemStatus = ecosystemData?.data || {}
  const activeAlerts = alertsData?.data || []

  const isLoading = blueOceanLoading || statusLoading || ecosystemLoading || alertsLoading

  // Quick stats for the header
  const quickStats = [
    { 
      label: 'Écosystèmes', 
      value: Object.keys(ecosystemStatus).length, 
      icon: Globe,
      color: 'text-blue-600'
    },
    { 
      label: 'Services Actifs', 
      value: blueOceanApps.filter((app: any) => app.status === 'running').length, 
      icon: Server,
      color: 'text-green-600'
    },
    { 
      label: 'Alertes', 
      value: activeAlerts.length, 
      icon: AlertCircle,
      color: activeAlerts.length > 0 ? 'text-red-600' : 'text-gray-400'
    }
  ]

  const pageActions = (
    <>
      <QuickAction
        icon={<RefreshCw className="h-4 w-4" />}
        label={isMobile ? "Actualiser" : "Actualiser Données"}
        onClick={handleRefresh}
        variant="secondary"
        size={isMobile ? "sm" : "md"}
      />
      <QuickAction
        icon={<Eye className="h-4 w-4" />}
        label={isMobile ? "Monitoring" : "Monitoring Avancé"}
        onClick={() => window.location.href = '/monitoring'}
        variant="primary"
        size={isMobile ? "sm" : "md"}
      />
    </>
  )

  return (
    <PageLayout
      title="NEXIA Dashboard"
      subtitle="Supervision Intelligente Multi-Écosystème"
      description="Contrôle centralisé de l'infrastructure BlueOcean, OnlyOneAPI, Business-Automation et Claude Code"
      actions={pageActions}
      loading={isLoading}
      containerSize="7xl"
      spacing="lg"
      breadcrumbs={[
        { label: 'Accueil' }
      ]}
    >
      {/* Quick Stats */}
      <SectionLayout variant="ghost">
        <ResponsiveGrid 
          cols={{ mobile: 1, tablet: 3, desktop: 3 }}
          className="mb-8"
        >
          {quickStats.map((stat, index) => (
            <Card key={index} hover padding="lg" className="text-center">
              <div className="flex flex-col items-center space-y-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </ResponsiveGrid>
      </SectionLayout>

      {/* Voice Control Section */}
      <SectionLayout variant="ghost">
        <VoiceControl 
          className="w-full"
          compact={isMobile}
          showTranscription={true}
          onVoiceCommand={(command) => {
            console.log('Voice command received:', command)
            // Handle voice commands that might trigger navigation or actions
          }}
        />
      </SectionLayout>

      {/* Main Grid */}
      <ResponsiveGrid 
        cols={{ mobile: 1, tablet: 1, desktop: 2 }}
        gap="lg"
      >
        {/* Ecosystems Status */}
        <SectionLayout
          title="État Écosystèmes"
          subtitle="Supervision temps réel"
          variant="card"
          actions={
            <QuickAction
              icon={<Target className="h-4 w-4" />}
              label="Détails"
              onClick={() => window.location.href = '/status'}
              variant="ghost"
              size="sm"
            />
          }
        >
          <div className="space-y-3">
            {Object.entries(ecosystemStatus).map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status as any)}`} />
                  <span className="font-medium text-gray-900 capitalize">
                    {name.replace('_', ' ')}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColorText(status as any)}`}>
                  {status as string}
                </span>
              </div>
            ))}
          </div>
        </SectionLayout>

        {/* BlueOcean Applications */}
        <SectionLayout
          title="Applications BlueOcean"
          subtitle={`${blueOceanApps.length} applications`}
          variant="card"
          actions={
            <QuickAction
              icon={<Activity className="h-4 w-4" />}
              label="Monitoring"
              onClick={() => window.location.href = '/ecosystems/blueocean'}
              variant="ghost"
              size="sm"
            />
          }
        >
          <div className="space-y-2">
            {blueOceanApps.slice(0, isMobile ? 4 : 6).map((app, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    app.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">
                    {app.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Port {app.port}
                </div>
              </div>
            ))}
            {blueOceanApps.length > (isMobile ? 4 : 6) && (
              <div className="text-center pt-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Voir tout ({blueOceanApps.length - (isMobile ? 4 : 6)} de plus)
                </button>
              </div>
            )}
          </div>
        </SectionLayout>
      </ResponsiveGrid>

      {/* Alerts Section */}
      {activeAlerts.length > 0 && (
        <SectionLayout
          title="Alertes Actives"
          subtitle={`${activeAlerts.length} alert(es) en cours`}
          variant="card"
          actions={
            <QuickAction
              icon={<AlertCircle className="h-4 w-4" />}
              label="Gérer"
              onClick={() => window.location.href = '/alerts'}
              variant="secondary"
              size="sm"
            />
          }
        >
          <div className="space-y-3">
            {activeAlerts.slice(0, 3).map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-800">
                    {alert.message}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {alert.target} • {alert.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionLayout>
      )}

      {/* Quick Access */}
      <SectionLayout
        title="Accès Rapide"
        subtitle="Fonctionnalités principales"
        variant="card"
      >
        <ResponsiveGrid 
          cols={{ mobile: 2, tablet: 3, desktop: 4 }}
          gap="md"
        >
          {[
            { icon: Mic, label: 'Contrôle Vocal', href: '/voice', color: 'bg-purple-100 text-purple-600' },
            { icon: BarChart3, label: 'Métriques Empire', href: '/empire/metrics', color: 'bg-blue-100 text-blue-600' },
            { icon: Database, label: 'OnlyOneAPI', href: '/ecosystems/onlyoneapi', color: 'bg-green-100 text-green-600' },
            { icon: Brain, label: 'Claude Code', href: '/ecosystems/claude-code', color: 'bg-indigo-100 text-indigo-600' },
            { icon: Users, label: 'Business Auto', href: '/ecosystems/business-automation', color: 'bg-orange-100 text-orange-600' },
            { icon: Shield, label: 'Monitoring', href: '/monitoring', color: 'bg-red-100 text-red-600' },
            { icon: Server, label: 'Déploiements', href: '/deployment', color: 'bg-gray-100 text-gray-600' },
            { icon: Database, label: 'CMS', href: '/cms', color: 'bg-yellow-100 text-yellow-600' }
          ].map((item, index) => (
            <Card 
              key={index} 
              clickable 
              hover 
              padding="md"
              className="text-center cursor-pointer"
              onClick={() => window.location.href = item.href}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.label}
                </span>
              </div>
            </Card>
          ))}
        </ResponsiveGrid>
      </SectionLayout>

      {/* System Status Footer */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Système opérationnel</span>
            <span>•</span>
            <span>Dernière mise à jour: {currentTime}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Mode: Développement</span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}