#!/bin/bash
FILES_COUNT=$(ls -1 *.md 2>/dev/null | wc -l)
curl -X POST http://localhost:5011/api/cross-sessions/session-status \
  -H "Content-Type: application/json" \
  -d "{
    \"session_name\": \"API Audits\",
    \"session_id\": 1,
    \"status\": \"active\",
    \"day\": 1,
    \"progress\": {\"day_completion_rate\": 25},
    \"metrics\": {\"current_revenue\": 0, \"target_today\": 800, \"files_created\": $FILES_COUNT},
    \"message\": \"Setup phase - AuditBot configuré, $FILES_COUNT fichiers créés\"
  }" > /dev/null
echo "✅ API Audits progress reported"
