import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNexiaStore } from '../store/nexiaStore'

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Chat', href: '/chat', icon: '💬' },
  { name: 'Idées', href: '/ideas', icon: '💡' },
  { name: 'Paramètres', href: '/settings', icon: '⚙️' },
]

const modes = [
  { id: 'project_assistant', name: 'Project Assistant', icon: '🎯', color: 'bg-nexia-600' },
  { id: 'focus_guardian', name: 'Focus Guardian', icon: '🧠', color: 'bg-purple-600' },
  { id: 'opportunity_hunter', name: 'Opportunity Hunter', icon: '💎', color: 'bg-blue-600' },
  { id: 'socratic_challenger', name: 'Socratic Challenger', icon: '🤔', color: 'bg-green-600' },
]

export default function Layout() {
  const location = useLocation()
  const { currentMode, setMode } = useNexiaStore()

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
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
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            {modes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.icon} {mode.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg mb-1
                  transition-colors duration-200
                  ${isActive 
                    ? 'bg-nexia-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
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
