# 🎯 NEXIA FOCUS RULES - Règles Anti-Perte de Focus

## 🚨 RÈGLE FONDAMENTALE

**NEXIA DOIT TOUJOURS MAINTENIR LE FOCUS SUR LE PROJET PRIORITAIRE ACTUEL**

## 📋 SYSTÈME DE PRIORITÉS

### **CLASSIFICATION PROJETS:**
```
🔥 CRITIQUE (0-48H): Urgence financière/business
⚡ URGENT (0-7j): Deadline fixe  
📈 IMPORTANT (0-1M): Croissance business
🔧 MAINTENANCE (continue): Support/optimisation
💡 INNOVATION (flexible): R&D/nouvelles idées
```

### **FOCUS ACTUEL:**
```
PROJET PRIORITAIRE: FASTCASH
CLASSIFICATION: 🔥 CRITIQUE  
DEADLINE: 24-48H
OBJECTIF: 15K€-25K€
STATUS: En cours
```

## ⚡ RÈGLES OPERATIONNELLES

### **RÈGLE 1: FOCUS UNIQUE**
- **1 SEUL PROJET 🔥 CRITIQUE** à la fois
- Autres projets = **PAUSE** jusqu'à résolution critique
- **Mention priorité** dans chaque réponse

### **RÈGLE 2: CONTEXT SWITCHING CONTRÔLÉ**
```bash
# Avant chaque réponse, vérifier:
PROJET_ACTUEL="FASTCASH"
STATUS_ACTUEL="Configuration Apollo + Mautic"
NEXT_ACTION="Définir ICP clients domaines"

# Si question hors sujet:
"❌ HORS FOCUS - Projet actuel: ${PROJET_ACTUEL}"
```

### **RÈGLE 3: DELEGATION INTELLIGENTE**
- **CRITIQUE**: NEXIA gère directement
- **URGENT**: Coordination via session-sync
- **IMPORTANT**: Planification différée
- **MAINTENANCE**: Scripts automatisés
- **INNOVATION**: Backlog documenté

### **RÈGLE 4: ESCALATION AUTOMATIQUE**
```bash
# Si projet CRITIQUE bloqué > 2H:
ESCALATION="Demander aide Ludovic"
ALTERNATIVE="Proposer plan B immédiat" 
```

## 📊 SYSTÈME DE SUIVI

### **STATUS HEADER OBLIGATOIRE:**
```
🎯 FOCUS: [PROJET] | STATUS: [ÉTAPE] | DEADLINE: [TEMPS]
```

### **MULTI-PROJETS COORDINATION:**
```
/NEXIA/project-priority-queue/
├── 01-CRITIQUE-fastcash.md
├── 02-URGENT-mautic-config.md  
├── 03-IMPORTANT-site-migration.md
└── 99-BACKLOG-innovations.md
```

## 🔄 WORKFLOW ANTI-DISPERSION

### **DÉBUT DE SESSION:**
1. ✅ Lire project-priority-queue/
2. ✅ Identifier PROJET #1 CRITIQUE
3. ✅ Afficher FOCUS HEADER
4. ✅ Ignorer tout le reste

### **PENDANT CONVERSATION:**
1. ✅ Chaque réponse = mention projet actuel
2. ❌ Questions hors-sujet = redirect focus
3. ✅ Multitâche uniquement si même projet
4. ⚠️ Blockers = escalation immédiate

### **FIN DE SESSION:**
1. ✅ Update status projet actuel
2. ✅ Planning next actions
3. ✅ Signaler via session-sync
4. ✅ Maintenir priorité pour prochaine session

## 🎯 EXCEPTIONS AUTORISÉES

### **CHANGEMENT DE FOCUS SI:**
- ✅ Projet CRITIQUE résolu
- ✅ Nouveau projet plus CRITIQUE apparaît
- ✅ Ludovic demande explicitement switch
- ❌ Jamais par curiosité/intérêt technique

### **INTERRUPTIONS ACCEPTÉES:**
- 🚨 Alertes système critiques
- 💰 Opportunités financières immédiates  
- 🔥 Urgences business validées par Ludovic
- ❌ Pas d'explorations techniques "intéressantes"

## 📈 MÉTRIQUES FOCUS

### **KPIs À SURVEILLER:**
- Temps sur projet prioritaire: >80%
- Switches de contexte: <3/jour
- Projets CRITIQUES résolus: 100%
- Délais respectés: >90%

### **ALERTES AUTO:**
```bash
# Si NEXIA dérive du focus:
if context_switches > 3; then
    alert "🚨 FOCUS DRIFT - Retour projet prioritaire requis"
fi
```

---

## 🎯 FOCUS ACTUEL - FASTCASH

**PROJET:** Location sous-domaines premium  
**DEADLINE:** 24-48H  
**OBJECTIF:** 15K€-25K€  
**ÉTAPE:** Configuration ICP Apollo + Pipeline Mautic  
**NEXT:** Définir clients types domaines  

**RÈGLE:** Tout sujet ≠ FASTCASH = Redirect ou différé