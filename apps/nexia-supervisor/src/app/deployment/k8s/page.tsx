'use client'

import React, { useState } from 'react'
import { 
  Eye, 
  RefreshCw, 
  Server, 
  Container, 
  Cpu, 
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Database,
  Globe
} from 'lucide-react'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { useQuery } from '@tanstack/react-query'

export default function KubernetesStatusPage() {
  const { currentTime } = useCurrentTime()
  const [selectedNamespace, setSelectedNamespace] = useState('all')

  // Simulated Kubernetes data - in real app would fetch from K8s API
  const clusterInfo = {
    name: 'blueocean-cluster',
    version: 'v1.28.3',
    region: 'fra1',
    provider: 'DigitalOcean',
    status: 'healthy'
  }

  const nodeStats = {
    total: 4,
    ready: 4,
    notReady: 0,
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    storageUsage: 34.1
  }

  const namespaces = [
    { name: 'nextstep', pods: 15, services: 8, status: 'healthy' },
    { name: 'nexia-voice', pods: 4, services: 3, status: 'healthy' },
    { name: 'nexia-supervisor', pods: 2, services: 2, status: 'healthy' },
    { name: 'platform', pods: 12, services: 6, status: 'healthy' },
    { name: 'monitoring', pods: 8, services: 4, status: 'warning' },
    { name: 'argocd', pods: 6, services: 3, status: 'healthy' }
  ]

  const deployments = [
    {
      name: 'nexia-frontend',
      namespace: 'nextstep',
      replicas: { desired: 2, ready: 2, available: 2 },
      image: 'nexia/frontend:latest',
      status: 'running',
      age: '2d'
    },
    {
      name: 'nexia-whisper-gpu',
      namespace: 'nexia-voice',
      replicas: { desired: 1, ready: 1, available: 1 },
      image: 'python:3.11',
      status: 'running',
      age: '1d'
    },
    {
      name: 'nexia-supervisor',
      namespace: 'nexia-supervisor',
      replicas: { desired: 1, ready: 1, available: 1 },
      image: 'node:18-alpine',
      status: 'running',
      age: '3h'
    },
    {
      name: 'postgres-central',
      namespace: 'platform',
      replicas: { desired: 1, ready: 1, available: 1 },
      image: 'postgres:15',
      status: 'running',
      age: '7d'
    },
    {
      name: 'prometheus-server',
      namespace: 'monitoring',
      replicas: { desired: 1, ready: 0, available: 0 },
      image: 'prom/prometheus:latest',
      status: 'pending',
      age: '2h'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'warning':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRefresh = () => {
    alert('🔄 Synchronisation cluster K8s - Récupération état pods, services, déploiements')
  }

  const filteredDeployments = selectedNamespace === 'all' 
    ? deployments 
    : deployments.filter(d => d.namespace === selectedNamespace)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4">
          <div className="flex items-center">
            <Server className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Kubernetes Status</h1>
              <p className="text-sm text-gray-600">Cluster BlueOcean • DigitalOcean Fra1</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Paris • Temps Réel</p>
              <p className="text-sm font-medium text-gray-900">{currentTime}</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Cluster
            </button>
          </div>
        </div>
      </header>

      {/* Cluster Overview */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cluster Status</p>
                <p className="text-lg font-bold text-green-600">Healthy</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nodes Ready</p>
                <p className="text-lg font-bold text-blue-600">{nodeStats.ready}/{nodeStats.total}</p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                <p className="text-lg font-bold text-purple-600">{nodeStats.cpuUsage}%</p>
              </div>
              <Cpu className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                <p className="text-lg font-bold text-orange-600">{nodeStats.memoryUsage}%</p>
              </div>
              <HardDrive className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Namespaces</p>
                <p className="text-lg font-bold text-gray-900">{namespaces.length}</p>
              </div>
              <Container className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Namespaces Overview */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Namespaces</h2>
            <p className="text-sm text-gray-600">État des espaces de noms NEXIA</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {namespaces.map((ns) => (
                <div key={ns.name} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{ns.name}</h3>
                    {getStatusIcon(ns.status)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Pods:</span>
                      <span className="font-medium">{ns.pods}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Services:</span>
                      <span className="font-medium">{ns.services}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deployments */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Deployments</h2>
                <p className="text-sm text-gray-600">Applications déployées sur le cluster</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <select
                  value={selectedNamespace}
                  onChange={(e) => setSelectedNamespace(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les namespaces</option>
                  {namespaces.map((ns) => (
                    <option key={ns.name} value={ns.name}>{ns.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deployment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Replicas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeployments.map((deployment) => (
                  <tr key={`${deployment.namespace}-${deployment.name}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{deployment.name}</div>
                        <div className="text-sm text-gray-500">{deployment.namespace}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {deployment.replicas.ready}/{deployment.replicas.desired}
                      </div>
                      <div className="text-xs text-gray-500">
                        {deployment.replicas.available} disponibles
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded border">
                        {deployment.image}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(deployment.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                          {deployment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {deployment.age}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}