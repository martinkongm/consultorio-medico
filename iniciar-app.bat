@echo off
title Consultorio Médico - Iniciando aplicación

echo ==========================================
echo   INICIANDO EL SERVIDOR DEL CONSULTORIO
echo ==========================================
cd /d "%~dp0backend"
call npm install
start cmd /k "node server.js"

timeout /t 5 >nul

echo ==========================================
echo   INICIANDO LA INTERFAZ DEL SISTEMA
echo ==========================================
cd /d "%~dp0frontend"
call npm install
start cmd /k "npm run dev"

echo.
echo Todo listo. Abre tu navegador en http://localhost:5173
pause
