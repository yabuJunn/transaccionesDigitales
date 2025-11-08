# Guía de Inicio Rápido

## Comandos para Ejecutar el Proyecto

### 1. Instalación de Dependencias

**Si tienes problemas de instalación (especialmente errores de postinstall), usa el script de instalación segura:**

```powershell
# PowerShell (Recomendado - evita problemas con postinstall)
.\install-safe.ps1
```

**O si prefieres reinstalación completa:**

```powershell
# Reinstalación completa
.\reinstall.ps1
```

**Instalación manual (ignorando scripts postinstall):**

```bash
# Limpiar primero
.\clean.ps1

# Instalar ignorando scripts postinstall (evita errores de patch-package)
npm install --ignore-scripts

# Instalar individualmente en cada proyecto
cd api && npm install --ignore-scripts && cd ..
cd client && npm install --ignore-scripts && cd ..
cd admin && npm install --ignore-scripts && cd ..
```

**Nota:** Si encuentras errores de "comando no encontrado" o errores de `postinstall`, usa `--ignore-scripts` para evitar problemas con `patch-package` y scripts postinstall. Consulta `POSTINSTALL_FIX.md` para más detalles.

### 2. Configuración de Variables de Entorno

#### API (api/.env)

Crea el archivo `api/.env` con:

```bash
PORT=4000
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave privada aquí\n-----END PRIVATE KEY-----\n"
FIREBASE_API_KEY=tu-api-key
FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://tu-project-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
ADMIN_UIDS=uid1,uid2,uid3
```

#### Cliente Público (client/.env.local)

Crea el archivo `client/.env.local` con:

```bash
VITE_API_URL=http://localhost:4000
```

#### Panel Admin (admin/.env.local)

Crea el archivo `admin/.env.local` con:

```bash
VITE_API_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
```

### 3. Configurar Usuario Administrador

#### Opción A: Usar Custom Claims (Recomendado)

1. Crea un usuario en Firebase Authentication (email/password)
2. Ejecuta:

```bash
cd api
npm run set-admin-claim <email-del-usuario>
```

#### Opción B: Usar Lista de UIDs

1. Crea un usuario en Firebase Authentication
2. Obtén el UID desde Firebase Console
3. Agrega el UID a `ADMIN_UIDS` en `api/.env`

### 4. Poblar Base de Datos (Opcional)

```bash
cd api
npm run seed
```

### 5. Ejecutar el Proyecto

#### Opción A: Ejecutar Todo Junto

```bash
# Desde la raíz
npm run dev
```

#### Opción B: Ejecutar Individualmente

**Terminal 1 - API:**
```bash
cd api
npm run dev
```

**Terminal 2 - Cliente Público:**
```bash
cd client
npm run dev
```

**Terminal 3 - Panel Admin:**
```bash
cd admin
npm run dev
```

### 6. Acceder a las Aplicaciones

- **Cliente Público:** http://localhost:5173
- **Panel Admin:** http://localhost:5174
- **API:** http://localhost:4000

### 7. Verificar que Todo Funciona

1. **Health Check:**
```bash
curl http://localhost:4000/health
```

2. **Probar Formulario Público:**
   - Abre http://localhost:5173
   - Completa el formulario
   - Envía la transacción

3. **Probar Panel Admin:**
   - Abre http://localhost:5174
   - Inicia sesión con credenciales de admin
   - Verifica que puedas ver las transacciones

## Comandos Útiles

### Build para Producción

```bash
# Desde la raíz
npm run build

# Individual
npm run build:client
npm run build:admin
npm run build:api
```

### Tests

```bash
cd api
npm test
```

### Linting

```bash
# Desde la raíz
npm run lint

# Individual
cd client && npm run lint
cd admin && npm run lint
cd api && npm run lint
```

## Troubleshooting

### Error: "Missing Firebase Admin credentials"
- Verifica que `api/.env` tenga todas las variables requeridas
- Verifica que `FIREBASE_PRIVATE_KEY` tenga los saltos de línea `\n` correctamente

### Error: "Forbidden: Admin access required"
- Verifica que el usuario tenga custom claim `admin: true` O esté en `ADMIN_UIDS`
- El usuario debe cerrar sesión y volver a iniciar sesión

### Error: CORS
- Verifica que los orígenes estén configurados en `api/src/index.ts`

### No se ven transacciones
- Verifica que haya transacciones en Firestore
- Ejecuta `npm run seed` en `api/` para cargar datos de ejemplo

