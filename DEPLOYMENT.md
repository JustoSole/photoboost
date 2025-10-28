# 🚀 Guía de Deploy - PhotoBoost

## Deploy rápido en Vercel (Recomendado)

Vercel es ideal para proyectos Vite + React. **Deploy gratis en 2 minutos:**

### Método 1: Con GitHub

1. Subí tu proyecto a GitHub:
```bash
git init
git add .
git commit -m "Initial commit - PhotoBoost landing page"
git branch -M main
git remote add origin https://github.com/tu-usuario/photoboost.git
git push -u origin main
```

2. Andá a [vercel.com](https://vercel.com)
3. Conectá tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. Click en "Deploy"
6. ¡Listo! Tu sitio estará en `https://tu-proyecto.vercel.app`

### Método 2: Con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir las instrucciones en pantalla
```

## Deploy en Netlify

```bash
# Build del proyecto
npm run build

# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Para producción
netlify deploy --prod
```

### Configuración en Netlify (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Deploy en Railway

1. Creá una cuenta en [railway.app](https://railway.app)
2. Click en "New Project" → "Deploy from GitHub"
3. Seleccioná tu repositorio
4. Railway detectará Vite automáticamente
5. Deploy automático en cada push

## Variables de entorno

Si necesitás variables de entorno:

1. Creá `.env.local`:
```bash
VITE_WHATSAPP_NUMBER=5491112345678
VITE_API_URL=https://api.photoboost.ai
```

2. Usá en tu código:
```javascript
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER
```

3. Configurá en tu plataforma de deploy:
   - **Vercel**: Settings → Environment Variables
   - **Netlify**: Site settings → Build & deploy → Environment
   - **Railway**: Variables tab

## Dominio personalizado

### En Vercel:
1. Settings → Domains
2. Agregá tu dominio (ej: `photoboost.ai`)
3. Configurá los DNS records que te indica

### En Netlify:
1. Domain settings → Add custom domain
2. Seguí las instrucciones de DNS

## Optimizaciones pre-deploy

```bash
# Verificar build
npm run build
npm run preview

# Verificar bundle size
npm run build -- --analyze

# Optimizar imágenes (si usás locales)
# Convertir a WebP para mejor performance
```

## CDN y Performance

Ambas plataformas incluyen:
- ✅ CDN global automático
- ✅ Compresión gzip/brotli
- ✅ SSL/HTTPS gratuito
- ✅ Cache inteligente
- ✅ Lighthouse score > 90

## Monitoreo post-deploy

### Analytics gratuitos:
- [Vercel Analytics](https://vercel.com/analytics)
- [Google Analytics 4](https://analytics.google.com)
- [Microsoft Clarity](https://clarity.microsoft.com)
- [Plausible](https://plausible.io) (privacy-first)

### Agregar Google Analytics:

1. Obtén tu ID de GA4
2. Agregá en `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Checklist pre-launch

- [ ] Actualizar número de WhatsApp en `BetaOffer.jsx`
- [ ] Verificar que todos los enlaces funcionen
- [ ] Probar formulario de beta
- [ ] Verificar responsive en mobile
- [ ] Testear performance con Lighthouse
- [ ] Configurar dominio personalizado
- [ ] Agregar analytics
- [ ] Configurar meta tags para SEO
- [ ] Testear en diferentes navegadores
- [ ] Comprimir imágenes si usás locales

## Comandos útiles

```bash
# Ver preview del build
npm run preview

# Build local
npm run build

# Lint antes de deploy
npm run lint

# Verificar bundle
npx vite-bundle-visualizer
```

## Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build falla
```bash
# Verificar versión de Node
node --version  # Debería ser >= 16

# Limpiar cache
npm cache clean --force
npm install
```

### Imágenes no cargan
- Verificar que las rutas sean relativas a `/public`
- Usar URLs absolutas de CDN para mejor performance

---

**¿Necesitás ayuda?** Abrí un issue en el repo o contactá al equipo de soporte.

🚀 **Happy deploying!**

