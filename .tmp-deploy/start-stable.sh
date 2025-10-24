#!/bin/bash

echo "🔥 Starting Stable Farm ERP Server with all data..."

# Kill any existing servers
echo "🚫 Stopping any existing servers..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5002 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start the stable server
echo "🚀 Starting stable server on port 5001..."
cd "/Volumes/My Drive/Dev/dream farm/FarmDreamERP"

# Run the stable server
node server/stable-server.js

echo "✅ Stable server started!"
echo "🌐 Open http://localhost:5001 to see your data"
echo "📊 All your batches, animals, accounting entries, and KPIs are saved!"