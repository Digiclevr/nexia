# 💎 KVIBESS - Guide Migration BlueOcean

**Session Claude Code Spécialisée : KVIBESS Migration**

---

## 🎪 **CONTEXTE MISSION**

### **🎯 Objectif**
Migrer KVIBESS vers architecture BlueOcean frugale avec staging partagé

### **📊 Position Architecturale**
```
KVIBESS = App Critique Lancement (Marketing Essentiel)
Pipeline: dev → staging-shared → prod
Créneau: 18h-21h quotidien  
Priorité: CRITIQUE (Marketing viral + campagnes lancement)
```

### **🔗 Interdépendances**
- **Staging partagé** avec NEXTSTEP, NEXTGEN, KREACH
- **Infrastructure commune** : PostgreSQL, Redis, Monitoring
- **Coordination** avec orchestrateur NEXIA
- **Préparation SaaS** : Architecture évolutive

---

## 🏗️ **ARCHITECTURE CIBLE**

### **📦 Namespaces BlueOcean**
```yaml
Source: Actuel KVIBES standalone/legacy
Target: 
  - blueocean-kvibe-dev         # Dev isolé (1 replica)
  - blueocean-staging-shared    # Créneau 18h-21h (partagé)
  - blueocean-kvibe-prod        # Production (2-10 replicas + HPA)
```

### **🌐 URLs Finales**
```yaml
Development: 
  - http://localhost:7005 (KVIBES frontend)
  - http://localhost:7006 (KVIBES backend)
Staging: kvibe.staging-shared.local (créneau 18h-21h)
Production: https://kvibe
```

### **💾 Données & Storage**
```yaml
PostgreSQL: 
  - kvibe_production (production)
  - kvibe_dev (développement)
  - blueocean_staging_shared (staging partagé)

Redis:
  - kvibe:{env}: (prefixes par environnement)
  - Support multi-tenant ready pour évolution SaaS
```

### **🏗️ Infrastructure**
```yaml
Build: Kaniko cluster (pas Docker local)
Registry: registry.digitalocean.com/blueocean
Images: 
  - kvibe-frontend:tag
  - kvibe-backend:tag
```

---

## 📋 **PLAN MIGRATION PHASE PAR PHASE**

### **Phase 1 : Analyse KVIBES Legacy (45 min)**
```bash
# 1. Analyser structure KVIBES actuelle
cd /Users/ludovicpilet/PROJECTS/KVIBES
# Ou vérifier KVIBES_LEGACY si structure là
cd /Users/ludovicpilet/onlyoneapi/KVIBES_LEGACY

# 2. Identifier composants
find . -name "*.json" -o -name "*.yaml" -o -name "Dockerfile" | head -20

# 3. Analyser campagnes existantes
- CSV batches campaigns
- Portal deployment system
- Viral content generation
- Monitoring complet

# 4. Évaluer assets réutilisables
- 1500+ messages founding members
- Batch campaigns déployées
- Protection system
- Kinsta deployment configs
```

### **Phase 2 : Structure BlueOcean (60 min)**
```bash
# 1. Créer structure monorepo
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN
mkdir -p apps/kvibe-frontend apps/kvibe-backend

# 2. Migrer code applications
# Identifier best version (KVIBES vs KVIBES_LEGACY)
cp -r /PROJECTS/[KVIBES_SOURCE]/frontend/* apps/kvibe-frontend/
cp -r /PROJECTS/[KVIBES_SOURCE]/backend/* apps/kvibe-backend/

# 3. Adapter package.json (ports conformes)
# kvibe-frontend: port 7005
# kvibe-backend: port 7006

# 4. Préserver assets campagnes
mkdir -p apps/kvibe-backend/campaigns/
# Migrer CSV batches + viral content
```

### **Phase 3 : Architecture SaaS Ready (75 min)**
```bash
# 1. Design évolutif SaaS
- Multi-tenant data schema design
- Feature flags architecture
- Scaling preparedness (2-50+ replicas)

# 2. Créer manifestes Kubernetes
infrastructure/kvibe/
├── dev/
│   ├── deployment-frontend.yaml
│   ├── deployment-backend.yaml  
│   └── service.yaml
├── staging-shared/
│   ├── configmap-kvibe.yaml
│   └── ingress-rules.yaml
└── prod/
    ├── deployment-frontend-prod.yaml
    ├── deployment-backend-prod.yaml
    ├── hpa-aggressive.yaml (SaaS ready)
    └── service-prod.yaml

# 3. Configuration staging partagé
- Virtual host: kvibe.staging-shared.local
- Créneau: 18h-21h (après KREACH)
- Resources partagées optimisées
```

### **Phase 4 : Scripts & Automation (45 min)**
```bash
# 1. Créer scripts BlueOcean
scripts/
├── deploy-staging-shared.sh kvibe 18h-21h
├── test-staging-shared.sh kvibe
└── deploy-kvibe-prod.sh

# 2. Intégrer workflow GitHub Actions
.github/workflows/kvibe-pipeline.yml
- Trigger: apps/kvibe-*/**
- Créneau staging: 18h-21h
- Build: Kaniko cluster
- Variable: KVIBES_SAAS_MODE (future)

# 3. Préserver automation legacy
- Scripts viral content
- Campaign deployment
- Monitoring dashboards
```

### **Phase 5 : Migration Campagnes (60 min)**
```bash
# 1. Migrer assets campagnes
- CSV batches existants
- Templates viral content
- Founding members data (sécurisé)

# 2. Adapter monitoring
- Performance viral campaigns
- User engagement metrics
- Conversion tracking

# 3. Tests campagnes staging
- Dry-run campagnes test
- Performance benchmarks
- Scaling validation
```

### **Phase 6 : Tests & Validation (30 min)**
```bash
# 1. Tests environnement dev
kubectl get pods -n blueocean-kvibe-dev
curl http://localhost:7005/health
curl http://localhost:7006/api/health

# 2. Tests staging partagé (créneau 18h-21h)
curl http://kvibe.staging-shared.local/health

# 3. Tests campagnes
- Launch campaign simulation
- Performance validation
- Scaling tests
```

---

## ⚠️ **POINTS COORDINATION CRITIQUES**

### **🕐 Respect Créneau Staging**
```yaml
OBLIGATOIRE: Créneau 18h-21h (DERNIER slot quotidien)
Avant: Attendre fin KREACH (15h-18h)  
Après: Nuit libre pour longues campagnes
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
Dev Ready: ✅ Apps fonctionnelles localhost:7005 + 7006
Staging Ready: ✅ Slot 18h-21h + campagnes tests OK
Production Ready: ✅ Confirmation manuelle (critique lancement)
SaaS Ready: ✅ Multi-tenant architecture préparée
```

---

## 📊 **RESSOURCES & CONFIGURATION**

### **💰 Resources Évolutives**
```yaml
Development:
  requests: 128Mi RAM, 100m CPU (par app)
  limits: 256Mi RAM, 200m CPU
  replicas: 1 (pas HA dev)

Staging Partagé:
  Part du cluster partagé (créneau 18h-21h)
  Tests scaling campaigns
  
Production (SaaS Ready):
  replicas: 2-10 (HPA CPU 75%)
  requests: 512Mi RAM, 400m CPU
  limits: 1Gi RAM, 800m CPU
  scaling: Peut monter 50+ replicas si SaaS
```

### **🔧 Configuration Spécifique KVIBES**
```yaml
Caractéristiques:
- Marketing viral campaigns  
- Content automation
- Social media integration
- Analytics & tracking
- Founding members management

Variables:
- KVIBES_CAMPAIGN_MODE
- VIRAL_CONTENT_PATH  
- SOCIAL_API_KEYS
- ANALYTICS_CONFIG
- FOUNDING_MEMBERS_DB

Future SaaS:
- KVIBES_SAAS_MODE=true
- MULTI_TENANT_CONFIG
- BILLING_INTEGRATION
```

---

## 🎯 **SPÉCIFICITÉS KVIBES**

### **📈 Campaign Management**
```yaml
Legacy Assets à Préserver:
- 50+ batch campaigns CSV
- Viral transformation system
- 1500+ messages founding members
- Protection system Kinsta
- Monitoring dashboards complets

Migration Priority:
- Campagnes actives d'abord
- Assets founding members (sécurisé)
- Templates viral content
- Analytics historiques
```

### **🚀 Évolution SaaS**
```yaml
Préparation Architecture:
- Multi-tenant data schema
- Feature flags system
- Billing hooks preparation
- Performance scaling (50+ replicas)
- API rate limiting ready

Variables Évolution:
export KVIBES_SAAS_MODE="false"  # Dev/staging
export KVIBES_SAAS_MODE="true"   # Si commercialisation
```

---

## ✅ **CRITÈRES SUCCÈS**

### **Phase 1 Réussie**
- [ ] KVIBES legacy analysé et compris
- [ ] Assets campagnes inventoriés
- [ ] Best version identifiée

### **Phase 2 Réussie**
- [ ] Code migré vers BlueOcean/apps/kvibe-*
- [ ] Ports 7005/7006 configurés
- [ ] Assets campagnes préservés

### **Phase 3 Réussie**
- [ ] Architecture SaaS ready
- [ ] Manifestes K8s complets
- [ ] Scaling preparedness validée

### **Phase 4 Réussie**
- [ ] Scripts déploiement fonctionnels
- [ ] GitHub Actions configurées
- [ ] Créneau 18h-21h respecté

### **Phase 5 Réussie**
- [ ] Campagnes migrées et testées
- [ ] Performance benchmarks OK
- [ ] Monitoring fonctionnel

### **Phase 6 Réussie**
- [ ] Dev environment complet
- [ ] Staging slot validé
- [ ] Production ready + campagnes

---

## 🚨 **ALERTES & ESCALATION**

### **Blockers Critiques**
```yaml
Si problème créneau staging 18h-21h:
  → Escalade immédiate NEXIA orchestrateur
  
Si perte assets campagnes:
  → ARRÊT migration, récupération priorité
  
Si tests campagnes échouent:
  → Debug critique, impact lancement
```

### **Assets Sensibles**
```yaml
CRITIQUE - Ne pas perdre:
- Founding members data (1500+ messages)
- Batch campaigns actifs
- Templates viral content
- Analytics historiques
- Protection system configs

Backup avant migration:
- Export complet KVIBES_LEGACY
- Sauvegarde BDD campagnes
- Archives assets critiques
```

---

## 📞 **SUPPORT & RESSOURCES**

### **Documentation Référence**
- Architecture BlueOcean : `/PROJECTS/NEXIA/BLUEOCEAN-CICD-RULES-DRAFT.md`
- KVIBES Legacy : `/onlyoneapi/KVIBES_LEGACY/`
- Campagnes : Batch CSV + viral content system

### **Commandes Utiles**
```bash
# Status infrastructure
kubectl get pods --all-namespaces | grep kvibe
kubectl get pods -n blueocean-staging-shared

# Health checks
curl http://kvibe.staging-shared.local/health
curl https://kvibe/api/health

# Campagnes monitoring
curl http://localhost:7006/api/campaigns/status
curl https://kvibe/api/analytics/performance
```

---

**🎯 SESSION DÉDIÉE : Focus KVIBES migration + préservation campagnes**
**⏰ CRÉNEAU STAGING : 18h-21h (dernier slot quotidien)**  
**🤝 COORDINATION : Avec orchestrateur NEXIA pour validation**
**💎 SPÉCIAL : Préservation assets campagnes critiques**

**GO pour lancement session KVIBES !** 🚀