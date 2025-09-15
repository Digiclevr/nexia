import React, { useState, useEffect } from 'react';
import './BattleRoom.css';

const BattleRoom = () => {
  const [executionData, setExecutionData] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExecutionData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchExecutionData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchExecutionData = async () => {
    try {
      // Simulated execution data - à remplacer par API call
      const mockData = {
        current_session: {
          name: "Morning Blitz Session",
          start_time: "09:00",
          end_time: "12:00",
          focus: "Generation Multi-Lines",
          status: "active",
          progress: 65
        },
        daily_sessions: [
          {
            id: 1,
            name: "Morning Blitz",
            time: "09:00-12:00",
            type: "GENERATION",
            activities: [
              "API Audits outreach (50 CTOs LinkedIn)",
              "Affiliation content (75 articles/jour)",
              "Emergency consulting bookings",
              "Technical writing + affiliate links"
            ],
            status: "active",
            progress: 65,
            revenue_target: 357
          },
          {
            id: 2,
            name: "Delivery Power Hour",
            time: "14:00-17:00", 
            type: "DELIVERY",
            activities: [
              "API audits delivery + tool recommendations",
              "Consulting calls + affiliate upsells",
              "Content viral distribution",
              "Done-for-you scoping + premium tools"
            ],
            status: "pending",
            progress: 0,
            revenue_target: 500
          },
          {
            id: 3,
            name: "Cross-Sell Optimizer",
            time: "18:00-19:00",
            type: "OPTIMIZATION", 
            activities: [
              "Audit clients → Founding members",
              "Content engagement → Consulting bookings", 
              "Emergency fixes → Long-term partnerships",
              "Performance analytics → Next day optimization"
            ],
            status: "pending",
            progress: 0,
            revenue_target: 214
          }
        ],
        live_metrics: {
          current_revenue: 1250,
          daily_target: 1071,
          completion_rate: 117,
          active_leads: 23,
          conversion_rate: 12.5,
          next_milestone: "2 API Audits delivery"
        },
        battle_stats: {
          total_actions: 47,
          completed_actions: 31,
          pending_actions: 16,
          success_rate: 89,
          momentum_score: 8.7
        },
        active_campaigns: [
          {
            name: "LinkedIn CTO Outreach",
            type: "API_AUDITS",
            status: "crushing_it",
            metrics: "31/50 contacts, 8 responses, 3 bookings",
            next_action: "Follow-up warm leads"
          },
          {
            name: "Viral Content Blitz", 
            type: "AFFILIATION",
            status: "on_fire",
            metrics: "75 articles published, 2.3K engagements",
            next_action: "Amplify top performers"
          },
          {
            name: "Emergency Response",
            type: "CONSULTING", 
            status: "ready",
            metrics: "5 qualified leads, 2 calls scheduled",
            next_action: "Deliver consulting sessions"
          },
          {
            name: "Founding Members Hunt",
            type: "UPSELL",
            status: "warming_up",
            metrics: "12 audit clients identified for upsell",
            next_action: "Launch upsell sequence"
          }
        ]
      };

      setExecutionData(mockData);
      setActiveSession(mockData.current_session);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch execution data:', error);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'active': 'status-active',
      'pending': 'status-pending', 
      'completed': 'status-completed',
      'crushing_it': 'status-crushing',
      'on_fire': 'status-fire',
      'ready': 'status-ready',
      'warming_up': 'status-warming'
    };
    return statusClasses[status] || 'status-default';
  };

  const getSessionIcon = (type) => {
    const icons = {
      'GENERATION': '⚡',
      'DELIVERY': '🎯', 
      'OPTIMIZATION': '🔄'
    };
    return icons[type] || '📊';
  };

  if (loading) {
    return <div className="battle-room-loading">Chargement Battle Room...</div>;
  }

  return (
    <div className="battle-room-container">
      <div className="battle-room-header">
        <h1>Battle Room - Execution Center</h1>
        <div className="live-status">
          <div className="pulse-indicator"></div>
          <span>LIVE - Session Active</span>
        </div>
      </div>

      <div className="battle-room-content">
        {/* Live Metrics Dashboard */}
        <section className="live-metrics">
          <div className="metric-card primary">
            <span className="metric-label">Revenue Aujourd'hui</span>
            <span className="metric-value">€{executionData.live_metrics.current_revenue}</span>
            <span className="metric-progress">
              {executionData.live_metrics.completion_rate}% of target
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Active Leads</span>
            <span className="metric-value">{executionData.live_metrics.active_leads}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Conversion Rate</span>
            <span className="metric-value">{executionData.live_metrics.conversion_rate}%</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Momentum Score</span>
            <span className="metric-value">{executionData.battle_stats.momentum_score}/10</span>
          </div>
        </section>

        {/* Active Session */}
        {activeSession && (
          <section className="active-session">
            <h2>Session Active</h2>
            <div className="session-card active-session-card">
              <div className="session-header">
                <h3>{activeSession.name}</h3>
                <span className="session-time">{activeSession.start_time} - {activeSession.end_time}</span>
              </div>
              <div className="session-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${activeSession.progress}%`}}
                  ></div>
                </div>
                <span className="progress-text">{activeSession.progress}% Complete</span>
              </div>
              <div className="session-focus">
                <strong>Focus:</strong> {activeSession.focus}
              </div>
            </div>
          </section>
        )}

        {/* Daily Sessions */}
        <section className="daily-sessions">
          <h2>Sessions du Jour</h2>
          <div className="sessions-grid">
            {executionData.daily_sessions.map((session) => (
              <div key={session.id} className={`session-card ${getStatusClass(session.status)}`}>
                <div className="session-header">
                  <div className="session-icon">{getSessionIcon(session.type)}</div>
                  <h3>{session.name}</h3>
                  <span className="session-time">{session.time}</span>
                </div>
                <div className="session-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${session.progress}%`}}
                    ></div>
                  </div>
                  <span className="progress-text">{session.progress}%</span>
                </div>
                <div className="session-activities">
                  <ul>
                    {session.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
                <div className="session-target">
                  Target: €{session.revenue_target}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Campaigns */}
        <section className="active-campaigns">
          <h2>Campaigns en Cours</h2>
          <div className="campaigns-grid">
            {executionData.active_campaigns.map((campaign, index) => (
              <div key={index} className={`campaign-card ${getStatusClass(campaign.status)}`}>
                <div className="campaign-header">
                  <h3>{campaign.name}</h3>
                  <span className={`campaign-status ${getStatusClass(campaign.status)}`}>
                    {campaign.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="campaign-metrics">
                  <strong>Metrics:</strong> {campaign.metrics}
                </div>
                <div className="campaign-next-action">
                  <strong>Next Action:</strong> {campaign.next_action}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Battle Stats */}
        <section className="battle-stats">
          <h2>Battle Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Actions Totales</span>
              <span className="stat-value">{executionData.battle_stats.total_actions}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Actions Complétées</span>
              <span className="stat-value">{executionData.battle_stats.completed_actions}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Actions Pending</span>
              <span className="stat-value">{executionData.battle_stats.pending_actions}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">{executionData.battle_stats.success_rate}%</span>
            </div>
          </div>
        </section>

        {/* Next Milestone */}
        <section className="next-milestone">
          <h2>Next Milestone</h2>
          <div className="milestone-card">
            <div className="milestone-icon">🎯</div>
            <div className="milestone-text">
              {executionData.live_metrics.next_milestone}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BattleRoom;