const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await db('agents').orderBy('created_at', 'desc');
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get specific agent
router.get('/:id', async (req, res) => {
  try {
    const agent = await db('agents').where('id', req.params.id).first();
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Create new agent
router.post('/', async (req, res) => {
  try {
    const { name, type, config } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const [id] = await db('agents').insert({
      name,
      type,
      config: config ? JSON.stringify(config) : null,
      stats: JSON.stringify({ runs: 0, successes: 0, errors: 0 })
    });

    const agent = await db('agents').where('id', id).first();
    
    // Log activity
    await db('activity_log').insert({
      agent_name: name,
      action: 'agent_created',
      status: 'success',
      message: `Agent ${name} created successfully`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('agent_created', agent);

    res.status(201).json(agent);
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Update agent
router.put('/:id', async (req, res) => {
  try {
    const { name, type, status, config, stats } = req.body;
    const agentId = req.params.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (status) updateData.status = status;
    if (config) updateData.config = JSON.stringify(config);
    if (stats) updateData.stats = JSON.stringify(stats);
    if (status === 'active') updateData.last_run = new Date();

    await db('agents').where('id', agentId).update(updateData);
    const agent = await db('agents').where('id', agentId).first();

    // Log activity
    await db('activity_log').insert({
      agent_name: agent.name,
      action: 'agent_updated',
      status: 'success',
      message: `Agent ${agent.name} updated`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('agent_updated', agent);

    res.json(agent);
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete agent
router.delete('/:id', async (req, res) => {
  try {
    const agent = await db('agents').where('id', req.params.id).first();
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await db('agents').where('id', req.params.id).del();

    // Log activity
    await db('activity_log').insert({
      agent_name: agent.name,
      action: 'agent_deleted',
      status: 'success',
      message: `Agent ${agent.name} deleted`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('agent_deleted', { id: req.params.id, name: agent.name });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

// Start/Stop agent
router.post('/:id/toggle', async (req, res) => {
  try {
    const agent = await db('agents').where('id', req.params.id).first();
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    
    await db('agents').where('id', req.params.id).update({
      status: newStatus,
      last_run: newStatus === 'active' ? new Date() : agent.last_run
    });

    const updatedAgent = await db('agents').where('id', req.params.id).first();

    // Log activity
    await db('activity_log').insert({
      agent_name: agent.name,
      action: newStatus === 'active' ? 'agent_started' : 'agent_stopped',
      status: 'success',
      message: `Agent ${agent.name} ${newStatus === 'active' ? 'started' : 'stopped'}`
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('agent_toggled', updatedAgent);

    res.json(updatedAgent);
  } catch (error) {
    console.error('Toggle agent error:', error);
    res.status(500).json({ error: 'Failed to toggle agent' });
  }
});

module.exports = router;