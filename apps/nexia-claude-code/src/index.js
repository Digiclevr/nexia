const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();

const logger = require('./utils/logger');
const SupervisorAgent = require('./agents/supervisor');
const MonitoringService = require('./monitoring/service');
const EscalationManager = require('./escalation/manager');
const HealthChecker = require('./health/checker');

class NexiaClaudeAgent {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 7013;
    this.agentId = process.env.AGENT_ID || 'nexia-claude-001';
    
    // Core components
    this.supervisorAgent = new SupervisorAgent();
    this.monitoring = new MonitoringService();
    this.escalation = new EscalationManager();
    this.health = new HealthChecker();
    
    // Agent state
    this.isRunning = false;
    this.startTime = Date.now();
    this.lastActivity = Date.now();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupScheduledTasks();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:7014'],
      credentials: true
    }));
    this.app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Health and status endpoints
    this.app.get('/health', (req, res) => {
      const health = this.health.getStatus();
      res.status(health.status === 'healthy' ? 200 : 503).json(health);
    });

    this.app.get('/status', (req, res) => {
      res.json({
        agentId: this.agentId,
        status: this.isRunning ? 'active' : 'stopped',
        uptime: Date.now() - this.startTime,
        lastActivity: this.lastActivity,
        version: process.env.AGENT_VERSION || '1.0.0',
        mode: process.env.AGENT_MODE || 'autonomous',
        ecosystem: {
          supervisor: this.supervisorAgent.getStatus(),
          monitoring: this.monitoring.getStatus(),
          escalation: this.escalation.getStatus()
        }
      });
    });

    // Agent control endpoints
    this.app.post('/control/start', async (req, res) => {
      try {
        await this.start();
        res.json({ success: true, message: 'Agent started successfully' });
      } catch (error) {
        logger.error('Failed to start agent:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    this.app.post('/control/stop', async (req, res) => {
      try {
        await this.stop();
        res.json({ success: true, message: 'Agent stopped successfully' });
      } catch (error) {
        logger.error('Failed to stop agent:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Monitoring endpoints
    this.app.get('/monitoring/ecosystems', async (req, res) => {
      try {
        const ecosystems = await this.monitoring.getEcosystemsStatus();
        res.json(ecosystems);
      } catch (error) {
        logger.error('Failed to get ecosystems status:', error);
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/monitoring/metrics', async (req, res) => {
      try {
        const metrics = await this.monitoring.getMetrics();
        res.json(metrics);
      } catch (error) {
        logger.error('Failed to get metrics:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Escalation endpoints
    this.app.get('/escalation/alerts', (req, res) => {
      const alerts = this.escalation.getActiveAlerts();
      res.json(alerts);
    });

    this.app.post('/escalation/resolve/:alertId', (req, res) => {
      try {
        const { alertId } = req.params;
        this.escalation.resolveAlert(alertId);
        res.json({ success: true, message: `Alert ${alertId} resolved` });
      } catch (error) {
        logger.error('Failed to resolve alert:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Agent delegation level
    this.app.get('/delegation-level', (req, res) => {
      res.json({
        current: this.supervisorAgent.getDelegationLevel(),
        available: ['monitor', 'alert', 'deploy', 'scale', 'full'],
        description: {
          monitor: 'Monitor only, no actions',
          alert: 'Monitor and alert humans',
          deploy: 'Monitor, alert, and deploy',
          scale: 'Monitor, alert, deploy, and scale',
          full: 'Full autonomous operations'
        }
      });
    });

    this.app.post('/delegation-level', (req, res) => {
      try {
        const { level } = req.body;
        this.supervisorAgent.setDelegationLevel(level);
        logger.info(`Delegation level changed to: ${level}`);
        res.json({ success: true, level });
      } catch (error) {
        logger.error('Failed to change delegation level:', error);
        res.status(400).json({ error: error.message });
      }
    });
  }

  setupScheduledTasks() {
    // Ecosystem monitoring every minute
    cron.schedule('* * * * *', async () => {
      if (this.isRunning) {
        await this.monitoring.checkEcosystems();
        this.lastActivity = Date.now();
      }
    });

    // Metrics collection every 30 seconds
    cron.schedule('*/30 * * * * *', async () => {
      if (this.isRunning) {
        await this.monitoring.collectMetrics();
      }
    });
    
    // Memory cleanup every 10 minutes
    cron.schedule('*/10 * * * *', () => {
      if (this.isRunning) {
        this.performMemoryCleanup();
      }
    });

    // Health self-check every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      if (this.isRunning) {
        await this.health.performSelfCheck();
      }
    });

    // Report generation every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      if (this.isRunning) {
        await this.supervisorAgent.generateReport();
      }
    });

    // Daily summary at midnight
    cron.schedule('0 0 * * *', async () => {
      if (this.isRunning) {
        await this.supervisorAgent.generateDailySummary();
      }
    });
  }

  async start() {
    if (this.isRunning) {
      throw new Error('Agent is already running');
    }

    logger.info(`Starting NEXIA Claude Code Agent ${this.agentId}`);
    
    // Initialize components
    await this.health.initialize();
    await this.monitoring.initialize();
    await this.escalation.initialize();
    await this.supervisorAgent.initialize();

    this.isRunning = true;
    this.lastActivity = Date.now();
    
    // Expose components globally for cross-component access
    global.nexiaAgent = {
      escalationManager: this.escalation,
      supervisorAgent: this.supervisorAgent,
      monitoring: this.monitoring,
      health: this.health
    };

    logger.info('NEXIA Claude Code Agent started successfully');
    
    // Notify NEXIA Supervisor
    await this.notifyNexiaSupervisor('agent_started');
  }

  performMemoryCleanup() {
    logger.debug('Performing memory cleanup...');
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      logger.debug('Forced garbage collection');
    }
    
    // Clean up escalation manager old entries
    if (this.escalation && this.escalation.alertRateLimiter) {
      const now = Date.now();
      const rateLimitWindow = 5 * 60 * 1000;
      let cleaned = 0;
      
      for (const [key, value] of this.escalation.alertRateLimiter.entries()) {
        if (now - value.timestamp > rateLimitWindow) {
          this.escalation.alertRateLimiter.delete(key);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        logger.debug(`Cleaned ${cleaned} old rate limit entries`);
      }
    }
    
    // Clean up monitoring rate limiter
    if (this.monitoring && this.monitoring.lastAlertTime) {
      const now = Date.now();
      const rateLimitMs = parseInt(process.env.ALERT_RATE_LIMIT) || 300000;
      let cleaned = 0;
      
      for (const [key, time] of this.monitoring.lastAlertTime.entries()) {
        if (now - time > rateLimitMs) {
          this.monitoring.lastAlertTime.delete(key);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        logger.debug(`Cleaned ${cleaned} old monitoring rate limit entries`);
      }
    }
    
    const memUsage = process.memoryUsage();
    logger.debug('Memory usage after cleanup:', {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    });
  }

  async stop() {
    if (!this.isRunning) {
      throw new Error('Agent is not running');
    }

    logger.info('Stopping NEXIA Claude Code Agent');
    
    this.isRunning = false;
    
    // Graceful shutdown of components
    await this.supervisorAgent.shutdown();
    await this.monitoring.shutdown();
    await this.escalation.shutdown();

    logger.info('NEXIA Claude Code Agent stopped');
    
    // Notify NEXIA Supervisor
    await this.notifyNexiaSupervisor('agent_stopped');
  }

  async notifyNexiaSupervisor(event) {
    try {
      const axios = require('axios');
      await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/agent/events`, {
        agentId: this.agentId,
        event,
        timestamp: new Date().toISOString(),
        status: this.isRunning ? 'active' : 'stopped'
      });
    } catch (error) {
      logger.warn('Failed to notify NEXIA Supervisor:', error.message);
    }
  }

  async listen() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        logger.info(`NEXIA Claude Code Agent listening on port ${this.port}`);
        resolve();
      });
    });
  }

  async shutdown() {
    if (this.isRunning) {
      await this.stop();
    }
    
    if (this.server) {
      this.server.close();
    }
  }
}

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal');
  if (global.nexiaAgent) {
    await global.nexiaAgent.shutdown();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal');
  if (global.nexiaAgent) {
    await global.nexiaAgent.shutdown();
  }
  process.exit(0);
});

// Start the agent
async function main() {
  try {
    const agent = new NexiaClaudeAgent();
    global.nexiaAgent = agent;
    
    await agent.listen();
    await agent.start();
    
    logger.info('🧠 NEXIA Claude Code Agent 24/7 is operational');
  } catch (error) {
    logger.error('Failed to start NEXIA Claude Code Agent:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = NexiaClaudeAgent;