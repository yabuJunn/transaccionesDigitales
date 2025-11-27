@echo off
echo Limpiando proyecto...
echo.

echo Eliminando node_modules...
if exist node_modules rmdir /s /q node_modules
if exist client\node_modules rmdir /s /q client\node_modules
if exist admin\node_modules rmdir /s /q admin\node_modules
if exist api\node_modules rmdir /s /q api\node_modules

echo Eliminando package-lock.json...
if exist package-lock.json del /f /q package-lock.json
if exist client\package-lock.json del /f /q client\package-lock.json
if exist admin\package-lock.json del /f /q admin\package-lock.json
if exist api\package-lock.json del /f /q api\package-lock.json

echo Limpiando cache de npm...
npm cache clean --force

echo.
echo Limpieza completada!
echo.
echo Ahora puedes ejecutar: npm install
pause









