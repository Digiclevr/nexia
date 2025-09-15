# 🤖 NEXTSTEP - Guide Migration BlueOcean

**Session Claude Code Spécialisée : NEXTSTEP Migration**

---

## 🎪 **CONTEXTE MISSION**

### **🎯 Objectif**
Migrer NEXTSTEP vers architecture BlueOcean en préservant pipeline premium fonctionnel

### **📊 Position Architecturale**
```
NEXTSTEP = App Critique Orchestration (GOLD STANDARD)
Pipeline: dev → staging-shared → prod (RÉFÉRENCE pour autres apps)
Créneau: 09h-12h quotidien (PREMIER slot - priorité)
Priorité: CRITIQUE (Orchestration Claude core)
```

### **🔗 Interdépendances**
- **Staging partagé** PREMIER utilisateur (09h-12h)
- **Infrastructure commune** : PostgreSQL, Redis, Monitoring
- **Coordination** avec orchestrateur NEXIA
- **GOLD STANDARD** : Modèle pour autres migrations

---

## 🏗️ **ARCHITECTURE CIBLE**

### **📦 Namespaces BlueOcean**
```yaml
Source: NEXTSTEP standalone fonctionnel
Target: 
  - blueocean-nextstep-dev      # Dev isolé (1 replica)
  - blueocean-staging-shared    # Créneau 09h-12h (PREMIER)
  - blueocean-nextstep-prod     # Production (3-10 replicas + HPA)
```

### **🌐 URLs Finales**
```yaml
Development: 
  - http://localhost:7001 (NEXTSTEP dashboard)
  - http://localhost:7020 (NEXTSTEP API)
Staging: nextstep.staging-shared.local (créneau 09h-12h)
Production: https://nextstep ✅ (EXISTANT - à préserver)
```

### **💾 Données & Storage**
```yaml
PostgreSQL: 
  - nextstep_production (production - PRÉSERVER)
  - nextstep_dev (développement)  
  - blueocean_staging_shared (staging partagé)

Redis:
  - nextstep:{env}: (prefixes par environnement)
```

### **🏗️ Infrastructure**
```yaml
Build: Kaniko cluster (pas Docker local)
Registry: registry.digitalocean.com/blueocean
Images: 
  - nextstep-dashboard:tag
  - nextstep-api:tag
```

---

## 📋 **PLAN MIGRATION PHASE PAR PHASE**

### **Phase 1 : Analyse Architecture Existante (60 min)**
```bash
# 1. CRITIQUE - Analyser NEXTSTEP fonctionnel
cd /Users/ludovicpilet/PROJECTS/NEXTSTEP

# 2. Documenter architecture actuelle
- Pipeline dev→staging→prod FONCTIONNEL
- Infrastructure K8s existante
- Scripts déploiement opérationnels
- Monitoring et alerting configurés
- OpenSSL fix Prisma Alpine appliqué

# 3. Identifier components critiques
find . -name "*.yaml" -o -name "Dockerfile" -o -name "*.sh" | head -20

# 4. Vérifier status production
curl https://nextstep/api/health
kubectl get pods --all-namespaces | grep nextstep
```

### **Phase 2 : Préservation Architecture (75 min)**
```bash
# 1. BACKUP complet NEXTSTEP
cd /Users/ludovicpilet/PROJECTS
cp -r NEXTSTEP NEXTSTEP-BACKUP-$(date +%Y%m%d)

# 2. Analyser structure monorepo BlueOcean
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN
mkdir -p apps/nextstep apps/nextstep-api

# 3. Migration préservant fonctionnalités
# ATTENTION: Préserver configs production fonctionnelles
cp -r /PROJECTS/NEXTSTEP/apps/web/* apps/nextstep/
cp -r /PROJECTS/NEXTSTEP/apps/api/* apps/nextstep-api/

# 4. Adapter pour BlueOcean sans casser
# Ports: 7001 (dashboard), 7020 (API) - CONFORMES
# Préserver Dockerfiles avec fix OpenSSL
```

### **Phase 3 : Adaptation Namespaces (90 min)**
```bash
# 1. Migrer infrastructure K8s existante
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN
mkdir -p infrastructure/nextstep

# 2. Adapter namespaces existants → BlueOcean
# FROM: nextstep-{dev|staging|prod}
# TO:   blueocean-nextstep-{dev}, blueocean-staging-shared, blueocean-nextstep-prod

# 3. Créer manifestes adaptés
infrastructure/nextstep/
├── dev/
│   ├── deployment-dashboard.yaml
│   ├── deployment-api.yaml
│   └── service.yaml
├── staging-shared/ (NOUVEAU)
│   ├── configmap-nextstep.yaml
│   ├── ingress-rules.yaml
│   └── virtual-host-config.yaml
└── prod/
    ├── deployment-dashboard-prod.yaml (ADAPTER EXISTANT)
    ├── deployment-api-prod.yaml (ADAPTER EXISTANT)
    ├── hpa.yaml (PRÉSERVER CONFIG)
    └── service-prod.yaml (PRÉSERVER)

# 4. Configuration staging partagé
- Virtual host: nextstep.staging-shared.local
- Créneau: 09h-12h (PREMIER - référence)
- Resources: Part cluster partagé
```

### **Phase 4 : Scripts Migration (60 min)**
```bash
# 1. Adapter scripts existants pour BlueOcean
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN/scripts

# 2. Migrer scripts NEXTSTEP fonctionnels
cp /PROJECTS/NEXTSTEP/scripts/deploy-*.sh .
cp /PROJECTS/NEXTSTEP/scripts/test-*.sh .

# 3. Adapter pour architecture BlueOcean
# deploy-nextstep-staging.sh → deploy-staging-shared.sh nextstep 09h-12h
# test-nextstep-staging.sh → test-staging-shared.sh nextstep
# deploy-nextstep-prod.sh → deploy-nextstep-prod.sh (adapter namespaces)

# 4. Préserver logique validation
- Confirmation "DEPLOY NEXTSTEP PROD" 
- Tests 8-phases complets
- Backup automatique avant production
- Rollback procedures
```

### **Phase 5 : Pipeline CI/CD (45 min)**
```bash
# 1. Adapter GitHub Actions existants
.github/workflows/nextstep-pipeline.yml
- Trigger: apps/nextstep*/**
- Créneau staging: 09h-12h (PREMIER)
- Build: Kaniko cluster
- Tests: 8-phases complets (PRÉSERVER)
- Confirmation: Manuelle production

# 2. Intégrer logique staging partagé
- Detection criticality: NEXTSTEP = premium
- Staging slot: 09h-12h
- Resources: Shared cluster optimization

# 3. Préserver sécurité production
- Manual confirmation required
- Backup before deployment
- Rollback capabilities
- Health monitoring
```

### **Phase 6 : Tests Migration (60 min)**
```bash
# 1. Tests environnement dev
kubectl get pods -n blueocean-nextstep-dev
curl http://localhost:7001/health
curl http://localhost:7020/api/health

# 2. Tests staging partagé (créneau 09h-12h)
# ATTENTION: Tester sans casser production existante
curl http://nextstep.staging-shared.local/health
curl http://nextstep.staging-shared.local/api/orchestration/metrics

# 3. Validation complète AVANT production
- Tous endpoints fonctionnels
- Orchestration Claude opérationnelle  
- Safety rails activés
- Performance benchmarks OK

# 4. Tests production (CAREFUL)
# Déploiement progressif pour préserver service
```

---

## ⚠️ **POINTS CRITIQUES NEXTSTEP**

### **🚨 PRÉSERVATION ABSOLUE**
```yaml
CRITIQUE - Ne JAMAIS casser:
- https://nextstep production fonctionnelle
- Pipeline dev→staging→prod existant
- Données production nextstep_*
- Scripts déploiement opérationnels  
- Monitoring et alerting configurés
- OpenSSL fix Prisma (containers Alpine)

BACKUP avant TOUTE modification:
- Code source complet
- Configurations K8s
- Base données production
- Scripts et workflows
```

### **🕐 Créneau Staging Prioritaire**
```yaml
NEXTSTEP = PREMIER utilisateur staging partagé
Créneau: 09h-12h (priorité absolue)
Raison: Gold standard pour autres apps
Impact: Modèle pour NEXTGEN, KREACH, KVIBE
```

### **🔗 Infrastructure Critique**
```yaml
PostgreSQL: CONSERVER nextstep_production
Redis: PRÉSERVER prefixes nextstep:*
Registry: MIGRER vers registry.digitalocean.com/blueocean
Monitoring: ADAPTER sans perdre historique
```

---

## 📊 **RESSOURCES & CONFIGURATION**

### **💰 Resources Premium**
```yaml
Development:
  requests: 128Mi RAM, 100m CPU (par app)
  limits: 256Mi RAM, 200m CPU
  replicas: 1 (dev isolé)

Staging Partagé:
  Part prioritaire cluster partagé (09h-12h)
  
Production (PRÉSERVER PERFORMANCE):
  replicas: 3-10 (HPA CPU 70% - EXISTANT)
  requests: 512Mi RAM, 500m CPU (CONSERVER)
  limits: 1Gi RAM, 1000m CPU (CONSERVER)
```

### **🔧 Configuration Spécifique NEXTSTEP**
```yaml
Caractéristiques Critiques:
- Orchestration Claude core
- Safety rails système
- Metrics et monitoring avancés
- Agent coordination
- Multi-step task execution

Variables Essentielles:
- NEXTSTEP_ORCHESTRATION_MODE
- CLAUDE_API_CONFIG
- SAFETY_RAILS_ENABLED=true
- MONITORING_ENDPOINTS
- AGENT_COORDINATION_CONFIG

Performance Critiques:
- Response time <2s API
- Orchestration latency <500ms
- Safety rail reaction <100ms
```

---

## 🏆 **SPÉCIFICITÉS GOLD STANDARD**

### **📊 Modèle de Référence**
```yaml
NEXTSTEP Migration = RÉFÉRENCE pour:
- NEXTGEN pipeline premium
- KREACH intelligence workflow
- KVIBE marketing automation
- Architecture staging partagé

Standards à Maintenir:
- Pipeline 3-env (dev→staging→prod)
- Tests 8-phases complets
- Confirmation manuelle production
- Backup automatique
- Rollback capabilities
- Zero-downtime deployments
```

### **🚀 Innovation BlueOcean**
```yaml
Améliorations BlueOcean:
- Staging partagé frugal (-75% coûts)
- Créneau optimisé 09h-12h
- Infrastructure commune
- Registry centralisé
- Monitoring unifié

Préservation Qualité:
- Performance production identique
- Fiabilité déploiements maintenue
- Sécurité niveau équivalent
- Monitoring capacités préservées
```

---

## ✅ **CRITÈRES SUCCÈS**

### **Phase 1 Réussie**
- [ ] Architecture NEXTSTEP existante documentée
- [ ] Components critiques identifiés
- [ ] Production status vérifié
- [ ] Backup strategy établie

### **Phase 2 Réussie**
- [ ] Code migré vers BlueOcean sans perte
- [ ] Dockerfiles OpenSSL fix préservés
- [ ] Ports 7001/7020 configurés
- [ ] Structure monorepo respectée

### **Phase 3 Réussie**
- [ ] Namespaces BlueOcean adaptés
- [ ] Staging partagé configuré (09h-12h)
- [ ] Production configs préservées
- [ ] Infrastructure migration validée

### **Phase 4 Réussie**
- [ ] Scripts adaptés BlueOcean
- [ ] Logique validation préservée
- [ ] Confirmation production maintenue
- [ ] Rollback capabilities intactes

### **Phase 5 Réussie**
- [ ] GitHub Actions configurées
- [ ] Pipeline premium fonctionnel
- [ ] Staging slot 09h-12h respecté
- [ ] Sécurité production maintenue

### **Phase 6 Réussie**
- [ ] Dev environment stable
- [ ] Staging partagé validé
- [ ] Production migration réussie
- [ ] Service continuity préservée

---

## 🚨 **ALERTES & ESCALATION**

### **Blockers Critiques**
```yaml
Si casse production nextstep:
  → ARRÊT IMMÉDIAT toute migration
  → Rollback vers backup
  → Escalade NEXIA orchestrator
  
Si perte données production:
  → URGENCE MAXIMALE
  → Restore depuis backup
  → Audit impact complet

Si tests staging échouent:
  → STOP migration
  → Debug priorité absolue
  → Impact sur modèle autres apps
```

### **Validation Continue**
```yaml
Checkpoints OBLIGATOIRES:
- Chaque phase: Validation NEXIA orchestrator
- Avant staging: Production health check
- Avant production: Full staging validation
- Post migration: Service continuity verified
```

---

## 📞 **SUPPORT & RESSOURCES**

### **Documentation Référence**
- Architecture actuelle : `/PROJECTS/NEXTSTEP/`
- Architecture cible : `/PROJECTS/NEXIA/BLUEOCEAN-CICD-RULES-DRAFT.md`
- Status système : `/PROJECTS/NEXIA/NEXTSTEP-ARCHITECTURE-STATUS.md`

### **Commandes Critiques**
```bash
# Status production CRITIQUE
curl https://nextstep/api/health
kubectl get pods --all-namespaces | grep nextstep

# Health orchestration
curl https://nextstep/api/orchestration/metrics
curl https://nextstep/api/safety/status

# Logs production
kubectl logs deployment/nextstep-api-prod --tail=50
```

---

**🎯 SESSION DÉDIÉE : NEXTSTEP Gold Standard Migration**
**⏰ CRÉNEAU STAGING : 09h-12h (PREMIER - Priorité absolue)**  
**🏆 MISSION : Préserver excellence + Adapter BlueOcean frugal**
**🤝 COORDINATION : Validation NEXIA à chaque phase critique**

**GO pour migration NEXTSTEP modèle de référence !** 🚀