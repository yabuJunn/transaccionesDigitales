# Virtual Transactions Project

Sistema completo de transacciones virtuales con formulario público, panel de administración y API segura.

## 🏗️ Estructura del Proyecto

```
virtual-transactions/
├── client/          # Cliente público (formulario de transacciones)
├── admin/           # Panel de administración (dashboard protegido)
├── api/             # API Express con TypeScript
└── package.json     # Configuración del monorepo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.0.0
- npm o yarn
- Cuenta de Firebase con proyecto configurado

### 1. Instalación

**Si tienes problemas de instalación en Windows (especialmente errores de `postinstall` o `patch-package`), usa el script de instalación segura:**

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

**Nota:** 
- Si encuentras errores de "comando no encontrado" (`tsx`, `vite`), asegúrate de instalar las dependencias individualmente en cada carpeta.
- Si encuentras errores de `postinstall` o `patch-package`, usa `--ignore-scripts` para evitar problemas.
- Los scripts ahora usan `npx` para encontrar los binarios automáticamente.

Para más detalles, consulta:
- `FIX_INSTALLATION.md` - Problemas generales de instalación
- `INSTALL_FIX.md` - Problemas de comandos no encontrados
- `POSTINSTALL_FIX.md` - Problemas con scripts postinstall

### 2. Configuración de Firebase

#### 2.1. Obtener Credenciales de Firebase Admin

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a **Configuración del proyecto** > **Cuentas de servicio**
4. Haz clic en **Generar nueva clave privada**
5. Se descargará un archivo JSON con las credenciales

#### 2.2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto `api/`:

```bash
# API Server
PORT=4000

# Firebase Admin SDK (Service Account)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave privada aquí\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (para frontend)
FIREBASE_API_KEY=tu-api-key
FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://tu-project-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=tu-project.appspot.com

# Admin Access Control
# Opción 1: Lista de UIDs separados por comas
ADMIN_UIDS=uid1,uid2,uid3
# Opción 2: Usar custom claims (admin:true) - ver sección de configuración de admin
```

**Nota:** Para `FIREBASE_PRIVATE_KEY`, copia el valor completo del campo `private_key` del JSON descargado, incluyendo los saltos de línea `\n`.

#### 2.3. Configurar Variables de Entorno para Frontend

Crea archivos `.env.local` en `client/` y `admin/`:

**client/.env.local:**
```bash
VITE_API_URL=http://localhost:4000
```

**admin/.env.local:**
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

1. Crea un usuario en Firebase Authentication (email/password) desde la consola de Firebase
2. Ejecuta el script para establecer el custom claim:

```bash
cd api
npm run set-admin-claim <email-del-usuario>
```

O manualmente usando el script:

```bash
cd api
npx tsx scripts/set-admin-claim.ts <email-del-usuario>
```

**Importante:** El usuario debe cerrar sesión y volver a iniciar sesión para que el custom claim tome efecto.

#### Opción B: Usar Lista de UIDs

1. Crea un usuario en Firebase Authentication
2. Obtén el UID del usuario desde la consola de Firebase
3. Agrega el UID a la variable de entorno `ADMIN_UIDS` en `api/.env`:

```bash
ADMIN_UIDS=uid-del-usuario-1,uid-del-usuario-2
```

### 4. Ejecutar el Proyecto

#### Desarrollo (todos los servicios)

```bash
# Desde la raíz del proyecto
npm run dev
```

#### Desarrollo (individual)

```bash
# Cliente público (puerto 5173)
npm run dev:client

# Panel admin (puerto 5174)
npm run dev:admin

# API (puerto 4000)
npm run dev:api
```

### 5. Poblar Base de Datos (Opcional)

Para cargar transacciones de ejemplo:

```bash
cd api
npm run seed
```

Esto cargará las transacciones de ejemplo desde `api/data/transactions-sample.json`.

## 📋 Scripts Disponibles

### Desde la raíz:

- `npm run dev` - Ejecuta todos los servicios en modo desarrollo
- `npm run dev:client` - Solo cliente público
- `npm run dev:admin` - Solo panel admin
- `npm run dev:api` - Solo API
- `npm run build` - Construye todos los proyectos para producción
- `npm run test` - Ejecuta tests
- `npm run seed` - Pobla la base de datos con datos de ejemplo

### API:

- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Compila TypeScript
- `npm run start` - Ejecuta la versión compilada
- `npm run test` - Ejecuta tests
- `npm run seed` - Carga datos de ejemplo

## 🧪 Testing

### API Tests

```bash
cd api
npm test
```

Los tests incluyen:
- Health check endpoint
- Validación de parser de montos
- Tests básicos de endpoints

## 🔒 Seguridad

### Endpoints Protegidos

Los endpoints protegidos requieren un token de Firebase ID válido en el header:

```
Authorization: Bearer <firebase-id-token>
```

### Validación de Admin

El sistema verifica acceso de admin de dos formas:

1. **Custom Claims:** Si el token tiene `admin: true` en los custom claims
2. **UID Allowlist:** Si el UID está en la variable de entorno `ADMIN_UIDS`

### Middlewares de Seguridad

- **Helmet:** Headers de seguridad HTTP
- **CORS:** Configurado para orígenes permitidos
- **Rate Limiting:** 100 requests por IP cada 15 minutos
- **Input Validation:** Validación con express-validator

## 📡 API Endpoints

### Públicos

#### `POST /api/transactions`
Crea una nueva transacción.

**Body:**
```json
{
  "invoiceDate": "1/07/2025",
  "invoiceNumber": "186",
  "invoiceStatus": "PAID",
  "moneyTransmitterCode": "GLOBAN CAPITAL",
  "sender": {
    "fullName": "DEMBA KASSE",
    "address": "6838 GREBE PLACE",
    "phone1": "3477181827",
    "zipCode": "44122",
    "cityCode": "PHILADELPHIA",
    "stateCode": "Pennsylvania",
    "countryCode": "United States"
  },
  "receiver": {
    "fullName": "KADIA THIAM",
    "address": "123 Esquina 7",
    "phone1": "201-452-5285",
    "zipCode": "33462",
    "cityCode": "Bogota",
    "stateCode": "Senegal",
    "countryCode": "Colombia"
  },
  "amountSent": "$20,00",
  "fee": "$15,00",
  "paymentMode": "WIRE TRANSFER",
  "correspondentId": "BANCOLOMBIA",
  "bankName": "",
  "accountNumber": "123456369"
}
```

**Response:**
```json
{
  "success": true,
  "id": "transaction-id",
  "message": "Transaction created successfully"
}
```

#### `GET /health`
Health check del servidor.

### Protegidos (Requieren autenticación admin)

#### `GET /api/transactions`
Obtiene lista paginada de transacciones.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 20)
- `status` (opcional): Filtrar por estado (PENDING, PAID, CANCELLED)

**Headers:**
```
Authorization: Bearer <firebase-id-token>
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### `GET /api/transactions/:id`
Obtiene una transacción específica por ID.

## 🗄️ Esquema de Firestore

### Colección: `transactions`

Cada documento contiene:

```typescript
{
  invoiceDate: Timestamp,
  invoiceNumber: string,
  invoiceStatus: string,
  moneyTransmitterCode: string,
  sender: {
    fullName: string,
    address: string,
    phone1: string,
    phone2: string | null,
    zipCode: string,
    cityCode: string,
    stateCode: string,
    countryCode: string,
    id1: { type: string, number: string } | null,
    id2: { type: string, number: string } | null
  },
  receiver: {
    // Misma estructura que sender
  },
  amountSent: number, // en centavos
  fee: number, // en centavos
  paymentMode: string,
  correspondentId: string,
  bankName: string,
  accountNumber: string,
  createdAt: Timestamp,
  raw: object // Datos originales para trazabilidad
}
```

## 🧪 Pruebas Manuales

### 1. Probar Formulario Público

1. Abre `http://localhost:5173`
2. Completa el formulario con datos de ejemplo
3. Envía la transacción
4. Verifica el mensaje de éxito

### 2. Probar Panel Admin

1. Abre `http://localhost:5174`
2. Inicia sesión con credenciales de admin
3. Verifica que puedas ver la lista de transacciones
4. Selecciona una transacción para ver detalles

### 3. Probar API con cURL

#### Obtener Token de Firebase

```bash
# Reemplaza con tus credenciales
curl -X POST \
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "returnSecureToken": true
  }'
```

#### Llamar Endpoint Protegido

```bash
# Reemplaza <ID_TOKEN> con el token obtenido
curl -X GET \
  'http://localhost:4000/api/transactions?page=1&limit=10' \
  -H 'Authorization: Bearer <ID_TOKEN>'
```

#### Crear Transacción

```bash
curl -X POST \
  'http://localhost:4000/api/transactions' \
  -H 'Content-Type: application/json' \
  -d '{
    "invoiceDate": "1/07/2025",
    "invoiceNumber": "999",
    "invoiceStatus": "PENDING",
    "moneyTransmitterCode": "TEST",
    "sender": {
      "fullName": "Test Sender",
      "address": "123 Test St",
      "phone1": "555-1234",
      "zipCode": "12345",
      "cityCode": "Test City",
      "stateCode": "Test State",
      "countryCode": "Test Country"
    },
    "receiver": {
      "fullName": "Test Receiver",
      "address": "456 Test Ave",
      "phone1": "555-5678",
      "zipCode": "67890",
      "cityCode": "Test City 2",
      "stateCode": "Test State 2",
      "countryCode": "Test Country 2"
    },
    "amountSent": "$100,00",
    "fee": "$10,00",
    "paymentMode": "TEST",
    "correspondentId": "TEST",
    "bankName": "Test Bank",
    "accountNumber": "123456"
  }'
```

## 📝 Notas Importantes

### Parsing de Montos

Los montos se aceptan en varios formatos:
- `$20,00` (comma como decimal)
- `$20.00` (dot como decimal)
- `20,00`
- `20.00`

Todos se convierten a centavos (enteros) para almacenamiento.

### Parsing de Fechas

Las fechas deben estar en formato `d/M/yyyy` (ej: `1/07/2025`).

### Custom Claims

Si usas custom claims, el usuario debe:
1. Cerrar sesión completamente
2. Volver a iniciar sesión
3. El nuevo token incluirá el custom claim

## 🐛 Troubleshooting

### Problemas de Instalación (Windows)

Si encuentras errores como `EBUSY`, `EPERM`, o archivos bloqueados durante `npm install`:

**Solución Rápida:**

1. **Usar script de limpieza:**
   ```powershell
   # PowerShell
   .\clean.ps1
   
   # O CMD
   clean.cmd
   ```

2. **Luego instalar:**
   ```bash
   npm install
   ```

**Solución Manual:**

1. Cierra todos los editores y terminales
2. Elimina `node_modules` y `package-lock.json` de todas las carpetas
3. Limpia el caché: `npm cache clean --force`
4. Reinstala: `npm install`

Para más detalles, consulta `FIX_INSTALLATION.md`.

### Error: "Missing Firebase Admin credentials"

Verifica que el archivo `.env` en `api/` tenga todas las variables requeridas.

### Error: "Forbidden: Admin access required"

1. Verifica que el usuario tenga el custom claim `admin: true` O
2. Verifica que el UID esté en `ADMIN_UIDS`
3. Asegúrate de que el usuario haya cerrado sesión y vuelto a iniciar sesión

### Error: CORS

Verifica que los orígenes de los clientes estén en la lista de CORS permitidos en `api/src/index.ts`.

### Error: "Invalid token"

1. Verifica que el token no haya expirado
2. Obtén un nuevo token iniciando sesión nuevamente

## 📚 Tecnologías Utilizadas

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Validation:** express-validator
- **Security:** Helmet, CORS, Rate Limiting

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

