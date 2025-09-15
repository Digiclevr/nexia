import React from 'react';
import OnlyOneAPIActionPlans from './OnlyOneAPIActionPlans';
import './OnlyOneAPI.css';

const OnlyOneAPI = () => {
  return (
    <div className="onlyoneapi-page">
      <div className="page-header">
        <h1 className="page-title">OnlyOneAPI Coordination Center</h1>
        <div className="page-subtitle">
          Gestion globale des projets OnlyOneAPI - Sites web, API, Marketing & Cohérence contenus
        </div>
      </div>

      {/* Summary Cards - Remontées en haut */}
      <div className="summary-top">
        <div className="summary-card urgent">
          <h3>🚨 Actions Urgentes</h3>
          <ul>
            <li><strong>Landing page founding members</strong> - Finaliser pour campagne</li>
            <li><strong>Workflow paiement Stripe</strong> - Intégrer pour conversions</li>
            <li><strong>Community site polish</strong> - Cohérence branding finale</li>
          </ul>
        </div>
        <div className="summary-card progress">
          <h3>📈 Progrès Global</h3>
          <p><strong>API Infrastructure:</strong> 100% - 423 endpoints déployés ✅</p>
          <p><strong>Marketing Campaign:</strong> 60% - Contenu prêt, lancement imminent</p>
          <p><strong>Web Coherence:</strong> 75% - Sites harmonisés, finitions en cours</p>
        </div>
        <div className="summary-card coordination">
          <h3>🎯 Coordination</h3>
          <p><strong>Cross-team alignment:</strong> Marketing ↔ DevOps ↔ Content</p>
          <p><strong>Business priority:</strong> Founding members campaign active</p>
          <p><strong>Technical stability:</strong> 423 endpoints production-ready</p>
        </div>
      </div>

      <OnlyOneAPIActionPlans />
    </div>
  );
};

export default OnlyOneAPI;