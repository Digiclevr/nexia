import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { VoiceService } from '../services/VoiceService';
import { NexiaContextService } from '../services/NexiaContextService';
import { VoiceWaveform } from '../components/VoiceWaveform';
import { MessageBubble } from '../components/MessageBubble';
import { QuickActions } from '../components/QuickActions';

interface VoiceScreenProps {
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (enabled: boolean) => void;
  currentProject: string;
  voiceService: VoiceService;
  contextService: NexiaContextService;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  projectContext?: string;
}

const { width, height } = Dimensions.get('window');

export default function VoiceScreen({
  isVoiceEnabled,
  setIsVoiceEnabled,
  currentProject,
  voiceService,
  contextService,
}: VoiceScreenProps): JSX.Element {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      addMessage('assistant', `Bonjour ! Je suis Nexia, votre assistant vocal pour l'écosystème BlueOcean. Actuellement sur le projet ${currentProject}.`);
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecordingAnimation();
    } else {
      stopRecordingAnimation();
    }
  }, [isRecording]);

  const startRecordingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopRecordingAnimation = () => {
    scaleAnim.setValue(1);
    pulseAnim.setValue(0);
  };

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      projectContext: currentProject,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleVoiceRecording = async () => {
    if (!isVoiceEnabled) {
      Alert.alert(
        'Voice désactivée',
        'Activez la reconnaissance vocale dans les paramètres',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (isRecording) {
        // Stop recording
        setIsRecording(false);
        setIsProcessing(true);
        
        const audioData = await voiceService.stopRecording();
        addMessage('user', '🎙️ Commande vocale');
        
        // Process audio
        const result = await voiceService.processAudio(audioData);
        const response = await contextService.processMessage(result.transcription);
        
        setTimeout(() => {
          addMessage('assistant', response.response);
          setIsProcessing(false);
        }, 1000);
        
      } else {
        // Start recording
        setIsRecording(true);
        await voiceService.startRecording();
      }
    } catch (error) {
      console.error('Voice recording failed:', error);
      setIsRecording(false);
      setIsProcessing(false);
      
      Alert.alert('Erreur', 'Impossible de traiter la commande vocale');
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsProcessing(true);
    
    try {
      const response = await contextService.processMessage(action);
      addMessage('user', action);
      
      setTimeout(() => {
        addMessage('assistant', response.response);
        setIsProcessing(false);
      }, 800);
    } catch (error) {
      console.error('Quick action failed:', error);
      setIsProcessing(false);
    }
  };

  const getVoiceButtonColor = () => {
    if (isRecording) return ['#ef4444', '#dc2626'];
    if (isProcessing) return ['#f59e0b', '#d97706'];
    return ['#3b82f6', '#2563eb'];
  };

  return (
    <View style={styles.container}>
      {/* Voice Interface */}
      <View style={styles.voiceSection}>
        {/* Waveform Visualizer */}
        <VoiceWaveform 
          isRecording={isRecording}
          audioLevel={audioLevel}
          style={styles.waveform}
        />

        {/* Voice Button */}
        <View style={styles.voiceButtonContainer}>
          {isRecording && (
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: pulseAnim,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
          )}
          
          <TouchableOpacity
            style={styles.voiceButtonWrapper}
            onPress={toggleVoiceRecording}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.voiceButton,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <LinearGradient
                colors={getVoiceButtonColor()}
                style={styles.voiceButtonGradient}
              >
                <Text style={styles.voiceButtonIcon}>
                  {isRecording ? '⏹️' : isProcessing ? '⏳' : '🎙️'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Status Text */}
        <Text style={styles.statusText}>
          {isRecording ? 'Écoute en cours...' : 
           isProcessing ? 'Traitement...' : 
           isVoiceEnabled ? 'Appuyez pour parler' : 'Voice désactivée'}
        </Text>

        {/* Current Project */}
        <View style={styles.projectBadge}>
          <Text style={styles.projectText}>📍 {currentProject}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <QuickActions 
        currentProject={currentProject}
        onAction={handleQuickAction}
        disabled={isProcessing || isRecording}
      />

      {/* Messages */}
      <View style={styles.messagesContainer}>
        <Text style={styles.messagesTitle}>Conversation</Text>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.type === 'user'}
            />
          ))}
          
          {isProcessing && (
            <MessageBubble
              message={{
                id: 'processing',
                type: 'assistant',
                content: 'Nexia réfléchit...',
                timestamp: new Date(),
              }}
              isCurrentUser={false}
              isLoading={true}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  voiceSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  waveform: {
    marginBottom: 30,
  },
  voiceButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  voiceButtonWrapper: {
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  voiceButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  voiceButtonGradient: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonIcon: {
    fontSize: 32,
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  projectBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  projectText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  messagesTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
});