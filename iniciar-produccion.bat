@echo off
title Consultorio Médico - Modo producción (un solo proceso)

echo ==========================================
echo   INSTALANDO DEPENDENCIAS DEL BACKEND
echo ==========================================
cd /d "%~dp0backend"
call npm install

echo.
echo ==========================================
echo   INSTALANDO Y COMPILANDO EL FRONTEND
echo ==========================================
cd /d "%~dp0frontend"
call npm install
call npm run build

echo.
echo ==========================================
echo   INICIANDO EL SISTEMA EN PRODUCCIÓN
echo   Abre tu navegador en http://localhost:3001
echo ==========================================
cd /d "%~dp0backend"
node server.js
pause
