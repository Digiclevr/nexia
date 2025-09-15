import React, { useState, useEffect } from 'react';

const BusinessPlanTracker = () => {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);
  const [newRevenue, setNewRevenue] = useState({
    amount: '',
    client_name: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, summaryRes] = await Promise.all([
        fetch('/api/business-activities'),
        fetch('/api/business-activities/summary/overview')
      ]);

      const [activitiesData, summaryData] = await Promise.all([
        activitiesRes.json(),
        summaryRes.json()
      ]);

      setActivities(activitiesData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch business plan data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRevenue = async () => {
    if (!selectedActivity || !newRevenue.amount) return;

    try {
      const response = await fetch(`/api/business-activities/${selectedActivity.id}/revenue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(newRevenue.amount),
          client_name: newRevenue.client_name,
          notes: newRevenue.notes
        })
      });

      if (response.ok) {
        setShowAddRevenueModal(false);
        setNewRevenue({ amount: '', client_name: '', notes: '' });
        setSelectedActivity(null);
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to add revenue:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: '#10b981', // Green - Highest priority
      2: '#22c55e',
      3: '#84cc16',
      4: '#eab308', // Yellow - Medium priority
      5: '#f59e0b',
      6: '#ef4444', // Red - Lower priority
      7: '#dc2626'
    };
    return colors[priority] || '#64748b';
  };

  const getProbabilityBadge = (score) => {
    if (score >= 8) return { color: '#10b981', label: 'Very High' };
    if (score >= 7) return { color: '#84cc16', label: 'High' };
    if (score >= 6) return { color: '#eab308', label: 'Medium' };
    if (score >= 5) return { color: '#f59e0b', label: 'Low' };
    return { color: '#ef4444', label: 'Very Low' };
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading business plan...
      </div>
    );
  }

  return (
    <div className="business-plan-tracker">
      {/* Summary Cards */}
      {summary && (
        <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
          <div className="metric-card">
            <div className="metric-value">€{summary.total_current_revenue.toLocaleString()}</div>
            <div className="metric-label">Current Revenue</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(summary.overall_completion_percentage, 100)}%` }}
              ></div>
            </div>
            <div className="metric-change">
              Target: €{summary.total_target_min.toLocaleString()} - €{summary.total_target_max.toLocaleString()}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">{summary.active_activities}/{summary.total_activities}</div>
            <div className="metric-label">Active Activities</div>
            <div className="metric-change">
              {summary.overall_completion_percentage.toFixed(1)}% Complete
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">{summary.avg_probability.toFixed(1)}/10</div>
            <div className="metric-label">Avg Probability</div>
            <div className="metric-change">
              Weighted Success Rate
            </div>
          </div>
        </div>
      )}

      {/* Activities Grid */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Business Plan Activities - 7 Day Challenge</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {activities.map(activity => {
              const probabilityBadge = getProbabilityBadge(activity.probability_score);
              const revenueCompletion = activity.target_revenue_max > 0 
                ? (activity.current_revenue / activity.target_revenue_max * 100) 
                : 0;
              const volumeCompletion = activity.target_volume > 0
                ? (activity.current_volume / activity.target_volume * 100)
                : 0;

              return (
                <div 
                  key={activity.id} 
                  className="card"
                  style={{ 
                    border: `3px solid ${getPriorityColor(activity.priority)}`,
                    borderRadius: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div 
                          style={{
                            backgroundColor: getPriorityColor(activity.priority),
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                        >
                          #{activity.priority}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{activity.name}</h3>
                        <div
                          style={{
                            backgroundColor: probabilityBadge.color,
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}
                        >
                          {activity.probability_score}/10 - {probabilityBadge.label}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                        {activity.description}
                      </p>
                    </div>
                    
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowAddRevenueModal(true);
                      }}
                    >
                      + Revenue
                    </button>
                  </div>

                  {/* Progress Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Revenue Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Revenue Progress</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          {revenueCompletion.toFixed(1)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${Math.min(revenueCompletion, 100)}%`,
                            backgroundColor: getPriorityColor(activity.priority)
                          }}
                        ></div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        €{activity.current_revenue.toLocaleString()} / €{activity.target_revenue_min.toLocaleString()}-€{activity.target_revenue_max.toLocaleString()}
                      </div>
                    </div>

                    {/* Volume Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Volume Progress</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          {volumeCompletion.toFixed(1)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${Math.min(volumeCompletion, 100)}%`,
                            backgroundColor: getPriorityColor(activity.priority)
                          }}
                        ></div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {activity.current_volume} / {activity.target_volume} {activity.unit_type}
                      </div>
                    </div>
                  </div>

                  {/* Unit Economics */}
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem', 
                    backgroundColor: 'var(--surface-hover)', 
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    <strong>Unit Economics:</strong> €{activity.unit_price_min.toLocaleString()}{activity.unit_price_min !== activity.unit_price_max ? `-€${activity.unit_price_max.toLocaleString()}` : ''} per {activity.unit_type?.slice(0, -1) || 'unit'} | 
                    <strong> Target:</strong> {activity.target_volume} {activity.unit_type} | 
                    <strong> Status:</strong> {activity.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Revenue Modal */}
      {showAddRevenueModal && selectedActivity && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90vw', margin: '0' }}>
            <div className="card-header">
              <h2 className="card-title">Add Revenue - {selectedActivity.name}</h2>
              <button 
                onClick={() => {
                  setShowAddRevenueModal(false);
                  setSelectedActivity(null);
                  setNewRevenue({ amount: '', client_name: '', notes: '' });
                }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div className="card-content">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Revenue Amount (€)
                </label>
                <input
                  type="number"
                  value={newRevenue.amount}
                  onChange={(e) => setNewRevenue({ ...newRevenue, amount: e.target.value })}
                  placeholder={`e.g., ${selectedActivity.unit_price_min}`}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Client Name (Optional)
                </label>
                <input
                  type="text"
                  value={newRevenue.client_name}
                  onChange={(e) => setNewRevenue({ ...newRevenue, client_name: e.target.value })}
                  placeholder="e.g., TechCorp Inc."
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={newRevenue.notes}
                  onChange={(e) => setNewRevenue({ ...newRevenue, notes: e.target.value })}
                  placeholder="Details about this revenue..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowAddRevenueModal(false);
                    setSelectedActivity(null);
                    setNewRevenue({ amount: '', client_name: '', notes: '' });
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleAddRevenue}
                  disabled={!newRevenue.amount}
                >
                  Add €{newRevenue.amount} Revenue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanTracker;