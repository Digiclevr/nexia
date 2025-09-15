import React, { useState, useEffect } from 'react';

const APIConfiguration = () => {
  const [apiKeys, setApiKeys] = useState({
    // Core APIs
    openai_api_key: '',
    linkedin_client_id: '',
    linkedin_client_secret: '',
    sendgrid_api_key: '',
    github_token: '',
    
    // Stripe - Business Activity Specific Keys
    stripe_live_publishable: '',
    stripe_live_secret: '',
    stripe_audits_key: '',        // API Audits restricted key
    stripe_consulting_key: '',    // Emergency Consulting restricted key
    stripe_founding_key: '',      // Founding Members restricted key
    stripe_content_key: '',       // Technical Writing restricted key
    stripe_done_for_you_key: '',  // Done-for-you restricted key
    stripe_webhook_secret: '',
    
    // Social Media & Outreach
    twitter_bearer_token: '',
    upwork_api_key: '',
    calendly_api_key: '',
    discord_bot_token: '',
    slack_bot_token: '',
    telegram_bot_token: ''
  });

  const [savedKeys, setSavedKeys] = useState({});
  const [saving, setSaving] = useState(false);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      const response = await fetch('/api/configuration/api-keys');
      const data = await response.json();
      console.log('Fetched API keys:', data);
      setSavedKeys(data);
      
      // Masquer les clés existantes pour la sécurité
      const maskedKeys = {};
      Object.keys(data).forEach(key => {
        if (data[key]) {
          if (data[key].length > 8) {
            maskedKeys[key] = data[key].replace(/(.{4}).*(.{4})/, '$1****$2');
          } else {
            maskedKeys[key] = '****';
          }
        }
      });
      setApiKeys(prev => ({ ...prev, ...maskedKeys }));
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  const handleInputChange = (key, value) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveAPIKey = async (key) => {
    if (!apiKeys[key] || apiKeys[key].includes('****')) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/configuration/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: key,
          value: apiKeys[key]
        })
      });

      if (response.ok) {
        setSavedKeys(prev => ({ ...prev, [key]: apiKeys[key] }));
        
        // Masquer la clé après sauvegarde
        const maskedValue = apiKeys[key].length > 8 
          ? apiKeys[key].replace(/(.{4}).*(.{4})/, '$1****$2')
          : '****';
        setApiKeys(prev => ({ ...prev, [key]: maskedValue }));
        
        console.log(`API key ${key} saved successfully`);
      } else {
        const errorData = await response.json();
        console.error('Failed to save API key:', errorData);
        alert(`Failed to save ${key}: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to save API key:', error);
    } finally {
      setSaving(false);
    }
  };

  const testAPIKey = async (key) => {
    setTestResults(prev => ({ ...prev, [key]: 'testing' }));
    
    try {
      const response = await fetch(`/api/configuration/test-api/${key}`, {
        method: 'POST'
      });
      
      const result = await response.json();
      setTestResults(prev => ({ 
        ...prev, 
        [key]: result.success ? 'success' : 'error' 
      }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [key]: 'error' }));
    }
  };

  const getAgentsByAPI = (apiKey) => {
    const agentMap = {
      openai_api_key: ['AuditBot', 'ContentBot', 'TechWriterBot', 'CrisisBot'],
      linkedin_client_id: ['AuditBot', 'CrisisBot', 'ContentBot', 'TechWriterBot'],
      
      // Stripe keys by business activity
      stripe_live_publishable: ['Frontend payment forms'],
      stripe_live_secret: ['Backend payment processing'],
      stripe_audits_key: ['AuditBot - API Audits payments'],
      stripe_consulting_key: ['CrisisBot - Emergency Consulting payments'], 
      stripe_founding_key: ['ContentBot - Founding Members subscriptions'],
      stripe_content_key: ['TechWriterBot - Content services payments'],
      stripe_done_for_you_key: ['ArchitectBot - Done-for-you services'],
      stripe_webhook_secret: ['Payment webhooks & notifications'],
      
      sendgrid_api_key: ['AuditBot', 'TechWriterBot', 'GiveawayBot'],
      github_token: ['CrisisBot'],
      twitter_bearer_token: ['CrisisBot', 'ContentBot', 'GiveawayBot'],
      upwork_api_key: ['TechWriterBot'],
      calendly_api_key: ['ArchitectBot'],
      discord_bot_token: ['CommunityBot'],
      slack_bot_token: ['CommunityBot', 'ArchitectBot'],
      telegram_bot_token: ['CommunityBot']
    };
    return agentMap[apiKey] || [];
  };

  const getAPIStatus = (key) => {
    if (testResults[key] === 'testing') return 'testing';
    if (testResults[key] === 'success') return 'success';
    if (testResults[key] === 'error') return 'error';
    if (savedKeys[key]) return 'saved';
    return 'unknown';
  };

  const apiConfigs = [
    // Core APIs
    {
      key: 'openai_api_key',
      name: 'OpenAI API Key',
      placeholder: 'sk-...',
      priority: 'CRITIQUE',
      description: 'Génération de contenu automatique',
      category: 'core'
    },
    
    // Stripe - Business Activity Keys
    {
      key: 'stripe_live_publishable',
      name: 'Stripe Publishable Key (Live)',
      placeholder: 'pk_live_...',
      priority: 'CRITIQUE',
      description: 'Clé publique pour formulaires de paiement',
      category: 'payments'
    },
    {
      key: 'stripe_live_secret',
      name: 'Stripe Secret Key (Live)',
      placeholder: 'sk_live_...',
      priority: 'CRITIQUE',
      description: 'Clé secrète principale (accès complet)',
      category: 'payments'
    },
    {
      key: 'stripe_audits_key',
      name: 'Stripe - API Audits Key',
      placeholder: 'rk_live_...',
      priority: 'HAUTE',
      description: '€800/audit - Paiements uniques + facturation',
      category: 'payments'
    },
    {
      key: 'stripe_consulting_key',
      name: 'Stripe - Emergency Consulting Key', 
      placeholder: 'rk_live_...',
      priority: 'HAUTE',
      description: '€300/h - Paiements urgents + tracking temps',
      category: 'payments'
    },
    {
      key: 'stripe_founding_key',
      name: 'Stripe - Founding Members Key',
      placeholder: 'rk_live_...',
      priority: 'HAUTE',
      description: '€497/mois - Abonnements récurrents uniquement',
      category: 'payments'
    },
    {
      key: 'stripe_content_key',
      name: 'Stripe - Technical Writing Key',
      placeholder: 'rk_live_...',
      priority: 'MOYENNE',
      description: '€300/deliverable - Paiements content + milestone',
      category: 'payments'
    },
    {
      key: 'stripe_done_for_you_key',
      name: 'Stripe - Done-for-You Key',
      placeholder: 'rk_live_...',
      priority: 'MOYENNE', 
      description: '€1500+ projets - Gros montants + acomptes',
      category: 'payments'
    },
    {
      key: 'stripe_webhook_secret',
      name: 'Stripe Webhook Secret',
      placeholder: 'whsec_...',
      priority: 'CRITIQUE',
      description: 'Sécurisation notifications de paiement',
      category: 'payments'
    },
    {
      key: 'linkedin_client_id',
      name: 'LinkedIn Client ID',
      placeholder: 'Votre LinkedIn App Client ID',
      priority: 'HAUTE',
      description: 'Prospection et publication LinkedIn',
      category: 'outreach'
    },
    {
      key: 'linkedin_client_secret',
      name: 'LinkedIn Client Secret', 
      placeholder: 'Votre LinkedIn App Secret',
      priority: 'HAUTE',
      description: 'Authentification LinkedIn',
      category: 'outreach'
    },
    {
      key: 'sendgrid_api_key',
      name: 'SendGrid API Key',
      placeholder: 'SG....',
      priority: 'HAUTE',
      description: 'Envoi d\'emails automatique',
      category: 'outreach'
    },
    {
      key: 'github_token',
      name: 'GitHub Personal Token',
      placeholder: 'ghp_...',
      priority: 'MOYENNE',
      description: 'Monitoring des issues GitHub',
      category: 'monitoring'
    },
    {
      key: 'twitter_bearer_token',
      name: 'Twitter Bearer Token',
      placeholder: 'Bearer token Twitter API v2',
      priority: 'MOYENNE', 
      description: 'Publication et monitoring Twitter',
      category: 'outreach'
    },
    {
      key: 'upwork_api_key',
      name: 'Upwork API Key',
      placeholder: 'Upwork API Key',
      priority: 'MOYENNE',
      description: 'Soumissions automatiques Upwork',
      category: 'outreach'
    },
    {
      key: 'calendly_api_key',
      name: 'Calendly API Token',
      placeholder: 'Calendly Personal Access Token',
      priority: 'BASSE',
      description: 'Booking automatique consultations',
      category: 'automation'
    },
    {
      key: 'discord_bot_token',
      name: 'Discord Bot Token', 
      placeholder: 'Discord bot token',
      priority: 'BASSE',
      description: 'Engagement communautés Discord',
      category: 'community'
    },
    {
      key: 'slack_bot_token',
      name: 'Slack Bot Token',
      placeholder: 'xoxb-...',
      priority: 'BASSE', 
      description: 'Participation workspaces Slack',
      category: 'community'
    },
    {
      key: 'telegram_bot_token',
      name: 'Telegram Bot Token',
      placeholder: 'Token du bot Telegram',
      priority: 'BASSE',
      description: 'Engagement groupes Telegram',
      category: 'community'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITIQUE': return '#dc2626';
      case 'HAUTE': return '#ea580c';
      case 'MOYENNE': return '#ca8a04';
      case 'BASSE': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getCategoryTitle = (category) => {
    const titles = {
      core: '🤖 APIs Essentielles',
      payments: '💳 Stripe - Paiements par Activité',
      outreach: '📬 Prospection & Marketing',
      monitoring: '📈 Monitoring & Analytics', 
      automation: 'Automation & Booking',
      community: '👥 Community Management'
    };
    return titles[category] || category;
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      core: 'APIs critiques pour le fonctionnement de base',
      payments: 'Clés Stripe spécialisées par business activity - sécurité renforcée',
      outreach: 'APIs pour prospection automatique et publications sociales',
      monitoring: 'Suivi des performances et métriques',
      automation: 'Automatisation des rendez-vous et processus',
      community: 'Engagement communautés et groupes'
    };
    return descriptions[category] || '';
  };

  const apisByCategory = apiConfigs.reduce((acc, api) => {
    const category = api.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(api);
    return acc;
  }, {});

  const categoryOrder = ['core', 'payments', 'outreach', 'monitoring', 'automation', 'community'];

  return (
    <div className="api-configuration">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Configuration des APIs</h2>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Configurez les APIs spécialisées pour chaque business activity
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          {categoryOrder.map(categoryKey => {
            const categoryAPIs = apisByCategory[categoryKey];
            if (!categoryAPIs) return null;
            
            return (
              <div key={categoryKey} style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  marginBottom: '1rem', 
                  paddingBottom: '0.5rem', 
                  borderBottom: '2px solid var(--border)' 
                }}>
                  <h3 style={{ margin: 0, color: 'var(--text)' }}>
                    {getCategoryTitle(categoryKey)}
                  </h3>
                  <p style={{ 
                    margin: '0.25rem 0 0 0', 
                    fontSize: '0.875rem', 
                    color: 'var(--text-muted)' 
                  }}>
                    {getCategoryDescription(categoryKey)}
                  </p>
                </div>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {categoryAPIs.map(api => (
                    <div key={api.key} style={{
                      padding: '1rem',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--surface-hover)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div>
                          <strong>{api.name}</strong>
                          <span className={`api-status ${getAPIStatus(api.key)}`} style={{ marginLeft: '0.5rem' }}></span>
                        </div>
                        <span style={{ 
                          color: getPriorityColor(api.priority),
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {api.priority}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        {api.description}
                      </div>
                      
                      <div style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                        <strong>Utilisé par:</strong> {getAgentsByAPI(api.key).join(', ')}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type={api.key.includes('secret') || api.key.includes('token') ? 'password' : 'text'}
                          placeholder={api.placeholder}
                          value={apiKeys[api.key]}
                          onChange={(e) => handleInputChange(api.key, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: '1px solid var(--border)',
                            borderRadius: '0.25rem'
                          }}
                        />
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => saveAPIKey(api.key)}
                          disabled={saving || !apiKeys[api.key] || apiKeys[api.key].includes('****')}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        {savedKeys[api.key] && (
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => testAPIKey(api.key)}
                          >
                            Test
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default APIConfiguration;