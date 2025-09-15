import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { Mic, MicOff, Activity, Settings, Zap } from 'lucide-react';
import VoiceInterface from './components/VoiceInterface';
import Dashboard from './components/Dashboard';
import TouchBarController from './components/TouchBarController';

interface EcosystemStatus {
  services: string[];
  health: string;
  timestamp: string;
}

function App() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [ecosystemStatus, setEcosystemStatus] = useState<EcosystemStatus | null>(null);
  const [currentView, setCurrentView] = useState<'voice' | 'dashboard' | 'settings'>('voice');

  useEffect(() => {
    // Load ecosystem status
    loadEcosystemStatus();
    
    // Setup system tray event listener
    const unlisten = listen('voice-toggle', () => {
      toggleVoiceSession();
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  const loadEcosystemStatus = async () => {
    try {
      const statusStr = await invoke<string>('get_ecosystem_status');
      const status = JSON.parse(statusStr);
      setEcosystemStatus(status);
    } catch (error) {
      console.error('Failed to load ecosystem status:', error);
    }
  };

  const toggleVoiceSession = async () => {
    try {
      if (isVoiceActive) {
        await invoke('stop_voice_session');
        setIsVoiceActive(false);
      } else {
        await invoke('start_voice_session');
        setIsVoiceActive(true);
      }
    } catch (error) {
      console.error('Failed to toggle voice session:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Touch Bar Controller */}
      <TouchBarController 
        isVoiceActive={isVoiceActive}
        onVoiceToggle={toggleVoiceSession}
        onViewChange={setCurrentView}
      />

      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NEXIA Voice
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Activity className="w-4 h-4" />
              <span>{ecosystemStatus?.health || 'Checking...'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleVoiceSession}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isVoiceActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isVoiceActive ? 'Stop Voice' : 'Start Voice'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/30 border-b border-slate-700/30 p-2">
        <div className="flex space-x-1">
          {[
            { key: 'voice', label: '🎙️ Voice', icon: Mic },
            { key: 'dashboard', label: '📊 Dashboard', icon: Activity },
            { key: 'settings', label: '⚙️ Settings', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCurrentView(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentView === key
                  ? 'bg-blue-600/50 text-blue-200 border border-blue-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {currentView === 'voice' && (
          <VoiceInterface 
            isActive={isVoiceActive}
            onToggle={toggleVoiceSession}
            ecosystemStatus={ecosystemStatus}
          />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard ecosystemStatus={ecosystemStatus} />
        )}
        
        {currentView === 'settings' && (
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Voice Recognition Language</span>
                <select className="bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="fr-FR">Français</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Response Voice</span>
                <select className="bg-slate-700 border border-slate-600 rounded px-3 py-2">
                  <option value="microsoft/speecht5_tts">SpeechT5 (Fast)</option>
                  <option value="bark">Bark (Premium)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>TDAH-Optimized Mode</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Status Bar */}
      <footer className="bg-slate-800/30 border-t border-slate-700/30 p-2 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>OnlyOneAPI: 402 endpoints</span>
            <span>Cluster: BlueOcean ✅</span>
            <span>Voice: {isVoiceActive ? 'Active' : 'Standby'}</span>
          </div>
          <div>
            {ecosystemStatus?.timestamp && new Date(ecosystemStatus.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;