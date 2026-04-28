@echo off
REM Medico - Setup and Install Dependencies
REM Run this first to install all node modules

cd /d "%~dp0"

echo Installing root dependencies...
call npm install

echo.
echo Installing backend dependencies...
cd backend
call npm install
call npx prisma generate
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Dependencies installation complete!
echo You can now run run-app.bat to start the application
pause
