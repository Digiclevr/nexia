import { NextRequest, NextResponse } from 'next/server'

// NEXIA Voice Synthesis API - Proxy to OnlyOneAPI
export async function POST(request: NextRequest) {
  try {
    const { text, voiceProfileId, quality, emotion, speed } = await request.json()
    
    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      )
    }

    // OnlyOneAPI configuration
    const onlyOneApiUrl = process.env.ONLYONEAPI_URL || 'http://localhost:8001'
    const apiKey = process.env.ONLYONEAPI_KEY
    
    // Voice profile mapping for NEXIA
    const voiceProfiles = {
      'nexia-professional': {
        voice_id: 'professional_male',
        emotion: 'neutral',
        provider: 'coqui_xtts_v2'
      },
      'nexia-friendly': {
        voice_id: 'friendly_female', 
        emotion: 'happy',
        provider: 'bark'
      },
      'nexia-authoritative': {
        voice_id: 'authoritative_male',
        emotion: 'confident', 
        provider: 'tortoise_tts'
      },
      'nexia-calm': {
        voice_id: 'guide_female',
        emotion: 'calm',
        provider: 'coqui_xtts_v2'
      }
    }

    const selectedProfile = voiceProfiles[voiceProfileId as keyof typeof voiceProfiles] || voiceProfiles['nexia-professional']
    
    // Prepare request to OnlyOneAPI
    const voiceRequest = {
      text,
      quality: quality || 'premium',
      voice_id: selectedProfile.voice_id,
      language: 'en',
      emotion: emotion || selectedProfile.emotion,
      speed: speed || 1.0,
      provider: selectedProfile.provider
    }

    // Call OnlyOneAPI voice synthesis
    const response = await fetch(`${onlyOneApiUrl}/voice/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify(voiceRequest)
    })

    if (!response.ok) {
      throw new Error(`OnlyOneAPI error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      audioUrl: result.audio_url || result.audioUrl,
      audioData: result.audio_data || result.audioData,
      duration: result.duration || 0,
      voiceProfile: {
        id: voiceProfileId,
        name: voiceProfileId?.replace('nexia-', '').replace('-', ' ') || 'Professional',
        emotion: selectedProfile.emotion,
        provider: selectedProfile.provider
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('NEXIA Voice Synthesis Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Voice synthesis failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}