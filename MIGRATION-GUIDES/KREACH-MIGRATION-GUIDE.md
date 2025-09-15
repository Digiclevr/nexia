# 🎯 KREACH - Guide Migration BlueOcean

**Session Claude Code Spécialisée : KREACH Migration**

---

## 🎪 **CONTEXTE MISSION**

### **🎯 Objectif**
Migrer KREACH vers architecture BlueOcean frugale avec staging partagé

### **📊 Position Architecturale**
```
KREACH = App Critique Lancement
Pipeline: dev → staging-shared → prod
Créneau: 15h-18h quotidien
Priorité: CRITIQUE (Intelligence marché + AI)
```

### **🔗 Interdépendances**
- **Staging partagé** avec NEXTSTEP, NEXTGEN, KVIBE
- **Infrastructure commune** : PostgreSQL, Redis, Monitoring
- **Coordination** avec orchestrateur NEXIA

---

## 🏗️ **ARCHITECTURE CIBLE**

### **📦 Namespaces BlueOcean**
```yaml
Source: Actuel KREACH standalone
Target: 
  - blueocean-kreach-dev        # Dev isolé (1 replica)
  - blueocean-staging-shared    # Créneau 15h-18h (partagé)
  - blueocean-kreach-prod       # Production (3-8 replicas + HPA)
```

### **🌐 URLs Finales**
```yaml
Development: http://localhost:5003 (KREACH web) + localhost:8001 (API)
Staging: kreach.staging-shared.local (créneau 15h-18h)
Production: https://kreach
```

### **💾 Données & Storage**
```yaml
PostgreSQL: 
  - kreach_production (production)
  - kreach_dev (développement)
  - blueocean_staging_shared (staging partagé)

Redis:
  - kreach:{env}: (prefixes par environnement)
```

### **🏗️ Infrastructure**
```yaml
Build: Kaniko cluster (pas Docker local)
Registry: registry.digitalocean.com/blueocean
Images: 
  - kreach-web:tag
  - kreach-api:tag
```

---

## 📋 **PLAN MIGRATION PHASE PAR PHASE**

### **Phase 1 : Préparation (30 min)**
```bash
# 1. Analyser structure KREACH actuelle
cd /Users/ludovicpilet/PROJECTS/KREACH
find . -name "*.json" -o -name "*.yaml" -o -name "Dockerfile" | head -20

# 2. Identifier composants principaux
- Applications (web, API)
- Configurations
- Scripts déploiement
- Dépendances

# 3. Vérifier ports conformité
- Port 5003: KREACH web ✅
- Port 8001: KREACH API ✅
```

### **Phase 2 : Structure BlueOcean (45 min)**
```bash
# 1. Créer structure monorepo
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN
mkdir -p apps/kreach-web apps/kreach-api

# 2. Migrer code applications
cp -r /PROJECTS/KREACH/web/* apps/kreach-web/
cp -r /PROJECTS/KREACH/api/* apps/kreach-api/

# 3. Adapter package.json (dev ports conformes)
# kreach-web: port 5003
# kreach-api: port 8001

# 4. Créer Dockerfiles optimisés Kaniko
```

### **Phase 3 : Infrastructure K8s (60 min)**
```bash
# 1. Créer manifestes Kubernetes
infrastructure/kreach/
├── dev/
│   ├── deployment-web.yaml
│   ├── deployment-api.yaml
│   └── service.yaml
├── staging-shared/
│   ├── configmap-kreach.yaml
│   └── ingress-rules.yaml
└── prod/
    ├── deployment-web-prod.yaml
    ├── deployment-api-prod.yaml
    ├── hpa.yaml
    └── service-prod.yaml

# 2. Configuration staging partagé
- Virtual host: kreach.staging-shared.local
- Créneau: 15h-18h
- Resources partagées avec autres apps
```

### **Phase 4 : Scripts Déploiement (45 min)**
```bash
# 1. Créer scripts BlueOcean
scripts/
├── deploy-staging-shared.sh kreach 15h-18h
├── test-staging-shared.sh kreach
└── deploy-kreach-prod.sh

# 2. Intégrer workflow GitHub Actions
.github/workflows/kreach-pipeline.yml
- Trigger: apps/kreach-*/**
- Créneau staging: 15h-18h
- Build: Kaniko cluster
```

### **Phase 5 : Tests & Validation (30 min)**
```bash
# 1. Tests environnement dev
kubectl get pods -n blueocean-kreach-dev
curl http://localhost:5003/health
curl http://localhost:8001/api/health

# 2. Tests staging partagé (créneau 15h-18h)
curl http://kreach.staging-shared.local/health

# 3. Préparation tests production
```

---

## ⚠️ **POINTS COORDINATION CRITIQUES**

### **🕐 Respect Créneau Staging**
```yaml
OBLIGATOIRE: Créneau 15h-18h
Avant: Vérifier NEXTGEN terminé (12h-15h)
Après: Laisser place KVIBE (18h-21h)
Coordination: Avec orchestrateur NEXIA
```

### **🔗 Infrastructure Partagée**
```yaml
PostgreSQL: Utiliser postgres-central.platform.svc.cluster.local
Redis: Utiliser platform-pool-redis-master.platform.svc.cluster.local  
Registry: Utiliser registry.digitalocean.com/blueocean
Monitoring: Grafana + Prometheus centralisés
```

### **🚨 Validation Gates**
```yaml
Dev Ready: ✅ Apps fonctionnelles localhost:5003 + 8001
Staging Ready: ✅ Slot 15h-18h disponible + tests passed
Production Ready: ✅ Confirmation "DEPLOY KREACH PROD"
```

---

## 📊 **RESSOURCES & CONFIGURATION**

### **💰 Resources Frugales**
```yaml
Development:
  requests: 128Mi RAM, 100m CPU (par app)
  limits: 256Mi RAM, 200m CPU
  replicas: 1 (pas HA dev)

Staging Partagé:
  Part du cluster partagé (créneau 15h-18h)
  
Production:
  replicas: 3-8 (HPA CPU 70%)
  requests: 750Mi RAM, 600m CPU
  limits: 1.5Gi RAM, 1200m CPU
```

### **🔧 Configuration Spécifique KREACH**
```yaml
Caractéristiques:
- Intelligence marché + AI predictions
- Storage ML models + data pipeline
- Intégrations APIs externes
- Processing données temps réel

Variables:
- KREACH_API_URL
- ML_MODELS_PATH
- DATA_PIPELINE_CONFIG
- MARKET_DATA_SOURCES
```

---

## ✅ **CRITÈRES SUCCÈS**

### **Phase 1 Réussie**
- [ ] Structure code analysée et comprise
- [ ] Composants principaux identifiés
- [ ] Ports conformité vérifiés

### **Phase 2 Réussie**
- [ ] Code migré vers BlueOcean/apps/kreach-*
- [ ] Package.json adaptés ports corrects
- [ ] Dockerfiles optimisés créés

### **Phase 3 Réussie**
- [ ] Manifestes K8s complets
- [ ] Configuration staging partagé
- [ ] Namespaces BlueOcean configurés

### **Phase 4 Réussie**
- [ ] Scripts déploiement fonctionnels
- [ ] GitHub Actions configurées
- [ ] Créneau 15h-18h respecté

### **Phase 5 Réussie**
- [ ] Dev environment fonctionnel
- [ ] Staging slot validé
- [ ] Production ready

---

## 🚨 **ALERTES & ESCALATION**

### **Blockers Critiques**
```yaml
Si problème créneau staging:
  → Escalade immédiate NEXIA orchestrateur
  
Si conflit infrastructure:
  → Vérifier avec autres sessions migration
  
Si tests staging échouent:
  → Debug en priorité, impact multi-apps
```

### **Communication**
```yaml
Status Updates: Chaque phase terminée
Blockers: Immédiatement
Coordination: Avant utilisation staging partagé
Success: Confirmation production ready
```

---

## 📞 **SUPPORT & RESSOURCES**

### **Documentation Référence**
- Architecture BlueOcean : `/PROJECTS/NEXIA/BLUEOCEAN-CICD-RULES-DRAFT.md`
- Infrastructure partagée : Sections communes
- Créneaux staging : Planning coordinateur NEXIA

### **Commandes Utiles**
```bash
# Status infrastructure
kubectl get pods --all-namespaces | grep kreach
kubectl get pods -n blueocean-staging-shared

# Health checks
curl http://kreach.staging-shared.local/health
curl https://kreach/api/health

# Logs debugging  
kubectl logs -f deployment/kreach-api -n blueocean-kreach-dev
```

---

**🎯 SESSION DÉDIÉE : Focus KREACH migration uniquement**
**⏰ CRÉNEAU STAGING : 15h-18h (coordination obligatoire)**  
**🤝 COORDINATION : Avec orchestrateur NEXIA pour validation**

**GO pour lancement session KREACH !** 🚀