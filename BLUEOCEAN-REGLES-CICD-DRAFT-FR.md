# 🔧 BlueOcean - Règles CI/CD & Logique Environnements - DRAFT

**VERSION DRAFT - En Attente d'Approbation**

---

## 🎯 **RÉSUMÉ EXÉCUTIF**

### **🏆 Stratégie Architecture : "BlueOcean Enrichi par NextStep"**
```
Vision : L'excellence CI/CD NextStep comme STANDARD D'OR pour toutes les apps BlueOcean
Principe : Pipeline aligné sur la criticité business
Approche : Premium vs Standard basé sur l'impact revenus
```

### **⚡ Vue d'Ensemble Rapide**
- **Toutes Apps Critiques** : dev → staging-partagé → prod (NEXTSTEP, NEXTGEN €2,3M, KREACH, KVIBE)
- **Architecture Frugale** : Cluster staging partagé (-75% coûts) + environnements dev isolés
- **Méta-Orchestrateur** : NEXIA (superviseur indépendant utilisant l'infrastructure BlueOcean)
- **Protection Business** : Toutes apps critiques pour succès lancement
- **Optimisation Coûts** : -40% coûts infrastructure vs séparation complète

---

## 🎭 **LOGIQUE ENVIRONNEMENTS**

### **🏆 Apps Premium (Critiques Business)**

#### **NEXTSTEP - Orchestration Claude**
```yaml
Criticité : CRITIQUE (Orchestration cœur métier)
Pipeline : dev → staging-partagé → prod
Namespaces :
  - blueocean-nextstep-dev      # Développement (1 replica, isolé)
  - blueocean-staging-shared    # Environnement validation partagé (créneaux)
  - blueocean-nextstep-prod     # Production (3-10 replicas + HPA)
URL : http://nextstep
Créneau Staging : 09h-12h quotidien (optimisation cluster partagé)
Confirmation : "DEPLOY NEXTSTEP PROD"
```

#### **NEXTGEN - Protection €2,3M ARR**
```yaml
Criticité : CRITIQUE (€2,3M de revenus annuels)
Pipeline : dev → staging-partagé → prod
Namespaces :
  - blueocean-nextgen-dev       # Développement (1 replica, isolé)
  - blueocean-staging-shared    # Environnement validation partagé (créneaux)
  - blueocean-nextgen-prod      # Production (5-15 replicas + HPA)
URL : http://nextgen
Créneau Staging : 12h-15h quotidien (optimisation cluster partagé)
Confirmation : "DEPLOY NEXTGEN PROD - €2.3M ARR CONFIRMÉ"
SLA : 99,9% uptime obligatoire
```

#### **KREACH - Intelligence Marché**
```yaml
Criticité : CRITIQUE (Prédictions IA + données marché)
Pipeline : dev → staging-partagé → prod
Namespaces :
  - blueocean-kreach-dev        # Développement (1 replica, isolé)
  - blueocean-staging-shared    # Environnement validation partagé (créneaux)
  - blueocean-kreach-prod       # Production (3-8 replicas + HPA)
URL : http://kreach
Créneau Staging : 15h-18h quotidien (optimisation cluster partagé)
Confirmation : "DEPLOY KREACH PROD"
```

### **🚀 Toutes Apps Premium (Critiques Lancement) - Architecture Frugale**

#### **KVIBE - Marketing Viral (Critique Lancement)**
```yaml
Criticité : CRITIQUE (Essentiel pour lancement toutes solutions)
Pipeline : dev → staging-partagé → prod (préparation lancement)
Namespaces :
  - blueocean-kvibe-dev         # Développement (1 replica, isolé)
  - blueocean-staging-shared    # Environnement validation partagé (créneaux)
  - blueocean-kvibe-prod        # Production (2-10 replicas + HPA)
URL : http://kvibe
Créneau Staging : 18h-21h quotidien (optimisation cluster partagé)
Confirmation : Manuel (staging→prod) - critique lancement
```

### **🧠 Méta-Orchestrateur (Architecture Indépendante)**

#### **NEXIA - Écosystème Superviseur IA Global**
```yaml
Criticité : MÉTA (Supervise tous les écosystèmes)
Pipeline : Projet indépendant utilisant l'infrastructure K8s BlueOcean
Architecture : /PROJECTS/NEXIA/ (PAS dans le monorepo BlueOcean)
Composants :
  - nexia-supervisor            # Cerveau IA et orchestration
  - nexia-voice                 # Interface vocale (Siri, ChatGPT-like)
  - nexia-directus              # CMS opérationnel (migré de NEXTGEN)
  - nexia-claude-code           # Agent Claude Code cluster (opérations 24/7) 🤖
Namespaces :
  - nexia-supervisor-dev        # Développement (1 replica chacun)
  - nexia-supervisor-prod       # Production (2-4 replicas + HPA)
  - nexia-claude-code-prod      # Agent Claude Code 24/7 (2-3 replicas + monitoring)
URLs :
  - http://nexia                # Interface superviseur principal
  - http://nexia/admin          # Admin CMS Directus
  - http://nexia/claude         # Interface agent Claude Code
Fonction : Supervise BlueOcean + OnlyOneAPI + Business-Automation + Tous Projets
Automatisation : Claude Code 24/7 avec supervision NEXIA+Directus + GO/NO-GO Humain
Raison : Méta-orchestrateur avec outils opérationnels doit être architecturalement indépendant
```

---

## 🔒 **RÈGLES CI/CD**

### **📋 Règles Pipeline Premium**

#### **🛡️ Sécurité Production (OBLIGATOIRE)**
```yaml
1. CONFIRMATION MANUELLE REQUISE :
   - NEXTSTEP : Phrase exacte "DEPLOY NEXTSTEP PROD"
   - NEXTGEN : Phrase exacte "DEPLOY NEXTGEN PROD - €2.3M ARR CONFIRMÉ"  
   - KREACH : Phrase exacte "DEPLOY KREACH PROD"

2. VALIDATION STAGING OBLIGATOIRE :
   - ❌ AUCUN déploiement production sans approbation staging
   - ✅ TOUS les tests 8-phases doivent réussir
   - ✅ Benchmarks performance validés
   - ✅ Logique business vérifiée

3. SAUVEGARDE AUTOMATIQUE :
   - Export configurations existantes
   - Snapshot base de données (si applicable)
   - Point de retour garanti

4. ROLLBACK AUTOMATIQUE DÉCLENCHÉ PAR :
   - Échec health checks
   - Dégradation performance >20%
   - Erreurs critiques détectées
   - Violation SLA (NEXTGEN €2,3M)
```

#### **🧪 Tests 8-Phases (Apps Premium)**
```yaml
Phase 1 - Infrastructure :
  ✓ Namespaces existent et accessibles
  ✓ Services déployés correctement
  ✓ Configuration ingress valide

Phase 2 - Santé Pods :
  ✓ Tous les pods en état Running
  ✓ Readiness probes réussis
  ✓ Limites ressources respectées

Phase 3 - Santé Application :
  ✓ /api/health retourne 200
  ✓ Connectivité base de données vérifiée
  ✓ Connectivité Redis/cache vérifiée

Phase 4 - APIs Fonctionnelles :
  ✓ Endpoints business répondent
  ✓ Cohérence données validée
  ✓ Points d'intégration fonctionnels

Phase 5 - UI/Dashboard :
  ✓ Pages se chargent en <3s SLA
  ✓ Parcours utilisateur critiques fonctionnels
  ✓ Design responsive vérifié

Phase 6 - Tests Intégration :
  ✓ Communication inter-services
  ✓ APIs externes accessibles
  ✓ Endpoints monitoring actifs

Phase 7 - Validation Performance :
  ✓ Temps réponse dans SLA
  ✓ Seuils load testing respectés
  ✓ Utilisation ressources optimisée

Phase 8 - Sécurité & Business :
  ✓ Secrets correctement montés
  ✓ Pas d'endpoints debug exposés
  ✓ Logique business validée
  ✓ Impact revenus évalué (NEXTGEN)
```

### **⚡ Règles Pipeline Standard**

#### **🚀 Tests Simplifiés (Apps Standard)**
```yaml
Tests Essentiels Seulement :
  ✓ Endpoint health répond
  ✓ UI se charge sans erreurs
  ✓ Fonctionnalité de base marche
  ✓ Pas d'erreurs critiques logs

Conditions Auto-Deploy :
  ✓ Tous les tests réussis
  ✓ Build réussi
  ✓ Pas de conflits merge
```

---

## 🔄 **Intelligence GitHub Actions**

### **📊 Logique Déclencheurs**
```yaml
Déclencheurs Pipeline Premium :
  - apps/nextstep/**     → Pipeline complet dev→staging→prod
  - apps/nextgen/**      → Pipeline sécurisé €2,3M ARR  
  - apps/kreach/**       → Pipeline validation intelligence

Déclencheurs Apps Critiques (Architecture Frugale) :
  - apps/nextstep/**     → dev→staging-partagé→prod (créneau 09h-12h)
  - apps/nextgen/**      → dev→staging-partagé→prod (créneau 12h-15h)
  - apps/kreach/**       → dev→staging-partagé→prod (créneau 15h-18h)
  - apps/kvibe/**        → dev→staging-partagé→prod (créneau 18h-21h)

Méta-Orchestrateur (Indépendant) :
  - NEXIA géré indépendamment (utilise uniquement l'infrastructure K8s BlueOcean)

Déclencheurs Infrastructure :
  - packages/shared-config/** → Rebuild toutes apps dépendantes
  - infrastructure/**         → Update infrastructure partagée
  - .github/workflows/**      → Mise à jour config CI/CD
```

### **🎯 Sélection Workflow**
```yaml
name: Pipeline Intelligent BlueOcean

on:
  push:
    paths: ['apps/**']

jobs:
  detecter-criticite:
    outputs:
      type-pipeline: ${{ steps.detect.outputs.type }}
    steps:
    - name: Détection Criticité Business
      run: |
        if [[ "$CHANGED_FILES" =~ (nextstep|nextgen|kreach) ]]; then
          echo "type=premium" >> $GITHUB_OUTPUT
        # Toutes apps critiques pour lancement - staging frugale
        if [[ "$CHANGED_FILES" =~ (nextstep) ]]; then
          echo "type=critique" >> $GITHUB_OUTPUT
          echo "creneau_staging=09h-12h" >> $GITHUB_OUTPUT
        elif [[ "$CHANGED_FILES" =~ (nextgen) ]]; then
          echo "type=critique" >> $GITHUB_OUTPUT
          echo "creneau_staging=12h-15h" >> $GITHUB_OUTPUT
        elif [[ "$CHANGED_FILES" =~ (kreach) ]]; then
          echo "type=critique" >> $GITHUB_OUTPUT
          echo "creneau_staging=15h-18h" >> $GITHUB_OUTPUT
        elif [[ "$CHANGED_FILES" =~ (kvibe) ]]; then
          echo "type=critique" >> $GITHUB_OUTPUT
          echo "creneau_staging=18h-21h" >> $GITHUB_OUTPUT
        else
          echo "type=none" >> $GITHUB_OUTPUT  # NEXIA géré indépendamment
        fi

  pipeline-critique-frugal:
    if: needs.detecter-criticite.outputs.type-pipeline == 'critique'
    # Pipeline frugal dev→staging-partagé→prod avec optimisation créneaux
    env:
      CRENEAU_STAGING: ${{ needs.detecter-criticite.outputs.creneau_staging }}
    # Validation complète avec cluster staging partagé
```

---

## 🌐 **STRUCTURE URLs & ACCÈS**

### **🎯 URLs Production**
```yaml
Apps Premium :
  - https://nextstep              # Interface orchestration
  - https://nextgen               # Plateforme domaines €2,3M ARR
  - https://kreach                # Dashboard intelligence marché

Apps Standard :
  - https://kvibe                 # Campagnes marketing viral

Méta-Orchestrateur (Indépendant) :
  - https://nexia                 # Superviseur IA global (tous écosystèmes)

Endpoints API :
  - https://nextstep/api          # API orchestration
  - https://nextgen/api           # API domaines (revenus €2,3M)
  - https://kreach/api            # API intelligence
  - https://kvibe/api             # API marketing

API Méta-Orchestrateur :
  - https://nexia/api             # API supervision globale (tous écosystèmes)
```

### **🧪 URLs Staging (Architecture Frugale Partagée)**
```yaml
Environnement Validation Partagé :
  - https://staging-shared.blueocean    # Cluster staging multi-apps
  
Hosts Virtuels Spécifiques Apps :
  - nextstep.staging-shared.local       # Créneau 09h-12h
  - nextgen.staging-shared.local        # Créneau 12h-15h
  - kreach.staging-shared.local         # Créneau 15h-18h
  - kvibe.staging-shared.local          # Créneau 18h-21h

Optimisation Coûts : -75% vs environnements staging séparés
```

### **🏠 URLs Développement**
```yaml
Développement Local :
  - http://localhost:7001         # Dashboard NEXTSTEP
  - http://localhost:7020         # API NEXTSTEP
  - http://localhost:7000         # Landing NEXTGEN
  - http://localhost:7001         # Dashboard NEXTGEN  
  - http://localhost:7002         # Admin NEXTGEN
  - http://localhost:5003         # Web KREACH
  - http://localhost:8001         # API KREACH
  - http://localhost:7005         # Frontend KVIBE
  - http://localhost:7006         # Backend KVIBE
  
Méta-Orchestrateur (Développement Indépendant) :
  - http://localhost:7010         # Interface superviseur NEXIA
  - http://localhost:7011         # API NEXIA
  - http://localhost:7012         # CMS Directus NEXIA
  - http://localhost:7013         # Agent Claude Code cluster
```

---

## 🏗️ **INFRASTRUCTURE PARTAGÉE**

### **🔧 Services Communs**
```yaml
PostgreSQL Central :
  host: postgres-central.platform.svc.cluster.local
  port: 5432
  bases_donnees:
    - nextstep_production / nextstep_dev
    - nextgen_production / nextgen_dev
    - kreach_production / kreach_dev
    - kvibe_production / kvibe_dev
    - blueocean_staging_shared            # Base staging partagée (toutes apps)

  # Méta-Orchestrateur (Schémas indépendants)
    - nexia_supervisor_production / nexia_supervisor_dev
    - nexia_directus_production / nexia_directus_dev

Redis Central :
  host: platform-pool-redis-master.platform.svc.cluster.local
  port: 6379
  prefixes:
    - nextstep:{env}:
    - nextgen:{env}:
    - kreach:{env}:
    - kvibe:{env}:  # Peut scaler pour multi-tenant SaaS

  # Méta-Orchestrateur (Préfixe indépendant)
    - nexia-supervisor:{env}:

Registry Conteneurs :
  registry: registry.digitalocean.com/blueocean
  systeme_build: Kaniko (builds cluster, pas de Docker local)
  images:
    - nextstep-dashboard:tag / nextstep-api:tag
    - nextgen-landing:tag / nextgen-dashboard:tag / nextgen-admin:tag
    - kreach-web:tag / kreach-api:tag
    - kvibe-frontend:tag / kvibe-backend:tag

  # Méta-Orchestrateur (Registry indépendant)
    - nexia-supervisor:tag / nexia-api:tag / nexia-directus:tag / nexia-claude-code:tag

Infrastructure Build :
  kaniko: Builds Docker cluster (pas de builds Mac)
  localisation: namespace blueocean-build
  source: Dépôts GitHub privés (tous projets)
  declenchement: GitHub Actions → Job Kaniko → Push Registry
  
Résumé Chaîne CI/CD :
  Dépôt GitHub Privé → GitHub Actions → Build Kaniko (Cluster) → Registry DO → Déploiement K8s

Stack Monitoring :
  grafana: grafana.monitoring.svc.cluster.local
  prometheus: prometheus.monitoring.svc.cluster.local:9090
  dashboards: Métriques business spécifiques + techniques
```

---

## 📊 **ALLOCATION RESSOURCES**

### **🏆 Ressources Apps Premium**
```yaml
NEXTSTEP Production :
  replicas: 3-10 (HPA basé CPU 70%)
  requests: 512Mi RAM, 500m CPU
  limits: 1Gi RAM, 1000m CPU
  stockage: PostgreSQL + Redis partagés

NEXTGEN Production (€2,3M ARR) :
  replicas: 5-15 (HPA basé CPU 60% - plus conservateur)
  requests: 1Gi RAM, 750m CPU  
  limits: 2Gi RAM, 1500m CPU
  stockage: Schéma BDD dédié + stratégie backup
  monitoring: Surveillance SLA renforcée

KREACH Production :
  replicas: 3-8 (HPA basé CPU 70%)
  requests: 750Mi RAM, 600m CPU
  limits: 1.5Gi RAM, 1200m CPU
  stockage: Modèles ML + stockage pipeline données
```

### **⚡ Ressources Apps Standard**
```yaml
KVIBE Production (Critique Lancement) :
  replicas: 2-10 (HPA basé CPU 75%)
  requests: 512Mi RAM, 400m CPU
  limits: 1Gi RAM, 800m CPU
  scaling: Auto-scale pour campagnes lancement
  base_donnees: Schéma optimisé lancement

### **💰 Ressources Staging Partagé (Optimisation Frugale)**
```yaml
Cluster Staging Partagé :
  replicas: 2-4 (partagé entre toutes apps)
  requests: 1Gi RAM, 800m CPU  # Total pour toutes apps
  limits: 2Gi RAM, 1600m CPU
  planification: Basée créneaux (4 apps × 3h créneaux)
  economies: -75% vs environnements staging séparés
  
Ressources Développement (Minimales) :
  requests: 128Mi RAM, 100m CPU  # Par app, isolé
  limits: 256Mi RAM, 200m CPU
  replicas: 1 (pas HA nécessaire en dev)
```

### **🧠 Ressources Méta-Orchestrateur (Indépendant)**
```yaml
Écosystème NEXIA Production :
  supervisor:
    replicas: 2-4 (HPA basé CPU 80%)
    requests: 512Mi RAM, 500m CPU
    limits: 1Gi RAM, 1000m CPU
  voice:
    replicas: 1-2 (HPA basé CPU 70%)
    requests: 256Mi RAM, 250m CPU
    limits: 512Mi RAM, 500m CPU
  directus:
    replicas: 1-3 (HPA basé CPU 75%)
    requests: 512Mi RAM, 400m CPU
    limits: 1Gi RAM, 800m CPU
  claude-code-24x7:
    replicas: 2-3 (Always-on, haute disponibilité)
    requests: 1Gi RAM, 750m CPU  # Ressources supérieures pour opérations IA
    limits: 2Gi RAM, 1500m CPU
    disponibilite: 99.9% uptime obligatoire
  stockage: Schémas PostgreSQL indépendants + préfixe Redis
  fonction: Supervision écosystème autonome 24/7 complète avec agent IA Claude Code
```
```

---

## 🎯 **COMMANDES DÉPLOIEMENT**

### **🚀 Flux Déploiement Premium**
```bash
# Pipeline premium complet
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN

# NEXTSTEP
./scripts/deploy-nextstep-staging.sh      # Déployer vers staging
./scripts/test-nextstep-staging.sh        # Validation 8-phases
./scripts/deploy-nextstep-prod.sh         # Production (confirmation manuelle)

# NEXTGEN (€2,3M ARR)
./scripts/deploy-nextgen-staging.sh       # Déployer vers staging  
./scripts/test-nextgen-staging.sh         # Validation business
./scripts/deploy-nextgen-prod.sh          # Production (double confirmation)

# KREACH
./scripts/deploy-kreach-staging.sh        # Déployer vers staging
./scripts/test-kreach-staging.sh          # Validation intelligence  
./scripts/deploy-kreach-prod.sh           # Production (confirmation manuelle)
```

### **🚀 Flux Déploiement Critique Frugal**
```bash
# Staging partagé avec créneaux
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN

# NEXTSTEP (créneau 09h-12h)
./scripts/deploy-staging-shared.sh nextstep 09h-12h
./scripts/test-staging-shared.sh nextstep
./scripts/deploy-nextstep-prod.sh         # Production (confirmation manuelle)

# NEXTGEN (créneau 12h-15h)
./scripts/deploy-staging-shared.sh nextgen 12h-15h
./scripts/test-staging-shared.sh nextgen
./scripts/deploy-nextgen-prod.sh          # Production (double confirmation)

# KREACH (créneau 15h-18h)
./scripts/deploy-staging-shared.sh kreach 15h-18h
./scripts/test-staging-shared.sh kreach
./scripts/deploy-kreach-prod.sh           # Production (confirmation manuelle)

# KVIBE (créneau 18h-21h)
./scripts/deploy-staging-shared.sh kvibe 18h-21h
./scripts/test-staging-shared.sh kvibe
./scripts/deploy-kvibe-prod.sh            # Production (confirmation manuelle)
```

### **💰 Résumé Optimisation Coûts**
```yaml
Avantages Architecture Frugale :
  - Cluster staging partagé : -75% coûts staging
  - Planification créneaux : Utilisation ressources optimale
  - Ressources dev minimales : -60% coûts développement
  - Économies infrastructure totales : -40% vs séparation complète
  
Qualité Maintenue :
  - Toutes apps traitées comme critiques (exigences lancement)
  - Pipeline validation complet préservé
  - Environnements développement isolés (sécurité debugging)
  - Ressources production inchangées (performance garantie)
```

### **🧠 Déploiement Méta-Orchestrateur (Indépendant)**
```bash
# Écosystème NEXIA géré indépendamment du monorepo BlueOcean
cd /Users/ludovicpilet/PROJECTS/NEXIA
./scripts/deploy-nexia-supervisor.sh      # Déployer superviseur IA
./scripts/deploy-nexia-voice.sh           # Déployer interface vocale
./scripts/deploy-nexia-directus.sh        # Déployer CMS opérationnel
./scripts/deploy-nexia-claude-code.sh     # Déployer agent Claude Code 24/7 🤖

# Monitoring
kubectl get pods --all-namespaces | grep blueocean
curl https://kvibe/api/health

# Monitoring méta-orchestrateur
curl https://nexia/api/health              # Health superviseur global
curl https://nexia/admin/server/health     # Health CMS Directus
curl https://nexia/claude/health           # Health agent Claude Code 24/7
curl https://nexia/claude/status           # Statut agent & niveau délégation
```

---

## 🔍 **MONITORING & ALERTES**

### **📊 Monitoring Apps Premium**
```yaml
NEXTGEN (€2,3M ARR) - Alertes Critiques :
  - Downtime API revenus >1min → Alerte immédiate
  - Échecs résolution domaines → Incident P0  
  - Erreurs traitement paiements → Notification direction
  - Dégradation performance >10% → Déclenchement auto-scaling

NEXTSTEP - Priorité Élevée :
  - Échecs orchestration → Alerte équipe développement
  - Violations safety rails → Notification équipe sécurité
  - Échecs API Claude → Alerte dégradation service

KREACH - Priorité Intelligence :  
  - Échecs pipeline données → Alerte équipe data
  - Dégradation modèles ML → Notification équipe IA
  - Données marché obsolètes → Alerte business
```

### **⚡ Monitoring Apps Standard**
```yaml
Toutes Apps - Alertes Critiques Lancement :
  - Downtime service >3min → Alerte priorité haute (critique lancement)
  - Taux erreur >3% → Notification développement (standards lancement)
  - Épuisement ressources → Alerte infrastructure + déclenchement auto-scaling
  - Conflits créneaux staging → Coordination déploiement requise
  - Dégradation performance >15% → Alerte impact business
  - Problèmes staging partagé → Évaluation impact multi-apps
```

---

**🎯 GO APPROUVÉ : Architecture cœur prête pour implémentation**

**📋 Sections Sécurité & Opérationnelles détaillées dans :**
`BLUEOCEAN-REGLES-CICD-DRAFT-FR-SECURITY.md`

**Prochaines Étapes :**
1. Implémenter architecture CI/CD frugale cœur
2. Déployer supervision Claude Code 24/7  
3. Développer recommandations sécurité & opérationnelles complètes

### **🧠 Monitoring Méta-Orchestrateur**
```yaml
NEXIA - Alertes Supervision Globale :
  - Downtime superviseur >2min → Incident P0 (affecte tous écosystèmes)
  - Échecs intégrations → Alerte impact multi-écosystème
  - Problèmes interface vocale → Dégradation expérience utilisateur
  - Downtime CMS Directus >3min → Outils opérationnels indisponibles
  - Downtime agent Claude Code >1min → Automatisation 24/7 compromise (P0)
  - Échecs monitoring cross-écosystème → Risque continuité business
  - Incohérences données CMS → Alerte intégrité données
  - Conflits niveau délégation Claude Code → Approbation humaine requise
  - Opérations autonomes bloquées >5min → Escalade superviseur humain
```

---

## 🚨 **PROCÉDURES ROLLBACK**

### **🛡️ Rollback Apps Premium**
```yaml
Déclencheurs Rollback Automatique :
  - Health checks échouent après 2min
  - Taux erreur >10% pendant 5min
  - Dégradation performance >30%
  - NEXTGEN : Tout impact revenus détecté

Commandes Rollback Manuel :
# NEXTSTEP
kubectl rollout undo deployment/nextstep-api-prod -n blueocean-nextstep-prod
kubectl rollout undo deployment/nextstep-dashboard-prod -n blueocean-nextstep-prod

# NEXTGEN (€2,3M ARR - Priorité)
kubectl rollout undo deployment/nextgen-api-prod -n blueocean-nextgen-prod
kubectl rollout undo deployment/nextgen-dashboard-prod -n blueocean-nextgen-prod
# + Notification immédiate équipe business

# KREACH  
kubectl rollout undo deployment/kreach-api-prod -n blueocean-kreach-prod
kubectl rollout undo deployment/kreach-web-prod -n blueocean-kreach-prod
```

---

## 📋 **WORKFLOW APPROBATION**

### **✅ STATUT DRAFT**
```yaml
Statut Document : DRAFT - En Attente Approbation
Créé : $(date)
Localisation : /Users/ludovicpilet/PROJECTS/NEXIA/
Prochaines Étapes : 
  1. Revue et validation
  2. Approbation pour implémentation
  3. Exécution plan migration
```

### **🎯 CHECKLIST VALIDATION**
```yaml
Revue Architecture :
  □ Logique Premium vs Standard approuvée
  □ Stratégie environnements validée  
  □ Allocation ressources confirmée
  □ Règles sécurité approuvées

Alignement Business :
  □ Stratégie protection €2,3M ARR approuvée
  □ Exigences SLA confirmées
  □ Priorités monitoring validées
  □ Procédures rollback approuvées

Implémentation Technique :
  □ Règles CI/CD finalisées
  □ Phases tests approuvées
  □ Commandes déploiement validées
  □ Exigences infrastructure confirmées
```

---

### **🎯 FLUX COMPLETS DÉTAILLÉS**

#### **🏆 Flux Premium Complet**
```bash
1. Push Code → apps/nextstep/**
2. GitHub Actions détecte → Pipeline Premium
3. Build & Tests en parallèle
4. Déploiement automatique → DEV
5. Tests validation DEV
6. Déploiement automatique → STAGING  
7. Tests 8-phases STAGING
8. ⏸️  PAUSE - Confirmation manuelle requise
9. Sauvegarde production automatique
10. Déploiement → PRODUCTION avec rolling update
11. Health checks post-déploiement
12. ✅ Succès OU ❌ Rollback automatique
```

#### **⚡ Flux Standard Complet**
```bash  
1. Push Code → apps/kvibe/**
2. GitHub Actions détecte → Pipeline Standard
3. Build & Tests basiques
4. Déploiement automatique → DEV
5. Tests validation DEV
6. Déploiement automatique → PRODUCTION
7. Health checks
8. ✅ Notification succès
```

---

**🎯 PRÊT POUR APPROBATION : Ce draft définit les règles CI/CD complètes et la logique environnements pour l'architecture BlueOcean Enrichi par NextStep.**

**Prochaine Étape : En attente de décision GO pour implémentation de la migration NextStep → BlueOcean avec ces règles.**