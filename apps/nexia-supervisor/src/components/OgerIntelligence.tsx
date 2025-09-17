'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimated_effort: string;
  date_created: string;
}

interface OgerDashboardData {
  totalActionItems: number;
  recentItems: ActionItem[];
  metrics: {
    priorityDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  };
  processingLogs: any[];
}

interface OgerIntelligenceProps {
  monitoringData?: any;
  className?: string;
}

export default function OgerIntelligence({ monitoringData, className = '' }: OgerIntelligenceProps) {
  const [dashboardData, setDashboardData] = useState<OgerDashboardData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch OGER dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/oger/intelligence');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch OGER dashboard:', error);
    }
  };

  // Process current monitoring data with OGER
  const processMonitoringData = async () => {
    if (!monitoringData) return;
    
    setIsProcessing(true);
    try {
      // Convert monitoring data to markdown format for processing
      const content = generateMarkdownFromMonitoring(monitoringData);
      
      const response = await fetch('/api/oger/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          source: 'nexia-supervisor',
          metadata: {
            timestamp: new Date().toISOString(),
            monitoring_context: 'real_time'
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh dashboard after processing
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to process monitoring data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Process monitoring data when it changes
  useEffect(() => {
    if (monitoringData && autoRefresh) {
      processMonitoringData();
    }
  }, [monitoringData]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">OGER Intelligence</h2>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Phase 3 - Live
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <Zap className="h-4 w-4 mr-1" />
            Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={processMonitoringData}
            disabled={isProcessing || !monitoringData}
          >
            {isProcessing ? (
              <>
                <Activity className="h-4 w-4 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-1" />
                Process Now
              </>
            )}
          </Button>
          
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Dashboard Metrics */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Action Items</p>
                  <p className="text-2xl font-bold">{dashboardData.totalActionItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent Items</p>
                  <p className="text-2xl font-bold text-red-600">
                    {dashboardData.metrics.priorityDistribution.urgent || 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dashboardData.metrics.statusDistribution.in_progress || 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData.metrics.statusDistribution.completed || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Action Items */}
      {dashboardData && dashboardData.recentItems.length > 0 && (
        <Card>
          <CardHeader title="Recent Intelligence Actions">
            <Activity className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentItems.slice(0, 10).map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(item.status)}
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Effort: {item.estimated_effort}</span>
                      <span>Created: {new Date(item.date_created).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastRefresh.toLocaleTimeString()} | 
        OGER Phase 3 - Real-time Intelligence Integration
      </div>
    </div>
  );
}

// Helper function to generate markdown from monitoring data
function generateMarkdownFromMonitoring(monitoringData: any): string {
  const timestamp = new Date().toISOString();
  
  let markdown = `# NEXIA Monitoring Report - ${timestamp}\n\n`;
  
  if (monitoringData.ecosystems) {
    markdown += `## Ecosystem Status\n\n`;
    Object.entries(monitoringData.ecosystems).forEach(([name, data]: [string, any]) => {
      markdown += `### ${name}\n`;
      markdown += `- Status: ${data.status || 'unknown'}\n`;
      markdown += `- Health: ${data.health || 'unknown'}\n`;
      if (data.issues && data.issues.length > 0) {
        markdown += `- Issues detected: ${data.issues.length}\n`;
        data.issues.forEach((issue: string) => {
          markdown += `  - ${issue}\n`;
        });
      }
      markdown += `\n`;
    });
  }

  if (monitoringData.alerts) {
    markdown += `## Active Alerts\n\n`;
    monitoringData.alerts.forEach((alert: any) => {
      markdown += `- **${alert.severity || 'UNKNOWN'}**: ${alert.message || alert.title}\n`;
    });
    markdown += `\n`;
  }

  if (monitoringData.performance) {
    markdown += `## Performance Metrics\n\n`;
    Object.entries(monitoringData.performance).forEach(([metric, value]: [string, any]) => {
      markdown += `- ${metric}: ${value}\n`;
    });
    markdown += `\n`;
  }

  markdown += `## Recommendations\n\n`;
  markdown += `Based on current monitoring data, the following actions may be required:\n`;
  markdown += `- Review system performance\n`;
  markdown += `- Investigate any failed health checks\n`;
  markdown += `- Monitor resource utilization\n`;

  return markdown;
}