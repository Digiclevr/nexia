#!/bin/bash

# Installation script pour Nexia
set -e

echo "🚀 Installation de Nexia..."

# Couleurs pour l'output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Création de la structure de dossiers
echo -e "${BLUE}📁 Création de la structure...${NC}"
mkdir -p services/{ai-core,api,realtime}
mkdir -p apps/web
mkdir -p packages/{shared,config}
mkdir -p scripts
mkdir -p k8s/{base,overlays/development,overlays/production}

# Installation du service AI Core (Python)
echo -e "${BLUE}🐍 Configuration du service AI Core...${NC}"
cd services/ai-core
if [ ! -f "pyproject.toml" ]; then
    poetry init -n --name nexia-ai-core --python "^3.11"
    poetry add fastapi uvicorn python-multipart langchain openai anthropic
    poetry add redis asyncpg sqlalchemy alembic python-dotenv
    poetry add --group dev pytest pytest-asyncio black isort
fi

# Installation de l'API Business (Node.js)
echo -e "${BLUE}🟢 Configuration de l'API Business...${NC}"
cd ../api
if [ ! -f "package.json" ]; then
    pnpm init
    pnpm add @nestjs/core @nestjs/common @nestjs/platform-express
    pnpm add @nestjs/config @nestjs/typeorm typeorm pg
    pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io
    pnpm add class-validator class-transformer
    pnpm add -D @types/node typescript @nestjs/cli
fi

# Installation du serveur WebSocket
echo -e "${BLUE}🔌 Configuration du serveur WebSocket...${NC}"
cd ../realtime
if [ ! -f "package.json" ]; then
    pnpm init
    pnpm add express socket.io redis cors
    pnpm add -D @types/node @types/express @types/cors typescript nodemon
fi

# Installation du frontend React
echo -e "${BLUE}⚛️ Configuration du frontend React...${NC}"
cd ../../apps/web
if [ ! -f "package.json" ]; then
    pnpm create vite . --template react-ts
    pnpm add @tanstack/react-query axios socket.io-client
    pnpm add zustand react-router-dom
    pnpm add tailwindcss @tailwindcss/forms @tailwindcss/typography
    pnpm add @radix-ui/react-dialog @radix-ui/react-select
    pnpm add recharts framer-motion
fi

# Configuration des packages partagés
echo -e "${BLUE}📦 Configuration des packages partagés...${NC}"
cd ../../packages/shared
if [ ! -f "package.json" ]; then
    pnpm init
    pnpm add -D typescript
fi

cd ../config
if [ ! -f "package.json" ]; then
    pnpm init
    pnpm add dotenv
fi

# Retour à la racine
cd ../..

# Création du fichier .env.example
echo -e "${BLUE}🔧 Création du fichier .env.example...${NC}"
cat > .env.example << EOF
# Node-pool platform databases
DATABASE_URL=postgresql://nexia:password@platform-pool:5432/nexia
REDIS_URL=redis://platform-pool:6379/0

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
PERPLEXITY_API_KEY=pplx-...

# Ports (6000-6999)
AI_CORE_PORT=6000
API_PORT=6001
WEBSOCKET_PORT=6002
FRONTEND_PORT=6003

# Environment
NODE_ENV=development
PYTHON_ENV=development

# JWT Secret
JWT_SECRET=your-secret-key-here

# Nexia Configuration
NEXIA_DEFAULT_MODE=focus_guardian
NEXIA_SESSION_TIMEOUT=3600
EOF

# Installation des dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
pnpm install -r

echo -e "${GREEN}✅ Installation terminée !${NC}"
echo -e "${GREEN}👉 Prochaines étapes :${NC}"
echo "1. Copier .env.example vers .env et configurer"
echo "2. Créer les bases de données sur le node-pool platform"
echo "3. Lancer ./start-nexia.sh"
