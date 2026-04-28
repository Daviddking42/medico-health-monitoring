#!/bin/bash
# Medico Health Monitoring App - Linux/Mac Startup Script

echo ""
echo "========================================"
echo "   Medico - Health Monitoring App"
echo "   Starting Application..."
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Navigate to the project directory
cd "$(dirname "$0")"

echo "[1/4] Installing dependencies..."
npm install

echo ""
echo "[2/4] Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "[3/4] Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "[4/4] Setting up Prisma database..."
cd backend
npx prisma migrate dev --name init
cd ..

echo ""
echo "========================================"
echo "    Starting Servers"
echo "========================================"
echo ""
echo "Backend server will start on: http://localhost:5000"
echo "Frontend server will start on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start backend
(cd backend && npm run dev) &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
(cd frontend && npm start) &
FRONTEND_PID=$!

# Wait for both processes
wait
