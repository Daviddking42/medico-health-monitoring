@echo off
REM =================================================
REM Medico Health Monitoring App - Documentation Index
REM =================================================

echo.
echo ========================================
echo     Medico Documentation Navigation
echo ========================================
echo.
echo Choose a document to read:
echo.
echo   [1] QUICKSTART.md      - 30-second setup (recommended)
echo   [2] SETUP.md           - Detailed setup & troubleshooting
echo   [3] README.md          - Complete project documentation
echo   [4] API.md             - API endpoint documentation
echo   [5] DEVELOPMENT.md     - Development guide
echo   [6] PROJECT_SUMMARY.md - Project completion summary
echo.
echo   [Q] Quit
echo.
set /p choice="Enter your choice (1-6 or Q): "

if /i "%choice%"=="1" start notepad.exe QUICKSTART.md
if /i "%choice%"=="2" start notepad.exe SETUP.md
if /i "%choice%"=="3" start notepad.exe README.md
if /i "%choice%"=="4" start notepad.exe API.md
if /i "%choice%"=="5" start notepad.exe DEVELOPMENT.md
if /i "%choice%"=="6" start notepad.exe PROJECT_SUMMARY.md
if /i "%choice%"=="Q" goto :eof

echo.
echo Opening document...
timeout /t 2 /nobreak
