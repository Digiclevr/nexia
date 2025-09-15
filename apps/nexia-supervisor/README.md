# 🧠 NEXIA Supervisor

**Méta-Orchestrateur Global Indépendant** - Supervision complète de l'écosystème BlueOcean

## 🎯 Fonctionnalités

### Dashboard Supervision
- **Vue d'ensemble** : Status global de tous les écosystèmes
- **Métriques temps réel** : Performance, uptime, erreurs
- **Alertes intelligentes** : Détection proactive des problèmes
- **Actions rapides** : Déploiement, restart, scaling

### APIs Supervision
- **Health Check** : `/api/health` - État global du supervisor
- **Status Écosystèmes** : `/api/ecosystems/status` - État détaillé de tous les écosystèmes
- **Contrôle Déploiement** : `/api/control/deploy` - Actions de déploiement et contrôle

## 🚀 Utilisation

### Développement Local
```bash
npm install
npm run dev
```

**URL** : http://localhost:7014

### APIs Endpoints

#### Health Check
```bash
curl http://localhost:7014/api/health
```

#### Status Écosystèmes
```bash
curl http://localhost:7014/api/ecosystems/status
```

#### Déploiement
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"ecosystem":"blueocean","action":"deploy"}' \
  http://localhost:7014/api/control/deploy
```

## 🏗️ Écosystèmes Supervisés

### BlueOcean
- **NEXTSTEP** : Orchestration business
- **NEXTGEN** : Plateforme domaines
- **KREACH** : Intelligence market
- **KVIBE** : Marketing automation

### OnlyOneAPI
- **Marketing** : Site commercial
- **Developer** : Documentation
- **Portal** : Interface utilisateur
- **Community** : Communauté

### Business-Automation
- **Agents 24/7** : Supervision autonome
- **Workflows** : Automatisation processus
- **Dashboard** : Monitoring opérationnel

### Claude Code 24/7
- **Agent Supervisor** : Intelligence artificielle
- **Escalation** : Protocoles d'urgence
- **Monitoring** : Surveillance continue

## 🔧 Configuration

### Variables d'Environnement
```bash
NEXIA_SUPERVISOR_MODE=development
NEXIA_VOICE_ENABLED=true
NEXIA_DIRECTUS_URL=http://localhost:7012
NEXIA_CLAUDE_CODE_24X7=true
```

### Infrastructure
- **Base de données** : postgres-central.platform.svc.cluster.local:5432
- **Cache** : platform-pool-redis-master.platform.svc.cluster.local:6379
- **Monitoring** : Prometheus + Grafana

## 📊 Architecture

```
NEXIA Supervisor (Port 7014)
├── Dashboard Web (React + Next.js)
├── APIs Supervision (REST + WebSocket)
├── Monitoring Écosystèmes (Health Checks)
└── Contrôle Déploiements (Kubernetes)
```

## ✅ Statut Implémentation

### Phase 2 - NEXIA Supervisor ✅
- [x] Structure Next.js fonctionnelle
- [x] Dashboard supervision opérationnel
- [x] API supervision responsive
- [x] Interface utilisateur TDAH-friendly
- [x] Métriques temps réel
- [x] Actions de contrôle

### Prochaines Étapes
- [ ] Connexions réelles aux écosystèmes
- [ ] WebSocket pour updates temps réel
- [ ] Authentification et sécurité
- [ ] Déploiement Kubernetes

---

**Version** : 1.0.0  
**Port** : 7014  
**Statut** : ✅ Fonctionnel (Phase 2 Completed)