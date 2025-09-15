#!/bin/bash

# Gestionnaire du système de sauvegarde des sessions Terminal
# Commandes: start, stop, status, test, logs, clean

set -euo pipefail

SCRIPT_DIR="/Users/ludovicpilet/PROJECTS/NEXIA/scripts"
BACKUP_DIR="/Users/ludovicpilet/PROJECTS/NEXIA/Historiques_sessions_terminal"
PLIST_FILE="/Users/ludovicpilet/Library/LaunchAgents/com.nexia.terminal-backup.plist"
SERVICE_NAME="com.nexia.terminal-backup"

show_usage() {
    echo "Usage: $0 {start|stop|restart|status|test|logs|clean|install}"
    echo
    echo "Commandes:"
    echo "  start    - Démarrer la sauvegarde automatique"
    echo "  stop     - Arrêter la sauvegarde automatique" 
    echo "  restart  - Redémarrer le service"
    echo "  status   - Afficher l'état du service"
    echo "  test     - Tester une sauvegarde manuelle"
    echo "  logs     - Afficher les logs"
    echo "  clean    - Nettoyer les anciens fichiers"
    echo "  install  - Réinstaller le service"
}

start_service() {
    echo "🚀 Démarrage du service de sauvegarde Terminal..."
    
    if launchctl list | grep -q "$SERVICE_NAME"; then
        echo "⚠️  Service déjà actif"
    else
        launchctl load "$PLIST_FILE"
        echo "✅ Service démarré avec succès"
    fi
    
    sleep 2
    show_status
}

stop_service() {
    echo "🛑 Arrêt du service de sauvegarde Terminal..."
    
    if launchctl list | grep -q "$SERVICE_NAME"; then
        launchctl unload "$PLIST_FILE"
        echo "✅ Service arrêté avec succès"
    else
        echo "⚠️  Service déjà arrêté"
    fi
}

restart_service() {
    echo "🔄 Redémarrage du service..."
    stop_service
    sleep 1
    start_service
}

show_status() {
    echo "📊 État du service de sauvegarde Terminal:"
    echo "================================================"
    
    if launchctl list | grep -q "$SERVICE_NAME"; then
        echo "✅ Service: ACTIF"
        
        # Obtenir les détails du service
        local service_info
        service_info=$(launchctl list | grep "$SERVICE_NAME")
        echo "📋 Info service: $service_info"
        
    else
        echo "❌ Service: INACTIF"
    fi
    
    echo
    echo "📁 Répertoire de sauvegarde: $BACKUP_DIR"
    
    if [[ -d "$BACKUP_DIR" ]]; then
        local file_count
        file_count=$(find "$BACKUP_DIR" -name "*.txt" -type f | wc -l | tr -d ' ')
        echo "📄 Fichiers de sauvegarde: $file_count"
        
        if [[ $file_count -gt 0 ]]; then
            echo "🕒 Dernier fichier:"
            ls -lt "$BACKUP_DIR"/*.txt 2>/dev/null | head -1 | awk '{print "   " $9 " (" $6 " " $7 " " $8 ")"}'
        fi
    else
        echo "❌ Répertoire de sauvegarde inexistant"
    fi
    
    echo
    echo "📜 Fichier configuration: $PLIST_FILE"
    [[ -f "$PLIST_FILE" ]] && echo "✅ Configuration: OK" || echo "❌ Configuration: MANQUANTE"
}

test_backup() {
    echo "🧪 Test de sauvegarde manuelle..."
    echo "=================================="
    
    # Forcer une exécution manuelle
    "$SCRIPT_DIR/terminal-session-backup.sh"
    
    echo
    echo "📊 Résultat du test:"
    show_status
}

show_logs() {
    echo "📜 Logs du système de sauvegarde:"
    echo "=================================="
    
    # Log principal du script
    if [[ -f "$SCRIPT_DIR/terminal-backup.log" ]]; then
        echo "--- Log principal (20 dernières lignes) ---"
        tail -20 "$SCRIPT_DIR/terminal-backup.log"
    fi
    
    echo
    
    # Logs LaunchAgent
    if [[ -f "$SCRIPT_DIR/terminal-backup-stdout.log" ]]; then
        echo "--- Log stdout LaunchAgent ---"
        tail -10 "$SCRIPT_DIR/terminal-backup-stdout.log" 2>/dev/null || echo "Aucun log stdout"
    fi
    
    if [[ -f "$SCRIPT_DIR/terminal-backup-stderr.log" ]]; then
        echo "--- Log stderr LaunchAgent ---"
        tail -10 "$SCRIPT_DIR/terminal-backup-stderr.log" 2>/dev/null || echo "Aucun log stderr"
    fi
}

clean_old_files() {
    echo "🧹 Nettoyage des anciens fichiers..."
    
    local before_count
    before_count=$(find "$BACKUP_DIR" -name "*.txt" -type f | wc -l | tr -d ' ')
    
    # Supprimer les fichiers de plus de 30 jours
    find "$BACKUP_DIR" -name "*.txt" -type f -mtime +30 -delete 2>/dev/null
    
    local after_count
    after_count=$(find "$BACKUP_DIR" -name "*.txt" -type f | wc -l | tr -d ' ')
    
    local deleted_count=$((before_count - after_count))
    
    echo "✅ Nettoyage terminé:"
    echo "   Fichiers supprimés: $deleted_count"
    echo "   Fichiers restants: $after_count"
}

install_service() {
    echo "📦 Installation/Réinstallation du service..."
    
    # Arrêter le service s'il existe
    if launchctl list | grep -q "$SERVICE_NAME"; then
        launchctl unload "$PLIST_FILE"
    fi
    
    # Vérifier que tous les fichiers existent
    if [[ ! -f "$SCRIPT_DIR/terminal-session-backup.sh" ]]; then
        echo "❌ Erreur: Script principal manquant: $SCRIPT_DIR/terminal-session-backup.sh"
        exit 1
    fi
    
    if [[ ! -f "$PLIST_FILE" ]]; then
        echo "❌ Erreur: Fichier plist manquant: $PLIST_FILE"
        exit 1
    fi
    
    # Créer les répertoires nécessaires
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$SCRIPT_DIR"
    
    # Rendre les scripts exécutables
    chmod +x "$SCRIPT_DIR/terminal-session-backup.sh"
    chmod +x "$0"
    
    # Charger le service
    launchctl load "$PLIST_FILE"
    
    echo "✅ Installation terminée avec succès"
    
    sleep 2
    show_status
}

# Point d'entrée principal
case "${1:-}" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    status)
        show_status
        ;;
    test)
        test_backup
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_old_files
        ;;
    install)
        install_service
        ;;
    *)
        show_usage
        exit 1
        ;;
esac