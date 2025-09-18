'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { useResponsive } from '@/hooks/useResponsive'
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer'
import { Card } from '@/components/ui/Card'
import { RefreshCw, Info, AlertTriangle, CheckCircle } from 'lucide-react'

interface PageLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  loading?: boolean
  error?: string | null
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  showStatus?: {
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    dismissible?: boolean
  }
}

const spacingClasses = {
  none: '',
  sm: 'space-y-3',
  md: 'space-y-4 lg:space-y-6',
  lg: 'space-y-6 lg:space-y-8',
  xl: 'space-y-8 lg:space-y-10'
}

const statusIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle
}

const statusColors = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800'
}

export function PageLayout({
  children,
  title,
  subtitle,
  description,
  actions,
  breadcrumbs,
  loading = false,
  error = null,
  className,
  containerSize = '7xl',
  padding = 'lg',
  spacing = 'md',
  showStatus
}: PageLayoutProps) {
  const { isMobile, isTablet } = useResponsive()

  const StatusIcon = showStatus ? statusIcons[showStatus.type] : null

  return (
    <div className={clsx(
      'min-h-screen bg-gray-50',
      className
    )}>
      <ResponsiveContainer maxWidth={containerSize} padding={padding}>
        <div className={clsx(
          spacingClasses[spacing],
          'py-6 lg:py-8'
        )}>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="mx-2 text-gray-400">/</span>
                    )}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Header */}
          <div className={clsx(
            'flex flex-col space-y-4',
            !isMobile && actions && 'sm:flex-row sm:items-start sm:justify-between sm:space-y-0'
          )}>
            <div className="min-w-0 flex-1">
              <h1 className={clsx(
                'font-bold text-gray-900 tracking-tight',
                isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'
              )}>
                {title}
              </h1>
              
              {subtitle && (
                <p className={clsx(
                  'text-gray-600 mt-2',
                  isMobile ? 'text-sm' : 'text-lg'
                )}>
                  {subtitle}
                </p>
              )}
              
              {description && (
                <p className="text-gray-500 text-sm mt-3 max-w-3xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {actions && (
              <div className={clsx(
                'flex-shrink-0',
                isMobile ? 'w-full' : 'ml-6'
              )}>
                <div className={clsx(
                  'flex items-center',
                  isMobile ? 'justify-center space-x-2' : 'justify-end space-x-3'
                )}>
                  {actions}
                </div>
              </div>
            )}
          </div>

          {/* Status Message */}
          {showStatus && (
            <div className={clsx(
              'flex items-start space-x-3 p-4 rounded-lg border',
              statusColors[showStatus.type]
            )}>
              {StatusIcon && (
                <StatusIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {showStatus.message}
                </p>
              </div>
              {showStatus.dismissible && (
                <button className="flex-shrink-0 ml-2 text-current opacity-70 hover:opacity-100">
                  ×
                </button>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card variant="outlined" padding="lg">
              <div className="flex items-center space-x-3 text-red-600">
                <AlertTriangle className="h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Erreur</h3>
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} loading />
              ))}
            </div>
          ) : (
            /* Main Content */
            <div className={spacingClasses[spacing]}>
              {children}
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </div>
  )
}

// Section Layout Component
interface SectionLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  actions?: ReactNode
  className?: string
  variant?: 'default' | 'card' | 'ghost'
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function SectionLayout({
  children,
  title,
  subtitle,
  actions,
  className,
  variant = 'default',
  collapsible = false,
  defaultCollapsed = false
}: SectionLayoutProps) {
  const { isMobile } = useResponsive()
  
  const content = (
    <>
      {(title || subtitle || actions) && (
        <div className={clsx(
          'flex flex-col space-y-2',
          !isMobile && actions && 'sm:flex-row sm:items-center sm:justify-between sm:space-y-0'
        )}>
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className={clsx(
                'font-semibold text-gray-900',
                isMobile ? 'text-lg' : 'text-xl'
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 text-sm mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className={clsx(
              'flex-shrink-0',
              isMobile ? 'w-full mt-3' : 'ml-4'
            )}>
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={clsx(
        (title || subtitle || actions) && 'mt-4'
      )}>
        {children}
      </div>
    </>
  )

  if (variant === 'card') {
    return (
      <Card className={className} padding="lg">
        {content}
      </Card>
    )
  }

  if (variant === 'ghost') {
    return (
      <div className={className}>
        {content}
      </div>
    )
  }

  return (
    <div className={clsx(
      'bg-white rounded-lg border border-gray-200 p-6',
      className
    )}>
      {content}
    </div>
  )
}

// Quick Action Button Component
interface QuickActionProps {
  icon?: ReactNode
  label: string
  onClick?: () => void
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const actionVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent'
}

const actionSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export function QuickAction({
  icon,
  label,
  onClick,
  loading = false,
  variant = 'secondary',
  size = 'md'
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={clsx(
        'inline-flex items-center border rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        actionVariants[variant],
        actionSizes[size]
      )}
    >
      {loading ? (
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {label}
    </button>
  )
}