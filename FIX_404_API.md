# 🔧 Solución al Error 404 en /api

## Problema
Error 404 al intentar llamar a `/api/process-photo` en `vercel dev`

## Soluciones a Probar

### 1. Reiniciar `vercel dev` ⚠️ IMPORTANTE

Las funciones serverless necesitan que reinicies el servidor después de crearlas o modificarlas:

```bash
# Detén el servidor (Ctrl+C)
# Luego reinícialo:
vercel dev
```

### 2. Verificar que las funciones existen

```bash
ls -la api/
```

Deberías ver:
- `process-photo.js`
- `update-feedback.js`
- `test.js`

### 3. Probar la función de prueba

Antes de probar `process-photo`, prueba la función simple:

1. Abre en el navegador: `http://localhost:3000/api/test`
2. Deberías ver: `{"message":"Function is working!",...}`

Si esto funciona, las funciones están siendo detectadas correctamente.

### 买了 4. Verificar que estás usando `vercel dev` y no `npm run dev`

```bash
# ✅ CORRECTO
vercel dev

# ❌ INCORRECTO (no detecta funciones /api)
npm run dev
```

### 5. Verificar variables de entorno

Asegúrate de que `.env.local` existe en la raíz y tiene:

```env
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=appo4trZIoubngQVF
AIRTABLE_TABLE_NAME=Demos
GOOGLE_AI_API_KEY=tu_api_key_aqui
```

### 6. Verificar logs en la terminal

Cuando ejecutas `vercel dev`, deberías ver mensajes como:
```
> Ready! Available at http://localhost:3000
```

Y cuando hayas requests a `/api/*`, deberías ver logs de las funciones.

### 7. Si sigue sin funcionar: Verificar formato de función

Las funciones deben usar este formato:

```javascript
export default async function handler(req, res) {
  // código...
}
```

**NO** uses:
- `module.exports` ❌
- `exports.handler` ❌

## Debugging

Para ver qué está pasando:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Intenta procesar una foto
4. Busca la request a `/api/process-photo`
5. Verifica:
   - Status code
   - Response body
   - Headers

## Checklist Final

- [ ] Ejecutando `vercel dev` (no `npm run dev`)
- [ ] Reinicié el servidor después de crear/modificar funciones
- [ ] `.env.local` existe con todas las variables
- [ ] `api/process-photo.js` existe y tiene formato correcto
- [ ] `/api/test` funciona en el navegador
- [ ] Veo logs en la terminal cuando hago requests

