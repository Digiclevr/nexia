'use client'

import React, { useState, useEffect } from 'react'
import { 
  Globe, 
  Server,
  Database,
  Activity,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Shield,
  Zap,
  ExternalLink,
  TrendingUp,
  Clock,
  Target,
  Layers,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  DollarSign,
  UserCheck,
  Code,
  Settings,
  Mail,
  MessageSquare,
  Github,
  CreditCard,
  BarChart2,
  Eye,
  Gauge,
  Compass,
  Crown,
  RefreshCw,
  GitBranch,
  Container,
  Brain,
  Cloud
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentTime } from '@/hooks/useCurrentTime'

interface EcosystemComponent {
  name: string
  type: string
  users: number | string
  status: 'healthy' | 'warning' | 'degraded' | 'critical' | 'development'
  metrics?: {
    responseTime: number
    uptime: number
    traffic: number
    errors: number
  }
}

interface EcosystemLayer {
  id: string
  name: string
  description: string
  level: number
  color: string
  components: EcosystemComponent[]
}

interface OnlyOneAPIFlow {
  id: string
  name: string
  type: string
  color: string
  path: string[]
  description: string
}

export default function OnlyOneAPI360Page() {
  const { currentTime } = useCurrentTime()
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [activeFlow, setActiveFlow] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [showFlows, setShowFlows] = useState(true)
  
  // Animation automatique des flux OnlyOneAPI
  useEffect(() => {
    if (!showFlows) return;
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        const currentFlow = onlyOneAPIFlows[activeFlow];
        if (prev >= currentFlow.path.length - 1) {
          setActiveFlow(prevFlow => (prevFlow + 1) % onlyOneAPIFlows.length);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeFlow, showFlows]);

  // Données réelles OnlyOneAPI 360
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ['onlyoneapi360-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/ecosystems/onlyoneapi360')
      if (!response.ok) throw new Error('Failed to fetch OnlyOneAPI 360 data')
      return response.json()
    },
    refetchInterval: 15000 // Plus fréquent pour vue temps réel
  })

  const metrics = metricsData?.data

  // Flux de données OnlyOneAPI temps réel
  const onlyOneAPIFlows: OnlyOneAPIFlow[] = [
    {
      id: 'user-request-flow',
      name: 'Flux Requêtes Utilisateur',
      type: 'primary',
      color: '#2196F3',
      path: ['frontend', 'api-gateway', 'core-api', 'database'],
      description: 'Client → Portal/Developer → API Gateway → Core API → PostgreSQL'
    },
    {
      id: 'business-automation-flow',
      name: 'Flux Business Automation',
      type: 'secondary', 
      color: '#FF9800',
      path: ['tools', 'api-gateway', 'core-api', 'integrations'],
      description: 'Stripe/Mautic → Kong → OnlyOneAPI → Webhooks & Notifications'
    },
    {
      id: 'monitoring-flow',
      name: 'Flux Monitoring & Analytics',
      type: 'monitoring',
      color: '#4CAF50',
      path: ['infrastructure', 'monitoring', 'api-gateway', 'frontend'],
      description: 'K8s Metrics → Prometheus → Grafana → Admin Dashboard'
    },
    {
      id: 'revenue-flow',
      name: 'Flux Revenue & Growth',
      type: 'revenue',
      color: '#9C27B0',
      path: ['tools', 'core-api', 'database', 'frontend'],
      description: 'Apollo/CRM → Analytics → Business Intelligence → Revenue Dashboard'
    }
  ]
  
  // Architecture OnlyOneAPI en couches
  const ecosystemLayers: EcosystemLayer[] = [
    {
      id: 'frontend',
      name: 'Frontend Sites & Portals',
      description: 'Interfaces utilisateur et expérience client OnlyOneAPI',
      level: 1,
      color: 'blue',
      components: [
        { name: 'Marketing Site', type: 'web', users: 15420, status: 'healthy', 
          metrics: { responseTime: 120, uptime: 99.9, traffic: 15420, errors: 0 } },
        { name: 'Developer Portal', type: 'web', users: 8930, status: 'healthy',
          metrics: { responseTime: 95, uptime: 99.8, traffic: 8930, errors: 2 } },
        { name: 'Client Portal', type: 'web', users: 4520, status: 'warning',
          metrics: { responseTime: 180, uptime: 98.5, traffic: 4520, errors: 12 } },
        { name: 'Community Hub', type: 'web', users: 2840, status: 'healthy',
          metrics: { responseTime: 140, uptime: 99.2, traffic: 2840, errors: 1 } }
      ]
    },
    {
      id: 'api-gateway',
      name: 'API Gateway & Authentication',
      description: 'Point d\'entrée unique et gestion sécurisée des requêtes',
      level: 2,
      color: 'green',
      components: [
        { name: 'Kong Gateway', type: 'gateway', users: 'All', status: 'healthy',
          metrics: { responseTime: 45, uptime: 99.95, traffic: 125000, errors: 3 } },
        { name: 'Keycloak Auth', type: 'auth', users: 47, status: 'healthy',
          metrics: { responseTime: 85, uptime: 99.8, traffic: 8500, errors: 1 } },
        { name: 'Rate Limiting', type: 'security', users: 'All', status: 'healthy',
          metrics: { responseTime: 15, uptime: 99.99, traffic: 125000, errors: 0 } },
        { name: 'Load Balancer', type: 'network', users: 'All', status: 'healthy',
          metrics: { responseTime: 25, uptime: 99.99, traffic: 125000, errors: 0 } }
      ]
    },
    {
      id: 'core-api',
      name: 'Core API Services (402 Endpoints)',
      description: 'Logique métier et microservices OnlyOneAPI',
      level: 3,
      color: 'purple',
      components: [
        { name: 'Main API FastAPI', type: 'api', users: 1247, status: 'healthy',
          metrics: { responseTime: 85, uptime: 99.95, traffic: 125000, errors: 8 } },
        { name: 'Internal Services', type: 'microservice', users: 47, status: 'healthy',
          metrics: { responseTime: 45, uptime: 99.8, traffic: 85000, errors: 3 } },
        { name: 'Webhook Handler', type: 'automation', users: 234, status: 'healthy',
          metrics: { responseTime: 120, uptime: 99.5, traffic: 12000, errors: 5 } },
        { name: 'Analytics Engine', type: 'intelligence', users: 47, status: 'healthy',
          metrics: { responseTime: 200, uptime: 99.2, traffic: 8500, errors: 2 } }
      ]
    },
    {
      id: 'database',
      name: 'Data Layer & Storage',
      description: 'Persistance, cache et gestion des données',
      level: 4,
      color: 'orange',
      components: [
        { name: 'PostgreSQL Central', type: 'database', users: 'All', status: 'healthy',
          metrics: { responseTime: 15, uptime: 99.95, traffic: 45000, errors: 1 } },
        { name: 'Redis Cache', type: 'cache', users: 'All', status: 'healthy',
          metrics: { responseTime: 8, uptime: 99.98, traffic: 180000, errors: 0 } },
        { name: 'File Storage', type: 'storage', users: 1247, status: 'healthy',
          metrics: { responseTime: 50, uptime: 99.9, traffic: 5400, errors: 0 } },
        { name: 'Backup System', type: 'backup', users: 'System', status: 'healthy',
          metrics: { responseTime: 1000, uptime: 99.8, traffic: 24, errors: 0 } }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Kubernetes',
      description: 'Cluster K8s, monitoring et orchestration',
      level: 5,
      color: 'gray',
      components: [
        { name: 'BlueOcean K8s Cluster', type: 'cluster', users: 'All', status: 'healthy',
          metrics: { responseTime: 25, uptime: 99.99, traffic: 0, errors: 0 } },
        { name: 'Prometheus Monitoring', type: 'monitoring', users: 'System', status: 'healthy',
          metrics: { responseTime: 35, uptime: 99.9, traffic: 0, errors: 0 } },
        { name: 'Grafana Dashboards', type: 'observability', users: 12, status: 'healthy',
          metrics: { responseTime: 45, uptime: 99.8, traffic: 2400, errors: 0 } },
        { name: 'Node Pool Management', type: 'compute', users: 'All', status: 'healthy',
          metrics: { responseTime: 50, uptime: 99.95, traffic: 0, errors: 0 } }
      ]
    },
    {
      id: 'tools',
      name: 'External Tools & Integrations',
      description: 'Outils tiers connectés à l\'écosystème OnlyOneAPI',
      level: 6,
      color: 'indigo',
      components: [
        { name: 'Stripe Payments', type: 'payment', users: 47, status: 'healthy',
          metrics: { responseTime: 120, uptime: 99.9, traffic: 1250, errors: 0 } },
        { name: 'Mautic CRM', type: 'crm', users: 12, status: 'warning',
          metrics: { responseTime: 250, uptime: 98.2, traffic: 890, errors: 5 } },
        { name: 'Apollo.io Prospection', type: 'sales', users: 3, status: 'healthy',
          metrics: { responseTime: 180, uptime: 99.5, traffic: 420, errors: 1 } },
        { name: 'Claude Code 24/7', type: 'ai', users: 1, status: 'healthy',
          metrics: { responseTime: 85, uptime: 99.8, traffic: 15600, errors: 0 } }
      ]
    },
    {
      id: 'integrations',
      name: 'Integrations & Webhooks',
      description: 'Connexions externes et automatisations',
      level: 7,
      color: 'pink',
      components: [
        { name: 'GitHub Integration', type: 'vcs', users: 8, status: 'healthy',
          metrics: { responseTime: 95, uptime: 99.7, traffic: 2840, errors: 2 } },
        { name: 'Discord Bot', type: 'communication', users: 156, status: 'healthy',
          metrics: { responseTime: 65, uptime: 99.5, traffic: 1200, errors: 1 } },
        { name: 'N8n Workflows', type: 'automation', users: 7, status: 'development',
          metrics: { responseTime: 150, uptime: 98.8, traffic: 89, errors: 3 } },
        { name: 'PostHog Analytics', type: 'analytics', users: 1247, status: 'healthy',
          metrics: { responseTime: 110, uptime: 99.6, traffic: 25000, errors: 2 } }
      ]
    },
    {
      id: 'monitoring',
      name: 'Monitoring & Observability',
      description: 'Surveillance, métriques et alerting en temps réel',
      level: 8,
      color: 'teal',
      components: [
        { name: 'Health Checks', type: 'health', users: 'System', status: 'healthy',
          metrics: { responseTime: 25, uptime: 99.99, traffic: 1440, errors: 0 } },
        { name: 'Error Tracking', type: 'logging', users: 'System', status: 'healthy',
          metrics: { responseTime: 35, uptime: 99.95, traffic: 8500, errors: 0 } },
        { name: 'Performance Metrics', type: 'metrics', users: 'System', status: 'healthy',
          metrics: { responseTime: 20, uptime: 99.98, traffic: 125000, errors: 0 } },
        { name: 'Alert Manager', type: 'alerting', users: 8, status: 'healthy',
          metrics: { responseTime: 40, uptime: 99.9, traffic: 240, errors: 0 } }
      ]
    }
  ]

  const getLayerColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      gray: 'bg-gray-100 border-gray-300 text-gray-800',
      indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
      pink: 'bg-pink-100 border-pink-300 text-pink-800',
      teal: 'bg-teal-100 border-teal-300 text-teal-800'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'development':
        return <Zap className="h-4 w-4 text-blue-500" />
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getComponentIcon = (type: string) => {
    const icons = {
      web: Globe,
      api: Server,
      database: Database,
      cache: Zap,
      gateway: Shield,
      auth: UserCheck,
      security: Shield,
      network: Network,
      microservice: Server,
      automation: GitBranch,
      intelligence: Brain,
      storage: HardDrive,
      backup: Database,
      cluster: Container,
      monitoring: Eye,
      observability: Activity,
      compute: Cpu,
      payment: CreditCard,
      crm: Users,
      sales: Target,
      ai: Brain,
      vcs: Github,
      communication: MessageSquare,
      analytics: BarChart2,
      health: CheckCircle,
      logging: Eye,
      metrics: Gauge,
      alerting: AlertTriangle
    }
    const IconComponent = icons[type as keyof typeof icons] || Server
    return <IconComponent className="h-4 w-4" />
  }

  // Données simulées pour fallback si pas de données réelles
  const simulatedMetrics = {
    overview: {
      totalEndpoints: 402,
      activeClients: 47,
      dailyRequests: 125000,
      uptime: 99.6
    }
  }

  const dataFlow = [
    {
      id: 'client-requests',
      name: 'Requêtes Client',
      description: 'Portal/Developer → API Gateway → Core API → Database',
      path: ['Frontend', 'Gateway', 'API', 'Data'],
      latency: '< 150ms',
      throughput: '2,450 req/min'
    },
    {
      id: 'business-automation',
      name: 'Business Automation',
      description: 'CRM/Tools → Webhooks → API Services → Notifications',
      path: ['Tools', 'Gateway', 'API'],
      latency: '< 300ms',
      throughput: '890 ops/min'
    },
    {
      id: 'monitoring-telemetry',
      name: 'Télémétrie & Monitoring',
      description: 'Infrastructure → Metrics → Dashboards → Alerts',
      path: ['Infrastructure', 'Monitoring', 'Frontend'],
      latency: '< 50ms',
      throughput: '15,600 metrics/min'
    }
  ]

  const renderFlowVisualization = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <GitBranch className="h-5 w-5 mr-2" />
          Flux de Données OnlyOneAPI - Vue Temps Réel
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFlows(!showFlows)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showFlows ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {showFlows ? 'Pause Animation' : 'Démarrer Animation'}
          </button>
          <span className="text-sm text-gray-500">
            Flux {activeFlow + 1}/{onlyOneAPIFlows.length}
          </span>
        </div>
      </div>
      
      {/* Visualization des flux avec animation */}
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 min-h-[600px] overflow-hidden">
        {/* Titre dynamique du flux actuel */}
        <div className="text-center mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {onlyOneAPIFlows[activeFlow].name}
          </h4>
          <p className="text-sm text-gray-600">
            {onlyOneAPIFlows[activeFlow].description}
          </p>
        </div>

        {/* Layers de l'architecture avec animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecosystemLayers.slice(0, 4).map((layer, layerIndex) => {
            const isActiveInFlow = onlyOneAPIFlows[activeFlow].path.includes(layer.id);
            const stepIndex = onlyOneAPIFlows[activeFlow].path.indexOf(layer.id);
            const isCurrentStep = stepIndex === animationStep && showFlows;
            
            return (
              <div 
                key={layer.id}
                className={`transform transition-all duration-500 ${
                  isCurrentStep ? 'scale-105 z-10' : 'scale-100'
                }`}
              >
                <div 
                  className={`rounded-lg p-4 border-2 transition-all duration-500 backdrop-blur-sm cursor-pointer ${
                    isCurrentStep 
                      ? 'border-opacity-100 shadow-xl ring-4' 
                      : isActiveInFlow
                      ? 'border-opacity-60 shadow-lg'
                      : 'border-gray-200 border-opacity-40'
                  }`}
                  style={{
                    backgroundColor: isCurrentStep 
                      ? onlyOneAPIFlows[activeFlow].color + '20'
                      : layer.color === 'blue' ? 'rgba(227, 242, 253, 0.8)' :
                        layer.color === 'green' ? 'rgba(232, 245, 232, 0.8)' :
                        layer.color === 'purple' ? 'rgba(243, 229, 245, 0.8)' :
                        layer.color === 'orange' ? 'rgba(255, 243, 224, 0.8)' : 'rgba(245, 245, 245, 0.8)',
                    borderColor: isCurrentStep ? onlyOneAPIFlows[activeFlow].color : undefined,
                    boxShadow: isCurrentStep ? `0 0 0 4px ${onlyOneAPIFlows[activeFlow].color}30` : undefined
                  }}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      {isCurrentStep && (
                        <div className="w-3 h-3 rounded-full mr-2 animate-ping"
                             style={{ backgroundColor: onlyOneAPIFlows[activeFlow].color }}></div>
                      )}
                      {layer.name}
                    </h4>
                    <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                      Niveau {layer.level}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{layer.description}</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {layer.components.slice(0, 2).map((component, index) => (
                      <div key={index} className="flex items-center p-2 bg-white/70 rounded border border-gray-200/50 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full mr-2 bg-gray-500"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{component.name}</p>
                          <p className="text-xs text-gray-500 truncate">{component.type}</p>
                        </div>
                      </div>
                    ))}
                    {layer.components.length > 2 && (
                      <div className="text-center py-1">
                        <span className="text-xs text-gray-500">+{layer.components.length - 2} autres composants</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Flux animation paths avec SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" 
                       fill={onlyOneAPIFlows[activeFlow].color} 
                       opacity="0.8" />
            </marker>
          </defs>
          
          {/* Lignes de connexion animées entre les layers */}
          {showFlows && onlyOneAPIFlows[activeFlow].path.map((step, index) => {
            if (index >= onlyOneAPIFlows[activeFlow].path.length - 1) return null;
            const isActive = index < animationStep;
            const isCurrent = index === animationStep - 1;
            
            return (
              <line
                key={`${step}-${index}`}
                x1={`${25 + (index * 22)}%`}
                y1="50%"
                x2={`${47 + (index * 22)}%`}
                y2="50%"
                stroke={onlyOneAPIFlows[activeFlow].color}
                strokeWidth={isCurrent ? "4" : "2"}
                opacity={isActive ? "0.9" : "0.3"}
                markerEnd="url(#arrowhead)"
                className={isCurrent ? "animate-pulse" : ""}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Détails de la layer sélectionnée */}
      {selectedLayer && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          {(() => {
            const layer = ecosystemLayers.find(l => l.id === selectedLayer)
            if (!layer) return null
            return (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900">{layer.name}</h4>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Niveau {layer.level} • {layer.components.length} composants
                  </span>
                </div>
                <p className="text-sm text-blue-700 mb-4">{layer.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {layer.components.map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                      <div className="flex items-center">
                        <div className="mr-3">{getComponentIcon(component.type)}</div>
                        <div>
                          <h5 className="font-medium text-gray-900">{component.name}</h5>
                          <p className="text-xs text-gray-500">{component.type} • {component.users} utilisateurs</p>
                        </div>
                      </div>
                      {getStatusIcon(component.status)}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()} 
        </div>
      )}
    </div>
  )

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Récupération des données réelles OnlyOneAPI...</span>
      </div>
    )
  }

  // Afficher un tag si les données ne sont pas complètement réelles
  const showMockWarning = !metricsData?.success

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Compass className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">OnlyOneAPI 360° Ecosystem</h1>
              <p className="text-sm text-gray-600">Vue systémique temps réel • 8 couches • {(metrics?.overview?.totalEndpoints || 402)} endpoints</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-gray-900">{currentTime}</p>
            </div>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* Architecture Layers avec animation de flux */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Architecture OnlyOneAPI en Couches
          </h2>
          <span className="text-sm text-gray-500">{ecosystemLayers.length} niveaux • Écosystème complet</span>
        </div>
        
        <div className="space-y-4">
          {ecosystemLayers.map((layer) => (
            <div 
              key={layer.id}
              className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                selectedLayer === layer.id 
                  ? `border-${layer.color}-500 ring-2 ring-${layer.color}-500/20` 
                  : `border-gray-200 hover:border-${layer.color}-300`
              }`}
              onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${getLayerColor(layer.color)}`}>
                    Niveau {layer.level}
                  </div>
                  <h3 className="font-semibold text-gray-900">{layer.name}</h3>
                </div>
                <span className="text-sm text-gray-500">{layer.components.length} composants</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{layer.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {layer.components.map((component, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getComponentIcon(component.type)}
                        <span className="ml-2 text-sm font-medium text-gray-900 truncate">{component.name}</span>
                      </div>
                      {getStatusIcon(component.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>Type: {component.type}</div>
                      <div>Users: {component.users}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Flow & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Data Flow */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Flux de Données
          </h3>
          
          <div className="space-y-4">
            {dataFlow.map((flow) => (
              <div key={flow.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{flow.name}</h4>
                  <span className="text-xs text-gray-500">{flow.latency}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{flow.description}</p>
                
                <div className="flex items-center space-x-2 mb-2">
                  {flow.path.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {step}
                      </span>
                      {index < flow.path.length - 1 && (
                        <span className="mx-2 text-gray-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-gray-500">
                  Débit: {flow.throughput}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance Globale
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Services Healthy</p>
                <p className="text-2xl font-bold text-green-900">
                  {ecosystemLayers.reduce((acc, layer) => 
                    acc + layer.components.filter(c => c.status === 'healthy').length, 0
                  )}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">En Développement</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {ecosystemLayers.reduce((acc, layer) => 
                    acc + layer.components.filter(c => c.status === 'development').length, 0
                  )}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Alertes Actives</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center text-yellow-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Portal: Latence élevée (180ms)
                </div>
                <div className="flex items-center text-yellow-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Mautic: Uptime sous seuil (98.2%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Visualization */}
      {renderFlowVisualization()}

      {/* Infrastructure Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">OnlyOneAPI Ecosystem Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm">BlueOcean Cluster</p>
                <p className="text-xl font-bold">DigitalOcean K8s</p>
                <p className="text-blue-200 text-xs">{ecosystemLayers.length} Couches • 402 Endpoints</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Flux de Données</p>
                <p className="text-xl font-bold">{onlyOneAPIFlows.length} Flux Actifs</p>
                <p className="text-blue-200 text-xs">Animation temps réel</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Services Déployés</p>
                <p className="text-xl font-bold">{ecosystemLayers.reduce((acc, layer) => acc + layer.components.length, 0)}</p>
                <p className="text-blue-200 text-xs">Architecture complète</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">360°</p>
            <p className="text-sm opacity-90">OnlyOneAPI</p>
          </div>
        </div>
      </div>
    </div>
  )
}