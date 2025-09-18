import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNexiaStore } from '../store/nexiaStore'
import { useState } from 'react'

const navigationSections = [
  {
    id: 'overview',
    name: 'Vue d\'ensemble',
    icon: '📊',
    items: [
      { name: 'Dashboard', href: '/', icon: '📈' },
      { name: 'Status Global', href: '/status', icon: '🎯' },
    ]
  },
  {
    id: 'intelligence',
    name: 'Intelligence IA',
    icon: '🧠',
    items: [
      { name: 'Chat Nexia', href: '/chat', icon: '💬' },
      { name: 'Idées Parkées', href: '/ideas', icon: '💡' },
      { name: 'Agents IA', href: '/agents', icon: '🤖' },
    ]
  },
  {
    id: 'supervision',
    name: 'Supervision',
    icon: '🔍',
    items: [
      { name: 'Écosystème', href: '/ecosystem', icon: '🌐' },
      { name: 'Monitoring', href: '/monitoring', icon: '📡' },
      { name: 'Déploiements', href: '/deployments', icon: '🚀' },
    ]
  },
  {
    id: 'administration',
    name: 'Administration',
    icon: '⚙️',
    items: [
      { name: 'Paramètres', href: '/settings', icon: '🔧' },
      { name: 'Utilisateurs', href: '/users', icon: '👥' },
      { name: 'Logs', href: '/logs', icon: '📜' },
    ]
  }
]

const modes = [
  { id: 'focus_guardian', name: 'Focus Guardian', icon: '🧠', color: 'bg-purple-600' },
  { id: 'opportunity_hunter', name: 'Opportunity Hunter', icon: '💎', color: 'bg-blue-600' },
  { id: 'socratic_challenger', name: 'Socratic Challenger', icon: '🤔', color: 'bg-green-600' },
]

export default function Layout() {
  const location = useLocation()
  const { currentMode, setMode } = useNexiaStore()
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'intelligence'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🤖</span> Nexia
          </h1>
        </div>
        
        {/* Mode Selector */}
        <div className="px-4 py-2">
          <label className="text-sm text-gray-400">Mode actuel</label>
          <select
            value={currentMode}
            onChange={(e) => setMode(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white text-sm"
          >
            {modes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.icon} {mode.name}
              </option>
            ))}
          </select>
        </div>

        {/* Accordion Navigation */}
        <nav className="mt-6 px-2">
          {navigationSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id)
            return (
              <div key={section.id} className="mb-2">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium text-sm">{section.name}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                  >
                    ▶
                  </motion.span>
                </button>

                {/* Section Items */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 mt-1 space-y-1">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                            transition-colors duration-200
                            ${isActive 
                              ? 'bg-purple-600 text-white shadow-lg' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }
                          `}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
