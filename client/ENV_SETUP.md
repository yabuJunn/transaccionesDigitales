# Configuración de Variables de Entorno - Client

Para que el cliente funcione correctamente, necesitas crear un archivo `.env.local` en la carpeta `client/` con las siguientes variables:

```bash
# Firebase Configuration
# Obtén estos valores desde Firebase Console > Project Settings > General
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
# O también puede ser: tu-proyecto.appspot.com
# Nota: NO incluyas el prefijo "gs://", solo el nombre del bucket

# API URL
VITE_API_URL=http://localhost:4000
```

## Pasos para obtener las credenciales:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** (ícono de engranaje)
4. En la pestaña **General**, encontrarás:
   - **API Key**: En la sección "Your apps"
   - **Project ID**: En la parte superior
   - **Storage Bucket**: En la sección "Your apps" o en Storage
5. Para **Auth Domain**: generalmente es `tu-proyecto.firebaseapp.com`
6. Para **Database URL**: generalmente es `https://tu-proyecto-default-rtdb.firebaseio.com`

## Nota importante:

- El archivo `.env.local` NO debe ser commiteado al repositorio (ya está en .gitignore)
- Después de crear el archivo, reinicia el servidor de desarrollo (`npm run dev`)
- Si no configuras estas variables, la landing page funcionará, pero el upload de comprobantes no funcionará

## Configuración del Storage Bucket:

El `VITE_FIREBASE_STORAGE_BUCKET` debe ser el nombre del bucket sin el prefijo `gs://`. 

**Ejemplo:**
- ✅ Correcto: `transaccionesvirtuales-1878f.firebasestorage.app`
- ✅ También válido: `transaccionesvirtuales-1878f.appspot.com`
- ❌ Incorrecto: `gs://transaccionesvirtuales-1878f.firebasestorage.app`

Para encontrar el Storage Bucket correcto:
1. Ve a Firebase Console > Storage
2. El nombre del bucket aparece en la parte superior o en la configuración
3. También puedes encontrarlo en Firebase Console > Project Settings > General > Your apps
