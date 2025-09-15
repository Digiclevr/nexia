# 📱 Installation Siri Shortcuts NEXIA

**Guide Step-by-Step** - Configuration interface vocale NEXIA

## 🎯 Prérequis

### ✅ Système
- iPhone/iPad iOS 13+ ou macOS Monterey+
- App **Raccourcis** installée
- NEXIA Supervisor fonctionnel (port 7014)

### ✅ Réseau
- iPhone et Mac sur même réseau WiFi
- NEXIA Supervisor accessible via `http://localhost:7014`

## 📋 Installation Shortcuts

### 1️⃣ "NEXIA Status Global"

#### Étapes Création
1. **Ouvrir Raccourcis** → Nouvel automatisme
2. **Ajouter Action** → "Obtenir le contenu de l'URL"
   - URL : `http://localhost:7014/api/ecosystems/status`
   - Méthode : GET
3. **Ajouter Action** → "Obtenir la valeur du dictionnaire"
   - Dictionnaire : Contenu de l'URL
   - Clé : `summary`
4. **Ajouter Action** → "Obtenir la valeur du dictionnaire" 
   - Dictionnaire : Résultat précédent
   - Clé : `total`
5. **Ajouter Action** → "Énoncer le texte"
   - Texte : "NEXIA supervise [total] écosystèmes"

#### Configuration
- **Nom** : "NEXIA Status Global"
- **Phrase** : "Nexia status global"
- **Icône** : 📊
- **Utiliser avec Siri** : ✅ Activé

### 2️⃣ "NEXIA Health Check"

#### Étapes Création
1. **Ouvrir Raccourcis** → Nouvel automatisme
2. **Ajouter Action** → "Obtenir le contenu de l'URL"
   - URL : `http://localhost:7014/api/health`
   - Méthode : GET
3. **Ajouter Action** → "Obtenir la valeur du dictionnaire"
   - Dictionnaire : Contenu de l'URL
   - Clé : `status`
4. **Ajouter Action** → "Énoncer le texte"
   - Texte : "NEXIA Supervisor est [status]"

#### Configuration
- **Nom** : "NEXIA Health Check"
- **Phrase** : "Nexia health check"
- **Icône** : 🏥
- **Utiliser avec Siri** : ✅ Activé

### 3️⃣ "NEXIA Deploy BlueOcean"

#### Étapes Création
1. **Ouvrir Raccourcis** → Nouvel automatisme
2. **Ajouter Action** → "Demander l'entrée"
   - Message : "Confirmer déploiement BlueOcean ?"
   - Type : Choix
   - Options : "Oui", "Non"
3. **Ajouter Action** → "Si"
   - Condition : Entrée fournie = "Oui"
4. **Dans le Si** → "Obtenir le contenu de l'URL"
   - URL : `http://localhost:7014/api/control/deploy`
   - Méthode : POST
   - Headers : Content-Type: application/json
   - Corps de la requête : `{"ecosystem":"blueocean","action":"deploy"}`
5. **Ajouter Action** → "Obtenir la valeur du dictionnaire"
   - Clé : `message`
6. **Ajouter Action** → "Énoncer le texte"
   - Texte : [message]

#### Configuration
- **Nom** : "NEXIA Deploy BlueOcean"
- **Phrase** : "Nexia déploie BlueOcean"
- **Icône** : 🚀
- **Utiliser avec Siri** : ✅ Activé

## 🧪 Test des Commandes

### Test 1 : Status Global
```
Utilisateur : "Dis Siri, Nexia status global"
Siri : "NEXIA supervise 4 écosystèmes"
```

### Test 2 : Health Check
```
Utilisateur : "Dis Siri, Nexia health check"
Siri : "NEXIA Supervisor est healthy"
```

### Test 3 : Déploiement
```
Utilisateur : "Dis Siri, Nexia déploie BlueOcean"
Siri : "Confirmer déploiement BlueOcean ?"
Utilisateur : "Oui"
Siri : "deploy initiated for blueocean"
```

## 🔧 Troubleshooting

### ❌ "Impossible de se connecter"
- Vérifier que NEXIA Supervisor fonctionne : `curl http://localhost:7014/api/health`
- Vérifier même réseau WiFi iPhone/Mac
- Redémarrer app Raccourcis

### ❌ "Siri ne reconnaît pas"
- Ré-enregistrer la phrase d'activation
- Parler clairement et distinctement
- Essayer variations : "Hey Siri, Nexia status"

### ❌ "Réponse incompréhensible"
- Vérifier format JSON retourné par API
- Tester URL directement dans navigateur
- Vérifier clés dictionnaire

## 📱 Utilisation Avancée

### Apple Watch
1. Lever poignet → Siri automatique
2. Dire commande NEXIA
3. Écouter réponse au poignet

### CarPlay
1. Appuyer bouton vocal volant
2. Dire commande NEXIA
3. Réponse audio véhicule

### Widgets iPhone
1. Ajouter widget Raccourcis
2. Sélectionner shortcuts NEXIA
3. Accès rapide depuis écran d'accueil

## 🎯 Optimisations

### Performance
- **Cache local** : Stocker dernière réponse (shortcuts avancés)
- **Timeout** : Définir délai max requête
- **Retry** : Nouvelle tentative si échec

### UX TDAH-Friendly
- **Réponses courtes** : Maximum 10 secondes audio
- **Confirmations** : Actions critiques seulement
- **Feedback immédiat** : "En cours..." puis résultat

### Sécurité
- **Actions sensibles** : Confirmation obligatoire
- **Logs** : Traçabilité commandes vocales
- **Restrictions** : Certaines actions nécessitent déverrouillage

---

**Status** : ✅ Phase 1 Configurée  
**Commandes** : 3 shortcuts de base  
**Support** : iPhone, iPad, Apple Watch, CarPlay