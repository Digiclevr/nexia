'use client'

import { 
  Globe,
  Server,
  Database,
  Cloud,
  Network,
  Shield,
  Zap,
  Users,
  Activity,
  CheckCircle,
  AlertTriangle,
  Crown,
  RefreshCw,
  Eye,
  Layers,
  GitBranch,
  Container,
  Brain
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import EmpireFlowAnimation from '@/components/EmpireFlowAnimation'

export default function ArchitecturePage() {
  const { currentTime } = useCurrentTime()
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [activeFlow, setActiveFlow] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [showFlows, setShowFlows] = useState(true)
  
  // Animation automatique des flux
  useEffect(() => {
    if (!showFlows) return;
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        const currentFlow = empireFlows[activeFlow];
        if (prev >= currentFlow.path.length - 1) {
          setActiveFlow(prevFlow => (prevFlow + 1) % empireFlows.length);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeFlow, showFlows]);

  const empireFlows = [
    {
      id: 'command-flow',
      name: 'Flux Commandes Nexia',
      type: 'primary',
      color: '#2196F3',
      path: ['emperor', 'intelligence', 'application', 'services'],
      description: 'Ludovic → Nexia → Services → Exécution'
    },
    {
      id: 'data-flow',
      name: 'Flux Données Empire',
      type: 'secondary', 
      color: '#FF9800',
      path: ['services', 'data', 'application', 'intelligence'],
      description: 'Collecte → Traitement → Analyse → Intelligence'
    },
    {
      id: 'revenue-flow',
      name: 'Flux Revenus',
      type: 'revenue',
      color: '#4CAF50',
      path: ['services', 'application', 'intelligence', 'emperor'],
      description: 'OnlyOneAPI → NEXTGEN → Agrégation → Reporting'
    }
  ]
  
  const architectureLayers = [
    {
      id: 'presentation',
      name: 'Couche Présentation',
      description: 'Interfaces utilisateur et expérience client',
      level: 1,
      color: 'blue',
      components: [
        { name: 'OnlyOneAPI Portal', type: 'web', users: 1247, status: 'healthy' },
        { name: 'NEXTGEN Sites', type: 'web', users: 8934, status: 'healthy' },
        { name: 'KREACH Interface', type: 'web', users: 23, status: 'development' },
        { name: 'KVIBE Dashboard', type: 'web', users: 156, status: 'development' }
      ]
    },
    {
      id: 'application',
      name: 'Couche Application',
      description: 'Logique métier et orchestration des services',
      level: 2,
      color: 'green',
      components: [
        { name: 'NEXIA Supervisor', type: 'orchestrator', users: 1, status: 'healthy' },
        { name: 'Business Automation', type: 'agents', users: 7, status: 'development' },
        { name: 'API Gateway Kong', type: 'gateway', users: 2000, status: 'healthy' },
        { name: 'Claude Code Agent', type: 'ai', users: 1, status: 'healthy' }
      ]
    },
    {
      id: 'services',
      name: 'Couche Services',
      description: 'Microservices et APIs métier',
      level: 3,
      color: 'purple',
      components: [
        { name: 'OnlyOneAPI Core', type: 'api', users: 1247, status: 'healthy' },
        { name: 'KREACH Intelligence', type: 'ai', users: 23, status: 'development' },
        { name: 'NEXTGEN Automation', type: 'automation', users: 8934, status: 'healthy' },
        { name: 'ENDPOINTS Mining', type: 'intelligence', users: 234, status: 'healthy' }
      ]
    },
    {
      id: 'data',
      name: 'Couche Données',
      description: 'Persistance et gestion des données',
      level: 4,
      color: 'orange',
      components: [
        { name: 'PostgreSQL Central', type: 'database', users: 'All', status: 'healthy' },
        { name: 'Redis Cache', type: 'cache', users: 'All', status: 'healthy' },
        { name: 'Directus CMS', type: 'cms', users: 12, status: 'healthy' },
        { name: 'N8n Workflows', type: 'automation', users: 47, status: 'warning' }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Couche Infrastructure',
      description: 'Infrastructure Kubernetes et réseau',
      level: 5,
      color: 'gray',
      components: [
        { name: 'DigitalOcean K8s', type: 'cluster', users: 'All', status: 'healthy' },
        { name: 'Node Pools', type: 'compute', users: 'All', status: 'healthy' },
        { name: 'Load Balancers', type: 'network', users: 'All', status: 'healthy' },
        { name: 'Monitoring Stack', type: 'observability', users: 'All', status: 'healthy' }
      ]
    }
  ]

  const dataFlow = [
    {
      id: 'user-request',
      name: 'Requête Utilisateur',
      description: 'Frontend → API Gateway → Services',
      path: ['Présentation', 'Application', 'Services'],
      latency: '< 200ms',
      throughput: '1,247 req/min'
    },
    {
      id: 'data-processing',
      name: 'Traitement Données',
      description: 'Services → Database → Cache → Response',
      path: ['Services', 'Données', 'Application'],
      latency: '< 50ms',
      throughput: '5,432 ops/min'
    },
    {
      id: 'automation',
      name: 'Automation Flow',
      description: 'Agents → N8n → Services → Database',
      path: ['Application', 'Services', 'Données'],
      latency: '< 1s',
      throughput: '89 workflows/h'
    }
  ]

  const networkTopology = {
    namespaces: [
      { name: 'api-pool', applications: 15, status: 'healthy', cpu: '45%', memory: '62%' },
      { name: 'platform-pool', applications: 8, status: 'healthy', cpu: '34%', memory: '48%' },
      { name: 'saas', applications: 12, status: 'healthy', cpu: '67%', memory: '71%' },
      { name: 'monitoring', applications: 6, status: 'healthy', cpu: '23%', memory: '31%' },
      { name: 'nexia', applications: 4, status: 'development', cpu: '12%', memory: '18%' }
    ],
    connections: [
      { from: 'api-pool', to: 'platform-pool', type: 'database', status: 'healthy' },
      { from: 'saas', to: 'platform-pool', type: 'cache', status: 'healthy' },
      { from: 'nexia', to: 'api-pool', type: 'supervision', status: 'healthy' },
      { from: 'monitoring', to: 'all', type: 'observability', status: 'healthy' }
    ]
  }

  const getLayerColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
      gray: 'bg-gray-100 border-gray-300 text-gray-800'
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
      orchestrator: Crown,
      agents: Users,
      gateway: Shield,
      ai: Brain,
      automation: GitBranch,
      cms: Database,
      cluster: Container,
      compute: Server,
      network: Network,
      observability: Eye,
      intelligence: Activity
    }
    const IconComponent = icons[type as keyof typeof icons] || Server
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Globe className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-nexia-dark">Architecture Empire</h1>
              <p className="text-sm text-nexia-600">Vue technique • 5 couches • Infrastructure Kubernetes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-nexia-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-nexia-dark">{currentTime}</p>
            </div>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-nexia-600 bg-white border border-nexia-300 rounded-md hover:bg-nexia-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* Architecture Layers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nexia-dark flex items-center">
            <Layers className="h-5 w-5 mr-2" />
            Architecture en Couches
          </h2>
          <span className="text-sm text-nexia-500">5 niveaux • Microservices</span>
        </div>
        
        <div className="space-y-4">
          {architectureLayers.map((layer) => (
            <div 
              key={layer.id}
              className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                selectedLayer === layer.id 
                  ? `border-${layer.color}-500 ring-2 ring-${layer.color}-500/20` 
                  : `border-gray-200 hover:border-${layer.color}-300`
              }`}
              onClick={() => setSelectedLayer(layer.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${getLayerColor(layer.color)}`}>
                    Niveau {layer.level}
                  </div>
                  <h3 className="font-semibold text-nexia-dark">{layer.name}</h3>
                </div>
                <span className="text-sm text-nexia-500">{layer.components.length} composants</span>
              </div>
              
              <p className="text-sm text-nexia-600 mb-4">{layer.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {layer.components.map((component, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getComponentIcon(component.type)}
                        <span className="ml-2 text-sm font-medium text-nexia-dark">{component.name}</span>
                      </div>
                      {getStatusIcon(component.status)}
                    </div>
                    <div className="text-xs text-nexia-500">
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

      {/* Data Flow & Network Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Data Flow */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-nexia-dark mb-4 flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Flux de Données
          </h3>
          
          <div className="space-y-4">
            {dataFlow.map((flow) => (
              <div key={flow.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-nexia-dark">{flow.name}</h4>
                  <span className="text-xs text-nexia-500">{flow.latency}</span>
                </div>
                <p className="text-sm text-nexia-600 mb-3">{flow.description}</p>
                
                <div className="flex items-center space-x-2 mb-2">
                  {flow.path.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {step}
                      </span>
                      {index < flow.path.length - 1 && (
                        <span className="mx-2 text-nexia-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-nexia-500">
                  Débit: {flow.throughput}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Topology */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-nexia-dark mb-4 flex items-center">
            <Network className="h-5 w-5 mr-2" />
            Topologie Réseau
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-nexia-dark mb-3">Namespaces Kubernetes</h4>
              <div className="space-y-2">
                {networkTopology.namespaces.map((ns, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Container className="h-4 w-4 mr-2 text-nexia-500" />
                      <div>
                        <span className="text-sm font-medium text-nexia-dark">{ns.name}</span>
                        <div className="text-xs text-nexia-500">{ns.applications} apps</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-nexia-500">
                        CPU: {ns.cpu} • RAM: {ns.memory}
                      </div>
                      {getStatusIcon(ns.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-nexia-dark mb-3">Connexions Inter-Services</h4>
              <div className="space-y-2">
                {networkTopology.connections.map((conn, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <div className="flex items-center text-sm">
                      <span className="text-nexia-600">{conn.from}</span>
                      <span className="mx-2 text-nexia-400">→</span>
                      <span className="text-nexia-600">{conn.to}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-nexia-500 mr-2">{conn.type}</span>
                      {getStatusIcon(conn.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Animation Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-nexia-dark flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Flux de Données Empire - Vue Temps Réel
          </h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFlows(!showFlows)}
              className={`px-3 py-1 text-sm rounded-md ${
                showFlows ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {showFlows ? 'Pause Animation' : 'Démarrer Animation'}
            </button>
            <span className="text-sm text-nexia-500">
              Flux {activeFlow + 1}/{empireFlows.length}
            </span>
          </div>
        </div>
        
        {/* Flow Visualization avec Animation SVG Avancée */}
        <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 min-h-[800px] overflow-hidden">
          <EmpireFlowAnimation
            flows={empireFlows}
            layers={architectureLayers}
            activeFlow={activeFlow}
            animationStep={animationStep}
            onFlowChange={(index) => {
              setActiveFlow(index)
              setAnimationStep(0)
            }}
          />
          
          {/* Layers statiques sous l'animation */}
          <div className="relative z-0 space-y-20 mt-20 pt-32">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-nexia-dark">Architecture Empire par Couches</h3>
              <p className="text-sm text-nexia-600">Cliquez sur les cercles colorés pour explorer chaque niveau</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architectureLayers.map((layer, layerIndex) => {
                const isActiveInFlow = empireFlows[activeFlow].path.includes(layer.id);
                const stepIndex = empireFlows[activeFlow].path.indexOf(layer.id);
                const isCurrentStep = stepIndex === animationStep;
                
                return (
                  <div 
                    key={layer.id}
                    className={`transform transition-all duration-500 ${
                      isCurrentStep ? 'scale-105 z-10' : 'scale-100'
                    }`}
                  >
                    <div 
                      className={`rounded-lg p-4 border-2 transition-all duration-500 backdrop-blur-sm ${
                        isCurrentStep 
                          ? 'border-opacity-100 shadow-xl ring-4' 
                          : isActiveInFlow
                          ? 'border-opacity-60 shadow-lg'
                          : 'border-gray-200 border-opacity-40'
                      }`}
                      style={{
                        backgroundColor: isCurrentStep 
                          ? empireFlows[activeFlow].color + '20'
                          : layer.color === 'blue' ? 'rgba(227, 242, 253, 0.8)' :
                            layer.color === 'green' ? 'rgba(232, 245, 232, 0.8)' :
                            layer.color === 'purple' ? 'rgba(243, 229, 245, 0.8)' :
                            layer.color === 'orange' ? 'rgba(255, 243, 224, 0.8)' : 'rgba(245, 245, 245, 0.8)',
                        borderColor: isCurrentStep ? empireFlows[activeFlow].color : undefined,
                        boxShadow: isCurrentStep ? `0 0 0 4px ${empireFlows[activeFlow].color}30` : undefined
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-nexia-dark flex items-center">
                          {isCurrentStep && (
                            <div className="w-3 h-3 rounded-full mr-2 animate-ping"
                                 style={{ backgroundColor: empireFlows[activeFlow].color }}></div>
                          )}
                          {layer.name}
                        </h4>
                        <span className="text-xs text-nexia-500 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                          Niveau {layer.level}
                        </span>
                      </div>
                      
                      <p className="text-sm text-nexia-600 mb-3">{layer.description}</p>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {layer.components.slice(0, 3).map((component, index) => (
                          <div key={index} className="flex items-center p-2 bg-white/70 rounded border border-gray-200/50 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full mr-2 bg-nexia-500"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-nexia-dark truncate">{component.name}</p>
                              <p className="text-xs text-nexia-500 truncate">{component.type}</p>
                            </div>
                          </div>
                        ))}
                        {layer.components.length > 3 && (
                          <div className="text-center py-1">
                            <span className="text-xs text-nexia-500">+{layer.components.length - 3} autres composants</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Empire BlueOcean Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm">Kubernetes Cluster</p>
                <p className="text-xl font-bold">DigitalOcean</p>
                <p className="text-blue-200 text-xs">3 Node Pools • 47 Pods</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Flux de Données</p>
                <p className="text-xl font-bold">{empireFlows.length} Flux Actifs</p>
                <p className="text-blue-200 text-xs">Animation temps réel</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Architecture</p>
                <p className="text-xl font-bold">{architectureLayers.length} Couches</p>
                <p className="text-blue-200 text-xs">Vue isométrique</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">∞</p>
            <p className="text-sm opacity-90">Flux Empire</p>
          </div>
        </div>
      </div>
    </div>
  )
}