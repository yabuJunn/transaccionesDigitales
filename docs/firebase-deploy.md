# Guía de Despliegue en Firebase

Esta guía explica cómo desplegar el proyecto en Firebase Hosting (frontend) y Firebase Functions (backend).

## 📋 Tabla de Contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Configuración Inicial](#configuración-inicial)
3. [Desarrollo Local](#desarrollo-local)
4. [Despliegue](#despliegue)
5. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
6. [Gestión de Usuarios y Custom Claims](#gestión-de-usuarios-y-custom-claims)
7. [Advertencias Importantes](#advertencias-importantes)
8. [Solución de Problemas](#solución-de-problemas)

---

## Prerrequisitos

1. **Node.js** >= 18.0.0
2. **Firebase CLI** instalado globalmente:
   ```bash
   npm install -g firebase-tools
   ```
3. **Cuenta de Firebase** con un proyecto creado
4. **Plan Blaze (con facturación habilitada)** - Requerido para Cloud Functions
   > ⚠️ **Nota importante**: Aunque Cloud Functions requiere el plan Blaze, si tu uso está dentro de las [cuotas gratuitas](https://firebase.google.com/pricing), no se te cobrará nada. Sin embargo, debes tener un método de pago configurado.

---

## Configuración Inicial

### 1. Iniciar sesión en Firebase

```bash
firebase login
```

### 2. Configurar el proyecto de Firebase

```bash
firebase use --add
```

Selecciona tu proyecto de Firebase o crea uno nuevo. Esto actualizará el archivo `.firebaserc`.

Si prefieres hacerlo manualmente, edita `.firebaserc`:

```json
{
  "projects": {
    "default": "tu-firebase-project-id"
  }
}
```

### 3. Instalar dependencias

```bash
# Instalar dependencias de todos los workspaces
npm install

# Instalar dependencias específicas
npm install --workspace=client
npm install --workspace=api
npm install --workspace=functions
```

---

## Desarrollo Local

### Opción 1: Desarrollo tradicional (Express + Vite)

Ejecuta el cliente y la API por separado:

```bash
# Terminal 1: Cliente (Vite)
npm run dev:client

# Terminal 2: API (Express)
npm run dev:api
```

O ejecuta ambos en paralelo:

```bash
npm run dev
```

- **Cliente**: http://localhost:5173
- **API**: http://localhost:4000

### Opción 2: Firebase Emulator Suite (Recomendado para probar integración)

Ejecuta todos los emuladores (Hosting, Functions, Firestore, Auth):

```bash
npm run emulators:start
```

O todos los emuladores disponibles:

```bash
npm run emulators:start:all
```

- **Hosting Emulator**: http://localhost:5000
- **Functions Emulator**: http://localhost:5001
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099
- **Emulator UI**: http://localhost:4000

#### Configuración de VITE_API_URL para Emuladores

Cuando uses los emuladores, configura la variable de entorno en `client/.env.local`:

```env
VITE_API_URL=http://localhost:5001/tu-firebase-project-id/us-central1/api
```

Reemplaza `tu-firebase-project-id` con tu ID de proyecto real.

---

## Despliegue

### Build del Proyecto

Antes de desplegar, construye todos los componentes:

```bash
npm run build
```

Esto construye:
- `client/dist` (frontend)
- `api/dist` (para referencia, no se despliega)
- `functions/lib` (Cloud Functions)

### Despliegue Completo

Despliega tanto Hosting como Functions:

```bash
npm run deploy
```

O usando Firebase CLI directamente:

```bash
firebase deploy
```

### Despliegue Parcial

#### Solo Hosting (Frontend)

```bash
npm run deploy:hosting
```

O:

```bash
firebase deploy --only hosting
```

#### Solo Functions (Backend)

```bash
npm run deploy:functions
```

O:

```bash
firebase deploy --only functions
```

### Verificar Despliegue

Después del despliegue, Firebase te proporcionará URLs:

- **Hosting**: `https://tu-proyecto.web.app` o `https://tu-proyecto.firebaseapp.com`
- **Functions**: `https://us-central1-tu-proyecto.cloudfunctions.net/api`

---

## Configuración de Variables de Entorno

### Variables de Entorno en Cloud Functions

Firebase Functions usa `firebase functions:config` para variables de entorno. Sin embargo, la forma moderna recomendada es usar **Environment Configuration** (Firebase CLI 10.0.0+).

#### Método 1: Environment Configuration (Recomendado)

```bash
# Establecer variables
firebase functions:config:set someservice.key="valor"

# Ver configuración actual
firebase functions:config:get

# Usar en código
import * as functions from 'firebase-functions';
const apiKey = functions.config().someservice.key;
```

#### Método 2: Variables de Entorno Secretas (Para datos sensibles)

```bash
# Establecer secreto
firebase functions:secrets:set SECRET_KEY

# Usar en código
import * as functions from 'firebase-functions';
const secret = process.env.SECRET_KEY;
```

#### Método 3: .env en Desarrollo Local

Para desarrollo local, crea un archivo `.env` en la raíz del proyecto:

```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_UIDS=uid1,uid2,uid3
BANK_UIDS=uid1,uid2
CLIENT_URL=https://tu-proyecto.web.app
ADMIN_URL=https://admin.tu-proyecto.web.app
```

> ⚠️ **IMPORTANTE**: Nunca commitees archivos `.env` al repositorio. Asegúrate de que estén en `.gitignore`.

### Variables de Entorno en el Cliente (Vite)

El cliente usa variables de entorno con el prefijo `VITE_`. Crea `client/.env.production`:

```env
VITE_API_URL=/api
```

Para desarrollo local con Express:

```env
VITE_API_URL=http://localhost:4000
```

Para emuladores:

```env
VITE_API_URL=http://localhost:5001/tu-proyecto-id/us-central1/api
```

---

## Gestión de Usuarios y Custom Claims

### Asignar Custom Claims

Usa el script `scripts/setCustomClaims.ts` para asignar claims `admin` o `bank` a usuarios:

```bash
# Asignar claim admin
npx tsx scripts/setCustomClaims.ts user@example.com --claim=admin

# Asignar claim bank
npx tsx scripts/setCustomClaims.ts user@example.com --claim=bank

# Asignar ambos claims
npx tsx scripts/setCustomClaims.ts user@example.com --claim=admin,bank

# Usar UID en lugar de email
npx tsx scripts/setCustomClaims.ts abc123xyz --claim=admin
```

### Scripts Alternativos (en api/scripts)

También puedes usar los scripts individuales:

```bash
# Admin claim
npm run set-admin-claim --workspace=api user@example.com

# Bank claim
npm run set-bank-claim --workspace=api user@example.com
```

### Importante sobre Custom Claims

Después de asignar un custom claim, el usuario **debe cerrar sesión y volver a iniciar sesión** para que el claim tome efecto. Los tokens JWT existentes no se actualizan automáticamente.

---

## Advertencias Importantes

### 1. Plan Blaze Requerido

Cloud Functions requiere el plan **Blaze (Pay-as-you-go)** de Firebase. Sin embargo:

- ✅ Si tu uso está dentro de las [cuotas gratuitas](https://firebase.google.com/pricing), **no se te cobrará nada**
- ✅ Las cuotas gratuitas incluyen:
  - 2 millones de invocaciones de Functions por mes
  - 400,000 GB-segundos de tiempo de cómputo
  - 200,000 CPU-segundos
- ⚠️ Debes tener un método de pago configurado, pero solo se cobrará si excedes las cuotas gratuitas

### 2. Límites de Cloud Functions

- **Timeout máximo**: 60 segundos (HTTP functions) o 540 segundos (2nd gen)
- **Memoria**: 128MB a 8GB (configurable)
- **Región**: Por defecto `us-central1` (configurable en `functions/src/index.ts`)

### 3. Seguridad

- ✅ Nunca commitees archivos `.env` o credenciales
- ✅ Usa `firebase functions:secrets` para datos sensibles
- ✅ Configura CORS correctamente en producción
- ✅ Usa Firebase Security Rules para Firestore y Storage

### 4. Costos Potenciales

Aunque las cuotas gratuitas son generosas, ten en cuenta:

- **Invocaciones**: $0.40 por millón después de la cuota gratuita
- **Tiempo de cómputo**: $0.0000025 por GB-segundo después de la cuota gratuita
- **Ancho de banda saliente**: $0.12 por GB (primeros 10GB/mes gratis)

Consulta la [página de precios](https://firebase.google.com/pricing) para más detalles.

---

## Solución de Problemas

### Error: "Functions requires Blaze plan"

**Solución**: Habilita el plan Blaze en la consola de Firebase:
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a "Usage and billing"
4. Haz clic en "Upgrade project" y sigue las instrucciones

### Error: "Missing Firebase Admin credentials"

**Solución**: Asegúrate de tener un archivo `.env` en la raíz con:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

O en Cloud Functions, las credenciales se obtienen automáticamente.

### Error: CORS en producción

**Solución**: Verifica que `api/src/app.ts` tenga configurado CORS correctamente. En Cloud Functions, el origen puede ser `null` o el dominio de Firebase Hosting.

### Error: "Module not found" al construir functions

**Solución**: Asegúrate de que `functions/package.json` tenga todas las dependencias necesarias. Las funciones no pueden importar directamente desde `api/` a menos que uses un bundler o copies el código.

### Las funciones no se actualizan después del deploy

**Solución**: 
1. Verifica que el build se completó: `npm run build:functions`
2. Revisa los logs: `firebase functions:log`
3. Espera unos minutos (el deploy puede tardar)

### El cliente no puede conectarse a la API en producción

**Solución**: 
1. Verifica que `VITE_API_URL=/api` en `client/.env.production`
2. Verifica que `firebase.json` tenga el rewrite correcto:
   ```json
   "rewrites": [
     { "source": "/api/**", "function": "api" }
   ]
   ```
3. Reconstruye el cliente: `npm run build:client`

---

## Comandos Rápidos de Referencia

```bash
# Desarrollo
npm run dev                    # Cliente + API en paralelo
npm run emulators:start        # Firebase Emulators

# Build
npm run build                  # Build completo
npm run build:client           # Solo cliente
npm run build:functions        # Solo functions

# Deploy
npm run deploy                 # Deploy completo
npm run deploy:hosting         # Solo hosting
npm run deploy:functions       # Solo functions

# Custom Claims
npx tsx scripts/setCustomClaims.ts <email> --claim=admin
npx tsx scripts/setCustomClaims.ts <email> --claim=bank

# Firebase CLI
firebase login
firebase use --add
firebase deploy
firebase functions:log
firebase emulators:start
```

---

## Recursos Adicionales

- [Documentación de Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Documentación de Cloud Functions](https://firebase.google.com/docs/functions)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)

---

## Soporte

Si encuentras problemas, revisa:
1. Los logs de Firebase: `firebase functions:log`
2. La consola de Firebase: https://console.firebase.google.com
3. Los logs del navegador (F12) para errores del cliente

