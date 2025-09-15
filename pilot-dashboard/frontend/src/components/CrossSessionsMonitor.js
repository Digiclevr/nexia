import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';

const CrossSessionsMonitor = () => {
  const [sessionsData, setSessionsData] = useState({ sessions: [], global_metrics: {} });
  const [dailyBriefing, setDailyBriefing] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionsData();
    fetchDailyBriefing();
    
    // Set up real-time updates
    const socket = io();
    
    socket.on('session_status_update', (data) => {
      console.log('Session status updated:', data);
      fetchSessionsData();
    });

    socket.on('supervision_alert', (alert) => {
      console.log('Supervision alert:', alert);
      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      
      // Browser notification for critical alerts
      if (alert.urgency === 'high' && 'Notification' in window) {
        new Notification(`OnlyOneAPI Alert: ${alert.session_name}`, {
          body: `${alert.actions?.length || 0} actions required`,
          icon: '/favicon.ico'
        });
      }
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('session_status_update');
      socket.off('supervision_alert');
    };
  }, []);

  const fetchSessionsData = async () => {
    try {
      const response = await fetch('/api/cross-sessions/sessions-overview');
      const data = await response.json();
      setSessionsData(data);
    } catch (error) {
      console.error('Failed to fetch sessions data:', error);
    }
  };

  const fetchDailyBriefing = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cross-sessions/daily-briefing');
      const data = await response.json();
      setDailyBriefing(data);
    } catch (error) {
      console.error('Failed to fetch daily briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      waiting_action: '#f59e0b', 
      blocked: '#ef4444',
      completed: '#6b7280'
    };
    return colors[status] || '#64748b';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: 'active',
      waiting_action: 'waiting',
      blocked: 'blocked',
      completed: 'completed'
    };
    return icons[status] || 'unknown';
  };

  const handleActionCompleted = async (sessionId, actionId) => {
    try {
      await fetch('/api/cross-sessions/action-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          action_id: actionId,
          completion_notes: 'Completed via dashboard'
        })
      });
      
      fetchSessionsData();
    } catch (error) {
      console.error('Failed to mark action as completed:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading cross-sessions data...
      </div>
    );
  }

  const { sessions, global_metrics } = sessionsData;

  return (
    <div className="cross-sessions-monitor">
      {/* Alerts Bar */}
      {alerts.length > 0 && (
        <div className="card" style={{ borderLeft: '5px solid #f59e0b', marginBottom: '1rem' }}>
          <div className="card-header">
            <h3 style={{ color: '#f59e0b', margin: 0 }}>Supervision Alerts</h3>
            <button 
              className="btn btn-small btn-secondary"
              onClick={() => setAlerts([])}
            >
              Clear All
            </button>
          </div>
          <div className="card-content">
            {alerts.slice(0, 3).map((alert, index) => (
              <div key={index} style={{
                padding: '0.75rem',
                backgroundColor: alert.urgency === 'high' ? '#fef2f2' : '#fef3c7',
                borderRadius: '0.375rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{alert.session_name}</strong> - {alert.type.replace('_', ' ')}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                  </span>
                </div>
                {alert.actions && alert.actions.length > 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    {alert.actions.length} action(s) required
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Metrics */}
      <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-value">{global_metrics.total_sessions || 0}</div>
          <div className="metric-label">Total Sessions</div>
          <div className="metric-change">
            {global_metrics.active_sessions || 0} active
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value">€{(global_metrics.total_revenue || 0).toLocaleString()}</div>
          <div className="metric-label">Total Revenue</div>
          <div className="metric-change">
            Cross all sessions
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{global_metrics.waiting_action || 0}</div>
          <div className="metric-label">Waiting Actions</div>
          <div className="metric-change">
            {global_metrics.blocked_sessions || 0} blocked
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{global_metrics.total_alerts || 0}</div>
          <div className="metric-label">Active Alerts</div>
          <div className="metric-change">
            Supervision required
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Sessions Status Overview</h2>
          <button className="btn btn-primary btn-small" onClick={fetchSessionsData}>
            Refresh
          </button>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
            {sessions.map(session => (
              <div 
                key={session.session_id}
                className="card"
                style={{ 
                  border: `2px solid ${getStatusColor(session.status)}`,
                  borderRadius: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`status-indicator ${getStatusIcon(session.status)}`}></span> {session.session_name}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Day {session.day} • Updated {formatDistanceToNow(new Date(session.last_update), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div
                    style={{
                      backgroundColor: getStatusColor(session.status),
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {session.status.replace('_', ' ')}
                  </div>
                </div>

                {/* Session Metrics */}
                {session.metrics && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '1rem', 
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--surface-hover)',
                    borderRadius: '0.375rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue</div>
                      <div style={{ fontWeight: '600' }}>
                        €{(session.metrics.current_revenue || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target</div>
                      <div style={{ fontWeight: '600' }}>
                        €{(session.metrics.target_today || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress */}
                {session.progress && session.progress.day_completion_rate !== undefined && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem' }}>Day Progress</span>
                      <span style={{ fontSize: '0.875rem' }}>{session.progress.day_completion_rate}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${session.progress.day_completion_rate}%`,
                          backgroundColor: getStatusColor(session.status)
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Message */}
                {session.message && (
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-muted)', 
                    fontStyle: 'italic',
                    marginBottom: '1rem'
                  }}>
                    "{session.message}"
                  </div>
                )}

                {/* Actions Required */}
                {session.actions_required && session.actions_required.length > 0 && (
                  <div style={{ 
                    backgroundColor: '#fef3c7', 
                    padding: '0.75rem', 
                    borderRadius: '0.375rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#92400e' }}>
                      Actions Required ({session.actions_required.length})
                    </div>
                    {session.actions_required.map((action, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span>{action.description || action}</span>
                        <button 
                          className="btn btn-small btn-primary"
                          onClick={() => handleActionCompleted(session.session_id, action.id || index)}
                        >
                          Done
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Alerts */}
                {session.alerts && session.alerts.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                    {session.alerts.length} alert(s) active
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Briefing Summary */}
      {dailyBriefing && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h2 className="card-title">Daily Briefing Summary</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4>Performance Today</h4>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                  <div><strong>Revenue:</strong> €{(dailyBriefing.global_status?.daily_performance || 0).toLocaleString()} / €{(dailyBriefing.global_status?.daily_target || 0).toLocaleString()}</div>
                  <div><strong>Active Sessions:</strong> {dailyBriefing.global_status?.active_sessions || 0}/{dailyBriefing.global_status?.total_sessions || 0}</div>
                  <div><strong>Total Revenue:</strong> €{(dailyBriefing.global_status?.total_revenue || 0).toLocaleString()}</div>
                </div>
              </div>
              
              <div>
                <h4>Recommendations</h4>
                <div style={{ fontSize: '0.875rem' }}>
                  {dailyBriefing.recommendations?.length > 0 ? (
                    dailyBriefing.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} style={{ 
                        marginBottom: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: rec.priority === 'high' ? '#fef2f2' : '#f8fafc',
                        borderRadius: '0.25rem'
                      }}>
                        <strong>{rec.type?.replace('_', ' ')}:</strong> {rec.message}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>No critical recommendations</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossSessionsMonitor;