# Guide d'utilisation de Nexia

## 🚀 Installation et lancement

### Prérequis
- Python 3.11+ avec Poetry
- Node.js 20+ avec pnpm
- Accès aux bases de données sur le node-pool platform
- Au moins une clé API (OpenAI, Anthropic, etc.)

### Installation locale

1. **Cloner et installer les dépendances**
```bash
cd /Users/ludovicpilet/Documents/blueocean.nosync/nextstep/nexia
./install.sh
```

2. **Configurer l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos clés API et configurations
```

3. **Lancer Nexia**
```bash
./start-nexia.sh
```

### Déploiement sur le cluster

```bash
# Build et push des images Docker
docker build -t nexia/ai-core:latest services/ai-core/
docker build -t nexia/frontend:latest apps/web/

# Déployer sur Kubernetes
./deploy.sh
```

## 💬 Utilisation de Nexia

### Les 3 modes de personnalité

#### 🧠 Focus Guardian (TDAH)
- **Activation** : Sélectionner dans le menu ou dire "Active le mode focus"
- **Fonctionnalités** :
  - Protection contre les distractions
  - Parking automatique des idées hors-sujet
  - Time-boxing et rappels
  - Suivi du temps de concentration

**Exemple d'utilisation** :
```
Vous: J'ai besoin de me concentrer sur le rapport financier pendant 45 minutes
Nexia: Mode Focus Guardian activé ! Je vais protéger votre concentration pendant 45 minutes. 
        Objectif : Rapport financier. Je parquerai automatiquement toute idée non liée.
```

#### 💎 Opportunity Hunter (Business)
- **Activation** : Sélectionner dans le menu ou dire "Mode chasseur d'opportunités"
- **Fonctionnalités** :
  - Analyse de marché en temps réel
  - Détection de besoins non satisfaits
  - Suggestions de positionnement
  - Connexions entre idées business

**Exemple d'utilisation** :
```
Vous: J'ai remarqué que beaucoup d'entrepreneurs galèrent avec la gestion du temps
Nexia: Excellente observation ! Pain point identifié. Analysons le marché :
        - Taille : 5M+ entrepreneurs TDAH dans le monde
        - Solutions existantes : limitées et non spécialisées
        - Opportunité : Assistant IA spécialisé TDAH (wait... 🤔)
```

#### 🤔 Socratic Challenger (Réflexion)
- **Activation** : Sélectionner dans le menu ou dire "Challenge mon idée"
- **Fonctionnalités** :
  - Questions challengeantes progressives
  - Amplification 10x des concepts
  - Identification des angles morts
  - Validation rigoureuse

**Exemple d'utilisation** :
```
Vous: Je veux créer une app de todo list
Nexia: Intéressant. Mais pourquoi une AUTRE app de todo ? 
        - Qu'est-ce qui la rendrait 10x meilleure ?
        - Quel problème SPÉCIFIQUE résout-elle que les autres ignorent ?
        - Et si au lieu de gérer des tâches, elle gérait l'énergie ?
```

### 📊 Dashboard

Le dashboard affiche :
- **Temps de focus** : Votre concentration cumulée
- **Idées parkées** : Idées sauvegardées automatiquement
- **Interruptions bloquées** : Distractions évitées
- **Graphique de productivité** : Votre performance dans le temps

### 💡 Gestion des idées

#### Parking automatique
Quand vous êtes en mode Focus et qu'une idée hors-sujet arrive :
```
Vous: Oh tiens, il faudrait que je crée un podcast sur...
Nexia: 💡 Idée intéressante ! Je la parque pour plus tard. 
        Revenons à votre rapport financier.
```

#### Révision des idées
- Accédez à l'onglet "Idées"
- Filtrez par statut : Parkées, Actives, Complétées
- Activez les idées pertinentes
- Connectez les idées entre elles

### ⚙️ Configuration

#### Clés API
Dans Paramètres, configurez vos clés :
- **OpenAI** : Pour GPT-4
- **Anthropic** : Pour Claude
- **Gemini** : Pour Google AI
- **Perplexity** : Pour la recherche

#### Personnalisation
- Timeout de session
- Mode par défaut
- Notifications
- Intégrations (à venir)

## 🎯 Cas d'usage concrets

### 1. Session de travail profond
```bash
1. Ouvrir Nexia
2. Mode Focus Guardian
3. "Je dois finir la présentation pour demain, 2h de focus"
4. Nexia bloque les distractions et track le temps
5. Idées hors-sujet → parkées automatiquement
```

### 2. Brainstorming business
```bash
1. Mode Opportunity Hunter
2. "J'ai remarqué que [observation]"
3. Nexia analyse et suggère des angles
4. Exploration des opportunités connexes
5. Validation du potentiel
```

### 3. Challenge d'idée
```bash
1. Mode Socratic Challenger
2. Présenter votre concept
3. Répondre aux questions challengeantes
4. Itérer et améliorer
5. Arriver à une version 10x
```

## 🔧 Troubleshooting

### Nexia ne répond pas
- Vérifier les clés API dans .env
- Vérifier la connexion aux bases de données
- Consulter les logs : `tail -f services/ai-core/logs/app.log`

### Idées non sauvegardées
- Vérifier la connexion Redis
- S'assurer que la session est active

### Performance lente
- Vérifier la charge CPU/RAM
- Optimiser les requêtes LLM
- Utiliser un modèle plus léger si nécessaire

## 🚀 Prochaines étapes

1. **Intégrations**
   - Google Calendar
   - Notion
   - Slack

2. **Features**
   - Voice input
   - Mobile app
   - Collaboration

3. **IA**
   - Fine-tuning pour TDAH
   - Apprentissage des patterns utilisateur
   - Prédiction de productivité

---

Pour plus d'aide : nextstep@blueocean.com
