const logger = require('../utils/logger');

class EscalationManager {
  constructor() {
    this.alerts = new Map();
    this.alertRateLimiter = new Map(); // Rate limiting for duplicate alerts
    this.escalationRules = [
      {
        severity: 'critical',
        timeout: 300000, // 5 minutes
        actions: ['immediate_human_alert', 'page_oncall', 'emergency_contact']
      },
      {
        severity: 'high',
        timeout: 900000, // 15 minutes
        actions: ['human_alert', 'slack_notification']
      },
      {
        severity: 'medium',
        timeout: 3600000, // 1 hour
        actions: ['dashboard_alert', 'email_notification']
      },
      {
        severity: 'low',
        timeout: 14400000, // 4 hours
        actions: ['log_alert']
      }
    ];
    this.isInitialized = false;
  }

  async initialize() {
    logger.info('Initializing Escalation Manager');
    this.isInitialized = true;
    
    // Start escalation monitoring
    this.startEscalationMonitoring();
    
    logger.info('Escalation Manager initialized');
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      activeAlerts: this.alerts.size,
      escalationRules: this.escalationRules.length
    };
  }

  createAlert(alertData) {
    // Rate limiting: check for duplicate alerts
    const alertKey = `${alertData.type}_${alertData.target}`;
    const now = Date.now();
    const rateLimitWindow = 5 * 60 * 1000; // 5 minutes
    
    if (this.alertRateLimiter.has(alertKey)) {
      const lastAlert = this.alertRateLimiter.get(alertKey);
      if (now - lastAlert.timestamp < rateLimitWindow) {
        lastAlert.count++;
        if (lastAlert.count <= 3) {
          logger.debug(`Rate limiting alert: ${alertKey} (count: ${lastAlert.count})`);
          return null; // Don't create duplicate alert
        }
      }
    }
    
    // Update rate limiter
    this.alertRateLimiter.set(alertKey, { timestamp: now, count: 1 });
    
    // Clean old rate limit entries
    for (const [key, value] of this.alertRateLimiter.entries()) {
      if (now - value.timestamp > rateLimitWindow) {
        this.alertRateLimiter.delete(key);
      }
    }

    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...alertData,
      status: 'active',
      createdAt: new Date().toISOString(),
      escalationLevel: 0,
      lastEscalation: null,
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null
    };

    this.alerts.set(alert.id, alert);
    
    // Memory management: keep only last 100 alerts
    if (this.alerts.size > 100) {
      const oldestAlert = this.alerts.keys().next().value;
      this.alerts.delete(oldestAlert);
    }
    
    logger.warn('Alert created:', {
      id: alert.id,
      severity: alert.severity,
      type: alert.type,
      target: alert.target
    });

    // Schedule immediate escalation check
    setTimeout(() => this.checkEscalation(alert.id), 1000);

    return alert;
  }

  acknowledgeAlert(alertId, acknowledgedBy = 'system') {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date().toISOString();
    alert.status = 'acknowledged';

    this.alerts.set(alertId, alert);

    logger.info('Alert acknowledged:', {
      id: alertId,
      acknowledgedBy,
      acknowledgedAt: alert.acknowledgedAt
    });

    return alert;
  }

  resolveAlert(alertId, resolvedBy = 'system', resolution = null) {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    alert.status = 'resolved';
    alert.resolvedBy = resolvedBy;
    alert.resolvedAt = new Date().toISOString();
    alert.resolution = resolution;

    this.alerts.set(alertId, alert);

    logger.info('Alert resolved:', {
      id: alertId,
      resolvedBy,
      resolution,
      duration: new Date(alert.resolvedAt) - new Date(alert.createdAt)
    });

    return alert;
  }

  getActiveAlerts() {
    const activeAlerts = Array.from(this.alerts.values())
      .filter(alert => alert.status === 'active' || alert.status === 'acknowledged')
      .sort((a, b) => {
        // Sort by severity priority: critical > high > medium > low
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });

    return activeAlerts;
  }

  getAlertHistory() {
    return Array.from(this.alerts.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  startEscalationMonitoring() {
    // Check escalations every 30 seconds
    setInterval(() => {
      if (this.isInitialized) {
        this.checkAllEscalations();
      }
    }, 30000);
  }

  checkAllEscalations() {
    const activeAlerts = this.getActiveAlerts();
    
    for (const alert of activeAlerts) {
      this.checkEscalation(alert.id);
    }
  }

  checkEscalation(alertId) {
    const alert = this.alerts.get(alertId);
    if (!alert || alert.status === 'resolved') {
      return;
    }

    const rule = this.escalationRules.find(r => r.severity === alert.severity);
    if (!rule) {
      logger.warn(`No escalation rule found for severity: ${alert.severity}`);
      return;
    }

    const now = Date.now();
    const alertAge = now - new Date(alert.createdAt).getTime();
    const timeSinceLastEscalation = alert.lastEscalation ? 
      now - new Date(alert.lastEscalation).getTime() : alertAge;

    // Check if escalation is needed
    if (!alert.acknowledged && alertAge >= rule.timeout) {
      this.escalateAlert(alert, rule);
    } else if (alert.acknowledged && timeSinceLastEscalation >= rule.timeout * 2) {
      // Re-escalate acknowledged but unresolved alerts after double timeout
      this.escalateAlert(alert, rule, true);
    }
  }

  async escalateAlert(alert, rule, isReEscalation = false) {
    alert.escalationLevel++;
    alert.lastEscalation = new Date().toISOString();

    const escalationType = isReEscalation ? 're-escalation' : 'escalation';

    logger.warn(`Alert ${escalationType}:`, {
      id: alert.id,
      severity: alert.severity,
      escalationLevel: alert.escalationLevel,
      actions: rule.actions
    });

    // Execute escalation actions
    for (const action of rule.actions) {
      try {
        await this.executeEscalationAction(action, alert);
      } catch (error) {
        logger.error(`Failed to execute escalation action ${action}:`, error);
      }
    }

    this.alerts.set(alert.id, alert);
  }

  async executeEscalationAction(action, alert) {
    logger.info(`Executing escalation action: ${action}`, {
      alertId: alert.id,
      severity: alert.severity
    });

    switch (action) {
      case 'immediate_human_alert':
        await this.sendImmediateHumanAlert(alert);
        break;

      case 'page_oncall':
        await this.pageOnCall(alert);
        break;

      case 'emergency_contact':
        await this.contactEmergency(alert);
        break;

      case 'human_alert':
        await this.sendHumanAlert(alert);
        break;

      case 'slack_notification':
        await this.sendSlackNotification(alert);
        break;

      case 'dashboard_alert':
        await this.sendDashboardAlert(alert);
        break;

      case 'email_notification':
        await this.sendEmailNotification(alert);
        break;

      case 'log_alert':
        await this.logAlert(alert);
        break;

      default:
        logger.warn(`Unknown escalation action: ${action}`);
    }
  }

  async sendImmediateHumanAlert(alert) {
    logger.error('🚨 IMMEDIATE HUMAN ALERT 🚨', {
      alert: alert.id,
      message: alert.message,
      target: alert.target,
      severity: alert.severity
    });

    // Send to NEXIA Supervisor with highest priority
    try {
      const axios = require('axios');
      await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/alerts/immediate`, {
        ...alert,
        priority: 'immediate',
        source: 'claude_agent_escalation'
      });
    } catch (error) {
      logger.error('Failed to send immediate alert to NEXIA Supervisor:', error.message);
    }
  }

  async pageOnCall(alert) {
    logger.warn('📟 Paging on-call engineer', alert.id);
    // In production: integrate with PagerDuty, OpsGenie, etc.
  }

  async contactEmergency(alert) {
    logger.error('🆘 Emergency contact triggered', alert.id);
    // In production: SMS, phone calls, etc.
  }

  async sendHumanAlert(alert) {
    logger.warn('👤 Human alert sent', alert.id);
    // Send to NEXIA Supervisor dashboard
    try {
      const axios = require('axios');
      await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/alerts`, {
        ...alert,
        priority: 'high',
        source: 'claude_agent_escalation'
      });
    } catch (error) {
      logger.error('Failed to send human alert:', error.message);
    }
  }

  async sendSlackNotification(alert) {
    logger.info('💬 Slack notification sent', alert.id);
    // In production: integrate with Slack API
  }

  async sendDashboardAlert(alert) {
    logger.info('📊 Dashboard alert sent', alert.id);
    // Send to NEXIA Supervisor dashboard
    try {
      const axios = require('axios');
      await axios.post(`${process.env.NEXIA_SUPERVISOR_URL}/api/alerts`, {
        ...alert,
        priority: 'medium',
        source: 'claude_agent_escalation'
      });
    } catch (error) {
      logger.debug('Failed to send dashboard alert:', error.message);
    }
  }

  async sendEmailNotification(alert) {
    logger.info('📧 Email notification sent', alert.id);
    // In production: integrate with email service
  }

  async logAlert(alert) {
    logger.info('📝 Alert logged', {
      id: alert.id,
      type: alert.type,
      target: alert.target,
      message: alert.message
    });
  }

  async shutdown() {
    logger.info('Shutting down Escalation Manager');
    this.isInitialized = false;
  }
}

module.exports = EscalationManager;