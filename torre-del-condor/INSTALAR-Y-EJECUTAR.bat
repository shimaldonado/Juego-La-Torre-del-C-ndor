@echo off
cd /d "%~dp0"
echo ==========================================
echo  TORRE DEL CONDOR - INSTALACION NPM
echo ==========================================
echo.
echo Instalando dependencias...
npm install
if errorlevel 1 (
  echo.
  echo ERROR: npm install fallo.
  echo Prueba cerrar VS Code/PowerShell y ejecutar otra vez.
  pause
  exit /b 1
)
echo.
echo Abriendo servidor del juego...
npm run dev
pause
