# Exemples de Workflows n8n pour Nextstep

## 🧠 Workflow 1 : Focus Guardian avec Mémoire

```json
{
  "name": "Nextstep Focus Guardian",
  "nodes": [
    {
      "parameters": {
        "path": "focus-session",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "text": "={{ $json.body.message }}",
        "options": {
          "systemMessage": "Tu es Focus Guardian, l'assistant TDAH de Nextstep. Tu aides à maintenir la concentration en:\n- Identifiant les distractions\n- Parkant les idées hors-sujet\n- Rappelant l'objectif principal\n- Encourageant avec bienveillance\n\nContexte utilisateur: {{ $('User Memory').item.json.context }}"
        }
      },
      "name": "AI Focus Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "position": [450, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "={{ $json.body.userId }}_memory",
        "simple": false
      },
      "name": "User Memory",
      "type": "n8n-nodes-base.googleDocs",
      "position": [450, 150]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $('AI Focus Agent').item.json.action }}",
              "value2": "park_idea"
            }
          ]
        }
      },
      "name": "Action Router",
      "type": "n8n-nodes-base.if",
      "position": [650, 300]
    },
    {
      "parameters": {
        "operation": "appendText",
        "documentId": "={{ $json.body.userId }}_parked_ideas",
        "text": "\\n[{{ $now.format('yyyy-MM-dd HH:mm') }}] {{ $('AI Focus Agent').item.json.idea }}"
      },
      "name": "Park Idea",
      "type": "n8n-nodes-base.googleDocs",
      "position": [850, 200]
    }
  ]
}
```

## 💎 Workflow 2 : Opportunity Hunter Scanner

```json
{
  "name": "Nextstep Opportunity Scanner",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 1
            }
          ]
        }
      },
      "name": "Hourly Scan",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "url": "https://api.example.com/market-trends",
        "options": {}
      },
      "name": "Market Data API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 200]
    },
    {
      "parameters": {
        "feedUrl": "https://techcrunch.com/feed/"
      },
      "name": "Tech News RSS",
      "type": "n8n-nodes-base.rssFeedRead",
      "position": [450, 400]
    },
    {
      "parameters": {
        "text": "Analyse ces données pour identifier des opportunités business:\n\nDonnées marché: {{ $('Market Data API').item.json }}\n\nActualités tech: {{ $('Tech News RSS').item.json.title }} - {{ $('Tech News RSS').item.json.content }}",
        "options": {
          "systemMessage": "Tu es Opportunity Hunter, spécialisé dans la détection d'opportunités business. Identifie:\n- Besoins non satisfaits\n- Gaps de marché\n- Tendances émergentes\n- Synergies potentielles avec Nextstep"
        }
      },
      "name": "Opportunity Analyzer",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "position": [650, 300]
    },
    {
      "parameters": {
        "operation": "create",
        "table": "opportunities",
        "columns": "title,description,score,source,detected_at",
        "values": "={{ $json.opportunity.title }},={{ $json.opportunity.description }},={{ $json.opportunity.score }},={{ $json.source }},={{ $now }}"
      },
      "name": "Save to Database",
      "type": "n8n-nodes-base.postgres",
      "position": [850, 300]
    }
  ]
}
```

## 🤖 Workflow 3 : Telegram Bot Intégré

```json
{
  "name": "Nextstep Telegram Assistant",
  "nodes": [
    {
      "parameters": {
        "updates": [
          "message"
        ]
      },
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.message.text }}",
              "operation": "startsWith",
              "value2": "/focus"
            }
          ]
        }
      },
      "name": "Command Router",
      "type": "n8n-nodes-base.switch",
      "position": [450, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://nexia-api.nextstep.blueocean.local:6001/api/sessions/start",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "userId",
              "value": "={{ $json.message.from.id }}"
            },
            {
              "name": "mode",
              "value": "focus_guardian"
            },
            {
              "name": "duration",
              "value": "={{ $json.message.text.split(' ')[1] || 25 }}"
            }
          ]
        }
      },
      "name": "Start Focus Session",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 200]
    },
    {
      "parameters": {
        "chatId": "={{ $json.message.chat.id }}",
        "text": "🧠 Session Focus démarrée pour {{ $('Start Focus Session').item.json.duration }} minutes!\n\nJe vais protéger votre concentration. Envoyez-moi vos idées, je les parquerai automatiquement.",
        "replyToMessageId": "={{ $json.message.message_id }}"
      },
      "name": "Confirm Start",
      "type": "n8n-nodes-base.telegram",
      "position": [850, 200]
    }
  ]
}
```

## 🔄 Workflow 4 : Synchronisation Multi-Outils

```json
{
  "name": "Nextstep Tools Sync",
  "nodes": [
    {
      "parameters": {
        "path": "sync-trigger",
        "options": {}
      },
      "name": "Sync Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "resource": "database",
        "operation": "search",
        "databaseId": "={{ $json.notionDatabaseId }}",
        "returnAll": true
      },
      "name": "Get Notion Tasks",
      "type": "n8n-nodes-base.notion",
      "position": [450, 200]
    },
    {
      "parameters": {
        "resource": "event",
        "operation": "getAll",
        "calendar": "primary",
        "returnAll": true
      },
      "name": "Get Calendar Events",
      "type": "n8n-nodes-base.googleCalendar",
      "position": [450, 400]
    },
    {
      "parameters": {
        "text": "Synchronise et priorise ces éléments:\n\nTâches Notion: {{ $('Get Notion Tasks').all() }}\nÉvénements: {{ $('Get Calendar Events').all() }}",
        "options": {
          "systemMessage": "Analyse les tâches et événements pour:\n- Identifier les conflits\n- Suggérer des optimisations\n- Prioriser selon l'énergie TDAH\n- Créer un planning optimal"
        }
      },
      "name": "AI Prioritizer",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "position": [650, 300]
    },
    {
      "parameters": {
        "operation": "update",
        "collection": "user_planning",
        "updateKey": "userId",
        "options": {
          "upsert": true
        }
      },
      "name": "Update Planning",
      "type": "n8n-nodes-base.mongoDb",
      "position": [850, 300]
    }
  ]
}
```

## 📊 Workflow 5 : Analytics et Insights

```json
{
  "name": "Nextstep Analytics Pipeline",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "days",
              "daysInterval": 1,
              "triggerAtHour": 8
            }
          ]
        }
      },
      "name": "Daily Analytics",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM user_sessions WHERE date >= NOW() - INTERVAL '24 hours'"
      },
      "name": "Get Session Data",
      "type": "n8n-nodes-base.postgres",
      "position": [450, 200]
    },
    {
      "parameters": {
        "operation": "aggregate",
        "collection": "focus_metrics",
        "aggregate": [
          {
            "$match": {
              "timestamp": {
                "$gte": "={{ $now.minus(1, 'day') }}"
              }
            }
          },
          {
            "$group": {
              "_id": "$userId",
              "totalFocus": { "$sum": "$duration" },
              "distractions": { "$sum": "$distractionCount" }
            }
          }
        ]
      },
      "name": "Aggregate Metrics",
      "type": "n8n-nodes-base.mongoDb",
      "position": [450, 400]
    },
    {
      "parameters": {
        "text": "Génère des insights personnalisés:\n\nSessions: {{ $('Get Session Data').all() }}\nMétriques: {{ $('Aggregate Metrics').all() }}",
        "options": {
          "systemMessage": "Analyse les données pour créer:\n- Insights sur les patterns de productivité\n- Recommandations personnalisées\n- Alertes de burnout potentiel\n- Suggestions d'optimisation"
        }
      },
      "name": "Generate Insights",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "position": [650, 300]
    },
    {
      "parameters": {
        "fromEmail": "nextstep@blueocean.com",
        "toEmail": "={{ $json.userEmail }}",
        "subject": "Vos insights Nextstep du {{ $now.format('dd/MM/yyyy') }}",
        "html": "={{ $json.insights }}"
      },
      "name": "Send Report",
      "type": "n8n-nodes-base.emailSend",
      "position": [850, 300]
    }
  ]
}
```

## 🚀 Configuration des Agents IA

### Agent Focus Guardian
```javascript
const focusGuardianConfig = {
  personality: "Bienveillant, protecteur, encourageant",
  capabilities: [
    "Détection de distractions",
    "Parking d'idées",
    "Time-boxing",
    "Rappels contextuels"
  ],
  memory: {
    type: "persistent",
    storage: "google_docs",
    retention: "90_days"
  },
  integrations: ["telegram", "slack", "calendar"]
};
```

### Agent Opportunity Hunter
```javascript
const opportunityHunterConfig = {
  personality: "Curieux, analytique, visionnaire",
  capabilities: [
    "Analyse de marché",
    "Détection de patterns",
    "Scoring d'opportunités",
    "Veille concurrentielle"
  ],
  dataSources: [
    "techcrunch", "producthunt", "twitter",
    "linkedin", "reddit", "hackernews"
  ],
  alertThreshold: 7.5 // Score minimum pour alerter
};
```

## 📝 Templates de Prompts

### Focus Guardian
```
Tu es Focus Guardian, l'assistant TDAH bienveillant de Nextstep.

Contexte utilisateur: {user_context}
Session en cours: {session_type} pour {duration} minutes
Objectif: {goal}

Règles:
1. Protège la concentration à tout prix
2. Parque automatiquement les idées hors-sujet
3. Sois encourageant mais ferme
4. Rappelle l'objectif si nécessaire
5. Célèbre les petites victoires

Message: {user_message}
```

### Opportunity Hunter
```
Tu es Opportunity Hunter, expert en détection d'opportunités business.

Données à analyser: {market_data}
Secteur focus: {industry}
Critères: {criteria}

Mission:
1. Identifier les besoins non satisfaits
2. Détecter les tendances émergentes
3. Scorer chaque opportunité (0-10)
4. Suggérer des angles d'approche
5. Connecter avec les capacités Nextstep

Format de réponse: JSON structuré
```