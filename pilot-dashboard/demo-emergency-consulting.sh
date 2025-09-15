#!/bin/bash

echo "🎬 DÉMONSTRATION EMERGENCY CONSULTING INTÉGRÉ"
echo "============================================="

# Fonction pour créer un lead fictif
create_sample_lead() {
    echo "📊 Création d'un nouveau lead de démonstration..."
    curl -s -X POST http://localhost:5011/api/emergency-consulting/trigger-detection \
         -H "Content-Type: application/json" \
         -d '{"source": "github"}' | python3 -m json.tool 2>/dev/null || echo "Lead creation failed"
}

# Fonction pour simuler contact lead
contact_lead() {
    echo "📞 Simulation contact du lead lead_001..."
    curl -s -X POST http://localhost:5011/api/emergency-consulting/contact-lead/lead_001 | python3 -m json.tool 2>/dev/null || echo "Contact failed"
}

# Fonction pour créer session
create_session() {
    echo "💰 Création session consulting..."
    curl -s -X POST http://localhost:5011/api/emergency-consulting/create-session \
         -H "Content-Type: application/json" \
         -d '{"leadId": "lead_001"}' | python3 -m json.tool 2>/dev/null || echo "Session creation failed"
}

echo ""
echo "🌐 ACCÈS DASHBOARD EMERGENCY CONSULTING:"
echo "URL: http://localhost:5010/emergency-consulting"
echo ""

echo "📊 STATUS INITIAL:"
curl -s http://localhost:5011/api/emergency-consulting/status | python3 -m json.tool 2>/dev/null

echo ""
echo "📋 LEADS DISPONIBLES:"
curl -s http://localhost:5011/api/emergency-consulting/leads | python3 -c "
import sys, json
leads = json.load(sys.stdin)
for lead in leads:
    print(f\"• {lead['id']} - {lead['source']} - {lead['type']} - €{lead['estimated_value']} - {lead['priority']}\")
"

echo ""
echo "🎯 SIMULATION WORKFLOW EMERGENCY CONSULTING:"
echo "1. Création nouveau lead..."
create_sample_lead

echo ""
echo "2. Contact du lead..."
contact_lead

echo ""
echo "3. Création session consulting..."
create_session

echo ""
echo "📈 STATUS APRÈS SIMULATION:"
curl -s http://localhost:5011/api/emergency-consulting/status | python3 -m json.tool 2>/dev/null

echo ""
echo "🚀 SYSTÈME EMERGENCY CONSULTING OPÉRATIONNEL!"
echo "============================================="
echo ""
echo "📱 ACTIONS DISPONIBLES DANS LE DASHBOARD:"
echo "• 🔍 Monitoring leads en temps réel"
echo "• 📞 Contact leads détectés"  
echo "• 💰 Création sessions consulting"
echo "• 💳 Gestion payments Stripe"
echo "• 📊 Tracking revenue jour"
echo "• 🎯 Progress vers objectif €400-600"
echo ""
echo "🌐 ACCÈS DIRECT:"
echo "• Dashboard: http://localhost:5010"
echo "• Emergency Consulting: http://localhost:5010/emergency-consulting"
echo ""
echo "✅ MISSION EMERGENCY CONSULTING PRÊTE!"
echo "Objectif: €400-€600 aujourd'hui via consulting API crisis"