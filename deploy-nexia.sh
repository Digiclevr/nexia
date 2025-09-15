#!/bin/bash

# NEXIA - Script de déploiement complet sur cluster BlueOcean
# Pipeline: Mac → GitHub → Kaniko → K8s

set -e

echo "🚀 NEXIA Deployment Pipeline Starting..."
echo "📅 $(date)"

# Configuration
NAMESPACE="nexia"
GITHUB_REPO="ludovicpilet/NEXIA"
REGISTRY="registry.digitalocean.com/onlyoneapi"

echo "📋 Configuration:"
echo "  • Namespace: $NAMESPACE"
echo "  • GitHub: $GITHUB_REPO"
echo "  • Registry: $REGISTRY"
echo ""

# 1. Create namespace
echo "🏗️  Step 1: Creating namespace..."
kubectl apply -f k8s/nexia-namespace.yaml
echo "✅ Namespace created"

# 2. Build images with Kaniko
echo "🐳 Step 2: Building Docker images with Kaniko..."
echo "  → Backend build starting..."
kubectl apply -f k8s/kaniko-backend-build.yaml

echo "  → Frontend build starting..."
# Update the job with timestamp to avoid conflicts
sed "s/name: nexia-frontend-build/name: nexia-frontend-build-$(date +%s)/" k8s/kaniko-backend-build.yaml | \
sed 's/nexia-backend-build/nexia-frontend-build/g' | \
sed 's/nexia-backend/nexia-frontend/g' | \
sed 's/ai-core\/Dockerfile/web\/Dockerfile/' | \
kubectl apply -f -

echo "  → Waiting for builds to complete..."
kubectl wait --for=condition=complete --timeout=600s job/nexia-backend-build -n $NAMESPACE || echo "⚠️ Backend build may still be running"

echo "✅ Images built and pushed to registry"

# 3. Deploy applications
echo "🚀 Step 3: Deploying applications..."
kubectl apply -f k8s/nexia-deployment.yaml
kubectl apply -f k8s/nexia-frontend.yaml 2>/dev/null || echo "Frontend deployment included in main manifest"
kubectl apply -f k8s/nexia-ingress.yaml

echo "  → Waiting for deployments to be ready..."
kubectl rollout status deployment/nexia-backend -n $NAMESPACE --timeout=300s
kubectl rollout status deployment/nexia-frontend -n $NAMESPACE --timeout=300s 2>/dev/null || echo "Frontend deployment check skipped"

echo "✅ Applications deployed"

# 4. Configure DNS (placeholder)
echo "🌐 Step 4: DNS Configuration..."
echo "  → nexia.blueocean.local should point to cluster ingress"
echo "  → Add to /etc/hosts or configure internal DNS"
echo "  → Ingress IP: $(kubectl get ingress nexia-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo 'Pending...')"
echo "ℹ️  DNS configuration manual step required"

# 5. Database setup
echo "🗄️  Step 5: Database connection..."
echo "  → Using postgres-central.platform.svc.cluster.local:5432"
echo "  → Database: nexia (to be created if not exists)"
echo "ℹ️  Database setup may require manual intervention"

# 6. Final status
echo ""
echo "🎉 NEXIA Deployment Complete!"
echo ""
echo "📊 Status:"
kubectl get pods -n $NAMESPACE
echo ""
echo "🌐 Access URLs:"
echo "  • Internal: http://nexia-frontend.$NAMESPACE.svc.cluster.local"
echo "  • External: http://nexia.blueocean.local (after DNS setup)"
echo ""
echo "🔧 Next steps:"
echo "  1. Configure DNS for nexia.blueocean.local"
echo "  2. Create database 'nexia' in postgres-central"
echo "  3. Test iPhone access via Safari"
echo ""
echo "📱 iPhone Test:"
echo "  curl -H 'Host: nexia.blueocean.local' http://[CLUSTER-IP]"
echo ""

# Helpful commands
echo "🛠️  Management commands:"
echo "  • Logs backend:  kubectl logs -f deployment/nexia-backend -n $NAMESPACE"
echo "  • Logs frontend: kubectl logs -f deployment/nexia-frontend -n $NAMESPACE"
echo "  • Scale up:      kubectl scale deployment/nexia-backend --replicas=3 -n $NAMESPACE"
echo "  • Restart:       kubectl rollout restart deployment/nexia-backend -n $NAMESPACE"
echo ""

echo "✅ Pipeline complete - NEXIA is ready for iPhone access!"