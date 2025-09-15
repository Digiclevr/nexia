const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const HealthReport = require('../models/HealthReport');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// =====================================================
// CREATE NEW HEALTH REPORT
// =====================================================
router.post('/', [
  body('cluster_id').isUUID().withMessage('Invalid cluster ID'),
  body('timestamp').isISO8601().withMessage('Invalid timestamp format'),
  body('overall_score').isInt({ min: 0, max: 100 }).withMessage('Overall score must be between 0 and 100'),
  body('overall_status').notEmpty().withMessage('Overall status is required'),
  body('category_scores').isArray().withMessage('Category scores must be an array'),
  body('category_scores.*.category_id').isUUID().withMessage('Invalid category ID'),
  body('category_scores.*.score').isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  validateRequest
], async (req, res) => {
  try {
    const {
      cluster_id,
      timestamp,
      overall_score,
      overall_status,
      report_data,
      execution_time_seconds,
      category_scores,
      issues = [],
      actions = []
    } = req.body;

    const reportData = {
      cluster_id,
      timestamp,
      overall_score,
      overall_status,
      report_data,
      execution_time_seconds
    };

    const report = await HealthReport.create(reportData, category_scores, issues, actions);

    logger.info(`Health report created for cluster ${cluster_id} with score ${overall_score}`);

    res.status(201).json({
      success: true,
      data: report
    });

  } catch (error) {
    logger.error('Error creating health report:', error);
    res.status(500).json({
      error: 'Failed to create health report',
      message: error.message
    });
  }
});

// =====================================================
// GET ALL REPORTS WITH FILTERS
// =====================================================
router.get('/', [
  query('cluster_id').optional().isUUID().withMessage('Invalid cluster ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('start_date').optional().isISO8601().withMessage('Invalid start date format'),
  query('end_date').optional().isISO8601().withMessage('Invalid end date format'),
  query('min_score').optional().isInt({ min: 0, max: 100 }).withMessage('Min score must be between 0 and 100'),
  query('max_score').optional().isInt({ min: 0, max: 100 }).withMessage('Max score must be between 0 and 100'),
  validateRequest
], async (req, res) => {
  try {
    const options = {
      cluster_id: req.query.cluster_id,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      min_score: req.query.min_score ? parseInt(req.query.min_score) : undefined,
      max_score: req.query.max_score ? parseInt(req.query.max_score) : undefined
    };

    const result = await HealthReport.findAll(options);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Error fetching health reports:', error);
    res.status(500).json({
      error: 'Failed to fetch health reports',
      message: error.message
    });
  }
});

// =====================================================
// GET REPORT BY ID
// =====================================================
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid report ID'),
  validateRequest
], async (req, res) => {
  try {
    const { id } = req.params;
    const report = await HealthReport.findById(id);

    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
        message: `Health report with ID ${id} does not exist`
      });
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    logger.error('Error fetching health report:', error);
    res.status(500).json({
      error: 'Failed to fetch health report',
      message: error.message
    });
  }
});

// =====================================================
// GET LATEST REPORT FOR CLUSTER
// =====================================================
router.get('/cluster/:clusterId/latest', [
  param('clusterId').isUUID().withMessage('Invalid cluster ID'),
  validateRequest
], async (req, res) => {
  try {
    const { clusterId } = req.params;
    const report = await HealthReport.getLatest(clusterId);

    if (!report) {
      return res.status(404).json({
        error: 'No reports found',
        message: `No health reports found for cluster ${clusterId}`
      });
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    logger.error('Error fetching latest health report:', error);
    res.status(500).json({
      error: 'Failed to fetch latest health report',
      message: error.message
    });
  }
});

// =====================================================
// GET SCORE TRENDS
// =====================================================
router.get('/cluster/:clusterId/trends', [
  param('clusterId').isUUID().withMessage('Invalid cluster ID'),
  query('hours').optional().isInt({ min: 1, max: 168 }).withMessage('Hours must be between 1 and 168'),
  validateRequest
], async (req, res) => {
  try {
    const { clusterId } = req.params;
    const hours = parseInt(req.query.hours) || 24;

    const trends = await HealthReport.getScoreTrends(clusterId, hours);

    res.json({
      success: true,
      data: trends,
      meta: {
        cluster_id: clusterId,
        hours_back: hours,
        data_points: trends.length
      }
    });

  } catch (error) {
    logger.error('Error fetching score trends:', error);
    res.status(500).json({
      error: 'Failed to fetch score trends',
      message: error.message
    });
  }
});

// =====================================================
// GET HEALTH STATISTICS
// =====================================================
router.get('/cluster/:clusterId/stats', [
  param('clusterId').isUUID().withMessage('Invalid cluster ID'),
  query('days').optional().isInt({ min: 1, max: 90 }).withMessage('Days must be between 1 and 90'),
  validateRequest
], async (req, res) => {
  try {
    const { clusterId } = req.params;
    const days = parseInt(req.query.days) || 7;

    const stats = await HealthReport.getHealthStats(clusterId, days);

    res.json({
      success: true,
      data: stats,
      meta: {
        cluster_id: clusterId,
        days_back: days,
        data_points: stats.length
      }
    });

  } catch (error) {
    logger.error('Error fetching health statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch health statistics',
      message: error.message
    });
  }
});

// =====================================================
// CLEANUP OLD REPORTS
// =====================================================
router.delete('/cleanup', [
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
  validateRequest
], async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const deletedCount = await HealthReport.cleanup(days);

    logger.info(`Cleaned up ${deletedCount} old health reports (older than ${days} days)`);

    res.json({
      success: true,
      message: `Cleaned up ${deletedCount} old reports`,
      deleted_count: deletedCount,
      retention_days: days
    });

  } catch (error) {
    logger.error('Error cleaning up old reports:', error);
    res.status(500).json({
      error: 'Failed to cleanup old reports',
      message: error.message
    });
  }
});

module.exports = router;