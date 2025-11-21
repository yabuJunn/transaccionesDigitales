# Solución: Error de Script Postinstall

## Problema

El error indica que hay un script `postinstall` que intenta ejecutar `patch-package`, pero `patch-package` no está disponible porque las dependencias aún no están instaladas. Esto es un problema de dependencia circular.

## Solución Rápida

### Opción 1: Instalar Ignorando Scripts (Recomendado)

```powershell
# Usar el script de instalación segura
.\install-safe.ps1
```

O manualmente:

```bash
# Instalar ignorando scripts postinstall
npm install --ignore-scripts

# En cada proyecto
cd api && npm install --ignore-scripts && cd ..
cd client && npm install --ignore-scripts && cd ..
cd admin && npm install --ignore-scripts && cd ..
```

### Opción 2: Configurar npm para Ignorar Scripts

Crea o edita el archivo `.npmrc` en la raíz del proyecto:

```
ignore-scripts=true
```

Luego instala normalmente:

```bash
npm install
```

**Nota:** Si cambias `ignore-scripts=true`, todos los scripts (incluyendo `postinstall`, `preinstall`, etc.) serán ignorados. Esto puede afectar algunas dependencias que necesitan compilar código nativo.

### Opción 3: Instalar patch-package Primero

Si realmente necesitas `patch-package`:

```bash
# Instalar patch-package primero
npm install --save-dev patch-package

# Luego instalar el resto
npm install
```

## ¿Por Qué Ocurre Este Error?

1. **Dependencia Circular:** Una dependencia tiene un script `postinstall` que requiere otra dependencia que aún no está instalada.

2. **patch-package:** Algunas dependencias usan `patch-package` en `postinstall` para aplicar parches, pero `patch-package` debe estar instalado primero.

3. **Workspaces:** Con npm workspaces, los scripts `postinstall` pueden ejecutarse antes de que todas las dependencias estén disponibles.

## Solución Permanente

### 1. Instalar con --ignore-scripts

```powershell
# Limpiar primero
.\clean.ps1

# Instalar ignorando scripts
.\install-safe.ps1
```

### 2. Si Necesitas Scripts Postinstall

Si alguna dependencia realmente necesita scripts `postinstall`:

1. Instala primero ignorando scripts:
   ```bash
   npm install --ignore-scripts
   ```

2. Luego ejecuta los scripts manualmente si es necesario:
   ```bash
   # Esto ejecutará los scripts postinstall de todas las dependencias
   npm rebuild
   ```

### 3. Verificar Qué Dependencia Causa el Problema

```bash
# Ver qué paquetes tienen scripts postinstall
npm run-script postinstall --dry-run

# O buscar en package-lock.json
grep -r "postinstall" package-lock.json
```

## Verificación

Después de instalar con `--ignore-scripts`, verifica que todo funcione:

```bash
# Probar API
cd api
npm run dev

# Probar client
cd ../client
npm run dev

# Probar admin
cd ../admin
npm run dev
```

## Nota Importante

La mayoría de las dependencias funcionan correctamente sin ejecutar scripts `postinstall`. Solo algunas dependencias que requieren compilación nativa (como `node-gyp`) necesitan estos scripts.

Si encuentras problemas después de ignorar scripts, puedes:
1. Instalar la dependencia problemática individualmente
2. Ejecutar `npm rebuild` para compilar dependencias nativas
3. Verificar los logs de instalación para ver qué script falló





