# Configuración de Firebase Hosting

Si encuentras el error: "Assertion failed: resolving hosting target of a site with no site name or target name", sigue estos pasos:

## Solución 1: Inicializar Hosting Manualmente

1. Ejecuta el siguiente comando:
```bash
firebase init hosting
```

2. Cuando te pregunte:
   - **¿Qué directorio usar como directorio público?** → `client/dist`
   - **¿Configurar como aplicación de una sola página?** → `Yes`
   - **¿Configurar archivos de reescritura automática?** → `Yes`
   - **¿Configurar un sitio de Firebase Hosting?** → Selecciona el sitio por defecto o crea uno nuevo

## Solución 2: Especificar el Sitio en firebase.json

Si ya tienes un sitio creado, agrega el campo `site` en `firebase.json`:

```json
{
  "hosting": {
    "site": "tu-sitio-id",
    "public": "client/dist",
    ...
  }
}
```

Para obtener el ID de tu sitio:
```bash
firebase hosting:sites:list
```

## Solución 3: Desplegar Solo Functions Primero

Si quieres probar solo las funciones primero:

```bash
npm run deploy:functions
```

Luego, después de configurar hosting, despliega hosting:

```bash
npm run deploy:hosting
```

## Solución 4: Usar Target de Hosting

Si tienes múltiples sitios, puedes usar targets:

1. Crea un target:
```bash
firebase target:apply hosting default tu-sitio-id
```

2. Actualiza `.firebaserc`:
```json
{
  "projects": {
    "default": "transaccionesvirtuales-1878f"
  },
  "targets": {
    "transaccionesvirtuales-1878f": {
      "hosting": {
        "default": ["tu-sitio-id"]
      }
    }
  }
}
```

3. Actualiza `firebase.json`:
```json
{
  "hosting": {
    "target": "default",
    "public": "client/dist",
    ...
  }
}
```

