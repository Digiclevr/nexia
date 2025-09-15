# Guide pratique n8n + Nextstep

## 🚀 Cas d'usage concrets avec n8n

### 1. Session Focus TDAH automatisée

**Scénario**: Un entrepreneur TDAH veut se concentrer sur un rapport pendant 45 minutes.

```
Utilisateur: "Active le mode focus pour 45 minutes sur le rapport Q4"

Nexia déclenche le workflow n8n qui:
1. Démarre un timer de 45 minutes
2. Active le mode "Ne pas déranger" sur Slack/Teams
3. Bloque les sites distracteurs
4. Enregistre toutes les idées hors-sujet
5. Envoie des rappels encourageants toutes les 15 minutes
6. Génère un rapport de session à la fin
```

**Workflow n8n**:
- Webhook trigger → Timer → Slack API → Browser control → Google Docs → Notification

### 2. Détection d'opportunités business

**Scénario**: Veille automatique sur les tendances TDAH/productivité.

```
Toutes les heures, n8n:
1. Scanne Reddit r/ADHD, r/productivity
2. Analyse les posts ProductHunt
3. Vérifie les tendances Twitter
4. Utilise Claude/GPT pour identifier les pain points
5. Score chaque opportunité (0-10)
6. Alerte si score > 7
```

**Résultat réel détecté**:
"Forte demande pour un outil de time-boxing visuel adapté TDAH - 
87 mentions en 24h, aucune solution satisfaisante identifiée"

### 3. Assistant Telegram intelligent

**Conversation exemple**:

```
User: /focus 25
Bot: 🧠 Session Pomodoro démarrée! Je protège votre concentration pendant 25 min.
      Objectif actuel?

User: Finir la présentation client
Bot: ✅ Noté! Focus sur "Présentation client" pour 25 min.
     💡 Astuce: Commencez par la slide la plus importante.

[10 minutes plus tard]
User: Oh j'ai une idée pour un nouveau produit...
Bot: 💡 Excellente idée! Je la parque pour vous:
     "Nouveau produit" → Sauvegardé dans vos idées
     
     🎯 Retour au focus: Présentation client (15 min restantes)
     Vous en êtes où?

[Fin de session]
Bot: 🎉 Bravo! Session terminée!
     📊 Résumé:
     - Focus maintenu: 92%
     - 1 idée parkée
     - Tâche complétée: ✅
     
     Prêt pour la prochaine session?
```

### 4. Intégration calendrier intelligent

**Workflow automatique**:

```javascript
// Chaque matin à 8h
1. Analyser le calendrier du jour
2. Identifier les créneaux de "deep work"
3. Détecter les conflits potentiels
4. Suggérer des optimisations TDAH-friendly

// Message généré
"📅 Planning optimisé pour aujourd'hui:

9h-10h30: 🧠 Deep work (Énergie haute)
          → Rapport financier

10h30-11h: ☕ Pause active

11h-12h: 📧 Emails + tâches admin
         (Énergie moyenne)

14h-15h: 🤝 Réunion client
         💡 Prep: Points clés dans Notion

15h30-17h: 🎯 Projet NextStep
           → Feature IA memory

⚡ Conseil du jour: Vos stats montrent une meilleure 
concentration le matin. J'ai placé les tâches 
importantes en conséquence."
```

### 5. Rapport hebdomadaire personnalisé

**Email automatique chaque vendredi**:

```markdown
# 📊 Votre semaine avec Nextstep

## 🎯 Victoires
- 12h de deep focus (↑ 20% vs semaine dernière)
- 8 idées innovantes capturées
- 3 opportunités business identifiées

## 💡 Vos meilleures idées
1. **App de co-working virtuel TDAH** (Score: 8.5/10)
   - Marché: 5M+ personnes
   - Competition: Faible
   - Faisabilité: Haute

2. **Integration Spotify pour focus** (Score: 7/10)
   - Playlists adaptatives selon l'énergie
   - Potentiel viral sur TikTok

## 📈 Patterns détectés
- Pic de productivité: Mardi 10h-12h
- Moment créatif: Jeudi après-midi
- Zone de danger: Lundi 14h-16h (prévoir tâches légères)

## 🚀 Recommandations semaine prochaine
1. Bloquer Mardi 10h-12h pour projet prioritaire
2. Planifier brainstorming Jeudi PM
3. Tester la technique 52-17 (52min focus, 17min pause)

## 🎮 Gamification
Level 12 → Level 13 ⬆️
Points cette semaine: 850
Streak focus: 5 jours 🔥

Continuez comme ça! 💪
```

### 6. Intégration n8n + Nexia en action

**Architecture de flux**:

```
Utilisateur → Nexia UI → API Nextstep → n8n Workflow → Multi-services
                ↑                            ↓
                └────── Résultat agrégé ←────┘

Services intégrés:
- Notion (gestion projets)
- Google Calendar (planning)
- Telegram (notifications)
- OpenAI/Claude (analyse)
- PostgreSQL (historique)
- Redis (cache/sessions)
```

### 7. Création rapide de nouveaux agents

**Avec Claude Desktop + n8n**:

```
1. Copier un workflow existant dans Claude Desktop
2. Demander: "Adapte ce workflow pour détecter 
   les moments de procrastination et suggérer 
   des micro-tâches de 2 minutes"
3. Claude génère le JSON modifié
4. Import dans n8n en 1 clic
5. Test et déploiement en 5 minutes

Résultat: Nouvel agent "Procrastination Buster" opérationnel
```

## 🛠️ Commandes utiles

### Développement local

```bash
# Tunnel vers n8n
kubectl port-forward -n nextstep svc/n8n-service 6010:6010

# Logs en temps réel
kubectl logs -n nextstep -l app=n8n -f

# Accès à la DB
kubectl port-forward -n nextstep svc/postgres 5432:5432

# Test webhook local
curl -X POST http://localhost:6010/webhook/focus-guardian \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "duration": 25}'
```

### Monitoring

```bash
# Statut des workflows
kubectl exec -n nextstep deployment/n8n -- \
  n8n export:workflow --all --pretty

# Métriques Redis
kubectl exec -n nextstep deployment/redis -- \
  redis-cli INFO stats

# Performance n8n
kubectl top pod -n nextstep -l app=n8n
```

## 📚 Ressources

- [n8n Docs](https://docs.n8n.io)
- [Templates Nextstep](./n8n-workflow-examples.md)
- [API Reference](./n8n-api-reference.md)
- [Troubleshooting](./n8n-troubleshooting.md)

---

💡 **Pro tip**: Commencez simple avec un workflow de notification, 
puis ajoutez progressivement de l'intelligence avec les agents IA.