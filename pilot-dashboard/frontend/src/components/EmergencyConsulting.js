import React, { useState, useEffect } from 'react';
import './EmergencyConsulting.css';

const EmergencyConsulting = () => {
  const [mission, setMission] = useState(null);
  const [leads, setLeads] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [systemStatus, setSystemStatus] = useState({});

  useEffect(() => {
    fetchMissionStatus();
    fetchLeads();
    fetchSessions();
    fetchSystemStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMissionStatus();
      fetchLeads();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMissionStatus = async () => {
    try {
      const response = await fetch('/api/emergency-consulting/status');
      const data = await response.json();
      setMission(data);
      setRevenue(data.revenue || 0);
    } catch (error) {
      console.error('Failed to fetch mission status:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/emergency-consulting/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/emergency-consulting/sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/emergency-consulting/systems');
      const data = await response.json();
      setSystemStatus(data);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  const startMonitoring = async () => {
    try {
      setIsMonitoring(true);
      const response = await fetch('/api/emergency-consulting/start-monitoring', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Monitoring démarré avec succès !');
        fetchSystemStatus();
      } else {
        alert('Erreur lors du démarrage: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      alert('Erreur lors du démarrage du monitoring');
    } finally {
      setIsMonitoring(false);
    }
  };

  const contactLead = async (leadId) => {
    try {
      const response = await fetch(`/api/emergency-consulting/contact-lead/${leadId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Lead contacté avec succès !');
        fetchLeads();
      } else {
        alert('Erreur lors du contact: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to contact lead:', error);
    }
  };

  const createSession = async (leadId) => {
    try {
      const response = await fetch('/api/emergency-consulting/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leadId })
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`Session créée ! Payment link: ${data.paymentLink}`);
        fetchSessions();
        fetchMissionStatus();
      } else {
        alert('Erreur création session: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const getRevenueProgress = () => {
    const min = 400;
    const max = 600;
    const percentage = (revenue / max) * 100;
    return { percentage: Math.min(percentage, 100), min, max };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const progress = getRevenueProgress();

  return (
    <div className="emergency-consulting">
      <div className="header">
        <h1>Emergency Consulting - Jour 1</h1>
        <div className="mission-info">
          <div className="objective">
            <span>Objectif: €400-€600</span>
            <span>Deadline: {new Date().toLocaleDateString()} 21h00</span>
          </div>
        </div>
      </div>

      {/* Revenue Progress */}
      <div className="revenue-section">
        <div className="revenue-card">
          <h3>Revenue Aujourd'hui</h3>
          <div className="revenue-display">
            <span className="amount">€{revenue}</span>
            <span className="target">/ €{progress.max}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {progress.percentage.toFixed(0)}% de l'objectif atteint
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="systems-section">
        <h3>Status des Systèmes</h3>
        <div className="systems-grid">
          {Object.entries(systemStatus).map(([system, status]) => (
            <div key={system} className="system-card">
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(status.status) }}
              ></div>
              <div className="system-info">
                <span className="system-name">{system.replace(/-/g, ' ')}</span>
                <span className="system-status">{status.status}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="monitoring-controls">
          <button 
            className="btn-primary"
            onClick={startMonitoring}
            disabled={isMonitoring}
          >
            {isMonitoring ? 'Démarrage...' : 'Démarrer Monitoring'}
          </button>
        </div>
      </div>

      {/* Leads Management */}
      <div className="leads-section">
        <h3>Leads API Crisis ({leads.length})</h3>
        <div className="leads-list">
          {leads.map((lead) => (
            <div key={lead.id} className={`lead-card priority-${lead.priority?.toLowerCase()}`}>
              <div className="lead-header">
                <div className="lead-info">
                  <h4>{lead.source} - {lead.type}</h4>
                  <span className="priority">{lead.priority}</span>
                </div>
                <div className="lead-value">€{lead.estimated_value}</div>
              </div>
              
              <div className="lead-details">
                <p><strong>Message:</strong> {lead.message}</p>
                <p><strong>Contact:</strong> {lead.contact_method}</p>
                <p><strong>Deadline:</strong> {new Date(lead.deadline).toLocaleString()}</p>
              </div>
              
              <div className="lead-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => contactLead(lead.id)}
                  disabled={lead.status === 'contacted'}
                >
                  {lead.status === 'contacted' ? '📧 Contacté' : '📞 Contacter'}
                </button>
                
                {lead.status === 'contacted' && (
                  <button 
                    className="btn-success"
                    onClick={() => createSession(lead.id)}
                  >
                    💰 Créer Session
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {leads.length === 0 && (
            <div className="empty-state">
              <p>Aucun lead détecté pour le moment</p>
              <p>Le système surveille Twitter, GitHub et LinkedIn...</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="sessions-section">
        <h3>Sessions Consulting ({sessions.length})</h3>
        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session.id} className={`session-card status-${session.status}`}>
              <div className="session-header">
                <div className="session-info">
                  <h4>{session.client_name} - {session.crisis_type}</h4>
                  <span className="session-time">{new Date(session.scheduled_time).toLocaleString()}</span>
                </div>
                <div className="session-value">
                  <span className="rate">€{session.rate_per_hour}/h</span>
                  <span className="total">Total: €{session.total_amount}</span>
                </div>
              </div>
              
              <div className="session-status">
                <span className={`status-badge ${session.payment_status}`}>
                  {session.payment_status === 'upfront_paid' ? '50% Payé' : 
                   session.payment_status === 'fully_paid' ? 'Payé Complet' : 
                   'En attente paiement'}
                </span>
              </div>
              
              {session.zoom_link && (
                <div className="session-actions">
                  <a 
                    href={session.zoom_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    🎥 Rejoindre Zoom
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h3>Actions Rapides</h3>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => fetchLeads()}>
            Refresh Leads
          </button>
          <button className="action-btn" onClick={() => window.open('https://twitter.com/search?q=API%20down', '_blank')}>
            📱 Vérifier Twitter
          </button>
          <button className="action-btn" onClick={() => window.open('https://github.com/search?q=api+issues&type=issues', '_blank')}>
            🐙 Vérifier GitHub
          </button>
          <button className="action-btn" onClick={() => window.open('https://linkedin.com', '_blank')}>
            💼 LinkedIn Outreach
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyConsulting;