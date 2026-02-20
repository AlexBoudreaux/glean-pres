#!/bin/bash
# Runs the enrichment pipeline, either now or scheduled for specific times.
# Usage:
#   Run now:           nohup caffeinate -dims bash experiment/scripts/run_enrichment.sh --now > experiment/enrichment_stdout.log 2>&1 &
#   Run at 11:30 PM:   nohup caffeinate -dims bash experiment/scripts/run_enrichment.sh 23:30 > experiment/enrichment_stdout.log 2>&1 &
#   Run at 4:30 AM:    nohup caffeinate -dims bash experiment/scripts/run_enrichment.sh 04:30 > experiment/enrichment_stdout.log 2>&1 &
#   Run at two times:  nohup caffeinate -dims bash experiment/scripts/run_enrichment.sh 23:30 04:30 > experiment/enrichment_stdout.log 2>&1 &

cd /Users/alexboudreaux/Developer/glean-pres

run_pipeline() {
    echo "$(date): Starting enrichment pipeline..."
    python3 experiment/scripts/enrich.py
    echo "$(date): Pipeline finished. Exit code: $?"
}

sleep_until() {
    local TARGET_TIME="$1"
    local TARGET_HOUR="${TARGET_TIME%%:*}"
    local TARGET_MIN="${TARGET_TIME##*:}"

    NOW=$(date +%s)
    TARGET=$(date -j -f "%H:%M:%S" "${TARGET_HOUR}:${TARGET_MIN}:00" +%s 2>/dev/null)

    if [ "$TARGET" -le "$NOW" ]; then
        TARGET=$((TARGET + 86400))
    fi

    WAIT=$((TARGET - NOW))
    HOURS=$((WAIT / 3600))
    MINS=$(( (WAIT % 3600) / 60 ))

    echo "$(date): Scheduled run at ${TARGET_TIME}. Sleeping for ${HOURS}h ${MINS}m"
    sleep $WAIT
}

if [ "$1" = "--now" ]; then
    run_pipeline
    exit 0
fi

if [ $# -eq 0 ]; then
    echo "Usage: $0 --now | HH:MM [HH:MM ...]"
    exit 1
fi

for TIME in "$@"; do
    sleep_until "$TIME"
    run_pipeline
    echo ""
done

echo "$(date): All scheduled runs complete."
