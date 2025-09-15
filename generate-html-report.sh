#!/bin/bash

# =====================================================
# HTML REPORT GENERATOR FOR KUBERNETES HEALTH
# =====================================================
# Description: Generates beautiful HTML reports from JSON health data
# Author: NEXIA Monitoring System
# Version: 1.0
# =====================================================

set -euo pipefail

# Parameters
REPORT_JSON="$1"
HTML_OUTPUT="$2"
ACTIONS="$3"

# Read JSON data
if [ ! -f "$REPORT_JSON" ]; then
    echo "Error: Report JSON file not found: $REPORT_JSON"
    exit 1
fi

# Extract data from JSON
TIMESTAMP=$(jq -r '.timestamp' "$REPORT_JSON")
OVERALL_SCORE=$(jq -r '.overall_score' "$REPORT_JSON")

INFRA_SCORE=$(jq -r '.infrastructure.score' "$REPORT_JSON")
INFRA_STATUS=$(jq -r '.infrastructure.status' "$REPORT_JSON")
INFRA_ISSUES=$(jq -r '.infrastructure.issues[]' "$REPORT_JSON" 2>/dev/null | tr '\n' ';' || echo "Aucun problème détecté")

APPS_SCORE=$(jq -r '.applications.score' "$REPORT_JSON")
APPS_STATUS=$(jq -r '.applications.status' "$REPORT_JSON")
APPS_ISSUES=$(jq -r '.applications.issues[]' "$REPORT_JSON" 2>/dev/null | tr '\n' ';' || echo "Aucun problème détecté")

STORAGE_SCORE=$(jq -r '.storage.score' "$REPORT_JSON")
STORAGE_STATUS=$(jq -r '.storage.status' "$REPORT_JSON")
STORAGE_ISSUES=$(jq -r '.storage.issues[]' "$REPORT_JSON" 2>/dev/null | tr '\n' ';' || echo "Aucun problème détecté")

NETWORK_SCORE=$(jq -r '.network.score' "$REPORT_JSON")
NETWORK_STATUS=$(jq -r '.network.status' "$REPORT_JSON")
NETWORK_ISSUES=$(jq -r '.network.issues[]' "$REPORT_JSON" 2>/dev/null | tr '\n' ';' || echo "Aucun problème détecté")

SECURITY_SCORE=$(jq -r '.security.score' "$REPORT_JSON")
SECURITY_STATUS=$(jq -r '.security.status' "$REPORT_JSON")
SECURITY_ISSUES=$(jq -r '.security.issues[]' "$REPORT_JSON" 2>/dev/null | tr '\n' ';' || echo "Aucun problème détecté")

MONITORING_SCORE=$(jq -r '.monitoring.score' "$REPORT_JSON")
MONITORING_STATUS=$(jq -r '.monitoring.status' "$REPORT_JSON")
MONITORING_ISSUES=$(jq -r '.monitoring.issues[]' "$REPORT_JSON" 2>/dev/null | tr '\n' ';' || echo "Aucun problème détecté")

# Determine overall status
OVERALL_STATUS="🟢"
if [ "$OVERALL_SCORE" -lt 80 ]; then
    OVERALL_STATUS="🟡"
fi
if [ "$OVERALL_SCORE" -lt 70 ]; then
    OVERALL_STATUS="🔴"
fi

# Generate HTML
cat > "$HTML_OUTPUT" <<EOF
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXIA - Rapport de Santé Kubernetes</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header .timestamp {
            opacity: 0.8;
            font-size: 1.1rem;
        }
        
        .overall-score {
            text-align: center;
            padding: 40px 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .score-circle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 20px;
            position: relative;
        }
        
        .score-good { background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; }
        .score-warning { background: linear-gradient(135deg, #f39c12, #e67e22); color: white; }
        .score-danger { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        
        .metric-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.05);
            border: 1px solid #e9ecef;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .metric-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        
        .metric-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .metric-status {
            font-size: 1.5rem;
        }
        
        .metric-score {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .score-green { color: #27ae60; }
        .score-yellow { color: #f39c12; }
        .score-red { color: #e74c3c; }
        
        .metric-issues {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            font-size: 0.9rem;
            color: #6c757d;
            line-height: 1.5;
        }
        
        .actions-section {
            background: #f8f9fa;
            padding: 30px;
            border-top: 1px solid #e9ecef;
        }
        
        .actions-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .action-item {
            background: white;
            border-radius: 10px;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-left: 4px solid #3498db;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .action-urgent { border-left-color: #e74c3c; background: #ffeaea; }
        .action-medium { border-left-color: #f39c12; background: #fff8e7; }
        .action-low { border-left-color: #3498db; background: #e8f4fd; }
        .action-maintenance { border-left-color: #95a5a6; }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-size: 0.9rem;
            border-top: 1px solid #e9ecef;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
                gap: 15px;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 NEXIA - Rapport de Santé Kubernetes</h1>
            <div class="timestamp">Généré le $(date -d "$TIMESTAMP" '+%d/%m/%Y à %H:%M:%S' 2>/dev/null || echo "$TIMESTAMP")</div>
        </div>
        
        <div class="overall-score">
            <div class="score-circle $([ "$OVERALL_SCORE" -gt 80 ] && echo "score-good" || ([ "$OVERALL_SCORE" -gt 70 ] && echo "score-warning" || echo "score-danger"))">
                ${OVERALL_STATUS} ${OVERALL_SCORE}/100
            </div>
            <h2>Score Global du Cluster</h2>
            <p>$([ "$OVERALL_SCORE" -gt 80 ] && echo "Cluster en bonne santé" || ([ "$OVERALL_SCORE" -gt 70 ] && echo "Attention requise" || echo "Problèmes critiques détectés"))</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-title">Infrastructure</div>
                    <div class="metric-status">$INFRA_STATUS</div>
                </div>
                <div class="metric-score $([ "$INFRA_SCORE" -gt 80 ] && echo "score-green" || ([ "$INFRA_SCORE" -gt 70 ] && echo "score-yellow" || echo "score-red"))">
                    ${INFRA_SCORE}/100
                </div>
                <div class="metric-issues">
                    <strong>Issues:</strong><br>
                    $(echo "$INFRA_ISSUES" | sed 's/;/<br>• /g' | sed 's/^/• /')
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-title">Applications</div>
                    <div class="metric-status">$APPS_STATUS</div>
                </div>
                <div class="metric-score $([ "$APPS_SCORE" -gt 80 ] && echo "score-green" || ([ "$APPS_SCORE" -gt 70 ] && echo "score-yellow" || echo "score-red"))">
                    ${APPS_SCORE}/100
                </div>
                <div class="metric-issues">
                    <strong>Issues:</strong><br>
                    $(echo "$APPS_ISSUES" | sed 's/;/<br>• /g' | sed 's/^/• /')
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-title">Stockage</div>
                    <div class="metric-status">$STORAGE_STATUS</div>
                </div>
                <div class="metric-score $([ "$STORAGE_SCORE" -gt 80 ] && echo "score-green" || ([ "$STORAGE_SCORE" -gt 70 ] && echo "score-yellow" || echo "score-red"))">
                    ${STORAGE_SCORE}/100
                </div>
                <div class="metric-issues">
                    <strong>Issues:</strong><br>
                    $(echo "$STORAGE_ISSUES" | sed 's/;/<br>• /g' | sed 's/^/• /')
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-title">Réseau</div>
                    <div class="metric-status">$NETWORK_STATUS</div>
                </div>
                <div class="metric-score $([ "$NETWORK_SCORE" -gt 80 ] && echo "score-green" || ([ "$NETWORK_SCORE" -gt 70 ] && echo "score-yellow" || echo "score-red"))">
                    ${NETWORK_SCORE}/100
                </div>
                <div class="metric-issues">
                    <strong>Issues:</strong><br>
                    $(echo "$NETWORK_ISSUES" | sed 's/;/<br>• /g' | sed 's/^/• /')
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-title">Sécurité</div>
                    <div class="metric-status">$SECURITY_STATUS</div>
                </div>
                <div class="metric-score $([ "$SECURITY_SCORE" -gt 80 ] && echo "score-green" || ([ "$SECURITY_SCORE" -gt 70 ] && echo "score-yellow" || echo "score-red"))">
                    ${SECURITY_SCORE}/100
                </div>
                <div class="metric-issues">
                    <strong>Issues:</strong><br>
                    $(echo "$SECURITY_ISSUES" | sed 's/;/<br>• /g' | sed 's/^/• /')
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-title">Monitoring</div>
                    <div class="metric-status">$MONITORING_STATUS</div>
                </div>
                <div class="metric-score $([ "$MONITORING_SCORE" -gt 80 ] && echo "score-green" || ([ "$MONITORING_SCORE" -gt 70 ] && echo "score-yellow" || echo "score-red"))">
                    ${MONITORING_SCORE}/100
                </div>
                <div class="metric-issues">
                    <strong>Issues:</strong><br>
                    $(echo "$MONITORING_ISSUES" | sed 's/;/<br>• /g' | sed 's/^/• /')
                </div>
            </div>
        </div>
        
        <div class="actions-section">
            <h2 class="actions-title">🎯 Actions Recommandées</h2>
$(
    echo "$ACTIONS" | while IFS= read -r action; do
        if [[ "$action" == *"🔥 URGENT"* ]]; then
            echo "            <div class=\"action-item action-urgent\">$action</div>"
        elif [[ "$action" == *"⚡ MEDIUM"* ]]; then
            echo "            <div class=\"action-item action-medium\">$action</div>"
        elif [[ "$action" == *"📈 LOW"* ]]; then
            echo "            <div class=\"action-item action-low\">$action</div>"
        else
            echo "            <div class=\"action-item action-maintenance\">$action</div>"
        fi
    done
)
        </div>
        
        <div class="footer">
            <p>🤖 Généré automatiquement par <strong>NEXIA Monitoring System</strong> | Cluster Kubernetes Health Monitor v1.0</p>
            <p>Prochaine vérification dans 1 heure | Rapport JSON: $(basename "$REPORT_JSON")</p>
        </div>
    </div>
</body>
</html>
EOF

echo "✅ HTML report generated: $HTML_OUTPUT"