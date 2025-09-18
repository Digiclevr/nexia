#!/bin/bash

# Script de déploiement des améliorations PostgreSQL
# Usage: ./deploy-postgres-improvements.sh [--dry-run] [--component=all|upgrade|monitoring|backup|security]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DRY_RUN=false
COMPONENT="all"

# Parse arguments
for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --component=*)
            COMPONENT="${arg#*=}"
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--dry-run] [--component=all|upgrade|monitoring|backup|security]"
            echo ""
            echo "Options:"
            echo "  --dry-run              Show what would be deployed without actually deploying"
            echo "  --component=COMP       Deploy only specific component (all,upgrade,monitoring,backup,security)"
            echo "  -h, --help             Show this help message"
            exit 0
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to execute kubectl command
execute_kubectl() {
    local cmd="$1"
    local description="$2"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "DRY RUN: Would execute: $cmd"
        return 0
    fi
    
    log_info "$description"
    if eval "$cmd"; then
        log_success "$description completed"
    else
        log_error "$description failed"
        return 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    # Check cluster connectivity
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    # Check if we're in the right cluster
    CURRENT_CONTEXT=$(kubectl config current-context)
    if [[ "$CURRENT_CONTEXT" != *"blueocean"* ]]; then
        log_warning "Current context is '$CURRENT_CONTEXT', not blueocean cluster"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    log_success "Prerequisites check passed"
}

# Create necessary namespaces
create_namespaces() {
    log_info "Creating necessary namespaces..."
    
    execute_kubectl "kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -" \
        "Creating monitoring namespace"
}

# Deploy PostgreSQL version upgrades
deploy_upgrades() {
    log_info "Deploying PostgreSQL version upgrades..."
    
    # Backup avant upgrade
    log_warning "IMPORTANT: Creating backup before upgrade"
    execute_kubectl "kubectl create job postgres-pre-upgrade-backup --from=cronjob/postgres-backup-central -n platform" \
        "Creating pre-upgrade backup job"
    
    # Wait for backup to complete
    if [ "$DRY_RUN" = false ]; then
        log_info "Waiting for backup to complete..."
        kubectl wait --for=condition=complete job/postgres-pre-upgrade-backup -n platform --timeout=1800s
        log_success "Pre-upgrade backup completed"
    fi
    
    # Apply upgrades
    execute_kubectl "kubectl apply -f $PROJECT_DIR/postgres-upgrades/postgres-central-v15.yaml" \
        "Upgrading postgres-central to PostgreSQL 15"
    
    execute_kubectl "kubectl apply -f $PROJECT_DIR/postgres-upgrades/postgres-kong-v15.yaml" \
        "Upgrading postgres-kong to PostgreSQL 15"
    
    # Wait for rollout
    if [ "$DRY_RUN" = false ]; then
        log_info "Waiting for PostgreSQL central rollout..."
        kubectl rollout status statefulset/postgres-central -n platform --timeout=600s
        
        log_info "Waiting for PostgreSQL kong rollout..."
        kubectl rollout status statefulset/postgres-fixed -n kong --timeout=600s
        
        log_success "PostgreSQL upgrades completed"
    fi
}

# Deploy monitoring
deploy_monitoring() {
    log_info "Deploying PostgreSQL monitoring..."
    
    execute_kubectl "kubectl apply -f $PROJECT_DIR/monitoring/postgres-exporter.yaml" \
        "Deploying PostgreSQL exporters"
    
    execute_kubectl "kubectl apply -f $PROJECT_DIR/monitoring/postgres-servicemonitor.yaml" \
        "Deploying ServiceMonitors and alerts"
    
    log_success "Monitoring deployment completed"
}

# Deploy backup strategy
deploy_backup() {
    log_info "Deploying backup strategy..."
    
    log_warning "IMPORTANT: You need to update backup-storage-credentials secret with your DigitalOcean Spaces credentials"
    
    execute_kubectl "kubectl apply -f $PROJECT_DIR/backup/postgres-backup-cronjob.yaml" \
        "Deploying backup CronJobs"
    
    log_success "Backup strategy deployment completed"
    log_info "Don't forget to update the backup-storage-credentials secret with your actual credentials!"
}

# Deploy security improvements
deploy_security() {
    log_info "Deploying security improvements..."
    
    execute_kubectl "kubectl apply -f $PROJECT_DIR/security/postgres-network-policies.yaml" \
        "Deploying network policies and security configurations"
    
    # Remove insecure NodePort services
    log_warning "Removing insecure NodePort services..."
    execute_kubectl "kubectl delete service postgres-dev-external postgres-staging-external -n dev-staging-db --ignore-not-found=true" \
        "Removing insecure NodePort services"
    
    log_success "Security improvements deployment completed"
}

# Validate deployment
validate_deployment() {
    log_info "Validating deployment..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "DRY RUN: Skipping validation"
        return 0
    fi
    
    # Check PostgreSQL pods
    log_info "Checking PostgreSQL pods status..."
    kubectl get pods -A | grep postgres | while read line; do
        if echo "$line" | grep -q "Running"; then
            log_success "Pod: $line"
        else
            log_warning "Pod: $line"
        fi
    done
    
    # Check monitoring
    if [[ "$COMPONENT" == "all" || "$COMPONENT" == "monitoring" ]]; then
        log_info "Checking monitoring components..."
        kubectl get pods -n monitoring | grep postgres-exporter | while read line; do
            if echo "$line" | grep -q "Running"; then
                log_success "Monitoring: $line"
            else
                log_warning "Monitoring: $line"
            fi
        done
    fi
    
    # Check backup jobs
    if [[ "$COMPONENT" == "all" || "$COMPONENT" == "backup" ]]; then
        log_info "Checking backup CronJobs..."
        kubectl get cronjobs -n platform | grep postgres-backup | while read line; do
            log_success "Backup CronJob: $line"
        done
    fi
    
    log_success "Validation completed"
}

# Main execution
main() {
    echo "=================================================="
    echo "PostgreSQL Infrastructure Improvements Deployment"
    echo "=================================================="
    echo ""
    echo "Component: $COMPONENT"
    echo "Dry Run: $DRY_RUN"
    echo ""
    
    check_prerequisites
    
    if [[ "$COMPONENT" == "all" || "$COMPONENT" == "monitoring" || "$COMPONENT" == "backup" ]]; then
        create_namespaces
    fi
    
    case $COMPONENT in
        "all")
            deploy_upgrades
            deploy_monitoring
            deploy_backup
            deploy_security
            ;;
        "upgrade")
            deploy_upgrades
            ;;
        "monitoring")
            deploy_monitoring
            ;;
        "backup")
            deploy_backup
            ;;
        "security")
            deploy_security
            ;;
        *)
            log_error "Unknown component: $COMPONENT"
            log_info "Valid components: all, upgrade, monitoring, backup, security"
            exit 1
            ;;
    esac
    
    validate_deployment
    
    echo ""
    echo "=================================================="
    echo "Deployment Summary"
    echo "=================================================="
    echo ""
    
    if [ "$DRY_RUN" = true ]; then
        log_info "This was a dry run. No actual changes were made."
        log_info "Run without --dry-run to apply changes."
    else
        log_success "PostgreSQL improvements deployment completed!"
        echo ""
        echo "Next steps:"
        echo "1. Update backup-storage-credentials secret with your DigitalOcean Spaces credentials"
        echo "2. Monitor PostgreSQL instances using Prometheus/Grafana"
        echo "3. Test backup and restore procedures"
        echo "4. Update firewall rules if using external access"
        echo ""
        echo "Monitoring URLs:"
        echo "- Prometheus: http://prometheus.your-domain.com"
        echo "- Grafana: http://grafana.your-domain.com"
    fi
}

# Execute main function
main