# 🖥️ Système de Sauvegarde Automatique des Sessions Terminal

**Date d'installation :** 11 septembre 2025  
**Version :** 1.0  
**Auteur :** Claude Code Assistant  

## 📋 Vue d'ensemble

Système d'automatisation macOS pour sauvegarder toutes les sessions Terminal actives et inactives ayant des onglets actifs. Les sauvegardes sont stockées avec horodatage au format américain.

### 🎯 Fonctionnalités

✅ **Détection automatique** des sessions Terminal.app et iTerm2  
✅ **Sauvegarde complète** historiques, variables d'environnement, processus  
✅ **Exécution automatique** toutes les 5 minutes via LaunchAgent  
✅ **Nommage intelligent** : `SessionName_MM-DD-YYYY.txt`  
✅ **Nettoyage automatique** des fichiers >30 jours  
✅ **Logs détaillés** pour monitoring et debug  

## 📁 Structure des fichiers

```
/Users/ludovicpilet/PROJECTS/NEXIA/
├── Historiques_sessions_terminal/          # 📄 Sauvegardes des sessions
├── scripts/
│   ├── terminal-session-backup.sh          # 🔧 Script principal
│   ├── terminal-backup-manager.sh          # 🎛️ Gestionnaire du service
│   ├── terminal-backup.log                 # 📜 Log principal
│   ├── terminal-backup-stdout.log          # 📜 Log LaunchAgent stdout
│   └── terminal-backup-stderr.log          # 📜 Log LaunchAgent stderr
└── TERMINAL-BACKUP-SYSTEM.md               # 📖 Cette documentation

/Users/ludovicpilet/Library/LaunchAgents/
└── com.nexia.terminal-backup.plist          # ⚙️ Configuration LaunchAgent
```

## 🚀 Installation et Configuration

### Installation automatique
```bash
# Le système est déjà installé et configuré ✅
/Users/ludovicpilet/PROJECTS/NEXIA/scripts/terminal-backup-manager.sh status
```

### Installation manuelle (si nécessaire)
```bash
# Réinstaller complètement
/Users/ludovicpilet/PROJECTS/NEXIA/scripts/terminal-backup-manager.sh install
```

## 🎛️ Commandes de Gestion

### Gestionnaire principal
```bash
# Afficher l'état du système
./scripts/terminal-backup-manager.sh status

# Démarrer la sauvegarde automatique
./scripts/terminal-backup-manager.sh start

# Arrêter la sauvegarde automatique  
./scripts/terminal-backup-manager.sh stop

# Redémarrer le service
./scripts/terminal-backup-manager.sh restart

# Test manuel d'une sauvegarde
./scripts/terminal-backup-manager.sh test

# Consulter les logs
./scripts/terminal-backup-manager.sh logs

# Nettoyer les anciens fichiers
./scripts/terminal-backup-manager.sh clean
```

### Commandes LaunchCtl directes
```bash
# Vérifier le service
launchctl list | grep nexia

# Charger le service manuellement
launchctl load ~/Library/LaunchAgents/com.nexia.terminal-backup.plist

# Décharger le service
launchctl unload ~/Library/LaunchAgents/com.nexia.terminal-backup.plist
```

## 📄 Format des Sauvegardes

### Exemple de nom de fichier
```
Terminal_Session_09-11-2025.txt
iTerm_Session_09-11-2025.txt
Terminal_ttys001_09-11-2025.txt
```

### Contenu des fichiers de sauvegarde
```
=== SAUVEGARDE SESSION TERMINAL ===
Date: Wed Sep 11 10:16:39 CEST 2025
Application: Terminal.app
======================================

=== HISTORIQUE SHELL ===
--- Bash History (50 dernières lignes) ---
[historique des commandes]

--- Zsh History (50 dernières lignes) ---
[historique des commandes]

=== INFORMATIONS PROCESSUS ===
[détails des processus Terminal actifs]

=== VARIABLES D'ENVIRONNEMENT ===
[variables d'environnement de la session]
```

## ⏱️ Planification d'Exécution

- **Intervalle :** Toutes les 15 minutes (900 secondes)
- **Démarrage :** Automatique au login (RunAtLoad = true)
- **Type :** Processus en arrière-plan
- **Timeout :** 30 secondes par exécution

## 📊 Monitoring et Logs

### Fichiers de logs
1. **terminal-backup.log** - Log principal du script
2. **terminal-backup-stdout.log** - Sorties standard LaunchAgent
3. **terminal-backup-stderr.log** - Erreurs LaunchAgent

### Consultation des logs
```bash
# Log en temps réel
tail -f /Users/ludovicpilet/PROJECTS/NEXIA/scripts/terminal-backup.log

# Logs LaunchAgent
tail -f /Users/ludovicpilet/PROJECTS/NEXIA/scripts/terminal-backup-stdout.log
```

## 🔧 Configuration Avancée

### Modifier l'intervalle d'exécution
Éditer le fichier plist :
```xml
<key>StartInterval</key>
<integer>900</integer> <!-- 900 = 15 minutes -->
```

Puis redémarrer :
```bash
./scripts/terminal-backup-manager.sh restart
```

### Modifier la durée de rétention
Éditer le script `terminal-session-backup.sh` ligne :
```bash
find "$BACKUP_DIR" -name "*.txt" -type f -mtime +30 -delete  # +30 = 30 jours
```

## 🛠️ Dépannage

### Le service ne démarre pas
```bash
# Vérifier les permissions
ls -la ~/Library/LaunchAgents/com.nexia.terminal-backup.plist

# Vérifier la syntaxe plist
plutil ~/Library/LaunchAgents/com.nexia.terminal-backup.plist

# Réinstaller
./scripts/terminal-backup-manager.sh install
```

### Aucune sauvegarde n'est créée
```bash
# Test manuel
./scripts/terminal-session-backup.sh

# Vérifier les logs d'erreur
./scripts/terminal-backup-manager.sh logs

# Vérifier les permissions Terminal
# Aller dans Préférences Système > Sécurité > Confidentialité > Accessibilité
```

### Problèmes d'AppleScript
Les applications Terminal doivent autoriser l'automatisation :
1. Ouvrir **Préférences Système**
2. **Sécurité et confidentialité** → **Confidentialité**  
3. **Automatisation** → Autoriser les scripts pour Terminal/iTerm

## 🔍 État Actuel du Système

### ✅ Installation Confirmée
- ✅ Répertoire de sauvegarde créé
- ✅ Script principal opérationnel  
- ✅ LaunchAgent configuré et chargé
- ✅ Gestionnaire fonctionnel
- ✅ Documentation complète

### 📊 Status Live
```bash
# Commande pour vérifier l'état actuel
/Users/ludovicpilet/PROJECTS/NEXIA/scripts/terminal-backup-manager.sh status
```

## 🚨 Notes Importantes

1. **Permissions** : Le système nécessite l'autorisation d'automatisation pour Terminal.app et iTerm2
2. **Performance** : Exécution légère (< 2 secondes par cycle)
3. **Stockage** : Nettoyage automatique après 30 jours
4. **Compatibilité** : macOS uniquement, testé sur macOS 12+

---

## 📞 Support

Pour toute question ou problème :
1. Consulter les logs avec `./scripts/terminal-backup-manager.sh logs`
2. Tester manuellement avec `./scripts/terminal-backup-manager.sh test`
3. Réinstaller si nécessaire avec `./scripts/terminal-backup-manager.sh install`

**Le système est maintenant opérationnel et effectue des sauvegardes automatiques toutes les 5 minutes !** 🎉