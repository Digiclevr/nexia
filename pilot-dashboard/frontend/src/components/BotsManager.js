import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const BotsManager = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedBotId, setSelectedBotId] = useState('');
  const [newTask, setNewTask] = useState({
    task_name: '',
    description: '',
    priority: 'medium'
  });
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchBots();
    const interval = setInterval(fetchBots, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/bots-squad');
      if (response.ok) {
        const botsData = await response.json();
        setBots(botsData);
      } else {
        console.error('Failed to fetch bots data');
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!selectedBotId || !newTask.task_name.trim()) {
      return;
    }

    setActionLoading(prev => ({ ...prev, add_task: true }));

    try {
      const response = await fetch(`/api/bots-squad/${selectedBotId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        setShowTaskModal(false);
        setNewTask({ task_name: '', description: '', priority: 'medium' });
        setSelectedBotId('');
        fetchBots(); // Refresh data
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, add_task: false }));
    }
  };

  const handleStatusChange = async (botId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [botId]: true }));

    try {
      const response = await fetch(`/api/bots-squad/${botId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchBots(); // Refresh data
      } else {
        console.error('Failed to update bot status');
      }
    } catch (error) {
      console.error('Error updating bot status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [botId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'maintenance': return 'var(--warning)';
      case 'error': return 'var(--error)';
      case 'paused': return 'var(--text-muted)';
      default: return 'var(--success)';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 95) return 'var(--success)';
    if (health >= 85) return 'var(--info)';
    if (health >= 70) return 'var(--warning)';
    return 'var(--error)';
  };

  if (loading) {
    return (
      <div className="agents-manager">
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading...</div>
            <p>Fetching bots squad data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agents-manager">
      <div className="card-header">
        <h1 className="card-title">OnlyOneAPI Bots Squad</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowTaskModal(true)}
          >
            + Add Task
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={fetchBots}
          >
            Refresh Status
          </button>
        </div>
      </div>

      {bots.length === 0 ? (
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3>No bots available</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              The bots squad is not configured yet
            </p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bot</th>
                <th>Role & Domain</th>
                <th>Status</th>
                <th>Health</th>
                <th>Tasks</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bots.map(bot => (
                <tr key={bot.id}>
                  <td>
                    <div>
                      <strong>{bot.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {bot.bot_id}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong style={{ fontSize: '0.875rem' }}>{bot.role}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {bot.domain}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${bot.status}`} style={{ color: getStatusColor(bot.status) }}>
                      <span className="status-dot" style={{ backgroundColor: getStatusColor(bot.status) }}></span>
                      {bot.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        color: getHealthColor(bot.health), 
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}>
                        {bot.health}%
                      </span>
                      <div style={{
                        width: '40px',
                        height: '4px',
                        backgroundColor: 'var(--border)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${bot.health}%`,
                          height: '100%',
                          backgroundColor: getHealthColor(bot.health),
                          borderRadius: '2px'
                        }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem' }}>
                      <div>Active: <strong>{bot.tasks_active}</strong></div>
                      <div style={{ color: 'var(--success)' }}>Completed: {bot.tasks_completed}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.875rem' }}>
                      {bot.last_activity ? 
                        formatDistanceToNow(new Date(bot.last_activity), { addSuffix: true }) : 
                        'Never'
                      }
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select
                        value={bot.status}
                        onChange={(e) => handleStatusChange(bot.bot_id, e.target.value)}
                        disabled={actionLoading[bot.bot_id]}
                        style={{
                          padding: '0.25rem',
                          fontSize: '0.75rem',
                          border: '1px solid var(--border)',
                          borderRadius: '0.25rem'
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="paused">Paused</option>
                        <option value="error">Error</option>
                      </select>
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={() => {
                          setSelectedBotId(bot.bot_id);
                          setShowTaskModal(true);
                        }}
                      >
                        Add Task
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
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
              <h2 className="card-title">Add Task to Bot</h2>
              <button 
                onClick={() => {
                  setShowTaskModal(false);
                  setSelectedBotId('');
                  setNewTask({ task_name: '', description: '', priority: 'medium' });
                }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div className="card-content">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Bot
                </label>
                <select
                  value={selectedBotId}
                  onChange={(e) => setSelectedBotId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="">Select a bot...</option>
                  {bots.map(bot => (
                    <option key={bot.bot_id} value={bot.bot_id}>
                      {bot.name} - {bot.role}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask.task_name}
                  onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                  placeholder="e.g., Optimize API response times"
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
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Detailed description of the task..."
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedBotId('');
                    setNewTask({ task_name: '', description: '', priority: 'medium' });
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleAddTask}
                  disabled={!selectedBotId || !newTask.task_name.trim() || actionLoading.add_task}
                >
                  {actionLoading.add_task ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotsManager;