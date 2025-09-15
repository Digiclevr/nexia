#!/bin/bash

echo "🚨 REDÉMARRAGE DASHBOARD AVEC EMERGENCY CONSULTING"
echo "=================================================="

# Kill existing processes on ports 5010 and 5011
echo "Arrêt des processus existants..."
lsof -ti:5010 | xargs kill -9 2>/dev/null || true
lsof -ti:5011 | xargs kill -9 2>/dev/null || true

echo "Attente 2 secondes..."
sleep 2

# Start backend
echo "Démarrage backend (port 5011)..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "Attente démarrage backend..."
sleep 5

# Start frontend
echo "Démarrage frontend (port 5010)..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ DASHBOARD EMERGENCY CONSULTING DÉMARRÉ"
echo "=================================================="
echo "📊 Dashboard: http://localhost:5010"
echo "🚨 Emergency Consulting: http://localhost:5010/emergency-consulting"
echo "🔧 API Backend: http://localhost:5011"
echo "🏥 Health Check: http://localhost:5011/health"
echo ""
echo "PIDs:"
echo "• Backend: $BACKEND_PID"
echo "• Frontend: $FRONTEND_PID"
echo ""
echo "Pour arrêter: kill $BACKEND_PID $FRONTEND_PID"
echo "Ou utiliser: lsof -ti:5010,5011 | xargs kill -9"

# Wait for user input to stop
echo ""
echo "Appuyez sur Ctrl+C pour arrêter..."
wait