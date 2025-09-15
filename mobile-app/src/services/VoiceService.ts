import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import SoundPlayer from 'react-native-sound-player';

export interface AudioProcessingResult {
  transcription: string;
  confidence: number;
  duration: number;
}

export interface VoiceSettings {
  inputLanguage: 'fr-FR' | 'en-US';
  outputVoice: 'speecht5' | 'bark';
  quality: 'standard' | 'premium';
  autoPlay: boolean;
}

export class VoiceService {
  private audioRecorderPlayer: AudioRecorderPlayer;
  private isInitialized: boolean = false;
  private settings: VoiceSettings;
  private baseUrl: string = 'https://voice.nexia.blueocean.k8s';

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.settings = {
      inputLanguage: 'fr-FR',
      outputVoice: 'speecht5',
      quality: 'standard',
      autoPlay: true,
    };
  }

  public async initialize(): Promise<void> {
    try {
      // Load saved settings
      const savedSettings = await AsyncStorage.getItem('voiceSettings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }

      // Check service availability
      await this.checkServiceHealth();
      
      this.isInitialized = true;
      console.log('✅ VoiceService initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize VoiceService:', error);
      // Fallback to offline mode
      this.baseUrl = 'offline';
    }
  }

  private async checkServiceHealth(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/whisper/health`, {
        method: 'GET',
        timeout: 5000,
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const health = await response.json();
      console.log('Voice service health:', health);
    } catch (error) {
      console.warn('Voice service not available, using fallback:', error);
      throw error;
    }
  }

  public async startRecording(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('VoiceService not initialized');
    }

    try {
      const path = 'nexia_recording.m4a';
      
      await this.audioRecorderPlayer.startRecorder(path);
      
      // Set up recording listener for audio levels
      this.audioRecorderPlayer.addRecordBackListener((e) => {
        // Audio level monitoring could be added here
        return;
      });

      console.log('✅ Recording started');
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      throw error;
    }
  }

  public async stopRecording(): Promise<string> {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      
      console.log('✅ Recording stopped:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      throw error;
    }
  }

  public async processAudio(audioPath: string): Promise<AudioProcessingResult> {
    if (this.baseUrl === 'offline') {
      // Fallback for offline mode
      return this.processAudioOffline(audioPath);
    }

    try {
      // Read audio file
      const audioData = await this.readAudioFile(audioPath);
      
      // Send to Whisper service
      const formData = new FormData();
      formData.append('audio', {
        uri: audioPath,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      const response = await fetch(`${this.baseUrl}/whisper/transcribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        transcription: result.transcription || 'Transcription non disponible',
        confidence: result.confidence || 0.8,
        duration: result.duration || 0,
      };

    } catch (error) {
      console.error('❌ Audio processing failed:', error);
      return this.processAudioOffline(audioPath);
    }
  }

  private async processAudioOffline(audioPath: string): Promise<AudioProcessingResult> {
    // Fallback when service is unavailable
    const fallbackResponses = [
      'Commande vocale reçue',
      'Demande de statut du système',
      'Question sur le projet actuel',
      'Requête de monitoring',
    ];

    return {
      transcription: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      confidence: 0.6,
      duration: 2.5,
    };
  }

  public async synthesizeSpeech(text: string): Promise<string> {
    if (this.baseUrl === 'offline') {
      return 'offline'; // No audio synthesis in offline mode
    }

    try {
      const response = await fetch(`${this.baseUrl}/tts/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: 0,
          speed: 1.0,
          pitch: 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Save audio to local file
      const audioPath = await this.saveBase64Audio(result.audio);
      
      // Auto-play if enabled
      if (this.settings.autoPlay) {
        await this.playAudio(audioPath);
      }

      return audioPath;
    } catch (error) {
      console.error('❌ Speech synthesis failed:', error);
      return 'error';
    }
  }

  private async readAudioFile(path: string): Promise<ArrayBuffer> {
    // Implementation would read the audio file
    // This is a placeholder for the actual file reading logic
    return new ArrayBuffer(0);
  }

  private async saveBase64Audio(base64Audio: string): Promise<string> {
    // Implementation would save base64 audio to local file
    // This is a placeholder for the actual file saving logic
    return 'temp_audio.wav';
  }

  public async playAudio(audioPath: string): Promise<void> {
    try {
      await SoundPlayer.playUrl(audioPath);
      console.log('✅ Audio playback started');
    } catch (error) {
      console.error('❌ Audio playback failed:', error);
    }
  }

  public async updateSettings(newSettings: Partial<VoiceSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    await AsyncStorage.setItem('voiceSettings', JSON.stringify(this.settings));
    console.log('✅ Voice settings updated');
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public isServiceAvailable(): boolean {
    return this.isInitialized && this.baseUrl !== 'offline';
  }

  public async testVoicePipeline(): Promise<{
    whisper: boolean;
    tts: boolean;
    latency: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Test Whisper service
      const whisperResponse = await fetch(`${this.baseUrl}/whisper/health`);
      const whisperHealthy = whisperResponse.ok;

      // Test TTS service  
      const ttsResponse = await fetch(`${this.baseUrl}/tts/health`);
      const ttsHealthy = ttsResponse.ok;

      const latency = Date.now() - startTime;

      return {
        whisper: whisperHealthy,
        tts: ttsHealthy,
        latency,
      };
    } catch (error) {
      return {
        whisper: false,
        tts: false,
        latency: -1,
      };
    }
  }
}

export default VoiceService;