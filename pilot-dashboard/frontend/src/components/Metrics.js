import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Metrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);
  const [progress, setProgress] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple endpoints in parallel
      const [metricsRes, revenueRes, progressRes, performanceRes] = await Promise.all([
        fetch('/api/metrics/history?days=7'),
        fetch('/api/dashboard/revenue'),
        fetch('/api/dashboard/progress'),
        fetch('/api/metrics/performance')
      ]);

      const [metricsData, revenueData, progressData, performanceData] = await Promise.all([
        metricsRes.json(),
        revenueRes.json(),
        progressRes.json(),
        performanceRes.json()
      ]);

      setMetrics(metricsData);
      setRevenueBreakdown(revenueData.breakdown || []);
      setProgress(progressData.progress || []);
      setPerformance(performanceData);

    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRevenue = async () => {
    const source = prompt('Revenue source (audit/consulting/founding_member):');
    const amount = prompt('Amount (€):');
    const clientName = prompt('Client name (optional):');

    if (!source || !amount) return;

    try {
      const response = await fetch('/api/metrics/revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source,
          amount: parseFloat(amount),
          client_name: clientName || undefined
        })
      });

      if (response.ok) {
        fetchAllMetrics();
      }
    } catch (error) {
      console.error('Failed to add revenue:', error);
    }
  };

  const handleAddLead = async () => {
    const source = prompt('Lead source (linkedin/upwork/referral):');
    const name = prompt('Lead name:');
    const company = prompt('Company (optional):');
    const email = prompt('Email (optional):');

    if (!source || !name) return;

    try {
      const response = await fetch('/api/metrics/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source,
          name,
          company: company || undefined,
          email: email || undefined,
          score: Math.floor(Math.random() * 100) // Random score for demo
        })
      });

      if (response.ok) {
        fetchAllMetrics();
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading metrics...
      </div>
    );
  }

  return (
    <div className="metrics">
      <div className="card-header">
        <h1 className="card-title">📈 Business Metrics & Analytics</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary btn-small" onClick={handleAddRevenue}>
            + Revenue
          </button>
          <button className="btn btn-primary btn-small" onClick={handleAddLead}>
            + Lead
          </button>
        </div>
      </div>

      {/* Revenue Progress Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💰 7-Day Revenue Progress</h2>
        </div>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => `Day ${value.split('-')[2]}`}
              />
              <YAxis tickFormatter={(value) => `€${value}`} />
              <Tooltip 
                formatter={(value) => [`€${value}`, 'Revenue']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                name="Actual Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#94a3b8" 
                strokeDasharray="5 5"
                dot={false}
                name="Daily Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Revenue Breakdown */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">💵 Revenue Sources</h2>
          </div>
          <div className="card-content">
            {revenueBreakdown.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No revenue data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ source, percentage }) => `${source}: ${percentage.toFixed(1)}%`}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`€${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Agent Performance</h2>
          </div>
          <div className="card-content">
            {performance.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No agent performance data
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {performance.map(agent => (
                  <div key={agent.agent_name} style={{
                    padding: '1rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong>{agent.agent_name}</strong>
                      <span className={`status ${agent.status}`}>
                        <span className="status-dot"></span>
                        {agent.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Type: {agent.type} • Runs: {agent.stats.runs} • Success: {agent.stats.successes} • Errors: {agent.stats.errors}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Metrics History */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Daily Metrics History</h2>
        </div>
        <div className="card-content">
          {metrics.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No historical metrics available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis yAxisId="revenue" orientation="left" tickFormatter={(value) => `€${value}`} />
                <YAxis yAxisId="leads" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'current_revenue' ? `€${value}` : value,
                    name === 'current_revenue' ? 'Revenue' : 'Leads'
                  ]}
                />
                <Bar 
                  yAxisId="revenue"
                  dataKey="current_revenue" 
                  fill="#3b82f6" 
                  name="Revenue"
                />
                <Bar 
                  yAxisId="leads"
                  dataKey="current_leads" 
                  fill="#10b981" 
                  name="Leads"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Metrics;