import { NextRequest, NextResponse } from 'next/server'

// NEXIA Voice Command Processing API
// Handles voice commands and executes appropriate actions
export async function POST(request: NextRequest) {
  try {
    const { command, transcription, confidence } = await request.json()
    
    if (!command && !transcription) {
      return NextResponse.json(
        { success: false, error: 'Command or transcription is required' },
        { status: 400 }
      )
    }

    const commandText = command || transcription
    const processedCommand = processVoiceCommand(commandText)
    
    // Execute the command based on its type
    let result
    switch (processedCommand.type) {
      case 'system_status':
        result = await handleSystemStatusCommand(processedCommand)
        break
      case 'deployment':
        result = await handleDeploymentCommand(processedCommand)
        break
      case 'monitoring':
        result = await handleMonitoringCommand(processedCommand)
        break
      case 'ecosystem':
        result = await handleEcosystemCommand(processedCommand)
        break
      case 'oger':
        result = await handleOgerCommand(processedCommand)
        break
      case 'voice_control':
        result = await handleVoiceControlCommand(processedCommand)
        break
      case 'navigation':
        result = await handleNavigationCommand(processedCommand)
        break
      default:
        result = {
          success: false,
          message: `Unknown command type: ${processedCommand.type}`,
          suggestion: 'Try commands like "show system status", "deploy application", or "check monitoring"'
        }
    }

    return NextResponse.json({
      success: true,
      originalCommand: commandText,
      processedCommand,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('NEXIA Voice Command Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Voice command processing failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

interface ProcessedCommand {
  type: string
  action: string
  target?: string
  parameters?: Record<string, any>
  intent: string
  confidence: number
}

// Parse and classify voice commands
function processVoiceCommand(commandText: string): ProcessedCommand {
  const text = commandText.toLowerCase().trim()
  
  // System status commands
  if (text.includes('status') || text.includes('health') || text.includes('overview')) {
    return {
      type: 'system_status',
      action: 'show',
      target: extractTarget(text, ['system', 'cluster', 'services', 'all']),
      intent: 'Get system status information',
      confidence: 0.9
    }
  }
  
  // Deployment commands
  if (text.includes('deploy') || text.includes('restart') || text.includes('start') || text.includes('stop')) {
    const action = extractAction(text, ['deploy', 'restart', 'start', 'stop', 'scale'])
    return {
      type: 'deployment',
      action,
      target: extractTarget(text, ['nexia', 'oger', 'directus', 'supervisor', 'all']),
      intent: `${action} application or service`,
      confidence: 0.85
    }
  }
  
  // Monitoring commands
  if (text.includes('monitor') || text.includes('metrics') || text.includes('logs') || text.includes('alert')) {
    return {
      type: 'monitoring',
      action: 'show',
      target: extractTarget(text, ['metrics', 'logs', 'alerts', 'performance']),
      intent: 'Show monitoring information',
      confidence: 0.8
    }
  }
  
  // Ecosystem commands
  if (text.includes('ecosystem') || text.includes('blueocean') || text.includes('onlyoneapi')) {
    return {
      type: 'ecosystem',
      action: 'show',
      target: extractTarget(text, ['blueocean', 'onlyoneapi', 'business-automation', 'all']),
      intent: 'Show ecosystem information',
      confidence: 0.8
    }
  }
  
  // OGER commands
  if (text.includes('oger') || text.includes('intelligence') || text.includes('analysis')) {
    return {
      type: 'oger',
      action: extractAction(text, ['analyze', 'process', 'show', 'create']),
      target: 'intelligence',
      intent: 'OGER intelligence operations',
      confidence: 0.85
    }
  }
  
  // Voice control commands
  if (text.includes('voice') || text.includes('speak') || text.includes('say') || text.includes('announce')) {
    return {
      type: 'voice_control',
      action: extractAction(text, ['speak', 'announce', 'say', 'mute', 'unmute']),
      parameters: { message: extractMessage(text) },
      intent: 'Control voice system',
      confidence: 0.9
    }
  }
  
  // Navigation commands
  if (text.includes('show') || text.includes('display') || text.includes('open') || text.includes('go to')) {
    return {
      type: 'navigation',
      action: 'navigate',
      target: extractTarget(text, ['dashboard', 'monitoring', 'deployment', 'matrix', 'oger']),
      intent: 'Navigate to page or section',
      confidence: 0.75
    }
  }
  
  // Default fallback
  return {
    type: 'unknown',
    action: 'process',
    intent: 'Unknown command - needs clarification',
    confidence: 0.3
  }
}

// Command handlers

async function handleSystemStatusCommand(cmd: ProcessedCommand) {
  const target = cmd.target || 'all'
  
  try {
    // Call system status API
    const response = await fetch('http://localhost:7010/api/blueocean/status')
    const status = await response.json()
    
    return {
      success: true,
      action: 'system_status_retrieved',
      data: status,
      message: `System status for ${target} retrieved successfully`,
      voiceResponse: generateStatusVoiceResponse(status, target)
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to retrieve system status',
      voiceResponse: 'Unable to retrieve system status at this time'
    }
  }
}

async function handleDeploymentCommand(cmd: ProcessedCommand) {
  const { action, target } = cmd
  
  // For demo purposes, simulate deployment actions
  const deploymentActions = {
    deploy: `Deploying ${target || 'application'}`,
    restart: `Restarting ${target || 'services'}`,
    start: `Starting ${target || 'services'}`,
    stop: `Stopping ${target || 'services'}`,
    scale: `Scaling ${target || 'application'}`
  }
  
  return {
    success: true,
    action: `deployment_${action}`,
    message: deploymentActions[action as keyof typeof deploymentActions] || 'Deployment action executed',
    voiceResponse: `${deploymentActions[action as keyof typeof deploymentActions]} initiated`
  }
}

async function handleMonitoringCommand(cmd: ProcessedCommand) {
  const target = cmd.target || 'metrics'
  
  return {
    success: true,
    action: 'monitoring_displayed',
    message: `Showing ${target} monitoring data`,
    voiceResponse: `Displaying ${target} monitoring information`,
    navigation: `/monitoring?view=${target}`
  }
}

async function handleEcosystemCommand(cmd: ProcessedCommand) {
  const target = cmd.target || 'all'
  
  return {
    success: true,
    action: 'ecosystem_displayed',
    message: `Showing ${target} ecosystem status`,
    voiceResponse: `Displaying ${target} ecosystem information`,
    navigation: `/ecosystems/${target === 'all' ? '' : target}`
  }
}

async function handleOgerCommand(cmd: ProcessedCommand) {
  const { action } = cmd
  
  try {
    if (action === 'analyze' || action === 'process') {
      // Trigger OGER analysis
      const response = await fetch('http://localhost:7010/api/oger/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Voice command triggered OGER analysis',
          source: 'nexia-voice'
        })
      })
      
      const result = await response.json()
      
      return {
        success: true,
        action: 'oger_analysis_triggered',
        data: result,
        message: 'OGER intelligence analysis initiated',
        voiceResponse: 'OGER analysis initiated successfully',
        navigation: '/oger'
      }
    }
    
    return {
      success: true,
      action: 'oger_displayed',
      message: 'Showing OGER intelligence dashboard',
      voiceResponse: 'Displaying OGER intelligence dashboard',
      navigation: '/oger'
    }
  } catch (error) {
    return {
      success: false,
      message: 'OGER operation failed',
      voiceResponse: 'OGER operation could not be completed'
    }
  }
}

async function handleVoiceControlCommand(cmd: ProcessedCommand) {
  const { action, parameters } = cmd
  
  if (action === 'speak' || action === 'announce' || action === 'say') {
    const message = parameters?.message || 'NEXIA voice system operational'
    
    return {
      success: true,
      action: 'voice_announcement',
      message: `Speaking: ${message}`,
      voiceResponse: message,
      speakMessage: true
    }
  }
  
  return {
    success: true,
    action: 'voice_control',
    message: `Voice ${action} executed`,
    voiceResponse: `Voice ${action} completed`
  }
}

async function handleNavigationCommand(cmd: ProcessedCommand) {
  const target = cmd.target || 'dashboard'
  
  const navigationMap = {
    dashboard: '/',
    monitoring: '/monitoring',
    deployment: '/deployment',
    matrix: '/matrix',
    oger: '/oger',
    ecosystems: '/ecosystems'
  }
  
  return {
    success: true,
    action: 'navigation',
    message: `Navigating to ${target}`,
    voiceResponse: `Opening ${target} page`,
    navigation: navigationMap[target as keyof typeof navigationMap] || '/'
  }
}

// Helper functions

function extractAction(text: string, possibleActions: string[]): string {
  for (const action of possibleActions) {
    if (text.includes(action)) {
      return action
    }
  }
  return possibleActions[0] || 'show'
}

function extractTarget(text: string, possibleTargets: string[]): string {
  for (const target of possibleTargets) {
    if (text.includes(target)) {
      return target
    }
  }
  return possibleTargets[0] || 'all'
}

function extractMessage(text: string): string {
  // Extract message after "say", "speak", or "announce"
  const triggers = ['say', 'speak', 'announce']
  
  for (const trigger of triggers) {
    const index = text.indexOf(trigger)
    if (index !== -1) {
      const message = text.substring(index + trigger.length).trim()
      return message || 'NEXIA voice system operational'
    }
  }
  
  return 'NEXIA voice system operational'
}

function generateStatusVoiceResponse(status: any, target: string): string {
  if (!status || !status.success) {
    return `Unable to retrieve ${target} status information`
  }
  
  // Generate a concise voice summary
  const services = status.data?.services || []
  const healthyServices = services.filter((s: any) => s.status === 'healthy').length
  const totalServices = services.length
  
  if (totalServices === 0) {
    return `${target} status: No services data available`
  }
  
  if (healthyServices === totalServices) {
    return `${target} status: All ${totalServices} services are healthy and operational`
  } else {
    const unhealthyCount = totalServices - healthyServices
    return `${target} status: ${healthyServices} of ${totalServices} services healthy. ${unhealthyCount} services need attention`
  }
}