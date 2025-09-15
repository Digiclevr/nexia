#!/bin/bash
# Script to securely setup OnlyOneAPI credentials in DigitalOcean Kubernetes
# Usage: ./setup-onlyoneapi-secret.sh [API_KEY]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 NEXIA OnlyOneAPI Secure Setup${NC}"
echo "=================================="

# Check if API key provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: OnlyOneAPI key required${NC}"
    echo -e "${YELLOW}Usage: $0 [YOUR_ONLYONEAPI_KEY]${NC}"
    echo ""
    echo "Example:"
    echo "  $0 sk-your-api-key-here"
    exit 1
fi

API_KEY="$1"

# Validate API key format (basic check)
if [[ ! "$API_KEY" =~ ^sk-.+ ]]; then
    echo -e "${YELLOW}⚠️  Warning: API key doesn't start with 'sk-' - proceeding anyway${NC}"
fi

echo -e "${GREEN}✅ Setting up OnlyOneAPI credentials securely...${NC}"

# Create namespaces if they don't exist
echo "📁 Creating namespaces..."
kubectl create namespace nexia-voice-dev --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace nexia-voice-prod --dry-run=client -o yaml | kubectl apply -f -

# Create secrets in both environments
echo "🔑 Creating secrets..."

# Development environment
kubectl create secret generic onlyoneapi-credentials \
    --from-literal=api-key="$API_KEY" \
    --namespace=nexia-voice-dev \
    --dry-run=client -o yaml | kubectl apply -f -

# Production environment (same key for now, can be different)
kubectl create secret generic onlyoneapi-credentials \
    --from-literal=api-key="$API_KEY" \
    --namespace=nexia-voice-prod \
    --dry-run=client -o yaml | kubectl apply -f -

# Verify secrets were created
echo "🔍 Verifying secrets..."
if kubectl get secret onlyoneapi-credentials -n nexia-voice-dev >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Development secret created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create development secret${NC}"
    exit 1
fi

if kubectl get secret onlyoneapi-credentials -n nexia-voice-prod >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Production secret created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create production secret${NC}"
    exit 1
fi

# Show secret status (without revealing values)
echo ""
echo "📊 Secret Status:"
echo "Development:"
kubectl describe secret onlyoneapi-credentials -n nexia-voice-dev | grep -E "^Name:|^Type:|^Data"
echo ""
echo "Production:"
kubectl describe secret onlyoneapi-credentials -n nexia-voice-prod | grep -E "^Name:|^Type:|^Data"

echo ""
echo -e "${GREEN}🚀 OnlyOneAPI credentials setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Deploy NEXIA Voice Interface: kubectl apply -f infrastructure/dev/voice-deployment.yaml"
echo "2. Test voice interface: https://voice-dev.nexia.onlyoneapi.com"
echo "3. Monitor logs: kubectl logs -f deployment/nexia-voice-dev -n nexia-voice-dev"
echo ""
echo -e "${RED}🔒 Security Note: API key is now stored securely in K8s secrets${NC}"
echo "   • Never commit API keys to Git"
echo "   • Rotate keys regularly"
echo "   • Monitor API usage"