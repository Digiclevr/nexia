#!/bin/bash

# 🎙️ NEXIA Voice Commands Test Script
# Tests all voice command endpoints to ensure Siri integration works

echo "🧠 NEXIA Voice Commands Test"
echo "=================================="

NEXIA_BASE_URL="http://localhost:7014"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
tests_passed=0
tests_total=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    
    echo ""
    echo "🧪 Testing: $name"
    echo "URL: $url"
    
    tests_total=$((tests_total + 1))
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/nexia_response.json "$url")
    else
        response=$(curl -s -w "%{http_code}" -o /tmp/nexia_response.json -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
    fi
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ SUCCESS${NC} - HTTP $http_code"
        echo "Response:"
        cat /tmp/nexia_response.json | jq '.' 2>/dev/null || cat /tmp/nexia_response.json
        tests_passed=$((tests_passed + 1))
    else
        echo -e "${RED}❌ FAILED${NC} - HTTP $http_code"
        echo "Response:"
        cat /tmp/nexia_response.json
    fi
}

# Check if NEXIA Supervisor is running
echo "🔍 Checking NEXIA Supervisor availability..."
if ! curl -s "$NEXIA_BASE_URL/api/health" > /dev/null; then
    echo -e "${RED}❌ NEXIA Supervisor not accessible at $NEXIA_BASE_URL${NC}"
    echo "Please start NEXIA Supervisor first:"
    echo "cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-supervisor"
    echo "npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ NEXIA Supervisor is running${NC}"

# Test 1: Health Check (for "Nexia health check" command)
test_endpoint "Health Check" "GET" "$NEXIA_BASE_URL/api/health"

# Test 2: Ecosystems Status (for "Nexia status global" command)
test_endpoint "Ecosystems Status" "GET" "$NEXIA_BASE_URL/api/ecosystems/status"

# Test 3: Deploy BlueOcean (for "Nexia déploie BlueOcean" command)
test_endpoint "Deploy BlueOcean" "POST" "$NEXIA_BASE_URL/api/control/deploy" '{"ecosystem":"blueocean","action":"deploy"}'

# Test 4: Deploy OnlyOneAPI
test_endpoint "Deploy OnlyOneAPI" "POST" "$NEXIA_BASE_URL/api/control/deploy" '{"ecosystem":"onlyoneapi","action":"deploy"}'

# Test 5: Restart Business-Automation
test_endpoint "Restart Business-Automation" "POST" "$NEXIA_BASE_URL/api/control/deploy" '{"ecosystem":"business-automation","action":"restart"}'

# Test 6: Scale Claude Code 24/7
test_endpoint "Scale Claude Code" "POST" "$NEXIA_BASE_URL/api/control/deploy" '{"ecosystem":"claude-code-24x7","action":"scale","replicas":3}'

# Summary
echo ""
echo "📊 Test Results Summary"
echo "======================"
echo -e "Tests passed: ${GREEN}$tests_passed${NC}/$tests_total"

if [ $tests_passed -eq $tests_total ]; then
    echo -e "${GREEN}🎉 All tests passed! Siri integration ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure Siri Shortcuts using INSTALLATION-SIRI.md"
    echo "2. Test voice commands: 'Hey Siri, Nexia status global'"
    echo "3. Add more custom voice commands as needed"
else
    echo -e "${RED}⚠️  Some tests failed. Check NEXIA Supervisor logs.${NC}"
fi

# Cleanup
rm -f /tmp/nexia_response.json

echo ""
echo "🎙️ Voice Commands Available:"
echo "- 'Hey Siri, Nexia status global'"
echo "- 'Hey Siri, Nexia health check'"
echo "- 'Hey Siri, Nexia déploie BlueOcean'"
echo ""