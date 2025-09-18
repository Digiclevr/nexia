'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  Network,
  RefreshCw,
  Play,
  Square,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react'

interface ServiceStatus {
  name: string
  port: number
  status: 'active' | 'inactive' | 'error'
  uptime?: string
  lastCheck: string
  health?: number
  description: string
}

interface ClusterNode {
  name: string
  status: 'Ready' | 'NotReady'
  cpu: number
  memory: number
  pods: number
  capacity: {
    cpu: string
    memory: string
    pods: number
  }
}

export default function MonitoringPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'NEXIA-SUPERVISOR',
      port: 7010,
      status: 'active',
      uptime: '2h 45m',
      lastCheck: '2025-09-16T02:24:26Z',
      health: 98,
      description: 'Interface principale NEXIA'
    },
    {
      name: 'KREACH-WEB',
      port: 5003,
      status: 'active',
      uptime: '1h 23m',
      lastCheck: '2025-09-16T02:24:14Z',
      health: 95,
      description: 'Interface web KREACH'
    },
    {
      name: 'KREACH-API',
      port: 8001,
      status: 'error',
      uptime: '0m',
      lastCheck: '2025-09-16T02:24:42Z',
      health: 0,
      description: 'API Backend KREACH'
    },
    {
      name: 'NEXTSTEP-API',
      port: 8021,
      status: 'inactive',
      uptime: '0m',
      lastCheck: '2025-09-16T02:24:00Z',
      health: 0,
      description: 'API NextStep affiliation'
    },
    {
      name: 'ONLYONEAPI',
      port: 8020,
      status: 'active',
      uptime: '3d 7h',
      lastCheck: '2025-09-16T02:24:00Z',
      health: 99,
      description: 'API OnlyOneAPI (401 endpoints)'
    }
  ])

  const [clusterNodes] = useState<ClusterNode[]>([
    {
      name: 'blueocean-staging-01',
      status: 'Ready',
      cpu: 65,
      memory: 78,
      pods: 21,
      capacity: { cpu: '4 cores', memory: '8Gi', pods: 50 }
    },
    {
      name: 'api-pool-01',
      status: 'Ready',
      cpu: 45,
      memory: 82,
      pods: 10,
      capacity: { cpu: '8 cores', memory: '16Gi', pods: 30 }
    },
    {
      name: 'nextstep-affiliation-01',
      status: 'Ready',
      cpu: 32,
      memory: 56,
      pods: 4,
      capacity: { cpu: '2 cores', memory: '4Gi', pods: 20 }
    }
  ])

  const [logs, setLogs] = useState([
    { time: '02:24:42', level: 'ERROR', service: 'KREACH-API', message: 'Échec du redémarrage - Port 8001 non accessible' },
    { time: '02:24:26', level: 'SUCCESS', service: 'NEXIA-SUPERVISOR', message: 'Redémarrage réussi - PID: 14816' },
    { time: '02:24:16', level: 'WARNING', service: 'NEXIA-SUPERVISOR', message: 'Service redémarré automatiquement' },
    { time: '02:24:14', level: 'ALERT', service: 'NEXIA-SUPERVISOR', message: 'Service détecté comme inactif' },
    { time: '02:23:42', level: 'INFO', service: 'SYSTEM', message: 'Démarrage du health check écosystème' }
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = async () => {
    setIsRefreshing(true)
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mise à jour des timestamps
    const now = new Date().toISOString()
    setServices(prev => prev.map(service => ({
      ...service,
      lastCheck: now
    })))
    
    setIsRefreshing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      error: 'bg-orange-100 text-orange-800'
    }
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-50'
      case 'WARNING':
        return 'text-orange-600 bg-orange-50'
      case 'SUCCESS':
        return 'text-green-600 bg-green-50'
      case 'ALERT':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-blue-600 bg-blue-50'
    }
  }

  const activeServices = services.filter(s => s.status === 'active').length
  const totalServices = services.length
  const systemHealth = Math.round((activeServices / totalServices) * 100)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header avec stats globales */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Monitoring Écosystème
            </h1>
            <p className="text-gray-600">Surveillance en temps réel des services NEXIA</p>
          </div>
          <Button onClick={refreshData} disabled={isRefreshing} className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </Button>
        </div>

        {/* KPIs globaux */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Santé Système</p>
                  <p className="text-2xl font-bold">{systemHealth}%</p>
                </div>
                <div className={`p-2 rounded-full ${systemHealth > 80 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {systemHealth > 80 ? 
                    <CheckCircle className="w-6 h-6 text-green-600" /> : 
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  }
                </div>
              </div>
              <Progress value={systemHealth} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Services Actifs</p>
                  <p className="text-2xl font-bold">{activeServices}/{totalServices}</p>
                </div>
                <Server className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cluster Nodes</p>
                  <p className="text-2xl font-bold">{clusterNodes.filter(n => n.status === 'Ready').length}/{clusterNodes.length}</p>
                </div>
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Uptime Moyen</p>
                  <p className="text-2xl font-bold">98.5%</p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden p-4">
        <Tabs defaultValue="services" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="cluster">Cluster K8s</TabsTrigger>
            <TabsTrigger value="logs">Logs Temps Réel</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="grid gap-4">
                {services.map((service) => (
                  <Card key={service.name}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(service.status)}
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription>{service.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(service.status)}
                          <Badge variant="outline">Port {service.port}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Uptime</p>
                          <p className="font-semibold">{service.uptime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Santé</p>
                          <div className="flex items-center gap-2">
                            <Progress value={service.health} className="flex-1" />
                            <span className="text-sm font-medium">{service.health}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dernière vérification</p>
                          <p className="text-sm">{new Date(service.lastCheck).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      
                      {service.status !== 'active' && (
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Redémarrer
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Voir Logs
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cluster" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="grid gap-4">
                {clusterNodes.map((node) => (
                  <Card key={node.name}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Server className="w-5 h-5" />
                          {node.name}
                        </CardTitle>
                        <Badge className={node.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {node.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Cpu className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">CPU</span>
                          </div>
                          <Progress value={node.cpu} className="mb-1" />
                          <p className="text-sm text-gray-600">{node.cpu}% de {node.capacity.cpu}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <HardDrive className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Mémoire</span>
                          </div>
                          <Progress value={node.memory} className="mb-1" />
                          <p className="text-sm text-gray-600">{node.memory}% de {node.capacity.memory}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Network className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">Pods</span>
                          </div>
                          <Progress value={(node.pods / node.capacity.pods) * 100} className="mb-1" />
                          <p className="text-sm text-gray-600">{node.pods}/{node.capacity.pods} pods</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 overflow-hidden">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle>Logs Système en Temps Réel</CardTitle>
                <CardDescription>Dernières activités de l'écosystème</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto font-mono text-sm bg-gray-50 p-4 rounded">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-3 mb-2 p-2 rounded">
                      <span className="text-gray-500 min-w-[60px]">{log.time}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium min-w-[80px] text-center ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-blue-600 min-w-[120px]">{log.service}</span>
                      <span className="text-gray-800">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="space-y-4">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <CardTitle className="text-red-800">Service Critique Indisponible</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700 mb-2">KREACH-API (port 8001) est en panne depuis 5 minutes</p>
                    <p className="text-sm text-red-600">Dernière tentative de redémarrage échouée à 02:24:42</p>
                    <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700">
                      Intervention Manuelle Requise
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <CardTitle className="text-orange-800">Redémarrage Automatique</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 mb-2">NEXIA-SUPERVISOR redémarré automatiquement</p>
                    <p className="text-sm text-orange-600">Service détecté comme inactif et relancé avec succès</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-green-800">Système Opérationnel</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-2">La majorité des services fonctionnent normalement</p>
                    <p className="text-sm text-green-600">4/5 services actifs - Cluster Kubernetes stable</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}