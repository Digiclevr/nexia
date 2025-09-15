import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Database,
  Globe,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface DashboardProps {
  ecosystemStatus: any;
}

interface ServiceMetrics {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  uptime: string;
  responseTime: number;
  requests: number;
  errors: number;
  cpu: number;
  memory: number;
  endpoints?: number;
  lastCheck: Date;
  url: string;
  description: string;
}

interface SystemMetrics {
  cluster: {
    nodes: number;
    pods: number;
    services: number;
    health: 'healthy' | 'warning' | 'error';
  };
  resources: {
    cpu: { used: number; total: number };
    memory: { used: number; total: number };
    storage: { used: number; total: number };
  };
  voice: {
    whisperPods: number;
    ttsPods: number;
    avgLatency: number;
    processedMinute: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ ecosystemStatus }) => {
  const [services, setServices] = useState<ServiceMetrics[]>([
    {
      name: 'KREACH',
      status: 'healthy',
      uptime: '2d 14h 32m',
      responseTime: 245,
      requests: 1547,
      errors: 3,
      cpu: 34,
      memory: 67,
      lastCheck: new Date(),
      url: 'http://localhost:5003',
      description: 'AI Market Intelligence Platform'
    },
    {
      name: 'OnlyOneAPI',
      status: 'healthy',
      uptime: '15d 8h 12m',
      responseTime: 89,
      requests: 15420,
      errors: 12,
      cpu: 28,
      memory: 45,
      endpoints: 402,
      lastCheck: new Date(),
      url: 'http://localhost:9090',
      description: '402 endpoints API platform'
    },
    {
      name: 'NEXTGEN',
      status: 'warning',
      uptime: '1d 2h 45m',
      responseTime: 456,
      requests: 892,
      errors: 23,
      cpu: 67,
      memory: 78,
      lastCheck: new Date(),
      url: 'http://localhost:7000',
      description: 'Domain monetization (230 domains)'
    },
    {
      name: 'KVIBE',
      status: 'error',
      uptime: '0h 0m',
      responseTime: 0,
      requests: 0,
      errors: 1,
      cpu: 0,
      memory: 0,
      lastCheck: new Date(),
      url: 'http://localhost:5002',
      description: 'Social media automation'
    },
    {
      name: 'NEXIA Voice',
      status: 'healthy',
      uptime: '0d 2h 15m',
      responseTime: 334,
      requests: 67,
      errors: 0,
      cpu: 45,
      memory: 52,
      lastCheck: new Date(),
      url: 'https://voice.nexia.blueocean.k8s',
      description: 'Voice assistant pipeline'
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cluster: {
      nodes: 3,
      pods: 24,
      services: 15,
      health: 'healthy'
    },
    resources: {
      cpu: { used: 2.4, total: 8.0 },
      memory: { used: 12.8, total: 32.0 },
      storage: { used: 145, total: 500 }
    },
    voice: {
      whisperPods: 2,
      ttsPods: 2,
      avgLatency: 387,
      processedMinute: 12
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const StatusIcon = ({ status, size = 'w-4 h-4' }: { status: string; size?: string }) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className={`${size} text-green-500`} />;
      case 'warning':
        return <AlertTriangle className={`${size} text-yellow-500`} />;
      case 'error':
        return <XCircle className={`${size} text-red-500`} />;
      default:
        return <Clock className={`${size} text-slate-500`} />;
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    trend, 
    icon: Icon, 
    status = 'normal',
    description 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    trend?: 'up' | 'down';
    icon: any;
    status?: 'normal' | 'success' | 'warning' | 'error';
    description?: string;
  }) => (
    <div className={`
      bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all
      ${status === 'success' ? 'border-green-500/30' : ''}
      ${status === 'warning' ? 'border-yellow-500/30' : ''}
      ${status === 'error' ? 'border-red-500/30' : ''}
    `}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`
            w-5 h-5
            ${status === 'success' ? 'text-green-400' : ''}
            ${status === 'warning' ? 'text-yellow-400' : ''}
            ${status === 'error' ? 'text-red-400' : ''}
            ${status === 'normal' ? 'text-blue-400' : ''}
          `} />
          <span className="text-sm font-medium text-slate-300">{title}</span>
        </div>
        {trend && (
          trend === 'up' ? 
            <TrendingUp className="w-4 h-4 text-green-400" /> : 
            <TrendingDown className="w-4 h-4 text-red-400" />
        )}
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
      </div>
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );

  const ServiceCard = ({ service }: { service: ServiceMetrics }) => (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <StatusIcon status={service.status} size="w-6 h-6" />
          <div>
            <h3 className="font-semibold text-white">{service.name}</h3>
            <p className="text-xs text-slate-400">{service.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-slate-300">{service.uptime}</div>
          <div className="text-xs text-slate-500">uptime</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{service.responseTime}ms</div>
          <div className="text-xs text-slate-500">Response</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{service.requests}</div>
          <div className="text-xs text-slate-500">Requests</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">{service.cpu}%</div>
          <div className="text-xs text-slate-500">CPU</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">{service.memory}%</div>
          <div className="text-xs text-slate-500">Memory</div>
        </div>
      </div>

      {service.endpoints && (
        <div className="mt-3 p-2 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">API Endpoints</span>
            <span className="font-bold text-blue-400">{service.endpoints}</span>
          </div>
        </div>
      )}

      {service.errors > 0 && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">{service.errors} errors in last hour</span>
          </div>
        </div>
      )}
    </div>
  );

  const refreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API calls to gather real metrics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update services status with some randomization for demo
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.floor(service.responseTime * (0.8 + Math.random() * 0.4)),
        requests: service.requests + Math.floor(Math.random() * 10),
        lastCheck: new Date()
      })));
      
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const healthyServices = services.filter(s => s.status === 'healthy').length;
  const warningServices = services.filter(s => s.status === 'warning').length;
  const errorServices = services.filter(s => s.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">BlueOcean Ecosystem Dashboard</h1>
          <p className="text-slate-400">Real-time monitoring and metrics</p>
        </div>
        <button
          onClick={refreshDashboard}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Services Health"
          value={`${healthyServices}/${services.length}`}
          icon={Activity}
          status={errorServices > 0 ? 'error' : warningServices > 0 ? 'warning' : 'success'}
          description="Active services status"
        />
        <MetricCard
          title="Cluster Nodes"
          value={systemMetrics.cluster.nodes}
          icon={Server}
          status="success"
          description="Kubernetes nodes active"
        />
        <MetricCard
          title="Voice Latency"
          value={systemMetrics.voice.avgLatency}
          unit="ms"
          icon={Zap}
          status={systemMetrics.voice.avgLatency > 500 ? 'warning' : 'success'}
          description="Average voice processing"
        />
        <MetricCard
          title="API Endpoints"
          value={402}
          icon={Globe}
          status="success"
          description="OnlyOneAPI total endpoints"
        />
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-slate-300">CPU Usage</span>
            </div>
            <span className="text-lg font-bold text-white">
              {((systemMetrics.resources.cpu.used / systemMetrics.resources.cpu.total) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(systemMetrics.resources.cpu.used / systemMetrics.resources.cpu.total) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {systemMetrics.resources.cpu.used} / {systemMetrics.resources.cpu.total} cores
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-400" />
              <span className="font-medium text-slate-300">Memory</span>
            </div>
            <span className="text-lg font-bold text-white">
              {((systemMetrics.resources.memory.used / systemMetrics.resources.memory.total) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(systemMetrics.resources.memory.used / systemMetrics.resources.memory.total) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {systemMetrics.resources.memory.used}GB / {systemMetrics.resources.memory.total}GB
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-slate-300">Storage</span>
            </div>
            <span className="text-lg font-bold text-white">
              {((systemMetrics.resources.storage.used / systemMetrics.resources.storage.total) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(systemMetrics.resources.storage.used / systemMetrics.resources.storage.total) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {systemMetrics.resources.storage.used}GB / {systemMetrics.resources.storage.total}GB
          </div>
        </div>
      </div>

      {/* Voice Services Status */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center space-x-2 mb-4">
          <Network className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">NEXIA Voice Pipeline</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{systemMetrics.voice.whisperPods}</div>
            <div className="text-sm text-slate-400">Whisper Pods</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{systemMetrics.voice.ttsPods}</div>
            <div className="text-sm text-slate-400">TTS Pods</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{systemMetrics.voice.avgLatency}ms</div>
            <div className="text-sm text-slate-400">Avg Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{systemMetrics.voice.processedMinute}</div>
            <div className="text-sm text-slate-400">Requests/min</div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <span>Services Monitoring</span>
        </h2>
        <div className="grid gap-4">
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;