@echo off
REM Medico Health Monitoring App - Startup Script
REM This script starts both the backend and frontend servers

echo.
echo ========================================
echo    Medico - Health Monitoring App
echo    Starting Application...
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to the project directory
cd /d "%~dp0"

echo [1/4] Installing dependencies...
call npm install 2>nul
if errorlevel 1 (
    echo Note: npm install for root completed or skipped
)

echo.
echo [2/4] Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
)
cd ..

echo.
echo [3/4] Installing frontend dependencies...
cd frontend
if not exist node_modules (
    call npm install
)
cd ..

echo.
echo [4/4] Setting up Prisma database...
cd backend
call npx prisma migrate dev --name init 2>nul
cd ..

echo.
echo ========================================
echo    Starting Servers
echo ========================================
echo.
echo Backend server will start on: http://localhost:5000
echo Frontend server will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start backend in a new window
start "Medico Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in another new window
start "Medico Frontend Server" cmd /k "cd frontend && npm start"

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
