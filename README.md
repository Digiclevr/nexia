# 🧠 NEXIA - IA Meta-Orchestrateur Écosystème

**Version**: 1.0.0 - Écosystème Complet Indépendant  
**Statut**: ✅ **PHASE 1-6 COMPLÈTES** - Prêt pour déploiement production

---

## 🎯 Mission NEXIA

**NEXIA** = Méta-Orchestrateur Global Indépendant supervisant tous les écosystèmes BlueOcean, OnlyOneAPI, Business-Automation avec intelligence artificielle autonome.

### 🌐 Écosystèmes Supervisés
- **BlueOcean** (NEXTSTEP, NEXTGEN, KREACH, KVIBE)
- **OnlyOneAPI** (marketing, developer, portal, community)
- **Business-Automation** (agents autonomes 24/7)
- **Claude Code 24/7** (supervision technique continue)

---

## 🏗️ Architecture Système

### 📦 Composants Principaux

```yaml
NEXIA Ecosystem:
├── nexia-supervisor/      # 🎛️ Dashboard IA central (Next.js)
├── nexia-voice/          # 🎤 Interface vocale Siri → ChatGPT
├── nexia-directus/       # 📝 CMS opérationnel (Directus)
├── nexia-claude-code/    # 🤖 Agent Claude Code 24/7
└── infrastructure/       # ☸️ Kubernetes + Docker + Scripts
```

### 🌐 URLs Accès

**Development (localhost):**
- `http://localhost:7014` - NEXIA Supervisor Dashboard
- `http://localhost:7012` - NEXIA Directus CMS  
- `http://localhost:7013` - Claude Code Agent API

**Production (cluster BlueOcean):**
- `https://nexia.onlyoneapi.com` - Interface principale
- `https://nexia.onlyoneapi.com/admin` - Admin Directus
- API internes: cluster Kubernetes services

---

## 🚀 Démarrage Rapide

### 💻 Environnement Local

```bash
# Démarrer tous les services NEXIA
cd /Users/ludovicpilet/PROJECTS/NEXIA

# 1. NEXIA Supervisor (port 7014)
cd apps/nexia-supervisor && npm run dev

# 2. Claude Code Agent (port 7013)  
cd apps/nexia-claude-code && ./start-agent.sh

# 3. Directus CMS (port 7012)
cd apps/nexia-directus && npm run dev

# 4. Voice Interface (commandes Siri)
# Voir apps/nexia-voice/README.md pour configuration
```

### ☸️ Déploiement Production Kubernetes

```bash
# Déploiement complet sur cluster BlueOcean
cd infrastructure/scripts
./deploy.sh

# Configuration monitoring
./monitoring-setup.sh

# Vérification status
kubectl get pods -n nexia-prod -w
```

---

## 🤖 Agent Claude Code 24/7

### 🧠 Capacités Intelligentes

**Niveaux d'Autonomie:**
- **Monitor**: Observation pure (logs)
- **Alert**: Notifications humains (actuel)
- **Deploy**: Actions restart automatiques
- **Scale**: Auto-scaling ressources
- **Full**: Autonomie complète décisionnelle

### 📊 Monitoring Temps Réel

```bash
# Health checks
curl http://localhost:7013/health

# Status agent complet  
curl http://localhost:7013/status

# Monitoring écosystèmes
curl http://localhost:7013/ecosystems

# Alertes actives
curl http://localhost:7013/alerts
```

### 🔧 Fonctionnalités Avancées

- **Health Checking**: CPU, mémoire, disque, connectivité
- **Escalation Management**: 4 niveaux de sévérité
- **Decision Making**: Responses basées sur contexte
- **Ecosystem Monitoring**: BlueOcean, OnlyOneAPI, Business-Automation
- **Supervisor Communication**: API bi-directionnelle

---

## 🎤 Interface Vocale Siri

### 📱 Commandes Disponibles

```
"Nexia Status" → État complet écosystème
"Deploy KREACH" → Déploiement application
"Scale OnlyOneAPI" → Scaling automatique
"Check Health" → Vérifications santé
"Show Alerts" → Alertes actives
```

### 🔄 Évolution ChatGPT Voice

**Roadmap:**
1. **Phase 1**: Siri Shortcuts (✅ Complete)
2. **Phase 2**: Interface web conversationnelle  
3. **Phase 3**: Expérience ChatGPT Voice native

---

## 📊 Monitoring & Observabilité

### 🎛️ Dashboards Grafana

- **NEXIA Ecosystem Dashboard**: Métriques temps réel
- **Agent Decision Making**: Historique décisions
- **Ecosystem Health**: Status tous services
- **Alert Escalations**: Patterns alertes

### 🚨 Alertes Automatiques

- **Services Down**: Notification immédiate
- **High CPU/Memory**: Seuils configurables
- **Response Time**: Monitoring performance
- **Decision Failures**: Échecs autonomie

---

## 🏗️ Infrastructure Kubernetes

### 📦 Manifests Complets

```yaml
Kubernetes Resources:
├── namespace.yaml        # Namespaces nexia-prod/dev
├── configmap.yaml       # Configuration environnements
├── secrets.yaml         # Credentials sécurisés
├── nexia-supervisor.yaml    # Déploiement dashboard
├── nexia-claude-code.yaml  # Agent 24/7 + HPA
├── nexia-directus.yaml     # CMS + ingress
└── monitoring.yaml      # ServiceMonitor + alertes
```

### 🐳 Images Docker Optimisées

- **Multi-stage builds**: Taille minimale
- **Security**: Non-root users
- **Health checks**: Kubernetes probes
- **Signal handling**: Graceful shutdown

---

## 🔧 Configuration

### 🌍 Variables Environnement

```bash
# Cluster Database (OBLIGATOIRE)
DATABASE_URL="postgresql://nexia:password@postgres-central.platform.svc.cluster.local:5432/nexia_production"
REDIS_URL="redis://platform-pool-redis-master.platform.svc.cluster.local:6379"

# Agent Configuration
AGENT_MODE="alert"           # monitor|alert|deploy|scale|full
MEMORY_THRESHOLD=85          # % seuil mémoire  
CPU_THRESHOLD=80             # % seuil CPU

# Services URLs
NEXIA_SUPERVISOR_URL="http://nexia-supervisor-service.nexia-prod.svc.cluster.local:8014"
```

### 🔒 Sécurité

- **Secrets Kubernetes**: Credentials isolés
- **Network Policies**: Trafic restreint
- **RBAC**: Permissions minimales
- **TLS**: Communications chiffrées

---

## 🎉 Statut Implémentation

### ✅ Phases Complétées (6/6)

1. **Phase 1**: Structure projet indépendant (60 min) ✅
2. **Phase 2**: NEXIA Supervisor Next.js (90 min) ✅  
3. **Phase 3**: Voice Interface Siri (75 min) ✅
4. **Phase 4**: Migration Directus CMS (120 min) ✅
5. **Phase 5**: Claude Code Agent 24/7 (150 min) ✅
6. **Phase 6**: Infrastructure Kubernetes (180 min) ✅

### 🚀 Prêt Pour Production

**Total Développement**: ~675 minutes (11h15)  
**Status**: **COMPLET** - Écosystème NEXIA opérationnel

---

**🧠 NEXIA - Votre IA Supervisor d'Écosystème, 24/7, Autonome, Intelligent.**

*Créé avec Claude Code - Septembre 2025*