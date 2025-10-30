# 🔧 Solución: Error 404 desde el Frontend

## Problema Identificado

Tienes DOS servidores corriendo:
- **Puerto 3000**: Probablemente un servidor Vite puro (sin funciones API)
- **Puerto 3001**: `vercel dev` (con funciones API)

Cuando el frontend carga desde `http://localhost:3000` y hace fetch a `/api/process-photo`, está usando el servidor del puerto 3000 que NO tiene las funciones serverless, por eso devuelve 404.

## Solución

### Paso 1: Cerrar todos los servidores

```bash
# En todas las terminales donde tengas servidores corriendo:
# Presiona Ctrl+C para detenerlos
```

### Paso 2: Verificar que no hay procesos usando el puerto 3000

```bash
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# O si no funciona:
sudo lsof -ti:3000 | xargs kill -9
```

### Paso 3: Iniciar SOLO vercel dev

```bash
npm run dev:vercel
```

Ahora debería iniciar en el puerto 3000 (sin conflictos) o te dirá en qué puerto está.

### Paso 4: Usar SOLO el puerto que te indica vercel dev

Si `vercel dev` te dice que está en el puerto 3001, abre tu navegador en:
```
http://localhost:3001
```

**NO uses el puerto 3000** si vercel dev está en otro puerto.

## Verificación

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta procesar una foto
4. Deberías ver logs como:
   ```
   🔄 [PhotoDemo] Enviando request a: {url: "/api/process-photo", ...}
   📡 [PhotoDemo] Response recibido: {ok: true, status: 200, ...}
   ```

## Si sigue sin funcionar

1. Verifica que accedes al puerto correcto:
   - Si `vercel dev` dice "Available at http://localhost:3001"
   - Entonces abre `http://localhost:3001` (NO 3000)

2. Verifica los logs en la terminal de `vercel dev`:
   - Cuando haces el request desde el frontend, deberías ver logs como:
   ```
   🔵 [process-photo] Función recibida: {method: 'POST', ...}
   ```

3. Revisa la consola del navegador:
   - Los logs que agregamos te dirán a qué URL exacta se está haciendo el request
   - Verifica que `currentOrigin` sea el mismo puerto donde está corriendo `vercel dev`

