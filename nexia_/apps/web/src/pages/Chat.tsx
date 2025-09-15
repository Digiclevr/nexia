import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexiaStore } from '../store/nexiaStore'
import { api } from '../lib/api'
import { useQuery, useMutation } from '@tanstack/react-query'

interface Message {
  id: string
  content: string
  sender: 'user' | 'nexia'
  timestamp: Date
  actions?: Record<string, any>
}

export default function Chat() {
  const { sessionId, setSessionId, currentMode, addIdea } = useNexiaStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize session
  useEffect(() => {
    if (!sessionId) {
      api.post('/v1/conversation/start-session')
        .then(res => setSessionId(res.data.session_id))
        .catch(console.error)
    }
  }, [sessionId, setSessionId])
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post('/v1/conversation/chat', {
        message,
        session_id: sessionId,
        context: { mode: currentMode }
      })
      return response.data
    },
    onSuccess: (data) => {
      const nexiaMessage: Message = {
        id: `msg_${Date.now()}`,
        content: data.response,
        sender: 'nexia',
        timestamp: new Date(),
        actions: data.actions
      }
      setMessages(prev => [...prev, nexiaMessage])
      setIsTyping(false)

      // Handle actions
      if (data.actions?.park_idea) {
        addIdea({
          content: input,
          status: 'parked',
          tags: ['auto-parked']
        })
      }
    }
  })

  const handleSend = () => {
    if (!input.trim() || !sessionId) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    sendMessageMutation.mutate(input)
  }
  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white">
          Chat avec Nexia - Mode {currentMode.replace('_', ' ')}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-nexia-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.actions?.park_idea && (
                  <div className="mt-2 text-sm text-gray-300">
                    💡 Idée automatiquement parkée
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nexia-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendMessageMutation.isPending}
            className="px-6 py-2 bg-nexia-600 text-white rounded-lg hover:bg-nexia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}