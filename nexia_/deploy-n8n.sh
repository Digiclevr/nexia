#!/bin/bash

# Script de déploiement n8n pour Nextstep
# Auteur: BlueOcean Team
# Date: $(date +%Y-%m-%d)

set -e

echo "
╔═══════════════════════════════════════════════════════════╗
║                  n8n Deployment for Nextstep              ║
║                      AI Agent Factory                     ║
╚═══════════════════════════════════════════════════════════╝
"

# Variables
NEXTSTEP_DIR="/Users/ludovicpilet/Documents/blueocean.nosync/nextstep/nexia"
K8S_DIR="$NEXTSTEP_DIR/k8s"
N8N_PORT=6010
ORCHESTRATOR_PORT=6011

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonctions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl n'est pas installé"
        exit 1
    fi
    
    # Connexion au cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Pas de connexion au cluster Kubernetes"
        exit 1
    fi
    
    # Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    log_info "✅ Tous les prérequis sont satisfaits"
}

# Création de la structure
create_structure() {
    log_info "Création de la structure des dossiers..."
    
    mkdir -p "$K8S_DIR/n8n"
    mkdir -p "$NEXTSTEP_DIR/services/agent-orchestrator"
    mkdir -p "$NEXTSTEP_DIR/workflows"
    
    log_info "✅ Structure créée"
}

# Déploiement n8n
deploy_n8n() {
    log_info "Déploiement de n8n..."
    
    # Namespace
    kubectl create namespace nextstep --dry-run=client -o yaml | kubectl apply -f -
    
    # Application des manifests
    kubectl apply -f "$K8S_DIR/n8n-deployment.yaml"
    
    # Attente du déploiement
    log_info "Attente du démarrage de n8n (cela peut prendre quelques minutes)..."
    kubectl wait --for=condition=available --timeout=300s deployment/n8n -n nextstep || {
        log_error "Le déploiement n8n a échoué"
        kubectl logs -n nextstep -l app=n8n --tail=50
        exit 1
    }
    
    log_info "✅ n8n déployé avec succès"
}

# Import des workflows
import_workflows() {
    log_info "Import des workflows de base..."
    
    # Attendre que n8n soit complètement démarré
    sleep 30
    
    # TODO: Implémenter l'import via l'API n8n
    log_warn "Import manuel nécessaire via l'interface n8n"
    log_info "Workflows disponibles dans: $NEXTSTEP_DIR/docs/n8n-workflow-examples.md"
}

# Configuration finale
final_setup() {
    log_info "Configuration finale..."
    
    # Récupération des infos
    N8N_POD=$(kubectl get pods -n nextstep -l app=n8n -o jsonpath='{.items[0].metadata.name}')
    
    echo "
╔═══════════════════════════════════════════════════════════╗
║                    🎉 Déploiement réussi!                 ║
╚═══════════════════════════════════════════════════════════╝

📍 URLs d'accès:
   - n8n: https://n8n.blueocean.local
   - Port interne: $N8N_PORT
   - Agent Orchestrator: http://localhost:$ORCHESTRATOR_PORT

🔐 Credentials:
   - Utilisateur: nextstep_admin
   - Mot de passe: [défini dans les secrets K8s]

📊 Monitoring:
   - Pod: $N8N_POD
   - Logs: kubectl logs -n nextstep $N8N_POD -f

📚 Documentation:
   - Analyse: $NEXTSTEP_DIR/docs/n8n-integration-analysis.md
   - Workflows: $NEXTSTEP_DIR/docs/n8n-workflow-examples.md
   - Déploiement: $NEXTSTEP_DIR/docs/n8n-deployment-plan.md

🚀 Prochaines étapes:
   1. Se connecter à n8n
   2. Importer les workflows de base
   3. Configurer les credentials (OpenAI, etc.)
   4. Tester le workflow Focus Guardian
   5. Intégrer avec Nexia

💡 Tips:
   - Port-forward local: kubectl port-forward -n nextstep svc/n8n-service 6010:6010
   - Debug: kubectl describe pod -n nextstep $N8N_POD
"
}

# Menu principal
show_menu() {
    echo "
Que souhaitez-vous faire?

1) Installation complète
2) Déployer uniquement n8n
3) Importer les workflows
4) Vérifier le statut
5) Voir les logs
6) Quitter
"
    read -p "Choix: " choice
    
    case $choice in
        1)
            check_prerequisites
            create_structure
            deploy_n8n
            import_workflows
            final_setup
            ;;
        2)
            check_prerequisites
            deploy_n8n
            ;;
        3)
            import_workflows
            ;;
        4)
            kubectl get all -n nextstep
            kubectl get ingress -n nextstep
            ;;
        5)
            N8N_POD=$(kubectl get pods -n nextstep -l app=n8n -o jsonpath='{.items[0].metadata.name}')
            kubectl logs -n nextstep $N8N_POD -f
            ;;
        6)
            exit 0
            ;;
        *)
            log_error "Choix invalide"
            show_menu
            ;;
    esac
}

# Execution
if [ "$1" == "--auto" ]; then
    # Mode automatique pour CI/CD
    check_prerequisites
    create_structure
    deploy_n8n
    import_workflows
    final_setup
else
    # Mode interactif
    show_menu
fi