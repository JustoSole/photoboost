# 🐛 Guía de Debugging Mejorada

## Problema: Error 404 en `/api/process-photo`

### Síntomas
- El frontend hace request a `http://localhost:3000/api/process-photo`
- Obtiene error 404
- En la terminal de `vercel dev` NO aparecen logs de la función

### Causa Principal
**Estás usando el puerto incorrecto**. Si `vercel dev` está corriendo en el puerto 3001, pero abres el navegador en `localhost:3000`, las funciones API no estarán disponibles.

### Solución Paso a Paso

#### 1. Verificar en qué puerto está corriendo vercel dev

Mira la terminal donde ejecutaste `npm run dev:vercel`. Deberías ver algo como:

```
> Ready! Available at http://localhost:3001
```

**IMPORTANTE**: Usa el puerto que muestra ahí.

#### 2. Abrir el navegador en el puerto correcto

- Si dice `localhost:3001` → Abre `http://localhost:3001`
- Si dice `localhost:3000` → Abre `http://localhost:3000`

#### 3. Verificar los logs en la consola del navegador

Con el nuevo debugging, verás logs detallados:

```
🔄 [PhotoDemo] === INICIANDO REQUEST ===
📍 Ubicación actual: { origin: "http://localhost:3000", ... }
🎯 Request URL: { absolute: "http://localhost:3000/api/process-photo" }
```

**Si el origin es diferente al puerto de vercel dev, ese es el problema.**

#### 4. Verificar los logs en la terminal de vercel dev

Si la función se está ejecutando, deberías ver:

```
🔵 [process-photo] ===== FUNCIÓN EJECUTADA =====
📥 Request recibido: { method: 'POST', ... }
```

**Si NO ves estos logs**, la función nunca se está ejecutando, lo que confirma que estás usando el puerto incorrecto.

### Checklist de Verificación

Antes de probar el procesamiento de foto:

- [ ] `vercel dev` está corriendo
- [ ] Conoces el puerto donde está corriendo (ej: 3001)
- [ ] Abriste el navegador en ese mismo puerto (ej: `http://localhost:3001`)
- [ ] Probaste acceder directamente a `/api/test` (debería funcionar)
- [ ] Revisas los logs en la terminal cuando haces el request

### Si Sigues Teniendo 404

1. **Cierra todos los servidores**:
   ```bash
   # En todas las terminales, presiona Ctrl+C
   ```

2. **Mata procesos en puerto 3000** (si es necesario):
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

3. **Reinicia vercel dev**:
   ```bash
   npm run dev:vercel
   ```

4. **Copia el puerto exacto** que muestra en la terminal

5. **Abre el navegador en ese puerto exacto**

6. **Prueba `/api/test` primero** antes de probar el formulario

### Nuevas Features de Debugging

Ahora el código muestra:

1. **En el navegador (console)**:
   - Puerto y origen actual
   - URL exacta del request
   - Tamaño del payload
   - Duración del request
   - Detalles completos de la respuesta
   - Diagnóstico específico para error 404

2. **En la terminal (vercel dev)**:
   - Si la función se ejecuta
   - Headers completos del request
   - Método HTTP usado
   - Si hay body o no

### Ejemplo de Logs Correctos

**Navegador (cuando funciona)**:
```
🔄 [PhotoDemo] === INICIANDO REQUEST ===
📍 Ubicación actual: { origin: "http://localhost:3001", port: "3001" }
🎯 Request URL: { absolute: "http://localhost:3001/api/process-photo" }
📡 [PhotoDemo] === RESPONSE RECIBIDO ===
📊 Status: { ok: true, status: 200 }
```

**Terminal vercel dev (cuando funciona)**:
```
🔵 [process-photo] ===== FUNCIÓN EJECUTADA =====
📥 Request recibido: { method: 'POST', url: '/api/process-photo' }
✅ [process-photo] Validando variables de entorno...
```

Si ves estos logs, **todo está funcionando correctamente**.

