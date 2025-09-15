# CHANGELOG - Pilot Dashboard Business Plan Challenge

**Format**: Basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
**Versioning**: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

## [1.2.0] - 2025-09-04

### Added
- **Reddit Auto-Tracker System**: Récupération automatique des métriques Reddit via JSON feed
  - Script `/kvibe-onlyoneapi/scripts/reddit-auto-tracker.js` 
  - Support fetch automatique upvotes, comments, engagement rate
  - Analyse de tendance et prédictions 24h
  - Intégration avec tracking file existant
- **Dashboard Scrollbars**: Barres de défilement pour le tableau Media Timing
  - Scroll vertical (max-height: 70vh) pour voir tous les posts
  - Scroll horizontal pour toutes les colonnes
  - Styled scrollbars avec couleurs OnlyOneAPI
- **Lead Generation Metrics**: Données complètes par plateforme/persona/timezone
  - Reddit, LinkedIn, Twitter, Discord, Product Hunt
  - Métriques: reach, leads, conversion rate, revenue estimate
  - Support 3 timezones (EST/CST/PST) et 3 personas

### Fixed
- **getLeadPotential Error**: Erreur JavaScript "Can't find variable: getLeadPotential" corrigée
  - Fonction définie correctement dans le scope du composant
  - Intégration avec getAllDailyActions() fonctionnelle
- **Frontend/Backend Connection**: Dashboard pilot complètement opérationnel
  - Frontend: http://localhost:5010 ✅
  - Backend: http://localhost:5011 ✅
  - API endpoints et Socket.IO connectés

### Changed
- **Media Timing Strategy**: Évolution vers multi-timezone 24/7
  - De 16 actions → 30+ actions quotidiennes
  - Couverture EST/CST/PST optimisée
  - Focus timeRecovered pour développeurs
- **Reddit Content Strategy**: Application frameworks STEEPS + HORMOZI
  - Score viral optimisé (98/100 pour message final)
  - Anti-commercial approach pour r/SideProject
  - Focus sur transformations personnelles vs pitch produit

## [1.1.0] - 2025-09-03

### Added
- **K-VIBE Content Generator**: Interface complète pour génération de contenu viral
  - Support multi-plateformes (Reddit, LinkedIn, Twitter, etc.)
  - Sélection personas (Solo Developers, Startup Teams, CTOs/Founders)  
  - Intégration API K-VIBE backend (port 5004)
- **Multi-Timezone Strategy**: Planning coordonné EST/CST/PST
  - Horaires optimaux par timezone et audience
  - Calendrier de publication 24/7
  - Sweet spots identifiés par plateforme

### Fixed
- **K-VIBE Dashboard**: Content Generator page vide corrigée
  - UI complete implémentée (lignes 658-665 étaient commentées)
  - Configuration API proxy 3020 → 5004
  - PostgreSQL backend fonctionnel

## [1.0.0] - 2025-09-02

### Added
- **Pilot Dashboard Initial**: Dashboard de coordination Business Plan Challenge
  - Frontend React (port 5010)
  - Backend Node.js + SQLite (port 5011) 
  - 7 activités commerciales trackées
  - Métriques temps réel avec Socket.IO
- **Business Plan Challenge Setup**: Structure complète 7 jours
  - Objectif: €5K-€10K cash immédiat
  - 7 activités prioritaires implémentées
  - KPIs et métriques de suivi configurés

---

## Types de Changements

- **Added**: Nouvelles fonctionnalités
- **Changed**: Modifications de fonctionnalités existantes  
- **Deprecated**: Fonctionnalités obsolètes (à supprimer)
- **Removed**: Fonctionnalités supprimées
- **Fixed**: Corrections de bugs
- **Security**: Améliorations de sécurité

## Convention de Commit

```
type(scope): description courte

- feat: nouvelle fonctionnalité
- fix: correction de bug  
- docs: documentation
- style: formatting, pas de changement code
- refactor: refactoring sans changement fonctionnel
- test: ajout/modification tests
- chore: maintenance (deps, config)
```

## Règles de Versioning

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (x.Y.0): Nouvelles fonctionnalités backwards-compatible  
- **PATCH** (x.y.Z): Bug fixes backwards-compatible

---

**Maintenu par**: Claude Code Session  
**Dernière mise à jour**: 4 septembre 2025, 22:10 GMT+1

---

*CHANGELOG.md | 2025-09-07*
