import React, { useState, useEffect } from 'react';
import './Mindset.css';

const Mindset = () => {
  const [mindsetData, setMindsetData] = useState(null);
  const [activeGuardrail, setActiveGuardrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMindsetData();
  }, []);

  const fetchMindsetData = async () => {
    try {
      // Simulated mindset data - à remplacer par API call
      const mockData = {
        core_principles: [
          {
            id: 1,
            title: "Passive Income First",
            description: "Prioriser les systèmes qui génèrent des revenus sans intervention constante",
            icon: "💰",
            status: "active",
            details: [
              "Automation content 80% + validation humaine 20%",
              "Newsletter ecosystem = machine à revenus passifs", 
              "Cross-selling automatique entre 87 domaines",
              "GUARDRAILS pour scaling sans effort"
            ]
          },
          {
            id: 2,
            title: "Cross-Pollinisation Strategy",
            description: "Maximiser les synergies entre toutes les business lines",
            icon: "🔄",
            status: "active",
            details: [
              "API Audits → Affiliate Tools → Founding Members",
              "Emergency Consulting → Premium Tools → Done-for-You",
              "Technical Writing → Viral Content → Lead Generation",
              "Portfolio effect = compensation des échecs"
            ]
          },
          {
            id: 3,
            title: "Realistic Probabilistic Thinking",
            description: "Toujours challenger les projections optimistes avec des données réelles",
            icon: "📊",
            status: "active",
            details: [
              "Jamais de ROI fantaisiste (ex: €748K basé sur 15% conversion)",
              "Toujours inclure fourchettes min-max réalistes",
              "Séparer lead generation et revenue generation",
              "Prévoir scenarios pessimiste/réaliste/optimiste"
            ]
          },
          {
            id: 4,
            title: "Quality Over Quantity",
            description: "Mieux vaut 3 clients satisfaits que 10 clients déçus",
            icon: "⭐",
            status: "active",
            details: [
              "Satisfaction client 9/10 minimum sur tous les services",
              "Delivery excellence = reputation = bouche-à-oreille",
              "Qualité du contenu = autorité = conversions higher",
              "Brand OnlyOneAPI premium = pricing premium"
            ]
          }
        ],
        guardrails: [
          {
            id: 1,
            category: "Revenue Projections",
            rules: [
              "❌ Jamais de projections basées sur conversion rates >8% sans preuve",
              "❌ Jamais mélanger giveaway engagement et purchase intent", 
              "❌ Jamais oublier le sales cycle B2B (semaines, pas heures)",
              "✅ Toujours partir de données réelles observées",
              "✅ Toujours inclure scenarios pessimiste/réaliste/optimiste"
            ],
            status: "critical"
          },
          {
            id: 2,
            category: "Service Delivery",
            rules: [
              "❌ Jamais promettre sans certitude de delivery",
              "❌ Jamais under-deliver vs promesses clients",
              "❌ Jamais sacrifier qualité pour speed",
              "✅ Toujours over-deliver vs expectations",
              "✅ Toujours demander feedback post-delivery"
            ],
            status: "critical"
          },
          {
            id: 3,
            category: "Resource Management", 
            rules: [
              "❌ Jamais se disperser sur trop d'opportunités simultanément",
              "❌ Jamais ignorer les contraintes temps/ressources",
              "❌ Jamais optimiser pour metrics vanité vs revenue",
              "✅ Toujours prioriser based on ROI potential",
              "✅ Toujours garder 20% buffer pour opportunités"
            ],
            status: "warning"
          },
          {
            id: 4,
            category: "Brand & Compliance",
            rules: [
              "❌ Jamais compromettre brand OnlyOneAPI pour short-term gains",
              "❌ Jamais utiliser vocabulaire non-professionnel (mokes, keums, etc.)",
              "❌ Jamais faire promesses légalement questionnables",
              "✅ Toujours maintenir professionnalisme B2B premium",
              "✅ Toujours respecter compliance légale/éthique"
            ],
            status: "critical"
          }
        ],
        daily_reminders: [
          {
            time: "09:00",
            message: "Morning Check: Quelles sont les 3 actions highest ROI aujourd'hui ?",
            type: "focus"
          },
          {
            time: "12:00", 
            message: "Midday Reality Check: Sommes-nous on track pour daily target €1,071 ?",
            type: "performance"
          },
          {
            time: "18:00",
            message: "Evening Review: Qu'avons-nous appris aujourd'hui ? Optimisations pour demain ?",
            type: "learning"
          }
        ],
        success_mantras: [
          "Execution beats perfection",
          "Revenue beats vanity metrics", 
          "Quality beats quantity",
          "Systems beat manual work",
          "Data beats assumptions",
          "Customer satisfaction beats ego"
        ],
        current_focus: {
          week_theme: "Cross-Pollinisation Maximization",
          daily_mantra: "Portfolio approach + realistic expectations",
          priority_reminder: "€7,500 target = €1,071/jour realistic execution"
        }
      };

      setMindsetData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch mindset data:', error);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'active': 'status-active',
      'critical': 'status-critical',
      'warning': 'status-warning'
    };
    return statusClasses[status] || 'status-default';
  };

  const getReminderIcon = (type) => {
    const icons = {
      'focus': '🎯',
      'performance': '📊',
      'learning': '💡'
    };
    return icons[type] || '📋';
  };

  if (loading) {
    return <div className="mindset-loading">Chargement Mindset Guardrails...</div>;
  }

  return (
    <div className="mindset-container">
      <div className="mindset-header">
        <h1>Mindset & Guardrails Strategy</h1>
        <div className="current-focus">
          <div className="focus-card">
            <h3>{mindsetData.current_focus.week_theme}</h3>
            <p>{mindsetData.current_focus.daily_mantra}</p>
            <strong>{mindsetData.current_focus.priority_reminder}</strong>
          </div>
        </div>
      </div>

      <div className="mindset-content">
        {/* Core Principles */}
        <section className="core-principles">
          <h2>Principes Fondamentaux</h2>
          <div className="principles-grid">
            {mindsetData.core_principles.map((principle) => (
              <div key={principle.id} className={`principle-card ${getStatusClass(principle.status)}`}>
                <div className="principle-header">
                  <span className="principle-icon">{principle.icon}</span>
                  <h3>{principle.title}</h3>
                </div>
                <p className="principle-description">{principle.description}</p>
                <ul className="principle-details">
                  {principle.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Guardrails */}
        <section className="guardrails">
          <h2>Guardrails Critiques</h2>
          <div className="guardrails-grid">
            {mindsetData.guardrails.map((guardrail) => (
              <div 
                key={guardrail.id} 
                className={`guardrail-card ${getStatusClass(guardrail.status)}`}
                onClick={() => setActiveGuardrail(activeGuardrail === guardrail.id ? null : guardrail.id)}
              >
                <div className="guardrail-header">
                  <h3>{guardrail.category}</h3>
                  <span className={`guardrail-status ${getStatusClass(guardrail.status)}`}>
                    {guardrail.status}
                  </span>
                </div>
                {activeGuardrail === guardrail.id && (
                  <ul className="guardrail-rules">
                    {guardrail.rules.map((rule, index) => (
                      <li key={index} className={rule.startsWith('❌') ? 'rule-forbidden' : 'rule-required'}>
                        {rule}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Daily Reminders */}
        <section className="daily-reminders">
          <h2>Rappels Quotidiens</h2>
          <div className="reminders-timeline">
            {mindsetData.daily_reminders.map((reminder, index) => (
              <div key={index} className="reminder-item">
                <div className="reminder-time">
                  <span className="reminder-icon">{getReminderIcon(reminder.type)}</span>
                  <span className="time">{reminder.time}</span>
                </div>
                <div className="reminder-message">
                  {reminder.message}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Success Mantras */}
        <section className="success-mantras">
          <h2>Mantras de Succès</h2>
          <div className="mantras-grid">
            {mindsetData.success_mantras.map((mantra, index) => (
              <div key={index} className="mantra-card">
                <span className="mantra-text">{mantra}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="actions-grid">
            <button className="action-btn primary">
              📊 Reality Check Revenue
            </button>
            <button className="action-btn">
              🎯 Focus Reset
            </button>
            <button className="action-btn">
              💡 Optimization Ideas
            </button>
            <button className="action-btn">
              ⚡ Energy Boost
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mindset;