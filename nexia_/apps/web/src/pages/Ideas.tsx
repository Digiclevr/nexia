import { motion } from 'framer-motion'
import { useNexiaStore } from '../store/nexiaStore'

export default function Ideas() {
  const { ideas, updateIdea, deleteIdea } = useNexiaStore()

  const statusColors = {
    parked: 'bg-yellow-900/20 text-yellow-400',
    active: 'bg-green-900/20 text-green-400',
    completed: 'bg-gray-700 text-gray-400'
  }

  return (
    <div className="h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestion des Idées
          </h1>
          <p className="text-gray-400">
            {ideas.length} idée{ideas.length > 1 ? 's' : ''} en cours
          </p>
        </motion.div>

        {ideas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-6xl">💡</span>
            <p className="mt-4 text-gray-400">
              Aucune idée pour le moment. Commencez à discuter avec Nexia !
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[idea.status]}`}>
                    {idea.status}
                  </span>
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-white mb-4">{idea.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-700 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  {idea.status === 'parked' && (
                    <button
                      onClick={() => updateIdea(idea.id, { status: 'active' })}
                      className="flex-1 text-sm py-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                    >
                      Activer
                    </button>
                  )}
                  {idea.status === 'active' && (
                    <button
                      onClick={() => updateIdea(idea.id, { status: 'completed' })}
                      className="flex-1 text-sm py-1 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                    >
                      Terminer
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}