'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OgerIntelligence from '@/components/OgerIntelligence';
import { 
  Brain, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  TrendingUp,
  Users,
  Target,
  BarChart3
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
}

interface EcosystemData {
  onlyoneapi: { status: string; health: string; };
  blueocean: { status: string; health: string; };
  nexia: { status: string; health: string; };
}

export default function OgerDashboard() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [ecosystemData, setEcosystemData] = useState<EcosystemData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real-time monitoring data
  const fetchMonitoringData = async () => {
    try {
      // Fetch system metrics
      const metricsResponse = await fetch('/api/monitoring/metrics');
      if (metricsResponse.ok) {
        const metrics = await metricsResponse.json();
        setSystemMetrics(metrics.data);
      }

      // Fetch ecosystem status
      const ecosystemResponse = await fetch('/api/ecosystems');
      if (ecosystemResponse.ok) {
        const ecosystem = await ecosystemResponse.json();
        setEcosystemData(ecosystem.data);
      }

      // Fetch alerts
      const alertsResponse = await fetch('/api/alerts');
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData.data || []);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Prepare monitoring data for OGER processing
  const monitoringDataForOger = {
    ecosystems: ecosystemData,
    metrics: systemMetrics,
    alerts: alerts,
    timestamp: new Date().toISOString()
  };

  const getHealthColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'active':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
      case 'down':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <Activity className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-lg">Loading OGER Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">OGER Intelligence Dashboard</h1>
            <p className="text-gray-600">Orchestrated Generated Executive Reporting - Phase 3</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-purple-100 text-purple-800">
            🧠 AI-Powered
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            🟢 Live
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="intelligence" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="intelligence" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Intelligence</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="orchestration" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Orchestration</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Intelligence Tab */}
        <TabsContent value="intelligence">
          <OgerIntelligence 
            monitoringData={monitoringDataForOger}
            className="space-y-6"
          />
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* System Metrics */}
          {systemMetrics && (
            <Card>
              <CardHeader title="System Performance">
                <TrendingUp className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">CPU Usage</p>
                    <p className="text-2xl font-bold">{systemMetrics.cpu}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Memory</p>
                    <p className="text-2xl font-bold">{systemMetrics.memory}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Disk</p>
                    <p className="text-2xl font-bold">{systemMetrics.disk}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="text-lg font-bold">{systemMetrics.uptime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ecosystem Status */}
          {ecosystemData && (
            <Card>
              <CardHeader title="Ecosystem Health">
                <Users className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(ecosystemData).map(([name, data]) => (
                    <div key={name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{name}</h4>
                        {getHealthIcon(data.status)}
                      </div>
                      <p className={`text-sm ${getHealthColor(data.status)}`}>
                        Status: {data.status}
                      </p>
                      <p className={`text-sm ${getHealthColor(data.health)}`}>
                        Health: {data.health}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader title={`Active Alerts (${alerts.length})`}>
                <AlertTriangle className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.slice(0, 10).map((alert, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">{alert.severity || 'WARNING'}</span>
                        <span className="text-sm text-red-700">{alert.message || alert.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Orchestration Tab */}
        <TabsContent value="orchestration" className="space-y-6">
          <Card>
            <CardHeader title="Workflow Orchestration">
              <Target className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Intelligent Workflow Automation</h3>
                <p className="text-gray-600 mb-4">
                  OGER automatically analyzes monitoring data and generates actionable workflows
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-medium">Automatic Detection</h4>
                    <p className="text-sm text-gray-600">
                      Real-time monitoring data analysis and anomaly detection
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Zap className="h-8 w-8 text-blue-600 mb-2" />
                    <h4 className="font-medium">Smart Actions</h4>
                    <p className="text-sm text-gray-600">
                      AI-generated action items with priority and effort estimation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader title="Intelligence Analytics">
              <BarChart3 className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Predictive Analytics</h3>
                <p className="text-gray-600">
                  Advanced analytics and trend prediction coming in Phase 4
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}