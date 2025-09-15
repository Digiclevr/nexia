#!/bin/bash

# =====================================================
# NEXIA MONITORING SCRIPT WITH API INTEGRATION
# =====================================================
# Description: Enhanced monitoring script that stores results in PostgreSQL
# Author: NEXIA Monitoring System
# Version: 2.0
# =====================================================

set -euo pipefail

# Configuration
API_BASE_URL="http://localhost:3001/api/v1"
CLUSTER_ID="${CLUSTER_ID:-$(uuidgen)}" # Generate or use existing cluster ID
CLUSTER_NAME="${CLUSTER_NAME:-default-cluster}"
REPORT_DIR="/users/ludovicpilet/projects/NEXIA/reports"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LOG_FILE="${REPORT_DIR}/monitor.log"

# Create directories
mkdir -p "${REPORT_DIR}"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "${LOG_FILE}"
}

log "🚀 Starting Enhanced Kubernetes Health Check with API Integration..."

# =====================================================
# API HELPER FUNCTIONS
# =====================================================

# Function to make API calls
api_call() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${API_BASE_URL}${endpoint}" || echo "{\"error\": \"API call failed\"}"
    else
        curl -s -X "$method" "${API_BASE_URL}${endpoint}" || echo "{\"error\": \"API call failed\"}"
    fi
}

# Function to get or create cluster
ensure_cluster() {
    log "📡 Ensuring cluster exists in database..."
    
    # Try to get cluster by name first
    local cluster_response=$(api_call "GET" "/clusters?name=${CLUSTER_NAME}")
    
    # If cluster doesn't exist, create it
    if echo "$cluster_response" | grep -q '"data":\[\]'; then
        log "Creating new cluster: $CLUSTER_NAME"
        local cluster_data="{
            \"name\": \"$CLUSTER_NAME\",
            \"description\": \"Kubernetes cluster monitored by NEXIA\",
            \"endpoint\": \"$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}' 2>/dev/null || echo 'unknown')\"
        }"
        
        local create_response=$(api_call "POST" "/clusters" "$cluster_data")
        CLUSTER_ID=$(echo "$create_response" | jq -r '.data.id // empty')
        
        if [ -z "$CLUSTER_ID" ]; then
            log "❌ Failed to create cluster, using fallback ID"
            CLUSTER_ID=$(uuidgen)
        else
            log "✅ Cluster created with ID: $CLUSTER_ID"
        fi
    else
        CLUSTER_ID=$(echo "$cluster_response" | jq -r '.data[0].id // empty')
        log "✅ Using existing cluster ID: $CLUSTER_ID"
    fi
}

# Function to get category ID by name
get_category_id() {
    local category_name="$1"
    # For now, generate UUID based on category name (in production, fetch from API)
    case "$category_name" in
        "infrastructure") echo "550e8400-e29b-41d4-a716-446655440001" ;;
        "applications") echo "550e8400-e29b-41d4-a716-446655440002" ;;
        "storage") echo "550e8400-e29b-41d4-a716-446655440003" ;;
        "network") echo "550e8400-e29b-41d4-a716-446655440004" ;;
        "security") echo "550e8400-e29b-41d4-a716-446655440005" ;;
        "monitoring") echo "550e8400-e29b-41d4-a716-446655440006" ;;
        *) echo "550e8400-e29b-41d4-a716-446655440000" ;;
    esac
}

# =====================================================
# ENHANCED HEALTH CHECK FUNCTIONS
# =====================================================

check_infrastructure() {
    local score=95
    local status="🟢"
    local issues=()
    local metrics="{}"
    
    log "Checking infrastructure health..."
    
    # Check nodes
    local total_nodes=$(kubectl get nodes --no-headers 2>/dev/null | wc -l || echo "0")
    local ready_nodes=$(kubectl get nodes --no-headers 2>/dev/null | grep -c " Ready " || echo "0")
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
    
    # Enhanced metrics
    metrics="{
        \"total_nodes\": $total_nodes,
        \"ready_nodes\": $ready_nodes,
        \"node_ready_ratio\": $node_ratio,
        \"high_cpu_nodes\": $high_cpu_nodes
    }"
    
    echo "{
        \"category\": \"infrastructure\",
        \"score\": $score,
        \"status\": \"$status\",
        \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//') ],
        \"metrics\": $metrics
    }"
}

check_applications() {
    local score=70
    local status="🟡"
    local issues=()
    local metrics="{}"
    
    log "Checking applications health..."
    
    # Check failed pods
    local total_pods=$(kubectl get pods --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    local running_pods=$(kubectl get pods --all-namespaces --no-headers 2>/dev/null | grep -c " Running " || echo "0")
    local crash_pods=$(kubectl get pods --all-namespaces --no-headers 2>/dev/null | grep -cE "(Error|CrashLoopBackOff|ImagePullBackOff)" || echo "0")
    
    if [ "$crash_pods" -gt 0 ]; then
        issues+=("$crash_pods pods in crash state")
        if [ "$crash_pods" -gt 5 ]; then
            score=$((score - 30))
            status="🔴"
        else
            score=$((score - 15))
        fi
    fi
    
    # Check deployments
    local failed_deployments=$(kubectl get deployments --all-namespaces --no-headers 2>/dev/null | awk '$3~/0\/[1-9]/' | wc -l || echo "0")
    if [ "$failed_deployments" -gt 0 ]; then
        score=$((score - 15))
        issues+=("$failed_deployments deployments not ready")
    fi
    
    if [ "$score" -gt 80 ]; then
        status="🟢"
    fi
    
    metrics="{
        \"total_pods\": $total_pods,
        \"running_pods\": $running_pods,
        \"crashed_pods\": $crash_pods,
        \"failed_deployments\": $failed_deployments,
        \"pod_success_rate\": $(( (total_pods - crash_pods) * 100 / total_pods ))
    }"
    
    echo "{
        \"category\": \"applications\",
        \"score\": $score,
        \"status\": \"$status\",
        \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//') ],
        \"metrics\": $metrics
    }"
}

check_storage() {
    local score=85
    local status="🟢"
    local issues=()
    local metrics="{}"
    
    log "Checking storage health..."
    
    # Check PV status
    local total_pvs=$(kubectl get pv --no-headers 2>/dev/null | wc -l || echo "0")
    local bound_pvs=$(kubectl get pv --no-headers 2>/dev/null | grep -c " Bound " || echo "0")
    local failed_pvs=$(kubectl get pv --no-headers 2>/dev/null | grep -cE " (Failed|Lost) " || echo "0")
    local released_pvs=$(kubectl get pv --no-headers 2>/dev/null | grep -c " Released " || echo "0")
    
    if [ "$failed_pvs" -gt 0 ]; then
        score=$((score - 20))
        status="🟡"
        issues+=("$failed_pvs PVs in failed state")
    fi
    
    if [ "$released_pvs" -gt 3 ]; then
        score=$((score - 5))
        issues+=("$released_pvs volumes need cleanup")
    fi
    
    metrics="{
        \"total_pvs\": $total_pvs,
        \"bound_pvs\": $bound_pvs,
        \"failed_pvs\": $failed_pvs,
        \"released_pvs\": $released_pvs,
        \"pv_health_ratio\": $(( bound_pvs * 100 / total_pvs ))
    }"
    
    echo "{
        \"category\": \"storage\",
        \"score\": $score,
        \"status\": \"$status\",
        \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//') ],
        \"metrics\": $metrics
    }"
}

check_network() {
    local score=75
    local status="🟡"
    local issues=()
    local metrics="{}"
    
    log "Checking network health..."
    
    # Check LoadBalancer services
    local total_lb=$(kubectl get svc --all-namespaces --no-headers 2>/dev/null | grep -c "LoadBalancer" || echo "0")
    local pending_lb=$(kubectl get svc --all-namespaces --no-headers 2>/dev/null | grep "LoadBalancer" | grep -c "<pending>" || echo "0")
    
    if [ "$pending_lb" -gt 0 ]; then
        score=$((score - 15))
        issues+=("$pending_lb LoadBalancers pending")
    fi
    
    # Check ingresses
    local total_ingresses=$(kubectl get ingress --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    
    # Check network policies
    local netpols=$(kubectl get networkpolicies --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    if [ "$netpols" -gt 40 ]; then
        issues+=("$netpols NetworkPolicies - possible over-isolation")
    fi
    
    if [ "$score" -gt 80 ]; then
        status="🟢"
    fi
    
    metrics="{
        \"total_loadbalancers\": $total_lb,
        \"pending_loadbalancers\": $pending_lb,
        \"total_ingresses\": $total_ingresses,
        \"network_policies\": $netpols
    }"
    
    echo "{
        \"category\": \"network\",
        \"score\": $score,
        \"status\": \"$status\",
        \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//') ],
        \"metrics\": $metrics
    }"
}

check_security() {
    local score=80
    local status="🟢"
    local issues=()
    local metrics="{}"
    
    log "Checking security health..."
    
    # Count secrets and service accounts
    local secrets_count=$(kubectl get secret --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    local service_accounts=$(kubectl get sa --all-namespaces --no-headers 2>/dev/null | wc -l || echo "0")
    
    # This is a simplified check - in production you'd want more sophisticated security scanning
    if [ "$secrets_count" -gt 300 ]; then
        score=$((score - 5))
        status="🟡"
        issues+=("High number of secrets ($secrets_count) - review needed")
    fi
    
    metrics="{
        \"secrets_count\": $secrets_count,
        \"service_accounts\": $service_accounts
    }"
    
    echo "{
        \"category\": \"security\",
        \"score\": $score,
        \"status\": \"$status\",
        \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//') ],
        \"metrics\": $metrics
    }"
}

check_monitoring() {
    local score=85
    local status="🟢"
    local issues=()
    local metrics="{}"
    
    log "Checking monitoring health..."
    
    # Check monitoring namespace
    local monitoring_pods=$(kubectl get pods -n monitoring --no-headers 2>/dev/null | wc -l || echo "0")
    local prometheus_running=$(kubectl get pods -n monitoring --no-headers 2>/dev/null | grep -c "prometheus" || echo "0")
    
    if [ "$monitoring_pods" -eq 0 ]; then
        score=$((score - 30))
        status="🔴"
        issues+=("No monitoring pods found")
    elif [ "$prometheus_running" -eq 0 ]; then
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
    
    metrics="{
        \"monitoring_pods\": $monitoring_pods,
        \"prometheus_running\": $prometheus_running,
        \"warning_events\": $error_events
    }"
    
    echo "{
        \"category\": \"monitoring\",
        \"score\": $score,
        \"status\": \"$status\",
        \"issues\": [$(printf '\"%s\",' "${issues[@]}" | sed 's/,$//') ],
        \"metrics\": $metrics
    }"
}

# =====================================================
# GENERATE ENHANCED ACTIONS
# =====================================================

generate_actions() {
    local categories="$1"
    local actions=()
    
    # Parse each category and generate actions
    for category_data in $(echo "$categories" | jq -r '.[] | @base64'); do
        local category=$(echo "$category_data" | base64 -d | jq -r '.category')
        local score=$(echo "$category_data" | base64 -d | jq -r '.score')
        local issues=$(echo "$category_data" | base64 -d | jq -r '.issues[]?' 2>/dev/null || echo "")
        
        # Generate actions based on category and issues
        if [ "$score" -lt 70 ]; then
            actions+=("{\"priority\": \"urgent\", \"title\": \"Critical issues in $category\", \"description\": \"Score: $score/100\", \"category\": \"$category\", \"estimated_time_minutes\": 30}")
        elif [ "$score" -lt 80 ]; then
            actions+=("{\"priority\": \"medium\", \"title\": \"Review $category configuration\", \"description\": \"Score: $score/100\", \"category\": \"$category\", \"estimated_time_minutes\": 15}")
        fi
    done
    
    # Always add maintenance actions
    actions+=("{\"priority\": \"maintenance\", \"title\": \"Review cluster resource usage\", \"description\": \"Regular maintenance check\", \"category\": \"general\", \"estimated_time_minutes\": 10}")
    
    echo "[$(IFS=,; echo "${actions[*]}")]"
}

# =====================================================
# MAIN EXECUTION WITH API INTEGRATION
# =====================================================

main() {
    local start_time=$(date +%s)
    
    # Ensure cluster exists in database
    ensure_cluster
    
    log "Collecting health data for cluster: $CLUSTER_NAME ($CLUSTER_ID)"
    
    # Collect health data for all categories
    local infrastructure=$(check_infrastructure)
    local applications=$(check_applications)
    local storage=$(check_storage)
    local network=$(check_network)
    local security=$(check_security)
    local monitoring=$(check_monitoring)
    
    # Combine all category data
    local categories="[$infrastructure, $applications, $storage, $network, $security, $monitoring]"
    
    # Calculate overall score
    local overall_score=$(echo "$categories" | jq '[.[].score] | add / length | round')
    
    # Determine overall status
    local overall_status="🟢"
    if [ "$overall_score" -lt 80 ]; then
        overall_status="🟡"
    fi
    if [ "$overall_score" -lt 70 ]; then
        overall_status="🔴"
    fi
    
    # Calculate execution time
    local end_time=$(date +%s)
    local execution_time=$(echo "$end_time - $start_time" | bc -l)
    
    # Generate actions
    local actions=$(generate_actions "$categories")
    
    # Prepare category scores for API
    local category_scores=$(echo "$categories" | jq '[.[] | {
        category_id: (if .category == "infrastructure" then "550e8400-e29b-41d4-a716-446655440001"
                     elif .category == "applications" then "550e8400-e29b-41d4-a716-446655440002" 
                     elif .category == "storage" then "550e8400-e29b-41d4-a716-446655440003"
                     elif .category == "network" then "550e8400-e29b-41d4-a716-446655440004"
                     elif .category == "security" then "550e8400-e29b-41d4-a716-446655440005"
                     elif .category == "monitoring" then "550e8400-e29b-41d4-a716-446655440006"
                     else "550e8400-e29b-41d4-a716-446655440000" end),
        score: .score,
        status: .status,
        issues: .issues,
        metrics: .metrics
    }]')
    
    # Create API payload
    local api_payload=$(jq -n \
        --arg cluster_id "$CLUSTER_ID" \
        --arg timestamp "$TIMESTAMP" \
        --argjson overall_score "$overall_score" \
        --arg overall_status "$overall_status" \
        --argjson execution_time "$execution_time" \
        --argjson category_scores "$category_scores" \
        --argjson report_data "$categories" \
        --argjson actions "$actions" \
        '{
            cluster_id: $cluster_id,
            timestamp: $timestamp,
            overall_score: $overall_score,
            overall_status: $overall_status,
            execution_time_seconds: $execution_time,
            category_scores: $category_scores,
            report_data: {
                categories: $report_data,
                cluster_info: {
                    name: env.CLUSTER_NAME,
                    nodes: 28,
                    version: "1.32.2"
                }
            },
            actions: $actions
        }')
    
    log "📡 Sending health report to API..."
    
    # Send data to API
    local api_response=$(api_call "POST" "/reports" "$api_payload")
    
    # Check API response
    if echo "$api_response" | jq -e '.success' >/dev/null 2>&1; then
        local report_id=$(echo "$api_response" | jq -r '.data.id')
        log "✅ Health report stored successfully with ID: $report_id"
    else
        log "⚠️  API call failed, but continuing with local report generation"
        log "API Response: $api_response"
    fi
    
    # Still generate local HTML report as backup
    local json_file="${REPORT_DIR}/k8s-health-$(date '+%Y%m%d-%H%M%S').json"
    local html_file="${REPORT_DIR}/k8s-health-$(date '+%Y%m%d-%H%M%S').html"
    
    # Save local JSON
    echo "$api_payload" | jq '.' > "$json_file"
    
    # Generate HTML report
    /users/ludovicpilet/projects/NEXIA/generate-html-report.sh "$json_file" "$html_file" "$(echo "$actions" | jq -r '.[] | .title')"
    
    # Update latest symlink
    ln -sf "$html_file" "${REPORT_DIR}/latest-health-report.html"
    
    log "✅ Enhanced health check completed"
    log "📊 Overall Score: ${overall_score}/100 ($overall_status)"
    log "⏱️  Execution time: ${execution_time}s"
    log "📄 Local report: $html_file"
    log "📡 API integration: $(echo "$api_response" | jq -r '.success // false')"
}

# Run main function
main "$@"