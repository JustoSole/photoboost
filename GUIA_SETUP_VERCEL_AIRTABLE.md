# 🚀 Guía Completa: Setup Vercel + Airtable para PhotoBoost MVP

## 📋 Resumen del Flujo

```
Usuario sube foto en tu sitio
     ↓
 reloads procesa con Gemini (Vercel Function)
     ↓
 Guarda datos en Airtable
     ↓
 Usuario ve Before/After inmediatamente
     ↓
 Puede agregar comentario libre
     ↓
 Todo queda guardado para seguimiento
```

**Objetivo**: Demo funcional con procesamiento en tiempo real, sin necesidad de backend complejo.

**Tiempo estimado de setup**: 4-6 horas (haciendo todo por primera vez)

---

## 📌 PREREQUISITOS

Antes de empezar, asegurate de tener:

- ✅ Cuenta en Vercel (gratis)
- ✅ Cuenta en Airtable (gratis hasta 1,200 records)
- ✅ Cuenta en Google (para Gemini API key)
- ✅ Tu proyecto React funcionando localmente
- ✅ Gemini API Key (la que ya usás en tu script actual)

---
## PARTE 1: SETUP AIRTABLE (30 minutos)

### Paso 1.1: Crear Base de Datos

1. Entrá a **https://airtable.com**
2. Click en **"Add a base"** o **"Create a base"**
3. Nombrá la base: **"PhotoBoost MVP"**
4. Airtable te crea una tabla por defecto llamada "Table 1"

### Paso 1.: Renombrar Tabla

1. Hacé doble click sobre el nombre "Table 1"
2. Renombrá a: **"Demos"**

### Paso 1.3: Configurar Campos en la Tabla

Tu tabla necesita estos campos (Airtable los crea automáticamente algunos):

#### Campo 1: ID (Ya existe)
- Tipo: Autonumérico
- No necesitás hacer nada, Airtable lo crea solo

#### Campo 2: Email
1. Click en **"Add a field"** (si no hay campos o en el + a la derecha)
2. Nombre: **"Email"**
3. Tipo: **"Email"**
4. Marcar como **"Required"** (obligatorio)

#### Campo 3: WhatsApp
1. **"Add a field"**
2. Nombre: **"WhatsApp"**
3. Tipo: **"Phone number"** (o "Single line text" si no existe)
4. **Opcional** (no marcar required)

#### Campo 4: Empresa
1. **"Add a field"**
2. Nombre: **"Empresa"**
3. Tipo: **"Single line text"**
4. **Opcional**

#### Campo 5: Foto_Original_URL
1. **"Add a field"**
2. Nombre: **"Foto_Original_URL"**
3. Tipo: **"URL"** (o "Single line text")
4. Este campo guardará el link temporal de la foto subida

#### Campo 6: Foto_Procesada_URL
1. **"Add a field"**
2. Nombre: **"Foto_Procesada_URL"**
3. Tipo: **"URL"** (o "Single line text")
4. Este campo guardará el link de la foto procesada por Gemini

#### Campo 7: Foto_Procesada_Base64
1. **"Add a field"**
2. Nombre: **"Foto_Procesada_Base64"**
3. Tipo: **"Long text"** (para guardar datos de imagen si necesitas)

#### Campo 8: Comentario
1. **"Add a field"**
2. Nombre: **"Comentario"**
3. Tipo: **"Long text"**
4. **Opcional**
5. Este es el campo donde los usuarios pueden escribir libremente

#### Campo 9: Le_Gustó
1. **"Add a field"**
2. Nombre: **"Le_Gustó"**
3. Tipo: **"Select"** (o "Single select")
4. Opciones:
   - 😍 Me encantó
   - 👍 Está bien
   - 👎 No me convenció
   - (vacío)

#### Campo 10: Pagaría
1. **"Add a field"**
2. Nombre: **"Pagaría"**
3. Tipo: **"Select"**
4. Opciones:
   - Sí
   - Tal vez
   - No
   - (vacío)

#### Campo 11: WTP (Willingness to Pay)
1. **"Add a field"**
2. Nombre: **"WTP"**
3. Tipo: **"Number"** (formato: Currency, USD)
4. **Opcional**
5. Guardará cuánto están dispuestos a pagar

#### Campo 12: Estado
1. **"Add a field"**
2. Nombre: **"Estado"**
3. Tipo: **"Select"**
4. Opciones:
   - procesando
   - completado
   - error
   - contactado
5. Valor por defecto: **"procesando"**

#### Campo 13: Created_At
1. **"Add a field"**
2. Nombre: **"Created_At"**
3. Tipo: **"Date"** (con hora)
4. Marcar: **"Automatically populate current date and time when a record is created"**

#### Campo 14: Procesado_At
1. **"Add a field"**
2. Nombre: **"Procesado_At"**
3. Tipo: **"Date"** (con hora)
4. **Opcional** - lo llenará tu función cuando termine el procesamiento

#### Campo 15: Error_Message
1. **"Add a field"**
2. Nombre: **"Error_Message"**
3. Tipo: **"Long text"**
4. **Opcional** - para guardar errores si falla el procesamiento

#### Campo 16: Notas_Internas
1. **"Add a field"**
2. Nombre: **"Notas_Internas"**
3. Tipo: **"Long text"**
4. **Opcional** - para que vos agregues notas cuando los contactas

### Paso 1.4: Crear Vistas Útiles

#### Vista "Todos"
- Ya existe por defecto
- Mostrará todos los registros

#### Vista "Pendientes de Contactar"
1. Click en **"Add a view"**
2. Nombre: **"Pendientes de Contactar"**
3. Agregar filtro:
   - Condición: **Estado** = "completado"
   - Y: **Pagaría** = "Sí" o "Tal vez"
   - Y: **Notas_Internas** está vacío
4. Ordenar por: **Created_At** (más antiguos primero)

#### Vista "Necesitan Seguimiento"
1. **"Add a view"**
2. Nombre: **"Necesitan Seguimiento"**
3. Filtro:
   - **Estado** = "error"
   - O: **Le_Gustó** está vacío (después de 2 días)

### Paso 1.5: Obtener API Key y Base ID

**Para conectar tu código con Airtable, necesitás:**

1. Ir a **https://airtable.com/api**
2. Seleccionar tu base "PhotoBoost MVP"
3. Te muestra la documentación de la API
4. En la parte superior, click en **"Show API key"**
5. **Copiá el API key** (empieza con `pat...`)
6. Guardalo en un lugar seguro

7. En la misma página, en la URL verás algo como:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/api/docs
   ```
   El **"appXXXXXXXXXXXXXX"** es tu **Base ID**
8. **Copiá el Base ID** también

**Alternativa más fácil para obtener Base ID:**
1. En tu base de Airtable, click en **"Help"** (arriba a la derecha)
2. Click en **"API documentation"**
3. La URL tiene el Base ID

---

## PARTE 2: SETUP VERCEL FUNCTIONS (1 hora)

### Paso 2.1: Estructura de Carpetas en Tu Proyecto

En tu proyecto React, necesitás crear esta estructura:

```
tu-proyecto/
├── api/
│   └── process-photo.js    (Nueva función serverless)
├── src/
│   └── components/
│       └── PhotoDemo.jsx   (Nuevo componente)
└── ... (resto de tu proyecto)
```

### Paso 2.2: Variables de Entorno en Vercel

1. Andá a **Implémentalo en Vercel**
2. Click en tu proyecto
3. Ir a **Settings** → **Environment Variables**
4. Agregar estas variables:

**Variable 1:**
- Name: `AIRTABLE_API_KEY`
- Value: (pegar el API key que copiaste en Paso 1.5)

**Variable 2:**
- Name: `AIRTABLE_BASE_ID`
- Value: (pegar el Base ID que copiaste en Paso 1.5)

**Variable 3:**
- Name: `GEMINI_API_KEY`
- Value: (tu Gemini API key que ya tenés)

**Variable 4:**
- Name: `AIRTABLE_TABLE_NAME`
- Value: `Demos` (el nombre de tu tabla)

**IMPORTANTE**: Para cada variable, marcar:
- ✅ Production
- ✅ Preview (opcional, pero recomendado)
- ✅ Development (opcional)

5. Click **"Save"** para cada una

### Paso 2.3: Verificar Variables en Código

Cuando escribas tu función (o alguien la escriba), necesitará acceder así:
- `process.env.AIRTABLE_API_KEY`
- `process.env.AIRTABLE_BASE_ID`
- `process.env.GEMINI_API_KEY`
- `process.env.AIRTABLE_TABLE_NAME`

### Paso 2.4: Crear Carpeta API en Vercel

**IMPORTANTE**: Vercel busca funciones serverless en la carpeta `/api` en la raíz del proyecto.

Asegurate de que cuando deployes, la estructura sea:
```
/
├── api/
│   └── process-photo.js
├── src/
└── index.html
```

---

## PARTE 3: FLUJO DEL USUARIO (Diseño UX)

### Paso 3.1: Componente de Upload

Tu componente React debería tener:

1. **Sección 1: Información del Usuario**
   - Campo Email (obligatorio)
   - Campo WhatsApp (opcional)
   - Campo Empresa (opcional)

2. **Sección 2: Upload de Foto**
   - Drag & drop area
   - O botón "Seleccionar archivo"
   - Validación: solo jpg, png, webp
   - Validación: máximo 10MB
   - Preview de la foto antes de procesar

3. **Sección 3: Procesamiento**
   - Botón "Mejorar con IA"
   - Loading spinner durante procesamiento
   - Mensaje: "Procesando con IA... Esto puede tomar 10-20 segundos"
   - Barra de progreso (opcional)

4. **Sección 4: Resultado**
   - Slider Before/After (igual que el Hero actual)
   - Botón descargar foto procesada
   - Botones de feedback rápido:
     - [😍 Me encantó] [👍 Está bien] [👎 No me convenció]

5. **Sección 5: Preguntas de WTP** (solo si click "Me encantó" o "Está bien")
   - "¿Usarías esto para tus propiedades?"
   - [Sí] [Tal vez] [No]
   
   Si responde "Sí" o "Tal vez":
   - "¿Cuánto pagarías por 10 fotos así?"
   - [USD 5] [USD 10] [USD 15] [USD 20] [Otro: _____]

6. **Sección 6: Comentario Libre**
   - Campo de texto grande
   - Placeholder: "¿Algún comentario, sugerencia o pregunta? (opcional)"
   - Botón "Enviar Comentario" (actualiza el registro en Airtable)

### Paso 3.2: Estados del Componente

Tu componente debería manejar estos estados:

- **idle**: Usuario aún no subió foto
- **uploading**: Foto subiendo al servidor
- **processing**: Procesando con Gemini
- **completed**: Mostrando resultado
- **error**: Error durante procesamiento
- **saving_feedback**: Guardando comentario/feedback

---

## PARTE 4: FLUJO TÉCNICO (Cómo Funciona)

### Paso 4.1: Subida de Foto

Cuando el usuario sube una foto:

1. **Frontend** valida:
   - Formato correcto (jpg, png, webp)
   - Tamaño < 10MB
   - Dimensiones razonables (> 500x500px)

2. **Frontend** convierte foto a base64 o FormData
3. **Frontend** envía POST request a `/api/process-photo` con:
   - Foto (base64 o file)
   - Email
   - WhatsApp (si lo completó)
   - Empresa (si la completó)

### Paso 4.2: Procesamiento (Vercel Function)

Tu función `/api/process-photo` hace esto:

1. **Validar datos recibidos**
   - Verificar que llegó foto
   - Verificar email

2. **Crear registro en Airtable** (ANTES de procesar)
   - Usar API de Airtable
   - Crear registro con:
     - Email
     - WhatsApp (si existe)
     - Empresa (si existe)
     - Foto_Original_URL (link temporal o base64)
     - Estado: "procesando"
     - Created_At: automático
   
   **Guardar el ID del registro** que devuelve Airtable

3. **Procesar con Gemini**
   - Convertir foto a formato que Gemini acepta
   - Llamar a Gemini API con tu prompt actual
   - Recibir foto procesada

4. **Subir foto procesada a algún storage**
   - Opción A: Convertir a base64 y guardar en Airtable (campo Long text)
   - Opción B: Subir a Vercel Blob Storage
   - Opción C: Subir a Cloudinary (tiene tier gratis)
   - Opción D: Usar Airtable Attachments (más complejo)

   **IMPORTANTE**: Guardar la URL de la foto procesada

5. **Actualizar registro en Airtable**
   - Con el ID que guardaste
   - Actualizar:
     - Foto_Procesada_URL: URL de la foto procesada
     - Estado: "completado"
     - Procesado_At: timestamp actual

6. **Devolver respuesta al frontend**
   - Foto procesada (base64 o URL)
   - ID del registro en Airtable
   - Estado: success

### Paso 4.3: Feedback del Usuario

Cuando el usuario completa el feedback:

1. **Frontend** envía POST a `/api/update-feedback` (otra función) con:
   - ID del registro (que recibió antes)
   - Le_Gustó (valor seleccionado)
   - Pagaría (si lo respondió)
   - WTP (si lo ingresó)
   - Comentario (texto libre)

2. **Vercel Function `/api/update-feedback`**:
   - Llama a API de Airtable
   - Actualiza el registro con todos los campos nuevos

3. **Frontend** muestra mensaje: "¡Gracias por tu feedback!"

---

## PARTE 5: CONFIGURAR AIRTABLE API (Referencia)

### Cómo Crear un Registro

**Endpoint:**
```
POST https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}
```

**Headers:**
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Body:**
```json
{
  "fields": {
    "Email": "usuario@ejemplo.com",
    "WhatsApp": "+5491123456789",
    "Empresa": "Inmobiliaria SA",
    "Estado": "procesando",
    "Foto_Original_URL": "https://..."
  }
}
```

**Respuesta:**
```json
{
  "id": "recXXXXXXXXXXXXXX",
  "fields": { ... }
}
```

**Guardá el ID** para actualizar después.

### Cómo Actualizar un Registro

**Endpoint:**
```
PATCH https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}/{RECORD_ID}
```

**Headers:**
```
Authorization: Bearer {API_KEY}
Content-Type: application/json
```

**Body:**
```json
{
  "fields": {
    "Estado": "completado",
    "Foto_Procesada_URL": "https://...",
    "Le_Gustó": "😍 Me encantó",
    "Comentario": "Excelente servicio!"
  }
}
```

---

## PARTE 6: STORAGE PARA FOTOS (Opciones)

### Opción 1: Base64 en Airtable (MÁS SIMPLE)

**Pros:**
- ✅ No necesitas otro servicio
- ✅ Setup inmediato
- ✅ Las fotos están con el registro

**Contras:**
- ❌ Airtable tiene límite de 10MB por campo
- ❌ Puede ser lento para fotos grandes
- ❌ Limitado en escala

**Cuándo usar**: MVP inicial, menos de 100 fotos/mes

## PARTE 7: SEGUIMIENTO Y MÉTRICAS

### Paso 7.1: Dashboard en Airtable

Una vez que tengas datos, podés crear vistas con:

**Vista "Métricas Diarias"**
- Contar registros por día
- Agrupar por estado
- Ver tasa de éxito (completado vs error)

**Vista "WTP Analysis"**
- Agrupar por rango de WTP
- Ver promedio por segmento
- Filtrar por "Le_Gustó" = "Me encantó"

**Vista "Para Contactar"**
- Ver quién dijo que pagaría pero aún no contactaste
- Ordenar por WTP descendente

### Paso 7.2: Exportar Datos

Airtable permite exportar a CSV/Excel:
1. Seleccionar vista
2. Click en ... (tres puntos)
3. "Export records"
4. Elegir formato

### Paso 7.3: Integraciones Útiles

**Zapier/Make para automatizar:**

**Automatización 1: Email cuando se complete**
- Trigger: Nuevo registro con Estado = "completado"
- Action: Enviar email al usuario con link de descarga

**Automatización 2: Notificación para ti**
- Trigger: Nuevo registro con Pagaría = "Sí"
- Action: Email/WhatsApp a vos: "Nuevo lead calificado"

**Automatización 3: Follow-up automático**
- Trigger: Registro con Estado = "completado" hace 2 días
- Condición: Le_Gustó está vacío
- Action: Email recordatorio pidiendo feedback

---

## PARTE 8: TESTING Y VALIDACIÓN

### Paso 8.1: Testing Local

1. **Probar upload de foto**
   - Subir foto válida
   - Verificar que se crea registro en Airtable

2. **Probar procesamiento**
   - Verificar que Gemini procesa correctamente
   - Verificar que se actualiza el registro

3. **Probar feedback**
   - Completar todos los campos
   - Verificar que se guarda en Airtable

4. **Probar casos de error**
   - Foto muy grande
   - Foto formato inválido
   - Gemini API key inválida
   - Airtable API key inválida

### Paso 8.Par 2: Testing con Usuarios Reales

**Primeros 5 usuarios:**
- Invitalos personalmente
- Observa su experiencia
- Pregunta qué cambiarían

**Próximos 10 usuarios:**
- Dejalos probar solos
- Monitorea errores en Airtable
- Revisa feedback

**Ajustes necesarios:**
- Si hay muchos errores → revisar validaciones
- Si no completan feedback → simplificar preguntas
- Si no ven resultados → mejorar UX del loading

---

## PARTE 9: CHECKLIST FINAL

### Antes de Lanzar

- [ ] Airtable base creada con todos los campos
- [ ] API Key y Base ID guardados seguros
- [ ] Variables de entorno configuradas en Vercel
- [ ] Función `/api/process-photo` deployada y testeada
- [ ] Función `/api/update-feedback` deployada y testeada
- [ ] Componente React funcionando localmente
- [ ] Testeado end-to-end (subir foto → ver resultado → dar feedback)
- [ ] Manejo de errores implementado
- [ ] Loading states funcionando
- [ ] Validaciones de archivo funcionando
- [ ] Preview de Before/After funcionando
- [ ] Descarga de foto funcionando

### Después de Lanzar

- [ ] Monitorear Airtable diariamente
- [ ] Revisar registros con error
- [ ] Contactar a usuarios que dieron feedback positivo
- [ ] Analizar WTP por segmento
- [ ] Ajustar pricing según datos
- [ ] Optimizar prompt de Gemini según feedback

---

## PARTE 10: RECURSOS Y ENLACES ÚTILES

### Documentación Oficial

**Airtable API:**
- https://airtable.com/api
- https://airtable.com/developers/web/api/introduction

**Vercel Functions:**
- https://vercel.com/docs/functions
- https://vercel.com/docs/functions/serverless-functions

**Gemini API:**
- https://ai.google.dev/docs
- Tu script actual ya tiene el formato correcto

### Herramientas Recomendadas

**Testing APIs:**
- https://insomnia.rest (para probar Airtable API)
- https://www.postman.com (alternativa)

**Monitoring:**
- Airtable activity log (ver cambios en tiempo real)
- Vercel Function logs (ver errores)

**Automatizaciones:**
- https://zapier.com (gratis hasta 100 tareas/mes)
- https://www.make.com (alternativa gratis)

---

## 💡 CONSEJOS FINALES

### KISS (Keep It Simple, Stupid)

- Empezá con Base64 en Airtable para fotos (más simple)
- No sobre-optimices al inicio
- Hacé que funcione primero, optimizá después

### Iteración Rápida

- Si algo no funciona, simplificá
- No necesitás todas las features desde día 1
- Agregá funcionalidades según feedback real

### Datos, Datos, Datos

- Guardá TODO lo que puedas
- No sabés qué métrica será importante después
- Exportá regularmente a CSV (backup)

### Comunicación Clara

- Mensajes de error claros para usuarios
- Loading states informativos
- Confirmaciones cuando se guarda feedback

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Necesito pagar por Airtable?**
R: No para MVP. El plan gratis alcanza para 1,200 registros. Cuando crezcas, podés upgrade.

**P: ¿Qué pasa si supero los límites de Vercel gratis?**
R: Vercel tiene tier gratuito generoso (100GB funciones/mes). Si superas, podés upgrade a Pro ($20/mes) o optimizar el código.

**P: ¿Las fotos se guardan para siempre?**
R: Depende del storage que uses. Recomendado: implementar limpieza automática después de 30 días para ahorrar espacio.

**P: ¿Puedo agregar más campos después?**
R: Sí, Airtable permite agregar campos en cualquier momento. Solo asegurate de que tu código maneje campos opcionales.

**P: ¿Qué hago si el procesamiento falla?**
R: El registro queda en Airtable con Estado="error". Podés crear vista de errores y procesarlos manualmente o re-intentar.

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DEL SETUP

Una vez que tengas el flujo funcionando:

1. **Optimizar procesamiento**
   - Cachear resultados similares
   - Comprimir imágenes antes de Gemini
   - Paralelizar múltiples fotos

2. **Mejorar UX**
   - Agregar más opciones de feedback
   - Mejorar visualización Before/After
   - Agregar zoom en fotos

3. **Automatizar seguimiento**
   - Emails automáticos de follow-up
   - Notificaciones de nuevos leads calificados
   - Dashboard de métricas en tiempo real

4. **Escalar**
   - Cuando tengas >50 usuarios/día
   - Considerar migrar a Supabase
   - Implementar queue system para procesamiento

---

**¡Listo! Con esta guía deberías poder setup el flujo completo. Si tenés dudas en algún paso específico, podés preguntar.**

