import React from 'react';
import BusinessPlanTracker from './BusinessPlanTracker';
import CrossSessionsMonitor from './CrossSessionsMonitor';
import './NextStep.css';

const NextStep = ({ metrics, agents, activity }) => {
  if (!metrics) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading NEXTSTEP...
      </div>
    );
  }

  const progressPercentage = metrics.progress_percent || 0;
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalAgents = agents.length;


  return (
    <div className="nextstep" style={{ background: '#f9fafb' }}>
      <div className="nextstep-header" style={{ 
        background: 'linear-gradient(135deg, #0050A5 0%, #2680EB 100%)',
        boxShadow: '0 10px 25px rgba(0, 80, 165, 0.3)'
      }}>
        <h1 className="nextstep-title">Business Challenge Dashboard</h1>
        <div className="nextstep-subtitle">
          Day {metrics.day || 1} - NEXTSTEP Coordination Center
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
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

        <div className="metric-card leads">
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

        <div className="metric-card bookings">
          <div className="metric-value">{metrics.bookings_confirmed || 0}</div>
          <div className="metric-label">Bookings</div>
          <div className="metric-change">
            Conversion: {metrics.conversion_rate || 0}%
          </div>
        </div>

        <div className="metric-card agents">
          <div className="metric-value">{activeAgents}/{totalAgents}</div>
          <div className="metric-label">Active Agents</div>
          <div className="metric-change">
            {totalAgents === 0 ? 'No agents' : `${Math.round((activeAgents / totalAgents) * 100)}% active`}
          </div>
        </div>
      </div>

      {/* Cross-Sessions Monitor */}
      <div style={{ marginBottom: '2rem' }}>
        <CrossSessionsMonitor />
      </div>

      {/* Business Plan Tracker */}
      <div style={{ marginBottom: '2rem' }}>
        <BusinessPlanTracker />
      </div>

      {/* Challenge Progress Summary */}
      <div className="challenge-summary card">
        <div className="card-header">
          <h2 className="card-title">7-Day Challenge Progress</h2>
        </div>
        <div className="card-content">
          <div className="challenge-stats">
            <div className="challenge-stat">
              <span className="stat-value">Day {metrics.day || 1}</span>
              <span className="stat-label">Current Day</span>
            </div>
            <div className="challenge-stat">
              <span className="stat-value">{progressPercentage.toFixed(1)}%</span>
              <span className="stat-label">Progress</span>
            </div>
            <div className="challenge-stat">
              <span className="stat-value">€{(25000 - (metrics.current_revenue || 0)).toLocaleString()}</span>
              <span className="stat-label">Remaining</span>
            </div>
          </div>
          <div className="challenge-target">
            <strong>Target: €25,000 in 7 days</strong>
            <div>Current: €{(metrics.current_revenue || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStep;