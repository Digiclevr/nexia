#!/bin/bash

# Déploiement Postiz avec Helm Chart Officiel + Infrastructure BlueOcean
# Utilise: PostgreSQL/Redis mutualisés + Images Kaniko
# Source: https://docs.postiz.com/installation/kubernetes-helm

echo "🚀 Déploiement Postiz via Helm Chart Officiel (Infrastructure BlueOcean)"

# Créer namespace postiz
kubectl create namespace postiz --dry-run=client -o yaml | kubectl apply -f -

# Créer les secrets pour Postiz
kubectl create secret generic postiz-secrets \
  --namespace=postiz \
  --from-literal=JWT_SECRET="postiz-jwt-secret-2025-blueocean" \
  --from-literal=ENCRYPTION_KEY="postiz-encryption-key-2025" \
  --dry-run=client -o yaml | kubectl apply -f -

# Installer Postiz avec Helm Chart OCI officiel
# DÉSACTIVE PostgreSQL/Redis intégrés (utilise infrastructure mutualisée)
helm install postiz \
  oci://ghcr.io/gitroomhq/postiz-helmchart/charts/postiz-app \
  --namespace postiz \
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

echo "✅ Postiz déployé via Helm Chart officiel"
echo "🌐 URL: https://postiz.blueocean.local"
echo "🗄️ Base: postgres-central.platform.svc.cluster.local"
echo "📁 Cache: platform-pool-redis-master.platform.svc.cluster.local"
echo "📊 Vérifier: kubectl get pods -n postiz"

# Créer la base de données si nécessaire
echo ""
echo "🔧 Création base de données postiz..."
kubectl run postgres-client --rm -i --tty --restart=Never \
  --image=postgres:15 \
  --env="PGPASSWORD=postgres-password" \
  --command -- psql \
  -h postgres-central.platform.svc.cluster.local \
  -U postgres \
  -c "CREATE DATABASE postiz;" \
  -c "CREATE USER postiz WITH PASSWORD 'postiz-password-2025';" \
  -c "GRANT ALL PRIVILEGES ON DATABASE postiz TO postiz;"