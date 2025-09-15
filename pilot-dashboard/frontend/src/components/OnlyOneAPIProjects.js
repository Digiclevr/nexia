import React, { useState, useEffect } from 'react';
import './OnlyOneAPIProjects.css';

const OnlyOneAPIProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API data for OnlyOneAPI projects
    const projectsData = [
      {
        id: 'api-main',
        name: 'OnlyOneAPI - Main API',
        type: 'API',
        status: 'live',
        endpoints: 423,
        url: 'https://api.onlyoneapi.com',
        localUrl: 'http://localhost:9090',
        health: 99.9,
        description: '423 endpoints déployés en production - Exploit technique majeur !',
        lastUpdate: '2025-09-03T04:45:00Z',
        metrics: {
          requests: '12.5K',
          uptime: '99.9%',
          latency: '45ms'
        }
      },
      {
        id: 'marketing-site',
        name: 'Marketing Website',
        type: 'Website',
        status: 'live',
        url: 'https://onlyoneapi.com',
        localUrl: 'http://localhost:9080',
        health: 100,
        description: 'Site principal OnlyOneAPI avec landing pages',
        lastUpdate: '2025-09-02T16:30:00Z',
        metrics: {
          visitors: '2.1K',
          conversion: '3.2%',
          speed: '95/100'
        }
      },
      {
        id: 'developer-portal',
        name: 'Developer Portal',
        type: 'Website',
        status: 'live',
        url: 'https://developer.onlyoneapi.com',
        localUrl: 'http://localhost:9082',
        health: 100,
        description: 'Hub développeur avec docs des 423 endpoints',
        lastUpdate: '2025-09-02T14:20:00Z',
        metrics: {
          users: '850',
          docs_views: '15.2K',
          api_keys: '127'
        }
      },
      {
        id: 'user-portal',
        name: 'User Portal',
        type: 'Website',
        status: 'live',
        url: 'https://portal.onlyoneapi.com',
        localUrl: 'http://localhost:9081',
        health: 100,
        description: 'Dashboard utilisateur + billing + API keys',
        lastUpdate: '2025-09-01T18:45:00Z',
        metrics: {
          active_users: '234',
          api_usage: '89%',
          billing: '€12.4K'
        }
      },
      {
        id: 'community-site',
        name: 'Community Site',
        type: 'Website',
        status: 'live',
        url: 'https://community.onlyoneapi.com',
        localUrl: 'http://localhost:9083',
        health: 100,
        description: 'Forum communauté + newsletter + support',
        lastUpdate: '2025-08-31T20:15:00Z',
        metrics: {
          members: '1.2K',
          posts: '456',
          engagement: '78%'
        }
      },
      {
        id: 'kvibe-marketing',
        name: 'Kvibe Marketing Suite',
        type: 'Marketing',
        status: 'active',
        url: 'https://kvibe.onlyoneapi.com',
        localUrl: 'http://localhost:5004',
        health: 95,
        description: 'Suite marketing automation pour OnlyOneAPI',
        lastUpdate: '2025-09-02T22:30:00Z',
        metrics: {
          campaigns: '12',
          leads: '3.4K',
          conversion: '4.7%'
        }
      }
    ];

    setTimeout(() => {
      setProjects(projectsData);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return '#10b981';
      case 'active': return '#3b82f6';
      case 'maintenance': return '#f59e0b';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 99) return '#10b981';
    if (health >= 95) return '#3b82f6';
    if (health >= 90) return '#f59e0b';
    return '#ef4444';
  };

  const openInSafari = (url) => {
    // For development, we'll just open the URL
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="onlyoneapi-projects loading-container">
        <div className="loading-spinner"></div>
        <p>Loading OnlyOneAPI projects...</p>
      </div>
    );
  }

  return (
    <div className="onlyoneapi-projects">
      <div className="section-header">
        <h2 className="section-title">OnlyOneAPI Ecosystem</h2>
        <div className="section-stats">
          <span className="stat-item">
            <span className="stat-value">{projects.length}</span>
            <span className="stat-label">Projects</span>
          </span>
          <span className="stat-item">
            <span className="stat-value">423</span>
            <span className="stat-label">API Endpoints</span>
          </span>
          <span className="stat-item highlight">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Uptime</span>
          </span>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <div className="project-info">
                <h3 className="project-name">{project.name}</h3>
                <span className="project-type">{project.type}</span>
              </div>
              <div 
                className="project-status"
                style={{ color: getStatusColor(project.status) }}
              >
                <span className="status-dot" style={{ backgroundColor: getStatusColor(project.status) }}></span>
                {project.status}
              </div>
            </div>

            <p className="project-description">{project.description}</p>

            {project.endpoints && (
              <div className="project-highlight">
                <span className="highlight-value">{project.endpoints}</span>
                <span className="highlight-label">API Endpoints</span>
              </div>
            )}

            <div className="project-metrics">
              {Object.entries(project.metrics).map(([key, value]) => (
                <div key={key} className="metric">
                  <span className="metric-value">{value}</span>
                  <span className="metric-label">{key.replace('_', ' ')}</span>
                </div>
              ))}
            </div>

            <div className="project-health">
              <div className="health-label">Health</div>
              <div className="health-bar">
                <div 
                  className="health-fill"
                  style={{ 
                    width: `${project.health}%`,
                    backgroundColor: getHealthColor(project.health)
                  }}
                ></div>
              </div>
              <span className="health-value" style={{ color: getHealthColor(project.health) }}>
                {project.health}%
              </span>
            </div>

            <div className="project-actions">
              <button 
                className="action-btn primary"
                onClick={() => openInSafari(project.url)}
                title="Open production in Safari"
              >
                <span className="btn-icon">🌐</span>
                Production
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => openInSafari(project.localUrl)}
                title="Open localhost in Safari"
              >
                <span className="btn-icon">💻</span>
                Local
              </button>
            </div>

            <div className="project-footer">
              <span className="last-update">
                Updated: {new Date(project.lastUpdate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="projects-summary">
        <div className="summary-card">
          <h3>🚀 Major Achievement</h3>
          <p><strong>423 API Endpoints</strong> deployed in production - Technical milestone reached!</p>
          <p>From 271 to 423 endpoints (+152) in continuous optimization.</p>
        </div>
        <div className="summary-card">
          <h3>📊 Infrastructure Status</h3>
          <p><strong>All systems operational</strong> with 99.9%+ uptime across the ecosystem.</p>
          <p>Hybrid architecture: Frontend (Kinsta US) + Backend (DigitalOcean EU)</p>
        </div>
        <div className="summary-card">
          <h3>📈 Business Metrics</h3>
          <p><strong>Growing user base:</strong> 234 active users, €12.4K monthly billing.</p>
          <p>Developer adoption: 850 developers, 127 API keys generated.</p>
        </div>
      </div>
    </div>
  );
};

export default OnlyOneAPIProjects;