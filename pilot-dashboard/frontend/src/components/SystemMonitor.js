import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const SystemMonitor = () => {
  const [services, setServices] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState({});

  useEffect(() => {
    fetchSystemStatus();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchSystemStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/system/status');
      const data = await response.json();
      
      setServices(data.services || []);
      setProcesses(data.processes || []);
      setScripts(data.scripts || []);
      setSystemHealth(data.health || {});
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setLoading(false);
    }
  };

  const handleServiceAction = async (serviceId, action) => {
    setActionInProgress({ [serviceId]: action });
    
    try {
      const response = await fetch(`/api/system/service/${serviceId}/${action}`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh status immediately and again after delay to catch status changes
        setTimeout(fetchSystemStatus, 1000);
        setTimeout(fetchSystemStatus, 3000);
        setTimeout(fetchSystemStatus, 5000);
      } else {
        alert(`Failed to ${action} service: ${result.error}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} service:`, error);
      alert(`Failed to ${action} service`);
    } finally {
      setActionInProgress({});
    }
  };

  const handleScriptAction = async (scriptPath, action) => {
    setActionInProgress({ [scriptPath]: action });
    
    try {
      const response = await fetch('/api/system/script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script: scriptPath,
          action: action
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (action === 'logs') {
          if (result.logs) {
            // Show logs in a modal or new window
            try {
              const logWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
              if (!logWindow || !logWindow.document) {
                throw new Error('Unable to open log window');
              }
            logWindow.document.write(`
              <html>
                <head>
                  <title>Script Logs: ${scriptPath.split('/').pop()}</title>
                  <style>
                    body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #fff; }
                    pre { white-space: pre-wrap; word-wrap: break-word; }
                    .stdout { color: #90EE90; }
                    .stderr { color: #FFB6C1; }
                    .system { color: #87CEEB; }
                    .error { color: #FF6347; }
                    .summary { background: #2a2a2a; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
                  </style>
                </head>
                <body>
                  <h2>Script Logs: ${scriptPath.split('/').pop()}</h2>
                  ${result.summary ? `
                    <div class="summary">
                      <strong>Summary:</strong><br>
                      Status: ${result.summary.running ? 'Running' : 'Stopped'}<br>
                      Started: ${new Date(result.summary.startTime).toLocaleString()}<br>
                      ${result.summary.endTime ? `Ended: ${new Date(result.summary.endTime).toLocaleString()}<br>` : ''}
                      ${result.summary.exitCode !== undefined ? `Exit Code: ${result.summary.exitCode}<br>` : ''}
                      Log Entries: ${result.summary.logCount}
                    </div>
                  ` : ''}
                  <pre>${result.logs.split('\n').map(line => {
                    const type = line.match(/\] (STDOUT|STDERR|SYSTEM|ERROR):/)?.[1]?.toLowerCase() || '';
                    return `<span class="${type}">${line}</span>`;
                  }).join('\n')}</pre>
                  <script>
                    // Auto-scroll to bottom
                    window.scrollTo(0, document.body.scrollHeight);
                    // Refresh every 5 seconds if script is running
                    ${result.summary?.running ? 'setTimeout(() => location.reload(), 5000);' : ''}
                  </script>
                </body>
              </html>
            `);
              logWindow.document.close();
            } catch (error) {
              console.error('Error opening logs window:', error);
              alert('Unable to open logs window. Check console for details.');
            }
          } else {
            alert('No logs available for this script');
          }
        } else {
          setTimeout(fetchSystemStatus, 2000);
        }
      } else {
        alert(`Failed to ${action} script: ${result.error}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} script:`, error);
      alert(`Failed to ${action} script: ${error.message}`);
    } finally {
      setActionInProgress({});
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
      case 'active':
      case 'healthy': return '#10b981';
      case 'stopped':
      case 'inactive': return '#6b7280';
      case 'error':
      case 'failed': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
      case 'active':
      case 'healthy': return 'running';
      case 'stopped':
      case 'inactive': return 'stopped';
      case 'error':
      case 'failed': return 'error';
      case 'warning': return 'warning';
      default: return 'unknown';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading system status...
      </div>
    );
  }

  return (
    <div className="system-monitor">
      {/* System Health Overview */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">System Health Overview</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="metric-card">
              <div className="metric-value">{systemHealth.cpu || 'N/A'}%</div>
              <div className="metric-label">CPU Usage</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{systemHealth.memory || 'N/A'}%</div>
              <div className="metric-label">Memory Usage</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{systemHealth.uptime || 'N/A'}</div>
              <div className="metric-label">System Uptime</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{services.filter(s => s.status === 'running').length}/{services.length}</div>
              <div className="metric-label">Services Running</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Services */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Core Services</h2>
          <button className="btn btn-secondary btn-small" onClick={fetchSystemStatus}>
            Refresh
          </button>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {services.map(service => (
              <div key={service.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--surface)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <button
                    className={`btn btn-small ${service.status === 'running' ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => handleServiceAction(service.id, service.status === 'running' ? 'stop' : 'start')}
                    disabled={actionInProgress[service.id]}
                    style={{ 
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      minWidth: '20px',
                      padding: '0',
                      border: 'none',
                      backgroundColor: actionInProgress[service.id] ? '#6b7280' : (service.status === 'running' ? '#ef4444' : '#10b981'),
                      cursor: actionInProgress[service.id] ? 'not-allowed' : 'pointer'
                    }}
                  >
                  </button>
                  
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {service.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {service.description}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => handleServiceAction(service.id, 'restart')}
                    disabled={actionInProgress[service.id] || service.status === 'stopped'}
                  >
                    {actionInProgress[service.id] === 'restart' ? 'Restarting...' : 'Restart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Scripts */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Session Scripts</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
            {scripts.map(script => (
              <div key={script.path} style={{
                padding: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                backgroundColor: script.running ? '#f0fdf4' : 'var(--surface-hover)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ marginRight: '0.5rem' }}>
                      <span className={`script-status ${script.running ? 'running' : (script.type === 'one-shot' && script.exit_code === 0 ? 'completed' : 'stopped')}`}></span>
                    </span>
                    <strong style={{ fontSize: '0.875rem' }}>{script.name}</strong>
                    {script.type && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.6rem',
                        padding: '0.125rem 0.25rem',
                        backgroundColor: script.type === 'one-shot' ? '#fbbf24' : '#3b82f6',
                        color: 'white',
                        borderRadius: '0.25rem',
                        textTransform: 'uppercase'
                      }}>
                        {script.type === 'one-shot' ? 'Task' : 'Service'}
                      </span>
                    )}
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem',
                    color: script.running ? '#10b981' : (script.type === 'one-shot' && script.exit_code === 0 ? '#10b981' : '#6b7280')
                  }}>
                    {script.running ? 'Running' : (script.type === 'one-shot' && script.exit_code === 0 ? 'Completed' : 'Stopped')}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {script.description}
                </div>
                
                <div style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                  Path: <code>{script.path}</code>
                </div>
                
                {script.last_run && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Last run: {formatDistanceToNow(new Date(script.last_run), { addSuffix: true })}
                    {script.exit_code !== undefined && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        (Exit: <span className={`exit-status ${script.exit_code === 0 ? 'success' : 'error'}`}></span> {script.exit_code})
                      </span>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleScriptAction(script.path, 'run')}
                    disabled={actionInProgress[script.path] || script.running}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {actionInProgress[script.path] === 'run' ? 'Running...' : (script.type === 'one-shot' ? 'Execute' : 'Start')}
                  </button>
                  
                  {script.running && script.type !== 'one-shot' && (
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleScriptAction(script.path, 'stop')}
                      disabled={actionInProgress[script.path]}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {actionInProgress[script.path] === 'stop' ? 'Stopping...' : 'Stop'}
                    </button>
                  )}
                  
                  <button
                    className={`btn btn-small ${script.has_logs ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleScriptAction(script.path, 'logs')}
                    disabled={!script.has_logs && !script.running}
                    style={{ 
                      fontSize: '0.75rem',
                      opacity: (!script.has_logs && !script.running) ? 0.5 : 1,
                      backgroundColor: script.has_logs ? '#3b82f6' : '#6b7280',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    {script.has_logs ? 'Logs' : 'No Logs'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Running Processes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Active Processes</h2>
        </div>
        <div className="card-content">
          {processes.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No active processes detected
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {processes.map((process, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'var(--surface-hover)',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}>
                  <div>
                    <strong>PID {process.pid}</strong> - {process.command}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      CPU: {process.cpu || 'N/A'}% • Memory: {process.memory || 'N/A'}MB
                    </span>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleServiceAction(process.pid, 'kill')}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Kill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;