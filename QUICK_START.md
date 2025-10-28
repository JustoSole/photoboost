# ⚡ Quick Start - PhotoBoost

## 🎯 Ver la página AHORA

La aplicación ya está corriendo! Abrí tu navegador en:

**http://localhost:3000**

Si no se abrió automáticamente, copiá y pegá esa URL en tu navegador.

---

## 🔧 Para la próxima vez

Cuando quieras volver a trabajar en el proyecto:

```bash
cd /Users/justosoleno/Downloads/PHOTO_ENHANCER_IA
npm run dev
```

---

## 📝 Personalizaciones rápidas

### 1. Cambiar el número de WhatsApp

Abrí: `src/components/BetaOffer.jsx`

Buscá la línea 36 y cambiá:
```javascript
const whatsappNumber = '5491112345678' // ← Tu número aquí
```

### 2. Cambiar colores

Abrí: `src/index.css`

Líneas 4-15, editá las variables:
```css
--accent-green: #00C58E;  /* Color principal */
--accent-blue: #4A90E2;   /* Color secundario */
```

### 3. Cambiar textos

Todos los textos están en los componentes de `src/components/`:
- `Hero.jsx` - Título principal
- `PainSection.jsx` - Problemas y solución
- `Pricing.jsx` - Planes y precios
- `BetaOffer.jsx` - Formulario

---

## 🚀 Deploy rápido (5 minutos)

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir instrucciones → ¡Listo!
```

Tu sitio estará en: `https://tu-proyecto.vercel.app`

### Opción 2: Con GitHub + Vercel

1. **Crear repo en GitHub**
```bash
git init
git add .
git commit -m "PhotoBoost landing page"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/photoboost.git
git push -u origin main
```

2. **Conectar en Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - "New Project" → Importar tu repo
   - Click "Deploy"
   - ¡Listo! 🎉

---

## 📱 Probar en tu celular

1. Mientras `npm run dev` está corriendo, buscá tu IP local:

```bash
ifconfig | grep inet
```

2. En tu celular, andá a: `http://TU-IP:3000`

Ejemplo: `http://192.168.1.10:3000`

---

## ✅ Checklist antes de lanzar

- [ ] Cambiar número de WhatsApp
- [ ] Revisar todos los textos
- [ ] Probar el formulario
- [ ] Testear en mobile
- [ ] Deploy en Vercel/Netlify
- [ ] Configurar dominio personalizado
- [ ] Agregar Google Analytics

---

## 🆘 Problemas comunes

### El servidor no inicia
```bash
# Detener proceso anterior
pkill -f vite

# Limpiar e instalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Cambios no se ven
1. Guardar el archivo (Cmd/Ctrl + S)
2. El browser se actualiza solo (Hot Reload)
3. Si no funciona, refrescar manualmente (Cmd/Ctrl + R)

### Error de puerto ocupado
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O cambiar puerto en vite.config.js
```

---

## 📚 Archivos importantes

- `README.md` - Documentación completa
- `DEPLOYMENT.md` - Guía de deploy detallada
- `src/components/` - Todos los componentes
- `src/index.css` - Estilos globales
- `package.json` - Scripts y dependencias

---

## 💡 Tips

1. **Hot Reload**: Los cambios se ven automáticamente, no hace falta refrescar
2. **Componentes**: Cada sección es un componente separado, fácil de editar
3. **Estilos**: Cada componente tiene su CSS propio (ej: `Hero.css`)
4. **Responsive**: Todo funciona en mobile, tablet y desktop
5. **Performance**: Vite es ultra rápido, los cambios son instantáneos

---

## 🎨 Recursos

- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vitejs.dev)
- [Framer Motion (animaciones)](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

**¿Necesitás ayuda?** Consultá el `README.md` para más detalles.

**¡A crear algo increíble! 🚀**

