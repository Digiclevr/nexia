# 📊 NEXIA Directus CMS

**CMS Opérationnel Migré** - Administration centralisée écosystème NEXIA

## 🎯 Fonctionnalités

### Administration Centralisée
- **Collections Supervision** : Monitoring écosystèmes
- **Dashboard Metrics** : KPIs temps réel  
- **User Management** : Gestion utilisateurs global
- **Content Management** : Documentation et guides

### Intégrations NEXIA
- **NEXIA Supervisor** : Connexion API supervision
- **Voice Commands** : Configuration commandes vocales
- **Claude Code 24/7** : Paramètres agent autonome
- **Ecosystem Management** : Configuration écosystèmes

## 🚀 Démarrage

### Développement Local
```bash
cd /Users/ludovicpilet/PROJECTS/NEXIA/apps/nexia-directus
docker-compose up -d
```

**URL** : http://localhost:7012  
**Admin** : admin@nexia.com / NexiaAdmin2025!

### Accès Admin
1. Ouvrir http://localhost:7012
2. Se connecter avec les credentials admin
3. Configurer les collections NEXIA

## 📦 Collections NEXIA

### Ecosystems
- **Name** : Nom écosystème
- **Status** : online/offline/warning
- **URL** : Endpoint principal
- **Description** : Description écosystème
- **Services** : Nombre de services
- **Last Check** : Dernière vérification

### Voice Commands
- **Command** : Phrase d'activation Siri
- **Action** : Action à exécuter
- **Endpoint** : URL API correspondante
- **Response** : Template réponse vocale
- **Active** : Commande activée/désactivée

### Supervision Metrics
- **Timestamp** : Horodatage métrique
- **Ecosystem** : Écosystème concerné
- **Metric Type** : Type de métrique
- **Value** : Valeur métrique
- **Unit** : Unité de mesure

### Deployment Tasks
- **Task ID** : Identifiant unique
- **Ecosystem** : Écosystème cible
- **Action** : deploy/restart/scale
- **Status** : pending/running/completed/failed
- **Started At** : Date début
- **Completed At** : Date fin
- **Logs** : Logs d'exécution

## 🔧 Configuration

### Base de Données
- **Host** : postgres-central.platform.svc.cluster.local:5432
- **Database** : nexia_directus_production
- **Schema** : Spécifique NEXIA

### Cache Redis
- **Host** : platform-pool-redis-master.platform.svc.cluster.local:6379
- **Namespace** : nexia-directus:
- **TTL** : Configuration par type

### APIs Endpoints
```bash
# Directus API
GET http://localhost:7012/items/ecosystems
GET http://localhost:7012/items/voice_commands
POST http://localhost:7012/items/supervision_metrics

# Integration NEXIA Supervisor
GET http://localhost:7012/nexia/supervisor/status
POST http://localhost:7012/nexia/supervisor/deploy
```

## 🎛️ Interface Admin

### Dashboard Principal
- **Ecosystems Overview** : Vue d'ensemble états
- **Voice Commands** : Configuration commandes
- **Metrics Charts** : Graphiques métriques
- **Recent Activities** : Activités récentes

### Collections Management
- **Ecosystems** : Gestion écosystèmes supervisés
- **Voice Commands** : Configuration Siri shortcuts
- **Metrics** : Données monitoring
- **Tasks** : Historique déploiements

### User Management
- **Administrators** : Comptes admin NEXIA
- **Roles & Permissions** : Gestion droits
- **Activity Logs** : Logs d'activité
- **API Tokens** : Tokens d'accès

## 🔗 Intégrations

### NEXIA Supervisor Integration
```javascript
// Extension Directus custom
// /extensions/endpoints/nexia-supervisor.js
export default (router) => {
  router.get('/nexia/supervisor/status', async (req, res) => {
    const response = await fetch('http://localhost:7014/api/ecosystems/status')
    const data = await response.json()
    res.json(data)
  })
}
```

### Voice Commands Sync
```javascript
// Synchronisation commandes vocales
// /extensions/hooks/voice-commands-sync.js
export default ({ filter, action }) => {
  filter('items.create', async (payload, meta, context) => {
    if (meta.collection === 'voice_commands') {
      // Synchroniser avec NEXIA Voice
      await syncWithNexiaVoice(payload)
    }
  })
}
```

## 📊 Schema Collections

### Ecosystems Table
```sql
CREATE TABLE ecosystems (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'offline',
  url TEXT,
  description TEXT,
  services_count INTEGER DEFAULT 0,
  last_check TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Voice Commands Table
```sql
CREATE TABLE voice_commands (
  id SERIAL PRIMARY KEY,
  command TEXT NOT NULL,
  action VARCHAR(255) NOT NULL,
  endpoint TEXT NOT NULL,
  response_template TEXT,
  active BOOLEAN DEFAULT true,
  ecosystem_id INTEGER REFERENCES ecosystems(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚨 Sécurité

### Authentication
- **Admin Only** : Accès restreint administrators
- **Token Based** : API tokens pour intégrations
- **CORS Configured** : Origine autorisées seulement

### Data Protection
- **Encryption** : Données sensibles chiffrées
- **Backup Strategy** : Sauvegarde automatique
- **Audit Logs** : Traçabilité complète

## 🔮 Extensions Prévues

### Phase 2 - Advanced Monitoring
- **Real-time Dashboards** : Dashboards temps réel
- **Alert Configuration** : Configuration alertes
- **Report Generation** : Génération rapports

### Phase 3 - AI Integration
- **Claude Integration** : Assistant IA intégré
- **Predictive Analytics** : Analytics prédictives
- **Auto-remediation** : Correction automatique

---

**Version** : 1.0.0  
**Port** : 7012  
**Admin** : admin@nexia.com  
**Status** : ✅ Migré et Fonctionnel