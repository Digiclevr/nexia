import React, { useState, useEffect } from 'react';
import './KvibeDashboard.css';

const KvibeDashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeStatus, setIframeStatus] = useState('loading');

  useEffect(() => {
    // Fetch health data from API
    const fetchHealthData = async () => {
      try {
        const response = await fetch('http://localhost:8001/kvibe/stats');
        if (response.ok) {
          const data = await response.json();
          setHealthData(data);
          setIframeStatus('connected');
        } else {
          setHealthData({
            contentGenerated: 0,
            platformsActive: [],
            campaignsRunning: 0,
            lastUpdate: new Date().toISOString(),
            error: 'API not available'
          });
          setIframeStatus('api-error');
        }
      } catch (error) {
        console.error('Failed to fetch Kvibe health data:', error);
        setHealthData({
          contentGenerated: 0,
          platformsActive: [],
          campaignsRunning: 0,
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
    <div className="kvibe-dashboard-container">
      {/* Health Indicators */}
      <div className="health-indicators">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">
              {loading ? '...' : (healthData?.contentGenerated?.toLocaleString() || 0)}
            </div>
            <div className="metric-label">Messages générés</div>
            <div className={`metric-status ${healthData?.error ? 'error' : 'active'}`}>
              {healthData?.error ? 'Erreur API' : 'Temps réel'}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {loading ? '...' : (healthData?.platformsActive?.length || 0)}
            </div>
            <div className="metric-label">Plateformes actives</div>
            <div className={`metric-status ${healthData?.error ? 'error' : 'active'}`}>
              Multi-canal
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {loading ? '...' : (healthData?.campaignsRunning || 0)}
            </div>
            <div className="metric-label">Campagnes actives</div>
            <div className={`metric-status ${healthData?.error ? 'error' : 'active'}`}>
              {healthData?.error ? 'Hors ligne' : 'En cours'}
            </div>
          </div>

          <div className="metric-card">
            <div className={`metric-value status-${iframeStatus}`}>
              {iframeStatus === 'loaded' ? '✓' : iframeStatus === 'loading' ? '⏳' : '⚠️'}
            </div>
            <div className="metric-label">Application Kvibe</div>
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
      </div>

      {/* Application Header */}
      <div className="iframe-header">
        <h1>Kvibe Content Generation Dashboard</h1>
        <p>Application intégrée depuis http://localhost:9000</p>
      </div>

      {/* Iframe Application */}
      <div className="iframe-wrapper">
        <iframe
          src="http://localhost:9000"
          title="Kvibe Dashboard"
          className="kvibe-iframe"
          frameBorder="0"
          style={{
            width: '100%',
            height: 'calc(100vh - 220px)',
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
          <p>⚠️ Kvibe Dashboard non disponible sur http://localhost:9000</p>
          <p>Vérifiez que l'application Kvibe est démarrée.</p>
        </div>
      )}
    </div>
  );
};

export default KvibeDashboard;