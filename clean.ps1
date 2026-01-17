# Script de limpieza para Windows
# Elimina node_modules y package-lock.json de todos los proyectos

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

# Limpiar caché de npm
Write-Host "Limpiando caché de npm..." -ForegroundColor Cyan
npm cache clean --force

Write-Host ""
Write-Host "✅ Limpieza completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes ejecutar: npm install" -ForegroundColor Yellow











