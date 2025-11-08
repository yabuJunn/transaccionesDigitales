# Script de reinstalación completa
# Limpia e instala todas las dependencias correctamente

Write-Host "🧹 Limpiando proyecto..." -ForegroundColor Yellow
Write-Host ""

# Limpiar node_modules
Write-Host "Eliminando node_modules..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force client/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force admin/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force api/node_modules -ErrorAction SilentlyContinue

# Limpiar package-lock.json
Write-Host "Eliminando package-lock.json..." -ForegroundColor Cyan
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force client/package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force admin/package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force api/package-lock.json -ErrorAction SilentlyContinue

# Limpiar caché
Write-Host "Limpiando caché de npm..." -ForegroundColor Cyan
npm cache clean --force

Write-Host ""
Write-Host "📦 Instalando dependencias (ignorando scripts postinstall)..." -ForegroundColor Yellow
Write-Host ""

# Instalar en la raíz primero (ignorando scripts para evitar problemas con postinstall)
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
Write-Host "✅ Dependencias instaladas (scripts postinstall ignorados)" -ForegroundColor Green
Write-Host ""
Write-Host "Nota: Si alguna dependencia requiere scripts postinstall," -ForegroundColor Yellow
Write-Host "puedes ejecutarlos manualmente después si es necesario." -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Verificando instalación..." -ForegroundColor Yellow

# Verificar binarios
$tsxExists = Test-Path "api/node_modules/.bin/tsx.cmd" -or Test-Path "api/node_modules/.bin/tsx"
$viteClientExists = Test-Path "client/node_modules/.bin/vite.cmd" -or Test-Path "client/node_modules/.bin/vite"
$viteAdminExists = Test-Path "admin/node_modules/.bin/vite.cmd" -or Test-Path "admin/node_modules/.bin/vite"

if ($tsxExists) {
    Write-Host "✅ tsx instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ tsx NO encontrado" -ForegroundColor Red
}

if ($viteClientExists) {
    Write-Host "✅ vite (client) instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ vite (client) NO encontrado" -ForegroundColor Red
}

if ($viteAdminExists) {
    Write-Host "✅ vite (admin) instalado correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ vite (admin) NO encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "Ahora puedes ejecutar:" -ForegroundColor Yellow
Write-Host "  npm run dev:api" -ForegroundColor Cyan
Write-Host "  npm run dev:client" -ForegroundColor Cyan
Write-Host "  npm run dev:admin" -ForegroundColor Cyan

