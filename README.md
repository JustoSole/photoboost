# 📸 PhotoBoost - Landing Page

Web app moderna y profesional para PhotoBoost, servicio de mejora de fotos inmobiliarias con IA.

Construida con **React + Vite** siguiendo las mejores prácticas de desarrollo web.

## 🚀 Inicio rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 3. Build para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

---

## 🤖 Procesamiento de Imágenes con Gemini AI

¿Querés usar **fotos reales** de listings en el Before/After?

**Ver guía completa:** [`SETUP_IMAGENES.md`](./SETUP_IMAGENES.md)

**Setup rápido:**

```bash
# 1. Configurar API Key
cp .env.example .env
# Editar .env y agregar tu GEMINI_API_KEY

# 2. Cargar fotos en:
#    public/demo-properties/before/

# 3. Procesar con Gemini Vision API
npm run process-images

# 4. Resultados en:
#    public/demo-properties/after/
```

**Obtener API Key gratis:** https://makersuite.google.com/app/apikey

---

## 📋 Estructura del proyecto

```
PHOTO_ENHANCER_IA/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Hero.jsx
│   │   ├── PainSection.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── VisualResults.jsx
│   │   ├── CostComparison.jsx
│   │   ├── Pricing.jsx
│   │   ├── BetaOffer.jsx
│   │   ├── Footer.jsx
│   │   └── MobileCTA.jsx
│   ├── hooks/              # Custom hooks
│   │   └── useInView.js
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Entry point
│   └── index.css           # Estilos globales
├── public/
│   └── demo-properties/    # 🆕 Fotos reales de demo
│       ├── before/         # Fotos originales
│       └── after/          # Fotos mejoradas con IA
├── scripts/
│   ├── process-images.js   # 🆕 Script Gemini Vision API
│   └── README.md           # Docs del script
├── index.html              # HTML template
├── vite.config.js          # Configuración de Vite
├── package.json            # Dependencias
├── .env.example            # Template para API keys
├── SETUP_IMAGENES.md       # 🆕 Guía de procesamiento
└── README.md               # Este archivo
```

## ✨ Características implementadas

### 🎯 **Componentes principales**

1. **Hero con slider interactivo Before/After**
   - Animaciones con Framer Motion
   - Slider totalmente funcional y responsive
   - Imágenes realistas (sin trucos de B&W)

2. **Pain Section**
   - Cards con costos y problemas del método tradicional
   - Solución destacada visualmente
   - Animaciones on-scroll

3. **How It Works**
   - 3 pasos claros con iconos de React Icons
   - Diseño card-based moderno
   - Transiciones suaves

4. **Visual Results**
   - Hover effect para ver antes/después
   - Ejemplos realistas de propiedades
   - Labels descriptivas

5. **Cost Comparison**
   - Comparación lado a lado
   - Listas de pros/cons con iconos
   - PhotoBoost destacado

6. **Pricing**
   - 3 planes claros
   - Plan Pro destacado (scale effect)
   - Precios con animaciones

7. **Beta Offer**
   - Formulario completamente funcional
   - Integración con WhatsApp
   - File upload con feedback visual

8. **Footer & Mobile CTA**
   - Footer completo con links
   - CTA fijo en mobile que se oculta inteligentemente
   - 100% responsive

### 🔧 **Tecnologías**

- ⚛️ **React 18** - UI moderna y reactiva
- ⚡ **Vite** - Build tool ultra rápido
- 🎨 **Framer Motion** - Animaciones fluidas
- 📦 **React Icons** - Iconos profesionales
- 🎯 **Custom Hooks** - Código reutilizable (useInView)
- 📱 **CSS Modules** - Estilos component-scoped

## 🎨 Personalización

### Colores
Editá las variables CSS en `src/index.css`:

```css
:root {
  --accent-green: #00C58E;
  --accent-blue: #4A90E2;
  --gray-900: #111827;
  /* ... más variables */
}
```

### Imágenes
Para usar tus propias imágenes:

1. **Opción A**: Reemplazá las URLs en los componentes
2. **Opción B**: Guardá imágenes en `public/images/` y usá rutas relativas:

```jsx
<img src="/images/mi-foto.jpg" alt="..." />
```

### WhatsApp
Cambiá el número en `src/components/BetaOffer.jsx`:

```javascript
const whatsappNumber = '5491112345678' // Tu número
```

### Backend/API
Para conectar el formulario a tu backend:

1. Instalá axios: `npm install axios`
2. Modificá `handleSubmit` en `BetaOffer.jsx`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  await axios.post('/api/beta-signup', formData)
}
```

## 📦 Scripts disponibles

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build para producción
npm run preview          # Preview del build
npm run lint             # Revisar código con ESLint
npm run process-images   # 🆕 Procesar fotos con Gemini AI
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 768px - 480px  
- **Mobile**: < 480px

## ⚡ Optimizaciones incluidas

- ✅ **Code splitting** automático con Vite
- ✅ **Lazy loading** con IntersectionObserver (custom hook)
- ✅ **Animaciones optimizadas** con Framer Motion
- ✅ **Fast Refresh** para desarrollo ultra rápido
- ✅ **Tree shaking** automático
- ✅ **CSS scoped** por componente
- ✅ **Responsive design** mobile-first
- ✅ **Semantic HTML** para mejor SEO

## 🎯 Próximos pasos sugeridos

### Funcionalidad
- [ ] Conectar formulario a backend/CRM
- [ ] Implementar procesamiento real de imágenes
- [ ] Agregar autenticación de usuarios
- [ ] Sistema de pagos (Stripe/MercadoPago)

### Marketing & Analytics
- [ ] Google Analytics 4
- [ ] Facebook Pixel / Meta Ads
- [ ] Hotjar / Microsoft Clarity
- [ ] A/B testing de CTAs

### SEO & Performance
- [ ] Meta tags optimizados (Open Graph, Twitter Cards)
- [ ] Schema markup para rich snippets
- [ ] Sitemap.xml y robots.txt
- [ ] Optimizar imágenes (convertir a WebP)
- [ ] Implementar PWA (Service Worker)

### Deploy
- [ ] Deploy en Vercel/Netlify/Railway
- [ ] Configurar dominio custom
- [ ] SSL/HTTPS automático
- [ ] CDN para assets estáticos

## 📝 Notas importantes

- El slider Before/After funciona arrastrando o clickeando
- Los resultados visuales muestran el "After" al hacer hover
- El formulario Beta redirige a WhatsApp con los datos pre-cargados
- En mobile aparece un CTA fijo en la parte inferior

## 🤝 Soporte

Para cualquier duda o customización adicional, consultá la documentación en `landing_page_prompt.md`

---

**© 2025 PhotoBoost** - IA aplicada al real estate 🚀

