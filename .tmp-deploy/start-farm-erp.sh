#!/bin/bash

echo "🔥 Farm ERP System - Starting with All Data Ready!"

# Kill any existing processes on port 5001
echo "🚫 Cleaning up any existing processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Wait for cleanup
sleep 2

# Navigate to project directory
cd "/Volumes/My Drive/Dev/dream farm/FarmDreamERP"

# Start the server with nohup to keep it running
echo "🚀 Starting Farm ERP Server..."
nohup npx tsx server/stable-server.ts > server.log 2>&1 &

# Get the process ID
SERVER_PID=$!

echo "✅ Server started with PID: $SERVER_PID"
echo "🌐 Server is running on http://localhost:5001"
echo "📊 All your data is available:"
echo "   - Batches: http://localhost:5001/api/batches"
echo "   - Animals: http://localhost:5001/api/animals"  
echo "   - Accounting: http://localhost:5001/api/accounting"
echo "   - Performance Goals: http://localhost:5001/api/performance-goals"

# Wait a moment for server to start
sleep 3

# Test that server is responding
echo "🧪 Testing server..."
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Server is responding!"
    
    # Show data counts
    echo "📈 Data Summary:"
    BATCHES=$(curl -s http://localhost:5001/api/batches | jq length 2>/dev/null || echo "N/A")
    ANIMALS=$(curl -s http://localhost:5001/api/animals | jq length 2>/dev/null || echo "N/A")
    ACCOUNTING=$(curl -s http://localhost:5001/api/accounting | jq length 2>/dev/null || echo "N/A")
    GOALS=$(curl -s http://localhost:5001/api/performance-goals | jq length 2>/dev/null || echo "N/A")
    
    echo "   - Batches: $BATCHES"
    echo "   - Animals: $ANIMALS" 
    echo "   - Accounting Entries: $ACCOUNTING"
    echo "   - Performance Goals: $GOALS"
    
    echo ""
    echo "🎉 Your Farm ERP system is ready!"
    echo "🖥️  Open http://localhost:5001 in your browser"
    echo "📝 Server logs: tail -f server.log"
    echo "🛑 To stop: kill $SERVER_PID"
else
    echo "❌ Server not responding. Check server.log for errors."
fi