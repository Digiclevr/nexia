import React from 'react';
import { Row, Col, Card, Statistic, Progress, Alert, Tag, Spin, Button } from 'antd';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  HeartOutlined, 
  CloudServerOutlined, 
  DatabaseOutlined, 
  GlobalOutlined,
  SafetyOutlined,
  MonitorOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const PageTitle = styled.div`
  margin-bottom: 24px;
  
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin: 0;
    color: #2c3e50;
  }
  
  .subtitle {
    color: #8c8c8c;
    font-size: 14px;
    margin-top: 4px;
  }
`;

const ScoreCard = styled(Card)`
  text-align: center;
  .score-circle {
    width: 100px;
    height: 100px;
    margin: 0 auto 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: white;
  }
  
  .score-good { background: linear-gradient(135deg, #52c41a, #73d13d); }
  .score-warning { background: linear-gradient(135deg, #faad14, #ffd53e); }
  .score-danger { background: linear-gradient(135deg, #ff4d4f, #ff7875); }
`;

const MetricCard = styled(Card)`
  .metric-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .metric-score {
    font-size: 32px;
    font-weight: 600;
    line-height: 1;
  }
  
  .metric-status {
    font-size: 12px;
    margin-top: 4px;
  }
`;

const ActionItem = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  
  &.urgent { background: #fff2f0; border-left: 4px solid #ff4d4f; }
  &.medium { background: #fffbe6; border-left: 4px solid #faad14; }
  &.low { background: #f6ffed; border-left: 4px solid #52c41a; }
  
  .action-icon {
    margin-top: 2px;
  }
  
  .action-content {
    flex: 1;
    font-size: 13px;
    line-height: 1.4;
  }
`;

// Mock data - replace with real API calls
const mockData = {
  overallScore: 78,
  categories: {
    infrastructure: { score: 95, status: 'excellent', issues: [] },
    applications: { score: 68, status: 'warning', issues: ['3 pods crashing', '1 deployment failed'] },
    storage: { score: 85, status: 'good', issues: [] },
    network: { score: 75, status: 'warning', issues: ['2 NetworkPolicies too restrictive'] },
    security: { score: 80, status: 'good', issues: [] },
    monitoring: { score: 85, status: 'good', issues: [] }
  },
  trends: [
    { time: '00:00', score: 82 },
    { time: '04:00', score: 78 },
    { time: '08:00', score: 85 },
    { time: '12:00', score: 78 },
    { time: '16:00', score: 74 },
    { time: '20:00', score: 78 }
  ],
  actions: [
    { priority: 'urgent', title: 'Fix crashing pods in production namespace', type: 'applications' },
    { priority: 'medium', title: 'Review NetworkPolicy restrictions', type: 'network' },
    { priority: 'low', title: 'Update security contexts for 5 pods', type: 'security' }
  ]
};

const getScoreColor = (score) => {
  if (score >= 80) return 'score-good';
  if (score >= 70) return 'score-warning';
  return 'score-danger';
};

const getScoreStatus = (score) => {
  if (score >= 90) return { color: '#52c41a', text: 'Excellent' };
  if (score >= 80) return { color: '#52c41a', text: 'Good' };
  if (score >= 70) return { color: '#faad14', text: 'Warning' };
  return { color: '#ff4d4f', text: 'Critical' };
};

const categoryIcons = {
  infrastructure: <CloudServerOutlined />,
  applications: <HeartOutlined />,
  storage: <DatabaseOutlined />,
  network: <GlobalOutlined />,
  security: <SafetyOutlined />,
  monitoring: <MonitorOutlined />
};

const Dashboard = () => {
  const overallStatus = getScoreStatus(mockData.overallScore);

  return (
    <div>
      <PageTitle>
        <h1>🏥 Kubernetes Health Dashboard</h1>
        <div className="subtitle">
          Real-time monitoring of your cluster's health and performance
        </div>
      </PageTitle>

      {/* Overall Health Score */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <ScoreCard>
            <div className={`score-circle ${getScoreColor(mockData.overallScore)}`}>
              {mockData.overallScore}/100
            </div>
            <Statistic
              title="Overall Health Score"
              value={mockData.overallScore}
              suffix="/100"
              valueStyle={{ color: overallStatus.color, fontSize: '24px' }}
            />
            <Tag color={overallStatus.color} style={{ marginTop: 8 }}>
              {overallStatus.text}
            </Tag>
          </ScoreCard>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card title="24-Hour Score Trend" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockData.trends}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#667eea" 
                  fillOpacity={1} 
                  fill="url(#scoreGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Category Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {Object.entries(mockData.categories).map(([category, data]) => {
          const status = getScoreStatus(data.score);
          return (
            <Col xs={12} sm={8} lg={4} key={category}>
              <MetricCard size="small">
                <div className="metric-icon" style={{ color: '#667eea' }}>
                  {categoryIcons[category]}
                </div>
                <div className="metric-score" style={{ color: status.color }}>
                  {data.score}
                </div>
                <div style={{ fontSize: '12px', textTransform: 'capitalize', marginBottom: '8px' }}>
                  {category}
                </div>
                <Progress 
                  percent={data.score} 
                  size="small" 
                  strokeColor={status.color}
                  showInfo={false}
                />
                <div className="metric-status">
                  <Tag size="small" color={status.color}>
                    {status.text}
                  </Tag>
                </div>
              </MetricCard>
            </Col>
          );
        })}
      </Row>

      {/* Current Issues and Actions */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title="🚨 Active Issues" 
            extra={<Tag color="orange">{mockData.actions.length} items</Tag>}
          >
            {mockData.actions.length > 0 ? (
              mockData.actions.map((action, index) => (
                <ActionItem key={index} className={action.priority}>
                  <div className="action-icon">
                    {action.priority === 'urgent' && <WarningOutlined style={{ color: '#ff4d4f' }} />}
                    {action.priority === 'medium' && <ClockCircleOutlined style={{ color: '#faad14' }} />}
                    {action.priority === 'low' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  </div>
                  <div className="action-content">
                    <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                      {action.title}
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                      {action.type.charAt(0).toUpperCase() + action.type.slice(1)} • {action.priority.toUpperCase()}
                    </div>
                  </div>
                </ActionItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#52c41a' }} />
                <div>No active issues</div>
                <div style={{ fontSize: '12px' }}>All systems are healthy</div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📊 Quick Stats">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Nodes Ready"
                  value={28}
                  suffix="/ 28"
                  prefix={<CloudServerOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Pods Running"
                  value={247}
                  suffix="/ 250"
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Namespaces"
                  value={62}
                  prefix={<GlobalOutlined />}
                  valueStyle={{ color: '#667eea' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="PV Bound"
                  value={42}
                  suffix="/ 44"
                  prefix={<DatabaseOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>

            <Alert
              message="Last health check: 2 minutes ago"
              type="info"
              showIcon
              style={{ marginTop: 16 }}
              action={
                <Button size="small" type="primary" ghost>
                  Run Check Now
                </Button>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;