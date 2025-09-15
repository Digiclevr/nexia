export async function GET() {
  return Response.json({
    blueocean: Math.random() > 0.7 ? 'healthy' : Math.random() > 0.3 ? 'warning' : 'unhealthy',
    onlyoneapi: Math.random() > 0.8 ? 'healthy' : 'warning', 
    business_automation: Math.random() > 0.6 ? 'healthy' : 'unhealthy',
    claude_code: Math.random() > 0.9 ? 'healthy' : 'warning',
    timestamp: new Date().toISOString()
  })
}