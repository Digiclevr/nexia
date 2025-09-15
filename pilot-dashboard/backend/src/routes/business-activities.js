const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Get all business activities
router.get('/', async (req, res) => {
  try {
    const activities = await db('business_activities')
      .orderBy('priority', 'asc');
    
    // Parse JSON fields
    const activitiesWithParsedKPIs = activities.map(activity => ({
      ...activity,
      kpis: activity.kpis ? JSON.parse(activity.kpis) : {}
    }));

    res.json(activitiesWithParsedKPIs);
  } catch (error) {
    console.error('Get business activities error:', error);
    res.status(500).json({ error: 'Failed to fetch business activities' });
  }
});

// Get specific business activity
router.get('/:id', async (req, res) => {
  try {
    const activity = await db('business_activities').where('id', req.params.id).first();
    if (!activity) {
      return res.status(404).json({ error: 'Business activity not found' });
    }

    // Parse JSON fields
    activity.kpis = activity.kpis ? JSON.parse(activity.kpis) : {};

    res.json(activity);
  } catch (error) {
    console.error('Get business activity error:', error);
    res.status(500).json({ error: 'Failed to fetch business activity' });
  }
});

// Update business activity revenue and volume
router.put('/:id/progress', async (req, res) => {
  try {
    const { revenue_increment, volume_increment, kpi_updates } = req.body;
    const activityId = req.params.id;

    const activity = await db('business_activities').where('id', activityId).first();
    if (!activity) {
      return res.status(404).json({ error: 'Business activity not found' });
    }

    const updateData = {};
    
    // Update revenue
    if (revenue_increment !== undefined) {
      updateData.current_revenue = parseFloat(activity.current_revenue) + parseFloat(revenue_increment);
    }
    
    // Update volume
    if (volume_increment !== undefined) {
      updateData.current_volume = parseInt(activity.current_volume) + parseInt(volume_increment);
    }

    // Update KPIs
    if (kpi_updates) {
      const currentKPIs = activity.kpis ? JSON.parse(activity.kpis) : {};
      const updatedKPIs = { ...currentKPIs, ...kpi_updates };
      updateData.kpis = JSON.stringify(updatedKPIs);
    }

    updateData.updated_at = new Date();

    await db('business_activities').where('id', activityId).update(updateData);
    
    const updatedActivity = await db('business_activities').where('id', activityId).first();
    updatedActivity.kpis = updatedActivity.kpis ? JSON.parse(updatedActivity.kpis) : {};

    // Log activity
    await db('activity_log').insert({
      agent_name: 'Business Tracker',
      action: 'activity_updated',
      status: 'success',
      message: `${activity.name} updated: ${revenue_increment ? `+€${revenue_increment}` : ''} ${volume_increment ? `+${volume_increment} ${activity.unit_type}` : ''}`,
      metadata: JSON.stringify({ 
        activity_id: activityId,
        revenue_increment,
        volume_increment,
        kpi_updates 
      })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('business_activity_updated', updatedActivity);

    res.json(updatedActivity);
  } catch (error) {
    console.error('Update business activity error:', error);
    res.status(500).json({ error: 'Failed to update business activity' });
  }
});

// Get business activities summary
router.get('/summary/overview', async (req, res) => {
  try {
    const activities = await db('business_activities').orderBy('priority', 'asc');
    
    const summary = {
      total_activities: activities.length,
      active_activities: activities.filter(a => a.status === 'active').length,
      total_target_min: activities.reduce((sum, a) => sum + parseFloat(a.target_revenue_min), 0),
      total_target_max: activities.reduce((sum, a) => sum + parseFloat(a.target_revenue_max), 0),
      total_current_revenue: activities.reduce((sum, a) => sum + parseFloat(a.current_revenue), 0),
      avg_probability: activities.reduce((sum, a) => sum + parseFloat(a.probability_score), 0) / activities.length,
      completion_rates: activities.map(activity => ({
        name: activity.name,
        priority: activity.priority,
        probability_score: activity.probability_score,
        revenue_completion: activity.target_revenue_max > 0 
          ? (activity.current_revenue / activity.target_revenue_max * 100)
          : 0,
        volume_completion: activity.target_volume > 0
          ? (activity.current_volume / activity.target_volume * 100)
          : 0,
        status: activity.status,
        current_revenue: parseFloat(activity.current_revenue),
        target_revenue_min: parseFloat(activity.target_revenue_min),
        target_revenue_max: parseFloat(activity.target_revenue_max),
        current_volume: activity.current_volume,
        target_volume: activity.target_volume,
        unit_type: activity.unit_type
      }))
    };

    // Calculate overall completion percentage
    summary.overall_completion_percentage = summary.total_target_max > 0 
      ? (summary.total_current_revenue / summary.total_target_max * 100)
      : 0;

    res.json(summary);
  } catch (error) {
    console.error('Business activities summary error:', error);
    res.status(500).json({ error: 'Failed to fetch business activities summary' });
  }
});

// Add revenue to specific activity
router.post('/:id/revenue', async (req, res) => {
  try {
    const { amount, client_name, notes } = req.body;
    const activityId = req.params.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const activity = await db('business_activities').where('id', activityId).first();
    if (!activity) {
      return res.status(404).json({ error: 'Business activity not found' });
    }

    // Add to revenue_events table
    const [revenueEventId] = await db('revenue_events').insert({
      source: activity.name.toLowerCase().replace(/\s+/g, '_'),
      amount: parseFloat(amount),
      client_name,
      notes,
      status: 'confirmed'
    });

    // Update activity current revenue and volume
    const newRevenue = parseFloat(activity.current_revenue) + parseFloat(amount);
    const newVolume = activity.current_volume + 1; // Increment by 1 unit

    await db('business_activities').where('id', activityId).update({
      current_revenue: newRevenue,
      current_volume: newVolume,
      updated_at: new Date()
    });

    // Log activity
    await db('activity_log').insert({
      agent_name: 'Business Tracker',
      action: 'revenue_added',
      status: 'success',
      message: `${activity.name}: +€${amount}${client_name ? ` from ${client_name}` : ''}`,
      metadata: JSON.stringify({ 
        activity_id: activityId,
        revenue_event_id: revenueEventId,
        amount: parseFloat(amount),
        client_name
      })
    });

    // Get updated activity
    const updatedActivity = await db('business_activities').where('id', activityId).first();
    updatedActivity.kpis = updatedActivity.kpis ? JSON.parse(updatedActivity.kpis) : {};

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('business_activity_revenue_added', {
      activity: updatedActivity,
      revenue_event: {
        id: revenueEventId,
        amount: parseFloat(amount),
        client_name,
        notes
      }
    });

    res.json({
      activity: updatedActivity,
      revenue_event_id: revenueEventId,
      success: true
    });
  } catch (error) {
    console.error('Add business activity revenue error:', error);
    res.status(500).json({ error: 'Failed to add revenue to business activity' });
  }
});

module.exports = router;