const { createHash } = require('crypto');

module.exports = function registerEndpoint(router, { services, exceptions, database, getSchema }) {
  const { ItemsService } = services;
  const { InvalidPayloadException } = exceptions;

  // OGER Intelligence Processing Endpoint
  router.post('/intelligence/process', async (req, res) => {
    try {
      const { content, source = 'unknown', metadata = {} } = req.body;
      
      if (!content || typeof content !== 'string') {
        throw new InvalidPayloadException('Content is required and must be a string');
      }

      // Get database schema
      const schema = await getSchema();
      
      // Initialize services
      const actionItemsService = new ItemsService('action_items', { 
        schema, 
        accountability: req.accountability 
      });
      
      const intelligenceLogsService = new ItemsService('intelligence_logs', { 
        schema, 
        accountability: req.accountability 
      });

      // Process content with OGER intelligence
      const processingResult = await processWithOGER(content, source, metadata);
      
      // Store action items
      const actionItems = [];
      for (const item of processingResult.actionItems) {
        const actionItem = await actionItemsService.createOne({
          title: item.title,
          description: item.description,
          priority: item.priority,
          category: item.category,
          source: source,
          estimated_effort: item.estimatedEffort,
          dependencies: item.dependencies ? JSON.stringify(item.dependencies) : null,
          status: 'pending',
          metadata: JSON.stringify({
            ...metadata,
            extraction_confidence: item.confidence,
            keywords: item.keywords
          })
        });
        actionItems.push(actionItem);
      }

      // Log processing
      await intelligenceLogsService.createOne({
        source: source,
        content_hash: createHash('sha256').update(content).digest('hex'),
        action_items_extracted: processingResult.actionItems.length,
        processing_time_ms: processingResult.processingTime,
        metadata: JSON.stringify({
          ...metadata,
          content_length: content.length,
          categories_found: processingResult.categories,
          priority_distribution: processingResult.priorityDistribution
        })
      });

      res.json({
        success: true,
        oger_status: 'processing_complete',
        data: {
          actionItemsCreated: actionItems.length,
          actionItems: actionItems,
          processingStats: {
            contentLength: content.length,
            processingTime: processingResult.processingTime,
            categories: processingResult.categories,
            priorityDistribution: processingResult.priorityDistribution
          }
        }
      });

    } catch (error) {
      console.error('OGER Intelligence Processing Error:', error);
      res.status(500).json({
        success: false,
        oger_status: 'error',
        error: error.message
      });
    }
  });

  // Get intelligence dashboard data
  router.get('/intelligence/dashboard', async (req, res) => {
    try {
      const schema = await getSchema();
      
      const actionItemsService = new ItemsService('action_items', { 
        schema, 
        accountability: req.accountability 
      });
      
      const intelligenceLogsService = new ItemsService('intelligence_logs', { 
        schema, 
        accountability: req.accountability 
      });

      // Get recent action items by priority
      const recentItems = await actionItemsService.readByQuery({
        limit: 50,
        sort: ['-date_created'],
        fields: ['*']
      });

      // Get processing stats
      const processingLogs = await intelligenceLogsService.readByQuery({
        limit: 10,
        sort: ['-date_created'],
        fields: ['*']
      });

      // Calculate dashboard metrics
      const priorityDistribution = recentItems.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {});

      const statusDistribution = recentItems.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      const categoryDistribution = recentItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});

      res.json({
        success: true,
        oger_status: 'dashboard_ready',
        data: {
          totalActionItems: recentItems.length,
          recentItems: recentItems.slice(0, 20),
          metrics: {
            priorityDistribution,
            statusDistribution,
            categoryDistribution
          },
          processingLogs: processingLogs.slice(0, 5)
        }
      });

    } catch (error) {
      console.error('OGER Dashboard Error:', error);
      res.status(500).json({
        success: false,
        oger_status: 'error',
        error: error.message
      });
    }
  });
};

// OGER Intelligence Processing Function
async function processWithOGER(content, source, metadata) {
  const startTime = Date.now();
  
  try {
    // Import the intelligence service
    const intelligenceService = require('../../../intelligence-service.js');
    const result = await intelligenceService.processMarkdownContent(content);
    
    const processingTime = Date.now() - startTime;
    
    // Calculate additional metrics
    const categories = [...new Set(result.actionItems.map(item => item.category))];
    const priorityDistribution = result.actionItems.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      actionItems: result.actionItems,
      processingTime,
      categories,
      priorityDistribution,
      ogerVersion: '3.0.0'
    };
    
  } catch (error) {
    console.error('OGER Processing Error:', error);
    return {
      actionItems: [],
      processingTime: Date.now() - startTime,
      categories: [],
      priorityDistribution: {},
      error: error.message
    };
  }
}