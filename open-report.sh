#!/bin/bash

# =====================================================
# NEXIA REPORT VIEWER
# =====================================================
# Opens the latest health report in browser

REPORTS_DIR="/users/ludovicpilet/projects/NEXIA/reports"
LATEST_REPORT="${REPORTS_DIR}/latest-health-report.html"

echo "🔍 NEXIA - Opening latest health report..."

# Check if report exists
if [ ! -f "$LATEST_REPORT" ]; then
    echo "❌ No report found. Running health check first..."
    /users/ludovicpilet/projects/NEXIA/run-health-check.sh
fi

# Start server and open browser
echo "🌐 Starting web server on port 8080..."
cd "$REPORTS_DIR"

# Kill any existing server
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Start server in background
python3 -m http.server 8080 >/dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

echo "📊 Opening report in browser..."
echo "🔗 URL: http://localhost:8080/latest-health-report.html"

# Open in default browser
open "http://localhost:8080/latest-health-report.html" 2>/dev/null || \
xdg-open "http://localhost:8080/latest-health-report.html" 2>/dev/null || \
echo "Please open: http://localhost:8080/latest-health-report.html"

echo ""
echo "✅ Report server started (PID: $SERVER_PID)"
echo "🌐 Available at: http://localhost:8080/"
echo "🔗 Latest report: http://localhost:8080/latest-health-report.html"
echo ""
echo "Press Ctrl+C to stop the server when done."

# Keep server running
wait $SERVER_PID