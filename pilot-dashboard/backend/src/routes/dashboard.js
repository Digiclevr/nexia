const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Get dashboard overview
router.get('/overview', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's metrics
    const todayMetrics = await db('daily_metrics')
      .where('date', today)
      .first();

    if (!todayMetrics) {
      // Create today's metrics if don't exist
      await db('daily_metrics').insert({
        date: today,
        target_revenue: 3571, // €25,000 / 7 days
        current_revenue: 0,
        target_leads: 60,
        current_leads: 0
      });
    }

    // Get current revenue from events
    const revenueResult = await db('revenue_events')
      .whereRaw('DATE(created_at) = ?', [today])
      .sum('amount as total')
      .first();

    // Get current leads
    const leadsResult = await db('leads')
      .whereRaw('DATE(created_at) = ?', [today])
      .count('* as total')
      .first();

    // Get bookings
    const bookingsResult = await db('revenue_events')
      .whereRaw('DATE(created_at) = ?', [today])
      .where('source', 'in', ['audit', 'consulting'])
      .count('* as total')
      .first();

    // Calculate conversion rate
    const currentRevenue = revenueResult.total || 0;
    const currentLeads = leadsResult.total || 0;
    const bookingsConfirmed = bookingsResult.total || 0;
    const conversionRate = currentLeads > 0 ? (bookingsConfirmed / currentLeads * 100) : 0;

    // Update metrics in database
    await db('daily_metrics')
      .where('date', today)
      .update({
        current_revenue: currentRevenue,
        current_leads: currentLeads,
        bookings_confirmed: bookingsConfirmed,
        conversion_rate: conversionRate,
        updated_at: new Date()
      });

    // Calculate progress percentage
    const progressPercent = (currentRevenue / 3571) * 100;

    res.json({
      metrics: {
        target_revenue: 3571,
        current_revenue: currentRevenue,
        target_leads: 60,
        current_leads: currentLeads,
        bookings_confirmed: bookingsConfirmed,
        conversion_rate: parseFloat(conversionRate.toFixed(2)),
        progress_percent: Math.min(progressPercent, 100)
      },
      day: getDayOfChallenge(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const activities = await db('activity_log')
      .orderBy('created_at', 'desc')
      .limit(limit);

    res.json(activities);
  } catch (error) {
    console.error('Activity log error:', error);
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
});

// Add activity log entry
router.post('/activity', async (req, res) => {
  try {
    const { agent_name, action, status, message, metadata } = req.body;
    
    const [id] = await db('activity_log').insert({
      agent_name,
      action,
      status,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('activity_update', {
      id,
      agent_name,
      action,
      status,
      message,
      created_at: new Date().toISOString()
    });

    res.json({ id, success: true });
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

// Get revenue breakdown
router.get('/revenue', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const revenueBreakdown = await db('revenue_events')
      .whereRaw('DATE(created_at) = ?', [today])
      .select('source')
      .sum('amount as total')
      .groupBy('source');

    const totalRevenue = await db('revenue_events')
      .whereRaw('DATE(created_at) = ?', [today])
      .sum('amount as total')
      .first();

    res.json({
      breakdown: revenueBreakdown.map(item => ({
        source: item.source,
        amount: parseFloat(item.total),
        percentage: totalRevenue.total > 0 ? (item.total / totalRevenue.total * 100) : 0
      })),
      total: parseFloat(totalRevenue.total || 0)
    });
  } catch (error) {
    console.error('Revenue breakdown error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue breakdown' });
  }
});

// Get 7-day progress
router.get('/progress', async (req, res) => {
  try {
    const progress = [];
    const totalTarget = 25000; // €25,000 total goal
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayMetrics = await db('daily_metrics')
        .where('date', dateString)
        .first();
      
      const revenue = await db('revenue_events')
        .whereRaw('DATE(created_at) = ?', [dateString])
        .sum('amount as total')
        .first();

      progress.push({
        date: dateString,
        day: 7 - i,
        target: 3571, // Daily target
        actual: parseFloat(revenue.total || 0),
        cumulative: progress.reduce((sum, day) => sum + day.actual, 0) + parseFloat(revenue.total || 0)
      });
    }

    res.json({
      progress,
      total_target: totalTarget,
      current_total: progress[progress.length - 1]?.cumulative || 0
    });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Helper function to get day of challenge
function getDayOfChallenge() {
  const startDate = new Date('2025-09-02'); // Challenge start date
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays, 7);
}

module.exports = router;