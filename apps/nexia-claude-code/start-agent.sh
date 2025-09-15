#!/bin/bash

# NEXIA Claude Code Agent 24/7 Startup Script
# This script starts the Claude Code agent with proper configuration

set -e

echo "🤖 Starting NEXIA Claude Code Agent 24/7..."
echo "📍 Directory: $(pwd)"

# Check if .env exists
if [[ ! -f .env ]]; then
    echo "⚠️  Warning: .env file not found. Creating from template..."
    cp .env.template .env 2>/dev/null || echo "PORT=7013
NODE_ENV=development
AGENT_ID=nexia-claude-001
NEXIA_SUPERVISOR_URL=http://localhost:7014
DATABASE_URL=postgresql://nexia:password@postgres-central.platform.svc.cluster.local:5432/nexia_agent
REDIS_URL=redis://platform-pool-redis-master.platform.svc.cluster.local:6379
LOG_LEVEL=info
MEMORY_THRESHOLD=85
CPU_THRESHOLD=80
AGENT_MODE=alert" > .env
fi

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create logs directory
mkdir -p logs

# Check if NEXIA Supervisor is running
echo "🔍 Checking NEXIA Supervisor connection..."
SUPERVISOR_URL=$(grep NEXIA_SUPERVISOR_URL .env | cut -d '=' -f2)
if curl -s --max-time 5 "$SUPERVISOR_URL/api/health" > /dev/null 2>&1; then
    echo "✅ NEXIA Supervisor is running at $SUPERVISOR_URL"
else
    echo "⚠️  NEXIA Supervisor not reachable at $SUPERVISOR_URL"
    echo "   Make sure the supervisor is running on port 7014"
fi

# Start the agent
echo "🚀 Starting Claude Code Agent on port 7013..."
npm start