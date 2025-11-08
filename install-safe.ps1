# Script de instalación segura que evita problemas con postinstall
# Este script instala las dependencias ignorando scripts postinstall

Write-Host "Instalación segura (ignorando scripts postinstall)..." -ForegroundColor Yellow
Write-Host ""

# Instalar en la raíz primero
Write-Host "Instalando dependencias de la raíz..." -ForegroundColor Cyan
npm install --ignore-scripts

Write-Host ""
Write-Host "Instalando dependencias de api..." -ForegroundColor Cyan
cd api
npm install --ignore-scripts
cd ..

Write-Host ""
Write-Host "Instalando dependencias de client..." -ForegroundColor Cyan
cd client
npm install --ignore-scripts
cd ..

Write-Host ""
Write-Host "Instalando dependencias de admin..." -ForegroundColor Cyan
cd admin
npm install --ignore-scripts
cd ..

Write-Host ""
Write-Host "Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Verificando instalación..." -ForegroundColor Yellow

# Verificar binarios
$tsxExists = Test-Path "api/node_modules/.bin/tsx.cmd" -or Test-Path "api/node_modules/.bin/tsx"
$viteClientExists = Test-Path "client/node_modules/.bin/vite.cmd" -or Test-Path "client/node_modules/.bin/vite"
$viteAdminExists = Test-Path "admin/node_modules/.bin/vite.cmd" -or Test-Path "admin/node_modules/.bin/vite"

if ($tsxExists) {
    Write-Host "tsx instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "tsx NO encontrado" -ForegroundColor Red
}

if ($viteClientExists) {
    Write-Host "vite (client) instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "vite (client) NO encontrado" -ForegroundColor Red
}

if ($viteAdminExists) {
    Write-Host "vite (admin) instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "vite (admin) NO encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "Nota: Los scripts postinstall fueron ignorados." -ForegroundColor Yellow
Write-Host "Si alguna dependencia los requiere, puedes ejecutarlos manualmente." -ForegroundColor Yellow
Write-Host ""
Write-Host "Ahora puedes ejecutar:" -ForegroundColor Yellow
Write-Host "  npm run dev:api" -ForegroundColor Cyan
Write-Host "  npm run dev:client" -ForegroundColor Cyan
Write-Host "  npm run dev:admin" -ForegroundColor Cyan
