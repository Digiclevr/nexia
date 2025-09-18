'use client'

import { useEffect, useState } from 'react'

interface FlowAnimationProps {
  flows: any[]
  layers: any[]
  activeFlow: number
  animationStep: number
  onFlowChange: (index: number) => void
}

export default function EmpireFlowAnimation({ 
  flows, 
  layers, 
  activeFlow, 
  animationStep, 
  onFlowChange 
}: FlowAnimationProps) {
  const [particleKey, setParticleKey] = useState(0)

  // Redémarrer les particules quand le flux change
  useEffect(() => {
    setParticleKey(prev => prev + 1)
  }, [activeFlow])

  const getLayerPosition = (layerId: string) => {
    const layerIndex = layers.findIndex(l => l.id === layerId)
    if (layerIndex === -1) return null
    
    return {
      x: 200 + (layerIndex * 150),
      y: 100 + (layerIndex * 120),
      layer: layerIndex
    }
  }

  const currentFlow = flows[activeFlow]
  const currentPath = currentFlow.path.slice(0, animationStep + 1)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Flow Info Panel */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 min-w-72 pointer-events-auto z-20">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <span className="text-2xl mr-2">🔄</span>
          <div 
            className="w-4 h-4 rounded-full mr-2 animate-pulse"
            style={{ backgroundColor: currentFlow.color }}
          ></div>
          {currentFlow.name}
        </h4>
        <p className="text-sm text-gray-600 mb-3">{currentFlow.description}</p>
        
        <div className="bg-gray-100 rounded-lg p-2 mb-3">
          <div 
            className="h-3 rounded-lg transition-all duration-1000 relative overflow-hidden"
            style={{ backgroundColor: currentFlow.color + '20' }}
          >
            <div 
              className="h-full rounded-lg transition-all duration-1000 relative"
              style={{ 
                backgroundColor: currentFlow.color,
                width: `${(animationStep / (currentFlow.path.length - 1)) * 100}%` 
              }}
            >
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 w-6 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                style={{ 
                  animation: 'shimmer 2s infinite',
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`
                }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>Étape {animationStep + 1} / {currentFlow.path.length}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {Math.round((animationStep / (currentFlow.path.length - 1)) * 100)}%
          </span>
        </div>
      </div>

      {/* SVG Animation Layer */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        viewBox="0 0 1200 800"
        style={{ minHeight: '800px' }}
      >
        <defs>
          {/* Arrow markers */}
          <marker
            id={`arrowhead-${activeFlow}`}
            markerWidth="12"
            markerHeight="8"
            refX="10"
            refY="4"
            orient="auto"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill={currentFlow.color}
              className="drop-shadow-sm"
            />
          </marker>
          
          {/* Gradient for lines */}
          <linearGradient id={`flowGradient-${activeFlow}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: currentFlow.color, stopOpacity: 0.2 }} />
            <stop offset="30%" style={{ stopColor: currentFlow.color, stopOpacity: 0.8 }} />
            <stop offset="70%" style={{ stopColor: currentFlow.color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: currentFlow.color, stopOpacity: 0.2 }} />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`glow-${activeFlow}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pulse animation */}
          <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background grid for depth */}
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f0f0f0" strokeWidth="0.5" opacity="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Draw flow connections with advanced animations */}
        {currentPath.map((layerId, index) => {
          if (index === currentPath.length - 1) return null
          
          const startPos = getLayerPosition(layerId)
          const endPos = getLayerPosition(currentPath[index + 1])
          
          if (!startPos || !endPos) return null

          const isActive = index < animationStep
          const isCurrentConnection = index === animationStep - 1
          
          // Calculate bezier curve for more organic flow
          const midX = (startPos.x + endPos.x) / 2
          const midY = (startPos.y + endPos.y) / 2 - 50
          const pathData = `M ${startPos.x} ${startPos.y} Q ${midX} ${midY} ${endPos.x} ${endPos.y}`
          
          return (
            <g key={`connection-${index}-${particleKey}`}>
              {/* Main flow line */}
              <path
                d={pathData}
                fill="none"
                stroke={isActive ? currentFlow.color : '#E5E7EB'}
                strokeWidth={isCurrentConnection ? "6" : "4"}
                strokeDasharray={isCurrentConnection ? "none" : "10,5"}
                markerEnd={isActive ? `url(#arrowhead-${activeFlow})` : ''}
                opacity={isActive ? 1 : 0.3}
                filter={isCurrentConnection ? `url(#glow-${activeFlow})` : ''}
                className="transition-all duration-1000"
              />
              
              {/* Animated data particles flowing along the path */}
              {isActive && (
                <>
                  {/* Primary particle */}
                  <circle r="4" fill={currentFlow.color} filter={`url(#glow-${activeFlow})`}>
                    <animateMotion
                      path={pathData}
                      dur="3s"
                      repeatCount="indefinite"
                      begin="0s"
                    />
                    <animate
                      attributeName="r"
                      values="3;6;3"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Secondary particles */}
                  <circle r="2" fill={currentFlow.color} opacity="0.7">
                    <animateMotion
                      path={pathData}
                      dur="4s"
                      repeatCount="indefinite"
                      begin="1s"
                    />
                  </circle>
                  
                  <circle r="2" fill={currentFlow.color} opacity="0.5">
                    <animateMotion
                      path={pathData}
                      dur="5s"
                      repeatCount="indefinite"
                      begin="2s"
                    />
                  </circle>

                  {/* Data burst effect for current connection */}
                  {isCurrentConnection && (
                    <g>
                      {[0, 1, 2].map(i => (
                        <circle
                          key={i}
                          r="1"
                          fill={currentFlow.color}
                          opacity="0.8"
                        >
                          <animateMotion
                            path={pathData}
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${i * 0.3}s`}
                          />
                          <animate
                            attributeName="opacity"
                            values="0;0.8;0"
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${i * 0.3}s`}
                          />
                        </circle>
                      ))}
                    </g>
                  )}
                </>
              )}
            </g>
          )
        })}

        {/* Layer nodes with pulsing animations */}
        {currentPath.map((layerId, index) => {
          const pos = getLayerPosition(layerId)
          if (!pos) return null

          const isActive = index <= animationStep
          const isCurrentStep = index === animationStep
          const isCompleted = index < animationStep

          return (
            <g key={`node-${layerId}-${particleKey}`}>
              {/* Node shadow */}
              <circle
                cx={pos.x + 2}
                cy={pos.y + 2}
                r="25"
                fill="rgba(0,0,0,0.1)"
                className="transition-all duration-1000"
              />
              
              {/* Main node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isCurrentStep ? "30" : "25"}
                fill="white"
                stroke={isActive ? currentFlow.color : '#D1D5DB'}
                strokeWidth={isCurrentStep ? "5" : "3"}
                strokeDasharray={isCompleted ? "none" : isActive ? "none" : "8,4"}
                opacity={isActive ? 1 : 0.4}
                filter={isCurrentStep ? "url(#pulseGlow)" : ''}
                className="transition-all duration-1000"
              />
              
              {/* Pulsing animation for current step */}
              {isCurrentStep && (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="40"
                    fill="none"
                    stroke={currentFlow.color}
                    strokeWidth="2"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="30;60;30"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Inner glow */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill={currentFlow.color}
                    opacity="0.1"
                  >
                    <animate
                      attributeName="r"
                      values="15;25;15"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
              
              {/* Central icon */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                fill={isActive ? currentFlow.color : '#9CA3AF'}
                className="transition-all duration-1000"
              />
              
              {/* Completion checkmark */}
              {isCompleted && (
                <g>
                  <path
                    d={`M ${pos.x - 6} ${pos.y} L ${pos.x - 2} ${pos.y + 4} L ${pos.x + 6} ${pos.y - 4}`}
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Flow Legend - Interactive */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 pointer-events-auto z-20">
        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="text-lg mr-2">⚡</span>
          Flux Disponibles
        </h5>
        <div className="space-y-2">
          {flows.map((flow, index) => (
            <div
              key={flow.id}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all ${
                index === activeFlow 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
              onClick={() => onFlowChange(index)}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: flow.color }}
              ></div>
              <span className={`text-sm ${index === activeFlow ? 'font-semibold text-blue-800' : 'text-gray-700'}`}>
                {flow.name}
              </span>
              {index === activeFlow && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full animate-pulse">
                  ACTIF
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}