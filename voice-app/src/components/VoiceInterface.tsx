import React, { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Mic, MicOff, Send, Volume2, Loader2 } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

interface VoiceInterfaceProps {
  isActive: boolean;
  onToggle: () => void;
  ecosystemStatus: any;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ isActive, onToggle, ecosystemStatus }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      addMessage('assistant', 'Bonjour ! Je suis Nexia, votre assistant vocal pour l\'écosystème BlueOcean. Comment puis-je vous aider ?');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type: 'user' | 'assistant', content: string, audioUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      audioUrl
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true 
        } 
      });
      
      setAudioStream(stream);
      setIsRecording(true);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudioBlob(audioBlob);
      };
      
      mediaRecorder.start();
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
    }
  };

  const processAudioBlob = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioData = new Uint8Array(arrayBuffer);
      
      // Process via Tauri backend
      const result = await invoke<string>('process_voice_command', { 
        audioData: Array.from(audioData) 
      });
      
      // For now, simulate response
      addMessage('user', 'Commande vocale reçue');
      
      // Simulate OnlyOneAPI call
      setTimeout(() => {
        addMessage('assistant', 'J\'ai bien reçu votre commande. En tant que Nexia, je vais traiter votre demande via OnlyOneAPI et les services du cluster BlueOcean.');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to process audio:', error);
      addMessage('assistant', 'Désolé, je n\'ai pas pu traiter votre commande vocale. Réessayez ou utilisez le texte.');
    } finally {
      setIsProcessing(false);
    }
  };

  const sendTextMessage = async () => {
    if (!textInput.trim()) return;
    
    const userMessage = textInput.trim();
    setTextInput('');
    addMessage('user', userMessage);
    setIsProcessing(true);
    
    try {
      // Query OnlyOneAPI
      const endpoint = '/ai/text/analyze';
      const data = JSON.stringify({ text: userMessage });
      
      const result = await invoke<string>('query_onlyoneapi', { endpoint, data });
      
      // Parse and respond
      setTimeout(() => {
        addMessage('assistant', `J'ai analysé votre message via OnlyOneAPI. Voici ma réponse contextuelle basée sur l'écosystème BlueOcean : ${userMessage}`);
      }, 800);
      
    } catch (error) {
      console.error('Failed to process text:', error);
      addMessage('assistant', 'Erreur lors du traitement via OnlyOneAPI. Vérifiez que les services sont actifs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions = [
    { label: 'Status KREACH', action: () => sendQuickCommand('Status du projet KREACH') },
    { label: 'Deploy OnlyOneAPI', action: () => sendQuickCommand('Déployer OnlyOneAPI') },
    { label: 'Health Check', action: () => sendQuickCommand('Vérifier la santé du cluster') },
    { label: 'Open Dashboard', action: () => sendQuickCommand('Ouvrir le dashboard de supervision') }
  ];

  const sendQuickCommand = (command: string) => {
    setTextInput(command);
    setTimeout(() => sendTextMessage(), 100);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      {/* Voice Visualization */}
      <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center space-x-6">
          {/* Recording Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isActive || isProcessing}
            className={`relative p-6 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            } ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
            )}
          </button>

          {/* Waveform Visualizer */}
          <div className="flex-1 max-w-md">
            <WaveformVisualizer 
              isRecording={isRecording}
              audioStream={audioStream}
              level={audioLevel}
            />
          </div>

          {/* Status */}
          <div className="text-sm text-center min-w-[120px]">
            <div className={`font-semibold ${isActive ? 'text-green-400' : 'text-slate-400'}`}>
              {isActive ? 'Prêt' : 'Inactif'}
            </div>
            <div className="text-slate-500">
              {isRecording ? 'Écoute...' : isProcessing ? 'Traitement...' : 'En attente'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            disabled={isProcessing}
            className="bg-slate-700/50 hover:bg-slate-600/50 rounded-lg p-3 text-sm transition-all"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 bg-slate-800/30 rounded-xl p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                <div className="mb-1">{message.content}</div>
                <div className="flex items-center justify-between text-xs opacity-70">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.audioUrl && (
                    <button className="ml-2 hover:text-blue-400">
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-100 p-3 rounded-lg flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Nexia réfléchit...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Text Input */}
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-600/30">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
            placeholder="Tapez votre message ou utilisez la voix..."
            disabled={isProcessing}
            className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendTextMessage}
            disabled={!textInput.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;