# 📱 NEXIA-SIRI - Spécifications Fonctionnelles et Techniques

## 🎯 Vue d'Ensemble

**Nexia-Siri** est la première phase de développement de Nexia, utilisant les Siri Shortcuts iPhone pour créer un assistant vocal capable de superviser et contrôler l'écosystème BlueOcean.

### Objectifs
- ✅ **Déploiement immédiat** : Fonctionnel en < 2 heures
- ✅ **Pilotage vocal** : Contrôle des applications BlueOcean par la voix
- ✅ **Foundation** : Base pour évolution vers ChatGPT Voice Experience
- ✅ **Test concept** : Validation de l'approche avant investissement majeur

---

## 📋 Spécifications Fonctionnelles

### 🎙️ Commandes Vocales Initiales

#### **Supervision Écosystème**
```
"Hey Siri, Nexia Status"
→ Statut global de l'écosystème BlueOcean

"Hey Siri, Écosystème BlueOcean"  
→ Détail de toutes les applications (KONQER, KVIBE, OnlyOneAPI, etc.)

"Hey Siri, Nexia Health"
→ Health check des services centralisés (PostgreSQL, Redis, N8n)
```

#### **Contrôle KONQER**
```
"Hey Siri, Démarrer KONQER"
→ Lance KONQER en mode développement local

"Hey Siri, KONQER Kubernetes"
→ Lance KONQER en mode Kubernetes cloud

"Hey Siri, Status KONQER"
→ État actuel de KONQER (local/cloud/arrêté)
```

#### **Gestion Applications**
```
"Hey Siri, Deploy KVIBE"
→ Déploiement KVIBE sur cluster

"Hey Siri, Restart OnlyOneAPI"
→ Redémarrage des services OnlyOneAPI

"Hey Siri, Logs NEXTGEN"
→ Affichage des derniers logs NEXTGEN
```

#### **Métriques et Monitoring**
```
"Hey Siri, Métriques Système"
→ CPU, RAM, statut pods Kubernetes

"Hey Siri, Performance Apps"
→ Response time et availability des applications
```

### 🔄 Réponses Vocales

#### **Format Standard**
- ✅ **Confirmation d'action** : "KONQER démarré avec succès"
- ✅ **Statut détaillé** : "KONQER: Running, KVIBE: Stopped, OnlyOneAPI: Running"
- ✅ **Erreurs claires** : "Impossible de démarrer KONQER, vérifiez les logs"
- ✅ **Métriques vocales** : "CPU 25%, RAM 60%, 8 pods actifs"

---

## 🏗️ Spécifications Techniques

### 📱 Architecture iPhone

#### **Siri Shortcuts Configuration**
```yaml
Shortcuts Nexia:
  - name: "Nexia Status"
    trigger: "Nexia Status"
    action: HTTP GET → /api/status
    response: Speak Text
    
  - name: "Démarrer KONQER"
    trigger: "Démarrer KONQER"
    action: HTTP POST → /api/konqer/start
    response: Speak Result
    
  - name: "Écosystème BlueOcean" 
    trigger: "Écosystème BlueOcean"
    action: HTTP GET → /api/ecosystem
    response: Speak Formatted
```

#### **Configuration Shortcuts**
- **Base URL** : `https://nexia-api.nextstep.blueocean.local`
- **Authentication** : Bearer token ou API key
- **Timeout** : 30 secondes max
- **Error handling** : Fallback messages vocaux

### 🖥️ Nexia API Server

#### **Stack Technique**
```typescript
Technology Stack:
├── Runtime: Node.js 20+
├── Framework: Fastify 4.x (performance optimisée)
├── Language: TypeScript 5.x
├── Database: PostgreSQL (services centralisés)
├── Cache: Redis (services centralisés)
├── Kubernetes: @kubernetes/client-node
└── Deployment: Docker + Kubernetes
```

#### **Structure API**
```
nexia-api/
├── src/
│   ├── controllers/
│   │   ├── ecosystem.controller.ts    # Status écosystème
│   │   ├── konqer.controller.ts       # Contrôle KONQER
│   │   ├── apps.controller.ts         # Gestion applications
│   │   └── metrics.controller.ts      # Métriques système
│   ├── services/
│   │   ├── kubernetes.service.ts      # Client K8s
│   │   ├── monitoring.service.ts      # Health checks
│   │   └── voice.service.ts           # Formatage réponses vocales
│   ├── types/
│   │   └── nexia.types.ts             # Types TypeScript
│   └── app.ts                         # Serveur Fastify
├── k8s/                               # Manifests Kubernetes
└── package.json
```

#### **Endpoints API**

##### **Supervision**
```typescript
GET /api/status
Response: {
  status: "healthy" | "degraded" | "down",
  timestamp: string,
  message: string // Optimisé pour vocal
}

GET /api/ecosystem  
Response: {
  apps: {
    konqer: { status, url, last_deploy },
    kvibe: { status, url, last_deploy },
    onlyoneapi: { status, url, last_deploy },
    nextgen: { status, url, last_deploy }
  },
  services: {
    postgresql: { status, connections },
    redis: { status, memory_usage },
    n8n: { status, workflows_active }
  },
  voice_summary: string // Phrase vocale optimisée
}
```

##### **Contrôle KONQER**
```typescript
POST /api/konqer/start
Body: { mode: "local" | "kubernetes" }
Response: {
  success: boolean,
  message: string, // Pour Siri
  details: { port?, pod_name?, startup_time? }
}

GET /api/konqer/status
Response: {
  status: "running" | "stopped" | "starting" | "error",
  mode: "local" | "kubernetes" | null,
  endpoints: string[],
  voice_status: string
}

POST /api/konqer/stop
Response: {
  success: boolean,
  message: string
}
```

##### **Gestion Applications**
```typescript
POST /api/apps/{app_name}/deploy
POST /api/apps/{app_name}/restart  
POST /api/apps/{app_name}/stop
GET /api/apps/{app_name}/logs
```

##### **Métriques**
```typescript
GET /api/metrics/system
Response: {
  kubernetes: {
    nodes: number,
    pods_running: number,
    cpu_usage: string,
    memory_usage: string
  },
  applications: {
    response_times: Record<string, number>,
    availability: Record<string, number>
  },
  voice_summary: string // "8 pods actifs, CPU 25%, tout fonctionne normalement"
}
```

### ☸️ Intégration Kubernetes

#### **Configuration Cluster**
```yaml
# Service Account pour Nexia
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nexia-service-account
  namespace: nexia

---
# ClusterRole pour contrôle applications
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: nexia-controller
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]  
  resources: ["deployments"]
  verbs: ["get", "list", "update", "patch"]
```

#### **Actions Kubernetes**
```typescript
// Service Kubernetes Nexia
class KubernetesService {
  async getApplicationStatus(app: string): Promise<AppStatus>
  async deployApplication(app: string, version?: string): Promise<DeployResult>  
  async restartApplication(app: string): Promise<RestartResult>
  async getApplicationLogs(app: string, lines: number): Promise<string[]>
  async getClusterMetrics(): Promise<ClusterMetrics>
}
```

### 🚀 Déploiement

#### **Nexia API Deployment**
```yaml
# Deployment Kubernetes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexia-api
  namespace: nexia
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nexia-api
  template:
    spec:
      containers:
      - name: nexia-api
        image: registry.digitalocean.com/blueocean/nexia-api:latest
        ports:
        - containerPort: 6000
        env:
        - name: DATABASE_URL
          value: "postgresql://postgres-central.platform:5432/nexia"
        - name: REDIS_URL  
          value: "redis://platform-pool-redis-master.platform:6379"

---
# Service  
apiVersion: v1
kind: Service
metadata:
  name: nexia-api
  namespace: nexia
spec:
  ports:
  - port: 6000
    targetPort: 6000
  selector:
    app: nexia-api

---
# Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nexia-api
  namespace: nexia
spec:
  rules:
  - host: nexia-api.nextstep.blueocean.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nexia-api
            port:
              number: 6000
```

---

## 📊 Métriques et Monitoring

### 🎯 KPIs Nexia-Siri

#### **Performance**
- **Response Time** : < 2 secondes par commande
- **Availability** : 99.5% uptime
- **Voice Response** : Messages < 10 secondes

#### **Usage**
- **Commandes/jour** : Tracking des commandes Siri
- **Success Rate** : % de commandes réussies
- **Error Types** : Classification des erreurs

#### **Qualité Vocale**
- **Message Length** : < 15 mots par réponse
- **Clarity Score** : Compréhensibilité des réponses
- **User Satisfaction** : Feedback via logs

---

## 🔄 Roadmap Évolution

### 📈 Phase 2 - PWA Voice (3 mois)
- Interface web conversationnelle
- Web Speech API
- Contexte multi-tours
- Interface graphique complémentaire

### 🚀 Phase 3 - ChatGPT Voice Experience (6 mois)  
- App native iOS
- WebRTC streaming temps réel
- OpenAI Whisper + GPT-4 + TTS
- Interruption mid-sentence
- Conversation naturelle complète

---

## 🛠️ Guide d'Implementation

### Step 1 : Setup Nexia API (30 min)
```bash
mkdir nexia-api
cd nexia-api
npm init -y
npm install fastify @fastify/cors @kubernetes/client-node
# Développement des endpoints
```

### Step 2 : Configuration Siri (15 min)
```
iPhone Settings → Shortcuts
→ Create Shortcut "Nexia Status"  
→ Add Action "Get Contents of URL"
→ Add Action "Speak Text"
```

### Step 3 : Déploiement K8s (45 min)
```bash
# Build Docker image
docker build -t registry.digitalocean.com/blueocean/nexia-api .

# Deploy to cluster  
kubectl apply -f k8s/
```

### Step 4 : Tests Vocaux (30 min)
```
"Hey Siri, Nexia Status" → Validation réponse
"Hey Siri, Démarrer KONQER" → Test action
"Hey Siri, Écosystème BlueOcean" → Vérification données
```

---

## 🔐 Sécurité et Configuration

### 🛡️ Authentification
- **API Keys** : Clés dédiées pour Siri Shortcuts
- **Rate Limiting** : 100 requêtes/minute par clé
- **IP Whitelist** : Restrictions géographiques si nécessaire

### 📱 Configuration iPhone  
```yaml
Shortcuts Security:
  - API Key stockée dans Shortcuts (chiffrée iOS)
  - HTTPS obligatoire
  - Timeout 30s max
  - Error handling pour offline
```

### ☸️ Kubernetes Security
```yaml
Security Policies:
  - Service Account avec permissions minimales
  - Network Policies isolant Nexia
  - Secrets pour credentials sensibles
  - Audit logs pour toutes les actions
```

---

## 📞 Support et Maintenance

### 🔧 Monitoring
- **Health Check** : `/health` endpoint
- **Metrics** : Prometheus metrics exposées
- **Logs** : Structured logging (JSON)
- **Alerts** : PagerDuty integration pour critiques

### 📊 Dashboard Administrateur
- Usage statistics Siri commands
- Performance metrics API
- Error rates et troubleshooting
- Kubernetes cluster status

---

**Version** : 1.0.0  
**Auteur** : Nexia Development Team  
**Date** : Septembre 2025  
**Status** : Ready for Implementation

---

*Cette spécification constitue la fondation de Nexia, évoluant progressivement vers une expérience vocale de niveau ChatGPT tout en démarrant immédiatement avec les capacités Siri native iPhone.*