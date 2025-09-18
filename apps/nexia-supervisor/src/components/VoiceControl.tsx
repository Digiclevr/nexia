'use client'

import React, { useState, useEffect } from 'react'
import { useVoice } from '@/hooks/useVoice'
import { clsx } from 'clsx'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Settings, 
  Bot,
  Loader2,
  CheckCircle,
  AlertCircle,
  Square
} from 'lucide-react'

interface VoiceControlProps {
  className?: string
  compact?: boolean
  showTranscription?: boolean
  onTranscriptionChange?: (text: string) => void
  onVoiceCommand?: (command: string) => void
}

export function VoiceControl({
  className,
  compact = false,
  showTranscription = true,
  onTranscriptionChange,
  onVoiceCommand
}: VoiceControlProps) {
  const voice = useVoice()
  const [showSettings, setShowSettings] = useState(false)
  const [testMessage, setTestMessage] = useState('')

  // Handle transcription changes
  useEffect(() => {
    if (voice.lastTranscription && onTranscriptionChange) {
      onTranscriptionChange(voice.lastTranscription)
    }
    
    if (voice.lastTranscription && onVoiceCommand) {
      onVoiceCommand(voice.lastTranscription)
    }
  }, [voice.lastTranscription, onTranscriptionChange, onVoiceCommand])

  // Test voice synthesis
  const handleTestVoice = async () => {
    if (!testMessage.trim()) {
      setTestMessage('NEXIA voice system operational. All systems functioning normally.')
    }
    
    try {
      await voice.speak(testMessage || 'NEXIA voice system operational. All systems functioning normally.')
    } catch (error) {
      console.error('Voice test failed:', error)
    }
  }

  // Quick system announcements
  const handleQuickAnnouncement = async (type: 'status' | 'alert' | 'welcome' | 'error' | 'success', message: string) => {
    try {
      await voice.speakSystemMessage(message, type)
    } catch (error) {
      console.error('System announcement failed:', error)
    }
  }

  if (compact) {
    return (
      <div className={clsx('flex items-center space-x-2', className)}>
        {/* Recording Button */}
        <button
          onClick={voice.toggleRecording}
          disabled={voice.isTranscribing}
          className={clsx(
            'relative p-2 rounded-full transition-all duration-200',
            voice.isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
            voice.isTranscribing && 'opacity-50 cursor-not-allowed'
          )}
          title={voice.isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {voice.isTranscribing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : voice.isRecording ? (
            <Square className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>

        {/* Voice Toggle */}
        <button
          onClick={voice.toggleVoice}
          className={clsx(
            'p-2 rounded-full transition-all duration-200',
            voice.isVoiceEnabled 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          )}
          title={voice.isVoiceEnabled ? 'Disable Voice' : 'Enable Voice'}
        >
          {voice.isVoiceEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>

        {/* Status Indicator */}
        {(voice.isPlaying || voice.isSynthesizing) && (
          <div className="flex items-center text-blue-600">
            <Play className="h-3 w-3 animate-pulse" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={clsx('bg-white rounded-lg border shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">NEXIA Voice Control</h3>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            {voice.isVoiceEnabled ? (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Active</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400 text-sm">
                <MicOff className="h-4 w-4 mr-1" />
                <span>Disabled</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Main Controls */}
      <div className="p-4 space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={voice.toggleRecording}
            disabled={voice.isTranscribing || !voice.isVoiceEnabled}
            className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
              voice.isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600',
              (voice.isTranscribing || !voice.isVoiceEnabled) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {voice.isTranscribing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : voice.isRecording ? (
              <>
                <Square className="h-4 w-4" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span>Start Recording</span>
              </>
            )}
          </button>

          {/* Playback Controls */}
          {voice.isPlaying && (
            <button
              onClick={voice.stopSpeaking}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              <Pause className="h-4 w-4" />
              <span>Stop Speaking</span>
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickAnnouncement('status', 'All systems operational')}
            disabled={!voice.isVoiceEnabled || voice.isSynthesizing}
            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Status OK
          </button>
          <button
            onClick={() => handleQuickAnnouncement('alert', 'Alert detected, investigating')}
            disabled={!voice.isVoiceEnabled || voice.isSynthesizing}
            className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Alert
          </button>
          <button
            onClick={() => handleQuickAnnouncement('welcome', 'Welcome to NEXIA')}
            disabled={!voice.isVoiceEnabled || voice.isSynthesizing}
            className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Welcome
          </button>
          <button
            onClick={() => handleQuickAnnouncement('error', 'System error detected')}
            disabled={!voice.isVoiceEnabled || voice.isSynthesizing}
            className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Error
          </button>
        </div>

        {/* Transcription Display */}
        {showTranscription && voice.lastTranscription && (
          <div className="p-3 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Last Transcription:</h4>
            <p className="text-sm text-gray-900">{voice.lastTranscription}</p>
          </div>
        )}

        {/* Error Display */}
        {voice.error && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center text-red-700">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Error:</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{voice.error}</p>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t p-4 bg-gray-50 space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Voice Settings</h4>
          
          {/* Volume Control */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Volume: {Math.round(voice.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voice.volume}
              onChange={(e) => voice.setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Voice Profile Selection */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Voice Profile:</label>
            <select
              value={voice.selectedProfile?.id || ''}
              onChange={(e) => voice.setVoiceProfile(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {voice.voiceProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} - {profile.description}
                </option>
              ))}
            </select>
          </div>

          {/* Test Voice */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Test Message:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message..."
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleTestVoice}
                disabled={!voice.isVoiceEnabled || voice.isSynthesizing}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Test
              </button>
            </div>
          </div>

          {/* Enable/Disable Voice */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Voice System:</span>
            <button
              onClick={voice.toggleVoice}
              className={clsx(
                'px-4 py-2 text-sm rounded-lg font-medium transition-colors',
                voice.isVoiceEnabled 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {voice.isVoiceEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VoiceControl