'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { useResponsive } from '@/hooks/useResponsive'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  showValue?: boolean
  label?: string
  className?: string
  animated?: boolean
  striped?: boolean
  rounded?: boolean
  children?: ReactNode
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2', 
  lg: 'h-3',
  xl: 'h-4'
}

const variantClasses = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500', 
  danger: 'bg-red-500',
  info: 'bg-cyan-500'
}

const backgroundClasses = {
  default: 'bg-blue-100',
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  danger: 'bg-red-100', 
  info: 'bg-cyan-100'
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  label,
  className,
  animated = false,
  striped = false,
  rounded = true,
  children
}: ProgressProps) {
  const { isMobile } = useResponsive()
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const finalSize = isMobile && size === 'xl' ? 'lg' : size

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={clsx(
              'text-gray-700 font-medium',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={clsx(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div
        className={clsx(
          'relative w-full overflow-hidden',
          backgroundClasses[variant],
          rounded && 'rounded-full',
          sizeClasses[finalSize]
        )}
      >
        <div
          className={clsx(
            'h-full transition-all duration-300 ease-out',
            variantClasses[variant],
            rounded && 'rounded-full',
            animated && 'animate-pulse',
            striped && 'bg-stripes'
          )}
          style={{ width: `${percentage}%` }}
        />
        
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx(
              'text-white font-medium drop-shadow-sm',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {children}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Circular Progress Component
interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  showValue?: boolean
  className?: string
  children?: ReactNode
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'default',
  showValue = false,
  className,
  children
}: CircularProgressProps) {
  const { isMobile } = useResponsive()
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const finalSize = isMobile ? Math.min(size, 60) : size
  const finalStrokeWidth = isMobile ? Math.min(strokeWidth, 6) : strokeWidth
  
  const radius = (finalSize - finalStrokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    default: 'text-blue-500',
    success: 'text-green-500', 
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    info: 'text-cyan-500'
  }

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center',
        className
      )}
      style={{ width: finalSize, height: finalSize }}
    >
      <svg
        width={finalSize}
        height={finalSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={finalStrokeWidth}
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={finalStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={clsx(
            'transition-all duration-300 ease-out',
            colorClasses[variant]
          )}
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <span className={clsx(
            'font-semibold text-gray-700',
            isMobile ? 'text-xs' : 'text-sm'
          )}>
            {Math.round(percentage)}%
          </span>
        ))}
      </div>
    </div>
  )
}