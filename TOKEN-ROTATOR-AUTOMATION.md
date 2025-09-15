# 🔐 DigitalOcean Token Rotator - Automation System

**Version**: 1.0.0  
**Date**: 15 septembre 2025  
**Statut**: Prêt pour déploiement  
**Namespace**: `platform`

## 🎯 Vue d'Ensemble

Système d'automatisation complète de la rotation des tokens DigitalOcean Registry pour l'écosystème BlueOcean. Rotation mensuelle automatique avec distribution transparente à toutes les applications.

## ⚡ Fonctionnalités

### 🤖 Rotation Automatique
- **Fréquence**: 1er de chaque mois à 2h00
- **Génération**: Nouveau token DigitalOcean via API
- **Distribution**: Mise à jour de 27+ namespaces automatiquement
- **Validation**: Test pull d'image pour confirmer le succès

### 🔄 Mise à Jour Applications
- **Zero-downtime**: Rolling restart de tous les déploiements
- **Applications couvertes**: BlueOcean Dashboard, KREACH, OnlyOneAPI, etc.
- **Rollback automatique**: En cas d'échec de validation

### 📊 Monitoring & Notifications
- **Slack intégré**: Notifications succès/échec
- **Logging complet**: Historique des rotations
- **Métriques**: Prometheus-ready pour monitoring

## 🏗️ Architecture

```
┌─────────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CronJob Monthly   │───▶│  DigitalOcean   │───▶│   Secret Update │
│   (Token Rotator)   │    │      API        │    │  All Namespaces │
└─────────────────────┘    └──────────────────┘    └─────────────────┘
           │                                                  │
           ▼                                                  ▼
┌─────────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Distribution Job   │───▶│  App Deployments │───▶│   Validation    │
│  (Rolling Restart)  │    │   Update & Test  │    │   & Notification│
└─────────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📂 Structure des Fichiers

```
/k8s/
├── token-rotator-cronjob.yaml      # CronJob principal + RBAC
├── token-rotator-secrets.yaml      # Secrets configuration  
└── token-distribution-job.yaml     # Job de distribution aux apps
```

## 🚀 Déploiement

### Prérequis
```bash
# 1. Namespace platform doit exister
kubectl create namespace platform --dry-run=client -o yaml | kubectl apply -f -

# 2. Token DigitalOcean API avec permissions registry
```

### Installation
```bash
# 1. Configurer les secrets
kubectl apply -f k8s/token-rotator-secrets.yaml
kubectl patch secret digitalocean-api-credentials -n platform \
  --type='merge' -p='{"stringData":{"token":"YOUR_DO_API_TOKEN"}}'

# 2. Déployer le système
kubectl apply -f k8s/token-rotator-cronjob.yaml
kubectl apply -f k8s/token-distribution-job.yaml

# 3. Test manuel (optionnel)
kubectl create job --from=cronjob/digitalocean-token-rotator manual-rotation -n platform
```

## 🔧 Configuration

### Variables d'Environnement
```yaml
DO_API_TOKEN: "dop_v1_xxxxx"              # Token DigitalOcean API
REGISTRY_NAME: "onlyoneapi"               # Nom du registry DO
SLACK_WEBHOOK_URL: "https://hooks.slack..." # Notifications (optionnel)
```

### Applications Couvertes
- **nexia**: blueocean-dashboard
- **api-pool**: onlyoneapi-api
- **applications**: kreach-web, kreach-api
- **onlyoneapi**: portal-app
- **backend-pool**: nextstep-api
- **Extensible**: Facile d'ajouter de nouvelles apps

### Namespaces Supportés
```
nexia, api-pool, applications, backend-pool, onlyoneapi, 
platform, shared-infra, monitoring, dev, staging, prod
```

## 📊 Monitoring

### Métriques Kubernetes
```bash
# Vérifier statut CronJob
kubectl get cronjobs -n platform

# Historique des jobs
kubectl get jobs -n platform --sort-by=.metadata.creationTimestamp

# Logs dernière exécution
kubectl logs -l app=token-rotator -n platform --tail=100
```

### Notifications Slack
```json
{
  "text": "🔐 Token Rotation SUCCESS: Updated 15/15 namespaces. Validation passed."
}
```

## 🚨 Gestion des Urgences

### Rotation Manuelle d'Urgence
```bash
# En cas de compromission de token
kubectl create job --from=cronjob/digitalocean-token-rotator emergency-rotation-$(date +%s) -n platform

# Monitoring en temps réel
kubectl logs -f job/emergency-rotation-xxxxx -n platform
```

### Rollback d'Urgence
```bash
# Restaurer ancien secret si nécessaire
kubectl get secret registry-blueocean-backup -n nexia -o yaml | \
  sed 's/name: registry-blueocean-backup/name: registry-blueocean/' | \
  kubectl apply -f -
```

## 🔐 Sécurité

### Permissions RBAC
- **ClusterRole**: Accès secrets, namespaces, pods
- **ServiceAccount**: Isolation des permissions
- **Secret**: Stockage sécurisé des credentials

### Bonnes Pratiques
- ✅ Token rotation mensuelle automatique
- ✅ Validation systématique post-rotation
- ✅ Monitoring et alerting intégrés
- ✅ Rollback automatique en cas d'échec
- ✅ Audit trail complet

## 🎛️ Interface Nexia (Future)

### Commandes Vocales Prévues
```
"Nexia, rotation tokens d'urgence"
"Nexia, statut dernière rotation"  
"Nexia, valide les tokens registry"
"Nexia, suspend rotation automatique"
```

### Dashboard Monitoring
- 📊 Statut rotations (succès/échec)
- 📈 Métriques de performance
- 🔔 Alertes en temps réel
- 📋 Historique complet

## 📋 Checklist Post-Déploiement

- [ ] CronJob déployé et schedulé
- [ ] Secrets configurés avec vrais tokens
- [ ] Test de rotation manuelle réussi
- [ ] Notifications Slack fonctionnelles
- [ ] Applications redémarrent correctement
- [ ] Monitoring Prometheus configuré
- [ ] Documentation équipe mise à jour

## 🆘 Support & Maintenance

### Logs Critiques
```bash
# Erreurs de rotation
kubectl logs -l app=token-rotator -n platform | grep ERROR

# Échecs de distribution  
kubectl get events -n platform --field-selector type=Warning

# Statut applications
kubectl get deployments --all-namespaces | grep -v "READY.*AVAILABLE"
```

### Contacts d'Urgence
- **Équipe DevOps**: Monitoring 24/7 via Prometheus
- **Slack**: Canal `#infrastructure-alerts`
- **Nexia Interface**: Commandes vocales d'urgence disponibles

---

**🌊 BlueOcean Ecosystem - Security Automation**  
*Rotation automatique pour une sécurité maximale sans intervention manuelle*