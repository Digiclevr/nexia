#!/bin/bash

# Script de déploiement Nexia sur le cluster Kubernetes
set -e

echo "🚀 Déploiement de Nexia sur le cluster..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Créer le namespace si nécessaire
echo -e "${BLUE}📦 Création du namespace...${NC}"
kubectl apply -f k8s/nexia-config.yaml

# Déployer les services
echo -e "${BLUE}🚀 Déploiement des services...${NC}"
kubectl apply -f k8s/nexia-deployment.yaml
kubectl apply -f k8s/nexia-frontend.yaml
kubectl apply -f k8s/nexia-ingress.yaml

# Attendre que les pods soient prêts
echo -e "${BLUE}⏳ Attente du démarrage des pods...${NC}"
kubectl wait --for=condition=ready pod -l app=nexia-ai-core -n nextstep --timeout=120s
kubectl wait --for=condition=ready pod -l app=nexia-frontend -n nextstep --timeout=120s

# Afficher le statut
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
kubectl get pods -n nextstep
kubectl get ingress -n nextstep

echo -e "${GREEN}📊 URLs d'accès :${NC}"
echo "Frontend : http://nexia.nextstep.blueocean.local"
echo "API : http://nexia-api.nextstep.blueocean.local"
