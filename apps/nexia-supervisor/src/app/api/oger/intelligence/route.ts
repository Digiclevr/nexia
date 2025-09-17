import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// Mock data for testing when Directus is not available
const mockActionItems = [
  {
    id: '1',
    title: 'Investigate CPU Performance',
    description: 'High CPU usage detected in monitoring system',
    priority: 'urgent',
    category: 'performance',
    status: 'pending',
    estimated_effort: 'Medium',
    date_created: new Date().toISOString()
  },
  {
    id: '2', 
    title: 'Database Connection Optimization',
    description: 'Database connection timeout detected',
    priority: 'high',
    category: 'database',
    status: 'pending',
    estimated_effort: 'High',
    date_created: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Health Check Validation',
    description: 'Failed health check in BlueOcean ecosystem',
    priority: 'medium',
    category: 'infrastructure',
    status: 'pending',
    estimated_effort: 'Low',
    date_created: new Date().toISOString()
  }
];

// OGER Intelligence API - Direct processing with fallback to mock
export async function POST(request: NextRequest) {
  try {
    const { content, source, metadata } = await request.json();
    
    // Try to process with local intelligence service first
    let intelligenceResult;
    
    try {
      // Call local Node.js intelligence service
      intelligenceResult = await processWithLocalIntelligence(content, source || 'nexia-supervisor');
    } catch (error) {
      console.warn('Local intelligence service unavailable, using mock data:', error.message);
      
      // Fallback to mock data
      intelligenceResult = {
        success: true,
        oger_status: 'processing_complete_mock',
        data: {
          actionItemsCreated: mockActionItems.length,
          actionItems: mockActionItems,
          processingStats: {
            contentLength: content.length,
            processingTime: 150,
            categories: ['performance', 'database', 'infrastructure'],
            priorityDistribution: { urgent: 1, high: 1, medium: 1 }
          }
        }
      };
    }
    
    return NextResponse.json({
      success: true,
      data: intelligenceResult.data || intelligenceResult,
      oger_status: intelligenceResult.oger_status || 'processing_complete',
      source: source || 'nexia-supervisor',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('OGER Intelligence API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        oger_status: 'error'
      }, 
      { status: 500 }
    );
  }
}

// Local intelligence processing function
async function processWithLocalIntelligence(content: string, source: string) {
  return new Promise((resolve, reject) => {
    const servicePath = path.join(process.cwd(), '../nexia-directus/intelligence-service.js');
    
    const child = spawn('node', ['-e', `
      const service = require('${servicePath}');
      service.processMarkdownContent(\`${content.replace(/`/g, '\\`')}\`)
        .then(result => {
          console.log(JSON.stringify({
            success: true,
            oger_status: 'processing_complete',
            data: {
              actionItemsCreated: result.actionItems.length,
              actionItems: result.actionItems.map((item, index) => ({
                id: String(index + 1),
                title: item.title,
                description: item.description,
                priority: item.priority,
                category: item.category,
                status: 'pending',
                estimated_effort: item.estimatedEffort,
                date_created: new Date().toISOString()
              })),
              processingStats: {
                contentLength: ${content.length},
                processingTime: Date.now() - ${Date.now()},
                categories: [...new Set(result.actionItems.map(item => item.category))],
                priorityDistribution: result.actionItems.reduce((acc, item) => {
                  acc[item.priority] = (acc[item.priority] || 0) + 1;
                  return acc;
                }, {})
              }
            }
          }));
        })
        .catch(err => {
          console.error(JSON.stringify({ error: err.message }));
          process.exit(1);
        });
    `]);

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse intelligence service output: ${parseError.message}`));
        }
      } else {
        reject(new Error(`Intelligence service failed: ${errorOutput}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to spawn intelligence service: ${error.message}`));
    });
  });
}

// Get processed intelligence data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // For now, return mock dashboard data until Directus is fully integrated
    const mockDashboardData = {
      totalActionItems: mockActionItems.length,
      recentItems: mockActionItems,
      metrics: {
        priorityDistribution: { urgent: 1, high: 1, medium: 1 },
        statusDistribution: { pending: 3 },
        categoryDistribution: { performance: 1, database: 1, infrastructure: 1 }
      },
      processingLogs: [
        {
          id: '1',
          source: 'nexia-supervisor',
          action_items_extracted: 3,
          processing_time_ms: 150,
          date_created: new Date().toISOString()
        }
      ]
    };
    
    return NextResponse.json({
      success: true,
      data: mockDashboardData,
      oger_status: 'data_retrieved_mock',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('OGER Intelligence GET Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        oger_status: 'error'
      }, 
      { status: 500 }
    );
  }
}