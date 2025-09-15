#!/bin/bash

# NEXIA Monitoring Setup Script
# Sets up comprehensive monitoring for NEXIA ecosystem

set -e

echo "📊 Setting up NEXIA Ecosystem Monitoring"

NAMESPACE_PROD="nexia-prod"
NAMESPACE_MONITORING="monitoring"

# Create monitoring dashboard for NEXIA
echo "🎛️ Creating NEXIA Grafana Dashboard..."

cat > /tmp/nexia-dashboard.json << 'EOF'
{
  "dashboard": {
    "id": null,
    "title": "NEXIA Ecosystem Dashboard",
    "tags": ["nexia", "ecosystem", "claude-code"],
    "timezone": "browser",
    "panels": [
      {
        "title": "NEXIA Services Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"nexia-supervisor\"}",
            "legendFormat": "Supervisor"
          },
          {
            "expr": "up{job=\"nexia-claude-code\"}",
            "legendFormat": "Claude Agent"
          },
          {
            "expr": "up{job=\"nexia-directus\"}",
            "legendFormat": "Directus CMS"
          }
        ]
      },
      {
        "title": "Agent Decision Making",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(nexia_decisions_total[5m])",
            "legendFormat": "Decisions per minute"
          }
        ]
      },
      {
        "title": "Ecosystem Health Checks",
        "type": "table",
        "targets": [
          {
            "expr": "nexia_ecosystem_health_status",
            "legendFormat": "{{ecosystem}}"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "container_memory_usage_bytes{namespace=\"nexia-prod\"} / 1024 / 1024",
            "legendFormat": "{{pod}}"
          }
        ]
      },
      {
        "title": "Alert Escalations",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(nexia_alerts_escalated_total[5m])",
            "legendFormat": "{{severity}}"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "30s"
  }
}
EOF

# Apply NEXIA monitoring configuration
echo "⚙️ Applying monitoring configurations..."
kubectl apply -f ../kubernetes/monitoring.yaml

# Create ServiceMonitor for each NEXIA service
echo "🎯 Setting up service discovery..."

cat > /tmp/nexia-servicemonitor.yaml << EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: nexia-ecosystem
  namespace: $NAMESPACE_MONITORING
  labels:
    team: nexia
spec:
  selector:
    matchLabels:
      app: nexia-supervisor
  endpoints:
  - port: http
    interval: 30s
    path: /api/metrics
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: nexia-claude-code
  namespace: $NAMESPACE_MONITORING
  labels:
    team: nexia
spec:
  selector:
    matchLabels:
      app: nexia-claude-code
  endpoints:
  - port: http
    interval: 30s
    path: /metrics
EOF

kubectl apply -f /tmp/nexia-servicemonitor.yaml

# Set up alert routing for NEXIA
echo "🚨 Configuring alert routing..."

cat > /tmp/nexia-alerting.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: nexia-alertmanager-config
  namespace: $NAMESPACE_MONITORING
data:
  alertmanager.yml: |
    global:
      slack_api_url: '$SLACK_WEBHOOK_URL'
    
    route:
      group_by: ['alertname', 'service']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 1h
      receiver: 'nexia-alerts'
      routes:
      - match:
          service: nexia-claude-code
        receiver: 'nexia-critical'
      - match:
          service: nexia-supervisor
        receiver: 'nexia-critical'
    
    receivers:
    - name: 'nexia-alerts'
      slack_configs:
      - channel: '#nexia-alerts'
        title: 'NEXIA Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    
    - name: 'nexia-critical'
      slack_configs:
      - channel: '#nexia-critical'
        title: '🚨 CRITICAL NEXIA Alert: {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
        send_resolved: true
EOF

kubectl apply -f /tmp/nexia-alerting.yaml

# Verify monitoring setup
echo "✅ Verifying monitoring setup..."

echo "Checking ServiceMonitors..."
kubectl get servicemonitors -n $NAMESPACE_MONITORING | grep nexia

echo "Checking PrometheusRules..."
kubectl get prometheusrules -n $NAMESPACE_PROD | grep nexia

echo "Testing metrics endpoints..."
SUPERVISOR_POD=$(kubectl get pods -n $NAMESPACE_PROD -l app=nexia-supervisor -o jsonpath='{.items[0].metadata.name}')
AGENT_POD=$(kubectl get pods -n $NAMESPACE_PROD -l app=nexia-claude-code -o jsonpath='{.items[0].metadata.name}')

if [ ! -z "$SUPERVISOR_POD" ]; then
    echo "Testing supervisor metrics..."
    kubectl exec -n $NAMESPACE_PROD $SUPERVISOR_POD -- curl -s http://localhost:3000/api/metrics | head -5
fi

if [ ! -z "$AGENT_POD" ]; then
    echo "Testing agent health..."
    kubectl exec -n $NAMESPACE_PROD $AGENT_POD -- curl -s http://localhost:7013/health | jq -r '.status'
fi

echo ""
echo "🎉 NEXIA Monitoring Setup Complete!"
echo ""
echo "📊 Access Points:"
echo "   - Grafana: https://grafana.monitoring.onlyoneapi.com"
echo "   - Prometheus: https://prometheus.monitoring.onlyoneapi.com" 
echo "   - AlertManager: https://alertmanager.monitoring.onlyoneapi.com"
echo ""
echo "🔍 Useful Commands:"
echo "   kubectl get pods -n $NAMESPACE_PROD -w"
echo "   kubectl logs -f deployment/nexia-claude-code -n $NAMESPACE_PROD"
echo "   kubectl top pods -n $NAMESPACE_PROD"

# Cleanup temp files
rm -f /tmp/nexia-*.json /tmp/nexia-*.yaml