# 🏭 Architecture Visualizer - Usine à Sites d'Affiliation

Application React/Node.js interactive pour visualiser dynamiquement l'architecture de votre usine à sites d'affiliation (230 domaines).

## ✨ Fonctionnalités

### 🎨 Visualisation Interactive
- **Vue multicouches** : Navigation par niveau d'architecture
- **Détails au survol** : Informations techniques + métriques
- **Légende dynamique** : Codes couleur par type de composant
- **Zoom/pan** : Navigation fluide dans l'architecture

### 🔄 Simulation de Flux
- **Animation des pipelines** : Visualisation du flux de contenu
- **Flux temps réel** : Pipeline, repurposing, monétisation
- **Indicateurs de performance** : Statut des composants
- **Métriques live** : Revenus, trafic, production

### 📊 Dashboard Temps Réel
- **Pipeline Production** : Articles en cours, queue, temps moyen
- **Revenus** : Affiliation, location, newsletter, publicité
- **Trafic** : Visiteurs actifs, pages vues, conversions
- **Santé système** : Statut opérationnel global

## 🚀 Installation

```bash
# Cloner le projet
git clone <repo-url>
cd architecture-visualizer

# Installer les dépendances
npm run install-all

# Démarrer l'application
npm run dev
```

## 🏗️ Architecture Technique

### Backend (Node.js + Express)
- **API REST** : Données d'architecture + métriques temps réel
- **Simulation** : Métriques simulées pour démonstration
- **CORS** : Configuration pour développement local

### Frontend (React)
- **Composants modulaires** : LayerView, ComponentDetail, FlowAnimation
- **State management** : React hooks (useState, useEffect)
- **CSS moderne** : Animations, gradients, responsive design
- **SVG animations** : Flux dynamiques entre composants

## 📋 Structure des Données

### Couches d'Architecture
1. **Agents IA** : Veille, Brief, Rédaction, QA
2. **Hub Central** : Strapi Headless, Directus
3. **Orchestration** : n8n Workflows, LangGraph
4. **Génération Sites** : Next.js SSG, Kinsta, Cloudflare
5. **Monétisation** : Affiliation, Location, Newsletter, Publicité
6. **Social & Email** : Repurposing, Listmonk, Shlink, MinIO
7. **Analytics** : PostHog, Plausible, Grafana, Infrastructure

### Types de Flux
- **Pipeline Principal** : Idéation → Publication (bleu)
- **Repurposing** : Contenu → Réseaux sociaux (orange)
- **Email Marketing** : Newsletter → Giveaways (vert)
- **Monétisation** : Sites → Revenus (doré)

## 🎛️ Utilisation

### Navigation
- **Clic sur couche** : Sélection/déselection
- **Clic sur composant** : Détails complets
- **Toggle flux** : Afficher/masquer animations
- **Vue globale** : Retour à la vue d'ensemble

### Panneau Latéral
- **Métriques temps réel** : Mise à jour toutes les 5s
- **Légende interactive** : Types de composants + flux
- **Détails composant** : Popup avec métriques complètes

## 🔧 Configuration

### Variables d'Environnement
```bash
# Backend
PORT=5000

# Frontend (Create React App)
REACT_APP_API_URL=http://localhost:5000
```

### Ports
- **Backend API** : http://localhost:5000
- **Frontend React** : http://localhost:3000

## 📈 Métriques Simulées

### Pipeline Production
- Articles en cours : 5-15
- Queue size : 20-70
- Temps moyen : 2-7 minutes

### Revenus Quotidiens
- Total : 500-1500€
- Affiliation : 300-900€ (60%)
- Location : 100-300€ (25%)
- Newsletter : 50-150€ (10%)
- Publicité : 20-80€ (5%)

### Trafic
- Visiteurs actifs : 200-700
- Pages vues : 5k-15k
- Conversions : 20-70

## 🎨 Personnalisation

### Couleurs par Type
- **Agents IA** : Bleu (#2196F3)
- **CMS/Data** : Violet (#9C27B0)
- **Infrastructure** : Vert (#4CAF50)
- **Sécurité** : Rose (#E91E63)
- **Monétisation** : Orange (#FF9800)
- **Social/Email** : Vert lime (#8BC34A)
- **Analytics** : Turquoise (#00BCD4)

### States des Composants
- **🟢 En ligne** : Fonctionnel (99.9% uptime)
- **🟡 Avertissement** : Performance dégradée
- **🔴 Erreur** : Dysfonctionnement

## 📱 Responsive Design

- **Desktop** : Vue complète avec sidebar
- **Tablet** : Sidebar en bas, navigation adaptée
- **Mobile** : Vue empilée, contrôles simplifiés

## 🛠️ Développement

### Scripts Disponibles
```bash
npm run dev         # Dev mode (backend + frontend)
npm run server      # Backend uniquement
npm run client      # Frontend uniquement (depuis /client)
npm run build       # Build production
```

### Structure des Fichiers
```
architecture-visualizer/
├── server/
│   └── server.js           # API Express
├── client/
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── App.js         # Composant principal
│   │   └── App.css        # Styles globaux
│   └── package.json
├── package.json           # Scripts + dépendances
└── README.md
```

## 🔮 Fonctionnalités Futures

- **Intégration APIs réelles** : Remplacer simulation par vraies métriques
- **Filtres avancés** : Par type, statut, performance
- **Export PDF/PNG** : Capture d'écran de l'architecture
- **Mode plein écran** : Pour présentations
- **Thèmes** : Mode sombre, couleurs personnalisées
- **Historique** : Évolution des métriques dans le temps

## 📞 Support

Pour toute question ou amélioration :
- 📧 Contact : [votre-email]
- 🐛 Issues : [repo-issues]
- 📖 Docs : [documentation-url]

---

**🎯 Objectif** : Visualiser et monitorer efficacement une architecture complexe de 230 domaines avec automatisation IA, flux de contenus et monétisation multi-source.

**🛡️ Sécurité** : Données simulées pour démonstration, aucune donnée sensible exposée.