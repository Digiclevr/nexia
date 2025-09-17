'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { useResponsive } from '@/hooks/useResponsive'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
  fluid?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  none: 'max-w-none'
}

const paddingClasses = {
  none: '',
  sm: 'px-2 sm:px-4',
  md: 'px-4 sm:px-6', 
  lg: 'px-4 sm:px-6 lg:px-8',
  xl: 'px-6 sm:px-8 lg:px-12'
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = '7xl',
  padding = 'lg',
  center = true,
  fluid = false
}: ResponsiveContainerProps) {
  const { isMobile, isTablet } = useResponsive()

  return (
    <div className={clsx(
      'w-full',
      !fluid && maxWidthClasses[maxWidth],
      center && 'mx-auto',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}

// Composant pour grilles adaptatives
interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
  }
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2 sm:gap-3',
  md: 'gap-3 sm:gap-4 lg:gap-6',
  lg: 'gap-4 sm:gap-6 lg:gap-8',
  xl: 'gap-6 sm:gap-8 lg:gap-10'
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gridCols = clsx(
    'grid',
    cols.mobile && `grid-cols-${cols.mobile}`,
    cols.tablet && `md:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`,
    cols.wide && `xl:grid-cols-${cols.wide}`,
    gapClasses[gap]
  )

  return (
    <div className={clsx(gridCols, className)}>
      {children}
    </div>
  )
}

// Composant pour stacks responsives
interface ResponsiveStackProps {
  children: ReactNode
  className?: string
  direction?: {
    mobile?: 'vertical' | 'horizontal'
    tablet?: 'vertical' | 'horizontal'
    desktop?: 'vertical' | 'horizontal'
  }
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

const spacingClasses = {
  none: '',
  sm: 'space-y-2 md:space-y-0 md:space-x-2',
  md: 'space-y-3 md:space-y-0 md:space-x-4',
  lg: 'space-y-4 md:space-y-0 md:space-x-6',
  xl: 'space-y-6 md:space-y-0 md:space-x-8'
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch'
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly'
}

export function ResponsiveStack({
  children,
  className,
  direction = { mobile: 'vertical', tablet: 'horizontal', desktop: 'horizontal' },
  spacing = 'md',
  align = 'start',
  justify = 'start'
}: ResponsiveStackProps) {
  const { isMobile, isTablet } = useResponsive()
  
  const isVertical = (isMobile && direction.mobile === 'vertical') ||
                    (isTablet && direction.tablet === 'vertical') ||
                    (!isMobile && !isTablet && direction.desktop === 'vertical')

  return (
    <div className={clsx(
      'flex',
      isVertical ? 'flex-col' : 'flex-row',
      spacingClasses[spacing],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  )
}