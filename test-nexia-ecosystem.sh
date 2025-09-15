#!/bin/bash

# 🧠 NEXIA Ecosystem Complete Test Script
# Tests all components of the NEXIA ecosystem

echo "🧠 NEXIA Ecosystem Test Suite"
echo "=============================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
tests_passed=0
tests_total=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    
    echo ""
    echo "🧪 Testing: $name"
    echo "URL: $url"
    
    tests_total=$((tests_total + 1))
    
    response=$(curl -s -w "%{http_code}" -o /tmp/nexia_test_response.json "$url" --max-time 10)
    http_code="${response: -3}"
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ SUCCESS${NC} - HTTP $http_code"
        tests_passed=$((tests_passed + 1))
        
        # Show response preview for successful tests
        if [ -f /tmp/nexia_test_response.json ]; then
            response_size=$(wc -c < /tmp/nexia_test_response.json)
            if [ $response_size -gt 0 ] && [ $response_size -lt 500 ]; then
                echo "Response preview:"
                cat /tmp/nexia_test_response.json | head -c 200
                echo ""
            fi
        fi
    else
        echo -e "${RED}❌ FAILED${NC} - HTTP $http_code (expected $expected_status)"
    fi
}

echo ""
echo -e "${BLUE}🔍 Phase 1: Infrastructure Check${NC}"
echo "================================="

# Test if services are running
echo "Checking running services..."
if lsof -i :7014 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ NEXIA Supervisor running on port 7014${NC}"
else
    echo -e "${RED}❌ NEXIA Supervisor not running on port 7014${NC}"
fi

if lsof -i :7012 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ NEXIA Directus running on port 7012${NC}"
else
    echo -e "${RED}❌ NEXIA Directus not running on port 7012${NC}"
fi

echo ""
echo -e "${BLUE}🎛️ Phase 2: NEXIA Supervisor Tests${NC}"
echo "==================================="

# Test NEXIA Supervisor endpoints
test_endpoint "Supervisor Health Check" "http://localhost:7014/api/health" "200"
test_endpoint "Ecosystems Status" "http://localhost:7014/api/ecosystems/status" "200"

# Test deployment endpoint with POST
echo ""
echo "🧪 Testing: Supervisor Deploy Endpoint"
echo "URL: http://localhost:7014/api/control/deploy"
tests_total=$((tests_total + 1))

deploy_response=$(curl -s -w "%{http_code}" -o /tmp/nexia_deploy_response.json \
    -X POST -H "Content-Type: application/json" \
    -d '{"ecosystem":"test","action":"deploy"}' \
    "http://localhost:7014/api/control/deploy" --max-time 10)

deploy_code="${deploy_response: -3}"
if [ "$deploy_code" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC} - HTTP $deploy_code"
    tests_passed=$((tests_passed + 1))
    echo "Deploy response:"
    cat /tmp/nexia_deploy_response.json | head -c 200
    echo ""
else
    echo -e "${RED}❌ FAILED${NC} - HTTP $deploy_code"
fi

echo ""
echo -e "${BLUE}📊 Phase 3: NEXIA Directus Tests${NC}"
echo "================================="

# Test NEXIA Directus endpoints
test_endpoint "Directus Main Page" "http://localhost:7012" "302"
test_endpoint "Directus Admin Redirect" "http://localhost:7012/admin" "200"

# Test Directus API authentication
echo ""
echo "🧪 Testing: Directus Authentication"
echo "URL: http://localhost:7012/auth/login"
tests_total=$((tests_total + 1))

auth_response=$(curl -s -w "%{http_code}" -o /tmp/nexia_auth_response.json \
    -X POST -H "Content-Type: application/json" \
    -d '{"email":"admin@nexia.com","password":"NexiaAdmin2025!"}' \
    "http://localhost:7012/auth/login" --max-time 10)

auth_code="${auth_response: -3}"
if [ "$auth_code" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC} - HTTP $auth_code"
    tests_passed=$((tests_passed + 1))
    echo "Authentication successful"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP $auth_code"
fi

echo ""
echo -e "${BLUE}🎙️ Phase 4: Voice Commands Integration${NC}"
echo "========================================"

# Test if voice commands endpoints are accessible
voice_endpoints=(
    "http://localhost:7014/api/health"
    "http://localhost:7014/api/ecosystems/status"
)

for endpoint in "${voice_endpoints[@]}"; do
    echo "🎤 Voice-compatible endpoint: $endpoint"
    if curl -s "$endpoint" > /dev/null; then
        echo -e "${GREEN}✅ Ready for Siri integration${NC}"
    else
        echo -e "${RED}❌ Not accessible for voice commands${NC}"
    fi
done

echo ""
echo -e "${BLUE}📁 Phase 5: File Structure Validation${NC}"
echo "====================================="

# Check critical files exist
critical_files=(
    "/Users/ludovicpilet/PROJECTS/NEXIA/CLAUDE.md"
    "/Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-supervisor/README.md"
    "/Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-voice/README.md"
    "/Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-directus/README.md"
    "/Users/ludovicpilet/PROJECTS/NEXIA/NEXIA-STATUS.md"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found: $(basename "$file")${NC}"
    else
        echo -e "${RED}❌ Missing: $(basename "$file")${NC}"
    fi
done

# Check directory structure
echo ""
echo "📂 Directory Structure:"
if [ -d "/Users/ludovicpilet/PROJECTS/NEXIA/apps" ]; then
    echo -e "${GREEN}✅ /apps${NC}"
    ls -la /Users/ludovicpilet/PROJECTS/NEXIA/apps/ | grep "^d" | awk '{print "   " $9}' | grep -v "^\.$\|^\.\.$"
fi

if [ -d "/Users/ludovicpilet/PROJECTS/NEXIA/infrastructure" ]; then
    echo -e "${GREEN}✅ /infrastructure${NC}"
fi

if [ -d "/Users/ludovicpilet/PROJECTS/NEXIA/integrations" ]; then
    echo -e "${GREEN}✅ /integrations${NC}"
fi

echo ""
echo -e "${BLUE}📊 Final Results${NC}"
echo "================="
echo -e "Tests passed: ${GREEN}$tests_passed${NC}/$tests_total"

success_rate=$((tests_passed * 100 / tests_total))
echo -e "Success rate: ${GREEN}$success_rate%${NC}"

if [ $tests_passed -eq $tests_total ]; then
    echo ""
    echo -e "${GREEN}🎉 NEXIA Ecosystem is FULLY OPERATIONAL!${NC}"
    echo ""
    echo "🌐 Access URLs:"
    echo "   • NEXIA Supervisor: http://localhost:7014"
    echo "   • NEXIA Directus Admin: http://localhost:7012/admin"
    echo ""
    echo "🎙️ Voice Commands Ready:"
    echo "   • 'Hey Siri, Nexia status global'"
    echo "   • 'Hey Siri, Nexia health check'"
    echo "   • 'Hey Siri, Nexia déploie BlueOcean'"
    echo ""
    echo "📋 Next Steps:"
    echo "   • Configure Siri Shortcuts (see apps/nexia-voice/INSTALLATION-SIRI.md)"
    echo "   • Set up Directus collections for ecosystem management"
    echo "   • Deploy to Kubernetes cluster (Phase 6)"
    
elif [ $success_rate -ge 80 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  NEXIA Ecosystem is MOSTLY OPERATIONAL${NC}"
    echo "Some components may need attention."
    
else
    echo ""
    echo -e "${RED}❌ NEXIA Ecosystem has SIGNIFICANT ISSUES${NC}"
    echo "Please check failed tests and fix issues."
fi

# Cleanup
rm -f /tmp/nexia_*_response.json

echo ""
echo "🧠 NEXIA Test Suite Complete"
echo "📄 For detailed documentation, see: NEXIA-STATUS.md"