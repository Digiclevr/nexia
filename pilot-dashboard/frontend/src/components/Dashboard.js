import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import BusinessPlanTracker from './BusinessPlanTracker';
import CrossSessionsMonitor from './CrossSessionsMonitor';

const Dashboard = ({ metrics, agents, activity }) => {
  if (!metrics) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  const progressPercentage = metrics.progress_percent || 0;
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalAgents = agents.length;

  const getActivityIcon = (status) => {
    switch (status) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  };

  return (
    <div className="dashboard">
      <h1 className="card-title" style={{ marginBottom: '2rem' }}>
        Business Challenge Dashboard - Day {metrics.day || 1}
      </h1>


      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">€{metrics.current_revenue?.toLocaleString() || '0'}</div>
          <div className="metric-label">Revenue Today</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="metric-change">
            Target: €{metrics.target_revenue?.toLocaleString() || '3,571'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{metrics.current_leads || 0}</div>
          <div className="metric-label">Leads Today</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min((metrics.current_leads / metrics.target_leads) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="metric-change">
            Target: {metrics.target_leads || 60} leads
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{metrics.bookings_confirmed || 0}</div>
          <div className="metric-label">Bookings</div>
          <div className="metric-change">
            Conversion: {metrics.conversion_rate || 0}%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{activeAgents}/{totalAgents}</div>
          <div className="metric-label">Active Agents</div>
          <div className="metric-change">
            {totalAgents === 0 ? 'No agents configured' : `${Math.round((activeAgents / totalAgents) * 100)}% active`}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Agents Status */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Agents Status</h2>
          </div>
          <div className="card-content">
            {agents.length === 0 ? (
              <p className="loading">No agents configured yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {agents.slice(0, 5).map(agent => (
                  <div key={agent.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{agent.name}</strong>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {agent.type}
                      </div>
                    </div>
                    <span className={`status ${agent.status}`}>
                      <span className="status-dot"></span>
                      {agent.status}
                    </span>
                  </div>
                ))}
                {agents.length > 5 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    +{agents.length - 5} more agents
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          <div className="card-content">
            {activity.length === 0 ? (
              <p className="loading">No recent activity</p>
            ) : (
              <div className="activity-feed">
                {activity.slice(0, 8).map(item => (
                  <div key={item.id} className="activity-item">
                    <div className={`activity-icon ${item.status}`}>
                      {getActivityIcon(item.status)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-message">
                        <strong>{item.agent_name}</strong>: {item.message}
                      </div>
                      <div className="activity-meta">
                        {item.action} • {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Sessions Monitor */}
      <div style={{ marginTop: '2rem' }}>
        <CrossSessionsMonitor />
      </div>

      {/* Business Plan Tracker */}
      <div style={{ marginTop: '2rem' }}>
        <BusinessPlanTracker />
      </div>

      {/* Challenge Progress */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">7-Day Challenge Progress</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <div key={day} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.375rem', backgroundColor: day <= (metrics.day || 1) ? 'var(--surface-hover)' : 'transparent' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  <span className={`day-status ${day <= (metrics.day || 1) ? 'completed' : 'pending'}`}></span>
                </div>
                <div style={{ fontWeight: '600' }}>Day {day}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  €{day === (metrics.day || 1) ? (metrics.current_revenue || 0).toLocaleString() : '---'}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: '0.375rem', textAlign: 'center' }}>
            <strong>Total Target: €25,000 in 7 days</strong>
            <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              Current: €{(metrics.current_revenue || 0).toLocaleString()} ({progressPercentage.toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;