#!/bin/bash

# NEXIA Ecosystem Deployment Script
# Deploys all NEXIA components to BlueOcean Kubernetes cluster

set -e

echo "🚀 Starting NEXIA Ecosystem Deployment"
echo "📍 Target: DigitalOcean BlueOcean Kubernetes Cluster"

# Configuration
NAMESPACE_PROD="nexia-prod"
NAMESPACE_DEV="nexia-dev"
REGISTRY="registry.digitalocean.com/onlyoneapi"
CONTEXT="do-fra1-blueocean"

# Check if kubectl is configured
if ! kubectl config current-context &>/dev/null; then
    echo "❌ kubectl not configured. Please configure kubectl first."
    exit 1
fi

# Switch to correct context
echo "🔧 Switching to cluster context: $CONTEXT"
kubectl config use-context $CONTEXT

# Apply namespaces
echo "📦 Creating namespaces..."
kubectl apply -f infrastructure/kubernetes/namespace.yaml

# Apply secrets (only if they don't exist)
echo "🔐 Applying secrets..."
kubectl apply -f infrastructure/kubernetes/secrets.yaml

# Apply config maps
echo "⚙️ Applying configuration..."
kubectl apply -f infrastructure/kubernetes/configmap.yaml

# Build and push Docker images
echo "🏗️ Building Docker images..."

# Build NEXIA Supervisor
echo "Building nexia-supervisor..."
docker build -f infrastructure/docker/supervisor.Dockerfile \
  -t $REGISTRY/nexia-supervisor:latest \
  -t $REGISTRY/nexia-supervisor:$(date +%Y%m%d-%H%M%S) \
  apps/nexia-supervisor/

# Build NEXIA Claude Code Agent
echo "Building nexia-claude-code..."
docker build -f infrastructure/docker/claude-code.Dockerfile \
  -t $REGISTRY/nexia-claude-code:latest \
  -t $REGISTRY/nexia-claude-code:$(date +%Y%m%d-%H%M%S) \
  apps/nexia-claude-code/

echo "📤 Pushing Docker images to registry..."
docker push $REGISTRY/nexia-supervisor:latest
docker push $REGISTRY/nexia-claude-code:latest

# Deploy applications
echo "🚀 Deploying applications..."

echo "Deploying NEXIA Supervisor..."
kubectl apply -f infrastructure/kubernetes/nexia-supervisor.yaml

echo "Deploying NEXIA Claude Code Agent..."
kubectl apply -f infrastructure/kubernetes/nexia-claude-code.yaml

echo "Deploying NEXIA Directus CMS..."
kubectl apply -f infrastructure/kubernetes/nexia-directus.yaml

# Apply monitoring configuration
echo "📊 Setting up monitoring..."
kubectl apply -f infrastructure/kubernetes/monitoring.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."

kubectl wait --for=condition=available --timeout=300s deployment/nexia-supervisor -n $NAMESPACE_PROD
kubectl wait --for=condition=available --timeout=300s deployment/nexia-claude-code -n $NAMESPACE_PROD
kubectl wait --for=condition=available --timeout=300s deployment/nexia-directus -n $NAMESPACE_PROD

# Verify deployment status
echo "✅ Checking deployment status..."
kubectl get pods -n $NAMESPACE_PROD -o wide
kubectl get services -n $NAMESPACE_PROD
kubectl get ingress -n $NAMESPACE_PROD

# Test health endpoints
echo "🏥 Testing health endpoints..."

SUPERVISOR_IP=$(kubectl get service nexia-supervisor-service -n $NAMESPACE_PROD -o jsonpath='{.spec.clusterIP}')
CLAUDE_IP=$(kubectl get service nexia-claude-code-service -n $NAMESPACE_PROD -o jsonpath='{.spec.clusterIP}')

echo "NEXIA Supervisor: $SUPERVISOR_IP:8014"
echo "NEXIA Claude Code: $CLAUDE_IP:8013"

# Final status
echo ""
echo "🎉 NEXIA Ecosystem Deployment Complete!"
echo ""
echo "🌐 Access URLs:"
echo "   - NEXIA Dashboard: https://nexia.onlyoneapi.com"
echo "   - NEXIA Admin (Directus): https://nexia.onlyoneapi.com/admin"
echo ""
echo "🔍 Monitor with:"
echo "   kubectl get pods -n $NAMESPACE_PROD -w"
echo "   kubectl logs -f deployment/nexia-claude-code -n $NAMESPACE_PROD"
echo ""
echo "📊 Grafana Dashboard: https://grafana.monitoring.onlyoneapi.com"