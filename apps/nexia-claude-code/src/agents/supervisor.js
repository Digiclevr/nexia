const axios = require('axios');
const logger = require('../utils/logger');

class SupervisorAgent {
  constructor() {
    this.delegationLevel = process.env.AGENT_MODE === 'autonomous' ? 'alert' : 'monitor';
    this.isInitialized = false;
    this.reports = [];
    this.decisions = [];
  }

  async initialize() {
    logger.info('Initializing Supervisor Agent');
    
    // Test connection to NEXIA Supervisor
    try {
      await this.testNexiaSupervisorConnection();
      this.isInitialized = true;
      logger.info('Supervisor Agent initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Supervisor Agent:', error);
      throw error;
    }
  }

  async testNexiaSupervisorConnection() {
    const supervisorUrl = process.env.NEXIA_SUPERVISOR_URL;
    if (!supervisorUrl) {
      throw new Error('NEXIA_SUPERVISOR_URL not configured');
    }

    try {
      const response = await axios.get(`${supervisorUrl}/api/health`, {
        timeout: 5000
      });
      
      if (response.status === 200) {
        logger.info('NEXIA Supervisor connection verified');
        return true;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      logger.error('NEXIA Supervisor connection failed:', error.message);
      throw new Error('Cannot connect to NEXIA Supervisor');
    }
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      delegationLevel: this.delegationLevel,
      decisions: this.decisions.length,
      reports: this.reports.length,
      capabilities: this.getCapabilities()
    };
  }

  getCapabilities() {
    const capabilities = ['monitor', 'alert'];
    
    if (['deploy', 'scale', 'full'].includes(this.delegationLevel)) {
      capabilities.push('deploy');
    }
    
    if (['scale', 'full'].includes(this.delegationLevel)) {
      capabilities.push('scale');
    }
    
    if (this.delegationLevel === 'full') {
      capabilities.push('autonomous_operations');
    }
    
    return capabilities;
  }

  getDelegationLevel() {
    return this.delegationLevel;
  }

  setDelegationLevel(level) {
    const validLevels = ['monitor', 'alert', 'deploy', 'scale', 'full'];
    
    if (!validLevels.includes(level)) {
      throw new Error(`Invalid delegation level: ${level}. Valid levels: ${validLevels.join(', ')}`);
    }
    
    const previousLevel = this.delegationLevel;
    this.delegationLevel = level;
    
    logger.info(`Delegation level changed from ${previousLevel} to ${level}`);
    
    this.decisions.push({
      timestamp: new Date().toISOString(),
      type: 'delegation_change',
      from: previousLevel,
      to: level,
      reason: 'manual_change'
    });
    
    return level;
  }

  async makeDecision(situation) {
    const decision = {
      id: `decision_${Date.now()}`,
      timestamp: new Date().toISOString(),
      situation,
      delegationLevel: this.delegationLevel,
      action: null,
      reasoning: null,
      executed: false
    };

    try {
      // Analyze situation based on delegation level
      switch (this.delegationLevel) {
        case 'monitor':
          decision.action = 'log_only';
          decision.reasoning = 'Monitor mode: logging event only';
          break;
          
        case 'alert':
          decision.action = 'alert_human';
          decision.reasoning = 'Alert mode: notifying human operators';
          await this.alertHumans(situation);
          decision.executed = true;
          break;
          
        case 'deploy':
          if (situation.type === 'service_down' && situation.severity === 'high') {
            decision.action = 'auto_restart';
            decision.reasoning = 'Deploy mode: automatically restarting failed service';
            await this.executeRestart(situation.target);
            decision.executed = true;
          } else {
            decision.action = 'alert_human';
            decision.reasoning = 'Deploy mode: situation requires human judgment';
            await this.alertHumans(situation);
            decision.executed = true;
          }
          break;
          
        case 'scale':
          if (situation.type === 'high_load') {
            decision.action = 'auto_scale';
            decision.reasoning = 'Scale mode: automatically scaling resources';
            await this.executeScaling(situation.target, situation.metrics);
            decision.executed = true;
          } else {
            decision.action = 'deploy_or_alert';
            decision.reasoning = 'Scale mode: falling back to deploy actions';
            await this.makeDecision({...situation, delegationLevel: 'deploy'});
          }
          break;
          
        case 'full':
          decision.action = 'autonomous_response';
          decision.reasoning = 'Full mode: autonomous response based on situation analysis';
          await this.executeAutonomousResponse(situation);
          decision.executed = true;
          break;
      }

      this.decisions.push(decision);
      logger.info('Decision made:', { 
        id: decision.id, 
        action: decision.action, 
        executed: decision.executed 
      });
      
      return decision;
      
    } catch (error) {
      decision.action = 'error';
      decision.reasoning = `Failed to execute decision: ${error.message}`;
      decision.error = error.message;
      
      this.decisions.push(decision);
      logger.error('Decision execution failed:', error);
      
      return decision;
    }
  }

  async alertHumans(situation) {
    logger.warn('HUMAN ALERT:', situation);
    
    // Send alert to NEXIA Supervisor
    try {
      await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/alerts`, {
        source: 'claude_agent',
        severity: situation.severity || 'medium',
        type: situation.type,
        message: situation.message,
        target: situation.target,
        timestamp: new Date().toISOString(),
        requiresAction: true
      });
    } catch (error) {
      logger.error('Failed to send alert to NEXIA Supervisor:', error.message);
    }
  }

  async executeRestart(target) {
    logger.info(`Executing restart for: ${target}`);
    
    try {
      const response = await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/control/deploy`, {
        ecosystem: target,
        action: 'restart',
        source: 'claude_agent',
        automated: true
      });
      
      if (response.data.success) {
        logger.info(`Restart successful for ${target}:`, response.data.taskId);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Restart failed');
      }
    } catch (error) {
      logger.error(`Restart failed for ${target}:`, error.message);
      throw error;
    }
  }

  async executeScaling(target, metrics) {
    logger.info(`Executing scaling for: ${target}`, metrics);
    
    // Calculate optimal replicas based on metrics
    const currentReplicas = metrics.replicas || 1;
    const cpuUsage = metrics.cpu || 0;
    const memoryUsage = metrics.memory || 0;
    
    let targetReplicas = currentReplicas;
    
    if (cpuUsage > 80 || memoryUsage > 85) {
      targetReplicas = Math.min(currentReplicas * 2, 10); // Scale up, max 10 replicas
    } else if (cpuUsage < 30 && memoryUsage < 40 && currentReplicas > 1) {
      targetReplicas = Math.max(Math.floor(currentReplicas / 2), 1); // Scale down, min 1 replica
    }
    
    if (targetReplicas !== currentReplicas) {
      try {
        const response = await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/control/deploy`, {
          ecosystem: target,
          action: 'scale',
          replicas: targetReplicas,
          source: 'claude_agent',
          automated: true,
          reason: `CPU: ${cpuUsage}%, Memory: ${memoryUsage}%`
        });
        
        if (response.data.success) {
          logger.info(`Scaling successful for ${target}: ${currentReplicas} → ${targetReplicas} replicas`);
          return response.data;
        } else {
          throw new Error(response.data.message || 'Scaling failed');
        }
      } catch (error) {
        logger.error(`Scaling failed for ${target}:`, error.message);
        throw error;
      }
    } else {
      logger.info(`No scaling needed for ${target}: ${currentReplicas} replicas optimal`);
      return { message: 'No scaling needed', currentReplicas };
    }
  }

  async executeAutonomousResponse(situation) {
    logger.info('Executing autonomous response for situation:', situation);
    
    // Full autonomous mode - make intelligent decisions
    switch (situation.type) {
      case 'service_down':
        await this.executeRestart(situation.target);
        break;
        
      case 'high_load':
        await this.executeScaling(situation.target, situation.metrics);
        break;
        
      case 'error_rate_high':
        // Try restart first, then scale if needed
        await this.executeRestart(situation.target);
        setTimeout(async () => {
          // Check if restart resolved the issue after 2 minutes
          const metrics = await this.getTargetMetrics(situation.target);
          if (metrics.errorRate > 5) {
            await this.executeScaling(situation.target, metrics);
          }
        }, 120000);
        break;
        
      default:
        await this.alertHumans(situation);
    }
  }

  async getTargetMetrics(target) {
    // Mock metrics - in production, this would fetch real metrics
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      errorRate: Math.random() * 10,
      replicas: 2
    };
  }

  async generateReport() {
    const report = {
      id: `report_${Date.now()}`,
      timestamp: new Date().toISOString(),
      period: '15min',
      decisions: this.decisions.slice(-10), // Last 10 decisions
      summary: {
        totalDecisions: this.decisions.length,
        executedDecisions: this.decisions.filter(d => d.executed).length,
        delegationLevel: this.delegationLevel,
        status: 'operational'
      }
    };

    this.reports.push(report);
    
    // Keep only last 100 reports
    if (this.reports.length > 100) {
      this.reports = this.reports.slice(-100);
    }

    logger.info('Generated periodic report:', report.id);
    return report;
  }

  async generateDailySummary() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dailyDecisions = this.decisions.filter(d => 
      new Date(d.timestamp) >= yesterday
    );

    const summary = {
      date: yesterday.toISOString().split('T')[0],
      totalDecisions: dailyDecisions.length,
      executedActions: dailyDecisions.filter(d => d.executed).length,
      actionTypes: {},
      delegationLevel: this.delegationLevel,
      uptime: '24h', // Would be calculated from actual uptime
      status: 'healthy'
    };

    // Count action types
    dailyDecisions.forEach(d => {
      summary.actionTypes[d.action] = (summary.actionTypes[d.action] || 0) + 1;
    });

    logger.info('Generated daily summary:', summary);
    
    // Send to NEXIA Supervisor for archival
    try {
      await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/reports/daily`, summary);
    } catch (error) {
      logger.error('Failed to send daily summary:', error.message);
    }

    return summary;
  }

  async shutdown() {
    logger.info('Shutting down Supervisor Agent');
    this.isInitialized = false;
  }
}

module.exports = SupervisorAgent;