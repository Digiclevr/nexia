'use client'

import { ReactNode, useState } from 'react'
import { clsx } from 'clsx'
import { useResponsive } from '@/hooks/useResponsive'
import { Card } from './Card'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical
} from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  header: string
  accessor?: (item: T) => ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string
  mobileHidden?: boolean
  tabletHidden?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  pagination?: {
    enabled?: boolean
    pageSize?: number
    showInfo?: boolean
  }
  search?: {
    enabled?: boolean
    placeholder?: string
    searchKeys?: (keyof T)[]
  }
  filters?: {
    enabled?: boolean
    customFilters?: ReactNode
  }
  responsive?: {
    mobileView?: 'cards' | 'horizontal-scroll'
    stackedHeaders?: boolean
  }
  className?: string
  emptyState?: ReactNode
  onRowClick?: (item: T, index: number) => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination = { enabled: true, pageSize: 10, showInfo: true },
  search = { enabled: true, placeholder: 'Rechercher...' },
  filters = { enabled: false },
  responsive = { mobileView: 'cards', stackedHeaders: true },
  className,
  emptyState,
  onRowClick
}: DataTableProps<T>) {
  const { isMobile, isTablet } = useResponsive()
  
  // State management
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  // Data processing
  const filteredData = searchTerm ? data.filter(item => {
    const searchKeys = search.searchKeys || Object.keys(item)
    return searchKeys.some(key => 
      String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }) : data

  const sortedData = sortConfig ? [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  }) : filteredData

  // Pagination
  const pageSize = pagination.pageSize || 10
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = pagination.enabled ? 
    sortedData.slice(startIndex, endIndex) : sortedData

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Mobile card view
  const renderMobileCards = () => (
    <div className="space-y-3">
      {paginatedData.map((item, index) => (
        <Card
          key={index}
          padding="md"
          clickable={!!onRowClick}
          hover={!!onRowClick}
          className="w-full"
          onClick={() => onRowClick?.(item, index)}
        >
          <div className="space-y-3">
            {columns.filter(col => !col.mobileHidden).map(column => (
              <div key={String(column.key)} className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500 min-w-0 flex-shrink-0 mr-3">
                  {column.header}
                </span>
                <span className="text-sm text-gray-900 text-right min-w-0 flex-1">
                  {column.accessor ? 
                    column.accessor(item) : 
                    String(item[column.key as keyof T] || '-')
                  }
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )

  // Desktop table view
  const renderDesktopTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => {
              const isHidden = (isMobile && column.mobileHidden) || 
                             (isTablet && column.tabletHidden)
              
              if (isHidden) return null

              return (
                <th
                  key={String(column.key)}
                  className={clsx(
                    'px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 select-none',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? 
                            <SortAsc className="h-3 w-3" /> : 
                            <SortDesc className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 opacity-30">
                            <SortAsc className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((item, index) => (
            <tr
              key={index}
              className={clsx(
                'hover:bg-gray-50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map(column => {
                const isHidden = (isMobile && column.mobileHidden) || 
                               (isTablet && column.tabletHidden)
                
                if (isHidden) return null

                return (
                  <td
                    key={String(column.key)}
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.accessor ? 
                      column.accessor(item) : 
                      String(item[column.key as keyof T] || '-')
                    }
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      {emptyState || (
        <div>
          <p className="text-gray-500 text-lg">Aucune donnée disponible</p>
          {searchTerm && (
            <p className="text-gray-400 text-sm mt-2">
              Essayez de modifier votre recherche
            </p>
          )}
        </div>
      )}
    </div>
  )

  // Pagination component
  const renderPagination = () => {
    if (!pagination.enabled || totalPages <= 1) return null

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-200">
        {pagination.showInfo && (
          <div className="text-sm text-gray-700">
            Affichage {startIndex + 1} à {Math.min(endIndex, sortedData.length)} sur {sortedData.length} résultats
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} sur {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className={className}>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className={className} padding="none">
      {/* Header with search and filters */}
      {(search.enabled || filters.enabled) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            {search.enabled && (
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={search.placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {filters.enabled && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                {filters.customFilters}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table content */}
      <div className="p-4">
        {paginatedData.length === 0 ? renderEmptyState() : (
          <>
            {isMobile && responsive.mobileView === 'cards' ? 
              renderMobileCards() : renderDesktopTable()
            }
            {renderPagination()}
          </>
        )}
      </div>
    </Card>
  )
}