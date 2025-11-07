# Manual Testing Runbook

Este documento describe los pasos para probar manualmente el sistema de transacciones virtuales.

## Prerrequisitos

1. ✅ Todas las dependencias instaladas
2. ✅ Variables de entorno configuradas
3. ✅ Firebase configurado y credenciales disponibles
4. ✅ Usuario administrador creado en Firebase Authentication

## Pasos de Prueba

### 1. Iniciar Servicios

```bash
# Terminal 1: API
cd api
npm run dev

# Terminal 2: Cliente Público
cd client
npm run dev

# Terminal 3: Panel Admin
cd admin
npm run dev
```

Verifica que todos los servicios estén corriendo:
- API: http://localhost:4000
- Cliente: http://localhost:5173
- Admin: http://localhost:5174

### 2. Verificar Health Check

```bash
curl http://localhost:4000/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### 3. Poblar Base de Datos (Opcional)

```bash
cd api
npm run seed
```

**Resultado esperado:**
```
📦 Found 2 transactions to seed
✅ Successfully seeded 2 transactions to Firestore
🎉 Seeding completed
```

### 4. Probar Formulario Público

1. Abre http://localhost:5173
2. Completa el formulario con los siguientes datos de prueba:

**Datos de Prueba:**
- Fecha de Factura: `1/07/2025`
- Número de Factura: `TEST-001`
- Estado: `PENDING`
- Código del Transmisor: `TEST BANK`
- Monto Enviado: `$100,00`
- Tarifa: `$10,00`
- Modo de Pago: `WIRE TRANSFER`
- ID del Corresponsal: `TEST CORRESPONDENT`
- Número de Cuenta: `123456789`

**Remitente:**
- Nombre: `Juan Pérez`
- Dirección: `123 Calle Principal`
- Teléfono 1: `555-1234`
- Código Postal: `12345`
- Ciudad: `Ciudad Test`
- Estado: `Estado Test`
- País: `País Test`

**Destinatario:**
- Nombre: `María García`
- Dirección: `456 Avenida Secundaria`
- Teléfono 1: `555-5678`
- Código Postal: `67890`
- Ciudad: `Ciudad Destino`
- Estado: `Estado Destino`
- País: `País Destino`

3. Haz clic en "Enviar Transacción"
4. **Resultado esperado:** Mensaje de éxito verde

### 5. Verificar en Firestore

1. Ve a Firebase Console > Firestore Database
2. Verifica que la colección `transactions` tenga el nuevo documento
3. Verifica que los montos estén en centavos (ej: `10000` para `$100,00`)

### 6. Probar Panel Admin - Login

1. Abre http://localhost:5174
2. Deberías ver la página de login
3. Ingresa las credenciales del usuario administrador
4. **Resultado esperado:** Redirección al dashboard

### 7. Probar Panel Admin - Dashboard

1. Verifica que puedas ver la lista de transacciones
2. Verifica que puedas filtrar por estado (PENDING, PAID, CANCELLED)
3. Haz clic en una transacción
4. **Resultado esperado:** Panel lateral con detalles completos

### 8. Probar API - Endpoint Protegido

#### 8.1. Obtener Token de Firebase

**Opción A: Desde el navegador (consola del admin)**
```javascript
// En la consola del navegador en http://localhost:5174
// Después de iniciar sesión
firebase.auth().currentUser.getIdToken().then(token => console.log(token));
```

**Opción B: Usando Firebase REST API**
```bash
curl -X POST \
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "returnSecureToken": true
  }'
```

#### 8.2. Llamar Endpoint Protegido

```bash
# Reemplaza <ID_TOKEN> con el token obtenido
curl -X GET \
  'http://localhost:4000/api/transactions?page=1&limit=10' \
  -H 'Authorization: Bearer <ID_TOKEN>'
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

#### 8.3. Probar Sin Token (Debe Fallar)

```bash
curl -X GET 'http://localhost:4000/api/transactions'
```

**Resultado esperado:** `401 Unauthorized`

#### 8.4. Probar Con Token Inválido (Debe Fallar)

```bash
curl -X GET \
  'http://localhost:4000/api/transactions' \
  -H 'Authorization: Bearer invalid-token'
```

**Resultado esperado:** `401 Invalid or expired token`

### 9. Probar Validaciones

#### 9.1. Enviar Transacción Sin Campos Requeridos

```bash
curl -X POST \
  'http://localhost:4000/api/transactions' \
  -H 'Content-Type: application/json' \
  -d '{
    "invoiceNumber": "TEST"
  }'
```

**Resultado esperado:** `400 Validation failed` con lista de errores

#### 9.2. Enviar Transacción Con Monto Inválido

```bash
curl -X POST \
  'http://localhost:4000/api/transactions' \
  -H 'Content-Type: application/json' \
  -d '{
    "invoiceDate": "1/07/2025",
    "invoiceNumber": "TEST",
    "invoiceStatus": "PENDING",
    "moneyTransmitterCode": "TEST",
    "sender": {
      "fullName": "Test",
      "address": "Test",
      "phone1": "123",
      "zipCode": "12345",
      "cityCode": "Test",
      "stateCode": "Test",
      "countryCode": "Test"
    },
    "receiver": {
      "fullName": "Test",
      "address": "Test",
      "phone1": "123",
      "zipCode": "12345",
      "cityCode": "Test",
      "stateCode": "Test",
      "countryCode": "Test"
    },
    "amountSent": "invalid",
    "fee": "10",
    "paymentMode": "TEST",
    "correspondentId": "TEST",
    "accountNumber": "123"
  }'
```

**Resultado esperado:** `500 Internal server error` con mensaje de error de parsing

### 10. Probar Parsing de Montos

Prueba diferentes formatos de montos:

```bash
# Formato con comma
amountSent: "$20,00"  # Debe convertirse a 2000 centavos

# Formato con dot
amountSent: "$20.00"  # Debe convertirse a 2000 centavos

# Sin símbolo de moneda
amountSent: "20,00"   # Debe convertirse a 2000 centavos
```

### 11. Probar Paginación

```bash
# Página 1
curl -X GET \
  'http://localhost:4000/api/transactions?page=1&limit=5' \
  -H 'Authorization: Bearer <ID_TOKEN>'

# Página 2
curl -X GET \
  'http://localhost:4000/api/transactions?page=2&limit=5' \
  -H 'Authorization: Bearer <ID_TOKEN>'
```

**Resultado esperado:** Diferentes conjuntos de transacciones según la página

### 12. Probar Filtro por Estado

```bash
# Filtrar por PAID
curl -X GET \
  'http://localhost:4000/api/transactions?status=PAID' \
  -H 'Authorization: Bearer <ID_TOKEN>'

# Filtrar por PENDING
curl -X GET \
  'http://localhost:4000/api/transactions?status=PENDING' \
  -H 'Authorization: Bearer <ID_TOKEN>'
```

**Resultado esperado:** Solo transacciones con el estado especificado

## Checklist de Aceptación

- [ ] Health check responde correctamente
- [ ] Formulario público puede enviar transacciones
- [ ] Transacciones se guardan correctamente en Firestore
- [ ] Montos se convierten correctamente a centavos
- [ ] Panel admin requiere login
- [ ] Panel admin muestra lista de transacciones
- [ ] Panel admin permite filtrar por estado
- [ ] Panel admin muestra detalles de transacciones
- [ ] Endpoint protegido requiere token válido
- [ ] Endpoint protegido rechaza tokens inválidos
- [ ] Validaciones funcionan correctamente
- [ ] Paginación funciona correctamente
- [ ] Filtros funcionan correctamente

## Problemas Comunes

### Error: "Missing Firebase Admin credentials"
**Solución:** Verifica que el archivo `.env` en `api/` tenga todas las variables requeridas.

### Error: "Forbidden: Admin access required"
**Solución:** 
1. Verifica que el usuario tenga custom claim `admin: true` O esté en `ADMIN_UIDS`
2. El usuario debe cerrar sesión y volver a iniciar sesión

### Error: CORS
**Solución:** Verifica que los orígenes estén configurados en `api/src/index.ts`

### No se ven transacciones en el dashboard
**Solución:** 
1. Verifica que haya transacciones en Firestore
2. Verifica que el token de autenticación sea válido
3. Verifica la consola del navegador para errores

