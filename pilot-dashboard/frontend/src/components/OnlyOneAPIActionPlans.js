import React, { useState, useEffect } from 'react';
import './OnlyOneAPIActionPlans.css';

const OnlyOneAPIActionPlans = () => {
  const [actionPlans, setActionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API data for OnlyOneAPI action plans
    const plansData = [
      {
        id: 'api-v7-production',
        title: 'API V7 Production - 423 Endpoints',
        category: 'API Infrastructure',
        status: 'completed',
        priority: 'critical',
        progress: 100,
        dueDate: '2025-09-03',
        description: '423 endpoints déployés en production avec architecture V7',
        tasks: [
          { id: 1, text: 'Déploiement 423 endpoints', status: 'completed' },
          { id: 2, text: 'Tests production validés', status: 'completed' },
          { id: 3, text: 'Monitoring actif', status: 'completed' },
          { id: 4, text: 'Documentation mise à jour', status: 'completed' }
        ],
        lastUpdate: '2025-09-03T04:45:00Z',
        owner: 'DevOps Team'
      },
      {
        id: 'sites-web-coherence',
        title: 'Cohérence Sites Web Cross-Projets',
        category: 'Web Management',
        status: 'in_progress',
        priority: 'high',
        progress: 75,
        dueDate: '2025-09-05',
        description: 'Harmonisation contenus et branding des 4 sites OnlyOneAPI',
        tasks: [
          { id: 1, text: 'Audit contenus Marketing site', status: 'completed' },
          { id: 2, text: 'Harmonisation Developer portal', status: 'completed' },
          { id: 3, text: 'Mise à jour Portal utilisateur', status: 'in_progress' },
          { id: 4, text: 'Community site final polish', status: 'pending' },
          { id: 5, text: 'Cross-validation branding', status: 'pending' }
        ],
        lastUpdate: '2025-09-02T18:30:00Z',
        owner: 'Content Team'
      },
      {
        id: 'founding-members-campaign',
        title: 'Campagne Founding Members',
        category: 'Marketing',
        status: 'active',
        priority: 'critical',
        progress: 60,
        dueDate: '2025-09-10',
        description: 'Lancement campagne founding members avec exploit 423 endpoints',
        tasks: [
          { id: 1, text: 'Contenu LinkedIn créé', status: 'completed' },
          { id: 2, text: 'Email sequence préparée', status: 'completed' },
          { id: 3, text: 'Landing page founding', status: 'in_progress' },
          { id: 4, text: 'Workflow paiement Stripe', status: 'pending' },
          { id: 5, text: 'Lancement campagnes', status: 'pending' }
        ],
        lastUpdate: '2025-09-03T09:30:00Z',
        owner: 'Marketing Team'
      },
      {
        id: 'infrastructure-optimization',
        title: 'Optimisation Infrastructure K8s',
        category: 'Infrastructure',
        status: 'in_progress',
        priority: 'medium',
        progress: 40,
        dueDate: '2025-09-15',
        description: 'Optimisation cluster DigitalOcean et réduction coûts',
        tasks: [
          { id: 1, text: 'Audit utilisation resources', status: 'completed' },
          { id: 2, text: 'Plan optimisation coûts', status: 'completed' },
          { id: 3, text: 'Mise en place HPA', status: 'in_progress' },
          { id: 4, text: 'Node pool optimization', status: 'pending' },
          { id: 5, text: 'Tests charge', status: 'pending' }
        ],
        lastUpdate: '2025-09-01T16:20:00Z',
        owner: 'Infrastructure Team'
      },
      {
        id: 'business-plan-execution',
        title: 'Business Plan Challenge 7 Jours',
        category: 'Business',
        status: 'active',
        priority: 'high',
        progress: 30,
        dueDate: '2025-09-10',
        description: 'Exécution challenge 7 jours pour €25K revenue',
        tasks: [
          { id: 1, text: 'Dashboard pilotage créé', status: 'completed' },
          { id: 2, text: 'Stratégies définies', status: 'completed' },
          { id: 3, text: 'Campagnes marketing', status: 'in_progress' },
          { id: 4, text: 'API audits services', status: 'pending' },
          { id: 5, text: 'Emergency consulting', status: 'pending' },
          { id: 6, text: 'Done-for-you setup', status: 'pending' }
        ],
        lastUpdate: '2025-09-03T09:00:00Z',
        owner: 'Business Team'
      },
      {
        id: 'documentation-update',
        title: 'Documentation 423 Endpoints',
        category: 'Documentation',
        status: 'in_progress',
        priority: 'medium',
        progress: 80,
        dueDate: '2025-09-07',
        description: 'Mise à jour complète documentation avec nouveaux endpoints',
        tasks: [
          { id: 1, text: 'Auto-génération OpenAPI specs', status: 'completed' },
          { id: 2, text: 'Developer portal update', status: 'completed' },
          { id: 3, text: 'Exemples codes nouveaux endpoints', status: 'in_progress' },
          { id: 4, text: 'Guides intégration', status: 'pending' }
        ],
        lastUpdate: '2025-09-02T20:15:00Z',
        owner: 'DevRel Team'
      }
    ];

    setTimeout(() => {
      setActionPlans(plansData);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'active': return '#3b82f6';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'blocked': return '#ef4444';
      default: return '#6b7280';
    }
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

  const getProgressColor = (progress) => {
    if (progress >= 90) return '#10b981';
    if (progress >= 70) return '#3b82f6';
    if (progress >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getTaskStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in_progress': return '↻';
      case 'pending': return '○';
      case 'blocked': return '✕';
      default: return '○';
    }
  };

  if (loading) {
    return (
      <div className="action-plans loading-container">
        <div className="loading-spinner"></div>
        <p>Loading OnlyOneAPI action plans...</p>
      </div>
    );
  }

  const totalPlans = actionPlans.length;
  const activePlans = actionPlans.filter(plan => plan.status === 'active' || plan.status === 'in_progress').length;
  const avgProgress = Math.round(actionPlans.reduce((sum, plan) => sum + plan.progress, 0) / totalPlans);

  return (
    <div className="action-plans">
      <div className="section-header">
        <h2 className="section-title">OnlyOneAPI Action Plans</h2>
        <div className="section-stats">
          <span className="stat-item">
            <span className="stat-value">{totalPlans}</span>
            <span className="stat-label">Total Plans</span>
          </span>
          <span className="stat-item">
            <span className="stat-value">{activePlans}</span>
            <span className="stat-label">Active</span>
          </span>
          <span className="stat-item highlight">
            <span className="stat-value">{avgProgress}%</span>
            <span className="stat-label">Avg Progress</span>
          </span>
        </div>
      </div>

      <div className="plans-grid">
        {actionPlans.map(plan => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <div className="plan-info">
                <h3 className="plan-title">{plan.title}</h3>
                <span className="plan-category">{plan.category}</span>
              </div>
              <div className="plan-badges">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(plan.priority) }}
                >
                  {plan.priority}
                </span>
                <span 
                  className="status-badge"
                  style={{ color: getStatusColor(plan.status) }}
                >
                  <span className="status-dot" style={{ backgroundColor: getStatusColor(plan.status) }}></span>
                  {plan.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="plan-description">{plan.description}</p>

            <div className="plan-progress">
              <div className="progress-info">
                <span className="progress-label">Progress</span>
                <span className="progress-value" style={{ color: getProgressColor(plan.progress) }}>
                  {plan.progress}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${plan.progress}%`,
                    backgroundColor: getProgressColor(plan.progress)
                  }}
                ></div>
              </div>
            </div>

            <div className="plan-tasks">
              <h4 className="tasks-title">Tasks ({plan.tasks.filter(t => t.status === 'completed').length}/{plan.tasks.length})</h4>
              <div className="tasks-list">
                {plan.tasks.map(task => (
                  <div key={task.id} className={`task-item ${task.status}`}>
                    <span 
                      className="task-icon"
                      style={{ color: getStatusColor(task.status) }}
                    >
                      {getTaskStatusIcon(task.status)}
                    </span>
                    <span className="task-text">{task.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="plan-footer">
              <div className="plan-meta">
                <span className="due-date">
                  Due: {new Date(plan.dueDate).toLocaleDateString()}
                </span>
                <span className="owner">Owner: {plan.owner}</span>
              </div>
              <span className="last-update">
                Updated: {new Date(plan.lastUpdate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OnlyOneAPIActionPlans;