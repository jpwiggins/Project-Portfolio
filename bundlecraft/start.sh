#!/bin/sh
set -e

echo "[start.sh] NODE_ENV=${NODE_ENV} PORT=${PORT}"

# Choose server entry
if [ -f /app/dist/server/index.js ]; then
  NODE_ENTRY=/app/dist/server/index.js
elif [ -f /app/dist/index.js ]; then
  NODE_ENTRY=/app/dist/index.js
else
  echo "❌ Cannot find server entry in /app/dist"
  ls -R /app/dist || true
  exit 1
fi

# Start Node API (port 5000) in background
node "$NODE_ENTRY" &
NODE_PID=$!

# Handle termination
term() {
  echo "Stopping..."
  kill -TERM "$NODE_PID" 2>/dev/null || true
  wait "$NODE_PID" 2>/dev/null || true
  exit 0
}
trap term INT TERM

# Start Nginx in foreground
exec nginx -g 'daemon off;'
