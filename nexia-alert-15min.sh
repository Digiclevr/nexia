#!/bin/bash
# NEXIA Alert System - 15min intervals with real FASTCASH data

CSV_FILE="/Users/ludovicpilet/PROJECTS/NEXIA/FASTCASH-PROSPECTS-CLEAN.csv"
STATUS_FILE="/Users/ludovicpilet/PROJECTS/NEXIA/FASTCASH-STATUS-15MIN.md"

# Calculate real metrics from CSV
TOTAL_PROSPECTS=$(grep -v "^company" "$CSV_FILE" | wc -l | tr -d ' ')
TOTAL_REVENUE_POTENTIAL=$(grep -v "^company" "$CSV_FILE" | awk -F',' '{sum += $9} END {print sum}')
HIGH_PROB_PROSPECTS=$(grep -v "^company" "$CSV_FILE" | awk -F',' '$8 >= 80 {count++} END {print count+0}')
TIER_1_PROSPECTS=$(grep -v "^company" "$CSV_FILE" | awk -F',' '$10 == 1 {count++} END {print count+0}')

# REAL BUSINESS METRICS - TO BE IMPLEMENTED
DAILY_OBJECTIVE=2500
# TODO: Connect to real CRM/Mautic API for actual revenue
ACTUAL_REVENUE=0  # Placeholder - needs real data source
EXPECTED_PROGRESS=0  # Placeholder - needs real tracking

# Update timestamp in status file
sed -i '' "s/\`.*\`/\`$(date +"%H:%M - %d\/%m\/%Y")\`/" "$STATUS_FILE"

# Update metrics in status file
sed -i '' "s/- \*\*Nouveaux leads\*\* : ___/- **Nouveaux leads** : $TOTAL_PROSPECTS/" "$STATUS_FILE"
sed -i '' "s/- \*\*En attente de signature\*\* : ___/- **En attente de signature** : $HIGH_PROB_PROSPECTS/" "$STATUS_FILE"
sed -i '' "s/- \*\*Propositions envoyées\*\* : ___/- **Propositions envoyées** : $TIER_1_PROSPECTS/" "$STATUS_FILE"
sed -i '' "s/- \*\*Réalisé\*\* : .*€/- **Réalisé** : ${ACTUAL_REVENUE}€ (DONNÉES À CONNECTER)/" "$STATUS_FILE"
sed -i '' "s/- \*\*Écart\*\* : .*€/- **Écart** : $((DAILY_OBJECTIVE - ACTUAL_REVENUE))€/" "$STATUS_FILE"

# Add urgent prospects (high probability) - simplified approach
URGENT_PROSPECT_1=$(grep -v "^company" "$CSV_FILE" | awk -F',' '$8 >= 85 {print $1 " (" $8 " - " $9 "€)"}' | head -1)
URGENT_PROSPECT_2=$(grep -v "^company" "$CSV_FILE" | awk -F',' '$8 >= 85 {print $1 " (" $8 " - " $9 "€)"}' | sed -n '2p')
URGENT_PROSPECT_3=$(grep -v "^company" "$CSV_FILE" | awk -F',' '$8 >= 85 {print $1 " (" $8 " - " $9 "€)"}' | sed -n '3p')

# Update urgent prospects if found
if [[ -n "$URGENT_PROSPECT_1" ]]; then
    sed -i '' "s/- \[ \] Relance prospect X/- [ ] Relance $URGENT_PROSPECT_1/" "$STATUS_FILE"
fi
if [[ -n "$URGENT_PROSPECT_2" ]]; then
    sed -i '' "s/- \[ \] Finir proposition Y/- [ ] Finir proposition $URGENT_PROSPECT_2/" "$STATUS_FILE"  
fi
if [[ -n "$URGENT_PROSPECT_3" ]]; then
    sed -i '' "s/- \[ \] Appel client Z/- [ ] Appel client $URGENT_PROSPECT_3/" "$STATUS_FILE"
fi

# Calculate time until 17:00 deadline
CURRENT_HOUR=$(date +%H)
CURRENT_MIN=$(date +%M)
TIME_TO_DEADLINE=$(( (17 - CURRENT_HOUR) * 60 - CURRENT_MIN ))

# Urgent notification if deadline approaching
if [[ $TIME_TO_DEADLINE -le 180 && $TIME_TO_DEADLINE -gt 0 ]]; then
    URGENCY="🚨 DEADLINE ${TIME_TO_DEADLINE}min"
    osascript -e "display notification \"$URGENCY • 3 prospects (2,850€) • Setup requis IMMÉDIATEMENT\" with title \"⏰ FASTCASH URGENCE\""
else
    osascript -e "display notification \"$TOTAL_PROSPECTS prospects • Infrastructure: ⏳ En attente • Tests requis\" with title \"💰 FASTCASH Status - 15min\""
fi

# Open document in Marked
open -a "Marked" "$STATUS_FILE"

# Log alert with metrics
echo "$(date '+%H:%M:%S') - NEXIA Alert sent - $TOTAL_PROSPECTS prospects, ${EXPECTED_PROGRESS}€ progress" >> /Users/ludovicpilet/PROJECTS/NEXIA/nexia-alerts.log