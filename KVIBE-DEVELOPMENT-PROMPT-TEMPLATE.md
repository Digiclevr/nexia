# 🚀 TEMPLATE PROMPT DE DÉVELOPPEMENT - OUTILS INTERNES

**Version :** 2.0.0  
**Date :** 2025-09-14  
**Source :** REX K-VIBE Dashboard Responsive + API Integration  
**Applicabilité :** Tous outils internes (K-VIBE, KREACH, NextStep, NextGen, etc.)

---

## 📋 PROMPT STANDARD DE DÉVELOPPEMENT

### 🎯 **DEMANDE INITIALE TYPE**

```
Le site doit être full responsive design (en particulier pour MacBook M2) et nous ne devons avoir que des données réelles. 

Merci de tagguer toutes les pages en précisant :
- Statut responsive design 
- Statut des données
- Résolution d'écran cible
- Environnement de développement

Merci de faire un état des lieux détaillé puis établir un plan de travail.
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

#### **💻 Screen Resolution Tags**
- `📱 MOBILE` - 320px-768px (iPhone, Android)
- `📟 TABLET` - 768px-1024px (iPad, Android tablets)
- `💻 MacBook M2` - 1280px-1440px (MacBook Air/Pro M2)
- `🖥️ DESKTOP` - 1440px+ (External monitors, iMac)
- `🔄 ADAPTIVE` - Tous écrans avec breakpoints intelligents

#### **🛠️ Development Environment Tags**
- `🏠 LOCAL-PURE` - Développement 100% local (API mock, DB locale)
- `🔗 LOCAL-HYBRID` - Local + DB cluster (port-forward K8s)
- `☁️ CLUSTER-FULL` - 100% cluster Kubernetes (staging/prod)
- `📝 GITHUB-SYNCED` - Code synchronisé GitHub Actions
- `🐳 KANIKO-READY` - Images Docker buildées automatiquement

---

## 📊 MODÈLE D'ÉTAT DES LIEUX

### **🎯 Audit Technique Systématique**

```markdown
| Composant/Page | Responsive | Données | MacBook M2 | Env Dev | Actions Requises |
|----------------|------------|---------|------------|---------|------------------|
| Navigation     | 🔴 NON-CONFORME | ✅ RÉELLES | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID | Burger menu + breakpoints |
| Dashboard      | ⚠️ PARTIEL | ❌ MOCKÉES | ⚠️ MOYEN | 🏠 LOCAL-PURE | Mobile-first + API réelle |
| Settings       | 🔴 NON-CONFORME | ⚠️ MIXTE | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID | Refonte complète |
```

### **📋 Template de Tags par Page**

```typescript
/**
 * 🏷️ [NOM_COMPOSANT] PAGE/COMPONENT
 * 📱 Responsive: [STATUS] ([détails problèmes])
 * 🗄️ Données: [STATUS] ([source données])
 * 💻 MacBook M2: [STATUS] ([problèmes spécifiques])
 * 🛠️ Env Dev: [STATUS] ([configuration actuelle])
 * 🔧 Actions requises: [liste prioritaire]
 */
```

---

## 🗺️ PLAN DE TRAVAIL TYPE

### **Phase 1 : Foundation Responsive (Critical)**
- [ ] **Navigation mobile-first** : Burger menu + breakpoints MacBook M2
- [ ] **Tailwind config** : Breakpoints personnalisés (`macbook-air: 1280px`)
- [ ] **Layout adaptatif** : Grid responsive + spacing intelligent

### **Phase 2 : Pages Core (High Priority)**
- [ ] **Settings mobile-first** : Formulaires adaptatifs + modularisation
- [ ] **Dashboard responsive** : Cards au lieu de tables fixes
- [ ] **Content Generator** : Wizard progressif mobile-friendly

### **Phase 3 : Advanced UX (Medium Priority)**
- [ ] **Error boundaries** : Gestion erreurs responsive
- [ ] **Loading states** : Composants loading adaptatifs
- [ ] **Empty states** : États vides mobile-friendly

### **Phase 4 : Data Integration (Essential)**
- [ ] **API client robuste** : Retry automatique + fallbacks intelligents
- [ ] **Hooks données** : Gestion erreurs + loading states
- [ ] **Real-time sync** : WebSocket ou polling optimisé

---

## 🔧 CONFIGURATIONS TECHNIQUES STANDARDS

### **📱 Breakpoints Tailwind (MacBook M2 Optimized)**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'macbook-air': '1280px',     // MacBook Air M2
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
    },
  },
}
```

### **🗄️ API Client Pattern (Fallback Intelligent)**

```typescript
// Pattern de gestion d'erreurs intelligent
const isDev = import.meta.env.DEV;
const ENABLE_FALLBACK = isDev;

function handleApiError(error: any, fallbackData: any, entityName: string) {
  console.warn(`[API Warning] ${entityName} failed:`, error.message);
  
  if (ENABLE_FALLBACK) {
    console.info(`[Fallback] Using enhanced mock for ${entityName}`);
    return fallbackData;
  } else {
    throw new Error(`${entityName} service temporarily unavailable`);
  }
}
```

### **🏷️ Environment Detection Auto**

```typescript
// Auto-detection environnement
const ENV_TAGS = {
  dev: process.env.NODE_ENV === 'development' ? '🏠 LOCAL-PURE' : '☁️ CLUSTER-FULL',
  api: process.env.API_URL?.includes('localhost') ? '🔗 LOCAL-HYBRID' : '☁️ CLUSTER-FULL',
  github: process.env.GITHUB_ACTIONS ? '📝 GITHUB-SYNCED' : '🏠 LOCAL-DEV',
  docker: process.env.DOCKER_ENV ? '🐳 KANIKO-READY' : '🏠 LOCAL-BUILD'
};
```

---

## ✅ CHECKLIST DE VALIDATION

### **📱 Responsive Design**
- [ ] Navigation mobile avec burger menu
- [ ] Breakpoints MacBook M2 (`1280px`, `1440px`)
- [ ] Touch-friendly (boutons 44px+, spacing approprié)
- [ ] Text scaling (responsive font sizes)
- [ ] Images adaptatives (responsive, optimisées)

### **🗄️ Data Integration**
- [ ] API client avec retry automatique
- [ ] Fallbacks intelligents (dev vs prod)
- [ ] Loading states adaptatifs
- [ ] Error boundaries responsive
- [ ] Real-time updates si applicable

### **💻 MacBook M2 Specific**
- [ ] Interface adaptée 1280px (MacBook Air M2)
- [ ] Navigation compacte mais utilisable
- [ ] Density appropriée (ni trop sparse, ni trop dense)
- [ ] Performance optimisée (bundle size, images)

### **🛠️ Environment Compliance**
- [ ] Variables d'environnement configurées
- [ ] URLs API correctes par environnement
- [ ] Docker configuration si applicable
- [ ] GitHub Actions setup si nécessaire

---

## 🎯 EXEMPLE D'APPLICATION : K-VIBE Dashboard

### **État Initial (Avant)**
```
| Composant | Responsive | Données | MacBook M2 | Env Dev |
|-----------|------------|---------|------------|---------|
| Navigation | 🔴 NON-CONFORME | ❌ MOCKÉES | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID |
| Settings | 🔴 NON-CONFORME | ⚠️ MIXTE | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID |
| Leads | 🔴 NON-CONFORME | ❌ MOCKÉES | ⚠️ MOYEN | 🔗 LOCAL-HYBRID |
| ContentGen | 🔴 NON-CONFORME | ⚠️ FALLBACK | 🔴 PROBLÉMATIQUE | 🔗 LOCAL-HYBRID |
```

### **État Final (Après)**
```
| Composant | Responsive | Données | MacBook M2 | Env Dev |
|-----------|------------|---------|------------|---------|
| Navigation | ✅ CONFORME | ✅ RÉELLES | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID |
| Settings | ✅ CONFORME | ✅ INTELLIGENTE | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID |
| Leads | ✅ CONFORME | ✅ AVEC FALLBACK | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID |
| ContentGen | ✅ CONFORME | ✅ INTÉGRÉE | ✅ OPTIMISÉ | 🔗 LOCAL-HYBRID |
```

---

## 📚 RESSOURCES ET RÉFÉRENCES

### **🔗 Liens Techniques**
- **Tailwind Responsive Design** : https://tailwindcss.com/docs/responsive-design
- **MacBook M2 Specifications** : Screen resolutions et density guidelines
- **API Error Handling** : Patterns retry et fallback intelligents
- **Mobile-First Design** : Progressive enhancement methodology

### **📁 Templates Réutilisables**
- `ErrorBoundary.tsx` : Composant gestion erreurs responsive
- `LoadingState.tsx` : États de chargement adaptatifs
- `useApiData.ts` : Hook données avec fallback intelligent
- `tailwind.config.js` : Configuration breakpoints MacBook M2

---

**🎯 Ce template garantit une approche systématique et reproductible pour tous les projets OnlyOneAPI, avec un focus particulier sur l'excellence responsive et l'intégration de données robuste.**

---

*KVIBE Development Prompt Template v2.0.0 | OnlyOneAPI Ecosystem | 2025-09-14*