# Solución: Dependencias No Instaladas Correctamente

## Problema

Los errores indican que las dependencias (`tsx`, `vite`, etc.) no se instalaron correctamente. Esto es común con npm workspaces en Windows.

## Solución Paso a Paso

### 1. Limpiar Todo Primero

```powershell
# Ejecuta el script de limpieza
.\clean.ps1

# O manualmente:
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force client/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force admin/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force api/node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force client/package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force admin/package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force api/package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
```

### 2. Instalar Dependencias Individualmente

**Opción A: Instalación Individual (Recomendado si workspaces falla)**

```bash
# Instalar en la raíz
npm install

# Instalar en cada proyecto individualmente
cd api
npm install
cd ../client
npm install
cd ../admin
npm install
cd ..
```

**Opción B: Instalación con Workspaces**

```bash
# Desde la raíz
npm install
```

### 3. Verificar Instalación

Después de instalar, verifica que los binarios existan:

```powershell
# Verificar tsx
Test-Path "api/node_modules/.bin/tsx.cmd"
Test-Path "api/node_modules/.bin/tsx"

# Verificar vite
Test-Path "client/node_modules/.bin/vite.cmd"
Test-Path "client/node_modules/.bin/vite"
Test-Path "admin/node_modules/.bin/vite.cmd"
Test-Path "admin/node_modules/.bin/vite"
```

### 4. Si Aún No Funciona

**Reinstalar desde cero:**

```powershell
# 1. Limpiar
.\clean.ps1

# 2. Eliminar node_modules de la raíz también (si existe)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# 3. Instalar individualmente en cada carpeta
cd api
npm install
cd ../client
npm install
cd ../admin
npm install
cd ..
```

### 5. Verificar que los Scripts Funcionen

```bash
# Probar API
cd api
npm run dev

# En otra terminal, probar client
cd client
npm run dev

# En otra terminal, probar admin
cd admin
npm run dev
```

## Cambios Realizados

He actualizado los scripts para usar `npx` que busca automáticamente los binarios en `node_modules/.bin`. Esto debería resolver el problema.

Los scripts ahora usan:
- `npx tsx` en lugar de `tsx`
- `npx vite` en lugar de `vite`
- `npx tsc` en lugar de `tsc`
- `npx eslint` en lugar de `eslint`
- `npx jest` en lugar de `jest`

## Si el Problema Persiste

1. **Verificar versión de npm:**
   ```bash
   npm --version
   ```
   Si es muy antigua, actualiza:
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
   - Ejecuta PowerShell como administrador si es necesario

4. **Revisar antivirus:**
   - Algunos antivirus bloquean la instalación de archivos en `node_modules`
   - Agrega la carpeta del proyecto a las excepciones


