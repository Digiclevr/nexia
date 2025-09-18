'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Brain,
  BarChart3, 
  Mic,
  Database,
  Settings,
  Activity,
  Globe,
  Shield,
  Zap,
  Users,
  Target,
  Bell,
  Server,
  Eye,
  RefreshCw,
  Menu,
  X,
  Crown,
  ExternalLink,
  Grid3X3,
  Key,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { clsx } from 'clsx'

const navigationItems = [
  {
    title: 'Vue d\'ensemble',
    items: [
      { name: 'OGER Intelligence', href: '/oger', icon: Brain },
      { name: 'Matrice App×Env', href: '/matrix', icon: Grid3X3 },
      { name: 'Dashboard Central', href: '/', icon: BarChart3 },
      { name: 'Status Écosystème', href: '/status', icon: Activity },
    ]
  },
  {
    title: 'Empire BlueOcean',
    items: [
      { name: 'Empire Dashboard', href: '/empire', icon: Crown },
      { name: 'Architecture Empire', href: '/empire/architecture', icon: Globe },
      { name: 'Métriques Empire', href: '/empire/metrics', icon: BarChart3 },
      { name: 'Status BlueOcean', href: '/ecosystems/blueocean', icon: Activity },
    ]
  },
  {
    title: 'Contrôle Vocal',
    items: [
      { name: 'Interface Vocale', href: '/voice', icon: Mic },
      { name: 'Commandes Siri', href: '/voice/siri', icon: Zap },
      { name: 'Historique Vocal', href: '/voice/history', icon: RefreshCw },
    ]
  },
  {
    title: 'Supervision Écosystèmes',
    items: [
      { name: 'OnlyOneAPI Health', href: '/ecosystems/onlyoneapi', icon: Database },
      { name: 'OnlyOneAPI 360', href: '/ecosystems/onlyoneapi360', icon: Globe },
      { name: 'ENDPOINTS Mining', href: '/ecosystems/endpoints', icon: Target },
      { name: 'Business-Automation', href: '/ecosystems/business-automation', icon: Users },
      { name: 'Claude Code Agent', href: '/ecosystems/claude-code', icon: Brain },
    ]
  },
  {
    title: 'Alertes & Monitoring',
    items: [
      { name: 'Alertes Actives', href: '/alerts', icon: Bell },
      { name: 'Escalation Manager', href: '/alerts/escalation', icon: Target },
      { name: 'Health Checks', href: '/monitoring/health', icon: Shield },
      { name: 'Métriques Système', href: '/monitoring/metrics', icon: Activity },
    ]
  },
  {
    title: 'Déploiements',
    items: [
      { name: 'Control Center', href: '/deployment', icon: Server },
      { name: 'Kubernetes Status', href: '/deployment/k8s', icon: Eye },
      { name: 'Pipeline CI/CD', href: '/deployment/pipeline', icon: RefreshCw },
    ]
  },
  {
    title: 'Content Management',
    items: [
      { name: 'Directus CMS', href: 'http://localhost:7012/admin', icon: Database, external: true },
      { name: 'OGER Collections', href: 'http://localhost:7012/admin/content/claude_artifacts', icon: Target, external: true },
    ]
  },
  {
    title: 'Administration',
    items: [
      { name: 'Credentials & Access', href: '/admin/credentials', icon: Key },
      { name: 'Agent Settings', href: '/admin/settings', icon: Settings },
      { name: 'API Keys', href: '/admin/api-keys', icon: Shield },
      { name: 'Logs System', href: '/admin/logs', icon: Activity },
      { name: 'Supervision 24/7', href: '/admin/supervision', icon: Eye },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set([
    'Contrôle Vocal',
    'Alertes & Monitoring', 
    'Déploiements',
    'Content Management',
    'Administration'
  ])) // Start with secondary sections collapsed

  const toggleSection = (sectionTitle: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(sectionTitle)) {
      newCollapsed.delete(sectionTitle)
    } else {
      newCollapsed.add(sectionTitle)
    }
    setCollapsedSections(newCollapsed)
  }

  // Check if current path is in a section to auto-expand it
  const isCurrentPathInSection = (section: any) => {
    return section.items.some((item: any) => pathname === item.href)
  }

  const SidebarContent = () => (
    <>
      {/* Header Compact */}
      <div className="p-3 lg:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <Brain className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="ml-2 min-w-0">
              <h1 className="text-sm lg:text-xl font-bold text-white truncate">NEXIA</h1>
              <p className="text-xs text-blue-100 hidden lg:block">Meta-Orchestrateur IA</p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-white hover:bg-white/20 rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fermer menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mt-2 lg:mt-4 flex items-center text-xs text-blue-100">
          <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
          <span className="hidden sm:inline">Système opérationnel</span>
          <span className="sm:hidden">Actif</span>
        </div>
      </div>

      {/* Navigation Ultra-Dense with Collapsible Sections */}
      <nav className="flex-1 overflow-y-auto py-2 bg-gray-50">
        {navigationItems.map((section) => {
          const isCollapsed = collapsedSections.has(section.title)
          const hasCurrentPath = isCurrentPathInSection(section)
          const shouldExpand = hasCurrentPath && isCollapsed
          
          // Auto-expand if current path is in this section
          if (shouldExpand) {
            const newCollapsed = new Set(collapsedSections)
            newCollapsed.delete(section.title)
            setCollapsedSections(newCollapsed)
          }
          
          return (
            <div key={section.title} className="mb-1">
              {/* Collapsible Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 lg:px-2 xl:px-3 py-1.5 lg:py-1 text-xs lg:text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="uppercase tracking-wider truncate">{section.title}</span>
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {/* Collapsible Content */}
              {!isCollapsed && (
                <ul className="space-y-0.5 lg:space-y-0 px-3 lg:px-2 xl:px-3 mt-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const isExternal = item.external || false
                
                if (isExternal) {
                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={clsx(
                          'group flex items-center px-2 py-2 lg:px-2 lg:py-1 text-xs lg:text-xs xl:text-sm font-medium rounded-md transition-all duration-200 min-h-[36px] lg:min-h-0',
                          'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            'mr-2 lg:mr-1.5 h-4 w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 flex-shrink-0',
                            'text-orange-500 group-hover:text-orange-600'
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                        <ExternalLink className="ml-auto h-3 w-3 text-orange-400" />
                      </a>
                    </li>
                  )
                }
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        'group flex items-center px-2 py-2 lg:px-2 lg:py-1 text-xs lg:text-xs xl:text-sm font-medium rounded-md transition-all duration-200 min-h-[36px] lg:min-h-0',
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      )}
                    >
                      <item.icon
                        className={clsx(
                          'mr-2 lg:mr-1.5 h-4 w-4 lg:h-3 lg:w-3 xl:h-4 xl:w-4 flex-shrink-0',
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                )
                })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer Compact */}
      <div className="p-2 lg:p-3 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium text-xs">Opérationnel</span>
          </div>
          <div className="text-gray-700 font-medium text-xs mb-2">NEXIA v1.0.0</div>
          <div className="flex items-center justify-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>DEV LOCAL</span>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Ouvrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-56 xl:w-64 bg-white border-r border-gray-200 flex-col shadow-lg">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 bottom-0 w-80 sm:w-72 md:w-80 bg-white shadow-xl transform transition-transform z-50 overflow-hidden">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}