#!/bin/bash

# Build et déploiement Bulkit.dev avec Kaniko + DigitalOcean Registry

set -e

echo "🚀 Build et Déploiement Bulkit.dev"
echo "📦 Registry: DigitalOcean"
echo "🏗️ Architecture: Monorepo (API + App + Worker)"
echo ""

# 1. Créer la base de données si nécessaire
echo "🗄️ Étape 1: Préparation base de données..."
kubectl exec -n platform statefulset/postgres-central -- psql -U postgres -c "CREATE DATABASE IF NOT EXISTS bulkit;" -c "CREATE USER IF NOT EXISTS bulkit WITH PASSWORD 'bulkit-password-2025';" -c "GRANT ALL PRIVILEGES ON DATABASE bulkit TO bulkit;" || echo "⚠️ Base de données déjà configurée"

# 2. Lancer les builds Kaniko en parallèle
echo ""
echo "🔨 Étape 2: Build images avec Kaniko..."

# Build API
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: bulkit-api-build
  namespace: platform
spec:
  template:
    spec:
      restartPolicy: Never
      nodeSelector:
        doks.digitalocean.com/node-pool: applications-pool
      containers:
      - name: kaniko
        image: gcr.io/kaniko-project/executor:latest
        args:
        - --dockerfile=docker/api.Dockerfile
        - --context=git://github.com/questpie/bulkit.dev.git
        - --destination=registry.digitalocean.com/onlyoneapi/bulkit-api:latest
        - --destination=registry.digitalocean.com/onlyoneapi/bulkit-api:v$(date +%Y%m%d-%H%M%S)
        - --cache=true
        - --cache-repo=registry.digitalocean.com/onlyoneapi/bulkit-cache
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]
          seccompProfile:
            type: RuntimeDefault
        volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker/
          readOnly: true
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 1000m
            memory: 2Gi
      volumes:
      - name: docker-config
        secret:
          secretName: digitalocean-registry-secret
          items:
          - key: .dockerconfigjson
            path: config.json
EOF

# Build App
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: bulkit-app-build
  namespace: platform
spec:
  template:
    spec:
      restartPolicy: Never
      nodeSelector:
        doks.digitalocean.com/node-pool: applications-pool
      containers:
      - name: kaniko
        image: gcr.io/kaniko-project/executor:latest
        args:
        - --dockerfile=docker/app.Dockerfile
        - --context=git://github.com/questpie/bulkit.dev.git
        - --destination=registry.digitalocean.com/onlyoneapi/bulkit-app:latest
        - --destination=registry.digitalocean.com/onlyoneapi/bulkit-app:v$(date +%Y%m%d-%H%M%S)
        - --cache=true
        - --cache-repo=registry.digitalocean.com/onlyoneapi/bulkit-cache
        securityContext:
          runAsNonRoot: true
          runAsUser: 1000
          allowPrivilegeEscalation: false
          capabilities:
            drop: ["ALL"]
          seccompProfile:
            type: RuntimeDefault
        volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker/
          readOnly: true
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 1000m
            memory: 2Gi
      volumes:
      - name: docker-config
        secret:
          secretName: digitalocean-registry-secret
          items:
          - key: .dockerconfigjson
            path: config.json
EOF

echo "⏳ Attente fin des builds..."

# Attendre les builds
kubectl wait --for=condition=complete job/bulkit-api-build -n platform --timeout=900s &
kubectl wait --for=condition=complete job/bulkit-app-build -n platform --timeout=900s &
wait

echo "✅ Builds terminés"

# 3. Déployer avec Kubernetes
echo ""
echo "🚀 Étape 3: Déploiement Kubernetes..."

kubectl apply -f /Users/ludovicpilet/PROJECTS/NEXIA/bulkit-deploy.yaml

# 4. Vérification déploiement
echo ""
echo "🔍 Étape 4: Vérification déploiement..."
kubectl rollout status deployment/bulkit-api -n bulkit --timeout=300s
kubectl rollout status deployment/bulkit-app -n bulkit --timeout=300s
kubectl rollout status deployment/bulkit-soketi -n bulkit --timeout=300s

echo ""
echo "✅ DÉPLOIEMENT BULKIT.DEV TERMINÉ"
echo "🌐 URL: https://bulkit.blueocean.local"
echo "📊 API: https://bulkit.blueocean.local/api"
echo "🔌 WebSockets: bulkit-soketi-service:6001"
echo "🗄️ Base: postgres-central.platform.svc.cluster.local"
echo "📁 Cache: platform-pool-redis-master.platform.svc.cluster.local"
echo ""
echo "📊 Commandes de vérification:"
echo "kubectl get pods -n bulkit"
echo "kubectl get ingress -n bulkit"
echo "kubectl logs -n bulkit deployment/bulkit-api"

# 5. Nettoyage jobs build
echo ""
echo "🧹 Nettoyage jobs build..."
kubectl delete job bulkit-api-build bulkit-app-build -n platform --ignore-not-found=true

echo "🎉 Bulkit.dev prêt à l'utilisation !"