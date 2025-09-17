'use client'

import { ReactNode, forwardRef } from 'react'
import { clsx } from 'clsx'
import { useResponsive } from '@/hooks/useResponsive'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  loading?: boolean
  responsive?: {
    mobile?: {
      padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
      shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    }
    tablet?: {
      padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
      shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    }
  }
}

const variantClasses = {
  default: 'bg-white border border-gray-200',
  elevated: 'bg-white',
  outlined: 'bg-transparent border-2 border-gray-300',
  ghost: 'bg-transparent'
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-10'
}

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
}

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  hover = false,
  clickable = false,
  loading = false,
  responsive,
  ...props
}, ref) => {
  const { isMobile, isTablet } = useResponsive()

  // Responsive overrides
  const mobilePadding = responsive?.mobile?.padding
  const tabletPadding = responsive?.tablet?.padding
  const mobileShadow = responsive?.mobile?.shadow
  const tabletShadow = responsive?.tablet?.shadow

  const finalPadding = isMobile && mobilePadding ? mobilePadding :
                     isTablet && tabletPadding ? tabletPadding : padding

  const finalShadow = isMobile && mobileShadow ? mobileShadow :
                     isTablet && tabletShadow ? tabletShadow : shadow

  return (
    <div
      ref={ref}
      className={clsx(
        // Base styles
        'relative transition-all duration-200',
        variantClasses[variant],
        paddingClasses[finalPadding],
        roundedClasses[rounded],
        shadowClasses[finalShadow],
        
        // Interactive states
        hover && 'hover:shadow-lg hover:-translate-y-0.5',
        clickable && 'cursor-pointer select-none',
        clickable && 'active:scale-[0.98]',
        
        // Loading state
        loading && 'animate-pulse',
        
        className
      )}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg animate-pulse" />
      )}
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header Component
interface CardHeaderProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: ReactNode
  border?: boolean
}

export function CardHeader({
  children,
  className,
  title,
  subtitle,
  action,
  border = true
}: CardHeaderProps) {
  const { isMobile } = useResponsive()

  return (
    <div className={clsx(
      'flex flex-col sm:flex-row sm:items-center sm:justify-between',
      border && 'pb-4 mb-4 border-b border-gray-200',
      !border && 'mb-4',
      className
    )}>
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className={clsx(
            'font-semibold text-gray-900 truncate',
            isMobile ? 'text-lg' : 'text-xl'
          )}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        )}
        {children}
      </div>
      {action && (
        <div className={clsx(
          'flex-shrink-0',
          isMobile ? 'mt-3' : 'ml-4'
        )}>
          {action}
        </div>
      )}
    </div>
  )
}

// Card Content Component  
interface CardContentProps {
  children: ReactNode
  className?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg'
}

const contentSpacingClasses = {
  none: '',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6'
}

export function CardContent({
  children,
  className,
  spacing = 'md'
}: CardContentProps) {
  return (
    <div className={clsx(
      contentSpacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  )
}

// Card Footer Component
interface CardFooterProps {
  children: ReactNode
  className?: string
  border?: boolean
  justify?: 'start' | 'center' | 'end' | 'between'
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center', 
  end: 'justify-end',
  between: 'justify-between'
}

export function CardFooter({
  children,
  className,
  border = true,
  justify = 'end'
}: CardFooterProps) {
  return (
    <div className={clsx(
      'flex flex-col sm:flex-row sm:items-center',
      justifyClasses[justify],
      border && 'pt-4 mt-4 border-t border-gray-200',
      !border && 'mt-4',
      className
    )}>
      {children}
    </div>
  )
}