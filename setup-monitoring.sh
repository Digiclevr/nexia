#!/bin/bash

# =====================================================
# NEXIA MONITORING SETUP SCRIPT
# =====================================================
# Description: Sets up cron job and permissions for K8s monitoring
# Author: NEXIA Monitoring System
# Version: 1.0
# =====================================================

set -euo pipefail

NEXIA_DIR="/users/ludovicpilet/projects/NEXIA"
MONITOR_SCRIPT="${NEXIA_DIR}/k8s-health-monitor.sh"
HTML_GENERATOR="${NEXIA_DIR}/generate-html-report.sh"
REPORTS_DIR="${NEXIA_DIR}/reports"

echo "🚀 Setting up NEXIA Kubernetes Health Monitoring..."

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Make scripts executable
chmod +x "$MONITOR_SCRIPT"
chmod +x "$HTML_GENERATOR"

echo "✅ Scripts permissions updated"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ Error: kubectl not found. Please install kubectl first."
    exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "❌ Error: jq not found. Please install jq first:"
    echo "   brew install jq"
    exit 1
fi

# Test kubectl connection
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Error: Cannot connect to Kubernetes cluster"
    echo "   Please check your kubeconfig"
    exit 1
fi

echo "✅ Prerequisites verified"

# Setup cron job for hourly execution
CRON_JOB="0 * * * * ${MONITOR_SCRIPT} >> ${REPORTS_DIR}/monitor.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "k8s-health-monitor.sh"; then
    echo "⚠️  Cron job already exists. Updating..."
    # Remove old cron job
    (crontab -l 2>/dev/null | grep -v "k8s-health-monitor.sh") | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job installed - Health checks will run every hour"

# Create a startup script for manual execution
cat > "${NEXIA_DIR}/run-health-check.sh" <<EOF
#!/bin/bash
cd "${NEXIA_DIR}"
${MONITOR_SCRIPT}
EOF

chmod +x "${NEXIA_DIR}/run-health-check.sh"

# Create web server script for viewing reports
cat > "${NEXIA_DIR}/start-report-server.sh" <<EOF
#!/bin/bash

# Simple HTTP server to view reports
echo "🌐 Starting NEXIA Report Server..."
echo "📄 Reports available at: http://localhost:8080"
echo "🔗 Latest report: http://localhost:8080/latest-health-report.html"
echo ""
echo "Press Ctrl+C to stop the server"

cd "${REPORTS_DIR}"
python3 -m http.server 8080 2>/dev/null || python -m SimpleHTTPServer 8080
EOF

chmod +x "${NEXIA_DIR}/start-report-server.sh"

echo ""
echo "🎉 NEXIA Kubernetes Health Monitoring setup complete!"
echo ""
echo "📋 Available commands:"
echo "   • Run health check now: ${NEXIA_DIR}/run-health-check.sh"
echo "   • View reports: ${NEXIA_DIR}/start-report-server.sh"
echo "   • Monitor logs: tail -f ${REPORTS_DIR}/monitor.log"
echo ""
echo "⏰ Automated reports will be generated every hour"
echo "📁 Reports location: ${REPORTS_DIR}/"
echo ""
echo "🔍 Cron job status:"
crontab -l | grep "k8s-health-monitor.sh" || echo "   No cron job found"
echo ""