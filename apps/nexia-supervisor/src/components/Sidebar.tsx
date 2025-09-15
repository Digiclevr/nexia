'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  RefreshCw
} from 'lucide-react'
import { clsx } from 'clsx'

const navigationItems = [
  {
    title: 'Vue d\'ensemble',
    items: [
      { name: 'Dashboard Central', href: '/', icon: BarChart3 },
      { name: 'Status Écosystème', href: '/status', icon: Activity },
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
      { name: 'BlueOcean Status', href: '/ecosystems/blueocean', icon: Globe },
      { name: 'OnlyOneAPI Health', href: '/ecosystems/onlyoneapi', icon: Database },
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
      { name: 'Directus CMS', href: '/cms', icon: Database },
      { name: 'Configuration', href: '/config', icon: Settings },
      { name: 'Data Models', href: '/cms/models', icon: Target },
    ]
  },
  {
    title: 'Administration',
    items: [
      { name: 'Agent Settings', href: '/admin/settings', icon: Settings },
      { name: 'API Keys', href: '/admin/api-keys', icon: Shield },
      { name: 'Logs System', href: '/admin/logs', icon: Activity },
      { name: 'Supervision 24/7', href: '/admin/supervision', icon: Eye },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-nexia-dark border-r border-nexia-700 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-nexia-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-nexia-gradient rounded-xl flex items-center justify-center shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-white">NEXIA</h1>
            <p className="text-xs text-nexia-300">Meta-Orchestrateur IA</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-nexia-400">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Système opérationnel
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-nexia-300 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1 px-3">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-nexia-primary text-white shadow-lg'
                          : 'text-nexia-200 hover:bg-nexia-700 hover:text-white'
                      )}
                    >
                      <item.icon
                        className={clsx(
                          'mr-3 h-4 w-4 flex-shrink-0',
                          isActive ? 'text-white' : 'text-nexia-400 group-hover:text-nexia-200'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-nexia-700">
        <div className="text-xs text-nexia-400 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Système opérationnel</span>
          </div>
          <div className="text-nexia-500 font-medium">NEXIA v1.0.0</div>
          <div className="text-nexia-400 mt-1">Meta-Orchestrateur IA</div>
        </div>
      </div>
    </div>
  )
}