# 🔍 Guía de Debugging: Error 404 en /api/*

## Problema
Las rutas `/api/test` y `/api/process-photo` devuelven 404 cuando usas `vercel dev`.

## Pasos de Diagnóstico

### 1. Verificar que estás usando `vercel dev` correctamente

```bash
# ✅ CORRECTO
npm run dev:vercel

# O directamente:
vercel dev

# ❌ INCORRECTO (no detecta funciones /api)
npm run dev
```

### 2. Verificar que el proyecto está vinculado

```bash
vercel link
```

Si no está vinculado, Vercel dev puede tener problemas detectando las funciones.

### 3. Verificar estructura de archivos

```bash
ls -la api/
```

Debes ver:
- `test.js`
- `process-photo.js`
- `update-feedback.js`

### 4. Ejecutar script de diagnóstico

```bash
node scripts/diagnose-api.js
```

Este script verifica:
- Estructura de carpetas
- Configuración de vercel.json
- Variables de entorno
- Formato de funciones

### 5. Verificar logs en terminal

Cuando ejecutas `vercel dev`, deberías ver:
```
Vercel CLI 31.x.x
> Ready! Available at http://localhost:3000
```

Y cuando haces un request a `/api/test`, deberías ver logs como:
```
[test] Función recibida: { method: 'GET', url: '/api/test', ... }
```

### 6. Probar directamente en el navegador

1. Abre: `http://localhost:3000/api/test`
2. Deberías ver JSON: `{"message":"Function is working!",...}`
3. Si ves HTML (la página React), el rewrite está interceptando la ruta

## Soluciones a Probar

### Solución 1: Remover rewrites temporalmente

Edita `vercel.json` y comenta los rewrites:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
  // "rewrites": [...]
}
```

Luego reinicia `vercel dev`.

**Nota**: Esto funciona en desarrollo. Para producción, necesitarás los rewrites.

### Solución 2: Simplificar vercel.json

```json
{
  "version": 2,
  "framework": "vite"
}
```

Deja que Vercel detecte todo automáticamente.

### Solución 3: Verificar que vercel dev detecta las funciones

Al iniciar `vercel dev`, deberías ver algo como:
```
> Detected Serverless Functions:
  - api/test.js
  - api/process-photo.js
  - api/update-feedback.js
```

Si no ves esto, las funciones no se están detectando.

### Solución 4: Probar sin Vite Dev Server

Puede que Vercel dev esté usando el servidor de desarrollo de Vite que intercepta las rutas.

Crea un `vercel.json` mínimo solo para desarrollo:

```json
{
  "version": 2
}
```

Sin `framework: "vite"`, Vercel manejará todo directamente.

## Verificación Final

1. ✅ `vercel dev` está corriendo
2. ✅ Proyecto vinculado (`vercel link`)
3. ✅ Funciones en `/api` existen
4. ✅ `.env.local` configurado
5. ✅ `http://localhost:3000/api/test` devuelve JSON (no HTML)
6. ✅ Logs aparecen en terminal cuando accedes a `/api/test`

## Si Nada Funciona

1. Elimina `.vercel` (carpeta de cache)
   ```bash
   rm -rf .vercel
   vercel link
   vercel dev
   ```

2. Verifica versión de Vercel CLI
   ```bash
   vercel --version
   # Actualiza si es necesario
   npm install -g vercel@latest
   ```

3. Prueba con un proyecto mínimo:
   - Crea solo `api/test.js`
   - Sin `vercel.json`
   - Ejecuta `vercel dev`
   - Prueba `/api/test`

## Logs Útiles para Debugging

Agrega esto al inicio de `api/test.js`:

```javascript
export default function handler(req, res) {
  console.log('=== TEST FUNCTION CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  
  res.status(200).json({ 
    message: 'Function is working!',
    timestamp: new Date().toISOString()
  });
}
```

Si no ves estos logs en la terminal cuando accedes a `/api/test`, la función no se está ejecutando.

