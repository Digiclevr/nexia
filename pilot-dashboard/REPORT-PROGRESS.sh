#!/bin/bash
SCRIPTS_COUNT=$(ls -1 *.py 2>/dev/null | wc -l)
curl -X POST http://localhost:5011/api/cross-sessions/session-status \
  -H "Content-Type: application/json" \
  -d "{
    \"session_name\": \"Emergency Consulting\",
    \"session_id\": 2,
    \"status\": \"active\",
    \"day\": 1,
    \"progress\": {\"day_completion_rate\": 40},
    \"metrics\": {\"current_revenue\": 0, \"target_today\": 500, \"monitoring_scripts\": $SCRIPTS_COUNT},
    \"message\": \"CrisisBot monitoring actif - $SCRIPTS_COUNT scripts déployés\"
  }" > /dev/null
echo "✅ Emergency Consulting progress reported"
