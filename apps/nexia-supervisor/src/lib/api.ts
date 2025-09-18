// NEXIA Supervisor API Client
export const nexiaApi = {
  // Base configuration
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://nexia.onlyoneapi.com/api'
    : 'http://localhost:7010/api',

  // Fetch NEXIA status
  async fetchStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Status API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA Status API Error:', error);
      throw error;
    }
  },

  // Fetch ecosystem health
  async fetchEcosystemHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/monitoring/ecosystems`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Ecosystem health API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform ecosystem data to expected format
      const ecosystemStatus: any = {};
      if (data.ecosystems) {
        data.ecosystems.forEach((eco: any) => {
          const name = eco.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          ecosystemStatus[name] = eco.status;
        });
      }
      
      return { data: ecosystemStatus };
    } catch (error) {
      console.error('NEXIA Ecosystem Health API Error:', error);
      // Return mock data for development
      return { 
        data: {
          blueocean: 'warning',
          onlyoneapi: 'healthy', 
          business_automation: 'warning',
          claude_code: 'healthy'
        }
      };
    }
  },

  // Fetch active alerts
  async fetchActiveAlerts() {
    try {
      const response = await fetch(`${this.baseUrl}/escalation/alerts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Active alerts API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA Active Alerts API Error:', error);
      // Return mock data for development
      return { 
        data: [
          {
            id: 'alert_mock_1',
            severity: 'high',
            target: 'BlueOcean',
            message: 'Service response time elevated',
            createdAt: new Date().toISOString()
          },
          {
            id: 'alert_mock_2', 
            severity: 'medium',
            target: 'Business-Automation',
            message: 'Memory usage above threshold',
            createdAt: new Date(Date.now() - 300000).toISOString()
          }
        ]
      };
    }
  },

  // Fetch system metrics
  async fetchMetrics() {
    try {
      const response = await fetch(`${this.baseUrl}/monitoring/metrics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Metrics API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA Metrics API Error:', error);
      throw error;
    }
  },

  // Voice commands
  async sendVoiceCommand(command: string, ecosystem?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/voice/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          ecosystem,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Voice command API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA Voice Command API Error:', error);
      throw error;
    }
  },

  // Control operations
  async controlOperation(operation: string, target: string) {
    try {
      const response = await fetch(`${this.baseUrl}/control/${operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Control operation API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA Control Operation API Error:', error);
      throw error;
    }
  },

  // Directus CMS integration
  async fetchDirectusContent(collection: string) {
    try {
      const response = await fetch(`${this.baseUrl}/cms/${collection}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Directus content API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA Directus Content API Error:', error);
      throw error;
    }
  },

  // Fetch system ports
  async fetchSystemPorts() {
    try {
      const response = await fetch(`${this.baseUrl}/system/ports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`System ports API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA System Ports API Error:', error);
      // Return mock data for development
      return { 
        data: {
          active_ports: [7010, 7011, 7012, 7013, 9080, 9081, 9082, 9083, 8001],
          conflicts: [],
          status: 'healthy'
        }
      };
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Health check API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEXIA Health Check API Error:', error);
      throw error;
    }
  }
};

// Query keys for React Query
export const getStatusQueryKey = () => ['nexia-status'];
export const getEcosystemHealthQueryKey = () => ['ecosystem-health'];
export const getActiveAlertsQueryKey = () => ['active-alerts'];
export const getMetricsQueryKey = () => ['nexia-metrics'];
export const getSystemPortsQueryKey = () => ['system-ports'];
export const getDirectusContentQueryKey = (collection: string) => ['directus', collection];

export default nexiaApi;