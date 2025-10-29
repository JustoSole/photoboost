# 📊 Guía Completa de Google Analytics para PhotoBoost

## 🚀 Cómo Acceder a Google Analytics

1. **Ir a Google Analytics**
   - Ve a: https://analytics.google.com
   - Inicia sesión con tu cuenta de Google (la misma que usaste para crear la propiedad de GA)

2. **Tu ID de Medición Actual**
   - Ya está configurado en tu sitio: **G-TWVJ55L63X**
   - Lo puedes ver en `index.html` (línea 31 y 37)

---

## ✅ Configuraciones Esenciales que Debes Revisar

### 1. **Verificar que el Tracking Funciona** ⚡
   - **Dónde verificar**: En la consola del navegador cuando visites tu sitio
   - **Qué buscar**: Deberías ver mensajes como `📊 Analytics Event: ...`
   - **Prueba manual**: Visita tu sitio y abre la consola (F12 → Console)
   - **En Google Analytics**: Ve a **Tiempo real** → **Información general** (deberías ver visitas activas)

### 2. **Configurar Objetivos/Conversiones** 🎯

   **Ir a**: Configuración → Datos de eventos → Eventos

   Debes crear eventos personalizados como conversiones:

   - ✅ **`form_submission`** (más importante)
     - Nombre: "Registro Beta"
     - Categoría: `conversion`
     - Marcar como "Conversión" → ON
   
   - ✅ **`pricing_plan_click`**
     - Nombre: "Clic en Plan de Precio"
     - Categoría: `conversion`
     - Marcar como "Conversión" → ON

   - ✅ **`cta_click`**
     - Nombre: "Clic en CTA"
     - Categoría: `engagement`

   - ✅ **`section_view`**
     - Nombre: "Visualización de Sección"
     - Categoría: `engagement`

   - ✅ **`scroll_depth`**
     - Nombre: "Profundidad de Scroll"
     - Categoría: `engagement`

   - ✅ **`comparison_interaction`**
     - Nombre: "Interacción con Comparación"
     - Categoría: `engagement`

---

### 3. **Audiencias Personalizadas** 👥

   **Ir a**: Configuración → Audiencias

   Crea audiencias para segmentar:

   - **Visitantes Interesados**: Usuarios que hicieron scroll > 50%
   - **Suscriptores Potenciales**: Usuarios que hicieron clic en CTA pero no completaron formulario
   - **Alto Engagement**: Usuarios que interactuaron con el slider de comparación

---

### 4. **Configurar Filtros y Vistas** 🔍

   **Ir a**: Configuración → Vistas de datos → Crear vista

   Crea vistas filtradas:
   
   - **Vista Principal**: Sin filtros (déjala como está)
   - **Solo Producción**: Filtrar por dominio `photoboost.vercel.app`
   - **Excluir Tráfico Interno**: Filtrar tu IP si haces pruebas frecuentes

---

### 5. **Configurar Informes Personalizados** 📈

   **Ir a**: Exploración → Crear nueva exploración

   Crea informes clave:

   #### **Reporte de Conversiones**
   - Métricas: Eventos de conversión
   - Dimensiones: Fecha, Ubicación del CTA, Plan de precio
   - Verás: ¿Qué CTAs funcionan mejor? ¿Qué planes generan más interés?

   #### **Reporte de Engagement**
   - Métricas: Porcentaje de scroll, tiempo en página, interacciones
   - Dimensiones: Sección de la página
   - Verás: ¿Qué secciones retienen más usuarios?

---

### 6. **Configurar Notificaciones por Email** 📧

   **Ir a**: Configuración → Receptores de notificaciones

   Configura alertas para:
   - Aumento súbito de conversiones
   - Caídas en el tráfico
   - Nuevos objetivos alcanzados

---

### 7. **Linkear con Google Search Console** 🔗

   **Ir a**: Configuración → Enlaces de productos → Search Console

   Esto te permitirá ver:
   - ¿Qué palabras clave traen usuarios?
   - ¿Qué páginas tienen mejor rendimiento en búsquedas?

---

### 8. **Configurar Embudos de Conversión** 🎯

   **Ir a**: Exploración → Crear exploración → Embudo de exploración

   Configura el embudo:
   1. **Aterrizaje en la página** (page_view)
   2. **Interacción con contenido** (scroll_depth > 25%)
   3. **Interés mostrado** (cta_click)
   4. **Conversión** (form_submission)

   Esto te mostrará dónde pierdes usuarios.

---

### 9. **Verificar Eventos en Tiempo Real** ⚡

   **Ir a**: Tiempo real → Eventos

   Cada vez que alguien:
   - Hace scroll
   - Hace clic en un CTA
   - Interactúa con el slider
   - Completa el formulario

   Deberías ver estos eventos aparecer en tiempo real.

---

### 10. **Configurar Análisis de Audiencia** 👥

   **Ir a**: Audiencia → Información general

   Revisa:
   - **Demografía**: Edad, género
   - **Intereses**: Qué les interesa a tus visitantes
   - **Dispositivos**: Desktop vs Mobile (importante para optimización)
   - **Ubicación**: ¿De dónde vienen tus usuarios?

---

## 📋 Checklist Rápido

- [ ] Verificar que Google Analytics recibe datos (Tiempo real)
- [ ] Crear evento `form_submission` como conversión
- [ ] Crear evento `pricing_plan_click` como conversión
- [ ] Configurar alertas por email
- [ ] Crear vista filtrada de producción
- [ ] Configurar Google Search Console
- [ ] Crear informe personalizado de conversiones
- [ ] Crear embudo de conversión
- [ ] Revisar datos de audiencia (dispositivos, ubicación)

---

## 👀 Cómo Ver Tus Eventos en Google Analytics

### 📊 Método 1: Ver TODOS los Eventos (Reporte Predefinido)

**Ir a**: **Informes** → **Compromiso** → **Eventos**

Aquí verás:
- Lista de todos los eventos que están llegando
- Cantidad de veces que ocurrió cada evento
- Usuarios únicos que dispararon cada evento
- Valor del evento (si lo configuraste)

**¿Qué buscar aquí?**
- Verifica que `form_submission` tenga datos (tus conversiones)
- Revisa `cta_click` para ver qué botones reciben más clics
- Analiza `scroll_depth` para ver hasta dónde llegan los usuarios
- Observa `comparison_interaction` para saber si el slider es atractivo

---

### ⚡ Método 2: Ver Eventos EN VIVO (Tiempo Real)

**Ir a**: **Informes** → **Tiempo real** → **Eventos** (pestaña de arriba)

**Úsalo para:**
- Verificar que los eventos funcionan correctamente
- Probar tu sitio y ver los eventos aparecer en tiempo real
- Debugging: Si no ves eventos aquí, algo está mal

**Cómo probar:**
1. Abre esta vista en una pestaña
2. En otra pestaña, visita tu sitio `photoboost.vercel.app`
3. Haz scroll, haz clic en un CTA, completa el formulario
4. Vuelve a Google Analytics y verás los eventos aparecer

---

### 📈 Método 3: Crear Informe Personalizado de Engagement

**Ir a**: **Exploración** → **Crear nueva exploración**

#### Paso a paso para crear el informe:

1. **Nombre**: "Eventos de Engagement PhotoBoost"

2. **Tipo de exploración**: Selecciona **"Exploración libre"**

3. **Configurar dimensiones** (¿por qué agrupar?):
   - Haz clic en "+" en Dimensiones
   - Agrega: **"Nombre del evento"**
   - Agrega: **"Página de la pantalla"** (opcional, para ver en qué página ocurren)

4. **Configurar métricas** (¿qué medir?):
   - Haz clic en "+" en Métricas
   - Agrega: **"Conteo de eventos"** (cuántas veces pasó)
   - Agrega: **"Usuarios únicos"** (cuántas personas distintas)

5. **Configurar tabla**:
   - Arrastra "Nombre del evento" a las filas
   - Arrastra "Conteo de eventos" y "Usuarios únicos" a los valores

6. **Aplicar**: Haz clic en "Aplicar" arriba a la derecha

**Resultado**: Una tabla que muestra cuántas veces ocurrió cada evento y cuántos usuarios únicos lo dispararon.

---

### 🎯 Método 4: Ver Eventos Específicos (Filtrado)

En cualquier informe de eventos, puedes filtrar:

1. **Buscar evento específico**:
   - Haz clic en el icono de búsqueda (🔍)
   - Escribe: `cta_click` o `scroll_depth` o `comparison_interaction`

2. **Ver detalles de un evento**:
   - Haz clic en el nombre de cualquier evento
   - Verás un desglose con más información (fechas, páginas, etc.)

---

### 📋 Qué Eventos Revisar y Por Qué

| Evento | Dónde Ver | Qué Te Dice |
|--------|-----------|-------------|
| `form_submission` | **CONVERSIONES** | ¿Cuántas personas completan el formulario? |
| `cta_click` | Eventos → Filtrado | ¿Qué botones funcionan mejor? |
| `scroll_depth` | Eventos → Scroll | ¿Los usuarios leen todo el contenido? |
| `comparison_interaction` | Eventos → Comparación | ¿El slider de antes/después es atractivo? |
| `time_on_page` | Eventos → Tiempo | ¿La página mantiene a los usuarios? |
| `section_view` | Eventos → Secciones | ¿Qué secciones ven más? |
| `pricing_plan_click` | Eventos → Pricing | ¿Hay interés en los planes? (si aparece) |

---

### 🔍 Método 5: Ver Eventos por Fecha (Tendencias)

**Ir a**: **Informes** → **Compromiso** → **Eventos**

1. En la parte superior, selecciona el **rango de fechas** (últimos 7 días, 30 días, etc.)
2. Haz clic en cualquier evento para ver:
   - Gráfico de tendencia (¿aumenta o disminuye?)
   - Comparación con el período anterior
   - Desglose por día

**Útil para ver:**
- ¿Aumentan las conversiones semana a semana?
- ¿Hay días específicos con más tráfico?
- ¿Qué eventos están creciendo?

---

### 🎨 Método 6: Dashboard Personalizado (Vista Rápida)

**Ir a**: **Personalización** → **Diseños informativos** → **Crear nuevo informe**

Crea un dashboard con los eventos más importantes:

1. **Métrica 1**: Form Submissions (Conversiones)
   - Tipo: Métrica
   - Métrica: `form_submission`
   
2. **Métrica 2**: CTA Clicks (Engagement)
   - Tipo: Métrica
   - Métrica: `cta_click`

3. **Gráfico**: Eventos por día
   - Tipo: Gráfico de líneas
   - Dimensiones: Fecha
   - Métricas: Conteo de eventos

**Resultado**: Una página que muestra todo lo importante de un vistazo.

---

## 🔍 Eventos que Ya Estás Trackeando

Tu sitio ya está trackeando estos eventos automáticamente:

✅ **Eventos de Conversión:**
- `form_submission` - Cuando alguien completa el formulario beta
- `pricing_plan_click` - Cuando hacen clic en un plan

✅ **Eventos de Engagement:**
- `cta_click` - Clics en botones de llamada a la acción
- `section_view` - Visualización de secciones importantes
- `scroll_depth` - Profundidad de scroll (25%, 50%, 75%, 100%)
- `comparison_interaction` - Interacciones con el slider de comparación
- `time_on_page` - Tiempo en página (cada 30 segundos)

---

## 📊 Entendiendo Tu Informe Panorámico (Vista General)

Cuando entras a Google Analytics, lo primero que ves es el **"Informe panorámico"**. Te explico qué significa cada número:

### 🎯 Métricas Principales (Arriba)

#### **Usuarios activos: 9**
- ✅ **Qué significa**: 9 personas diferentes visitaron tu sitio en los últimos 28 días
- ✅ **¿Está bien?**: Sí, para empezar está bien. Quieres que este número crezca.

#### **Usuarios nuevos: 8**
- ✅ **Qué significa**: De esos 9 usuarios, 8 visitaron tu sitio por primera vez
- ✅ **¿Está bien?**: Muy bien, significa que estás atrayendo audiencia nueva
- 📌 **Nota**: Solo 1 usuario volvió (usuario recurrente), esto es normal al inicio

#### **Tiempo de interacción medio: 3 min 14 s**
- ✅ **Qué significa**: En promedio, cada usuario pasó 3 minutos y 14 segundos interactuando con tu sitio
- ✅ **¿Está bien?**: **¡Excelente!** Más de 3 minutos es muy buen tiempo para una landing page
- 📊 **Comparación**: El promedio general es 1-2 minutos, así que estás por encima

#### **Número de eventos: 828**
- ✅ **Qué significa**: afirma eventos totales (clics, scrolls, interacciones)
- ✅ **¿Está bien?**: **¡Muy bien!** 828 eventos entre 9 usuarios = ~92 eventos por usuario
- 📊 **Qué incluye**: clicks, scrolls, time_on_page, comparison_interaction, etc.
- 📌 **Interpretación**: Muchos eventos = usuarios interactúan mucho con tu página (buena señal)

---

### 📄 Páginas Principales

#### **"PhotoBoost - Fotos profesionales..."**
- **Vistas: 45** = Tu página fue vista 45 veces (algunos usuarios volvieron varias veces)
- **Usuarios activos: 9** = Esos 45 views fueron de 9 personas diferentes
- **Número de eventos: 828** = Todos esos eventos ocurrieron en esta página
- **Porcentaje de rebote: 57.1%** = El 57% de las visitas solo vieron esta página y se fueron

#### **¿Qué significa el 57.1% de rebote?**
- ✅ **Está bien**: Para una landing page, un rebote entre 50-70% es normal
- 📌 **Rebote NO es malo** si:
  - El usuario completó el formulario (es una conversión)
  - El usuario leyó el contenido y luego cerró (objetivo cumplido)
- ⚠️ **Solo es malo si**: Los usuarios se van inmediatamente sin interactuar

**¿Cómo saber si es bueno o malo?**
- Si tienes `form_submission` (conversiones), el rebote no importa tanto
- Si NO hay conversiones pero hay rebotes altos, entonces sí es un problema

---

### 🌐 De Dónde Vienen Tus Usuarios

#### **"(direct) / (none): 4 usuarios"**
- ✅ **Qué significa**: 4 personas escribieron directamente tu URL o usaron un marcador
- ✅ **Esto es bueno**: Significa que te conocen o te tienen guardado

#### **"vercel.com / referral: 1 usuario"**
- ✅ **Qué significa**: 1 usuario llegó desde vercel.com (probablemente desde el dashboard de Vercel)
- 📌 **Nota**: Esto puede ser tú mismo visitando desde el panel de Vercel

#### **Sesiones por fuente:**
- Similar a lo anterior, pero cuenta las **visitas** (no usuarios únicos)
- Una persona puede tener múltiples sesiones

---

### 📍 Ubicación de Usuarios

#### **"Buenos Aires: 7 usuarios"**
- ✅ La mayoría de tus usuarios son de Buenos Aires
- 📌 **Nota**: Esto es normal si estás probando tú mismo o si tu audiencia es local

---

### ⚠️ Lo Que FALTA o Está Vacío

#### **"Eventos clave por Plataforma: No hay datos disponibles"**
- ❌ **Problema**: Esto significa que **NO has marcado ningún evento como "clave"** todavía
- ✅ **Solución**: Debes marcar `form_submission` como evento clave (como te expliqué antes)
- 📌 **Una vez que lo hagas**: Aquí verás tus conversiones desglosadas

#### **"Estadísticas: Pronto verás estadísticas aquí"**
- ⏳ **Es opcional**: Puedes crear métricas personalizadas aquí más adelante
- 📌 **Por ahora**: No es urgente, primero enfócate en marcar eventos clave

---

### 📈 Gráfico de Usuarios Nuevos vs Recurrentes

El gráfico muestra:
- Un **pico** alrededor del 26 de octubre (probablemente cuando hiciste pruebas o anunciaste el sitio)
- La mayoría son usuarios **nuevos** (línea azul)
- Pocos usuarios **recurrentes** (línea naranja/roja)

**¿Está bien?**
- ✅ Sí, es normal en las primeras semanas
- 📌 Con el tiempo, quieres que la línea de recurrentes crezca (usuarios que vuelven)

---

### 🎯 Resumen: ¿Qué Significa Todo Esto?

#### ✅ **Lo Que Está Bien:**
1. ✅ 3+ minutos de tiempo de interacción = usuarios leen tu contenido
2. ✅ 828 eventos = alta interacción
3. ✅ 8 usuarios nuevos = estás atrayendo audiencia
4. ✅ Rebote del 57% = aceptable para landing page

#### ⚠️ **Lo Que Debes Hacer:**
1. ⚠️ **MARCAR `form_submission` COMO EVENTO CLAVE** (urgente)
   - Así verás tus conversiones aquí mismo
   - Ve a: Configuración → Eventos → Busca `form_submission` → Marca estrella ⭐

2. ⚠️ **Esperar más datos** (paciencia)
   - 9 usuarios en 28 días es una muestra pequeña
   - Necesitas más tiempo para ver tendencias claras

#### 🎯 **Próximos Pasos:**
1. Marca eventos clave (5 minutos)
2. Espera 1-2 semanas para reunir más datos
3. Revisa este informe cada semana para ver tendencias
4. Compara semana a semana: ¿aumentan usuarios? ¿aumentan conversiones?

---

### 📊 Interpretación de Tus Números Actuales

**En resumen, tu sitio está funcionando bien:**
- ✅ Los usuarios **están interactuando** (828 eventos)
- ✅ Los usuarios **leen el contenido** (3+ minutos)
- ✅ Estás **atrayendo audiencia nueva** (8 nuevos usuarios)
- ⚠️ Pero **falta medir conversiones** (marca eventos clave)

**Una vez que marques `form_submission` como clave, verás aquí mismo:**
- Cuántos formularios se completan
- Tasa de conversión (formularios / visitantes)
- Días/semanas con más conversiones

---

## 🚨 Problemas Comunes y Soluciones

### "No veo datos en Google Analytics"
- **Verificar**: El código GA está en `index.html` ✓ (ya verificado)
- **Verificar**: Tu dominio está autorizado en GA
- **Esperar**: Los datos pueden tardar 24-48 horas en aparecer en reportes históricos
- **Probar**: Ve a "Tiempo real" para ver datos inmediatos

### "Los eventos no aparecen"
- **Verificar**: Abre la consola del navegador (F12) y busca `📊 Analytics Event`
- **Verificar**: Que `window.gtag` esté disponible
- **Esperar**: Los eventos personalizados pueden tardar en aparecer en los reportes

### "No sé qué métricas revisar"
- **Recomendación inicial**: Enfócate en **Conversiones** (form_submission)
- **Luego**: Revisa **cta_click** para ver qué botones funcionan mejor
- **Finalmente**: Analiza **scroll_depth** para mejorar contenido

---

## 📞 Próximos Pasos Recomendados

1. **Esta semana**: Verifica que los eventos lleguen correctamente
2. **Próximas 2 semanas**: Reúne datos base para comparar
3. **Después**: Crea informes personalizados según tus necesidades

---

## 🔗 Enlaces Útiles

- **Dashboard Principal**: https://analytics.google.com
- **Documentación GA4**: https://support.google.com/analytics/answer/9304153
- **Guía de Eventos**: https://support.google.com/analytics/answer/9267735

---

*Última actualización: Basado en la configuración actual de PhotoBoost (ID: G-TWVJ55L63X)*

