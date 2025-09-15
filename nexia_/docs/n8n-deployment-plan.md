# Plan de déploiement n8n pour Nextstep

## 🚀 Déploiement sur le cluster BlueOcean

### 1. Préparation de la base de données

```sql
-- Se connecter au node-pool platform
-- Créer la base de données pour n8n
CREATE DATABASE n8n_nextstep;
CREATE USER n8n_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE n8n_nextstep TO n8n_user;
```

### 2. Configuration Kubernetes

Créer le fichier `/Users/ludovicpilet/Documents/blueocean.nosync/nextstep/nexia/k8s/n8n-deployment.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: nextstep
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: n8n-config
  namespace: nextstep
data:
  N8N_HOST: "n8n.blueocean.local"
  N8N_PORT: "6010"
  N8N_PROTOCOL: "https"
  WEBHOOK_URL: "https://n8n.blueocean.local/"
  N8N_BASIC_AUTH_ACTIVE: "true"
  DB_TYPE: "postgresdb"
  DB_POSTGRESDB_HOST: "platform-pool"
  DB_POSTGRESDB_PORT: "5432"
  DB_POSTGRESDB_DATABASE: "n8n_nextstep"
  QUEUE_BULL_REDIS_HOST: "platform-pool"
  QUEUE_BULL_REDIS_PORT: "6379"
  QUEUE_BULL_REDIS_DB: "1"
---
apiVersion: v1
kind: Secret
metadata:
  name: n8n-secrets
  namespace: nextstep
type: Opaque
stringData:
  DB_POSTGRESDB_USER: "n8n_user"
  DB_POSTGRESDB_PASSWORD: "secure_password_here"
  N8N_BASIC_AUTH_USER: "nextstep_admin"
  N8N_BASIC_AUTH_PASSWORD: "admin_password_here"
  OPENAI_API_KEY: "sk-..."
  ANTHROPIC_API_KEY: "sk-ant-..."
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n8n
  namespace: nextstep
spec:
  replicas: 1
  selector:
    matchLabels:
      app: n8n
  template:
    metadata:
      labels:
        app: n8n
    spec:
      containers:
      - name: n8n
        image: n8nio/n8n:latest
        ports:
        - containerPort: 6010
        envFrom:
        - configMapRef:
            name: n8n-config
        - secretRef:
            name: n8n-secrets
        volumeMounts:
        - name: n8n-data
          mountPath: /home/node/.n8n
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
      volumes:
      - name: n8n-data
        persistentVolumeClaim:
          claimName: n8n-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: n8n-pvc
  namespace: nextstep
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: do-block-storage
---
apiVersion: v1
kind: Service
metadata:
  name: n8n-service
  namespace: nextstep
spec:
  selector:
    app: n8n
  ports:
    - protocol: TCP
      port: 6010
      targetPort: 6010
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: n8n-ingress
  namespace: nextstep
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - n8n.blueocean.local
    secretName: n8n-tls
  rules:
  - host: n8n.blueocean.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: n8n-service
            port:
              number: 6010
```

### 3. Script de déploiement

Créer `/Users/ludovicpilet/Documents/blueocean.nosync/nextstep/nexia/deploy-n8n.sh`:

```bash
#!/bin/bash

echo "🚀 Déploiement de n8n pour Nextstep"

# Vérification des prérequis
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl n'est pas installé"
    exit 1
fi

# Création du namespace si nécessaire
kubectl create namespace nextstep --dry-run=client -o yaml | kubectl apply -f -

# Application de la configuration
echo "📦 Application de la configuration Kubernetes..."
kubectl apply -f k8s/n8n-deployment.yaml

# Attente du déploiement
echo "⏳ Attente du démarrage de n8n..."
kubectl wait --for=condition=available --timeout=300s deployment/n8n -n nextstep

# Vérification du statut
echo "✅ Statut du déploiement:"
kubectl get pods -n nextstep -l app=n8n
kubectl get ingress -n nextstep

echo "🎉 n8n est déployé sur https://n8n.blueocean.local"
echo "   Utilisateur: nextstep_admin"
echo "   Port interne: 6010"
```

### 4. Agent Orchestrator Service

Créer `/Users/ludovicpilet/Documents/blueocean.nosync/nextstep/nexia/services/agent-orchestrator/`:

```typescript
// package.json
{
  "name": "nextstep-agent-orchestrator",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "bullmq": "^4.12.0",
    "@types/express": "^4.17.17"
  }
}

// src/index.ts
import express from 'express';
import { WorkflowOrchestrator } from './orchestrator';

const app = express();
const port = 6011;
const orchestrator = new WorkflowOrchestrator();

app.use(express.json());

// Déclencher un workflow n8n
app.post('/api/workflows/trigger', async (req, res) => {
  const { workflowId, data } = req.body;
  const result = await orchestrator.triggerWorkflow(workflowId, data);
  res.json(result);
});

// Recevoir des webhooks n8n
app.post('/api/webhooks/n8n', async (req, res) => {
  await orchestrator.handleWebhook(req.body);
  res.status(200).send('OK');
});

// Gérer les sessions Focus
app.post('/api/focus/start', async (req, res) => {
  const { userId, duration, goal } = req.body;
  const session = await orchestrator.startFocusSession(userId, duration, goal);
  res.json(session);
});

app.listen(port, () => {
  console.log(`Agent Orchestrator running on port ${port}`);
});

// src/orchestrator.ts
import axios from 'axios';
import { Queue, Worker } from 'bullmq';

export class WorkflowOrchestrator {
  private n8nUrl = 'http://n8n-service.nextstep:6010';
  private queue: Queue;

  constructor() {
    this.queue = new Queue('workflows', {
      connection: {
        host: 'platform-pool',
        port: 6379,
        db: 2
      }
    });
    this.setupWorkers();
  }

  async triggerWorkflow(workflowId: string, data: any) {
    const response = await axios.post(
      `${this.n8nUrl}/webhook/${workflowId}`,
      data,
      {
        auth: {
          username: process.env.N8N_USER!,
          password: process.env.N8N_PASSWORD!
        }
      }
    );
    return response.data;
  }

  async handleWebhook(data: any) {
    await this.queue.add('process-webhook', data);
  }

  async startFocusSession(userId: string, duration: number, goal: string) {
    const sessionData = {
      userId,
      duration,
      goal,
      startTime: new Date(),
      mode: 'focus_guardian'
    };

    // Déclencher le workflow Focus Guardian
    await this.triggerWorkflow('focus-guardian-workflow', sessionData);

    return sessionData;
  }

  private setupWorkers() {
    new Worker('workflows', async job => {
      console.log('Processing job:', job.name);
      // Logique de traitement des jobs
    }, {
      connection: {
        host: 'platform-pool',
        port: 6379,
        db: 2
      }
    });
  }
}
```

### 5. Intégration avec Nexia

Modifier `/Users/ludovicpilet/Documents/blueocean.nosync/nextstep/nexia/services/ai-core/app/services/workflow_service.py`:

```python
import httpx
from typing import Dict, Any

class WorkflowService:
    def __init__(self):
        self.orchestrator_url = "http://agent-orchestrator:6011"
        self.client = httpx.AsyncClient()

    async def trigger_workflow(self, workflow_id: str, data: Dict[str, Any]):
        """Déclenche un workflow n8n via l'orchestrator"""
        response = await self.client.post(
            f"{self.orchestrator_url}/api/workflows/trigger",
            json={"workflowId": workflow_id, "data": data}
        )
        return response.json()

    async def start_focus_session(self, user_id: str, duration: int, goal: str):
        """Démarre une session focus avec workflow n8n"""
        response = await self.client.post(
            f"{self.orchestrator_url}/api/focus/start",
            json={
                "userId": user_id,
                "duration": duration,
                "goal": goal
            }
        )
        return response.json()

    async def park_idea(self, user_id: str, idea: str, context: str):
        """Parque une idée via workflow n8n"""
        return await self.trigger_workflow("park-idea-workflow", {
            "userId": user_id,
            "idea": idea,
            "context": context,
            "timestamp": datetime.now().isoformat()
        })
```

## 📊 Monitoring et Métriques

### Grafana Dashboard

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: n8n-grafana-dashboard
  namespace: nextstep
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "n8n Nextstep Metrics",
        "panels": [
          {
            "title": "Workflows Executed",
            "targets": [{
              "expr": "n8n_workflow_executions_total"
            }]
          },
          {
            "title": "Focus Sessions Active",
            "targets": [{
              "expr": "nextstep_focus_sessions_active"
            }]
          },
          {
            "title": "Ideas Parked",
            "targets": [{
              "expr": "nextstep_ideas_parked_total"
            }]
          }
        ]
      }
    }
```

## 🔐 Sécurité

### Secrets Management

```bash
# Créer les secrets Kubernetes
kubectl create secret generic n8n-api-keys \
  --from-literal=OPENAI_API_KEY="${OPENAI_API_KEY}" \
  --from-literal=ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}" \
  --from-literal=GEMINI_API_KEY="${GEMINI_API_KEY}" \
  -n nextstep
```

## 📝 Checklist de déploiement

- [ ] Créer la base de données n8n sur node-pool platform
- [ ] Configurer les secrets Kubernetes
- [ ] Déployer n8n sur le cluster
- [ ] Vérifier l'accès via https://n8n.blueocean.local
- [ ] Déployer l'Agent Orchestrator Service
- [ ] Importer les workflows de base
- [ ] Configurer les intégrations (Telegram, Google, etc.)
- [ ] Tester un workflow simple
- [ ] Intégrer avec Nexia
- [ ] Configurer le monitoring
- [ ] Documentation pour l'équipe
- [ ] Formation n8n