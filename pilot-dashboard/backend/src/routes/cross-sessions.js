const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Session status reporting endpoint
router.post('/session-status', async (req, res) => {
  try {
    const { 
      session_name, 
      session_id, 
      status, 
      day, 
      progress, 
      metrics, 
      alerts, 
      actions_required,
      message 
    } = req.body;

    if (!session_name || !session_id) {
      return res.status(400).json({ error: 'session_name and session_id are required' });
    }

    // Store session status (update existing or insert new)
    const [id] = await db('session_status').insert({
      session_name,
      session_id,
      status,
      day,
      progress: JSON.stringify(progress || {}),
      metrics: JSON.stringify(metrics || {}),
      alerts: JSON.stringify(alerts || []),
      actions_required: JSON.stringify(actions_required || []),
      message,
      last_update: new Date().toISOString()
    }).onConflict('session_id').merge({
      status,
      day,
      progress: JSON.stringify(progress || {}),
      metrics: JSON.stringify(metrics || {}),
      alerts: JSON.stringify(alerts || []),
      actions_required: JSON.stringify(actions_required || []),
      message,
      last_update: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Log activity (only if message changed or status changed)
    const lastActivity = await db('activity_log')
      .where('agent_name', `${session_name} Session`)
      .orderBy('created_at', 'desc')
      .first();
    
    if (!lastActivity || lastActivity.message !== (message || `${session_name} status: ${status}`)) {
      await db('activity_log').insert({
        agent_name: `${session_name} Session`,
        action: 'session_status_update',
        status: status === 'waiting_action' ? 'warning' : 'success',
        message: message || `${session_name} status: ${status}`,
        metadata: JSON.stringify({
          session_id,
          day,
          progress,
          metrics,
          alerts_count: alerts?.length || 0,
          actions_required_count: actions_required?.length || 0
        })
      });
    }

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('session_status_update', {
      session_name,
      session_id,
      status,
      day,
      progress,
      metrics,
      alerts,
      actions_required,
      message,
      timestamp: new Date().toISOString()
    });

    // Send alert if action required
    if (actions_required && actions_required.length > 0) {
      io.emit('supervision_alert', {
        type: 'action_required',
        session_name,
        session_id,
        actions: actions_required,
        urgency: status === 'blocked' ? 'high' : 'medium',
        timestamp: new Date().toISOString()
      });
    }

    res.json({ success: true, id });
  } catch (error) {
    console.error('Session status update error:', error);
    res.status(500).json({ error: 'Failed to update session status' });
  }
});

// Get all sessions status
router.get('/sessions-overview', async (req, res) => {
  try {
    const sessions = await db('session_status').orderBy('session_id', 'asc');
    
    const sessionsWithParsedData = sessions.map(session => ({
      ...session,
      progress: session.progress ? JSON.parse(session.progress) : {},
      metrics: session.metrics ? JSON.parse(session.metrics) : {},
      alerts: session.alerts ? JSON.parse(session.alerts) : [],
      actions_required: session.actions_required ? JSON.parse(session.actions_required) : []
    }));

    // Calculate global metrics
    const globalMetrics = {
      total_sessions: sessionsWithParsedData.length,
      active_sessions: sessionsWithParsedData.filter(s => s.status === 'active').length,
      waiting_action: sessionsWithParsedData.filter(s => s.status === 'waiting_action').length,
      blocked_sessions: sessionsWithParsedData.filter(s => s.status === 'blocked').length,
      completed_sessions: sessionsWithParsedData.filter(s => s.status === 'completed').length,
      total_revenue: sessionsWithParsedData.reduce((sum, s) => sum + (s.metrics?.current_revenue || 0), 0),
      total_alerts: sessionsWithParsedData.reduce((sum, s) => sum + (s.alerts?.length || 0), 0),
      total_actions_required: sessionsWithParsedData.reduce((sum, s) => sum + (s.actions_required?.length || 0), 0)
    };

    res.json({
      sessions: sessionsWithParsedData,
      global_metrics: globalMetrics,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sessions overview error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions overview' });
  }
});

// Get specific session status
router.get('/session/:id', async (req, res) => {
  try {
    const session = await db('session_status').where('session_id', req.params.id).first();
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionWithParsedData = {
      ...session,
      progress: session.progress ? JSON.parse(session.progress) : {},
      metrics: session.metrics ? JSON.parse(session.metrics) : {},
      alerts: session.alerts ? JSON.parse(session.alerts) : [],
      actions_required: session.actions_required ? JSON.parse(session.actions_required) : []
    };

    res.json(sessionWithParsedData);
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({ error: 'Failed to fetch session status' });
  }
});

// Mark action as completed
router.post('/action-completed', async (req, res) => {
  try {
    const { session_id, action_id, completion_notes } = req.body;

    if (!session_id || !action_id) {
      return res.status(400).json({ error: 'session_id and action_id are required' });
    }

    // Log action completion
    await db('activity_log').insert({
      agent_name: 'Supervision',
      action: 'action_completed',
      status: 'success',
      message: `Action completed for session ${session_id}: ${action_id}`,
      metadata: JSON.stringify({
        session_id,
        action_id,
        completion_notes,
        completed_by: 'supervision'
      })
    });

    // Broadcast completion
    const { io } = require('../server');
    io.emit('action_completed', {
      session_id,
      action_id,
      completion_notes,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Action completion error:', error);
    res.status(500).json({ error: 'Failed to mark action as completed' });
  }
});

// Get daily briefing data
router.get('/daily-briefing', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get sessions status
    const sessions = await db('session_status').orderBy('session_id', 'asc');
    const sessionsData = sessions.map(session => ({
      ...session,
      progress: session.progress ? JSON.parse(session.progress) : {},
      metrics: session.metrics ? JSON.parse(session.metrics) : {},
      alerts: session.alerts ? JSON.parse(session.alerts) : [],
      actions_required: session.actions_required ? JSON.parse(session.actions_required) : []
    }));

    // Get today's activity
    const todayActivity = await db('activity_log')
      .whereRaw('DATE(created_at) = ?', [today])
      .orderBy('created_at', 'desc')
      .limit(20);

    // Get revenue by session today
    const todayRevenue = await db('revenue_events')
      .whereRaw('DATE(created_at) = ?', [today])
      .select('source')
      .sum('amount as total')
      .groupBy('source');

    // Calculate daily performance
    const dailyPerformance = {
      total_revenue_today: todayRevenue.reduce((sum, r) => sum + parseFloat(r.total), 0),
      revenue_by_source: todayRevenue,
      sessions_performance: sessionsData.map(s => ({
        name: s.session_name,
        status: s.status,
        revenue_today: s.metrics?.revenue_today || 0,
        target_today: s.metrics?.target_today || 0,
        completion_rate: s.progress?.day_completion_rate || 0
      })),
      critical_alerts: sessionsData.filter(s => s.alerts?.some(a => a.urgency === 'high')),
      pending_actions: sessionsData.filter(s => s.actions_required?.length > 0)
    };

    const briefing = {
      date: today,
      global_status: {
        total_sessions: sessionsData.length,
        active_sessions: sessionsData.filter(s => s.status === 'active').length,
        total_revenue: sessionsData.reduce((sum, s) => sum + (s.metrics?.current_revenue || 0), 0),
        daily_target: 1071, // €7,500 / 7 days
        daily_performance: dailyPerformance.total_revenue_today
      },
      sessions_summary: sessionsData,
      performance_details: dailyPerformance,
      recent_activity: todayActivity,
      recommendations: generateRecommendations(sessionsData, dailyPerformance)
    };

    res.json(briefing);
  } catch (error) {
    console.error('Daily briefing error:', error);
    res.status(500).json({ error: 'Failed to generate daily briefing' });
  }
});

// Helper function to generate recommendations
function generateRecommendations(sessions, performance) {
  const recommendations = [];

  // Performance recommendations
  if (performance.total_revenue_today < 1071) {
    recommendations.push({
      type: 'revenue_gap',
      priority: 'high',
      message: `Daily revenue gap: €${(1071 - performance.total_revenue_today).toFixed(0)} below target`,
      action: 'Focus on high-priority sessions (API Audits, Emergency Consulting)'
    });
  }

  // Session-specific recommendations
  sessions.forEach(session => {
    if (session.status === 'blocked') {
      recommendations.push({
        type: 'blocked_session',
        priority: 'high',
        message: `${session.session_name} is blocked`,
        action: 'Review and resolve blocking issues immediately'
      });
    }

    if (session.actions_required?.length > 0) {
      recommendations.push({
        type: 'action_required',
        priority: 'medium',
        message: `${session.session_name} requires ${session.actions_required.length} actions`,
        action: 'Review and complete required actions'
      });
    }
  });

  return recommendations;
}

module.exports = router;