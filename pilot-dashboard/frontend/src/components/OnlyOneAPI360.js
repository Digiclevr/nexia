import React, { useState, useEffect } from 'react';
import './OnlyOneAPI360.css';

const OnlyOneAPI360 = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeStatus, setIframeStatus] = useState('loading');

  useEffect(() => {
    // Fetch health data from API
    const fetchHealthData = async () => {
      try {
        const response = await fetch('http://localhost:8001/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setHealthData(data);
          setIframeStatus('connected');
        } else {
          setHealthData({
            activeClients: 0,
            monthlyRevenue: 0,
            apiCalls: 0,
            uptime: 0,
            lastUpdate: new Date().toISOString(),
            error: 'API not available'
          });
          setIframeStatus('api-error');
        }
      } catch (error) {
        console.error('Failed to fetch OnlyOneAPI360 health data:', error);
        setHealthData({
          activeClients: 0,
          monthlyRevenue: 0,
          apiCalls: 0,
          uptime: 0,
          lastUpdate: new Date().toISOString(),
          error: 'Connection failed'
        });
        setIframeStatus('connection-error');
      }
      setLoading(false);
    };

    fetchHealthData();
    // Refresh health data every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleIframeLoad = () => {
    setIframeStatus('loaded');
  };

  const handleIframeError = () => {
    setIframeStatus('iframe-error');
  };

  return (
    <div className="onlyoneapi360-container">
      {/* Health Indicators */}
      <div className="health-indicators">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">
              {loading ? '...' : (healthData?.activeClients?.toLocaleString() || 0)}
            </div>
            <div className="metric-label">Clients actifs</div>
            <div className={`metric-status ${healthData?.error ? 'error' : 'active'}`}>
              {healthData?.error ? 'Erreur API' : 'Temps réel'}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              €{loading ? '...' : (healthData?.monthlyRevenue?.toLocaleString() || 0)}
            </div>
            <div className="metric-label">Revenus mensuels</div>
            <div className={`metric-status ${healthData?.error ? 'error' : 'active'}`}>
              {healthData?.error ? 'Hors ligne' : 'En croissance'}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {loading ? '...' : (healthData?.apiCalls?.toLocaleString() || 0)}
            </div>
            <div className="metric-label">Appels API</div>
            <div className={`metric-status ${healthData?.error ? 'error' : 'active'}`}>
              {healthData?.error ? 'Non disponible' : 'Santé OK'}
            </div>
          </div>

          <div className="metric-card">
            <div className={`metric-value status-${iframeStatus}`}>
              {iframeStatus === 'loaded' ? '✓' : iframeStatus === 'loading' ? '⏳' : '⚠️'}
            </div>
            <div className="metric-label">App OnlyOneAPI360</div>
            <div className={`metric-status ${iframeStatus === 'loaded' ? 'active' : 'error'}`}>
              {iframeStatus === 'loaded' ? 'Chargée' : 
               iframeStatus === 'loading' ? 'Chargement...' :
               iframeStatus === 'iframe-error' ? 'App indisponible' : 'Connexion...'}
            </div>
          </div>
        </div>

        {healthData?.error && (
          <div className="error-banner">
            ⚠️ API Backend: {healthData.error} - Application en mode iframe uniquement
          </div>
        )}

        <div className="system-health">
          <div className="health-item">
            <span>Uptime système:</span>
            <span className={`status-indicator ${healthData?.uptime > 90 ? 'active' : ''}`}></span>
            <span>{loading ? '...' : (healthData?.uptime || 0)}%</span>
          </div>
          <div className="health-item">
            <span>Dernière mise à jour:</span>
            <span className="status-indicator active"></span>
            <span>{healthData?.lastUpdate ? new Date(healthData.lastUpdate).toLocaleTimeString() : 'Jamais'}</span>
          </div>
        </div>
      </div>

      {/* Application Header */}
      <div className="iframe-header">
        <h1>OnlyOneAPI 360 - Admin Dashboard</h1>
        <p>Application intégrée depuis http://localhost:5008</p>
      </div>

      {/* Iframe Application */}
      <div className="iframe-wrapper">
        <iframe
          src="http://localhost:5008"
          title="OnlyOneAPI360 Dashboard"
          className="onlyoneapi360-iframe"
          frameBorder="0"
          style={{
            width: '100%',
            height: 'calc(100vh - 250px)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {iframeStatus === 'iframe-error' && (
        <div className="iframe-fallback">
          <p>⚠️ OnlyOneAPI360 Dashboard non disponible sur http://localhost:5008</p>
          <p>Vérifiez que l'application OnlyOneAPI360 est démarrée.</p>
        </div>
      )}
    </div>
  );
};

export default OnlyOneAPI360;