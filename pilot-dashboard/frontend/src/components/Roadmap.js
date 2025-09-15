import React, { useState, useEffect } from 'react';
import './Roadmap.css';

const Roadmap = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    try {
      // Simulated roadmap data - à remplacer par API call
      const mockData = {
        challenge: {
          start_date: "2025-09-03",
          end_date: "2025-09-10",
          target_revenue: 7500,
          current_day: 1
        },
        daily_milestones: [
          {
            day: 1,
            date: "2025-09-03",
            focus: "Setup + Outreach Blitz",
            targets: [
              "API Audits: 2 bookings secured",
              "Affiliation: 75 articles published",
              "Emergency Consulting: 5 leads qualified",
              "Daily target: €1,071"
            ],
            status: "in_progress"
          },
          {
            day: 2,
            date: "2025-09-04", 
            focus: "Delivery + Amplification",
            targets: [
              "API Audits: 2 delivered + upsells",
              "Affiliation: Viral content distribution",
              "Emergency Consulting: 1-2 sessions delivered",
              "Daily target: €1,071"
            ],
            status: "pending"
          },
          {
            day: 3,
            date: "2025-09-05",
            focus: "Cross-selling + Optimization",
            targets: [
              "Founding Members: 1-2 conversions",
              "Done-for-You: 1 client scoping",
              "Technical Writing: High-value content",
              "Daily target: €1,071"
            ],
            status: "pending"
          },
          {
            day: 4,
            date: "2025-09-06",
            focus: "Scaling + Performance",
            targets: [
              "All business lines active",
              "Cross-pollinisation optimization",
              "Performance analytics review",
              "Daily target: €1,071"
            ],
            status: "pending"
          },
          {
            day: 5,
            date: "2025-09-07",
            focus: "Momentum + Partnerships",
            targets: [
              "Affiliate partnerships premium",
              "Case studies from delivered work",
              "Founding members upsell campaign",
              "Daily target: €1,071"
            ],
            status: "pending"
          },
          {
            day: 6,
            date: "2025-09-08",
            focus: "Acceleration + Quality",
            targets: [
              "Quality delivery all services",
              "Viral content amplification",
              "Emergency opportunities capture",
              "Daily target: €1,071"
            ],
            status: "pending"
          },
          {
            day: 7,
            date: "2025-09-09",
            focus: "Sprint Final + Analysis",
            targets: [
              "Final conversions push",
              "Success metrics analysis",
              "Scaling strategy preparation",
              "Daily target: €1,071"
            ],
            status: "pending"
          }
        ],
        business_lines: [
          {
            id: 1,
            name: "API Audits",
            priority: "HIGH",
            target_revenue: 1250,
            timeline: "J1-J7",
            key_activities: ["LinkedIn outreach", "Audit delivery", "Upsell to founding"]
          },
          {
            id: 2,
            name: "Emergency Consulting", 
            priority: "HIGH",
            target_revenue: 1500,
            timeline: "J1-J7",
            key_activities: ["Crisis response", "24-48h delivery", "Premium pricing"]
          },
          {
            id: 3,
            name: "Affiliation Ecosystem",
            priority: "MEDIUM",
            target_revenue: 2500,
            timeline: "J1-J7",
            key_activities: ["Content automation", "Viral distribution", "Cross-selling"]
          },
          {
            id: 4,
            name: "Technical Writing",
            priority: "MEDIUM", 
            target_revenue: 750,
            timeline: "J2-J7",
            key_activities: ["High-value content", "Affiliate integration", "Thought leadership"]
          },
          {
            id: 5,
            name: "API Troubleshooting",
            priority: "LOW",
            target_revenue: 750,
            timeline: "J3-J7",
            key_activities: ["Emergency fixes", "Client retention", "Upsell opportunities"]
          },
          {
            id: 6,
            name: "Done-for-You",
            priority: "LOW",
            target_revenue: 1000,
            timeline: "J4-J7",
            key_activities: ["48h delivery", "High-ticket sales", "Enterprise focus"]
          },
          {
            id: 7,
            name: "Founding Members",
            priority: "HIGH",
            target_revenue: 2500,
            timeline: "J1-J7",
            key_activities: ["Upsell from services", "Premium positioning", "Exclusive access"]
          }
        ]
      };
      
      setRoadmapData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch roadmap data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="roadmap-loading">Chargement de la roadmap...</div>;
  }

  const getDayStatus = (day) => {
    if (day < roadmapData.challenge.current_day) return 'completed';
    if (day === roadmapData.challenge.current_day) return 'active';
    return 'pending';
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <h1>Business Plan Challenge - Roadmap 7 Jours</h1>
        <div className="challenge-overview">
          <div className="challenge-stat">
            <span className="stat-label">Jour Actuel</span>
            <span className="stat-value">{roadmapData.challenge.current_day}/7</span>
          </div>
          <div className="challenge-stat">
            <span className="stat-label">Target Total</span>
            <span className="stat-value">€{roadmapData.challenge.target_revenue.toLocaleString()}</span>
          </div>
          <div className="challenge-stat">
            <span className="stat-label">Target Quotidien</span>
            <span className="stat-value">€{Math.round(roadmapData.challenge.target_revenue / 7).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="roadmap-content">
        <section className="daily-timeline">
          <h2>Timeline Quotidienne</h2>
          <div className="timeline">
            {roadmapData.daily_milestones.map((milestone) => (
              <div key={milestone.day} className={`timeline-item ${getDayStatus(milestone.day)}`}>
                <div className="timeline-marker">
                  <span className="day-number">J{milestone.day}</span>
                </div>
                <div className="timeline-content">
                  <div className="milestone-header">
                    <h3>{milestone.focus}</h3>
                    <span className="milestone-date">{milestone.date}</span>
                  </div>
                  <ul className="milestone-targets">
                    {milestone.targets.map((target, index) => (
                      <li key={index}>{target}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="business-lines-overview">
          <h2>Business Lines - Vue d'Ensemble</h2>
          <div className="business-lines-grid">
            {roadmapData.business_lines.map((line) => (
              <div key={line.id} className="business-line-card">
                <div className="business-line-header">
                  <h3>{line.name}</h3>
                  <span className={`priority-badge ${getPriorityClass(line.priority)}`}>
                    {line.priority}
                  </span>
                </div>
                <div className="business-line-stats">
                  <div className="stat">
                    <span className="stat-label">Target</span>
                    <span className="stat-value">€{line.target_revenue}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Timeline</span>
                    <span className="stat-value">{line.timeline}</span>
                  </div>
                </div>
                <div className="key-activities">
                  <h4>Activités Clés</h4>
                  <ul>
                    {line.key_activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cross-pollinisation">
          <h2>Cross-Pollinisation Strategy</h2>
          <div className="synergy-map">
            <div className="synergy-flow">
              <div className="synergy-node">API Audits</div>
              <div className="synergy-arrow">→</div>
              <div className="synergy-node">Affiliate Tools</div>
              <div className="synergy-arrow">→</div>
              <div className="synergy-node">Founding Members</div>
            </div>
            <div className="synergy-flow">
              <div className="synergy-node">Emergency Consulting</div>
              <div className="synergy-arrow">→</div>
              <div className="synergy-node">Premium Tools</div>
              <div className="synergy-arrow">→</div>
              <div className="synergy-node">Done-for-You</div>
            </div>
            <div className="synergy-flow">
              <div className="synergy-node">Technical Writing</div>
              <div className="synergy-arrow">→</div>
              <div className="synergy-node">Viral Content</div>
              <div className="synergy-arrow">→</div>
              <div className="synergy-node">Lead Generation</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Roadmap;