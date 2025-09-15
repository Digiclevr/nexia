const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Get all bots in the squad
router.get('/', async (req, res) => {
  try {
    const bots = await db('bots_squad')
      .orderBy('created_at', 'desc')
      .select('*');

    // Parse JSON fields
    const parsedBots = bots.map(bot => ({
      ...bot,
      specialization: JSON.parse(bot.specialization || '[]'),
      current_tasks: JSON.parse(bot.current_tasks || '[]'),
      metrics: JSON.parse(bot.metrics || '{}'),
      workflows: JSON.parse(bot.workflows || '{}')
    }));

    res.json(parsedBots);
  } catch (error) {
    console.error('Get bots squad error:', error);
    res.status(500).json({ error: 'Failed to fetch bots squad' });
  }
});

// Get specific bot
router.get('/:botId', async (req, res) => {
  try {
    const bot = await db('bots_squad')
      .where('bot_id', req.params.botId)
      .first();

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Parse JSON fields
    const parsedBot = {
      ...bot,
      specialization: JSON.parse(bot.specialization || '[]'),
      current_tasks: JSON.parse(bot.current_tasks || '[]'),
      metrics: JSON.parse(bot.metrics || '{}'),
      workflows: JSON.parse(bot.workflows || '{}')
    };

    res.json(parsedBot);
  } catch (error) {
    console.error('Get bot error:', error);
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
});

// Update bot status
router.patch('/:botId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const botId = req.params.botId;

    if (!['active', 'maintenance', 'error', 'paused'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db('bots_squad')
      .where('bot_id', botId)
      .update({
        status,
        last_activity: new Date()
      });

    const updatedBot = await db('bots_squad')
      .where('bot_id', botId)
      .first();

    // Log activity
    await db('activity_log').insert({
      agent_name: updatedBot.name,
      action: 'status_changed',
      status: 'success',
      message: `${updatedBot.name} status changed to ${status}`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('bot_status_updated', {
      bot_id: botId,
      status,
      timestamp: new Date()
    });

    res.json({
      ...updatedBot,
      specialization: JSON.parse(updatedBot.specialization || '[]'),
      current_tasks: JSON.parse(updatedBot.current_tasks || '[]'),
      metrics: JSON.parse(updatedBot.metrics || '{}'),
      workflows: JSON.parse(updatedBot.workflows || '{}')
    });
  } catch (error) {
    console.error('Update bot status error:', error);
    res.status(500).json({ error: 'Failed to update bot status' });
  }
});

// Update bot metrics
router.patch('/:botId/metrics', async (req, res) => {
  try {
    const { metrics } = req.body;
    const botId = req.params.botId;

    const bot = await db('bots_squad')
      .where('bot_id', botId)
      .first();

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Merge with existing metrics
    const currentMetrics = JSON.parse(bot.metrics || '{}');
    const updatedMetrics = { ...currentMetrics, ...metrics };

    await db('bots_squad')
      .where('bot_id', botId)
      .update({
        metrics: JSON.stringify(updatedMetrics),
        last_activity: new Date()
      });

    // Store metrics history
    await db('bot_metrics_history')
      .insert({
        bot_id: botId,
        date: new Date().toISOString().split('T')[0],
        metrics_snapshot: JSON.stringify(updatedMetrics),
        kpi_achievements: JSON.stringify({}), // To be calculated based on targets
        performance_notes: JSON.stringify({ automated_update: true })
      })
      .onConflict(['bot_id', 'date'])
      .merge(['metrics_snapshot', 'kpi_achievements']);

    const updatedBot = await db('bots_squad')
      .where('bot_id', botId)
      .first();

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('bot_metrics_updated', {
      bot_id: botId,
      metrics: updatedMetrics,
      timestamp: new Date()
    });

    res.json({
      ...updatedBot,
      specialization: JSON.parse(updatedBot.specialization || '[]'),
      current_tasks: JSON.parse(updatedBot.current_tasks || '[]'),
      metrics: JSON.parse(updatedBot.metrics || '{}'),
      workflows: JSON.parse(updatedBot.workflows || '{}')
    });
  } catch (error) {
    console.error('Update bot metrics error:', error);
    res.status(500).json({ error: 'Failed to update bot metrics' });
  }
});

// Add task to bot
router.post('/:botId/tasks', async (req, res) => {
  try {
    const { task_name, description, priority } = req.body;
    const botId = req.params.botId;

    if (!task_name || !priority) {
      return res.status(400).json({ error: 'Task name and priority are required' });
    }

    // Insert new task
    const [taskId] = await db('bot_tasks').insert({
      bot_id: botId,
      task_name,
      description,
      priority,
      status: 'pending'
    });

    // Update bot's active tasks count
    await db('bots_squad')
      .where('bot_id', botId)
      .increment('tasks_active', 1)
      .update('last_activity', new Date());

    const newTask = await db('bot_tasks').where('id', taskId).first();

    // Log activity
    await db('activity_log').insert({
      agent_name: `${botId}`,
      action: 'task_added',
      status: 'success',
      message: `New task "${task_name}" added to ${botId}`,
      metadata: JSON.stringify({ task_id: taskId, priority })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('bot_task_added', {
      bot_id: botId,
      task: newTask,
      timestamp: new Date()
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Add bot task error:', error);
    res.status(500).json({ error: 'Failed to add task to bot' });
  }
});

// Execute daily standup
router.post('/coordination/daily-standup', async (req, res) => {
  try {
    const bots = await db('bots_squad').select('*');
    
    const standupData = {
      timestamp: new Date(),
      participants: bots.length,
      bots_status: bots.map(bot => ({
        bot_id: bot.bot_id,
        name: bot.name,
        status: bot.status,
        health: bot.health,
        active_tasks: bot.tasks_active,
        last_activity: bot.last_activity
      }))
    };

    // Create coordination workflow
    const [workflowId] = await db('bot_coordination').insert({
      workflow_type: 'daily_standup',
      initiator_bot: 'coordinator-bot',
      involved_bots: JSON.stringify(bots.map(b => b.bot_id)),
      status: 'completed',
      workflow_data: JSON.stringify(standupData)
    });

    // Log activity
    await db('activity_log').insert({
      agent_name: 'CoordinatorBot',
      action: 'daily_standup_executed',
      status: 'success',
      message: `Daily standup completed with ${bots.length} bots`,
      metadata: JSON.stringify({ workflow_id: workflowId, participants: bots.length })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('daily_standup_completed', {
      workflow_id: workflowId,
      summary: standupData,
      timestamp: new Date()
    });

    res.json({
      success: true,
      workflow_id: workflowId,
      summary: standupData
    });
  } catch (error) {
    console.error('Daily standup error:', error);
    res.status(500).json({ error: 'Failed to execute daily standup' });
  }
});

// Sync all bots status
router.post('/coordination/sync-status', async (req, res) => {
  try {
    const bots = await db('bots_squad').select('*');
    
    // Simulate status synchronization
    const syncResults = [];
    
    for (const bot of bots) {
      // Update last activity
      await db('bots_squad')
        .where('bot_id', bot.bot_id)
        .update('last_activity', new Date());
      
      syncResults.push({
        bot_id: bot.bot_id,
        name: bot.name,
        sync_status: 'success',
        last_sync: new Date()
      });
    }

    // Create coordination workflow
    const [workflowId] = await db('bot_coordination').insert({
      workflow_type: 'status_sync',
      initiator_bot: 'coordinator-bot',
      involved_bots: JSON.stringify(bots.map(b => b.bot_id)),
      status: 'completed',
      workflow_data: JSON.stringify({ sync_results })
    });

    // Log activity
    await db('activity_log').insert({
      agent_name: 'CoordinatorBot',
      action: 'status_sync_completed',
      status: 'success',
      message: `Status sync completed for ${bots.length} bots`,
      metadata: JSON.stringify({ workflow_id: workflowId })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('bots_status_synced', {
      workflow_id: workflowId,
      results: syncResults,
      timestamp: new Date()
    });

    res.json({
      success: true,
      workflow_id: workflowId,
      sync_results: syncResults
    });
  } catch (error) {
    console.error('Sync status error:', error);
    res.status(500).json({ error: 'Failed to sync bots status' });
  }
});

// Generate squad report
router.post('/coordination/generate-report', async (req, res) => {
  try {
    const bots = await db('bots_squad').select('*');
    const recentActivity = await db('activity_log')
      .where('created_at', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .orderBy('created_at', 'desc')
      .limit(50);

    const report = {
      generated_at: new Date(),
      squad_overview: {
        total_bots: bots.length,
        active_bots: bots.filter(b => b.status === 'active').length,
        avg_health: Math.round(bots.reduce((sum, b) => sum + b.health, 0) / bots.length),
        total_active_tasks: bots.reduce((sum, b) => sum + b.tasks_active, 0),
        total_completed_tasks: bots.reduce((sum, b) => sum + b.tasks_completed, 0)
      },
      bots_performance: bots.map(bot => ({
        bot_id: bot.bot_id,
        name: bot.name,
        status: bot.status,
        health: bot.health,
        efficiency: bot.tasks_completed > 0 ? 
          Math.round((bot.tasks_completed / (bot.tasks_completed + bot.tasks_active)) * 100) : 0,
        last_activity: bot.last_activity
      })),
      recent_activity: recentActivity.map(activity => ({
        agent: activity.agent_name,
        action: activity.action,
        status: activity.status,
        message: activity.message,
        timestamp: activity.created_at
      }))
    };

    // Create coordination workflow
    const [workflowId] = await db('bot_coordination').insert({
      workflow_type: 'squad_report',
      initiator_bot: 'coordinator-bot',
      involved_bots: JSON.stringify(bots.map(b => b.bot_id)),
      status: 'completed',
      workflow_data: JSON.stringify(report)
    });

    // Log activity
    await db('activity_log').insert({
      agent_name: 'CoordinatorBot',
      action: 'squad_report_generated',
      status: 'success',
      message: `Squad performance report generated`,
      metadata: JSON.stringify({ workflow_id: workflowId, bots_count: bots.length })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('squad_report_generated', {
      workflow_id: workflowId,
      report: report,
      timestamp: new Date()
    });

    res.json({
      success: true,
      workflow_id: workflowId,
      report: report
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Failed to generate squad report' });
  }
});

// Emergency escalation
router.post('/coordination/emergency-escalation', async (req, res) => {
  try {
    const { issue_type, description, severity, affected_bots } = req.body;

    if (!issue_type || !description || !severity) {
      return res.status(400).json({ error: 'Issue type, description and severity are required' });
    }

    const escalation = {
      timestamp: new Date(),
      issue_type,
      description,
      severity, // critical, high, medium, low
      affected_bots: affected_bots || [],
      escalated_to: 'human_supervision',
      status: 'escalated'
    };

    // Create coordination workflow
    const [workflowId] = await db('bot_coordination').insert({
      workflow_type: 'emergency_escalation',
      initiator_bot: 'coordinator-bot',
      involved_bots: JSON.stringify(affected_bots || []),
      status: 'escalated',
      workflow_data: JSON.stringify(escalation)
    });

    // Log activity with high priority
    await db('activity_log').insert({
      agent_name: 'CoordinatorBot',
      action: 'emergency_escalation',
      status: severity === 'critical' ? 'error' : 'warning',
      message: `Emergency escalated: ${issue_type} - ${description}`,
      metadata: JSON.stringify({ 
        workflow_id: workflowId, 
        severity, 
        affected_bots,
        requires_human_action: true 
      })
    });

    // Broadcast emergency to websocket clients
    const { io } = require('../server');
    io.emit('emergency_escalated', {
      workflow_id: workflowId,
      escalation: escalation,
      timestamp: new Date(),
      requires_immediate_attention: severity === 'critical'
    });

    res.json({
      success: true,
      workflow_id: workflowId,
      escalation: escalation,
      message: 'Emergency has been escalated to human supervision'
    });
  } catch (error) {
    console.error('Emergency escalation error:', error);
    res.status(500).json({ error: 'Failed to escalate emergency' });
  }
});

// Get bot coordination workflows
router.get('/coordination/workflows', async (req, res) => {
  try {
    const { type, status, limit = 20 } = req.query;
    
    let query = db('bot_coordination').orderBy('created_at', 'desc');
    
    if (type) query = query.where('workflow_type', type);
    if (status) query = query.where('status', status);
    
    const workflows = await query.limit(parseInt(limit));

    // Parse JSON fields
    const parsedWorkflows = workflows.map(workflow => ({
      ...workflow,
      involved_bots: JSON.parse(workflow.involved_bots || '[]'),
      workflow_data: JSON.parse(workflow.workflow_data || '{}'),
      dependencies: JSON.parse(workflow.dependencies || '{}'),
      communication_log: JSON.parse(workflow.communication_log || '[]')
    }));

    res.json(parsedWorkflows);
  } catch (error) {
    console.error('Get workflows error:', error);
    res.status(500).json({ error: 'Failed to fetch coordination workflows' });
  }
});

// GUARDRAILS A+C ROUTES - CoordinatorBot Validation System

// Get pending validations (Human Approval Queue)
router.get('/guardrails/pending-validations', async (req, res) => {
  try {
    const { priority, type, limit = 20 } = req.query;
    
    let query = db('bot_validation_queue')
      .where('status', 'pending')
      .orderBy('priority', 'desc')
      .orderBy('created_at', 'asc');
    
    if (priority) query = query.where('priority', priority);
    if (type) query = query.where('validation_type', type);
    
    const validations = await query.limit(parseInt(limit));

    // Parse JSON fields and categorize by urgency
    const parsedValidations = validations.map(validation => ({
      ...validation,
      action_data: JSON.parse(validation.action_data || '{}'),
      guardrails_context: JSON.parse(validation.guardrails_context || '{}'),
      estimated_impact: validation.estimated_impact || 0,
      requires_immediate_attention: validation.priority >= 80
    }));

    // Group by validation type for dashboard
    const grouped = {
      high_value_deals: parsedValidations.filter(v => v.validation_type === 'high_value_deal'),
      strategic_decisions: parsedValidations.filter(v => v.validation_type === 'strategic_decision'),
      client_communications: parsedValidations.filter(v => v.validation_type === 'client_communication'),
      resource_reallocations: parsedValidations.filter(v => v.validation_type === 'resource_reallocation'),
      emergency_responses: parsedValidations.filter(v => v.validation_type === 'emergency_response')
    };

    res.json({
      total_pending: parsedValidations.length,
      immediate_attention: parsedValidations.filter(v => v.requires_immediate_attention).length,
      validations: parsedValidations,
      grouped_by_type: grouped
    });
  } catch (error) {
    console.error('Get pending validations error:', error);
    res.status(500).json({ error: 'Failed to fetch pending validations' });
  }
});

// Submit action for human validation (80/20 Guardrails)
router.post('/guardrails/submit-validation', async (req, res) => {
  try {
    const {
      initiator_bot,
      action_type,
      action_data,
      validation_type,
      estimated_impact,
      urgency_level,
      business_context,
      recommended_decision
    } = req.body;

    if (!initiator_bot || !action_type || !validation_type) {
      return res.status(400).json({ error: 'Initiator bot, action type and validation type are required' });
    }

    // Calculate priority based on impact and urgency
    const priority = Math.min(100, (estimated_impact || 50) + (urgency_level || 30));

    // Create validation request
    const [validationId] = await db('bot_validation_queue').insert({
      initiator_bot,
      action_type,
      action_data: JSON.stringify(action_data || {}),
      validation_type,
      priority,
      estimated_impact: estimated_impact || 0,
      status: 'pending',
      guardrails_context: JSON.stringify({
        business_context: business_context || '',
        recommended_decision: recommended_decision || '',
        urgency_level: urgency_level || 30,
        submission_time: new Date(),
        requires_claude_analysis: estimated_impact > 500
      })
    });

    // Log the validation request
    await db('activity_log').insert({
      agent_name: initiator_bot,
      action: 'validation_requested',
      status: priority >= 80 ? 'warning' : 'info',
      message: `${initiator_bot} requested validation for ${action_type} (Impact: €${estimated_impact})`,
      metadata: JSON.stringify({
        validation_id: validationId,
        validation_type,
        priority,
        estimated_impact,
        guardrails_triggered: true
      })
    });

    // Broadcast urgent validations immediately
    const { io } = require('../server');
    if (priority >= 80) {
      io.emit('urgent_validation_required', {
        validation_id: validationId,
        initiator_bot,
        action_type,
        estimated_impact,
        priority,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      validation_id: validationId,
      status: 'submitted',
      priority,
      message: 'Action submitted for human validation',
      estimated_review_time: priority >= 80 ? '< 30 minutes' : '< 2 hours'
    });
  } catch (error) {
    console.error('Submit validation error:', error);
    res.status(500).json({ error: 'Failed to submit validation request' });
  }
});

// Approve/Reject validation (Human Decision)
router.post('/guardrails/validate/:validationId', async (req, res) => {
  try {
    const { decision, feedback, adjustments } = req.body; // decision: 'approved' | 'rejected' | 'modified'
    const validationId = req.params.validationId;

    if (!['approved', 'rejected', 'modified'].includes(decision)) {
      return res.status(400).json({ error: 'Decision must be approved, rejected, or modified' });
    }

    const validation = await db('bot_validation_queue')
      .where('id', validationId)
      .first();

    if (!validation) {
      return res.status(404).json({ error: 'Validation request not found' });
    }

    // Update validation status
    await db('bot_validation_queue')
      .where('id', validationId)
      .update({
        status: decision,
        human_feedback: feedback || '',
        decision_time: new Date(),
        adjustments: JSON.stringify(adjustments || {})
      });

    // Log human decision
    await db('activity_log').insert({
      agent_name: 'HumanSupervisor',
      action: `validation_${decision}`,
      status: decision === 'approved' ? 'success' : decision === 'rejected' ? 'warning' : 'info',
      message: `Validation ${decision}: ${validation.action_type} by ${validation.initiator_bot}`,
      metadata: JSON.stringify({
        validation_id: validationId,
        original_bot: validation.initiator_bot,
        estimated_impact: validation.estimated_impact,
        feedback: feedback || '',
        guardrails_result: decision
      })
    });

    // Broadcast decision to the bot
    const { io } = require('../server');
    io.emit('validation_decision', {
      validation_id: validationId,
      initiator_bot: validation.initiator_bot,
      decision,
      feedback: feedback || '',
      adjustments: adjustments || {},
      timestamp: new Date()
    });

    // If approved, can trigger automated execution
    let execution_result = null;
    if (decision === 'approved') {
      execution_result = {
        status: 'ready_for_execution',
        message: 'Action approved and ready for bot execution',
        action_data: JSON.parse(validation.action_data || '{}')
      };
    }

    res.json({
      validation_id: validationId,
      decision,
      feedback: feedback || '',
      adjustments: adjustments || {},
      execution_result,
      message: `Validation ${decision} successfully`
    });
  } catch (error) {
    console.error('Validate decision error:', error);
    res.status(500).json({ error: 'Failed to process validation decision' });
  }
});

// Get guardrails dashboard metrics
router.get('/guardrails/dashboard-metrics', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    // Calculate time filter
    const hoursBack = timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 24;
    const timeFilter = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    // Get validation queue metrics
    const pendingValidations = await db('bot_validation_queue')
      .where('status', 'pending')
      .count('* as count')
      .first();

    const recentValidations = await db('bot_validation_queue')
      .where('created_at', '>=', timeFilter)
      .select('status', 'priority', 'estimated_impact', 'validation_type')
      .count('* as count')
      .groupBy('status');

    // Get high-impact decisions
    const highImpactDecisions = await db('bot_validation_queue')
      .where('estimated_impact', '>', 500)
      .where('created_at', '>=', timeFilter)
      .select('*')
      .orderBy('estimated_impact', 'desc')
      .limit(10);

    // Calculate guardrails effectiveness
    const totalValidations = await db('bot_validation_queue')
      .where('created_at', '>=', timeFilter)
      .count('* as count')
      .first();

    const approvedValidations = await db('bot_validation_queue')
      .where('status', 'approved')
      .where('created_at', '>=', timeFilter)
      .count('* as count')
      .first();

    const avgResponseTime = await db('bot_validation_queue')
      .whereNotNull('decision_time')
      .where('created_at', '>=', timeFilter)
      .select(db.raw('AVG(julianday(decision_time) - julianday(created_at)) * 24 * 60 as avg_minutes'))
      .first();

    // Bot activity requiring validation
    const botValidationActivity = await db('bot_validation_queue')
      .where('created_at', '>=', timeFilter)
      .select('initiator_bot')
      .count('* as requests')
      .groupBy('initiator_bot')
      .orderBy('requests', 'desc');

    const metrics = {
      queue_status: {
        pending: parseInt(pendingValidations.count),
        recent_activity: recentValidations,
        high_impact_pending: await db('bot_validation_queue')
          .where('status', 'pending')
          .where('estimated_impact', '>', 500)
          .count('* as count')
          .first().then(r => parseInt(r.count))
      },
      effectiveness: {
        total_validations: parseInt(totalValidations.count),
        approval_rate: totalValidations.count > 0 ? 
          Math.round((parseInt(approvedValidations.count) / parseInt(totalValidations.count)) * 100) : 0,
        avg_response_time_minutes: Math.round(parseFloat(avgResponseTime.avg_minutes) || 0),
        guardrails_triggered: parseInt(totalValidations.count)
      },
      high_impact_decisions: highImpactDecisions.map(d => ({
        ...d,
        action_data: JSON.parse(d.action_data || '{}'),
        guardrails_context: JSON.parse(d.guardrails_context || '{}')
      })),
      bot_activity: botValidationActivity,
      time_period: timeframe
    };

    res.json(metrics);
  } catch (error) {
    console.error('Get guardrails metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch guardrails dashboard metrics' });
  }
});

// Execute Claude MAX 20x Analysis (A component)
router.post('/guardrails/claude-analysis', async (req, res) => {
  try {
    const { validation_id, analysis_type, context_data } = req.body;

    if (!validation_id || !analysis_type) {
      return res.status(400).json({ error: 'Validation ID and analysis type are required' });
    }

    // Get validation details
    const validation = await db('bot_validation_queue')
      .where('id', validation_id)
      .first();

    if (!validation) {
      return res.status(404).json({ error: 'Validation not found' });
    }

    // Simulate Claude MAX analysis (in real implementation, this would call Claude API)
    const analysisResult = {
      validation_id,
      analysis_type, // 'strategic', 'technical', 'risk_assessment', 'personalization'
      claude_insights: {
        recommendation: analysis_type === 'strategic' ? 'Proceed with modifications' : 'Approve as proposed',
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        risk_factors: [
          'Timeline constraints may require resource reallocation',
          'Client expectations need alignment with deliverable scope'
        ],
        optimization_suggestions: [
          'Consider phased approach for complex deliverables',
          'Implement additional quality checkpoints'
        ],
        estimated_success_probability: Math.floor(Math.random() * 25) + 75 // 75-100%
      },
      tokens_used: Math.floor(Math.random() * 200) + 100, // 100-300 tokens
      analysis_time: new Date(),
      context_data: context_data || {}
    };

    // Store Claude analysis
    await db('bot_validation_queue')
      .where('id', validation_id)
      .update({
        claude_analysis: JSON.stringify(analysisResult),
        claude_analyzed_at: new Date()
      });

    // Log Claude usage
    await db('activity_log').insert({
      agent_name: 'ClaudeMAX20x',
      action: 'analysis_completed',
      status: 'success',
      message: `Claude analysis completed for ${analysis_type} (${analysisResult.tokens_used} tokens)`,
      metadata: JSON.stringify({
        validation_id,
        analysis_type,
        tokens_used: analysisResult.tokens_used,
        confidence: analysisResult.claude_insights.confidence
      })
    });

    // Broadcast analysis completion
    const { io } = require('../server');
    io.emit('claude_analysis_completed', {
      validation_id,
      analysis_result: analysisResult,
      timestamp: new Date()
    });

    res.json({
      success: true,
      analysis_result: analysisResult,
      message: 'Claude MAX 20x analysis completed'
    });
  } catch (error) {
    console.error('Claude analysis error:', error);
    res.status(500).json({ error: 'Failed to execute Claude analysis' });
  }
});

module.exports = router;