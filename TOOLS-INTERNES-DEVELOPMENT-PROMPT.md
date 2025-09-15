# 🚀 TEMPLATE PROMPT DE DÉVELOPPEMENT - OUTILS INTERNES

**Version :** 3.1.0  
**Date :** 2025-09-15  
**Source :** REX K-VIBE Dashboard + KVIBES Audit Complet + Enrichissements Business/Architecture + Corrections Formatage  
**Applicabilité :** Tous outils internes écosystème (K-VIBE, KREACH, NextStep, NextGen, Nexia, etc.)

**Nouveautés v3.1.0 :**
- 12 dimensions d'audit (vs 6 originales)
- Évaluation business & potentiel SaaS intégrée
- Conformité architecture & écosystème BlueOcean
- Formatage rapport standardisé A4 avec CSS d'impression
- Date/heure système réelles automatiques
- Pieds de page CSS fonctionnels (@page bottom)

---

## 📋 PROMPT STANDARD DE DÉVELOPPEMENT

### 🎯 **DEMANDE INITIALE TYPE**

```
Le site doit être full responsive design (en particulier pour MacBook M2) et nous ne devons avoir que des données réelles. 

Merci de tagguer toutes les pages selon le template enrichi en précisant :
- Statut responsive design + données + MacBook M2 + environnement
- Security & resilience + CI/CD pipeline
- Architecture & tech stack + ecosystem integration
- Business potential + performance & monitoring
- Compliance & legal + dependencies & debt

Merci de faire un état des lieux détaillé puis établir un plan de travail complet.

Le rapport doit être structuré dans cet ordre :
1. Score global puis 
2. Plan d'actions détaillé puis 
3. Analyse détaillée

Le rapport doit être au format .md avec :
- Titre : [NOM_PROJET] - Etat des lieux projet - [DATE_RÉELLE]
- Nom fichier : [NOM_PROJET]-Etat-des-lieux-projet-[DATE_RÉELLE].md
- Date/heure RÉELLES du système (utiliser `date` command)
- Format A4 portrait avec CSS intégré pour impression
- Pieds de page CSS avec @page @bottom-left/@bottom-right
- Polices réduites (corps 10pt, tableaux 9pt, pieds 8pt)
- Pagination automatique lors de l'impression PDF

**Template CSS Obligatoire :**
```css
<style>
@page {
  size: A4 portrait;
  margin: 2cm;
  @bottom-left { content: "[NOM_PROJET] - Etat des lieux projet - [CHEMIN_COMPLET]"; font-size: 8pt; color: #666; }
  @bottom-right { content: "Page " counter(page) " sur [TOTAL_PAGES]"; font-size: 8pt; color: #666; }
}
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 10pt; line-height: 1.3; color: #333; }
h1 { font-size: 16pt; } h2 { font-size: 14pt; } h3 { font-size: 12pt; } h4 { font-size: 11pt; }
table { font-size: 9pt; width: 100%; border-collapse: collapse; }
th, td { padding: 0.2em; border: 1px solid #ddd; }
.page-break { page-break-before: always; }
</style>
```
```

### 🏷️ **SYSTÈME DE TAGS OBLIGATOIRES**

#### **📱 Responsive Design Status**
- `✅ CONFORME` - Mobile-first, breakpoints optimisés
- `⚠️ PARTIEL` - Responsive basique, améliorations nécessaires  
- `🔴 NON-CONFORME` - Interface fixe, non mobile-friendly

#### **🗄️ Data Status**
- `✅ RÉELLES` - API live, données production/staging
- `⚠️ MIXTE` - Combinaison API + fallback intelligent
- `❌ MOCKÉES` - Données hardcodées, fallback uniquement
- `⚠️ FALLBACK` - Service fallback avec données cohérentes

#### **📊 Completion Status (% Réalisation)**
- `🟢 COMPLET` - 90-100% des spécifications implémentées
- `🟡 AVANCÉ` - 70-89% des spécifications implémentées
- `🟠 PARTIEL` - 40-69% des spécifications implémentées
- `🔴 INITIAL` - 0-39% des spécifications implémentées
- `📋 SPEC-MANQUANTES` - Spécifications incomplètes ou non définies

#### **💻 Screen Resolution Tags**
- `📱 MOBILE` - 320px-768px (iPhone, Android)
- `📟 TABLET` - 768px-1024px (iPad, Android tablets)
- `💻 MacBook M2` - 1280px-1440px (MacBook Air/Pro M2)
- `🖥️ DESKTOP` - 1440px+ (External monitors, iMac)
- `🔄 ADAPTIVE` - Tous écrans avec breakpoints intelligents

#### **🛠️ Development Environment Tags**
- `🏠 LOCAL-PURE` - Développement 100% local (API mock, DB locale)
- `🔗 LOCAL-HYBRID` - Local + DB cluster BlueOcean (port-forward K8s)
- `☁️ CLUSTER-FULL` - 100% cluster DigitalOcean BlueOcean (staging/prod)
- `📝 GITHUB-SYNCED` - Code synchronisé GitHub Actions + Digiclevr
- `🐳 KANIKO-READY` - Images Docker buildées automatiquement sans Docker local

#### **🛡️ Security & Resilience Tags**
- `✅ SECURE` - Code sauvegardé + déployable sans Mac (CI/CD complet)
- `⚠️ AT-RISK` - Dépendance Mac + risque perte données/config
- `🔴 VULNERABLE` - Développement local uniquement, aucune sauvegarde
- `🔄 BACKUP-AUTO` - Sauvegarde automatique code + DB
- `💀 SINGLE-POINT-FAILURE` - Crash Mac = projet perdu

#### **🚀 CI/CD Pipeline Tags**
- `✅ FULL-PIPELINE` - GitHub → Build → Test → Deploy automatique
- `🟡 PARTIAL-PIPELINE` - Build automatique, deploy manuel
- `🔴 NO-PIPELINE` - Aucune automatisation, deploy manuel uniquement
- `🐳 DOCKER-AUTOMATED` - Images Docker buildées automatiquement
- `📦 REGISTRY-READY` - Images pushées vers registry automatiquement

#### **🏗️ Architecture & Tech Stack Tags**
- `📦 MONOREPO-COMPLIANT` - Structure conforme MONOREPO-BIBLE Digiclevr
- `🎯 STANDALONE` - Application indépendante, architecture classique
- `⚠️ LEGACY-ARCH` - Architecture obsolète, refactoring nécessaire
- `🔗 MICROSERVICES` - Architecture distribuée, services découplés
- `🌐 API-FIRST` - Design API-first, documentation OpenAPI
- `🔄 API-CONSUMERS` - Consomme APIs externes (OnlyOneAPI, etc.)

#### **🛠️ Technology Stack Tags**
- `⚡ JS-MODERN` - JavaScript/TypeScript moderne (ES2024+)
- `🐍 PYTHON-STACK` - Python/FastAPI/Django stack
- `🎯 REACT-ECOSYSTEM` - React/Next.js/Vite ecosystem
- `📱 MOBILE-READY` - React Native ou PWA mobile-ready
- `🗄️ DB-MODERN` - PostgreSQL + Redis + ORM moderne
- `🔧 LEGACY-TECH` - Technologies obsolètes, migration nécessaire

#### **🔗 Ecosystem Integration Tags**
- `🌟 CLUSTER-NATIVE` - Utilise services cluster BlueOcean (PostgreSQL, Redis, N8n)
- `⚠️ PARTIAL-INTEGRATION` - Intégration partielle avec cluster
- `🔴 ISOLATED` - Aucune intégration écosystème
- `🔄 CROSS-PROJECT-SYNERGY` - Synergie avec autres projets écosystème
- `🎯 ONLYONEAPI-CONSUMER` - Utilise APIs OnlyOneAPI
- `📊 DATA-SHARING` - Partage données avec autres outils internes

#### **💰 Business Potential Tags**
- `🚀 SAAS-READY` - Potentiel SaaS élevé, multi-tenant ready
- `🎯 INTERNAL-TOOL` - Outil interne uniquement, pas de monétisation
- `💡 SAAS-POTENTIAL` - Potentiel SaaS avec adaptations
- `🏢 B2B-MARKET` - Marché B2B identifié et addressable
- `🔄 ECOSYSTEM-SYNERGY` - Synergie business avec autres projets
- `💰 MONETIZATION-ACTIVE` - Monétisation déjà en cours

#### **⚡ Performance & Monitoring Tags**
- `📊 MONITORED` - Monitoring complet (logs, métriques, alertes)
- `⚠️ BASIC-MONITORING` - Monitoring basique, améliorations nécessaires
- `🔴 NO-MONITORING` - Aucun monitoring, angle mort
- `🚀 OPTIMIZED` - Performance optimisée (bundle, cache, CDN)
- `⚠️ PERF-ISSUES` - Problèmes performance identifiés
- `🔄 SCALABLE` - Architecture scalable, auto-scaling ready

#### **🔒 Compliance & Legal Tags**
- `✅ GDPR-COMPLIANT` - Conformité RGPD complète
- `⚠️ GDPR-PARTIAL` - Conformité RGPD partielle, améliorations nécessaires
- `🔴 GDPR-NON-COMPLIANT` - Non-conformité RGPD, audit requis
- `🛡️ SECURITY-AUDIT-OK` - Audit sécurité récent validé
- `⚠️ SECURITY-REVIEW-NEEDED` - Audit sécurité requis
- `📋 LEGAL-VALIDATED` - Validation légale termes et conditions

---

## 🏗️ **ÉCOSYSTÈME OUTILS INTERNES**

### **🎯 Applications Principales**

| Outil | Port | Description | Status | Infrastructure |
|-------|------|-------------|--------|----------------|
| **K-VIBE** | 3028 | Content Generator & Campaign Management | ✅ Production | BlueOcean K8s |
| **KREACH** | 7000-7099 | Customer Reach & Analytics Platform (ex-KONQER) | 🔨 Développement | Local + K8s |
| **NextStep** | 8020-8024 | Workflow Management & Automation | 📋 Planning | K8s Ready |
| **NextGen** | TBD | Domain Monetization Platform (230 domaines) | 💰 Business | Stratégique |
| **Nexia** | Voice | IA Supervisor & Voice Control Interface | 🤖 IA | Orchestration |
| **ENDPOINTS** | 5021-5022 | GitHub Intelligence Mining | 🔍 Analytics | DigitalOcean K8s |
| **BUSINESS-AUTOMATION** | Multi | Agent Orchestration 24/7 | 🤖 Agents | Ecosystem |

### **🎯 Infrastructure Centrale**

```yaml
# DigitalOcean Kubernetes Cluster "BlueOcean"
Cluster: blueocean-k8s
Registry: registry.digitalocean.com/tools-internes

# Services Centralisés
PostgreSQL: postgres-central.platform.svc.cluster.local:5432
Redis: platform-pool-redis-master.platform.svc.cluster.local:6379
N8n: n8n-service.platform.svc.cluster.local:5678

# CI/CD
Build: Kaniko (pas Docker local)
Deploy: GitHub Actions → Registry → K8s
```

---

## 📊 MODÈLE D'ÉTAT DES LIEUX

### **🎯 Audit Technique Systématique**

```markdown
| Outil/Composant | Responsive | Données | MacBook M2 | Env Dev | Security | CI/CD | Architecture | Business | Performance | Compliance | Actions Prioritaires |
|-----------------|------------|---------|------------|---------|----------|-------|--------------|----------|-------------|------------|---------------------|
| K-VIBE Dashboard | ✅ CONFORME | ✅ INTELLIGENTE | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID | ⚠️ AT-RISK | 🔴 NO-PIPELINE | 🔗 MICROSERVICES | 💡 SAAS-POTENTIAL | ⚠️ BASIC-MONITORING | ⚠️ GDPR-PARTIAL | Pipeline + GDPR + Monitoring |
| KREACH Analytics | 🔴 NON-CONFORME | ❌ MOCKÉES | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID | 💀 SINGLE-POINT-FAILURE | 🔴 NO-PIPELINE | 🎯 STANDALONE | 🚀 SAAS-READY | 🔴 NO-MONITORING | 🔴 GDPR-NON-COMPLIANT | URGENT: Backup + CI/CD + Architecture |
| NextStep Workflow | ⚠️ PARTIEL | ⚠️ MIXTE | ⚠️ MOYEN | ☁️ CLUSTER-FULL | ✅ SECURE | 🟡 PARTIAL-PIPELINE | 📦 MONOREPO-COMPLIANT | 🏢 B2B-MARKET | 📊 MONITORED | ✅ GDPR-COMPLIANT | Performance + Tests automatiques |
| Nexia Voice UI | 🔴 NON-CONFORME | ✅ RÉELLES | 🔴 PROBLÉMATIQUE | 🏠 LOCAL-PURE | 🔴 VULNERABLE | 🔴 NO-PIPELINE | ⚠️ LEGACY-ARCH | 🔄 ECOSYSTEM-SYNERGY | 🔴 NO-MONITORING | ⚠️ SECURITY-REVIEW-NEEDED | CRITIQUE: Architecture + Sécurité |
```

### **🏗️ Template Évaluation Dimensions Étendues**

```markdown
| Dimension | Critères d'Évaluation | Tags Disponibles | Score Cible | Impact Business |
|-----------|----------------------|------------------|-------------|------------------|
| **Architecture & Tech Stack** | Modernité, Scalabilité, Conformité MONOREPO-BIBLE | 📦 MONOREPO-COMPLIANT → 🔧 LEGACY-TECH | 85/100 | Vélocité développement |
| **Ecosystem Integration** | Services cluster, Synergie projets, APIs partagées | 🌟 CLUSTER-NATIVE → 🔴 ISOLATED | 80/100 | Coûts infrastructure |
| **Business Potential** | Potentiel SaaS, Marché addressable, Monétisation | 🚀 SAAS-READY → 🎯 INTERNAL-TOOL | 75/100 | ROI & Revenue potential |
| **Performance & Monitoring** | Optimisation, Observabilité, Alertes proactives | 📊 MONITORED → 🔴 NO-MONITORING | 90/100 | Expérience utilisateur |
| **Compliance & Legal** | RGPD, Sécurité, Audit trail, Backup strategy | ✅ GDPR-COMPLIANT → 🔴 GDPR-NON-COMPLIANT | 95/100 | Conformité réglementaire |
| **Dependencies & Debt** | Versions à jour, Vulnérabilités CVE, Refactoring | ⚡ JS-MODERN → 🔧 LEGACY-TECH | 80/100 | Maintenabilité |
```

### **📋 Template de Tags par Page (Outils Internes)**

```typescript
/**
 * 🏷️ [NOM_OUTIL] - [FONCTION]
 * 📱 Responsive: [STATUS] ([détails problèmes])
 * 🗄️ Données: [STATUS] ([source données])
 * 💻 MacBook M2: [STATUS] ([problèmes spécifiques])
 * 🛠️ Env Dev: [STATUS] ([configuration actuelle])
 * 🛡️ Security: [STATUS] ([vulnérabilités critiques])
 * 🚀 CI/CD: [STATUS] ([pipeline automatisation])
 * 🏗️ Architecture: [STATUS] ([tech stack, conformité MONOREPO])
 * 💰 Business: [STATUS] ([potentiel SaaS, monétisation])
 * ⚡ Performance: [STATUS] ([monitoring, optimisation])
 * 🔒 Compliance: [STATUS] ([RGPD, audit sécurité])
 * 🔗 Integration: [STATUS] ([cluster services, synergie écosystème])
 * 📊 Dependencies: [STATUS] ([versions, CVE, debt technique])
 * 🔧 Actions critiques: [liste prioritaire avec timeline]
 */
```

---

## 🗺️ PLAN DE TRAVAIL TYPE

### **Phase 1 : Foundation Responsive (Critical)**
- [ ] **Navigation mobile-first** : Burger menu + breakpoints MacBook M2
- [ ] **Tailwind config** : Breakpoints personnalisés (`macbook-air: 1280px`)
- [ ] **Layout adaptatif** : Grid responsive + spacing intelligent
- [ ] **Port allocation** : Gestion ports par outil (K-VIBE 3028, KREACH 7000-7099, etc.)

### **Phase 2 : Pages Core (High Priority)**
- [ ] **Settings mobile-first** : Formulaires adaptatifs + modularisation
- [ ] **Dashboard responsive** : Cards au lieu de tables fixes
- [ ] **Content Generator** : Wizard progressif mobile-friendly
- [ ] **Analytics views** : Graphiques adaptatifs + données temps réel

### **Phase 3 : Advanced UX (Medium Priority)**
- [ ] **Error boundaries** : Gestion erreurs responsive
- [ ] **Loading states** : Composants loading adaptatifs
- [ ] **Empty states** : États vides mobile-friendly
- [ ] **Voice interface** : Intégration Nexia + Siri Shortcuts

### **Phase 4 : Data Integration (Essential)**
- [ ] **API client robuste** : Retry automatique + fallbacks intelligents
- [ ] **PostgreSQL central** : Migration vers postgres-central.platform
- [ ] **Redis cache** : Intégration platform-pool-redis-master
- [ ] **Real-time sync** : WebSocket ou polling optimisé

---

## 🔧 CONFIGURATIONS TECHNIQUES STANDARDS

### **📱 Breakpoints Tailwind (MacBook M2 Optimized)**

```javascript
// tailwind.config.js - Configuration Outils Internes
module.exports = {
  theme: {
    extend: {
      screens: {
        'macbook-air': '1280px',     // MacBook Air M2 (optimal)
        'macbook-pro': '1440px',     // MacBook Pro M2
        'lg-tight': '1024px',        // Tablets landscape
        'xl-wide': '1536px',         // Large desktops
      },
      spacing: {
        '18': '4.5rem',              // Spacing intermédiaire
        '88': '22rem',               // Large containers
      },
      fontSize: {
        'xxs': '0.625rem',           // Micro text mobile
      },
      colors: {
        // Palette couleurs outils internes
        'kvibe-blue': '#3B82F6',
        'kreach-purple': '#8B5CF6',
        'nextstep-green': '#10B981',
        'nexia-orange': '#F59E0B',
      }
    },
  },
}
```

### **🗄️ API Client Pattern (Infrastructure Centralisée)**

```typescript
// Pattern API client pour outils internes
const CLUSTER_CONFIG = {
  postgres: 'postgres-central.platform.svc.cluster.local:5432',
  redis: 'platform-pool-redis-master.platform.svc.cluster.local:6379',
  n8n: 'n8n-service.platform.svc.cluster.local:5678'
};

const isDev = import.meta.env.DEV;
const ENABLE_FALLBACK = isDev;

function handleApiError(error: any, fallbackData: any, toolName: string) {
  console.warn(`[${toolName}] API failed:`, error.message);
  
  if (ENABLE_FALLBACK) {
    console.info(`[${toolName}] Using enhanced mock data`);
    return fallbackData;
  } else {
    throw new Error(`${toolName} service temporarily unavailable`);
  }
}
```

### **🏷️ Environment Detection Auto (Outils Internes)**

```typescript
// Auto-detection environnement outils internes
const TOOL_ENV = {
  name: process.env.TOOL_NAME || 'unknown',
  port: process.env.PORT || 3000,
  cluster: process.env.CLUSTER_ENV || 'local',
  database: process.env.DATABASE_URL?.includes('platform.svc.cluster.local') ? '☁️ CLUSTER' : '🏠 LOCAL',
  build: process.env.KANIKO_BUILD ? '🐳 KANIKO-READY' : '🏠 LOCAL-BUILD'
};

const ENV_TAGS = {
  dev: TOOL_ENV.cluster === 'local' ? '🔗 LOCAL-HYBRID' : '☁️ CLUSTER-FULL',
  data: TOOL_ENV.database === '☁️ CLUSTER' ? '✅ RÉELLES' : '❌ MOCKÉES',
  build: TOOL_ENV.build
};
```

---

## ✅ CHECKLIST DE VALIDATION OUTILS INTERNES

### **📱 Responsive Design**
- [ ] Navigation mobile avec burger menu (tous outils)
- [ ] Breakpoints MacBook M2 (`1280px`, `1440px`)
- [ ] Touch-friendly (boutons 44px+, spacing approprié)
- [ ] Text scaling adaptatif selon outil
- [ ] Images/charts adaptatifs (KREACH, ENDPOINTS)

### **🗄️ Data Integration**
- [ ] Connexion PostgreSQL central obligatoire
- [ ] Redis cache pour performance
- [ ] API client avec retry automatique
- [ ] Fallbacks intelligents (dev vs prod)
- [ ] Error boundaries responsive

### **💻 MacBook M2 Specific**
- [ ] Interface adaptée 1280px (MacBook Air M2)
- [ ] Navigation compacte mais utilisable
- [ ] Density appropriée par type d'outil
- [ ] Performance optimisée (bundle size)

### **🛠️ Environment Compliance**
- [ ] Variables d'environnement par outil
- [ ] Port allocation respectée (K-VIBE 3028, KREACH 7000+, etc.)
- [ ] Kaniko build configuration
- [ ] GitHub Actions setup Digiclevr

### **🎯 Spécifique Outils Internes**
- [ ] Intégration Nexia (voice control)
- [ ] Cohérence visuelle entre outils
- [ ] Sharing de données entre applications
- [ ] Monitoring centralisé

### **📊 Completion Tracking**
- [ ] Audit des spécifications existantes (features définies vs implémentées)
- [ ] Pourcentage de réalisation par composant/page
- [ ] Identification des gaps fonctionnels critiques
- [ ] Plan de priorisation basé sur completion rate

---

## 🎯 EXEMPLE D'APPLICATION : K-VIBE Dashboard (Outil Interne)

### **État Initial (Avant)**
```
| Composant | Responsive | Données | MacBook M2 | Env Dev | Port | Completion |
|-----------|------------|---------|------------|---------|------|------------|
| Navigation | 🔴 NON-CONFORME | ❌ MOCKÉES | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID | 3028 | 🔴 INITIAL 20% |
| Settings | 🔴 NON-CONFORME | ⚠️ MIXTE | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID | 3028 | 🟠 PARTIEL 45% |
| Leads | 🔴 NON-CONFORME | ❌ MOCKÉES | ⚠️ MOYEN | 🔗 LOCAL-HYBRID | 3028 | 🟠 PARTIEL 50% |
| ContentGen | 🔴 NON-CONFORME | ⚠️ FALLBACK | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID | 3028 | 🟠 PARTIEL 40% |
```

### **État Final (Après)**
```
| Composant | Responsive | Données | MacBook M2 | Env Dev | Port | Completion |
|-----------|------------|---------|------------|---------|------|------------|
| Navigation | ✅ CONFORME | ✅ RÉELLES | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID | 3028 | 🟢 COMPLET 100% |
| Settings | ✅ CONFORME | ✅ INTELLIGENTE | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID | 3028 | 🟢 COMPLET 95% |
| Leads | ✅ CONFORME | ✅ AVEC FALLBACK | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID | 3028 | 🟢 COMPLET 100% |
| ContentGen | ✅ CONFORME | ✅ INTÉGRÉE | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID | 3028 | 🟢 COMPLET 100% |
```

**Résultat :** Dashboard K-VIBE 100% production-ready avec URL http://localhost:3028

---

## 📚 RESSOURCES ET RÉFÉRENCES

### **🔗 Liens Techniques Outils Internes**
- **DigitalOcean BlueOcean Cluster** : Infrastructure centrale guide
- **PostgreSQL Central** : postgres-central.platform.svc.cluster.local
- **Redis Cache** : platform-pool-redis-master.platform.svc.cluster.local
- **Kaniko Build** : Build sans Docker local
- **Tailwind MacBook M2** : Responsive design methodology
- **Nexia Integration** : Voice control + IA supervisor

### **📁 Templates Réutilisables Outils Internes**
- `ErrorBoundary.tsx` : Composant gestion erreurs responsive
- `LoadingState.tsx` : États de chargement adaptatifs  
- `useApiData.ts` : Hook données avec fallback intelligent + PostgreSQL central
- `tailwind.config.js` : Configuration breakpoints MacBook M2 + palette couleurs outils
- `nexia-integration.ts` : Interface voice control standard

### **🎯 Spécifications par Outil**
- **K-VIBE** : Content generation + campaign management
- **KREACH** : Market intelligence + analytics (ex-KONQER)
- **NextStep** : Workflow automation + business orchestration
- **NextGen** : Domain monetization (230 domaines, €2.3M target)
- **Nexia** : IA supervisor + voice interface (iPhone → Siri → ChatGPT Voice)
- **ENDPOINTS** : GitHub intelligence mining + opportunities
- **BUSINESS-AUTOMATION** : 24/7 agent orchestration + cockpit dashboard

---

**🎯 Ce template garantit une approche systématique et reproductible pour tous nos outils internes, avec un focus particulier sur l'excellence responsive, l'intégration PostgreSQL centrale, et la cohérence écosystème.**

---

*Tools Internes Development Prompt Template v2.0.0 | Écosystème BlueOcean | 2025-09-14*