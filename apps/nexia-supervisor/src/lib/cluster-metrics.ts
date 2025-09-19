import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ClusterMetrics {
  nodes: NodeMetrics[];
  pods: PodMetrics;
  issues: ClusterIssue[];
  summary: ClusterSummary;
}

export interface NodeMetrics {
  name: string;
  cpu_cores: number;
  cpu_percent: number;
  memory_bytes: number;
  memory_percent: number;
  status: string;
}

export interface PodMetrics {
  total: number;
  running: number;
  failed: number;
  pending: number;
  unknown: number;
}

export interface ClusterIssue {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  status: 'pending' | 'investigating' | 'resolved';
  estimated_effort: 'Low' | 'Medium' | 'High';
  date_created: string;
  node?: string;
  namespace?: string;
}

export interface ClusterSummary {
  total_nodes: number;
  healthy_nodes: number;
  high_cpu_nodes: number;
  high_memory_nodes: number;
  total_cpu_percent: number;
  total_memory_percent: number;
}

export async function getClusterMetrics(): Promise<ClusterMetrics> {
  try {
    // Get node metrics
    const nodes = await getNodeMetrics();
    
    // Get pod status
    const pods = await getPodMetrics();
    
    // Analyze and generate issues
    const issues = await analyzeClusterIssues(nodes, pods);
    
    // Calculate summary
    const summary = calculateClusterSummary(nodes);
    
    return {
      nodes,
      pods,
      issues,
      summary
    };
  } catch (error) {
    console.error('Error getting cluster metrics:', error);
    throw error;
  }
}

async function getNodeMetrics(): Promise<NodeMetrics[]> {
  try {
    const { stdout } = await execAsync('kubectl top nodes --no-headers');
    const lines = stdout.trim().split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const [name, cpu_raw, cpu_percent_raw, memory_raw, memory_percent_raw] = parts;
      
      return {
        name,
        cpu_cores: parseInt(cpu_raw.replace('m', '')) / 1000,
        cpu_percent: parseInt(cpu_percent_raw.replace('%', '')),
        memory_bytes: parseMemory(memory_raw),
        memory_percent: parseInt(memory_percent_raw.replace('%', '')),
        status: 'running'
      };
    });
  } catch (error) {
    console.error('Error getting node metrics:', error);
    return [];
  }
}

async function getPodMetrics(): Promise<PodMetrics> {
  try {
    const { stdout } = await execAsync('kubectl get pods -A --no-headers');
    const lines = stdout.trim().split('\n').filter(line => line.trim());
    
    const statusCounts = {
      running: 0,
      failed: 0,
      pending: 0,
      unknown: 0
    };
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const status = parts[3]?.toLowerCase() || 'unknown';
      
      if (status.includes('running')) {
        statusCounts.running++;
      } else if (status.includes('failed') || status.includes('error') || status.includes('crashloop')) {
        statusCounts.failed++;
      } else if (status.includes('pending') || status.includes('creating')) {
        statusCounts.pending++;
      } else {
        statusCounts.unknown++;
      }
    });
    
    return {
      total: lines.length,
      ...statusCounts
    };
  } catch (error) {
    console.error('Error getting pod metrics:', error);
    return { total: 0, running: 0, failed: 0, pending: 0, unknown: 0 };
  }
}

async function analyzeClusterIssues(nodes: NodeMetrics[], pods: PodMetrics): Promise<ClusterIssue[]> {
  const issues: ClusterIssue[] = [];
  
  // Check high CPU nodes
  const highCpuNodes = nodes.filter(node => node.cpu_percent > 70);
  if (highCpuNodes.length > 0) {
    issues.push({
      id: `cpu-${Date.now()}`,
      title: `High CPU Usage on ${highCpuNodes.length} Node(s)`,
      description: `Nodes with >70% CPU: ${highCpuNodes.map(n => `${n.name} (${n.cpu_percent}%)`).join(', ')}`,
      priority: highCpuNodes.some(n => n.cpu_percent > 90) ? 'urgent' : 'high',
      category: 'performance',
      status: 'pending',
      estimated_effort: 'Medium',
      date_created: new Date().toISOString(),
      node: highCpuNodes[0].name
    });
  }
  
  // Check high memory nodes
  const highMemoryNodes = nodes.filter(node => node.memory_percent > 80);
  if (highMemoryNodes.length > 0) {
    issues.push({
      id: `memory-${Date.now()}`,
      title: `High Memory Usage on ${highMemoryNodes.length} Node(s)`,
      description: `Nodes with >80% memory: ${highMemoryNodes.map(n => `${n.name} (${n.memory_percent}%)`).join(', ')}`,
      priority: highMemoryNodes.some(n => n.memory_percent > 95) ? 'urgent' : 'high',
      category: 'infrastructure',
      status: 'pending',
      estimated_effort: 'High',
      date_created: new Date().toISOString(),
      node: highMemoryNodes[0].name
    });
  }
  
  // Check failed pods
  if (pods.failed > 0) {
    issues.push({
      id: `pods-failed-${Date.now()}`,
      title: `${pods.failed} Failed Pod(s) Detected`,
      description: `${pods.failed} pods are in failed/error state and require investigation`,
      priority: pods.failed > 5 ? 'high' : 'medium',
      category: 'infrastructure',
      status: 'pending',
      estimated_effort: 'Medium',
      date_created: new Date().toISOString()
    });
  }
  
  // Check pending pods
  if (pods.pending > 3) {
    issues.push({
      id: `pods-pending-${Date.now()}`,
      title: `${pods.pending} Pending Pod(s)`,
      description: `${pods.pending} pods are stuck in pending state, possibly resource constraints`,
      priority: pods.pending > 10 ? 'high' : 'medium',
      category: 'scheduling',
      status: 'pending',
      estimated_effort: 'Low',
      date_created: new Date().toISOString()
    });
  }
  
  // Check overall cluster health
  const avgCpu = nodes.reduce((sum, node) => sum + node.cpu_percent, 0) / nodes.length;
  const avgMemory = nodes.reduce((sum, node) => sum + node.memory_percent, 0) / nodes.length;
  
  if (avgCpu > 60) {
    issues.push({
      id: `cluster-cpu-${Date.now()}`,
      title: 'Cluster-Wide High CPU Usage',
      description: `Average CPU usage across cluster is ${avgCpu.toFixed(1)}%`,
      priority: 'medium',
      category: 'performance',
      status: 'pending',
      estimated_effort: 'High',
      date_created: new Date().toISOString()
    });
  }
  
  return issues;
}

function calculateClusterSummary(nodes: NodeMetrics[]): ClusterSummary {
  const total_nodes = nodes.length;
  const healthy_nodes = nodes.filter(node => node.cpu_percent < 70 && node.memory_percent < 80).length;
  const high_cpu_nodes = nodes.filter(node => node.cpu_percent > 70).length;
  const high_memory_nodes = nodes.filter(node => node.memory_percent > 80).length;
  
  const total_cpu_percent = nodes.reduce((sum, node) => sum + node.cpu_percent, 0) / total_nodes;
  const total_memory_percent = nodes.reduce((sum, node) => sum + node.memory_percent, 0) / total_nodes;
  
  return {
    total_nodes,
    healthy_nodes,
    high_cpu_nodes,
    high_memory_nodes,
    total_cpu_percent: Math.round(total_cpu_percent * 10) / 10,
    total_memory_percent: Math.round(total_memory_percent * 10) / 10
  };
}

function parseMemory(memStr: string): number {
  const num = parseFloat(memStr);
  if (memStr.includes('Gi')) {
    return num * 1024 * 1024 * 1024;
  } else if (memStr.includes('Mi')) {
    return num * 1024 * 1024;
  } else if (memStr.includes('Ki')) {
    return num * 1024;
  }
  return num;
}