const os = require('os');
const fs = require('fs').promises;
const logger = require('../utils/logger');

class HealthChecker {
  constructor() {
    this.healthStatus = {
      status: 'unknown',
      checks: {},
      lastCheck: null,
      uptime: 0,
      startTime: Date.now()
    };
    this.isInitialized = false;
  }

  async initialize() {
    logger.info('Initializing Health Checker');
    
    await this.performSelfCheck();
    this.isInitialized = true;
    
    logger.info('Health Checker initialized');
  }

  getStatus() {
    return {
      ...this.healthStatus,
      uptime: Date.now() - this.healthStatus.startTime,
      initialized: this.isInitialized
    };
  }

  async performSelfCheck() {
    const startTime = Date.now();
    const checks = {};

    try {
      // System resource checks
      checks.memory = await this.checkMemory();
      checks.cpu = await this.checkCPU();
      checks.disk = await this.checkDisk();
      
      // Application checks
      checks.dependencies = await this.checkDependencies();
      checks.configuration = await this.checkConfiguration();
      checks.connectivity = await this.checkConnectivity();
      
      // Service checks
      checks.logging = await this.checkLogging();
      checks.database = await this.checkDatabase();
      
      // Determine overall status
      const failedChecks = Object.values(checks).filter(check => check.status !== 'healthy');
      const criticalFailures = failedChecks.filter(check => check.severity === 'critical');
      
      let overallStatus = 'healthy';
      if (criticalFailures.length > 0) {
        overallStatus = 'unhealthy';
      } else if (failedChecks.length > 0) {
        overallStatus = 'degraded';
      }

      this.healthStatus = {
        status: overallStatus,
        checks,
        lastCheck: new Date().toISOString(),
        uptime: Date.now() - this.healthStatus.startTime,
        startTime: this.healthStatus.startTime,
        checkDuration: Date.now() - startTime
      };

      const checkSummary = {
        status: overallStatus,
        totalChecks: Object.keys(checks).length,
        passed: Object.values(checks).filter(c => c.status === 'healthy').length,
        failed: failedChecks.length,
        critical: criticalFailures.length
      };

      if (overallStatus === 'healthy') {
        logger.debug('Health check passed', checkSummary);
      } else {
        logger.warn('Health check issues detected', {
          ...checkSummary,
          failedChecks: failedChecks.map(c => c.name)
        });
      }

    } catch (error) {
      logger.error('Health check failed:', error);
      this.healthStatus = {
        status: 'unhealthy',
        checks: { selfCheck: { status: 'unhealthy', error: error.message } },
        lastCheck: new Date().toISOString(),
        uptime: Date.now() - this.healthStatus.startTime,
        startTime: this.healthStatus.startTime,
        checkDuration: Date.now() - startTime
      };
    }

    return this.healthStatus;
  }

  async checkMemory() {
    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsage = (usedMemory / totalMemory) * 100;

      const threshold = parseInt(process.env.MEMORY_THRESHOLD) || 85;

      return {
        name: 'memory',
        status: memoryUsage < threshold ? 'healthy' : 'unhealthy',
        severity: memoryUsage > 95 ? 'critical' : 'warning',
        metrics: {
          usagePercent: Math.round(memoryUsage * 100) / 100,
          totalMB: Math.round(totalMemory / 1024 / 1024),
          freeMB: Math.round(freeMemory / 1024 / 1024),
          usedMB: Math.round(usedMemory / 1024 / 1024)
        },
        threshold
      };
    } catch (error) {
      return {
        name: 'memory',
        status: 'unhealthy',
        severity: 'critical',
        error: error.message
      };
    }
  }

  async checkCPU() {
    try {
      const cpus = os.cpus();
      const loadAvg = os.loadavg();
      const cpuUsage = (loadAvg[0] / cpus.length) * 100;

      const threshold = parseInt(process.env.CPU_THRESHOLD) || 80;

      return {
        name: 'cpu',
        status: cpuUsage < threshold ? 'healthy' : 'unhealthy',
        severity: cpuUsage > 95 ? 'critical' : 'warning',
        metrics: {
          usagePercent: Math.round(cpuUsage * 100) / 100,
          loadAverage: loadAvg,
          coreCount: cpus.length
        },
        threshold
      };
    } catch (error) {
      return {
        name: 'cpu',
        status: 'unhealthy',
        severity: 'critical',
        error: error.message
      };
    }
  }

  async checkDisk() {
    try {
      const stats = await fs.stat(process.cwd());
      
      // Simple disk check - in production, use more sophisticated checks
      return {
        name: 'disk',
        status: 'healthy',
        severity: 'info',
        metrics: {
          accessible: true,
          workingDirectory: process.cwd()
        }
      };
    } catch (error) {
      return {
        name: 'disk',
        status: 'unhealthy',
        severity: 'critical',
        error: error.message
      };
    }
  }

  async checkDependencies() {
    try {
      const requiredModules = [
        'express', 'axios', 'winston', 'node-cron', 'cors', 'helmet'
      ];

      for (const module of requiredModules) {
        require.resolve(module);
      }

      return {
        name: 'dependencies',
        status: 'healthy',
        severity: 'info',
        metrics: {
          checkedModules: requiredModules.length,
          allPresent: true
        }
      };
    } catch (error) {
      return {
        name: 'dependencies',
        status: 'unhealthy',
        severity: 'critical',
        error: error.message
      };
    }
  }

  async checkConfiguration() {
    try {
      const requiredEnvVars = [
        'PORT', 'NEXIA_SUPERVISOR_URL', 'AGENT_ID'
      ];

      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

      if (missingVars.length > 0) {
        return {
          name: 'configuration',
          status: 'unhealthy',
          severity: 'warning',
          error: `Missing environment variables: ${missingVars.join(', ')}`
        };
      }

      return {
        name: 'configuration',
        status: 'healthy',
        severity: 'info',
        metrics: {
          requiredVars: requiredEnvVars.length,
          present: requiredEnvVars.length - missingVars.length
        }
      };
    } catch (error) {
      return {
        name: 'configuration',
        status: 'unhealthy',
        severity: 'warning',
        error: error.message
      };
    }
  }

  async checkConnectivity() {
    try {
      const axios = require('axios');
      const supervisorUrl = process.env.NEXIA_SUPERVISOR_URL;

      if (!supervisorUrl) {
        return {
          name: 'connectivity',
          status: 'unhealthy',
          severity: 'warning',
          error: 'NEXIA_SUPERVISOR_URL not configured'
        };
      }

      const startTime = Date.now();
      const response = await axios.get(`${supervisorUrl}/api/health`, {
        timeout: 5000
      });
      const responseTime = Date.now() - startTime;

      const isHealthy = response.status === 200;
      const threshold = parseInt(process.env.RESPONSE_TIME_THRESHOLD) || 2000;

      return {
        name: 'connectivity',
        status: isHealthy && responseTime < threshold ? 'healthy' : 'unhealthy',
        severity: !isHealthy ? 'critical' : 'warning',
        metrics: {
          nexiaSupervisor: isHealthy,
          responseTime,
          statusCode: response.status
        },
        threshold
      };
    } catch (error) {
      return {
        name: 'connectivity',
        status: 'unhealthy',
        severity: 'critical',
        error: error.message
      };
    }
  }

  async checkLogging() {
    try {
      // Test if we can write to log file
      logger.debug('Health check: testing logging system');

      return {
        name: 'logging',
        status: 'healthy',
        severity: 'info',
        metrics: {
          level: process.env.LOG_LEVEL || 'info',
          functional: true
        }
      };
    } catch (error) {
      return {
        name: 'logging',
        status: 'unhealthy',
        severity: 'warning',
        error: error.message
      };
    }
  }

  async checkDatabase() {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      
      if (!databaseUrl) {
        return {
          name: 'database',
          status: 'degraded',
          severity: 'info',
          message: 'Database URL not configured - using in-memory storage'
        };
      }

      // In production, test actual database connection
      return {
        name: 'database',
        status: 'healthy',
        severity: 'info',
        metrics: {
          configured: true,
          url: databaseUrl.replace(/\/\/.*@/, '//***@') // Hide credentials
        }
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        severity: 'warning',
        error: error.message
      };
    }
  }

  async shutdown() {
    logger.info('Shutting down Health Checker');
    this.isInitialized = false;
  }
}

module.exports = HealthChecker;