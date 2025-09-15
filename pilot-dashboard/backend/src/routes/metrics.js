const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Get current metrics
router.get('/current', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const metrics = await db('daily_metrics')
      .where('date', today)
      .first();

    if (!metrics) {
      // Create today's metrics if they don't exist
      await db('daily_metrics').insert({
        date: today,
        target_revenue: 3571,
        current_revenue: 0,
        target_leads: 60,
        current_leads: 0
      });

      const newMetrics = await db('daily_metrics')
        .where('date', today)
        .first();
      
      return res.json(newMetrics);
    }

    res.json(metrics);
  } catch (error) {
    console.error('Current metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch current metrics' });
  }
});

// Get metrics history
router.get('/history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    
    const metrics = await db('daily_metrics')
      .orderBy('date', 'desc')
      .limit(days);

    res.json(metrics.reverse()); // Show chronological order
  } catch (error) {
    console.error('Metrics history error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics history' });
  }
});

// Update metrics manually
router.post('/update', async (req, res) => {
  try {
    const { revenue, leads, bookings } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Calculate conversion rate
    const conversionRate = leads > 0 ? (bookings / leads * 100) : 0;

    await db('daily_metrics')
      .where('date', today)
      .update({
        current_revenue: revenue || 0,
        current_leads: leads || 0,
        bookings_confirmed: bookings || 0,
        conversion_rate: conversionRate,
        updated_at: new Date()
      });

    const updatedMetrics = await db('daily_metrics')
      .where('date', today)
      .first();

    // Log activity
    await db('activity_log').insert({
      agent_name: 'System',
      action: 'metrics_updated',
      status: 'success',
      message: `Metrics updated: €${revenue} revenue, ${leads} leads, ${bookings} bookings`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('metrics_updated', updatedMetrics);

    res.json(updatedMetrics);
  } catch (error) {
    console.error('Update metrics error:', error);
    res.status(500).json({ error: 'Failed to update metrics' });
  }
});

// Add revenue event
router.post('/revenue', async (req, res) => {
  try {
    const { source, amount, client_name, notes } = req.body;
    
    if (!source || !amount) {
      return res.status(400).json({ error: 'Source and amount are required' });
    }

    const [id] = await db('revenue_events').insert({
      source,
      amount: parseFloat(amount),
      client_name,
      notes,
      status: 'confirmed'
    });

    // Update daily metrics
    const today = new Date().toISOString().split('T')[0];
    const totalRevenue = await db('revenue_events')
      .whereRaw('DATE(created_at) = ?', [today])
      .sum('amount as total')
      .first();

    await db('daily_metrics')
      .where('date', today)
      .update({
        current_revenue: totalRevenue.total || 0,
        updated_at: new Date()
      });

    // Log activity
    await db('activity_log').insert({
      agent_name: 'System',
      action: 'revenue_added',
      status: 'success',
      message: `New revenue: €${amount} from ${source}${client_name ? ` (${client_name})` : ''}`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    const revenueEvent = await db('revenue_events').where('id', id).first();
    io.emit('revenue_added', revenueEvent);

    res.status(201).json(revenueEvent);
  } catch (error) {
    console.error('Add revenue error:', error);
    res.status(500).json({ error: 'Failed to add revenue event' });
  }
});

// Add lead
router.post('/lead', async (req, res) => {
  try {
    const { source, name, email, company, title, score, metadata } = req.body;
    
    if (!source) {
      return res.status(400).json({ error: 'Source is required' });
    }

    const [id] = await db('leads').insert({
      source,
      name,
      email,
      company,
      title,
      score: score || 0,
      metadata: metadata ? JSON.stringify(metadata) : null,
      status: 'new'
    });

    // Update daily metrics
    const today = new Date().toISOString().split('T')[0];
    const totalLeads = await db('leads')
      .whereRaw('DATE(created_at) = ?', [today])
      .count('* as total')
      .first();

    await db('daily_metrics')
      .where('date', today)
      .update({
        current_leads: totalLeads.total || 0,
        updated_at: new Date()
      });

    // Log activity
    await db('activity_log').insert({
      agent_name: 'System',
      action: 'lead_added',
      status: 'success',
      message: `New lead: ${name || 'Unknown'} from ${source}${company ? ` (${company})` : ''}`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    const lead = await db('leads').where('id', id).first();
    io.emit('lead_added', lead);

    res.status(201).json(lead);
  } catch (error) {
    console.error('Add lead error:', error);
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

// Get agent performance
router.get('/performance', async (req, res) => {
  try {
    const agents = await db('agents').select('*');
    const performance = [];

    for (const agent of agents) {
      const activities = await db('activity_log')
        .where('agent_name', agent.name)
        .whereRaw('DATE(created_at) >= DATE(?, \'-7 days\')', [new Date()])
        .select('status')
        .count('* as total')
        .groupBy('status');

      const stats = agent.stats ? JSON.parse(agent.stats) : { runs: 0, successes: 0, errors: 0 };
      
      performance.push({
        agent_name: agent.name,
        type: agent.type,
        status: agent.status,
        last_run: agent.last_run,
        stats,
        weekly_activity: activities
      });
    }

    res.json(performance);
  } catch (error) {
    console.error('Performance error:', error);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

module.exports = router;