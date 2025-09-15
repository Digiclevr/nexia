# 🎙️ NEXIA Voice Interface

**Interface Vocale Progressive** - Contrôle vocal de l'écosystème NEXIA

## 🎯 Phases d'Évolution

### Phase 1 : Siri Shortcuts (ACTUEL)
- **Configuration Siri shortcuts** : Commandes vocales de base
- **Interface avec supervisor API** : Connexion aux endpoints NEXIA
- **Commandes essentielles** : Status, déploiement, monitoring

### Phase 2 : PWA Voice (3 mois)
- **Progressive Web App** : Interface web avec reconnaissance vocale
- **Speech recognition** : Intégration Web Speech API
- **Voice synthesis** : Réponses vocales naturelles

### Phase 3 : ChatGPT-like (6 mois)
- **Interface conversationnelle** : Dialogue naturel
- **Context multi-tours** : Mémoire de conversation
- **Voice interaction** : Expérience ChatGPT Voice native

## 🗣️ Commandes Siri Disponibles

### Monitoring
- **"Nexia, status global"** → Status de tous les écosystèmes
- **"Nexia, état BlueOcean"** → Status spécifique BlueOcean
- **"Nexia, santé OnlyOneAPI"** → Health check OnlyOneAPI
- **"Nexia, alertes actives"** → Liste des alertes en cours

### Contrôle
- **"Nexia, déploie BlueOcean"** → Déclenchement déploiement
- **"Nexia, redémarre services"** → Restart des services
- **"Nexia, mode maintenance"** → Activation mode maintenance

### Information
- **"Nexia, rapport quotidien"** → Résumé jour
- **"Nexia, métriques performance"** → KPIs principaux
- **"Nexia, dernières alertes"** → Historique récent

## 📱 Configuration Siri Shortcuts

### 1. URLs API NEXIA
```
Base URL: http://localhost:7014/api
Health: /health
Status: /ecosystems/status
Deploy: /control/deploy
```

### 2. Shortcuts à Créer

#### "Status Global NEXIA"
```
URL: GET http://localhost:7014/api/ecosystems/status
Response: Spoken summary of ecosystem status
```

#### "Déploie BlueOcean"
```
URL: POST http://localhost:7014/api/control/deploy
Body: {"ecosystem":"blueocean","action":"deploy"}
Response: Confirmation of deployment start
```

#### "Health Check NEXIA"
```
URL: GET http://localhost:7014/api/health
Response: Overall supervisor health status
```

## 🔧 Setup Instructions

### Étape 1 : Ouvrir Raccourcis iOS
1. Ouvrir l'app **Raccourcis** sur iPhone
2. Créer nouveau raccourci
3. Ajouter action **"Obtenir le contenu de l'URL"**

### Étape 2 : Configuration URL
1. URL : `http://localhost:7014/api/health`
2. Méthode : GET
3. Headers : Content-Type: application/json

### Étape 3 : Traitement Réponse
1. Ajouter action **"Obtenir la valeur du dictionnaire"**
2. Clé : `status`
3. Ajouter action **"Énoncer le texte"**

### Étape 4 : Phrase d'Activation
1. Enregistrer phrase : "Nexia, status global"
2. Tester la commande vocale

## 🎛️ API Endpoints Utilisés

### Health Check
```bash
curl http://localhost:7014/api/health
```

### Status Écosystèmes
```bash
curl http://localhost:7014/api/ecosystems/status
```

### Déploiement
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"ecosystem":"blueocean","action":"deploy"}' \
  http://localhost:7014/api/control/deploy
```

## 📋 Templates Shortcuts

### Template 1 : Status Check
```
Action 1: Obtenir contenu URL
- URL: http://localhost:7014/api/health
- Méthode: GET

Action 2: Obtenir valeur dictionnaire
- Input: Contenu de Action 1
- Clé: status

Action 3: Énoncer texte
- Texte: "NEXIA est [status]"
```

### Template 2 : Deployment
```
Action 1: Obtenir contenu URL
- URL: http://localhost:7014/api/control/deploy
- Méthode: POST
- Headers: Content-Type: application/json
- Body: {"ecosystem":"blueocean","action":"deploy"}

Action 2: Obtenir valeur dictionnaire
- Input: Contenu de Action 1
- Clé: message

Action 3: Énoncer texte
- Texte: [message]
```

## 🚀 Utilisation

### iPhone/iPad
1. Dire "Dis Siri, Nexia status global"
2. Siri exécute le raccourci
3. Écouter la réponse vocale

### Apple Watch
1. Lever le poignet
2. Dire "Nexia status global"
3. Écouter la réponse

### CarPlay
1. Appuyer bouton vocal
2. Dire commande NEXIA
3. Réponse audio dans véhicule

## 📊 Avantages Phase 1

### ✅ Implémentation Rapide
- **0 code** : Utilise Siri Shortcuts natif
- **0 déploiement** : Fonctionne immédiatement
- **0 maintenance** : Système Apple stable

### 🎯 TDAH-Friendly
- **Vocal naturel** : Pas d'interface à naviguer
- **Réponse immédiate** : Feedback instant
- **Context switching** : Pas de disruption

### 🔄 Évolutivité
- **Base solide** : APIs déjà testées
- **Migration facile** : Vers Phase 2 PWA
- **Apprentissage** : User patterns identifiés

## 🔮 Roadmap Évolution

### Mois 1-2 : Phase 1 Siri
- [x] Configuration shortcuts de base
- [x] Commandes essentielles
- [x] Tests utilisateur

### Mois 3-5 : Phase 2 PWA
- [ ] Interface web vocale
- [ ] Speech recognition avancée
- [ ] Réponses contextuelles

### Mois 6-12 : Phase 3 ChatGPT
- [ ] IA conversationnelle
- [ ] Mémoire de session
- [ ] Voice interaction naturelle

---

**Version** : 1.0.0 (Phase 1)  
**Statut** : ✅ Prêt pour Configuration  
**Support** : iPhone, iPad, Apple Watch, CarPlay