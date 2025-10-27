#!/bin/bash

echo "🚀 Starting HSE NCHD Rostering System"
echo "======================================"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Check if backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend virtual environment not found!"
    echo "Please run: chmod +x setup-backend-fixed.sh && ./setup-backend-fixed.sh"
    exit 1
fi

# Start backend
echo "Starting backend server..."
cd backend

# Activate virtual environment and start server
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Backend running at http://localhost:8000"
else
    echo "⚠️  Backend may not be ready yet, checking logs..."
    sleep 3
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ Backend running at http://localhost:8000"
    else
        echo "❌ Backend failed to start. Check logs above."
        exit 1
    fi
fi

# Start frontend
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

echo ""
echo "✅ System is running!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
wait
