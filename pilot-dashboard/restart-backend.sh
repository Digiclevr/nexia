#!/bin/bash

echo "🔄 REDÉMARRAGE BACKEND AVEC EMERGENCY CONSULTING"
echo "==============================================="

# Kill backend process
echo "Arrêt backend (port 5011)..."
lsof -ti:5011 | xargs kill -9 2>/dev/null || true

echo "Attente 2 secondes..."
sleep 2

# Start backend
echo "Démarrage backend avec Emergency Consulting..."
cd backend
npm start &
BACKEND_PID=$!

echo ""
echo "✅ BACKEND REDÉMARRÉ"
echo "Backend PID: $BACKEND_PID"
echo "Port: 5011"
echo ""
echo "Test dans 5 secondes..."
sleep 5

# Test Emergency Consulting API
echo "🔍 Test Emergency Consulting API:"
EC_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5011/api/emergency-consulting/status)
if [ "$EC_STATUS" = "200" ]; then
    echo "✅ Emergency Consulting API: OPÉRATIONNELLE"
    echo ""
    echo "📊 Données de test:"
    curl -s http://localhost:5011/api/emergency-consulting/status | python3 -m json.tool 2>/dev/null || echo "JSON parsing failed"
else
    echo "❌ Emergency Consulting API: HTTP $EC_STATUS"
fi

echo ""
echo "🌐 URLs accessibles:"
echo "• Dashboard: http://localhost:5010"
echo "• Emergency Consulting: http://localhost:5010/emergency-consulting"
echo "• API Status: http://localhost:5011/api/emergency-consulting/status"
echo "• API Leads: http://localhost:5011/api/emergency-consulting/leads"

echo ""
echo "✅ BACKEND PRÊT AVEC EMERGENCY CONSULTING!"