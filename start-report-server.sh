#!/bin/bash

# Simple HTTP server to view reports
echo "🌐 Starting NEXIA Report Server..."
echo "📄 Reports available at: http://localhost:8080"
echo "🔗 Latest report: http://localhost:8080/latest-health-report.html"
echo ""
echo "Press Ctrl+C to stop the server"

cd "/users/ludovicpilet/projects/NEXIA/reports"
python3 -m http.server 8080 2>/dev/null || python -m SimpleHTTPServer 8080
