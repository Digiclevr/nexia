# Nexia - Assistant IA pour Entrepreneurs TDAH

## 🚀 Vue d'ensemble

Nexia est un assistant IA personnalisé conçu pour maximiser la productivité des entrepreneurs TDAH en offrant trois modes de personnalité distincts : Focus Guardian, Opportunity Hunter et Socratic Challenger.

## 📋 Prérequis

- Python 3.11+
- Node.js 20+
- pnpm
- Accès aux bases de données sur le node-pool platform
- Ports 6000-6999 disponibles

## 🏗️ Architecture

### Services
- **API Core (Python/FastAPI)** : Port 6000 - Moteur IA principal
- **API Business (Node.js/NestJS)** : Port 6001 - Logique métier
- **WebSocket Server** : Port 6002 - Communication temps réel
- **Frontend (React)** : Port 6003 - Interface utilisateur

### Bases de données (node-pool platform)
- PostgreSQL : `postgresql://nexia:password@platform-pool:5432/nexia`
- Redis : `redis://platform-pool:6379/0`

## 🚀 Installation

```bash
# 1. Installer les dépendances globales
npm install -g pnpm
pip install poetry

# 2. Installer le projet
./install.sh

# 3. Configuration
cp .env.example .env
# Éditer .env avec vos configurations

# 4. Lancer Nexia
./start-nexia.sh
```

## 📁 Structure du projet

```
nexia/
├── services/
│   ├── ai-core/        # Service IA Python/FastAPI
│   ├── api/            # API Business NestJS
│   └── realtime/       # WebSocket server
├── apps/
│   └── web/            # Frontend React
├── packages/
│   ├── shared/         # Types partagés
│   └── config/         # Configuration commune
├── scripts/            # Scripts utilitaires
└── k8s/               # Manifests Kubernetes
```

## 🔧 Développement

```bash
# Service IA
cd services/ai-core
poetry run uvicorn app.main:app --reload --port 6000

# API Business
cd services/api
pnpm dev

# Frontend
cd apps/web
pnpm dev
```

## 📊 Ports utilisés

- 6000 : API Core (FastAPI)
- 6001 : API Business (NestJS)
- 6002 : WebSocket Server
- 6003 : Frontend React
- 6004 : Redis Commander (dev)
- 6005 : pgAdmin (dev)

## 🌐 URLs de production

- API : `nexia-api.nextstep.blueocean.local`
- WebSocket : `nexia-ws.nextstep.blueocean.local`
- Frontend : `nexia.nextstep.blueocean.local`

## 📝 License

Propriétaire - BlueOcean/Nextstep
