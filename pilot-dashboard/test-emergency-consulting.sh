#!/bin/bash

echo "🔍 TEST INTÉGRATION EMERGENCY CONSULTING"
echo "========================================"

# Test que les serveurs tournent
echo "1. Vérification serveurs actifs:"
if lsof -i:5010 >/dev/null 2>&1; then
    echo "✅ Frontend (5010): RUNNING"
else
    echo "❌ Frontend (5010): NOT RUNNING"
fi

if lsof -i:5011 >/dev/null 2>&1; then
    echo "✅ Backend (5011): RUNNING"
else
    echo "❌ Backend (5011): NOT RUNNING"
fi

echo ""

# Test accès frontend
echo "2. Test accès dashboard:"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5010)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Dashboard accessible: http://localhost:5010"
else
    echo "❌ Dashboard non accessible (HTTP $FRONTEND_STATUS)"
fi

echo ""

# Test API Emergency Consulting
echo "3. Test API Emergency Consulting:"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5011/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend API accessible"
    
    # Test route Emergency Consulting
    EC_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5011/api/emergency-consulting/status)
    if [ "$EC_STATUS" = "200" ]; then
        echo "✅ Emergency Consulting API: OPERATIONAL"
        
        # Get actual data
        echo ""
        echo "📊 Status Emergency Consulting:"
        curl -s http://localhost:5011/api/emergency-consulting/status | python3 -m json.tool 2>/dev/null || echo "JSON parsing failed"
        
    else
        echo "❌ Emergency Consulting API not accessible (HTTP $EC_STATUS)"
    fi
else
    echo "❌ Backend API non accessible (HTTP $BACKEND_STATUS)"
fi

echo ""

# Test leads endpoint
echo "4. Test endpoint leads:"
LEADS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5011/api/emergency-consulting/leads)
if [ "$LEADS_STATUS" = "200" ]; then
    echo "✅ Leads API accessible"
    LEADS_COUNT=$(curl -s http://localhost:5011/api/emergency-consulting/leads | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
    echo "📈 Nombre de leads: $LEADS_COUNT"
else
    echo "❌ Leads API non accessible (HTTP $LEADS_STATUS)"
fi

echo ""

# URLs utiles
echo "🌐 ACCÈS RAPIDE:"
echo "• Dashboard principal: http://localhost:5010"
echo "• Emergency Consulting: http://localhost:5010/emergency-consulting"
echo "• API Health: http://localhost:5011/health"
echo "• Emergency API: http://localhost:5011/api/emergency-consulting/status"

echo ""

# Status final
if [ "$FRONTEND_STATUS" = "200" ] && [ "$EC_STATUS" = "200" ]; then
    echo "🎉 INTÉGRATION EMERGENCY CONSULTING: ✅ OPÉRATIONNELLE"
    echo "Vous pouvez maintenant accéder à Emergency Consulting via le dashboard!"
else
    echo "⚠️ INTÉGRATION INCOMPLÈTE - Vérifier les serveurs"
    echo "💡 Pour redémarrer: ./restart-with-emergency-consulting.sh"
fi

echo "========================================"