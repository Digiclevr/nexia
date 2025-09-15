#!/bin/bash

# Script de démarrage pour Nexia
set -e

echo "🚀 Démarrage de Nexia..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Fichier .env non trouvé !${NC}"
    echo "Copier .env.example vers .env et configurer les variables"
    exit 1
fi

# Charger les variables d'environnement
export $(cat .env | grep -v '^#' | xargs)

# Fonction pour vérifier si un port est utilisé
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}❌ Port $1 déjà utilisé !${NC}"
        return 1
    fi
    return 0
}

# Vérifier les ports
echo -e "${BLUE}🔍 Vérification des ports...${NC}"
check_port 6000 || exit 1
check_port 6001 || exit 1
check_port 6002 || exit 1
check_port 6003 || exit 1

# Démarrer le service AI Core
echo -e "${BLUE}🐍 Démarrage du service AI Core (port 6000)...${NC}"
cd services/ai-core
poetry run uvicorn app.main:app --reload --port 6000 &
AI_PID=$!
cd ../..

# Attendre que le service AI soit prêt
echo -e "${BLUE}⏳ Attente du service AI...${NC}"
sleep 5

# Démarrer le frontend
echo -e "${BLUE}⚛️ Démarrage du frontend (port 6003)...${NC}"
cd apps/web
pnpm dev &
FRONTEND_PID=$!
cd ../..

echo -e "${GREEN}✅ Nexia est démarré !${NC}"
echo -e "${GREEN}📊 Dashboard : http://localhost:6003${NC}"
echo -e "${GREEN}🔧 API : http://localhost:6000/docs${NC}"

# Fonction de nettoyage
cleanup() {
    echo -e "${BLUE}🛑 Arrêt de Nexia...${NC}"
    kill $AI_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Capturer les signaux pour un arrêt propre
trap cleanup SIGINT SIGTERM

# Attendre
wait
