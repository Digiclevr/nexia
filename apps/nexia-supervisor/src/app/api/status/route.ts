export async function GET() {
  return Response.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    active_services: 4,
    health_score: 87,
    uptime_days: 15,
    decisions_today: 42,
    voice_commands_today: 8,
    llm_status: 'connected',
    last_voice_command: 'Status global NEXIA',
    last_command_time: 'Il y a 2 minutes'
  })
}