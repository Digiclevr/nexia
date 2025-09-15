# 🤖 CLAUDE - Guide Rapide NEXTSTEP BlueOcean

**Guide de référence pour futures sessions Claude sur NEXTSTEP**

---

## ⚡ **RÉSUMÉ EXÉCUTIF - 30 SECONDES**

✅ **NEXTSTEP architecture UNIQUE BlueOcean monorepo**  
✅ **Pipeline CI/CD premium** (dev→staging→prod) fonctionnel  
✅ **Infrastructure partagée** (PostgreSQL, Redis, Monitoring)  
✅ **Fix OpenSSL appliqué** (Prisma Alpine compatibility)  
✅ **Architecture simplifiée** : UNE SEULE source de vérité  
✅ **Production ready** : `http://nextstep`

---

## 🎯 **ACTIONS IMMÉDIATES DISPONIBLES**

### **🚀 Déploiement Standard**
```bash
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN

# Étape 1: Deploy staging
./scripts/deploy-nextstep-staging.sh

# Étape 2: Tests validation (OBLIGATOIRE)
./scripts/test-nextstep-staging.sh

# Étape 3: Deploy production (confirmation requise)
./scripts/deploy-nextstep-prod.sh
```

### **🔍 Vérification Rapide**
```bash
# Status général
kubectl get pods --all-namespaces | grep nextstep

# Health check production
curl http://nextstep/api/health

# Health check staging  
curl http://nextstep-staging/api/health

# Logs temps réel
kubectl logs -f deployment/nextstep-api-prod -n blueocean-nextstep-prod
```

### **🏠 Développement Local**
```bash
cd /Users/ludovicpilet/PROJECTS/BLUEOCEAN
./start-nextstep-local.sh

# URLs locales:
# http://localhost:7001 (Dashboard)
# http://localhost:7020 (API)
```

---

## 🏗️ **ARCHITECTURE QUICKREF**

### **📍 Emplacements Clés**
```
Monorepo:    /Users/ludovicpilet/PROJECTS/BLUEOCEAN/
Dashboard:   /BLUEOCEAN/apps/nextstep/
API:        /BLUEOCEAN/apps/nextstep-api/
Scripts:    /BLUEOCEAN/scripts/deploy-nextstep-*.sh
Config:     /BLUEOCEAN/packages/shared-config/
```

### **🌐 URLs Environnements**
```
Production:  http://nextstep
Staging:     http://nextstep-staging
Local Dev:   http://localhost:7001
API Health:  http://nextstep/api/health
```

### **📦 Namespaces Kubernetes**
```
blueocean-nextstep-prod     # Production
blueocean-nextstep-staging  # Tests/Validation
blueocean-nextstep-dev      # Développement
blueocean-shared           # Infrastructure commune
```

---

## 🔧 **COMMANDES DE DIAGNOSTIC**

### **🏥 Health Checks**
```bash
# API production
curl -s http://nextstep/api/health | jq

# API staging
curl -s http://nextstep-staging/api/health | jq

# Endpoints fonctionnels
curl -s http://nextstep/api/orchestration/metrics | jq
curl -s http://nextstep/api/orchestration/agents | jq
curl -s http://nextstep/api/safety/status | jq
```

### **📊 Status Kubernetes**
```bash
# Pods NEXTSTEP
kubectl get pods -n blueocean-nextstep-prod
kubectl get pods -n blueocean-nextstep-staging
kubectl get pods -n blueocean-nextstep-dev

# Services et ingress
kubectl get services -n blueocean-nextstep-prod
kubectl get ingress blueocean-apps-ingress -n blueocean-shared

# Logs debugging
kubectl logs deployment/nextstep-api-prod -n blueocean-nextstep-prod --tail=50
kubectl logs deployment/nextstep-dashboard-prod -n blueocean-nextstep-prod --tail=50
```

---

## ⚠️ **RÈGLES CRITIQUES À RESPECTER**

### **🔒 Sécurité Production**
1. **JAMAIS** déployer en prod sans tests staging
2. **TOUJOURS** exécuter `test-nextstep-staging.sh` avant prod
3. **CONFIRMER** exactement `"DEPLOY NEXTSTEP PROD"` (case sensitive)
4. **VÉRIFIER** backup automatique créé avant déploiement

### **🧪 Pipeline Obligatoire**
```
Dev → Staging + Tests → Production
 ↓       ↓              ↓
Auto   Manual +       Manual +
       8-Phase        Confirmation
       Tests          Required
```

### **📋 Checklist Déploiement**
- [ ] Environment staging deployed and healthy
- [ ] All 8-phase tests passed
- [ ] Production confirmation provided
- [ ] Backup created before deployment
- [ ] Post-deployment health checks passed

---

## 🎯 **TROUBLESHOOTING RAPIDE**

### **❌ "http://nextstep ne fonctionne pas"**
```bash
# 1. Vérifier pods production
kubectl get pods -n blueocean-nextstep-prod

# 2. Vérifier ingress
kubectl get ingress blueocean-apps-ingress -n blueocean-shared

# 3. Health check direct
kubectl exec -n blueocean-nextstep-prod deployment/nextstep-api-prod -- curl http://localhost:7020/api/health

# 4. DNS local (si test local)
echo "127.0.0.1 nextstep" >> /etc/hosts
```

### **❌ "Staging tests failed"**
```bash
# 1. Vérifier staging deployment
kubectl get pods -n blueocean-nextstep-staging

# 2. Logs staging API
kubectl logs deployment/nextstep-api-staging -n blueocean-nextstep-staging

# 3. Re-run staging deployment
./scripts/deploy-nextstep-staging.sh

# 4. Re-test avec détails
./scripts/test-nextstep-staging.sh
```

### **❌ "Build/Images issues"**
```bash
# 1. Vérifier registry access
kubectl get secret docker-config

# 2. Check latest images
kubectl get deployment nextstep-api-prod -n blueocean-nextstep-prod -o jsonpath='{.spec.template.spec.containers[0].image}'

# 3. Manual build (if needed)
kubectl apply -f infrastructure/kaniko/nextstep-kaniko.yaml
```

---

## 🌟 **POINTS CLÉS ARCHITECTURE**

### **✅ Ce qui est NOUVEAU/CHANGÉ**
- **Monorepo structure** : Tout dans `/PROJECTS/BLUEOCEAN/`
- **Namespaces BlueOcean** : `blueocean-nextstep-*`
- **Infrastructure partagée** : PostgreSQL + Redis centralisés
- **Scripts adaptés** : Tous dans `/scripts/deploy-nextstep-*.sh`

### **✅ Ce qui est PRÉSERVÉ**
- **Pipeline dev→staging→prod** : Identique et fonctionnel
- **Tests complets** : 8 phases de validation
- **Sécurité production** : Confirmation + backup + rollback
- **Zero-downtime** : Déploiements sans interruption

### **🏆 Résultat Final**
NEXTSTEP bénéficie du **meilleur pipeline CI/CD** du monorepo BlueOcean + **infrastructure centralisée optimisée**.

---

## 📚 **DOCUMENTATION COMPLÈTE**

Pour plus de détails techniques complets :
- **Architecture complète** : `/PROJECTS/NEXIA/NEXTSTEP-BLUEOCEAN-ARCHITECTURE-COMPLETE.md`
- **Scripts source** : `/PROJECTS/BLUEOCEAN/scripts/`
- **Configuration** : `/PROJECTS/BLUEOCEAN/packages/shared-config/`

---

**🎯 TL;DR : NEXTSTEP fonctionne sur http://nextstep avec l'architecture la plus robuste de BlueOcean !**

---

*Guide créé pour optimiser les futures sessions Claude sur NEXTSTEP BlueOcean*