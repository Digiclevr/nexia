export async function POST(request: Request) {
  const body = await request.json()
  
  // Handle immediate alerts with higher priority
  console.log('IMMEDIATE Alert received:', body)
  
  // Simulate immediate alert processing
  const alert = {
    id: `immediate_alert_${Date.now()}`,
    type: 'immediate',
    severity: 'critical',
    status: 'processing',
    timestamp: new Date().toISOString(),
    data: body
  }
  
  return Response.json({ 
    success: true, 
    alert,
    processed: true,
    next_check_in: 30 // seconds
  })
}