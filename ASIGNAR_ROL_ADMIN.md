# Guía para Asignar Rol de Administrador

Esta guía explica cómo asignar el rol de administrador a un usuario en Firebase Authentication sin necesidad de que el usuario cierre sesión.

## Opción 1: Usar el Script Directamente (Recomendado si no hay ningún admin)

Esta es la forma más rápida y no requiere que tengas ningún admin configurado previamente.

### Pasos:

1. **Abre una terminal en la raíz del proyecto**

2. **Ejecuta el script desde la carpeta `api` (RECOMENDADO):**

   ```bash
   # Desde la carpeta api
   cd api
   npm run set-admin-claim <email-del-usuario>
   ```

   **Ejemplo:**
   ```bash
   cd api
   npm run set-admin-claim usuario@ejemplo.com
   ```

   **O usando tsx directamente:**
   ```bash
   cd api
   npx tsx scripts/set-admin-claim.ts usuario@ejemplo.com
   ```

3. **Alternativamente, puedes usar el script de la raíz (requiere que el .env esté en la raíz):**

   ```bash
   # Desde la raíz del proyecto
   npx tsx scripts/setCustomClaims.ts <email-del-usuario> --claim=admin
   ```

   **Ejemplo:**
   ```bash
   npx tsx scripts/setCustomClaims.ts usuario@ejemplo.com --claim=admin
   ```

### ¿Qué hace el script?

El script:
- Busca el usuario por email en Firebase Authentication
- Asigna los custom claims: `role: "admin"` y `admin: true`
- Preserva cualquier otro claim existente

### Después de ejecutar el script:

**IMPORTANTE:** Los custom claims de Firebase solo se actualizan cuando el usuario obtiene un nuevo token. Sin embargo, **NO es necesario cerrar sesión**. El usuario puede:

1. **Refrescar la página** - Esto automáticamente refrescará el token
2. **O esperar** - El token se refrescará automáticamente cuando expire (normalmente después de 1 hora)

El código del cliente ya está configurado para refrescar el token automáticamente cuando se verifica el rol del usuario usando `getIdTokenResult(user, true)`.

---

## Opción 2: Usar el Endpoint de API (Requiere tener un admin)

Si ya tienes un usuario con rol de administrador, puedes usar el endpoint de API.

### Endpoint:

```
POST /auth/setAdminRole
```

### Headers:

```
Authorization: Bearer <token-del-admin>
Content-Type: application/json
```

### Body:

```json
{
  "email": "usuario@ejemplo.com"
}
```

### Ejemplo con curl:

```bash
curl -X POST https://tu-api-url.com/auth/setAdminRole \
  -H "Authorization: Bearer <token-del-admin>" \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com"}'
```

---

## Verificar que el rol se asignó correctamente

Puedes verificar que el rol se asignó correctamente de varias formas:

1. **En Firebase Console:**
   - Ve a Firebase Console > Authentication > Users
   - Busca el usuario por email
   - Revisa los "Custom claims" - deberías ver `role: "admin"` y `admin: true`

2. **En el código:**
   - El usuario puede refrescar la página y verificar que tiene acceso a las funciones de administrador

---

## Solución al problema de "debe cerrar sesión"

**El mensaje de "debe cerrar sesión" es solo informativo de Firebase**, pero en realidad:

- ✅ **NO necesitas cerrar sesión**
- ✅ Solo necesitas **refrescar el token** (que se hace automáticamente al refrescar la página)
- ✅ El código del cliente ya está configurado para refrescar el token cuando se verifica el rol

El token se refrescará automáticamente cuando:
- El usuario refresca la página
- El código llama a `getIdTokenResult(user, true)`
- El token expira (normalmente después de 1 hora)

---

## Troubleshooting

### Error: "User not found"
- Verifica que el email sea correcto
- Asegúrate de que el usuario exista en Firebase Authentication

### Error: "Missing Firebase Admin credentials"
- Verifica que el archivo `.env` tenga las credenciales de Firebase Admin
- El archivo `.env` debe estar en la carpeta `api/` (o en la raíz del proyecto)
- Las variables necesarias son:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
- **Solución:** Usa el script desde la carpeta `api` que ya está configurado correctamente:
  ```bash
  cd api
  npm run set-admin-claim <email>
  ```

### El usuario no ve los cambios después de asignar el rol
- Pide al usuario que **refresque la página** (F5 o Ctrl+R)
- Si aún no funciona, el usuario puede cerrar sesión y volver a iniciar sesión (aunque normalmente no es necesario)

---

## Notas Técnicas

- Los custom claims se almacenan en el token JWT de Firebase
- Firebase cachea los tokens por hasta 1 hora
- El código del cliente usa `getIdTokenResult(user, true)` para forzar el refresh del token
- Los claims se preservan cuando se actualizan (no se sobrescriben otros claims existentes)
