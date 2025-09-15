export async function GET() {
  const alerts = []
  
  // Simulate some alerts based on current ecosystem health
  if (Math.random() > 0.7) {
    alerts.push({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'service_down',
      target: Math.random() > 0.5 ? 'blueocean' : 'business-automation',
      message: Math.random() > 0.5 ? 'BlueOcean is unhealthy' : 'Business-Automation is unhealthy',
      severity: Math.random() > 0.5 ? 'high' : 'critical',
      createdAt: new Date().toISOString(),
      source: 'nexia_supervisor'
    })
  }

  return Response.json(alerts)
}