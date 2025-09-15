import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import NextStep from './components/NextStep';
import OnlyOneAPI from './components/OnlyOneAPI';
import BotsManager from './components/BotsManager';
import ValidationQueue from './components/ValidationQueue';
import Metrics from './components/Metrics';
import APIConfiguration from './components/APIConfiguration';
import SystemMonitor from './components/SystemMonitor';
import EmergencyConsulting from './components/EmergencyConsulting';
import HelpPage from './components/HelpPage';
import Roadmap from './components/Roadmap';
import BattleRoom from './components/BattleRoom';
import Mindset from './components/Mindset';
import BotsCoordination from './components/BotsCoordination';
import KvibeDashboard from './components/KvibeDashboard';
import OnlyOneAPI360 from './components/OnlyOneAPI360';
import MediaTimingDocumentation from './components/MediaTimingDocumentation';
import './App.css';

const socket = io('http://localhost:5011');

function App() {
  const [metrics, setMetrics] = useState(null);
  const [agents, setAgents] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    // Socket event listeners
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('metrics_update', (newMetrics) => {
      setMetrics(newMetrics);
    });

    socket.on('activity_update', (newActivity) => {
      setActivity(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
    });

    socket.on('agent_created', (agent) => {
      setAgents(prev => [agent, ...prev]);
    });

    socket.on('agent_updated', (agent) => {
      setAgents(prev => prev.map(a => a.id === agent.id ? agent : a));
    });

    socket.on('agent_deleted', (data) => {
      setAgents(prev => prev.filter(a => a.id !== data.id));
    });

    socket.on('agent_toggled', (agent) => {
      setAgents(prev => prev.map(a => a.id === agent.id ? agent : a));
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('metrics_update');
      socket.off('activity_update');
      socket.off('agent_created');
      socket.off('agent_updated');
      socket.off('agent_deleted');
      socket.off('agent_toggled');
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();
    fetchAgents();
    fetchActivity();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/overview');
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch('/api/dashboard/activity?limit=50');
      const data = await response.json();
      setActivity(data);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  };

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/nextstep" replace />} />
            <Route 
              path="/nextstep" 
              element={
                <NextStep 
                  metrics={metrics} 
                  agents={agents} 
                  activity={activity} 
                />
              } 
            />
            <Route 
              path="/onlyoneapi" 
              element={<OnlyOneAPI />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  metrics={metrics} 
                  agents={agents} 
                  activity={activity} 
                />
              } 
            />
            <Route 
              path="/agents" 
              element={<BotsManager />} 
            />
            <Route path="/validation" element={<ValidationQueue />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/api-config" element={<APIConfiguration />} />
            <Route path="/system" element={<SystemMonitor />} />
            <Route path="/emergency-consulting" element={<EmergencyConsulting />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/battle-room" element={<BattleRoom />} />
            <Route path="/mindset" element={<Mindset />} />
            <Route path="/bots-coordination" element={<BotsCoordination />} />
            <Route path="/kvibe-dashboard" element={<KvibeDashboard />} />
            <Route path="/onlyoneapi360" element={<OnlyOneAPI360 />} />
            <Route path="/media-timing" element={<MediaTimingDocumentation />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;