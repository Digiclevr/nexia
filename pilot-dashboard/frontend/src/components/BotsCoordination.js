import React, { useState, useEffect } from 'react';
import './BotsCoordination.css';

const BotsCoordination = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchBotsData();
    // Set up real-time updates
    const interval = setInterval(fetchBotsData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchBotsData = async () => {
    try {
      const response = await fetch('/api/bots-squad');
      if (response.ok) {
        const botsData = await response.json();
        setBots(botsData);
      } else {
        console.error('Failed to fetch bots data');
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (actionType, payload = {}) => {
    setActionLoading(prev => ({ ...prev, [actionType]: true }));
    
    try {
      let endpoint;
      switch (actionType) {
        case 'daily_standup':
          endpoint = '/api/bots-squad/coordination/daily-standup';
          break;
        case 'sync_status':
          endpoint = '/api/bots-squad/coordination/sync-status';
          break;
        case 'generate_report':
          endpoint = '/api/bots-squad/coordination/generate-report';
          break;
        case 'emergency_escalation':
          endpoint = '/api/bots-squad/coordination/emergency-escalation';
          break;
        default:
          throw new Error('Unknown action type');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${actionType} completed:`, result);
        
        // Show success message or handle result
        if (actionType === 'generate_report') {
          // Could display report in modal
          console.log('Squad Report:', result.report);
        }
        
        // Refresh bots data after action
        fetchBotsData();
        
        return result;
      } else {
        throw new Error(`Failed to execute ${actionType}`);
      }
    } catch (error) {
      console.error(`Error executing ${actionType}:`, error);
      throw error;
    } finally {
      setActionLoading(prev => ({ ...prev, [actionType]: false }));
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'maintenance': return '#6b7280';
      default: return '#10b981';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 95) return '#10b981';
    if (health >= 85) return '#3b82f6';
    if (health >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'active': return '▶';
      case 'in_progress': return '↻';
      case 'pending': return '○';
      case 'completed': return '✓';
      default: return '○';
    }
  };

  if (loading) {
    return (
      <div className="bots-coordination loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bots coordination...</p>
      </div>
    );
  }

  const totalBots = bots.length;
  const activeBots = bots.filter(bot => bot.status === 'active').length;
  const avgHealth = Math.round(bots.reduce((sum, bot) => sum + bot.health, 0) / totalBots);
  const totalTasks = bots.reduce((sum, bot) => sum + bot.tasksActive, 0);

  return (
    <div className="bots-coordination">
      <div className="section-header">
        <h2 className="section-title">Squad Coordination - Bots Claude</h2>
        <div className="section-stats">
          <span className="stat-item">
            <span className="stat-value">{totalBots}</span>
            <span className="stat-label">Bots Squad</span>
          </span>
          <span className="stat-item">
            <span className="stat-value">{activeBots}</span>
            <span className="stat-label">Active</span>
          </span>
          <span className="stat-item highlight">
            <span className="stat-value">{avgHealth}%</span>
            <span className="stat-label">Avg Health</span>
          </span>
          <span className="stat-item">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Active Tasks</span>
          </span>
        </div>
      </div>

      <div className="bots-grid">
        {bots.map(bot => (
          <div key={bot.id} className={`bot-card ${selectedBot === bot.id ? 'selected' : ''}`}>
            <div className="bot-header" onClick={() => setSelectedBot(selectedBot === bot.id ? null : bot.id)}>
              <div className="bot-info">
                <h3 className="bot-name">{bot.name}</h3>
                <span className="bot-role">{bot.role}</span>
                <span className="bot-domain">{bot.domain}</span>
              </div>
              <div className="bot-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(bot.status) }}
                ></span>
                <div className="health-indicator">
                  <span className="health-label">Health</span>
                  <span 
                    className="health-value"
                    style={{ color: getHealthColor(bot.health) }}
                  >
                    {bot.health}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bot-summary">
              <div className="bot-metrics">
                <div className="metric-item">
                  <span className="metric-value">{bot.tasksCompleted}</span>
                  <span className="metric-label">Completed</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">{bot.tasksActive}</span>
                  <span className="metric-label">Active</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">
                    {new Date(bot.lastActivity).toLocaleTimeString()}
                  </span>
                  <span className="metric-label">Last Active</span>
                </div>
              </div>
            </div>

            {selectedBot === bot.id && (
              <div className="bot-details">
                <div className="specialization-section">
                  <h4>Specialization</h4>
                  <div className="specialization-list">
                    {bot.specialization.map((spec, index) => (
                      <span key={index} className="specialization-tag">{spec}</span>
                    ))}
                  </div>
                </div>

                <div className="tasks-section">
                  <h4>Current Tasks ({bot.currentTasks.length})</h4>
                  <div className="tasks-list">
                    {bot.currentTasks.map(task => (
                      <div key={task.id} className="task-item">
                        <span 
                          className="task-icon"
                          style={{ color: getPriorityColor(task.priority) }}
                        >
                          {getTaskStatusIcon(task.status)}
                        </span>
                        <span className="task-text">{task.text}</span>
                        <span 
                          className="task-priority"
                          style={{ 
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white'
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="metrics-section">
                  <h4>Performance Metrics</h4>
                  <div className="metrics-grid">
                    {Object.entries(bot.metrics).map(([key, value]) => (
                      <div key={key} className="metric-detail">
                        <span className="metric-name">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="metric-detail-value">
                          {typeof value === 'number' && value < 10 ? `${value}h` : 
                           typeof value === 'number' && value > 100 ? value : `${value}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="coordination-actions">
        <div className="actions-header">
          <h3>Squad Actions</h3>
        </div>
        <div className="actions-grid">
          <button 
            className="action-btn primary"
            disabled={actionLoading.daily_standup}
            onClick={() => executeAction('daily_standup')}
          >
            {actionLoading.daily_standup ? 'Executing...' : 'Execute Daily Standup'}
          </button>
          <button 
            className="action-btn secondary"
            disabled={actionLoading.sync_status}
            onClick={() => executeAction('sync_status')}
          >
            {actionLoading.sync_status ? 'Syncing...' : 'Sync All Bots Status'}
          </button>
          <button 
            className="action-btn secondary"
            disabled={actionLoading.generate_report}
            onClick={() => executeAction('generate_report')}
          >
            {actionLoading.generate_report ? 'Generating...' : 'Generate Squad Report'}
          </button>
          <button 
            className="action-btn warning"
            disabled={actionLoading.emergency_escalation}
            onClick={() => executeAction('emergency_escalation', {
              issue_type: 'manual_test',
              description: 'Manual emergency escalation test',
              severity: 'high'
            })}
          >
            {actionLoading.emergency_escalation ? 'Escalating...' : 'Emergency Escalation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotsCoordination;