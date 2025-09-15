const axios = require('axios');
const logger = require('../utils/logger');

class MonitoringService {
  constructor() {
    // Development mode - use localhost URLs when in development
    const isDevelopment = process.env.NODE_ENV !== 'production';
    this.lastAlertTime = new Map(); // Rate limiting for alerts
    
    this.ecosystems = [
      {
        name: 'BlueOcean',
        url: process.env.BLUEOCEAN_API_BASE || (isDevelopment ? 
          'http://localhost:8020' : 
          'http://nextstep-api.nextstep.svc.cluster.local:8020'),
        healthEndpoint: '/health',
        status: 'unknown'
      },
      {
        name: 'OnlyOneAPI',
        url: process.env.ONLYONEAPI_BASE || 'https://api.onlyoneapi.com',
        healthEndpoint: '/health',
        status: 'unknown'
      },
      {
        name: 'Business-Automation',
        url: process.env.BUSINESS_AUTO_BASE || (isDevelopment ?
          'http://localhost:8001' :
          'http://business-automation.platform.svc.cluster.local:8001'),
        healthEndpoint: '/health',
        status: 'unknown'
      },
      {
        name: 'NEXIA-Supervisor',
        url: process.env.NEXIA_SUPERVISOR_URL || 'http://localhost:7014',
        healthEndpoint: '/api/health',
        status: 'unknown'
      }
    ];
    
    this.metrics = {
      checks: 0,
      successes: 0,
      failures: 0,
      lastCheck: null,
      averageResponseTime: 0,
      ecosystemsStatus: {}
    };
    
    this.isInitialized = false;
  }

  async initialize() {
    logger.info('Initializing Monitoring Service');
    
    // Initialize ecosystem status
    for (const ecosystem of this.ecosystems) {
      this.metrics.ecosystemsStatus[ecosystem.name] = {
        status: 'unknown',
        lastCheck: null,
        responseTime: null,
        error: null
      };
    }
    
    this.isInitialized = true;
    logger.info('Monitoring Service initialized');
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      ecosystems: this.ecosystems.length,
      metrics: this.metrics,
      lastActivity: this.metrics.lastCheck
    };
  }

  async checkEcosystems() {
    if (!this.isInitialized) {
      logger.warn('Monitoring Service not initialized');
      return;
    }

    logger.debug('Checking ecosystems health');
    const startTime = Date.now();
    
    for (const ecosystem of this.ecosystems) {
      await this.checkEcosystem(ecosystem);
    }
    
    this.metrics.checks++;
    this.metrics.lastCheck = new Date().toISOString();
    
    const duration = Date.now() - startTime;
    this.updateAverageResponseTime(duration);
    
    logger.debug(`Ecosystem check completed in ${duration}ms`);
    
    // Analyze results and trigger actions if needed
    await this.analyzeResults();
  }

  async checkEcosystem(ecosystem) {
    const startTime = Date.now();
    
    // Development mode mocking
    if (process.env.ENABLE_MOCKS === 'true' && ecosystem.url.startsWith('mock://')) {
      const responseTime = 50 + Math.random() * 100; // 50-150ms mock response
      const isHealthy = process.env.MOCK_HEALTHY_SERVICES === 'true' || Math.random() > 0.3;
      
      ecosystem.status = isHealthy ? 'healthy' : 'warning';
      
      this.metrics.ecosystemsStatus[ecosystem.name] = {
        status: ecosystem.status,
        lastCheck: new Date().toISOString(),
        responseTime,
        statusCode: isHealthy ? 200 : 503,
        error: null,
        mocked: true
      };
      
      if (isHealthy) {
        this.metrics.successes++;
      }
      
      logger.debug(`${ecosystem.name}: ${ecosystem.status} (${Math.round(responseTime)}ms) [MOCKED]`);
      return;
    }
    
    try {
      const response = await axios.get(`${ecosystem.url}${ecosystem.healthEndpoint}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500 // Accept 2xx, 3xx, 4xx as non-critical
      });
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.status >= 200 && response.status < 400;
      
      ecosystem.status = isHealthy ? 'healthy' : 'warning';
      
      this.metrics.ecosystemsStatus[ecosystem.name] = {
        status: ecosystem.status,
        lastCheck: new Date().toISOString(),
        responseTime,
        statusCode: response.status,
        error: null
      };
      
      if (isHealthy) {
        this.metrics.successes++;
      }
      
      logger.debug(`${ecosystem.name}: ${ecosystem.status} (${responseTime}ms)`);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      ecosystem.status = 'unhealthy';
      
      this.metrics.ecosystemsStatus[ecosystem.name] = {
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime,
        statusCode: null,
        error: error.message
      };
      
      this.metrics.failures++;
      
      logger.warn(`${ecosystem.name}: unhealthy - ${error.message}`);
    }
  }

  updateAverageResponseTime(newTime) {
    if (this.metrics.averageResponseTime === 0) {
      this.metrics.averageResponseTime = newTime;
    } else {
      // Exponential moving average
      this.metrics.averageResponseTime = (this.metrics.averageResponseTime * 0.8) + (newTime * 0.2);
    }
  }

  async analyzeResults() {
    const unhealthyEcosystems = this.ecosystems.filter(e => e.status === 'unhealthy');
    const warningEcosystems = this.ecosystems.filter(e => e.status === 'warning');
    
    // Trigger alerts for unhealthy ecosystems
    for (const ecosystem of unhealthyEcosystems) {
      await this.triggerAlert({
        type: 'service_down',
        severity: 'high',
        target: ecosystem.name.toLowerCase(),
        message: `${ecosystem.name} is unhealthy`,
        metrics: this.metrics.ecosystemsStatus[ecosystem.name]
      });
    }
    
    // Trigger warnings for slow ecosystems
    const slowEcosystems = this.ecosystems.filter(e => {
      const status = this.metrics.ecosystemsStatus[e.name];
      return status.responseTime > 5000 && e.status !== 'unhealthy';
    });
    
    for (const ecosystem of slowEcosystems) {
      await this.triggerAlert({
        type: 'high_response_time',
        severity: 'medium',
        target: ecosystem.name.toLowerCase(),
        message: `${ecosystem.name} response time is high`,
        metrics: this.metrics.ecosystemsStatus[ecosystem.name]
      });
    }
    
    // Check overall system health
    const healthyCount = this.ecosystems.filter(e => e.status === 'healthy').length;
    const healthyPercentage = (healthyCount / this.ecosystems.length) * 100;
    
    if (healthyPercentage < 50) {
      await this.triggerAlert({
        type: 'system_degraded',
        severity: 'critical',
        target: 'nexia_ecosystem',
        message: `Only ${healthyPercentage.toFixed(1)}% of ecosystems are healthy`,
        metrics: { healthyPercentage, healthyCount, totalCount: this.ecosystems.length }
      });
    }
  }

  async triggerAlert(alert) {
    // Rate limiting at monitoring level
    const alertKey = `${alert.type}_${alert.target}`;
    const now = Date.now();
    const rateLimitMs = parseInt(process.env.ALERT_RATE_LIMIT) || 300000; // 5 minutes default
    
    if (this.lastAlertTime.has(alertKey)) {
      const lastTime = this.lastAlertTime.get(alertKey);
      if (now - lastTime < rateLimitMs) {
        logger.debug(`Monitoring rate limiting alert: ${alertKey} (${Math.round((now - lastTime) / 1000)}s ago)`);
        return;
      }
    }
    
    this.lastAlertTime.set(alertKey, now);
    
    // Clean old entries
    for (const [key, time] of this.lastAlertTime.entries()) {
      if (now - time > rateLimitMs) {
        this.lastAlertTime.delete(key);
      }
    }
    
    // Create alert through escalation manager (includes rate limiting)
    if (global.nexiaAgent && global.nexiaAgent.escalationManager) {
      const createdAlert = global.nexiaAgent.escalationManager.createAlert(alert);
      
      if (!createdAlert) {
        // Alert was rate limited
        logger.debug('Escalation rate limited:', alert.type, alert.target);
        return;
      }
      
      logger.warn('Alert triggered:', {
        id: createdAlert.id,
        type: alert.type,
        target: alert.target,
        severity: alert.severity
      });
    } else {
      logger.warn('Escalation manager not available, logging alert:', alert);
    }
    
    // Send to supervisor agent for decision making
    if (global.nexiaAgent && global.nexiaAgent.supervisorAgent) {
      await global.nexiaAgent.supervisorAgent.makeDecision(alert);
    }
  }

  async collectMetrics() {
    if (!this.isInitialized) {
      return;
    }

    // Collect system metrics (simplified for demo)
    const systemMetrics = {
      timestamp: new Date().toISOString(),
      ecosystems: this.ecosystems.length,
      healthy: this.ecosystems.filter(e => e.status === 'healthy').length,
      warning: this.ecosystems.filter(e => e.status === 'warning').length,
      unhealthy: this.ecosystems.filter(e => e.status === 'unhealthy').length,
      averageResponseTime: Math.round(this.metrics.averageResponseTime),
      totalChecks: this.metrics.checks,
      successRate: this.metrics.checks > 0 ? 
        Math.round((this.metrics.successes / this.metrics.checks) * 100) : 0
    };

    logger.debug('Collected system metrics:', systemMetrics);
    
    // Store metrics (in production, this would go to a time-series database)
    await this.storeMetrics(systemMetrics);
    
    return systemMetrics;
  }

  async storeMetrics(metrics) {
    // In production, store to time-series database
    // For now, just send to NEXIA Supervisor
    try {
      await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/metrics`, {
        source: 'claude_agent',
        type: 'ecosystem_monitoring',
        data: metrics
      });
    } catch (error) {
      logger.debug('Failed to store metrics:', error.message);
    }
  }

  async getEcosystemsStatus() {
    return {
      timestamp: new Date().toISOString(),
      ecosystems: this.ecosystems.map(e => ({
        name: e.name,
        status: e.status,
        url: e.url,
        ...this.metrics.ecosystemsStatus[e.name]
      })),
      summary: {
        total: this.ecosystems.length,
        healthy: this.ecosystems.filter(e => e.status === 'healthy').length,
        warning: this.ecosystems.filter(e => e.status === 'warning').length,
        unhealthy: this.ecosystems.filter(e => e.status === 'unhealthy').length
      }
    };
  }

  async getMetrics() {
    return {
      ...this.metrics,
      systemMetrics: await this.collectMetrics()
    };
  }

  async shutdown() {
    logger.info('Shutting down Monitoring Service');
    this.isInitialized = false;
  }
}

module.exports = MonitoringService;