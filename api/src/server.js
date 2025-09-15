const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const db = require('./database/connection');

// Import routes
const healthRoutes = require('./routes/health');
const reportsRoutes = require('./routes/reports');
const clustersRoutes = require('./routes/clusters');
const metricsRoutes = require('./routes/metrics');
const alertsRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// MIDDLEWARE SETUP
// =====================================================

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROUTES
// =====================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require('../package.json').version,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/clusters', clustersRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/alerts', alertsRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏥 NEXIA Kubernetes Health Monitoring API',
    version: require('../package.json').version,
    documentation: '/api/v1/docs',
    health: '/health'
  });
});

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  
  // Don't leak error details in production
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    error: 'Internal server error',
    message: isDev ? error.message : 'Something went wrong',
    ...(isDev && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// SERVER STARTUP
// =====================================================

const startServer = async () => {
  try {
    // Test database connection
    await db.raw('SELECT 1+1 AS result');
    logger.info('✅ Database connection established');

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 NEXIA API server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`📡 API endpoint: http://localhost:${PORT}/api/v1`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('Server closed');
        db.destroy(() => {
          logger.info('Database connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;