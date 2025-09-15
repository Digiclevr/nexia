#!/bin/bash

# Test script for Claude Bridge
echo "🤖 Testing NEXIA Claude Bridge..."

# Test basic functionality
echo "📝 Sending test question to Claude.ai..."

response=$(osascript "/users/ludovicpilet/PROJECTS/NEXIA/scripts/claude-bridge.applescript" "Hello, this is a test from NEXIA. Please respond with 'NEXIA bridge working!'")

echo "🔄 Response from Claude:"
echo "------------------------"
echo "$response"
echo "------------------------"

# Check if response contains expected text
if [[ "$response" == *"NEXIA bridge working"* ]]; then
    echo "✅ Bridge test SUCCESSFUL!"
else
    echo "⚠️  Bridge test needs adjustment"
    echo "Debug info:"
    echo "- Make sure Safari is installed"
    echo "- Claude.ai should be accessible"
    echo "- You may need to login manually first"
fi