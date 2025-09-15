#!/bin/bash

# =====================================================
# KUBERNETES HEALTH MONITORING SCRIPT - NEXIA
# =====================================================
# Description: Generates hourly health reports for Kubernetes cluster
# Author: NEXIA Monitoring System
# Version: 1.0
# Created: $(date '+%Y-%m-%d')
# =====================================================

set -euo pipefail

# Configuration
REPORT_DIR="/users/ludovicpilet/projects/NEXIA/reports"
TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
REPORT_FILE="${REPORT_DIR}/k8s-health-${TIMESTAMP}.json"
HTML_REPORT="${REPORT_DIR}/k8s-health-${TIMESTAMP}.html"
LATEST_REPORT="${REPORT_DIR}/latest-health-report.html"
LOG_FILE="${REPORT_DIR}/monitor.log"

# Create directories
mkdir -p "${REPORT_DIR}"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "${LOG_FILE}"
}

log "🚀 Starting Kubernetes Health Check..."

# =====================================================
# HEALTH CHECK FUNCTIONS
# =====================================================

check_infrastructure() {
    local score=95
    local status="🟢"
    local issues=()
    
    # Check nodes
    local total_nodes=$(kubectl get nodes --no-headers | wc -l)
    local ready_nodes=$(kubectl get nodes --no-headers | grep -c " Ready ")
    local node_ratio=$((ready_nodes * 100 / total_nodes))
    
    if [ "$node_ratio" -lt 95 ]; then
        score=$((score - 20))
        status="🟡"
        issues+=("${ready_nodes}/${total_nodes} nodes ready (${node_ratio}%)")
    fi
    
    # Check high CPU usage
    local high_cpu_nodes=$(kubectl top nodes --no-headers 2>/dev/null | awk '{gsub("%","",$3); if($3>80) print $1}' | wc -l || echo "0")
    if [ "$high_cpu_nodes" -gt 2 ]; then
        score=$((score - 10))
        status="🟡"
        issues+=("$high_cpu_nodes nodes with high CPU usage")
    fi
    
    echo "{\"score\": $score, \"status\": \"$status\", \"category\": \"Infrastructure\", \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//')]}"
}

check_applications() {
    local score=70
    local status="🟡"
    local issues=()
    
    # Check failed pods
    local failed_pods=$(kubectl get pods --all-namespaces --field-selector=status.phase!=Running,status.phase!=Succeeded --no-headers 2>/dev/null | wc -l || echo "0")
    local crash_pods=$(kubectl get pods --all-namespaces --no-headers 2>/dev/null | grep -E "(Error|CrashLoopBackOff|ImagePullBackOff)" | wc -l || echo "0")
    
    if [ "$crash_pods" -gt 0 ]; then
        issues+=("$crash_pods pods in crash state")
        if [ "$crash_pods" -gt 5 ]; then
            score=$((score - 30))
            status="🔴"
        fi
    fi
    
    # Check deployments
    local failed_deployments=$(kubectl get deployments --all-namespaces --no-headers 2>/dev/null | awk '$3=="0/1" || $3=="0/2" || $3=="0/3"' | wc -l || echo "0")
    if [ "$failed_deployments" -gt 0 ]; then
        score=$((score - 15))
        issues+=("$failed_deployments deployments not ready")
    fi
    
    if [ "$score" -gt 80 ]; then
        status="🟢"
    fi
    
    echo "{\"score\": $score, \"status\": \"$status\", \"category\": \"Applications\", \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//')]}"
}

check_storage() {
    local score=85
    local status="🟢"
    local issues=()
    
    # Check PV status
    local total_pvs=$(kubectl get pv --no-headers 2>/dev/null | wc -l || echo "0")
    local bound_pvs=$(kubectl get pv --no-headers 2>/dev/null | grep -c " Bound " || echo "0")
    local failed_pvs=$(kubectl get pv --no-headers 2>/dev/null | grep -cE " (Failed|Lost) " || echo "0")
    
    if [ "$failed_pvs" -gt 0 ]; then
        score=$((score - 20))
        status="🟡"
        issues+=("$failed_pvs PVs in failed state")
    fi
    
    # Check released volumes
    local released_pvs=$(kubectl get pv --no-headers 2>/dev/null | grep -c " Released " || echo "0")
    if [ "$released_pvs" -gt 3 ]; then
        score=$((score - 5))
        issues+=("$released_pvs volumes need cleanup")
    fi
    
    echo "{\"score\": $score, \"status\": \"$status\", \"category\": \"Storage\", \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//')]}"
}

check_network() {
    local score=75
    local status="🟡"
    local issues=()
    
    # Check LoadBalancer services
    local lb_services=$(kubectl get svc --all-namespaces --no-headers 2>/dev/null | grep -c LoadBalancer || echo "0")
    local lb_pending=$(kubectl get svc --all-namespaces --no-headers 2>/dev/null | grep LoadBalancer | grep -c "<pending>" || echo "0")
    
    if [ "$lb_pending" -gt 0 ]; then
        score=$((score - 15))
        issues+=("$lb_pending LoadBalancers pending")
    fi
    
    # Check ingresses
    local ingresses=$(kubectl get ingress --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    
    # Check network policies - isolation might be too strict
    local netpols=$(kubectl get networkpolicies --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    if [ "$netpols" -gt 40 ]; then
        issues+=("$netpols NetworkPolicies - possible over-isolation")
    fi
    
    if [ "$score" -gt 80 ]; then
        status="🟢"
    fi
    
    echo "{\"score\": $score, \"status\": \"$status\", \"category\": \"Network\", \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//')]}"
}

check_security() {
    local score=80
    local status="🟢"
    local issues=()
    
    # Check secrets
    local secrets_count=$(kubectl get secret --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    
    # Check RBAC
    local service_accounts=$(kubectl get sa --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    
    # Check for security contexts
    local pods_without_security_context=$(kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.namespace}{" "}{.metadata.name}{" "}{.spec.securityContext}{"\n"}{end}' 2>/dev/null | grep -c "map\[\]" || echo "0")
    
    if [ "$pods_without_security_context" -gt 10 ]; then
        score=$((score - 10))
        status="🟡"
        issues+=("$pods_without_security_context pods without security context")
    fi
    
    echo "{\"score\": $score, \"status\": \"$status\", \"category\": \"Security\", \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//')]}"
}

check_monitoring() {
    local score=85
    local status="🟢"
    local issues=()
    
    # Check monitoring namespace
    local monitoring_pods=$(kubectl get pods -n monitoring --no-headers 2>/dev/null | wc -l || echo "0")
    if [ "$monitoring_pods" -eq 0 ]; then
        score=$((score - 30))
        status="🔴"
        issues+=("No monitoring pods found")
    fi
    
    # Check Prometheus
    local prometheus_running=$(kubectl get pods -n monitoring --no-headers 2>/dev/null | grep -c prometheus || echo "0")
    if [ "$prometheus_running" -eq 0 ]; then
        score=$((score - 20))
        status="🟡"
        issues+=("Prometheus not running")
    fi
    
    # Check recent events for errors
    local error_events=$(kubectl get events --all-namespaces --field-selector type=Warning --no-headers 2>/dev/null | wc -l || echo "0")
    if [ "$error_events" -gt 20 ]; then
        score=$((score - 10))
        issues+=("$error_events warning events")
    fi
    
    echo "{\"score\": $score, \"status\": \"$status\", \"category\": \"Monitoring\", \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//')]}"
}

# =====================================================
# GENERATE ACTIONS
# =====================================================

generate_actions() {
    local report_data="$1"
    local actions=()
    
    # Parse scores and issues
    local infra_score=$(echo "$report_data" | jq -r '.infrastructure.score')
    local apps_score=$(echo "$report_data" | jq -r '.applications.score')
    local storage_score=$(echo "$report_data" | jq -r '.storage.score')
    local network_score=$(echo "$report_data" | jq -r '.network.score')
    local security_score=$(echo "$report_data" | jq -r '.security.score')
    local monitoring_score=$(echo "$report_data" | jq -r '.monitoring.score')
    
    # Critical actions (score < 70)
    if [ "$apps_score" -lt 70 ]; then
        actions+=("🔥 URGENT: Investigate failing applications - kubectl get pods --all-namespaces | grep -v Running")
    fi
    
    if [ "$infra_score" -lt 70 ]; then
        actions+=("🔥 URGENT: Check node health - kubectl describe nodes | grep -A5 Conditions")
    fi
    
    # Medium priority (score < 80)
    if [ "$storage_score" -lt 80 ]; then
        actions+=("⚡ MEDIUM: Clean up released volumes - kubectl get pv | grep Released")
    fi
    
    if [ "$network_score" -lt 80 ]; then
        actions+=("⚡ MEDIUM: Review NetworkPolicies - too restrictive inter-namespace communication")
    fi
    
    if [ "$security_score" -lt 80 ]; then
        actions+=("⚡ MEDIUM: Review security contexts for pods")
    fi
    
    # Low priority (score < 90)
    if [ "$monitoring_score" -lt 90 ]; then
        actions+=("📈 LOW: Check monitoring stack - kubectl get pods -n monitoring")
    fi
    
    # Always include general maintenance
    actions+=("📋 MAINTENANCE: Review cluster resource usage - kubectl top nodes")
    actions+=("📋 MAINTENANCE: Check for security updates - kubectl version")
    
    printf '%s\n' "${actions[@]}"
}

# =====================================================
# MAIN EXECUTION
# =====================================================

main() {
    log "Collecting health data..."
    
    # Collect health data
    local infrastructure=$(check_infrastructure)
    local applications=$(check_applications)
    local storage=$(check_storage)
    local network=$(check_network)
    local security=$(check_security)
    local monitoring=$(check_monitoring)
    
    # Calculate overall score
    local infra_score=$(echo "$infrastructure" | jq -r '.score')
    local apps_score=$(echo "$applications" | jq -r '.score')
    local storage_score=$(echo "$storage" | jq -r '.score')
    local network_score=$(echo "$network" | jq -r '.score')
    local security_score=$(echo "$security" | jq -r '.score')
    local monitoring_score=$(echo "$monitoring" | jq -r '.score')
    
    local overall_score=$(( (infra_score + apps_score + storage_score + network_score + security_score + monitoring_score) / 6 ))
    
    # Create JSON report
    cat > "$REPORT_FILE" <<EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "overall_score": $overall_score,
    "infrastructure": $infrastructure,
    "applications": $applications,
    "storage": $storage,
    "network": $network,
    "security": $security,
    "monitoring": $monitoring
}
EOF

    log "Generating HTML report..."
    
    # Generate actions
    local actions=$(generate_actions "$(cat "$REPORT_FILE")")
    
    # Create HTML report
    /users/ludovicpilet/projects/NEXIA/generate-html-report.sh "$REPORT_FILE" "$HTML_REPORT" "$actions"
    
    # Update latest symlink
    ln -sf "$HTML_REPORT" "$LATEST_REPORT"
    
    log "✅ Health check completed - Overall Score: ${overall_score}/100"
    log "📄 Report saved: $HTML_REPORT"
    log "🔗 Latest: $LATEST_REPORT"
    
    # Cleanup old reports (keep last 24)
    find "${REPORT_DIR}" -name "k8s-health-*.html" -mtime +1 -delete 2>/dev/null || true
    find "${REPORT_DIR}" -name "k8s-health-*.json" -mtime +1 -delete 2>/dev/null || true
}

# Run main function
main "$@"