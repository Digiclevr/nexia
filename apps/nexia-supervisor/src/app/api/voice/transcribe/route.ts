import { NextRequest, NextResponse } from 'next/server'

// NEXIA Voice Transcription API - Proxy to OnlyOneAPI
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio_file') as File
    const quality = formData.get('quality') as string || 'premium'
    const language = formData.get('language') as string || 'en'
    const provider = formData.get('provider') as string || 'whisper'
    
    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // OnlyOneAPI configuration
    const onlyOneApiUrl = process.env.ONLYONEAPI_URL || 'http://localhost:8001'
    const apiKey = process.env.ONLYONEAPI_KEY
    
    // Prepare form data for OnlyOneAPI
    const apiFormData = new FormData()
    apiFormData.append('audio_file', audioFile)
    apiFormData.append('quality', quality)
    apiFormData.append('language', language)
    apiFormData.append('provider', provider)
    
    // Add NEXIA-specific parameters
    apiFormData.append('enable_timestamps', 'true')
    apiFormData.append('enable_word_confidence', 'true')
    apiFormData.append('context', 'nexia_supervisor') // Help with technical vocabulary

    // Call OnlyOneAPI transcription
    const response = await fetch(`${onlyOneApiUrl}/voice/transcribe`, {
      method: 'POST',
      headers: {
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: apiFormData
    })

    if (!response.ok) {
      throw new Error(`OnlyOneAPI error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    
    // Process and enhance transcription for NEXIA context
    const enhancedResult = {
      success: true,
      text: result.text || result.transcription || '',
      confidence: result.confidence || 0.95,
      language: result.language || language,
      duration: result.duration || 0,
      words: result.words || undefined,
      
      // NEXIA-specific enhancements
      nexiaContext: {
        isCommand: detectNexiaCommand(result.text || ''),
        technicalTerms: extractTechnicalTerms(result.text || ''),
        actionItems: extractActionItems(result.text || ''),
        sentiment: analyzeSentiment(result.text || '')
      },
      
      provider: provider,
      quality: quality,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(enhancedResult)

  } catch (error) {
    console.error('NEXIA Voice Transcription Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Voice transcription failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Helper functions for NEXIA context analysis

function detectNexiaCommand(text: string): boolean {
  const commandKeywords = [
    'nexia', 'status', 'deploy', 'restart', 'monitor', 'alert', 'check',
    'show', 'display', 'report', 'analyze', 'investigate', 'fix', 'stop',
    'start', 'pause', 'resume', 'scale', 'backup', 'restore'
  ]
  
  const lowerText = text.toLowerCase()
  return commandKeywords.some(keyword => lowerText.includes(keyword))
}

function extractTechnicalTerms(text: string): string[] {
  const technicalTerms = [
    'kubernetes', 'docker', 'api', 'database', 'redis', 'postgresql', 'nginx',
    'deployment', 'service', 'pod', 'container', 'cluster', 'namespace',
    'cpu', 'memory', 'disk', 'network', 'bandwidth', 'latency', 'throughput',
    'error', 'warning', 'critical', 'health', 'metrics', 'logs', 'monitoring'
  ]
  
  const lowerText = text.toLowerCase()
  return technicalTerms.filter(term => lowerText.includes(term))
}

function extractActionItems(text: string): string[] {
  const actionVerbs = [
    'deploy', 'restart', 'stop', 'start', 'check', 'fix', 'investigate',
    'monitor', 'scale', 'backup', 'restore', 'update', 'upgrade', 'patch'
  ]
  
  const words = text.toLowerCase().split(/\s+/)
  const actions: string[] = []
  
  words.forEach((word, index) => {
    if (actionVerbs.includes(word) && index < words.length - 1) {
      // Get the action and the next few words as context
      const context = words.slice(index, Math.min(index + 4, words.length)).join(' ')
      actions.push(context)
    }
  })
  
  return actions
}

function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' | 'urgent' {
  const urgentKeywords = ['critical', 'urgent', 'emergency', 'immediate', 'asap']
  const negativeKeywords = ['error', 'failed', 'problem', 'issue', 'down', 'broken']
  const positiveKeywords = ['success', 'completed', 'working', 'healthy', 'good', 'ok']
  
  const lowerText = text.toLowerCase()
  
  if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'urgent'
  }
  
  if (negativeKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'negative'
  }
  
  if (positiveKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'positive'
  }
  
  return 'neutral'
}