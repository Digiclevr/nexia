'use client'

import React from 'react'
import { Server, RefreshCw } from 'lucide-react'
import { useCurrentTime } from '@/hooks/useCurrentTime'

export default function DeploymentPage() {
  const { currentTime } = useCurrentTime()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-2 lg:px-4 py-2">
          <div className="flex items-center min-w-0">
            <Server className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 mr-2" />
            <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-semibold text-gray-900 truncate">Control Center</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{currentTime}</p>
            </div>
            <button className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
              <RefreshCw className="h-3 w-3 mr-1 inline" />
              Deploy
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-2 lg:p-3">
        <div className="bg-white border border-gray-200 rounded p-4 h-full flex items-center justify-center">
          <div className="text-center">
            <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Control Center</h2>
            <p className="text-gray-600">Centre de contrôle des déploiements</p>
          </div>
        </div>
      </div>
    </div>
  )
}