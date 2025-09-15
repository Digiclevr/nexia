import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import VoiceScreen from './src/screens/VoiceScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { VoiceService } from './src/services/VoiceService';
import { NexiaContextService } from './src/services/NexiaContextService';
import { TabBarIcon } from './src/components/TabBarIcon';

const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentProject, setCurrentProject] = useState('NEXIA');
  const [voiceService] = useState(() => new VoiceService());
  const [contextService] = useState(() => new NexiaContextService());

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request permissions
      await requestPermissions();
      
      // Initialize services
      await voiceService.initialize();
      await contextService.initialize();
      
      // Load saved settings
      const savedProject = await AsyncStorage.getItem('currentProject');
      if (savedProject) {
        setCurrentProject(savedProject);
        contextService.switchProject(savedProject);
      }

      // Enable voice if permission granted
      const voiceEnabled = await AsyncStorage.getItem('voiceEnabled');
      setIsVoiceEnabled(voiceEnabled === 'true');

    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert('Erreur', 'Impossible d\'initialiser NEXIA Mobile');
    }
  };

  const requestPermissions = async () => {
    try {
      // Request microphone permission
      const microphonePermission = Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      });

      if (microphonePermission) {
        const result = await request(microphonePermission);
        if (result !== RESULTS.GRANTED) {
          Alert.alert(
            'Permission requise',
            'NEXIA a besoin d\'accéder au microphone pour la reconnaissance vocale',
            [{ text: 'OK' }]
          );
        }
      }

      // Request notification permission (iOS)
      if (Platform.OS === 'ios') {
        await request(PERMISSIONS.IOS.NOTIFICATIONS);
      }

    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const handleProjectChange = async (projectName: string) => {
    setCurrentProject(projectName);
    contextService.switchProject(projectName);
    await AsyncStorage.setItem('currentProject', projectName);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <TabBarIcon route={route} focused={focused} color={color} size={size} />
            ),
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
              backgroundColor: '#1e293b',
              borderTopColor: '#334155',
              borderTopWidth: 1,
              paddingBottom: Platform.OS === 'ios' ? 20 : 5,
              height: Platform.OS === 'ios' ? 85 : 65,
            },
            headerStyle: {
              backgroundColor: '#0f172a',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen 
            name="Voice" 
            options={{ 
              title: 'Voice',
              headerTitle: `NEXIA Voice - ${currentProject}`,
            }}
          >
            {props => (
              <VoiceScreen
                {...props}
                isVoiceEnabled={isVoiceEnabled}
                setIsVoiceEnabled={setIsVoiceEnabled}
                currentProject={currentProject}
                voiceService={voiceService}
                contextService={contextService}
              />
            )}
          </Tab.Screen>

          <Tab.Screen 
            name="Dashboard" 
            options={{ 
              title: 'Dashboard',
              headerTitle: 'BlueOcean Dashboard',
            }}
          >
            {props => (
              <DashboardScreen
                {...props}
                currentProject={currentProject}
                contextService={contextService}
              />
            )}
          </Tab.Screen>

          <Tab.Screen 
            name="Projects" 
            options={{ 
              title: 'Projects',
              headerTitle: 'Écosystème BlueOcean',
            }}
          >
            {props => (
              <ProjectsScreen
                {...props}
                currentProject={currentProject}
                onProjectChange={handleProjectChange}
                contextService={contextService}
              />
            )}
          </Tab.Screen>

          <Tab.Screen 
            name="Settings" 
            options={{ 
              title: 'Settings',
              headerTitle: 'Paramètres NEXIA',
            }}
          >
            {props => (
              <SettingsScreen
                {...props}
                isVoiceEnabled={isVoiceEnabled}
                setIsVoiceEnabled={setIsVoiceEnabled}
                voiceService={voiceService}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#3b82f6',
    background: '#0f172a',
    card: '#1e293b',
    text: '#ffffff',
    border: '#334155',
    notification: '#ef4444',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});