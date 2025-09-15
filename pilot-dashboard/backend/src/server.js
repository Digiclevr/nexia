const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();

const db = require('./database/connection');
const agentsRoutes = require('./routes/agents');
const metricsRoutes = require('./routes/metrics');
const validationRoutes = require('./routes/validation');
const dashboardRoutes = require('./routes/dashboard');
const businessActivitiesRoutes = require('./routes/business-activities');
const crossSessionsRoutes = require('./routes/cross-sessions');
const configurationRoutes = require('./routes/configuration');
const systemRoutes = require('./routes/system');
const emergencyConsultingRoutes = require('./routes/emergency-consulting');
const botsSquadRoutes = require('./routes/bots-squad');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5010",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5011;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5010",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/agents', agentsRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/business-activities', businessActivitiesRoutes);
app.use('/api/cross-sessions', crossSessionsRoutes);
app.use('/api/configuration', configurationRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/emergency-consulting', emergencyConsultingRoutes);
app.use('/api/bots-squad', botsSquadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected'
  });
});

// Real-time events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast metrics updates every 10 seconds
setInterval(async () => {
  try {
    const metrics = await db('daily_metrics')
      .where('date', new Date().toISOString().split('T')[0])
      .first();
    
    if (metrics) {
      io.emit('metrics_update', metrics);
    }
  } catch (error) {
    console.error('Error broadcasting metrics:', error);
  }
}, 10000);

// Scheduled jobs
cron.schedule('*/5 * * * *', async () => {
  // Update metrics every 5 minutes
  try {
    const currentRevenue = await calculateCurrentRevenue();
    const currentLeads = await calculateCurrentLeads();
    
    await db('daily_metrics')
      .where('date', new Date().toISOString().split('T')[0])
      .update({
        current_revenue: currentRevenue,
        current_leads: currentLeads,
        updated_at: new Date()
      });

    // Broadcast update
    io.emit('metrics_update', {
      current_revenue: currentRevenue,
      current_leads: currentLeads,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scheduled metrics update failed:', error);
  }
});

// Helper functions
async function calculateCurrentRevenue() {
  const result = await db('revenue_events')
    .whereRaw('DATE(created_at) = DATE(?)', [new Date()])
    .sum('amount as total')
    .first();
  
  return result.total || 0;
}

async function calculateCurrentLeads() {
  const result = await db('leads')
    .whereRaw('DATE(created_at) = DATE(?)', [new Date()])
    .count('* as total')
    .first();
  
  return result.total || 0;
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API available at http://localhost:${PORT}/api`);
  console.log(`💓 Health check: http://localhost:${PORT}/health`);
  
  // Initialize database
  require('./database/init')()
    .then(() => {
      console.log('✅ Database initialized');
    })
    .catch(err => {
      console.error('❌ Database initialization failed:', err);
    });
});

module.exports = { app, io };