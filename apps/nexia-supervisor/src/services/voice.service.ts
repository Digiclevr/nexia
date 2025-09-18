/**
 * NEXIA Voice Service - Integration with OnlyOneAPI & Hugging Face Models
 * Provides advanced voice synthesis, transcription, and AI-powered voice selection
 */

export interface VoiceConfig {
  quality: 'basic' | 'standard' | 'premium' | 'studio'
  language: string
  voiceId?: string
  emotion?: 'neutral' | 'happy' | 'confident' | 'calm' | 'authoritative'
  speed?: number
  provider?: 'google' | 'azure' | 'whisper' | 'coqui_xtts_v2' | 'tortoise_tts' | 'bark'
}

export interface VoiceProfile {
  id: string
  name: string
  description: string
  model: string
  voiceId: string
  emotion: string
  speed: number
  useCase: string[]
}

export interface TranscriptionResult {
  text: string
  confidence: number
  language: string
  duration: number
  words?: Array<{
    word: string
    start: number
    end: number
    confidence: number
  }>
}

export interface VoiceResponse {
  audioUrl: string
  audioData?: ArrayBuffer
  duration: number
  voiceProfile: VoiceProfile
}

export class VoiceService {
  private baseUrl: string
  private apiKey: string | null
  
  // NEXIA-specific voice profiles optimized for different contexts
  private voiceProfiles: VoiceProfile[] = [
    {
      id: 'nexia-professional',
      name: 'NEXIA Professional',
      description: 'Professional, clear voice for technical reports and system status',
      model: 'coqui_xtts_v2',
      voiceId: 'professional_male',
      emotion: 'neutral',
      speed: 1.0,
      useCase: ['system-status', 'reports', 'alerts']
    },
    {
      id: 'nexia-friendly',
      name: 'NEXIA Assistant',
      description: 'Friendly, approachable voice for user interactions',
      model: 'bark',
      voiceId: 'friendly_female',
      emotion: 'happy',
      speed: 1.1,
      useCase: ['user-interaction', 'welcome', 'help']
    },
    {
      id: 'nexia-authoritative',
      name: 'NEXIA Command',
      description: 'Authoritative voice for critical alerts and commands',
      model: 'tortoise_tts',
      voiceId: 'authoritative_male',
      emotion: 'confident',
      speed: 0.9,
      useCase: ['critical-alerts', 'security', 'urgent-commands']
    },
    {
      id: 'nexia-calm',
      name: 'NEXIA Guide',
      description: 'Calm, soothing voice for guidance and instructions',
      model: 'coqui_xtts_v2',
      voiceId: 'guide_female',
      emotion: 'calm',
      speed: 0.95,
      useCase: ['guidance', 'tutorials', 'explanations']
    }
  ]

  constructor() {
    // OnlyOneAPI configuration
    this.baseUrl = process.env.ONLYONEAPI_URL || 'http://localhost:8001'
    this.apiKey = process.env.ONLYONEAPI_KEY || null
    
    if (!this.baseUrl) {
      console.warn('NEXIA Voice Service: OnlyOneAPI URL not configured')
    }
  }

  /**
   * Get available voice profiles for NEXIA
   */
  getVoiceProfiles(): VoiceProfile[] {
    return this.voiceProfiles
  }

  /**
   * Select optimal voice profile based on context and use case
   */
  selectVoiceForContext(context: string, useCase: string = 'system-status'): VoiceProfile {
    // AI-powered voice selection logic
    const contextKeywords = context.toLowerCase()
    
    // Critical/urgent context
    if (contextKeywords.includes('error') || 
        contextKeywords.includes('critical') || 
        contextKeywords.includes('alert') ||
        contextKeywords.includes('security')) {
      return this.voiceProfiles.find(p => p.id === 'nexia-authoritative') || this.voiceProfiles[0]
    }
    
    // Friendly/interactive context
    if (contextKeywords.includes('welcome') || 
        contextKeywords.includes('hello') || 
        contextKeywords.includes('help') ||
        useCase === 'user-interaction') {
      return this.voiceProfiles.find(p => p.id === 'nexia-friendly') || this.voiceProfiles[0]
    }
    
    // Guidance/tutorial context
    if (contextKeywords.includes('guide') || 
        contextKeywords.includes('tutorial') || 
        contextKeywords.includes('explain') ||
        useCase === 'guidance') {
      return this.voiceProfiles.find(p => p.id === 'nexia-calm') || this.voiceProfiles[0]
    }
    
    // Default to professional for system status and reports
    return this.voiceProfiles.find(p => p.id === 'nexia-professional') || this.voiceProfiles[0]
  }

  /**
   * Synthesize text to speech using OnlyOneAPI with Hugging Face models
   */
  async synthesizeVoice(
    text: string, 
    voiceProfileId?: string, 
    customConfig?: Partial<VoiceConfig>
  ): Promise<VoiceResponse> {
    try {
      const profile = voiceProfileId 
        ? this.voiceProfiles.find(p => p.id === voiceProfileId) || this.voiceProfiles[0]
        : this.selectVoiceForContext(text)

      const config: VoiceConfig = {
        quality: 'premium', // Use premium quality for NEXIA
        language: 'en',
        voiceId: profile.voiceId,
        emotion: profile.emotion as any,
        speed: profile.speed,
        provider: profile.model as any,
        ...customConfig
      }

      const response = await fetch(`${this.baseUrl}/voice/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          text,
          quality: config.quality,
          voice_id: config.voiceId,
          language: config.language,
          emotion: config.emotion,
          speed: config.speed,
          provider: config.provider
        })
      })

      if (!response.ok) {
        throw new Error(`Voice synthesis failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        audioUrl: result.audio_url || result.audioUrl,
        audioData: result.audio_data ? this.base64ToArrayBuffer(result.audio_data) : undefined,
        duration: result.duration || 0,
        voiceProfile: profile
      }
    } catch (error) {
      console.error('NEXIA Voice Synthesis Error:', error)
      throw new Error(`Failed to synthesize voice: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Transcribe audio to text using OnlyOneAPI with Whisper/ASR models
   */
  async transcribeAudio(
    audioFile: File | ArrayBuffer, 
    config?: Partial<VoiceConfig>
  ): Promise<TranscriptionResult> {
    try {
      const formData = new FormData()
      
      if (audioFile instanceof File) {
        formData.append('audio_file', audioFile)
      } else {
        // Convert ArrayBuffer to Blob
        const blob = new Blob([audioFile], { type: 'audio/wav' })
        formData.append('audio_file', blob, 'audio.wav')
      }

      // Add configuration
      if (config?.language) {
        formData.append('language', config.language)
      }
      if (config?.quality) {
        formData.append('quality', config.quality)
      }
      if (config?.provider) {
        formData.append('provider', config.provider)
      }

      const response = await fetch(`${this.baseUrl}/voice/transcribe`, {
        method: 'POST',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Audio transcription failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        text: result.text || result.transcription || '',
        confidence: result.confidence || 0.95,
        language: result.language || 'en',
        duration: result.duration || 0,
        words: result.words || undefined
      }
    } catch (error) {
      console.error('NEXIA Audio Transcription Error:', error)
      throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Analyze audio for emotion, quality, and context
   */
  async analyzeAudio(audioFile: File | ArrayBuffer): Promise<any> {
    try {
      const formData = new FormData()
      
      if (audioFile instanceof File) {
        formData.append('audio_file', audioFile)
      } else {
        const blob = new Blob([audioFile], { type: 'audio/wav' })
        formData.append('audio_file', blob, 'audio.wav')
      }

      const response = await fetch(`${this.baseUrl}/voice/analyze`, {
        method: 'POST',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Audio analysis failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('NEXIA Audio Analysis Error:', error)
      throw new Error(`Failed to analyze audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get supported languages and voices from OnlyOneAPI
   */
  async getSupportedLanguages(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/voice/supported-languages`, {
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get supported languages: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('NEXIA Get Languages Error:', error)
      return { languages: ['en', 'fr', 'es', 'de'] } // Fallback
    }
  }

  /**
   * Check OnlyOneAPI voice service health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/voice/health`, {
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      })
      return response.ok
    } catch (error) {
      console.error('NEXIA Voice Health Check Failed:', error)
      return false
    }
  }

  /**
   * Generate voice response for NEXIA commands and system messages
   */
  async generateSystemMessage(
    message: string, 
    messageType: 'status' | 'alert' | 'welcome' | 'error' | 'success' = 'status'
  ): Promise<VoiceResponse> {
    // Add NEXIA branding and context to messages
    const nexiaMessage = this.formatNexiaMessage(message, messageType)
    
    // Select appropriate voice based on message type
    const voiceProfile = this.selectVoiceForContext(nexiaMessage, messageType)
    
    return await this.synthesizeVoice(nexiaMessage, voiceProfile.id)
  }

  /**
   * Format message with NEXIA context and branding
   */
  private formatNexiaMessage(message: string, type: string): string {
    const prefixes = {
      status: "NEXIA System Status: ",
      alert: "NEXIA Alert: ",
      welcome: "Welcome to NEXIA. ",
      error: "NEXIA Error: ",
      success: "NEXIA Confirmation: "
    }
    
    const prefix = prefixes[type as keyof typeof prefixes] || "NEXIA: "
    return `${prefix}${message}`
  }

  /**
   * Utility: Convert base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  /**
   * Utility: Convert ArrayBuffer to base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }
}

// Export singleton instance
export const voiceService = new VoiceService()