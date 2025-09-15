const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Mock data pour démonstration
let missionStatus = {
  revenue: 0,
  target_min: 400,
  target_max: 600,
  sessions_completed: 0,
  leads_generated: 0,
  last_updated: new Date()
};

let mockLeads = [
  {
    id: 'lead_001',
    source: 'Twitter',
    type: 'API Downtime',
    priority: 'HIGH',
    message: 'API completely down, customers complaining',
    contact_method: 'DM @startup_cto',
    estimated_value: 600,
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2h
    status: 'detected'
  },
  {
    id: 'lead_002',
    source: 'GitHub',
    type: 'Performance Issues',
    priority: 'MEDIUM',
    message: 'FastAPI endpoints running slow, 5s+ response time',
    contact_method: 'GitHub comment',
    estimated_value: 400,
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4h
    status: 'detected'
  },
  {
    id: 'lead_003',
    source: 'LinkedIn',
    type: 'Integration Failure',
    priority: 'HIGH',
    message: 'Stripe webhook failing, payments not processing',
    contact_method: 'LinkedIn message',
    estimated_value: 800,
    deadline: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1h
    status: 'contacted'
  }
];

let mockSessions = [
  {
    id: 'session_001',
    client_name: 'TechStartup Inc.',
    crisis_type: 'API Authentication',
    scheduled_time: new Date(Date.now() + 30 * 60 * 1000), // 30 min
    rate_per_hour: 300,
    duration_hours: 2,
    total_amount: 600,
    payment_status: 'upfront_paid',
    zoom_link: 'https://zoom.us/j/emergency-api-fix'
  }
];

let systemStatus = {
  'api-monitor': { status: 'operational', last_check: new Date() },
  'social-detector': { status: 'warning', last_check: new Date() },
  'github-monitor': { status: 'operational', last_check: new Date() },
  'crisis-bot': { status: 'operational', last_check: new Date() },
  'calendar-system': { status: 'operational', last_check: new Date() },
  'payment-system': { status: 'operational', last_check: new Date() }
};

// Get mission status
router.get('/status', (req, res) => {
  // Update revenue based on completed sessions
  const completedSessions = mockSessions.filter(s => s.payment_status === 'fully_paid');
  missionStatus.revenue = completedSessions.reduce((sum, s) => sum + s.total_amount, 0);
  missionStatus.sessions_completed = completedSessions.length;
  missionStatus.leads_generated = mockLeads.length;
  missionStatus.last_updated = new Date();

  res.json(missionStatus);
});

// Get leads
router.get('/leads', (req, res) => {
  res.json(mockLeads);
});

// Get sessions
router.get('/sessions', (req, res) => {
  res.json(mockSessions);
});

// Get system status
router.get('/systems', (req, res) => {
  res.json(systemStatus);
});

// Start monitoring
router.post('/start-monitoring', (req, res) => {
  try {
    // Path to our emergency consulting system
    const emergencyPath = path.join(__dirname, '../../../../../EMERGENCY-CONSULTING');
    
    // Simulate starting monitoring systems
    console.log('Starting Emergency Consulting monitoring...');
    
    // Update system status
    Object.keys(systemStatus).forEach(system => {
      systemStatus[system].status = 'operational';
      systemStatus[system].last_check = new Date();
    });

    // Add some new mock leads to simulate detection
    if (mockLeads.length < 5) {
      mockLeads.push({
        id: `lead_${Date.now()}`,
        source: 'Auto-Detection',
        type: 'Database Connection',
        priority: 'HIGH',
        message: 'PostgreSQL connection pool exhausted',
        contact_method: 'Auto-generated email',
        estimated_value: 500,
        deadline: new Date(Date.now() + 3 * 60 * 60 * 1000),
        status: 'detected'
      });
    }

    res.json({ 
      success: true, 
      message: 'Monitoring systems started successfully',
      systems_active: Object.keys(systemStatus).length
    });
    
  } catch (error) {
    console.error('Error starting monitoring:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start monitoring systems' 
    });
  }
});

// Contact lead
router.post('/contact-lead/:leadId', (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = mockLeads.find(l => l.id === leadId);
    
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    
    // Update lead status
    lead.status = 'contacted';
    lead.contacted_at = new Date();
    
    console.log(`Lead ${leadId} contacted via ${lead.contact_method}`);
    
    res.json({ 
      success: true, 
      message: `Lead contacted successfully via ${lead.contact_method}` 
    });
    
  } catch (error) {
    console.error('Error contacting lead:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to contact lead' 
    });
  }
});

// Create consulting session
router.post('/create-session', (req, res) => {
  try {
    const { leadId } = req.body;
    const lead = mockLeads.find(l => l.id === leadId);
    
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    
    // Create new session
    const session = {
      id: `session_${Date.now()}`,
      client_name: `Client from ${lead.source}`,
      crisis_type: lead.type,
      scheduled_time: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      rate_per_hour: lead.priority === 'HIGH' ? 300 : 200,
      duration_hours: 2,
      total_amount: 0,
      payment_status: 'pending',
      zoom_link: null,
      created_from_lead: leadId
    };
    
    session.total_amount = session.rate_per_hour * session.duration_hours;
    
    // Generate mock payment link
    const paymentLink = `https://buy.stripe.com/emergency-consulting-${session.id}?amount=${session.total_amount * 50}`;
    session.payment_link = paymentLink;
    session.zoom_link = `https://zoom.us/j/emergency-api-${session.id}`;
    
    mockSessions.push(session);
    
    // Update lead status
    lead.status = 'converted';
    
    console.log(`Session created for lead ${leadId}: ${session.id}`);
    
    res.json({ 
      success: true, 
      session: session,
      paymentLink: paymentLink,
      message: 'Session created successfully' 
    });
    
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create session' 
    });
  }
});

// Simulate payment completion
router.post('/complete-payment/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = mockSessions.find(s => s.id === sessionId);
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    session.payment_status = 'upfront_paid';
    session.upfront_paid_at = new Date();
    
    res.json({ 
      success: true, 
      message: 'Payment completed successfully' 
    });
    
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to complete payment' 
    });
  }
});

// Get daily report
router.get('/daily-report', (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const todayLeads = mockLeads.filter(l => new Date(l.deadline) >= startOfDay);
  const todaySessions = mockSessions.filter(s => new Date(s.scheduled_time) >= startOfDay);
  const completedSessions = todaySessions.filter(s => s.payment_status === 'fully_paid');
  const totalRevenue = completedSessions.reduce((sum, s) => sum + s.total_amount, 0);
  
  const report = {
    date: today.toISOString().split('T')[0],
    leads_generated: todayLeads.length,
    leads_contacted: todayLeads.filter(l => l.status === 'contacted').length,
    sessions_booked: todaySessions.length,
    sessions_completed: completedSessions.length,
    revenue_generated: totalRevenue,
    target_achievement: (totalRevenue / 500) * 100, // vs €500 average target
    avg_session_value: todaySessions.length > 0 ? todaySessions.reduce((sum, s) => sum + s.total_amount, 0) / todaySessions.length : 0
  };
  
  res.json(report);
});

// Trigger lead detection (simulate running Python scripts)
router.post('/trigger-detection', (req, res) => {
  try {
    const { source } = req.body; // 'twitter', 'github', 'linkedin'
    
    // Simulate lead detection
    const newLead = {
      id: `lead_${Date.now()}`,
      source: source || 'Manual',
      type: ['API Downtime', 'Performance Issues', 'Integration Failure'][Math.floor(Math.random() * 3)],
      priority: ['HIGH', 'MEDIUM'][Math.floor(Math.random() * 2)],
      message: 'Detected crisis via automated monitoring',
      contact_method: `${source} detection`,
      estimated_value: [400, 500, 600, 800][Math.floor(Math.random() * 4)],
      deadline: new Date(Date.now() + (2 + Math.random() * 6) * 60 * 60 * 1000), // 2-8h
      status: 'detected'
    };
    
    mockLeads.push(newLead);
    
    res.json({ 
      success: true, 
      lead: newLead,
      message: `New lead detected from ${source || 'manual trigger'}` 
    });
    
  } catch (error) {
    console.error('Error triggering detection:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to trigger lead detection' 
    });
  }
});

module.exports = router;