'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { voiceService, VoiceProfile, VoiceResponse, TranscriptionResult } from '@/services/voice.service'

export interface VoiceState {
  isRecording: boolean
  isPlaying: boolean
  isSynthesizing: boolean
  isTranscribing: boolean
  lastTranscription: string | null
  lastSynthesis: VoiceResponse | null
  error: string | null
  voiceProfiles: VoiceProfile[]
  selectedProfile: VoiceProfile | null
  isVoiceEnabled: boolean
  volume: number
}

export interface VoiceControls {
  // Recording controls
  startRecording: () => Promise<void>
  stopRecording: () => Promise<TranscriptionResult | null>
  toggleRecording: () => Promise<void>
  
  // Synthesis controls
  speak: (text: string, profileId?: string) => Promise<VoiceResponse>
  speakSystemMessage: (message: string, type?: 'status' | 'alert' | 'welcome' | 'error' | 'success') => Promise<VoiceResponse>
  stopSpeaking: () => void
  
  // Voice profile management
  setVoiceProfile: (profileId: string) => void
  getVoiceForContext: (context: string) => VoiceProfile
  
  // Settings
  toggleVoice: () => void
  setVolume: (volume: number) => void
  
  // Health check
  checkVoiceHealth: () => Promise<boolean>
}

export function useVoice(): VoiceState & VoiceControls {
  const [state, setState] = useState<VoiceState>({
    isRecording: false,
    isPlaying: false,
    isSynthesizing: false,
    isTranscribing: false,
    lastTranscription: null,
    lastSynthesis: null,
    error: null,
    voiceProfiles: [],
    selectedProfile: null,
    isVoiceEnabled: true,
    volume: 0.8
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize voice profiles on mount
  useEffect(() => {
    const profiles = voiceService.getVoiceProfiles()
    setState(prev => ({
      ...prev,
      voiceProfiles: profiles,
      selectedProfile: profiles[0] || null
    }))
  }, [])

  // Update error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  // Start recording audio
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.start(1000) // Collect data every second
      mediaRecorderRef.current = mediaRecorder
      
      setState(prev => ({ ...prev, isRecording: true }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording'
      setError(`Recording error: ${errorMessage}`)
      console.error('Recording start error:', error)
    }
  }, [setError])

  // Stop recording and transcribe
  const stopRecording = useCallback(async (): Promise<TranscriptionResult | null> => {
    if (!mediaRecorderRef.current || state.isRecording === false) {
      return null
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!
      
      mediaRecorder.onstop = async () => {
        try {
          setState(prev => ({ 
            ...prev, 
            isRecording: false, 
            isTranscribing: true 
          }))
          
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: 'audio/webm;codecs=opus' 
          })
          
          // Convert to File for the voice service
          const audioFile = new File([audioBlob], 'recording.webm', { 
            type: 'audio/webm;codecs=opus' 
          })
          
          const result = await voiceService.transcribeAudio(audioFile, {
            quality: 'premium',
            provider: 'whisper',
            language: 'en'
          })
          
          setState(prev => ({ 
            ...prev, 
            isTranscribing: false,
            lastTranscription: result.text 
          }))
          
          // Stop all tracks
          mediaRecorder.stream.getTracks().forEach(track => track.stop())
          
          resolve(result)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Transcription failed'
          setError(`Transcription error: ${errorMessage}`)
          setState(prev => ({ 
            ...prev, 
            isTranscribing: false, 
            isRecording: false 
          }))
          resolve(null)
        }
      }
      
      mediaRecorder.stop()
    })
  }, [state.isRecording, setError])

  // Toggle recording
  const toggleRecording = useCallback(async () => {
    if (state.isRecording) {
      await stopRecording()
    } else {
      await startRecording()
    }
  }, [state.isRecording, startRecording, stopRecording])

  // Synthesize and play speech
  const speak = useCallback(async (text: string, profileId?: string): Promise<VoiceResponse> => {
    if (!state.isVoiceEnabled) {
      throw new Error('Voice is disabled')
    }

    try {
      setError(null)
      setState(prev => ({ ...prev, isSynthesizing: true }))

      const response = await voiceService.synthesizeVoice(text, profileId)
      
      setState(prev => ({ 
        ...prev, 
        isSynthesizing: false,
        lastSynthesis: response 
      }))

      // Play the audio
      if (response.audioUrl) {
        await playAudio(response.audioUrl)
      } else if (response.audioData) {
        const blob = new Blob([response.audioData], { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        await playAudio(url)
        URL.revokeObjectURL(url)
      }

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Speech synthesis failed'
      setError(`Speech error: ${errorMessage}`)
      setState(prev => ({ ...prev, isSynthesizing: false }))
      throw error
    }
  }, [state.isVoiceEnabled, setError])

  // Speak system message with appropriate voice
  const speakSystemMessage = useCallback(async (
    message: string, 
    type: 'status' | 'alert' | 'welcome' | 'error' | 'success' = 'status'
  ): Promise<VoiceResponse> => {
    return await voiceService.generateSystemMessage(message, type)
  }, [])

  // Play audio with volume control
  const playAudio = useCallback(async (audioUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }

      const audio = new Audio(audioUrl)
      audio.volume = state.volume
      currentAudioRef.current = audio

      setState(prev => ({ ...prev, isPlaying: true }))

      audio.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false }))
        currentAudioRef.current = null
        resolve()
      }

      audio.onerror = () => {
        setState(prev => ({ ...prev, isPlaying: false }))
        currentAudioRef.current = null
        reject(new Error('Audio playback failed'))
      }

      audio.play().catch(reject)
    })
  }, [state.volume])

  // Stop current audio playback
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
      setState(prev => ({ ...prev, isPlaying: false }))
    }
  }, [])

  // Set voice profile
  const setVoiceProfile = useCallback((profileId: string) => {
    const profile = state.voiceProfiles.find(p => p.id === profileId)
    if (profile) {
      setState(prev => ({ ...prev, selectedProfile: profile }))
    }
  }, [state.voiceProfiles])

  // Get voice for context
  const getVoiceForContext = useCallback((context: string): VoiceProfile => {
    return voiceService.selectVoiceForContext(context)
  }, [])

  // Toggle voice enabled/disabled
  const toggleVoice = useCallback(() => {
    setState(prev => ({ ...prev, isVoiceEnabled: !prev.isVoiceEnabled }))
  }, [])

  // Set volume
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    setState(prev => ({ ...prev, volume: clampedVolume }))
    
    if (currentAudioRef.current) {
      currentAudioRef.current.volume = clampedVolume
    }
  }, [])

  // Check voice service health
  const checkVoiceHealth = useCallback(async (): Promise<boolean> => {
    try {
      return await voiceService.healthCheck()
    } catch (error) {
      console.error('Voice health check failed:', error)
      return false
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && state.isRecording) {
        mediaRecorderRef.current.stop()
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
      }
    }
  }, [state.isRecording])

  return {
    ...state,
    startRecording,
    stopRecording,
    toggleRecording,
    speak,
    speakSystemMessage,
    stopSpeaking,
    setVoiceProfile,
    getVoiceForContext,
    toggleVoice,
    setVolume,
    checkVoiceHealth
  }
}