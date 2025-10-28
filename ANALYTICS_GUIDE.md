# 📊 Guía de Google Analytics - PhotoBoost

## Configuración completada ✅

Google Analytics está completamente configurado con el ID: **G-TWVJ55L63X**

## Eventos trackeados automáticamente

### 1. **Clicks en CTAs** 🎯
Todos los botones principales están siendo monitoreados:

| CTA | Ubicación | Evento |
|-----|-----------|--------|
| "Aplicar a la beta gratuita" | Hero Section | `cta_click` |
| "Mejorar mis fotos ahora" | Mobile CTA Fixed | `cta_click` |
| "Comenzar" (Starter) | Pricing Section | `pricing_plan_click` |
| "Comenzar prueba" (Pro) | Pricing Section | `pricing_plan_click` |
| "Contactar ventas" (Agencia) | Pricing Section | `pricing_plan_click` |

### 2. **Conversiones** 💰
- **Envío de formulario Beta**: Trackea cuando alguien completa el formulario
  - Incluye: tamaño del negocio, cantidad de fotos mensuales
  - Evento: `form_submission`

### 3. **Engagement** 📈
- **Interacción con slider de comparación**: Trackea clicks en flechas del carousel
  - Evento: `comparison_interaction`
  - Métrica: número de imagen vista

### 4. **Profundidad de Scroll** 📜
Trackea automáticamente cuando el usuario scrollea:
- 25% de la página
- 50% de la página
- 75% de la página
- 100% de la página (bottom)

Evento: `scroll_depth`

### 5. **Tiempo en página** ⏱️
Trackea cada 30 segundos el tiempo que el usuario permanece en la página.

Evento: `time_on_page`

## Cómo ver las métricas en Google Analytics

### En tiempo real
1. Ve a Google Analytics
2. **Reports → Realtime**
3. Verás usuarios activos y eventos en vivo

### Eventos personalizados
1. **Reports → Engagement → Events**
2. Aquí verás todos los eventos listados arriba

### Conversiones importantes
Para configurar conversiones en GA4:

1. Ve a **Configure → Events**
2. Marca como conversión estos eventos:
   - `form_submission` (prioridad alta ⭐)
   - `pricing_plan_click` (prioridad alta ⭐)
   - `cta_click` (prioridad media)

### Crear audiencias personalizadas
Puedes crear audiencias basadas en:
- Usuarios que hicieron scroll hasta 75%
- Usuarios que clickearon en planes premium
- Usuarios que pasaron más de 2 minutos en la página

## Métricas clave a monitorear

### 1. **Tasa de conversión del formulario**
```
(form_submissions / page_views) × 100 = % de conversión
```

### 2. **Plan más clickeado**
Ve a Events → `pricing_plan_click` → Ver por `event_label`

### 3. **CTAs más efectivos**
Ve a Events → `cta_click` → Compara por `cta_location`

### 4. **Engagement promedio**
- Tiempo promedio en página
- % usuarios que llegan a 75% de scroll
- Interacciones con el slider

## Dashboard recomendado

Crea un dashboard con estas tarjetas:

1. **Conversiones del día**
   - `form_submission` count

2. **Clicks en pricing**
   - `pricing_plan_click` desglosado por plan

3. **Tasa de engagement**
   - Usuarios que scrollean 50%+
   - Tiempo promedio > 1 minuto

4. **Funnel de conversión**
   - Page view → CTA click → Form view → Form submission

## Próximos pasos recomendados

1. **Configurar Google Tag Manager** (opcional pero recomendado)
   - Permite gestionar eventos sin deployar código

2. **Integrar con Google Ads** (cuando lances campañas)
   - Importa conversiones de GA4 a Google Ads

3. **Crear informes personalizados**
   - Exporta datos semanales a Google Sheets
   - Automatiza reportes con Looker Studio

## Debugging

Para ver eventos en consola del navegador:
- Abre DevTools (F12)
- Verás mensajes: `📊 Analytics Event: [nombre_evento]`

Para verificar que gtag está cargando:
- En consola escribe: `window.gtag`
- Debe retornar una función

## Soporte

Si necesitas agregar más eventos o métricas, edita:
`/src/utils/analytics.js`

---

**Documentación oficial**: https://support.google.com/analytics/answer/9304153

