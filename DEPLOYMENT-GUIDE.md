# 🚀 NEXIA Full-Stack Application - Deployment Guide

## 📋 Architecture Overview

NEXIA est maintenant une **application complète React/Node.js + PostgreSQL** qui stocke et analyse historiquement les métriques de santé Kubernetes.

### 🏗️ Stack technologique :
- **Frontend :** React 18 + Antd + Recharts
- **Backend :** Node.js + Express + Knex.js
- **Base de données :** PostgreSQL avec schéma optimisé
- **Monitoring :** Script intégré avec API REST
- **Déploiement :** Docker Compose + Nginx

---

## 🎯 Nouveautés vs Version Script

### ✅ **Ce qui est nouveau :**
- **📊 Stockage persistant** des scores dans PostgreSQL
- **📈 Historique et tendances** sur plusieurs jours/semaines
- **🎨 Interface React moderne** avec graphiques interactifs
- **🔄 API REST complète** pour intégrations externes
- **📱 Dashboard responsive** accessible via navigateur
- **🔍 Analyse avancée** avec corrélations et alertes

### 🔄 **Migration depuis le script :**
L'ancien script HTML continue de fonctionner mais le nouveau système offre :
- Stockage permanent des données
- Tendances historiques
- Interface moderne
- API pour automatisation

---

## 🚀 Déploiement Rapide

### 1. **Prérequis**
```bash
# Docker et Docker Compose
docker --version
docker-compose --version

# Espace disque (minimum 2GB)
df -h
```

### 2. **Installation**
```bash
cd /users/ludovicpilet/projects/NEXIA

# Créer les dossiers de données
mkdir -p data/{postgres,logs}

# Copier l'environment
cp api/.env.example api/.env

# Démarrer l'application complète
docker-compose up -d
```

### 3. **Vérification**
```bash
# Vérifier les services
docker-compose ps

# Voir les logs
docker-compose logs -f

# URLs d'accès
echo "🌐 Frontend: http://localhost"
echo "🔗 API: http://localhost/api/v1"
echo "💾 Database: localhost:5432"
```

---

## 📊 Utilisation de l'Application

### 🎨 **Interface Web :**
- **Dashboard :** `http://localhost` 
- **Rapports historiques** avec graphiques interactifs
- **Tendances** sur 24h, 7j, 30j
- **Alertes** et actions recommandées
- **Gestion multi-clusters**

### 📡 **API REST :**
```bash
# Obtenir le dernier rapport
curl http://localhost/api/v1/reports/cluster/CLUSTER_ID/latest

# Tendances sur 24h
curl http://localhost/api/v1/reports/cluster/CLUSTER_ID/trends?hours=24

# Statistiques
curl http://localhost/api/v1/reports/cluster/CLUSTER_ID/stats?days=7
```

### 🔄 **Script de monitoring intégré :**
```bash
# Utiliser le nouveau script avec API
./integration-script.sh

# Le script enverra automatiquement les données vers PostgreSQL
# ET génèrera le rapport HTML comme backup
```

---

## 📈 Fonctionnalités Avancées

### 🗄️ **Base de données :**
- **Schéma optimisé** avec indexes pour performance
- **Historique complet** de tous les health checks
- **Métriques détaillées** par catégorie
- **Actions recommandées** trackées
- **Fonctions SQL** pour analyses avancées

### 📊 **Analytics :**
- **Tendances temporelles** par catégorie
- **Corrélations** entre métriques
- **Prédictions** basées sur l'historique
- **Alertes intelligentes** selon les patterns

### 🔐 **Sécurité :**
- **Rate limiting** sur l'API
- **Validation** des données d'entrée
- **Logs** complets d'audit
- **Conteneurisation** sécurisée

---

## ⚙️ Configuration

### 🔧 **Variables d'environnement :**
```bash
# API Configuration
NODE_ENV=production
DB_HOST=database
DB_NAME=nexia_monitoring
JWT_SECRET=your-secret-key

# Frontend Configuration
REACT_APP_API_URL=http://localhost/api
REACT_APP_APP_NAME=NEXIA

# Monitoring Configuration
CLUSTER_NAME=my-cluster
API_BASE_URL=http://api:3001/api/v1
```

### 🎛️ **Personnalisation des seuils :**
Éditez `integration-script.sh` pour ajuster les scores et alertes selon vos besoins.

---

## 🛠️ Maintenance

### 📊 **Monitoring de l'application :**
```bash
# Santé des services
docker-compose exec api curl http://localhost:3001/health

# Métriques base de données
docker-compose exec database psql -U nexia_user -d nexia_monitoring -c "SELECT COUNT(*) FROM health_reports;"

# Espace disque utilisé
du -sh data/
```

### 🧹 **Nettoyage :**
```bash
# Supprimer les rapports anciens (30+ jours)
curl -X DELETE "http://localhost/api/v1/reports/cleanup?days=30"

# Backup base de données
docker-compose exec database pg_dump -U nexia_user nexia_monitoring > backup.sql
```

---

## 🎯 Migration Complète

### **Étapes de migration :**

1. **Garder l'ancien système** (backup)
```bash
cp -r reports/ reports_backup/
```

2. **Déployer le nouveau système**
```bash
docker-compose up -d
```

3. **Configurer le monitoring intégré**
```bash
# Remplacer dans le cron
crontab -e
# Ancien: 0 * * * * /path/to/k8s-health-monitor.sh
# Nouveau: 0 * * * * /path/to/integration-script.sh
```

4. **Vérifier le fonctionnement**
```bash
./integration-script.sh
# Vérifier dans l'interface web : http://localhost
```

---

## 🎉 **Résultat Final**

Vous avez maintenant :
- ✅ **Application complète** React/Node.js/PostgreSQL
- ✅ **Stockage persistant** de tous les scores
- ✅ **Interface moderne** avec graphiques
- ✅ **API REST** pour intégrations
- ✅ **Historique et tendances** avancés
- ✅ **Déploiement containerisé** prêt pour production

**L'interface est accessible sur :** `http://localhost`

**NEXIA - De script simple à plateforme complète !** 🚀📊