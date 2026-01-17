# Solución de Problemas de Instalación

## Problema: Errores de instalación en Windows

Si encuentras errores como `EBUSY`, `EPERM`, o archivos bloqueados durante `npm install`, sigue estos pasos:

## Solución Paso a Paso

### 1. Limpiar node_modules y package-lock.json

**Opción A: Usando PowerShell (Recomendado)**

```powershell
# Desde la raíz del proyecto
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Limpiar en cada workspace
Remove-Item -Recurse -Force client/node_modules -ErrorAction SilentlyContinue
Remove-Item -Force client/package-lock.json -ErrorAction SilentlyContinue

Remove-Item -Recurse -Force admin/node_modules -ErrorAction SilentlyContinue
Remove-Item -Force admin/package-lock.json -ErrorAction SilentlyContinue

Remove-Item -Recurse -Force api/node_modules -ErrorAction SilentlyContinue
Remove-Item -Force api/package-lock.json -ErrorAction SilentlyContinue
```

**Opción B: Usando CMD**

```cmd
rmdir /s /q node_modules
del /f package-lock.json

rmdir /s /q client\node_modules
del /f client\package-lock.json

rmdir /s /q admin\node_modules
del /f admin\package-lock.json

rmdir /s /q api\node_modules
del /f api\package-lock.json
```

**Opción C: Si los archivos están bloqueados**

1. Cierra todos los editores de código (VS Code, Cursor, etc.)
2. Cierra cualquier terminal que esté ejecutando procesos
3. Abre el Administrador de Tareas (Ctrl+Shift+Esc)
4. Busca procesos de Node.js y termínalos
5. Intenta eliminar `node_modules` nuevamente

### 2. Limpiar caché de npm

```bash
npm cache clean --force
```

### 3. Instalar dependencias nuevamente

**Opción A: Instalación desde la raíz (con workspaces)**

```bash
npm install
```

**Opción B: Instalación individual (si workspaces falla)**

```bash
# Instalar dependencias de la raíz
npm install

# Instalar dependencias de cada proyecto
cd client && npm install && cd ..
cd admin && npm install && cd ..
cd api && npm install && cd ..
```

### 4. Si aún hay problemas con archivos bloqueados

**Usar rimraf (herramienta más robusta para Windows)**

```bash
# Instalar rimraf globalmente
npm install -g rimraf

# Limpiar con rimraf
rimraf node_modules
rimraf client/node_modules
rimraf admin/node_modules
rimraf api/node_modules

# Luego instalar
npm install
```

### 5. Verificar que no haya procesos bloqueando archivos

**En PowerShell:**

```powershell
# Ver procesos de Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Ver procesos que usan archivos en node_modules
Get-Process | Where-Object {$_.Path -like "*node_modules*"} | Stop-Process -Force
```

## Dependencias Actualizadas

He actualizado las siguientes dependencias para resolver los warnings:

- ✅ `eslint`: Mantenido en v8.57.1 (última versión estable de v8)
- ✅ `@typescript-eslint/eslint-plugin`: Actualizado a v7.18.0
- ✅ `@typescript-eslint/parser`: Actualizado a v7.18.0
- ✅ `supertest`: Actualizado a v7.0.0
- ✅ `eslint-plugin-react-hooks`: Mantenido en v4.6.0 (compatible con eslint v8)

## Notas sobre los Warnings

Los siguientes warnings son **normales** y no afectan la funcionalidad:

- ⚠️ `inflight@1.0.6`: Es una dependencia transitiva antigua, pero no afecta el funcionamiento
- ⚠️ `rimraf@3.0.2`: Dependencia transitiva, no crítica
- ⚠️ `glob@7.2.3`: Dependencia transitiva, no crítica
- ⚠️ `superagent@8.1.2`: Dependencia transitiva de supertest, se actualizará con supertest v7

## Verificación Post-Instalación

Después de instalar, verifica que todo esté correcto:

```bash
# Verificar que los scripts funcionen
npm run dev:api --dry-run
npm run dev:client --dry-run
npm run dev:admin --dry-run

# Verificar que TypeScript compile
cd api && npm run build
cd ../client && npm run build
cd ../admin && npm run build
```

## Si el problema persiste

1. **Actualizar npm:**
   ```bash
   npm install -g npm@latest
   ```

2. **Usar yarn en lugar de npm:**
   ```bash
   npm install -g yarn
   yarn install
   ```

3. **Verificar permisos:**
   - Asegúrate de tener permisos de escritura en la carpeta del proyecto
   - Ejecuta PowerShell/CMD como administrador si es necesario

4. **Revisar antivirus:**
   - Algunos antivirus bloquean la creación de archivos en `node_modules`
   - Agrega la carpeta del proyecto a las excepciones del antivirus

## Comandos Rápidos de Limpieza

Crea un script `clean.ps1` en la raíz:

```powershell
# clean.ps1
Write-Host "Limpiando node_modules..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force client/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force admin/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force api/node_modules -ErrorAction SilentlyContinue

Write-Host "Limpiando package-lock.json..." -ForegroundColor Yellow
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force client/package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force admin/package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force api/package-lock.json -ErrorAction SilentlyContinue

Write-Host "Limpiando caché de npm..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "✅ Limpieza completada!" -ForegroundColor Green
```

Ejecuta con:
```powershell
.\clean.ps1
```











