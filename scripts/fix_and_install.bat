@echo off
REM Medico Health Monitoring App - Fix and Install Script
REM This script resets node_modules and reinstalls dependencies correctly

echo.
echo ========================================
echo    Medico - Environment Fix
echo ========================================
echo.

REM Navigate to root
cd /d "%~dp0.."

echo [1/6] Stopping any running node processes...
taskkill /F /IM node.exe /T 2>nul
echo Done.

echo.
echo [2/6] Removing node_modules and package-locks...
if exist "node_modules" rd /s /q "node_modules"
if exist "backend\node_modules" rd /s /q "backend\node_modules"
if exist "frontend\node_modules" rd /s /q "frontend\node_modules"
if exist "package-lock.json" del /f /q "package-lock.json"
if exist "backend\package-lock.json" del /f /q "backend\package-lock.json"
if exist "frontend\package-lock.json" del /f /q "frontend\package-lock.json"
echo Done.

echo.
echo [3/6] Cleaning npm cache...
call npm cache clean --force 2>nul
echo Done.

echo.
echo [4/6] Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Root npm install failed
    pause
    exit /b 1
)

echo.
echo [5/6] Setting up Backend...
cd backend
call npm install
call npx prisma migrate dev --name init
call npx prisma db seed
cd ..

echo.
echo [6/6] Setting up Frontend...
cd frontend
call npm install
cd ..

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start the app, run: run-app.bat
echo.
pause