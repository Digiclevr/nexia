# 🔄 NEXIA SESSION SYNC SYSTEM

## 📋 PRINCIPE

**SYNCHRONISATION VIA FICHIERS .MD** entre sessions Claude Code multiples

## 📁 STRUCTURE DOSSIERS

```
/Users/ludovicpilet/PROJECTS/NEXIA/session-sync/
├── README.md                 # Ce guide
├── session-registry.md       # Liste sessions actives
├── mautic-status.md         # Status configuration Mautic
├── apollo-status.md         # Status Apollo + API
├── fastcash-pipeline.md     # Pipeline complet FASTCASH
└── shared-commands.sh       # Commandes partagées
```

## 🔧 INSTRUCTIONS POUR CHAQUE SESSION

### **SESSION QUI ÉCRIT (PRODUCTEUR):**

```bash
# 1. Mettre à jour le status
echo "## MAUTIC STATUS - $(date)" > session-sync/mautic-status.md
echo "- Installation: ✅ Terminée" >> session-sync/mautic-status.md
echo "- SMTP: ⏳ En cours" >> session-sync/mautic-status.md
echo "- Campagne FASTCASH: ❌ Pas créée" >> session-sync/mautic-status.md

# 2. Signal aux autres sessions
touch session-sync/.mautic-updated
```

### **SESSION QUI LIT (CONSOMMATEUR):**

```bash
# 1. Vérifier updates
if [[ -f session-sync/.mautic-updated ]]; then
    echo "🔄 Mautic updated - Reading status..."
    cat session-sync/mautic-status.md
    rm session-sync/.mautic-updated
fi

# 2. Lecture régulière
watch -n 30 'cat session-sync/fastcash-pipeline.md'
```

## 📝 TEMPLATES STATUS

### **TEMPLATE MAUTIC:**
```markdown
## MAUTIC STATUS - {{TIMESTAMP}}

**INFRASTRUCTURE:**
- URL: https://mautic.blueocean.local
- Database: ✅/❌
- SMTP: ✅/❌

**FASTCASH SETUP:**
- Segment créé: ✅/❌
- Templates emails: ✅/❌
- Landing pages: ✅/❌
- API Apollo intégrée: ✅/❌

**ACTIONS REQUISES:**
- [ ] Action 1
- [ ] Action 2

**NEXT SESSION:** Nom session suivante
```

### **TEMPLATE APOLLO:**
```markdown  
## APOLLO STATUS - {{TIMESTAMP}}

**CONFIGURATION:**
- API Key: ✅ HN8xpRGN-TcZKqDTFZB0yw
- Plan: Basic (2,500 crédits)
- Export testé: ✅/❌

**PROSPECTION:**
- ICPs exportées: {{NUMBER}}
- Segments: {{LIST}}
- Qualité données: {{SCORE}}

**INTEGRATION:**
- Mautic sync: ✅/❌
- Webhook configuré: ✅/❌

**NEXT SESSION:** Nom session suivante
```

## ⚡ COMMANDES RAPIDES

### **POUR NEXIA (COORDINATEUR):**
```bash
# Lecture status global
cat session-sync/*.md | grep -E "Status|✅|❌|⏳"

# Dernières updates
ls -la session-sync/.* | head -5

# Reset sync
rm session-sync/.*-updated
```

### **POUR SESSIONS TECHNIQUES:**
```bash
# Update rapide status
echo "Status: $(date) - Task completed" >> session-sync/mon-projet-status.md

# Notification other sessions  
touch session-sync/.pipeline-updated

# Check dependencies
grep -l "❌" session-sync/*.md
```

## 🚨 CONVENTIONS IMPORTANTES

### **NAMING:**
- `session-sync/{{projet}}-status.md`
- `.{{projet}}-updated` pour signaler
- Timestamps obligatoires

### **STATUS CODES:**
- ✅ = Terminé/OK
- ❌ = Erreur/Manquant  
- ⏳ = En cours
- 🔄 = À synchroniser

### **DEPENDENCIES:**
- Toujours indiquer **NEXT SESSION** 
- Bloquer si dépendances ❌
- Documenter **ACTIONS REQUISES**

## 📊 MONITORING

### **HEALTHCHECK SYNC:**
```bash
# Script à lancer toutes les 5min
./session-sync/healthcheck-sync.sh
```

### **ALERTES AUTO:**
```bash
# Si fichier pas updated depuis 30min
find session-sync -name "*.md" -mmin +30
```

---

**🎯 USAGE:** Chaque session Claude Code utilise ce système pour coordination
**🔄 UPDATE:** Fichiers mis à jour en temps réel  
**👁️ MONITORING:** NEXIA supervise tous les status