#!/bin/bash

# Script de sauvegarde automatique des sessions Terminal actives
# Auteur: Claude Code Assistant
# Date: $(date '+%Y-%m-%d')
# Destination: /Users/ludovicpilet/PROJECTS/NEXIA/Historiques_sessions_terminal

set -euo pipefail

# Configuration
BACKUP_DIR="/Users/ludovicpilet/PROJECTS/NEXIA/Historiques_sessions_terminal"
LOG_FILE="/Users/ludovicpilet/PROJECTS/NEXIA/scripts/terminal-backup.log"
DATE_FORMAT=$(date '+%m-%d-%Y')  # Format américain MM-DD-YYYY
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Fonction de logging
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Fonction principale de sauvegarde
backup_terminal_sessions() {
    log "=== DÉBUT SAUVEGARDE SESSIONS TERMINAL ==="
    
    # Créer le répertoire de backup s'il n'existe pas
    mkdir -p "$BACKUP_DIR"
    
    # Obtenir la liste de toutes les applications Terminal actives
    local terminal_apps=("Terminal" "iTerm")
    local session_count=0
    
    for app in "${terminal_apps[@]}"; do
        # Vérifier si l'application est active  
        if pgrep -f "$app" > /dev/null 2>&1; then
            log "Application $app détectée comme active"
            
            case "$app" in
                "Terminal")
                    backup_terminal_app_sessions
                    ;;
                "iTerm")
                    backup_iterm_sessions
                    ;;
            esac
        else
            log "Application $app non active - ignorée"
        fi
    done
    
    log "=== FIN SAUVEGARDE - $session_count sessions traitées ==="
}

# Sauvegarde spécifique pour Terminal.app - TOUTES LES FENÊTRES
backup_terminal_app_sessions() {
    log "Sauvegarde des sessions Terminal.app"
    
    # Obtenir le nombre de fenêtres Terminal ouvertes
    local window_count
    window_count=$(osascript -e 'tell application "Terminal" to get count of windows' 2>/dev/null || echo "0")
    
    log "Détecté $window_count fenêtres Terminal ouvertes"
    
    if [[ $window_count -eq 0 ]]; then
        log "Aucune fenêtre Terminal trouvée"
        return
    fi
    
    # Récupérer l'historique global des commandes une seule fois
    local terminal_history=""
    if [[ -f "$HOME/.bash_history" ]]; then
        terminal_history=$(tail -50 "$HOME/.bash_history" 2>/dev/null || echo "No bash history")
    elif [[ -f "$HOME/.zsh_history" ]]; then
        terminal_history=$(tail -50 "$HOME/.zsh_history" 2>/dev/null || echo "No zsh history")
    else
        terminal_history="No shell history found"
    fi
    
    # Boucler sur chaque fenêtre Terminal
    for ((i=1; i<=window_count; i++)); do
        log "Traitement de la fenêtre Terminal $i/$window_count"
        
        # Récupérer le nom de cette fenêtre spécifique
        local window_name
        window_name=$(osascript -e "tell application \"Terminal\" to get name of window $i" 2>/dev/null || echo "Terminal_Window_$i")
        
        # Nettoyer le nom de fenêtre pour en faire un nom de fichier valide
        local clean_name
        clean_name=$(echo "$window_name" | sed 's/[^a-zA-Z0-9._-]/_/g' | cut -c1-50)
        
        # Récupérer les informations spécifiques à cette fenêtre
        local tab_count
        tab_count=$(osascript -e "tell application \"Terminal\" to get count of tabs of window $i" 2>/dev/null || echo "1")
        
        local tabs_info=""
        for ((j=1; j<=tab_count; j++)); do
            local tab_name
            tab_name=$(osascript -e "tell application \"Terminal\" to get name of tab $j of window $i" 2>/dev/null || echo "Tab_$j")
            tabs_info="$tabs_info\n  Tab $j: $tab_name"
        done
        
        # Créer le fichier de sauvegarde avec nom unique par fenêtre
        local session_name="Terminal_Window${i}_${clean_name}"
        local filename="${session_name}_${DATE_FORMAT}.txt"
        local filepath="$BACKUP_DIR/$filename"
        
        {
            echo "=== SAUVEGARDE FENÊTRE TERMINAL $i ==="
            echo "Date: $(date)"
            echo "Application: Terminal.app"
            echo "Fenêtre: $i/$window_count"
            echo "Nom de fenêtre: $window_name"
            echo "Nombre d'onglets: $tab_count"
            echo "======================================"
            echo
            echo "=== INFORMATIONS ONGLETS ==="
            echo -e "$tabs_info"
            echo
            echo "=== HISTORIQUE SHELL GLOBAL (50 dernières commandes) ==="
            echo "$terminal_history"
            echo
            echo "=== PROCESSUS TERMINAL ACTIFS ==="
            ps aux | grep -E "Terminal" | grep -v grep
            echo
            echo "=== VARIABLES D'ENVIRONNEMENT COURANTES ==="
            echo "USER: $USER"
            echo "HOME: $HOME" 
            echo "SHELL: $SHELL"
            echo "PWD: $PWD"
            echo "PATH: $PATH"
            echo
            echo "=== SESSIONS TTY ACTIVES ==="
            who
        } > "$filepath"
        
        log "Fenêtre Terminal $i sauvegardée: $filepath"
        session_count=$((session_count + 1))
    done
    
    log "Sauvegarde terminée: $session_count fenêtres Terminal traitées"
}

# Sauvegarde spécifique pour iTerm2
backup_iterm_sessions() {
    log "Sauvegarde des sessions iTerm"
    
    # AppleScript pour iTerm2
    local applescript='
    tell application "iTerm"
        set sessionList to {}
        repeat with currentWindow in windows
            repeat with currentTab in tabs of currentWindow
                repeat with currentSession in sessions of currentTab
                    try
                        set sessionName to name of currentSession
                        set sessionContents to contents of currentSession
                        set end of sessionList to {sessionName:sessionName, contents:sessionContents}
                    on error
                        -- Ignorer les erreurs
                    end try
                end repeat
            end repeat
        end repeat
        return sessionList
    end tell'
    
    local session_info
    session_info=$(osascript -e "$applescript" 2>/dev/null || echo "")
    
    if [[ -n "$session_info" ]]; then
        local session_name="iTerm_Session"
        local filename="${session_name}_${DATE_FORMAT}.txt"
        local filepath="$BACKUP_DIR/$filename"
        
        {
            echo "=== SAUVEGARDE SESSION ITERM ==="
            echo "Date: $(date)"
            echo "Application: iTerm2"
            echo "====================================="
            echo
            echo "$session_info"
            echo
            echo "=== PROCESSUS ACTIFS ==="
            ps aux | grep -E "(bash|zsh|fish|sh)" | grep -v grep
        } > "$filepath"
        
        log "Session iTerm sauvegardée: $filepath"
        ((session_count++))
    fi
}

# Fonction de nettoyage des anciens backups (garde les 30 derniers jours)
cleanup_old_backups() {
    log "Nettoyage des anciens backups (>30 jours)"
    
    find "$BACKUP_DIR" -name "*.txt" -type f -mtime +30 -delete 2>/dev/null || true
    
    local remaining_files
    remaining_files=$(find "$BACKUP_DIR" -name "*.txt" -type f | wc -l)
    log "Nettoyage terminé - $remaining_files fichiers conservés"
}

# Fonction de sauvegarde améliorée avec détection des sessions actives
backup_active_terminal_sessions() {
    log "Détection avancée des sessions Terminal actives"
    
    # Obtenir tous les processus Terminal avec leurs TTY
    local terminal_processes
    terminal_processes=$(ps -eo pid,ppid,tty,comm,args | grep -E "(Terminal|iTerm)" | grep -v grep)
    
    if [[ -n "$terminal_processes" ]]; then
        # Pour chaque session détectée
        while IFS= read -r process_line; do
            # Extraire les informations du processus
            local pid=$(echo "$process_line" | awk '{print $1}')
            local tty=$(echo "$process_line" | awk '{print $3}')
            local command=$(echo "$process_line" | awk '{print $4}')
            
            if [[ "$tty" != "??" ]]; then  # Session active avec TTY
                local session_name="${command}_${tty//\//_}"
                local filename="${session_name}_${DATE_FORMAT}.txt"
                local filepath="$BACKUP_DIR/$filename"
                
                {
                    echo "=== SAUVEGARDE SESSION ACTIVE ==="
                    echo "Date: $(date)"
                    echo "PID: $pid"
                    echo "TTY: $tty"
                    echo "Command: $command"
                    echo "======================================"
                    echo
                    echo "=== HISTORIQUE SHELL ==="
                    # Tenter de récupérer l'historique du shell
                    if [[ -f "$HOME/.bash_history" ]]; then
                        echo "--- Bash History (50 dernières lignes) ---"
                        tail -50 "$HOME/.bash_history" 2>/dev/null || echo "Impossible de lire l'historique bash"
                    fi
                    if [[ -f "$HOME/.zsh_history" ]]; then
                        echo "--- Zsh History (50 dernières lignes) ---"
                        tail -50 "$HOME/.zsh_history" 2>/dev/null || echo "Impossible de lire l'historique zsh"
                    fi
                    echo
                    echo "=== INFORMATIONS PROCESSUS ==="
                    echo "$process_line"
                    echo
                    echo "=== VARIABLES D'ENVIRONNEMENT ==="
                    # Tenter de récupérer les variables d'environnement du processus
                    cat "/proc/$pid/environ" 2>/dev/null | tr '\0' '\n' | sort || echo "Variables d'environnement non disponibles"
                } > "$filepath"
                
                log "Session active sauvegardée: $filepath (PID: $pid, TTY: $tty)"
                ((session_count++))
            fi
        done <<< "$terminal_processes"
    else
        log "Aucune session Terminal active détectée"
    fi
}

# Point d'entrée principal
main() {
    log "Démarrage du script de sauvegarde des sessions Terminal"
    
    # Vérifier que le répertoire de backup existe
    if [[ ! -d "$BACKUP_DIR" ]]; then
        mkdir -p "$BACKUP_DIR"
        log "Répertoire de backup créé: $BACKUP_DIR"
    fi
    
    # Effectuer la sauvegarde
    backup_terminal_sessions
    backup_active_terminal_sessions
    
    # Nettoyage des anciens fichiers
    cleanup_old_backups
    
    log "Script terminé avec succès"
}

# Gestion des erreurs
trap 'log "ERREUR: Script interrompu à la ligne $LINENO"; exit 1' ERR

# Exécution
main "$@"