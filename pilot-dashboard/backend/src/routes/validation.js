const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Get validation queue
router.get('/queue', async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const limit = parseInt(req.query.limit) || 50;
    
    const queue = await db('validation_queue')
      .where('status', status)
      .orderBy('created_at', 'desc')
      .limit(limit);

    res.json(queue);
  } catch (error) {
    console.error('Validation queue error:', error);
    res.status(500).json({ error: 'Failed to fetch validation queue' });
  }
});

// Get specific validation item
router.get('/:id', async (req, res) => {
  try {
    const item = await db('validation_queue').where('id', req.params.id).first();
    if (!item) {
      return res.status(404).json({ error: 'Validation item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Get validation item error:', error);
    res.status(500).json({ error: 'Failed to fetch validation item' });
  }
});

// Submit content for validation
router.post('/submit', async (req, res) => {
  try {
    const { agent_name, content_type, content, metadata, scheduled_for } = req.body;
    
    if (!agent_name || !content_type || !content) {
      return res.status(400).json({ error: 'Agent name, content type, and content are required' });
    }

    // Validate content type
    const validTypes = ['linkedin_post', 'twitter_thread', 'linkedin_dm', 'email', 'blog_post'];
    if (!validTypes.includes(content_type)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const [id] = await db('validation_queue').insert({
      agent_name,
      content_type,
      content,
      metadata: metadata ? JSON.stringify(metadata) : null,
      scheduled_for: scheduled_for || null,
      status: 'pending'
    });

    const validationItem = await db('validation_queue').where('id', id).first();

    // Log activity
    await db('activity_log').insert({
      agent_name,
      action: 'content_submitted',
      status: 'success',
      message: `${content_type} submitted for validation`,
      metadata: JSON.stringify({ validation_id: id })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('validation_submitted', validationItem);

    res.status(201).json(validationItem);
  } catch (error) {
    console.error('Submit validation error:', error);
    res.status(500).json({ error: 'Failed to submit content for validation' });
  }
});

// Approve/Reject content
router.post('/:id/review', async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const itemId = req.params.id;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const item = await db('validation_queue').where('id', itemId).first();
    if (!item) {
      return res.status(404).json({ error: 'Validation item not found' });
    }

    await db('validation_queue').where('id', itemId).update({
      status,
      feedback,
      updated_at: new Date()
    });

    const updatedItem = await db('validation_queue').where('id', itemId).first();

    // Log activity
    await db('activity_log').insert({
      agent_name: item.agent_name,
      action: `content_${status}`,
      status: status === 'approved' ? 'success' : 'warning',
      message: `${item.content_type} ${status}${feedback ? `: ${feedback}` : ''}`,
      metadata: JSON.stringify({ validation_id: itemId })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('validation_reviewed', updatedItem);

    res.json(updatedItem);
  } catch (error) {
    console.error('Review validation error:', error);
    res.status(500).json({ error: 'Failed to review content' });
  }
});

// Get validation statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Overall stats
    const totalSubmitted = await db('validation_queue')
      .where('created_at', '>=', startDate)
      .count('* as count')
      .first();

    const approved = await db('validation_queue')
      .where('created_at', '>=', startDate)
      .where('status', 'approved')
      .count('* as count')
      .first();

    const rejected = await db('validation_queue')
      .where('created_at', '>=', startDate)
      .where('status', 'rejected')
      .count('* as count')
      .first();

    const pending = await db('validation_queue')
      .where('status', 'pending')
      .count('* as count')
      .first();

    // By content type
    const byType = await db('validation_queue')
      .where('created_at', '>=', startDate)
      .select('content_type')
      .count('* as count')
      .groupBy('content_type');

    // By agent
    const byAgent = await db('validation_queue')
      .where('created_at', '>=', startDate)
      .select('agent_name')
      .count('* as count')
      .groupBy('agent_name')
      .orderBy('count', 'desc');

    // Approval rate
    const approvalRate = totalSubmitted.count > 0 
      ? (approved.count / totalSubmitted.count * 100).toFixed(1)
      : 0;

    res.json({
      summary: {
        total_submitted: totalSubmitted.count,
        approved: approved.count,
        rejected: rejected.count,
        pending: pending.count,
        approval_rate: parseFloat(approvalRate)
      },
      by_type: byType,
      by_agent: byAgent,
      period_days: days
    });
  } catch (error) {
    console.error('Validation stats error:', error);
    res.status(500).json({ error: 'Failed to fetch validation statistics' });
  }
});

// Edit content
router.post('/:id/edit', async (req, res) => {
  try {
    const { content } = req.body;
    const itemId = req.params.id;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const item = await db('validation_queue').where('id', itemId).first();
    if (!item) {
      return res.status(404).json({ error: 'Validation item not found' });
    }

    // Store original content for audit trail
    const originalContent = item.content;
    
    await db('validation_queue').where('id', itemId).update({
      content,
      updated_at: new Date()
    });

    const updatedItem = await db('validation_queue').where('id', itemId).first();

    // Log activity
    await db('activity_log').insert({
      agent_name: item.agent_name,
      action: 'content_edited',
      status: 'success',
      message: `${item.content_type} content edited by user`,
      metadata: JSON.stringify({ 
        validation_id: itemId, 
        original_length: originalContent.length,
        new_length: content.length
      })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('validation_edited', updatedItem);

    res.json(updatedItem);
  } catch (error) {
    console.error('Edit content error:', error);
    res.status(500).json({ error: 'Failed to edit content' });
  }
});

// Publish approved content
router.post('/:id/publish', async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const item = await db('validation_queue').where('id', itemId).first();
    if (!item) {
      return res.status(404).json({ error: 'Validation item not found' });
    }

    if (item.status !== 'approved') {
      return res.status(400).json({ error: 'Content must be approved before publishing' });
    }

    // Update status to published
    await db('validation_queue').where('id', itemId).update({
      status: 'published',
      published_at: new Date(),
      updated_at: new Date()
    });

    const updatedItem = await db('validation_queue').where('id', itemId).first();

    // Here you would integrate with actual publishing platforms
    // For now, we'll simulate the publishing process
    let publishResult = { success: true };
    
    switch (item.content_type) {
      case 'linkedin_post':
        publishResult.platform = 'LinkedIn';
        publishResult.url = `https://linkedin.com/posts/example-${itemId}`;
        break;
      case 'twitter_thread':
        publishResult.platform = 'Twitter';
        publishResult.url = `https://twitter.com/example/status/${Date.now()}`;
        break;
      case 'blog_post':
        publishResult.platform = 'Blog';
        publishResult.url = `https://blog.onlyoneapi.com/post-${itemId}`;
        break;
      case 'email':
        publishResult.platform = 'Email Campaign';
        publishResult.url = null;
        publishResult.recipients = 'Target audience';
        break;
      default:
        publishResult.platform = 'Generic';
    }

    // Log activity
    await db('activity_log').insert({
      agent_name: item.agent_name,
      action: 'content_published',
      status: 'success',
      message: `${item.content_type} published to ${publishResult.platform}`,
      metadata: JSON.stringify({ 
        validation_id: itemId,
        platform: publishResult.platform,
        url: publishResult.url
      })
    });

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('content_published', { item: updatedItem, publishResult });

    res.json({ success: true, item: updatedItem, ...publishResult });
  } catch (error) {
    console.error('Publish content error:', error);
    res.status(500).json({ error: 'Failed to publish content' });
  }
});

// Batch approve/reject
router.post('/batch/review', async (req, res) => {
  try {
    const { ids, status, feedback } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array is required' });
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    // Get items before updating
    const items = await db('validation_queue').whereIn('id', ids);
    
    if (items.length !== ids.length) {
      return res.status(400).json({ error: 'Some validation items not found' });
    }

    // Update items
    await db('validation_queue')
      .whereIn('id', ids)
      .update({
        status,
        feedback,
        updated_at: new Date()
      });

    // Log activities
    for (const item of items) {
      await db('activity_log').insert({
        agent_name: item.agent_name,
        action: `content_${status}`,
        status: status === 'approved' ? 'success' : 'warning',
        message: `${item.content_type} ${status} (batch)${feedback ? `: ${feedback}` : ''}`,
        metadata: JSON.stringify({ validation_id: item.id, batch: true })
      });
    }

    // Get updated items
    const updatedItems = await db('validation_queue').whereIn('id', ids);

    // Broadcast to websocket clients
    const { io } = require('../server');
    io.emit('validation_batch_reviewed', { items: updatedItems, status });

    res.json({ 
      success: true, 
      updated: updatedItems.length,
      items: updatedItems 
    });
  } catch (error) {
    console.error('Batch review error:', error);
    res.status(500).json({ error: 'Failed to batch review content' });
  }
});

module.exports = router;