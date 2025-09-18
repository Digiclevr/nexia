#!/bin/bash

# Deploy NEXIA OGER Phase 3 to BlueOcean Dev Cluster
# Script de déploiement NEXIA OGER Intelligence sur environnement dev

set -e

echo "🚀 Déploiement NEXIA OGER Phase 3 - Environnement DEV"
echo "=================================================="

# Configuration
REGISTRY="registry.digitalocean.com/nexia"
NAMESPACE="nexia-dev"
SUPERVISOR_IMAGE="$REGISTRY/nexia-supervisor:dev-latest"
DIRECTUS_IMAGE="$REGISTRY/nexia-directus:dev-latest"

# Vérification cluster connection
echo "📡 Vérification connexion cluster..."
kubectl cluster-info --context do-fra1-blueocean

# Vérification namespace
echo "🏗️ Vérification namespace $NAMESPACE..."
kubectl get namespace $NAMESPACE || kubectl create namespace $NAMESPACE

# Build et push des images
echo "🔨 Construction des images Docker..."

# Build NEXIA Supervisor
echo "📦 Build NEXIA Supervisor..."
cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-supervisor
docker build -t $SUPERVISOR_IMAGE .
echo "📤 Push NEXIA Supervisor..."
docker push $SUPERVISOR_IMAGE

# Build NEXIA Directus
echo "📦 Build NEXIA Directus..."
cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-directus
docker build -t $DIRECTUS_IMAGE .
echo "📤 Push NEXIA Directus..."
docker push $DIRECTUS_IMAGE

# Configuration base de données
echo "🗄️ Configuration base de données PostgreSQL..."
kubectl exec -n platform deployment/postgres-central -- psql -U postgres -c "
CREATE DATABASE nexia_directus_dev;
CREATE USER nexia_user WITH PASSWORD 'nexia_password2025!';
GRANT ALL PRIVILEGES ON DATABASE nexia_directus_dev TO nexia_user;
" || echo "Database setup already exists or failed"

# Déploiement Kubernetes
echo "⚙️ Déploiement des manifests Kubernetes..."

# Deploy Directus first (CMS backend)
echo "📂 Déploiement NEXIA Directus..."
kubectl apply -f /Users/ludovicpilet/PROJECTS/NEXIA/k8s/nexia-directus-dev.yaml

# Wait for Directus to be ready
echo "⏳ Attente démarrage Directus..."
kubectl wait --for=condition=available deployment/nexia-directus-deployment -n $NAMESPACE --timeout=300s

# Deploy Supervisor (frontend dashboard)
echo "🖥️ Déploiement NEXIA Supervisor..."
kubectl apply -f /Users/ludovicpilet/PROJECTS/NEXIA/k8s/nexia-supervisor-dev.yaml

# Wait for Supervisor to be ready
echo "⏳ Attente démarrage Supervisor..."
kubectl wait --for=condition=available deployment/nexia-supervisor-deployment -n $NAMESPACE --timeout=300s

# Vérification status
echo "🔍 Vérification status déploiement..."
kubectl get pods -n $NAMESPACE -l app=nexia-supervisor
kubectl get pods -n $NAMESPACE -l app=nexia-directus
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

# URLs finales
echo ""
echo "✅ DÉPLOIEMENT NEXIA OGER PHASE 3 TERMINÉ !"
echo "============================================="
echo "🌐 NEXIA Dashboard: https://nexia-dev.onlyoneapi.com"
echo "📂 Directus CMS: https://nexia-dev.onlyoneapi.com/directus"
echo "🧠 OGER Intelligence: https://nexia-dev.onlyoneapi.com/oger"
echo ""
echo "📊 Monitoring:"
echo "kubectl get pods -n $NAMESPACE"
echo "kubectl logs -f deployment/nexia-supervisor-deployment -n $NAMESPACE"
echo "kubectl logs -f deployment/nexia-directus-deployment -n $NAMESPACE"
echo ""
echo "🎉 OGER Phase 3 déployé avec succès sur cluster BlueOcean DEV !"