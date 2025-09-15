const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class HealthReport {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.cluster_id = data.cluster_id;
    this.timestamp = data.timestamp;
    this.overall_score = data.overall_score;
    this.overall_status = data.overall_status;
    this.report_data = data.report_data;
    this.execution_time_seconds = data.execution_time_seconds;
  }

  // Create a new health report with category scores
  static async create(reportData, categoryScores, issues = [], actions = []) {
    const trx = await db.transaction();
    
    try {
      // Insert main report
      const [report] = await trx('health_reports')
        .insert({
          id: uuidv4(),
          cluster_id: reportData.cluster_id,
          timestamp: reportData.timestamp,
          overall_score: reportData.overall_score,
          overall_status: reportData.overall_status,
          report_data: JSON.stringify(reportData.report_data),
          execution_time_seconds: reportData.execution_time_seconds
        })
        .returning('*');

      // Insert category scores
      if (categoryScores && categoryScores.length > 0) {
        const categoryScoreData = categoryScores.map(score => ({
          id: uuidv4(),
          report_id: report.id,
          category_id: score.category_id,
          score: score.score,
          status: score.status,
          issues: JSON.stringify(score.issues || []),
          metrics: JSON.stringify(score.metrics || {})
        }));
        
        await trx('category_scores').insert(categoryScoreData);
      }

      // Insert health issues
      if (issues && issues.length > 0) {
        const issueData = issues.map(issue => ({
          id: uuidv4(),
          report_id: report.id,
          category_id: issue.category_id,
          severity: issue.severity,
          title: issue.title,
          description: issue.description,
          resource_type: issue.resource_type,
          resource_name: issue.resource_name,
          namespace: issue.namespace,
          recommendation: issue.recommendation
        }));
        
        await trx('health_issues').insert(issueData);
      }

      // Insert recommended actions
      if (actions && actions.length > 0) {
        const actionData = actions.map(action => ({
          id: uuidv4(),
          report_id: report.id,
          priority: action.priority,
          title: action.title,
          description: action.description,
          command: action.command,
          estimated_time_minutes: action.estimated_time_minutes
        }));
        
        await trx('recommended_actions').insert(actionData);
      }

      await trx.commit();
      return await this.findById(report.id);
      
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  // Find report by ID with related data
  static async findById(id) {
    const report = await db('health_reports')
      .where({ id })
      .first();

    if (!report) return null;

    // Get category scores
    const categoryScores = await db('category_scores as cs')
      .join('health_categories as hc', 'hc.id', 'cs.category_id')
      .where('cs.report_id', id)
      .select('cs.*', 'hc.name as category_name');

    // Get issues
    const issues = await db('health_issues as hi')
      .join('health_categories as hc', 'hc.id', 'hi.category_id')
      .where('hi.report_id', id)
      .select('hi.*', 'hc.name as category_name');

    // Get actions
    const actions = await db('recommended_actions')
      .where('report_id', id)
      .orderBy('priority', 'asc');

    return {
      ...report,
      report_data: typeof report.report_data === 'string' 
        ? JSON.parse(report.report_data) 
        : report.report_data,
      category_scores: categoryScores.map(cs => ({
        ...cs,
        issues: typeof cs.issues === 'string' ? JSON.parse(cs.issues) : cs.issues,
        metrics: typeof cs.metrics === 'string' ? JSON.parse(cs.metrics) : cs.metrics
      })),
      issues,
      actions
    };
  }

  // Get latest report for a cluster
  static async getLatest(clusterId) {
    const report = await db('health_reports')
      .where({ cluster_id: clusterId })
      .orderBy('timestamp', 'desc')
      .first();

    return report ? await this.findById(report.id) : null;
  }

  // Get reports with pagination and filters
  static async findAll(options = {}) {
    const {
      cluster_id,
      page = 1,
      limit = 20,
      start_date,
      end_date,
      min_score,
      max_score
    } = options;

    let query = db('health_reports as hr')
      .join('clusters as c', 'c.id', 'hr.cluster_id')
      .select('hr.*', 'c.name as cluster_name')
      .orderBy('hr.timestamp', 'desc');

    // Apply filters
    if (cluster_id) {
      query = query.where('hr.cluster_id', cluster_id);
    }

    if (start_date) {
      query = query.where('hr.timestamp', '>=', start_date);
    }

    if (end_date) {
      query = query.where('hr.timestamp', '<=', end_date);
    }

    if (min_score !== undefined) {
      query = query.where('hr.overall_score', '>=', min_score);
    }

    if (max_score !== undefined) {
      query = query.where('hr.overall_score', '<=', max_score);
    }

    // Pagination
    const offset = (page - 1) * limit;
    const reports = await query.offset(offset).limit(limit);

    // Get total count
    const [{ count }] = await db('health_reports')
      .where(builder => {
        if (cluster_id) builder.where('cluster_id', cluster_id);
        if (start_date) builder.where('timestamp', '>=', start_date);
        if (end_date) builder.where('timestamp', '<=', end_date);
        if (min_score !== undefined) builder.where('overall_score', '>=', min_score);
        if (max_score !== undefined) builder.where('overall_score', '<=', max_score);
      })
      .count('* as count');

    return {
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        pages: Math.ceil(count / limit)
      }
    };
  }

  // Get score trends for a cluster
  static async getScoreTrends(clusterId, hours = 24) {
    const trends = await db.raw(`
      SELECT * FROM get_health_trend(?, ?)
      ORDER BY timestamp DESC
    `, [clusterId, hours]);

    return trends.rows;
  }

  // Get health statistics
  static async getHealthStats(clusterId, days = 7) {
    const stats = await db.raw(`
      SELECT 
        DATE(timestamp) as date,
        AVG(overall_score) as avg_score,
        MIN(overall_score) as min_score,
        MAX(overall_score) as max_score,
        COUNT(*) as report_count
      FROM health_reports 
      WHERE cluster_id = ? 
        AND timestamp >= NOW() - INTERVAL '? days'
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `, [clusterId, days]);

    return stats.rows;
  }

  // Delete old reports
  static async cleanup(daysToKeep = 30) {
    const result = await db('health_reports')
      .where('created_at', '<', db.raw(`NOW() - INTERVAL '${daysToKeep} days'`))
      .del();

    return result;
  }
}

module.exports = HealthReport;