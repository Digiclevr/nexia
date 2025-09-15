import { motion } from 'framer-motion'
import { useNexiaStore } from '../store/nexiaStore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { 
    currentMode, 
    ideas, 
    focusTime, 
    interruptionsBlocked 
  } = useNexiaStore()

  const modeInfo = {
    focus_guardian: {
      title: 'Focus Guardian',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      icon: '🧠'
    },
    opportunity_hunter: {
      title: 'Opportunity Hunter', 
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      icon: '💎'
    },
    socratic_challenger: {
      title: 'Socratic Challenger',
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      icon: '🤔'
    }
  }

  const current = modeInfo[currentMode as keyof typeof modeInfo]

  // Mock data for chart
  const productivityData = [
    { time: '8h', focus: 20 },
    { time: '9h', focus: 45 },
    { time: '10h', focus: 38 },
    { time: '11h', focus: 52 },
    { time: '12h', focus: 30 },
    { time: '13h', focus: 48 },
    { time: '14h', focus: 55 },
  ]

  return (
    <div className="h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Tableau de bord Nexia
          </h1>
          <p className="text-gray-400">
            Bienvenue ! Mode actuel : {current.title} {current.icon}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`${current.bgColor} p-6 rounded-xl border border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Temps de focus</p>
                <p className={`text-3xl font-bold ${current.color}`}>
                  {Math.floor(focusTime / 60)}h {focusTime % 60}m
                </p>
              </div>
              <span className="text-4xl">⏱️</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Idées parkées</p>
                <p className="text-3xl font-bold text-white">
                  {ideas.filter(i => i.status === 'parked').length}
                </p>
              </div>
              <span className="text-4xl">💡</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Interruptions bloquées</p>
                <p className="text-3xl font-bold text-orange-400">
                  {interruptionsBlocked}
                </p>
              </div>
              <span className="text-4xl">🛡️</span>
            </div>
          </motion.div>
        </div>

        {/* Productivity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Productivité aujourd'hui
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="focus" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Ideas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Dernières idées parkées
          </h2>
          {ideas.length === 0 ? (
            <p className="text-gray-400">Aucune idée parkée pour le moment</p>
          ) : (
            <div className="space-y-3">
              {ideas.slice(-3).reverse().map((idea) => (
                <div key={idea.id} className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-white">{idea.content}</p>
                  <div className="flex gap-2 mt-2">
                    {idea.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
