# ✅ Checklist de Deploy - PhotoBoost

## Antes del Deploy

### 1. Configuración de Google Sheets
- [ ] Crear hoja de cálculo en Google Sheets
- [ ] Configurar encabezados: `Timestamp | Nombre | Email | WhatsApp | NombreArchivo`
- [ ] Obtener Spreadsheet ID de la URL
- [ ] Crear Apps Script con el código de `GOOGLE_SHEETS_SETUP.md`
- [ ] Desplegar como web app y copiar la URL
- [ ] Agregar URL en `.env.local` como `VITE_GOOGLE_SHEETS_WEBHOOK`

### 2. Configuración de Google Analytics
- [ ] Crear cuenta de Google Analytics 4
- [ ] Crear una propiedad para PhotoBoost
- [ ] Copiar el Measurement ID (ej: `G-XXXXXXXXXX`)
- [ ] Reemplazar `G-XXXXXXXXXX` en `index.html` línea 32 con tu ID real

### 3. Verificar WhatsApp
- [ ] Confirmar que el número en `BetaOffer.jsx` es correcto: `542944806519`
- [ ] Probar que el link de WhatsApp funcione

### 4. Preparar Repositorio
- [ ] Hacer git init si no existe
- [ ] Crear `.gitignore` si no existe
- [ ] Verificar que `.env.local` esté en `.gitignore` (contiene datos sensibles)

## Deploy en Vercel

### Opción A: Desde GitHub

1. Crear repositorio en GitHub:
```bash
git init
git add .
git commit -m "Initial commit - PhotoBoost landing page"
git branch -M main
git remote add origin https://github.com/tu-usuario/photoboost.git
git push -u origin main
```

2. Conectar con Vercel:
   - Ir a [vercel.com](https://vercel.com)
   - Sign in con GitHub
   - Click en "Add New Project"
   - Seleccionar tu repositorio
   - Vercel detectará automáticamente Vite

3. Configurar Variables de Entorno:
   - En "Environment Variables", agregar:
     - `VITE_GOOGLE_SHEETS_WEBHOOK` = tu URL del webhook
   - Click "Deploy"

4. Obtener URL: `https://tu-proyecto.vercel.app`

### Opción B: Con Vercel CLI

```bash
# Instalar Vercel CLI (solo una vez)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir instrucciones en pantalla
# Al finalizar, URL pública estará lista
```

## Post-Deploy

### Testing en Producción

- [ ] Abrir URL pública en navegador
- [ ] Verificar que carga sin errores
- [ ] Probar formulario beta:
  - [ ] Llenar datos
  - [ ] Verificar que abre WhatsApp
  - [ ] Verificar que datos llegan a Google Sheets
- [ ] Probar en mobile
- [ ] Probar en diferentes navegadores
- [ ] Verificar que todos los CTAs funcionan
- [ ] Revisar que las imágenes carguen correctamente

### Google Analytics

- [ ] Verificar que GA4 está recibiendo datos
- [ ] Ir a Realtime → Overview en Google Analytics
- [ ] Visitar tu sitio
- [ ] Confirmar que aparece en tiempo real

### Links de Referencia

- **Sitio:** https://tu-proyecto.vercel.app
- **Dashboard Vercel:** https://vercel.com/dashboard
- **Google Analytics:** https://analytics.google.com
- **Google Sheets:** Tu hoja de cálculo de leads

## Próximos Pasos (Opcional)

### Custom Domain
- Ir a Vercel → Settings → Domains
- Agregar tu dominio personalizado
- Configurar DNS según instrucciones

### Optimizaciones Futuras
- Agregar Hotjar o Microsoft Clarity para heatmaps
- Configurar Facebook Pixel / Meta Ads
- Implementar A/B testing de CTAs
- Optimizar imágenes a WebP
- Agregar PWA (Service Worker)

---

✅ **Una vez completado este checklist, tu landing está lista para recibir leads!**

