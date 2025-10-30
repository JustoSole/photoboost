# 🚨 Problemas de Deployment en Vercel - Soluciones

## Problema 1: Deployment no se actualiza después de push

### Síntomas:
- Haces `git push` pero Vercel no muestra los cambios
- El sitio muestra contenido viejo después de 30+ minutos

### Causas Comunes:
1. **Cache agresivo del navegador** (90% de los casos)
2. **Errores en `vercel.json` que bloquean el build silenciosamente**
3. **Webhook de GitHub desconectado**

### Solución:
```bash
# 1. Verificar que el build funciona localmente
npm run build

# 2. Verificar que el código está pusheado
git log --oneline -1
git status

# 3. Si el build local funciona, hacer deploy manual
vercel --prod --yes

# 4. Si falla, revisar los errores específicos
```

---

## Problema 2: Error "Environment Variable references Secret that does not exist"

### Error exacto:
```
Error: Environment Variable "VITE_API_URL" references Secret "vite_api_url", which does not exist.
```

### Causa:
`vercel.json` tiene referencias a secrets que no existen en tu proyecto de Vercel.

### Solución:
**Opción A - Remover la variable si no es necesaria:**
```json
// ANTES (❌ causaba error)
{
  "version": 2,
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}

// DESPUÉS (✅ funciona)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**Opción B - Crear el secret en Vercel:**
1. Ir a Vercel Dashboard → Settings → Environment Variables
2. Crear el secret con el nombre exacto (ej: `vite_api_url`)
3. Redeploy

---

## Problema 3: Error "Function Runtimes must have a valid version"

### Error exacto:
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

### Causa:
Configuración incorrecta de `functions` en `vercel.json` con la nueva versión de Vercel.

### Solución:
**Simplificar `vercel.json`** - Vercel detecta las API functions automáticamente:

```json
// ANTES (❌ causaba error en Vercel CLI v48+)
{
  "version": 2,
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x",
      "memory": 1024,
      "maxDuration": 30
    }
  }
}

// DESPUÉS (✅ funciona - detección automática)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev"
}
```

**Nota:** Si necesitas configurar memoria o maxDuration, usa `vercel.json` en la carpeta `api/`:
```json
// api/vercel.json
{
  "functions": {
    "*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

---

## Problema 4: Cache del navegador extremadamente persistente

### Síntomas:
- Vercel muestra "Deployment Ready"
- El build local muestra el contenido correcto
- Pero el navegador sigue mostrando contenido viejo

### Solución Rápida:
```
1. Modo Incógnito:
   Mac: Cmd + Shift + N
   Windows: Ctrl + Shift + N

2. Hard Reload:
   Mac: Cmd + Shift + R
   Windows: Ctrl + Shift + F5 o Ctrl + Shift + R
```

### Solución Definitiva:
```
Chrome/Edge:
1. Settings → Privacy and Security → Clear browsing data
2. Time range: "All time"
3. Seleccionar: "Cached images and files"
4. Click "Clear data"
```

---

## ✅ Workflow Correcto para Deployment

```bash
# 1. Hacer cambios en el código
# 2. Commitear y pushear
git add -A
git commit -m "Tu mensaje"
git push origin main

# 3. Verificar que el build funciona localmente
npm run build

# 4. Si Vercel no actualiza después de 2-3 minutos, deploy manual
vercel --prod --yes

# 5. Limpiar cache del navegador
# Cmd+Shift+N (Incógnito) o Cmd+Shift+R (Hard Reload)
```

---

## 🔧 Script de Diagnóstico

Creamos `scripts/force-deploy.js` que:
- ✅ Verifica que el código está pusheado
- ✅ Hace build local para detectar errores
- ✅ Verifica el contenido del build
- ✅ Da instrucciones claras al usuario

```bash
node scripts/force-deploy.js
```

---

## 📝 Configuración Final de vercel.json que FUNCIONA

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev"
}
```

**Importante:** Mantenerlo simple. Vercel detecta automáticamente:
- API routes en `/api`
- Runtime de Node.js
- Configuraciones de framework (Vite, Next, etc.)

---

## 🚀 Deploy Manual en Caso de Emergencia

```bash
# Instalar Vercel CLI (si no está instalado)
npm i -g vercel

# Deploy directo a producción
cd /path/to/project
vercel --prod --yes

# Ver logs si algo falla
vercel logs [deployment-url]
```

---

## 🎯 Resumen de Commits que Resolvieron el Problema

1. `f07b3b2` - Fix: Simplificar PhotoDemo (código de la app)
2. `8eff89b` - Fix: Remover VITE_API_URL problemática
3. `ff55a16` - Fix: Simplificar vercel.json
4. **Deploy manual con CLI** → ✅ Funcionó

**Lección aprendida:** Cuando Vercel no deploya, casi siempre es:
1. Cache del browser (80%)
2. Errores en `vercel.json` (15%)
3. Otros problemas (5%)

Siempre probar **modo incógnito** primero! 🔥

