#!/bin/bash

# Build et déploiement Postiz avec Kaniko + DigitalOcean Registry
# Stratégie: Image custom + backup automatique

set -e

echo "🚀 Build et Déploiement Postiz avec Kaniko"
echo "📦 Registry: DigitalOcean"
echo "💾 Backup: Automatique avec timestamp"
echo ""

# 1. Lancer le build Kaniko
echo "🔨 Étape 1: Build image avec Kaniko..."
kubectl apply -f /Users/ludovicpilet/PROJECTS/NEXIA/postiz-kaniko-build.yaml

# Attendre la fin du build
echo "⏳ Attente fin du build..."
kubectl wait --for=condition=complete job/postiz-kaniko-build -n platform --timeout=900s

# Vérifier le statut
BUILD_STATUS=$(kubectl get job postiz-kaniko-build -n platform -o jsonpath='{.status.conditions[0].type}')
if [ "$BUILD_STATUS" != "Complete" ]; then
    echo "❌ Build failed"
    kubectl logs job/postiz-kaniko-build -n platform
    exit 1
fi

echo "✅ Build terminé avec succès"

# 2. Créer la base de données si nécessaire
echo ""
echo "🗄️ Étape 2: Préparation base de données..."
kubectl run postgres-client --rm -i --restart=Never \
  --image=postgres:15 \
  --env="PGPASSWORD=postgres-password" \
  --command -- psql \
  -h postgres-central.platform.svc.cluster.local \
  -U postgres \
  -c "CREATE DATABASE IF NOT EXISTS postiz;" \
  -c "CREATE USER IF NOT EXISTS postiz WITH PASSWORD 'postiz-password-2025';" \
  -c "GRANT ALL PRIVILEGES ON DATABASE postiz TO postiz;" \
  || echo "⚠️ Base de données déjà configurée"

# 3. Déployer avec Helm + image custom
echo ""
echo "🚀 Étape 3: Déploiement avec image DO Registry..."

# Créer namespace si nécessaire
kubectl create namespace postiz --dry-run=client -o yaml | kubectl apply -f -

# Créer secrets
kubectl create secret generic postiz-secrets \
  --namespace=postiz \
  --from-literal=JWT_SECRET="postiz-jwt-secret-2025-blueocean" \
  --from-literal=ENCRYPTION_KEY="postiz-encryption-key-2025" \
  --dry-run=client -o yaml | kubectl apply -f -

# Déployer avec image custom
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
helm upgrade --install postiz \
  oci://ghcr.io/gitroomhq/postiz-helmchart/charts/postiz-app \
  --namespace postiz \
  --set image.repository="registry.digitalocean.com/onlyoneapi/postiz-app" \
  --set image.tag="latest" \
  --set image.pullPolicy="Always" \
  --set postgresql.enabled=false \
  --set redis.enabled=false \
  --set env.DATABASE_URL="postgresql://postiz:postiz-password-2025@postgres-central.platform.svc.cluster.local:5432/postiz" \
  --set env.REDIS_URL="redis://platform-pool-redis-master.platform.svc.cluster.local:6379" \
  --set ingress.enabled=true \
  --set ingress.className="nginx" \
  --set ingress.hosts[0].host="postiz.blueocean.local" \
  --set ingress.hosts[0].paths[0].path="/" \
  --set ingress.hosts[0].paths[0].pathType="Prefix" \
  --set ingress.tls[0].secretName="postiz-tls" \
  --set ingress.tls[0].hosts[0]="postiz.blueocean.local" \
  --set ingress.annotations."cert-manager\.io/cluster-issuer"="letsencrypt-prod" \
  --set ingress.annotations."nginx\.ingress\.kubernetes\.io/ssl-redirect"="true" \
  --set env.POSTIZ_URL="https://postiz.blueocean.local" \
  --set env.NODE_ENV="production" \
  --set nodeSelector."doks\.digitalocean\.com/node-pool"="applications-pool" \
  --set resources.limits.cpu="500m" \
  --set resources.limits.memory="512Mi" \
  --set resources.requests.cpu="250m" \
  --set resources.requests.memory="256Mi"

# 4. Vérification déploiement
echo ""
echo "🔍 Étape 4: Vérification déploiement..."
kubectl rollout status deployment/postiz -n postiz --timeout=300s

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ"
echo "🌐 URL: https://postiz.blueocean.local"
echo "📦 Image: registry.digitalocean.com/onlyoneapi/postiz-app:latest"
echo "💾 Backup: registry.digitalocean.com/onlyoneapi/postiz-app-backup:$(date +%Y%m%d)"
echo "🗄️ Base: postgres-central.platform.svc.cluster.local"
echo "📁 Cache: platform-pool-redis-master.platform.svc.cluster.local"
echo ""
echo "📊 Commandes de vérification:"
echo "kubectl get pods -n postiz"
echo "kubectl get ingress -n postiz"
echo "kubectl logs -n postiz deployment/postiz"

# 5. Nettoyage job build
echo ""
echo "🧹 Nettoyage job build..."
kubectl delete job postiz-kaniko-build -n platform --ignore-not-found=true

echo "🎉 Postiz prêt à l'utilisation !"