#!/bin/bash

# Function to cleanup background processes on exit
cleanup() {
    echo "Shutting down services..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "Starting Shopify Dark Shepherd AI - Frontend & Backend"
echo "======================================================"

# Kill any existing processes on ports 3000 and 8000
echo "Cleaning up existing processes..."
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "python3 main.py" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true

# Wait a moment for processes to be killed
sleep 2

# Start the backend
echo "Starting backend server on http://localhost:8000"
cd backend-python
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start the frontend
echo "Starting frontend server on http://localhost:3000"
npm start &
FRONTEND_PID=$!

echo ""
echo "Services started successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "Dark Docs: http://localhost:8000/docs-dark"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait 