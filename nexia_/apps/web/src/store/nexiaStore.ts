import { create } from 'zustand'

interface Idea {
  id: string
  content: string
  createdAt: Date
  status: 'parked' | 'active' | 'completed'
  tags: string[]
}

interface NexiaState {
  // Session
  sessionId: string | null
  setSessionId: (id: string | null) => void
  
  // Mode
  currentMode: string
  setMode: (mode: string) => void
  
  // Ideas
  ideas: Idea[]
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => void
  updateIdea: (id: string, updates: Partial<Idea>) => void
  deleteIdea: (id: string) => void
  
  // Productivity metrics
  focusTime: number
  incrementFocusTime: () => void
  interruptionsBlocked: number
  incrementInterruptions: () => void
}

export const useNexiaStore = create<NexiaState>(
  (set) => ({
      // Session
      sessionId: null,
      setSessionId: (id) => set({ sessionId: id }),
      
      // Mode
      currentMode: 'focus_guardian',
      setMode: (mode) => set({ currentMode: mode }),
      
      // Ideas
      ideas: [],
      addIdea: (idea) => set((state) => ({
        ideas: [...state.ideas, {
          ...idea,
          id: `idea_${Date.now()}`,
          createdAt: new Date()
        }]
      })),
      updateIdea: (id, updates) => set((state) => ({
        ideas: state.ideas.map(idea => 
          idea.id === id ? { ...idea, ...updates } : idea
        )
      })),
      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter(idea => idea.id !== id)
      })),
      
      // Productivity
      focusTime: 0,
      incrementFocusTime: () => set((state) => ({ 
        focusTime: state.focusTime + 1 
      })),
      interruptionsBlocked: 0,
      incrementInterruptions: () => set((state) => ({ 
        interruptionsBlocked: state.interruptionsBlocked + 1 
      })),
    })
)
