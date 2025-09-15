import { useState } from 'react'

export default function App() {
  console.log('🚀 Simple App loading...')
  
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'user',
      content: 'j\'ai 3 projets en cours',
      response: '🎯 Mode Project Assistant - Je vois que tu parles de projets/tâches.\n\n**Actions suggérées :**\n• Consulte tes projets en cours dans l\'onglet Dashboard\n• Vérifie les deadlines approchantes\n• Priorise tes tâches par impact/urgence\n\n*Configure une clé API pour des réponses IA complètes.*'
    }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const newMessage = { sender: 'user', content: input, response: '' }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/v1/conversation/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          session_id: 'test-session',
          context: { mode: 'project_assistant' }
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(prev => prev.map((msg, i) => 
          i === prev.length - 1 ? { ...msg, response: data.response } : msg
        ))
      } else {
        setMessages(prev => prev.map((msg, i) => 
          i === prev.length - 1 ? { ...msg, response: 'Erreur API - Fallback response sera utilisée' } : msg
        ))
      }
    } catch (error) {
      setMessages(prev => prev.map((msg, i) => 
        i === prev.length - 1 ? { ...msg, response: 'Erreur connexion - Vérifiez que le backend tourne sur port 8000' } : msg
      ))
    }
    
    setLoading(false)
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <span className="text-6xl">🤖</span> 
          NEXIA
        </h1>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
          <h2 className="text-2xl mb-4 text-blue-400">🎯 Project Assistant Mode</h2>
          <p className="text-gray-300 mb-4">Interface simplifiée - fonctionnelle</p>
          
          <div className="space-y-3">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="font-semibold text-green-400">✅ Backend API: Port 8000</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="font-semibold text-green-400">✅ Frontend: Port 6003</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="font-semibold text-blue-400">🔄 Modes disponibles:</p>
              <ul className="mt-2 text-sm text-gray-300">
                <li>• 🎯 Project Assistant (actuel)</li>
                <li>• 🧠 Focus Guardian</li>
                <li>• 💎 Opportunity Hunter</li>
                <li>• 🤔 Socratic Challenger</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl mb-4 text-green-400">💬 Chat NEXIA Interactif</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-2">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-blue-300 font-semibold">👤 Utilisateur:</p>
                  <p className="text-gray-300 mt-1">{msg.content}</p>
                </div>
                
                {msg.response && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-green-300 font-semibold">🤖 NEXIA:</p>
                    <div className="text-gray-300 mt-1 whitespace-pre-line">
                      {msg.response}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-green-300 font-semibold">🤖 NEXIA:</p>
                <div className="text-gray-300 mt-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                  <span className="ml-2">NEXIA réfléchit...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écris ton message à NEXIA..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Envoyer
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
            <p className="text-blue-400 text-sm">
              💡 <strong>Commandes spéciales :</strong> "git status", "ls", "pwd", "claude code", "test"
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl mb-4 text-purple-400">🛠️ MCP Tools Disponibles</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">🖥️ Shell</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• ls, pwd, cd</li>
                <li>• git, npm, docker</li>
                <li>• claude code</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">📦 Git</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• git status, log</li>
                <li>• commit, push, pull</li>
                <li>• branch management</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-yellow-400 mb-2">🤖 Claude Bridge</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Ton abonnement Max</li>
                <li>• Browser automation</li>
                <li>• Zéro tokens API</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-900/20 border border-green-600 rounded-lg">
            <p className="text-green-400 text-sm">
              🎯 <strong>NEXIA = Claude Desktop Killer</strong> avec MCP + Claude Max gratuit !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}