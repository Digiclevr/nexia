'use client'

import React from 'react'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { nexiaApi } from '@/lib/api'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function HealthChecksPage() {
  const { currentTime } = useCurrentTime()
  
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['health-checks'],
    queryFn: () => nexiaApi.fetchEcosystemHealth(),
    refetchInterval: 3000,
    retry: 3,
    retryDelay: 1000
  });

  const healthChecks = [
    {
      id: 'HC-001',
      name: 'API OnlyOneAPI',
      status: 'healthy',
      url: 'https://api.onlyoneapi.com/health',
      responseTime: '150ms',
      lastCheck: '2s ago',
      uptime: '99.9%'
    },
    {
      id: 'HC-002',
      name: 'PostgreSQL Central',
      status: 'healthy',
      url: 'postgres-central.platform:5432',
      responseTime: '45ms',
      lastCheck: '3s ago',
      uptime: '99.8%'
    },
    {
      id: 'HC-003',
      name: 'Redis Cache',
      status: 'warning',
      url: 'redis.platform:6379',
      responseTime: '320ms',
      lastCheck: '1s ago',
      uptime: '98.5%'
    },
    {
      id: 'HC-004',
      name: 'Kubernetes API',
      status: 'healthy',
      url: 'k8s-api.cluster.local:6443',
      responseTime: '85ms',
      lastCheck: '5s ago',
      uptime: '99.7%'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'unhealthy': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'unhealthy': return 'text-red-600 bg-red-100 border-red-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-2 lg:px-4 py-2">
          <div className="flex items-center min-w-0">
            <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 mr-2" />
            <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-semibold text-gray-900 truncate">Health Checks</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{currentTime}</p>
            </div>
            <button className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
              <RefreshCw className="h-3 w-3 mr-1 inline" />
              Check
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-2 lg:p-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2 h-1/6">
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Services</p>
                <p className="text-lg font-bold text-blue-600">{healthChecks.length}</p>
              </div>
              <Activity className="h-5 w-5 text-blue-600 flex-shrink-0" />
            </div>
          </div>
          
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Healthy</p>
                <p className="text-lg font-bold text-green-600">{healthChecks.filter(h => h.status === 'healthy').length}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            </div>
          </div>
          
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Warnings</p>
                <p className="text-lg font-bold text-yellow-600">{healthChecks.filter(h => h.status === 'warning').length}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            </div>
          </div>
          
          <div className="bg-white p-2 rounded border border-gray-200">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Avg Response</p>
                <p className="text-lg font-bold text-blue-600">150ms</p>
              </div>
              <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-2 h-5/6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Health Checks Status</h2>
          <div className="space-y-1 overflow-y-auto max-h-full">
            {healthChecks.map((check) => (
              <div key={check.id} className="border border-gray-200 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center min-w-0">
                    {getStatusIcon(check.status)}
                    <div className="ml-2 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{check.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{check.url}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(check.status)}`}>
                    {check.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <span>Response: {check.responseTime}</span>
                  <span>Uptime: {check.uptime}</span>
                  <span>Last: {check.lastCheck}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}