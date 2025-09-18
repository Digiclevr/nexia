import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulation des données écosystèmes pour NEXIA
    const ecosystems = {
      blueocean: {
        status: "healthy",
        applications: ["kreach", "nextgen", "nextstep", "kvibe"],
        health_score: 85,
        last_deployment: "2025-09-15T20:30:00Z",
        active_services: 12
      },
      onlyoneapi: {
        status: "healthy", 
        applications: ["marketing", "developer", "portal", "community", "api"],
        health_score: 92,
        last_deployment: "2025-09-15T18:15:00Z",
        active_services: 5
      },
      business_automation: {
        status: "warning",
        applications: ["agents", "n8n", "cockpit"],
        health_score: 78,
        last_deployment: "2025-09-15T16:45:00Z",
        active_services: 7,
        warnings: ["Agent PMO timeout", "Redis connection spikes"]
      },
      claude_code: {
        status: "healthy",
        applications: ["supervisor-24x7"],
        health_score: 88,
        last_deployment: "2025-09-15T22:00:00Z",
        active_services: 1
      }
    };

    return NextResponse.json({
      ecosystems,
      total_applications: 25,
      overall_health: 86,
      timestamp: new Date().toISOString(),
      nexia_status: "supervising"
    });
  } catch (error) {
    console.error('Erreur API ecosystems:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des écosystèmes' },
      { status: 500 }
    );
  }
}