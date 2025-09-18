import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { command, ecosystem, timestamp } = await request.json();
    
    // Simulation traitement commande vocale
    const response = {
      status: 'processed',
      command_received: command,
      target_ecosystem: ecosystem || 'global',
      action_taken: `Executing: ${command}`,
      timestamp: new Date().toISOString(),
      success: true
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur API voice command:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la commande vocale' },
      { status: 500 }
    );
  }
}