#!/bin/bash
# Sleeps until 3:00 AM local time, then runs the enrichment pipeline.
# Usage: nohup caffeinate -dims bash experiment/scripts/run_at_3am.sh > experiment/enrichment_stdout.log 2>&1 &

TARGET_HOUR=3
TARGET_MIN=0

NOW=$(date +%s)
TARGET=$(date -j -f "%H:%M:%S" "$(printf '%02d:%02d:00' $TARGET_HOUR $TARGET_MIN)" +%s 2>/dev/null)

# If 3 AM already passed today, schedule for tomorrow
if [ "$TARGET" -le "$NOW" ]; then
    TARGET=$((TARGET + 86400))
fi

WAIT=$((TARGET - NOW))
HOURS=$((WAIT / 3600))
MINS=$(( (WAIT % 3600) / 60 ))

echo "$(date): Scheduled to start at 3:00 AM local time"
echo "$(date): Sleeping for ${HOURS}h ${MINS}m (${WAIT} seconds)"
echo "$(date): Will start at approximately $(date -r $TARGET)"
echo ""

sleep $WAIT

echo "$(date): Waking up. Starting enrichment pipeline..."
cd /Users/alexboudreaux/Developer/glean-pres
python3 experiment/scripts/enrich.py
