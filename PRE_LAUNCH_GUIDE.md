# 🚀 Guía de Pre-Lanzamiento - PhotoBoost

¡Tu landing page está lista! Ahora solo faltan algunos pasos de configuración rápida.

## 📚 Guías Disponibles en tu Proyecto

- **`QUICK_START.md`** ⚡ → Inicio rápido (ver página, personalizar, deploy)
- **`PRE_LAUNCH_GUIDE.md`** (este archivo) → Pasos de configuración antes del lanzamiento
- **`DEPLOYMENT.md`** 🚀 → Deploy en Vercel, Netlify, Railway
- **`DEPLOY_CHECKLIST.md`** ✅ → Checklist completo de todo lo necesario
- **`GOOGLE_SHEETS_SETUP.md`** 🔧 → Configuración de Google Sheets para leads
- **`README.md`** 📸 → Documentación completa del proyecto

---

## 📋 Pasos Rápidos (15 minutos)

### 1. Configurar Google Sheets (5 min)

**Objetivo:** Capturar leads automáticamente en una hoja de cálculo

Seguí las instrucciones detalladas en: **`GOOGLE_SHEETS_SETUP.md`**

Resumen rápido:
1. Crear Google Sheet con encabezados
2. Configurar Apps Script
3. Desplegar como web app
4. Copiar URL del webhook
5. Agregar a `.env.local` (crear si no existe)

---

### 2. Configurar Google Analytics (3 min)

**Objetivo:** Rastrear visitantes desde el día 1

1. Ir a [analytics.google.com](https://analytics.google.com)
2. Crear cuenta nueva (si no tenés)
3. Crear una propiedad para "PhotoBoost"
4. Copiar el Measurement ID (ej: `G-ABC123XYZ`)
5. Abrir `index.html` y reemplazar `G-XXXXXXXXXX` en línea 32 con tu ID real

---

### 3. Verificar WhatsApp (1 min)

Ya está configurado con el número `542944806519`.

Probar que funciona:
- Llenar el formulario en `npm run dev`
- Verificar que abre WhatsApp con mensaje pre-cargado

---

### 4. Deploy en Vercel (6 min)

**Opción A: GitHub (Recomendado)**

```bash
# En la terminal, desde la carpeta del proyecto
git init
git add .
git commit -m "PhotoBoost - Ready for launch"

# Crear repo en GitHub.com (nuevo repositorio)
# Luego:

git remote add origin https://github.com/TU-USUARIO/photoboost.git
git branch -M main
git push -u origin main
```

Luego:
1. Ir a [vercel.com](https://vercel.com)
2. Sign in con GitHub
3. Click "Add New Project"
4. Seleccionar tu repositorio
5. En "Environment Variables", agregar:
   ```
   VITE_GOOGLE_SHEETS_WEBHOOK=tu_url_del_webhook
   ```
6. Click "Deploy"
7. ¡Listo! Tu URL será: `https://photoboost-XYZ.vercel.app`

**Opción B: CLI (Más rápido)**

```bash
# Instalar Vercel CLI (solo una vez)
npm i -g vercel

# Deploy
vercel

# Seguir instrucciones
# Cuando pida variables de entorno, agregar:
# VITE_GOOGLE_SHEETS_WEBHOOK
```

---

## ✅ Testing Post-Launch

Una vez que esté deployado en Vercel:

- [ ] Abrir la URL pública
- [ ] Llenar el formulario beta
- [ ] Verificar que abre WhatsApp
- [ ] Verificar que aparece en Google Sheets
- [ ] Probar en mobile y desktop
- [ ] Verificar que Google Analytics recibe datos

## 🎯 Lo Que Tuviste Listo

✅ Landing page completa y responsive
✅ Formulario beta funcional
✅ WhatsApp configurado
✅ Google Sheets integration
✅ Google Analytics 4
✅ SEO optimizado (Open Graph, Twitter Cards)
✅ Styling profesional
✅ Animaciones con Framer Motion
✅ Mobile CTA sticky
✅ Hero con slider Before/After

## 📝 Notas Importantes

### Google Sheets

- Si no configurás el webhook, el formulario seguirá funcionando
- Simplemente redirige a WhatsApp (sin guardar en Sheets)
- Podés agregarlo después sin problemas

### Google Analytics

- El código está listo en `index.html`
- Solo necesitás reemplazar el ID de medición
- Mientras tanto, funciona sin errores

### Variables de Entorno

Crear archivo `.env.local` en la raíz:

```bash
VITE_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/s/...
```

**Importante:** Este archivo NO se sube a GitHub (está en .gitignore)

---

## 🐛 Troubleshooting

### "Cannot find module VITE_GOOGLE_SHEETS_WEBHOOK"

- No hay problema! El formulario seguirá funcionando
- Solo no se guardarán datos en Sheets
- Envía directamente a WhatsApp

### Google Analytics no muestra datos

- Verificar que reemplazaste el ID en `index.html`
- Esperar 1-2 horas para datos iniciales
- Verificar en Realtime → Overview

### Vercel no detecta Vite

- Verificar que existe `package.json`
- Verificar que hay dependencias de React
- Vercel debería detectarlo automáticamente

---

## 📊 Métricas a Monitorear

### Google Analytics

- Páginas vistas
- Eventos de submit del formulario
- Scroll depth
- Tiempo en página

### Google Sheets

- Cantidad de leads
- Conversión (visitas vs. submits)
- Datos de contacto para seguimiento

### Vercel

- Performance
- Build time
- Deployment frequency
- Uptime

---

## 🎉 Próximos Pasos (Post-Validación)

Una vez que tengas leads:

1. **Email Marketing**
   - Email follow-up a leads
   - Nurturing sequence

2. **Conversión de Leads**
   - Seguimiento por WhatsApp
   - Onboarding de primeros clientes beta

3. **Mejoras Basadas en Datos**
   - A/B testing de CTAs
   - Optimización de formulario
   - Agregar testimonios

4. **Paid Ads**
   - Facebook/Meta Ads
   - Google Ads
   - Remarketing

---

## 📞 ¿Necesitás Ayuda?

**Archivos de referencia:**
- `GOOGLE_SHEETS_SETUP.md` - Setup detallado de Sheets
- `DEPLOY_CHECKLIST.md` - Checklist completo
- `DEPLOYMENT.md` - Guía de deploy general

**Comandos útiles:**

```bash
# Desarrollo local
npm run dev

# Build local
npm run build

# Preview del build
npm run preview

# Verificar configuración
npm run check-setup
```

---

¡Buena suerte con el lanzamiento! 🚀

Tu app está lista para recibir los primeros leads beta.

