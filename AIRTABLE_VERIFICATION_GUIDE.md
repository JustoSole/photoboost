# 🔍 Guía de Verificación de Airtable

Esta guía te ayuda a verificar que todas las conexiones con Airtable funcionen correctamente después de hacer cambios en el proyecto.

## 📋 Checklist Rápido

Antes de hacer cambios importantes o deployar, verifica:

- [ ] Variables de entorno configuradas
- [ ] Conexión con Airtable funciona
- [ ] Campos requeridos existen en la tabla
- [ ] Endpoints pueden crear registros
- [ ] Endpoints pueden actualizar registros

## 🚀 Verificación Automática

### Opción 1: Script Completo (Recomendado)

Ejecuta el script completo de verificación que prueba todo:

```bash
npm run verify-airtable
```

Este script verifica:
1. ✅ Variables de entorno configuradas
2. ✅ Conexión básica con Airtable
3. ✅ Campos en la tabla
4. ✅ Creación de registros (test)
5. ✅ Actualización de registros (test)
6. ✅ Limpieza de registros de prueba

### Opción 2: Test Rápido

Para una verificación rápida de conexión:

```bash
npm run test-airtable
```

## 📝 Variables de Entorno Requeridas

Asegúrate de tener estas variables en tu `.env.local`:

```env
AIRTABLE_API_KEY=tu_api_key_aqui
AIRTABLE_BASE_ID=tu_base_id_aqui
AIRTABLE_TABLE_NAME=Demos  # Opcional, por defecto es "Demos"
```

### Dónde encontrar estos valores:

1. **AIRTABLE_API_KEY**: 
   - Ve a https://airtable.com/create/tokens
   - Crea un token con acceso a tu base
   - Copia el token

2. **AIRTABLE_BASE_ID**:
   - Abre tu base en Airtable
   - Ve a Help → API documentation
   - Copia el "Base ID" (empieza con `app...`)

3. **AIRTABLE_TABLE_NAME**:
   - El nombre exacto de tu tabla (case-sensitive)
   - Por defecto: `Demos`

## 📊 Campos Requeridos en Airtable

Tu tabla debe tener estos campos (los nombres son case-sensitive):

### Campos Básicos (Requeridos)
- `Nombre` - Text
- `Email` - Email (o Text)
- `WhatsApp` - Phone Number (o Text)
- `Estado` - Single select (valores: `procesando`, `completado`, `error`)

### Campos para Register Beta
- `Beta` - Checkbox (boolean)

### Campos para Process Photo
- `Foto_Original_URL` - URL (o Long text)
- `Foto_Procesada_Base64` - Long text (opcional, para imágenes pequeñas)
- `Procesado_At` - Date (opcional)
- `Error_Message` - Long text (opcional)
- `WTP` - Number (opcional)
- `Empresa` - Text (opcional)

### Campos para Update Feedback
- `Le_Gusto` - Single select (opcional)
- `Pagaria` - Single select (opcional)
- `WTP` - Number (opcional)
- `Comentario` - Long text (opcional)

## 🔧 Endpoints que Usan Airtable

### 1. `/api/register-beta`
**Método**: POST  
**Campos que crea**:
- `Nombre`
- `Email`
- `WhatsApp`
- `Beta` (true)
- `Empresa` (opcional)

### 2. `/api/process-photo`
**Método**: POST  
**Campos que crea**:
- `Nombre`
- `Email`
- `WhatsApp`
- `Estado` ('procesando')
- `Foto_Original_URL`
- `WTP` (opcional)
- `Empresa` (opcional)

**Campos que actualiza**:
- `Estado` ('completado' o 'error')
- `Foto_Procesada_Base64` (si la imagen es pequeña)
- `Procesado_At`
- `Error_Message` (si hay error)

### 3. `/api/update-feedback`
**Método**: POST  
**Campos que actualiza**:
- `Le_Gusto`
- `Pagaria`
- `WTP`
- `Comentario`
- `Beta`

## 🧪 Pruebas Manuales

Si prefieres probar manualmente:

### 1. Probar Register Beta

```bash
curl -X POST http://localhost:3000/api/register-beta \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "whatsapp": "+5491112345678",
    "empresa": "Test Company"
  }'
```

### 2. Verificar en Airtable

Abre tu base en Airtable y verifica que:
- El registro se creó correctamente
- Todos los campos tienen los valores esperados
- No hay errores en la consola del servidor

## ⚠️ Errores Comunes

### Error 401: Unauthorized
**Causa**: API Key inválida o sin permisos  
**Solución**: 
- Verifica que el API Key sea correcto
- Asegúrate de que el token tenga acceso a tu base

### Error 404: Not Found
**Causa**: Base ID o nombre de tabla incorrecto  
**Solución**:
- Verifica el Base ID en la documentación de API de Airtable
- Verifica que el nombre de la tabla sea exacto (case-sensitive)

### Error: Campo no encontrado
**Causa**: El campo no existe en Airtable o tiene nombre diferente  
**Solución**:
- Verifica que todos los campos requeridos existan
- Los nombres deben coincidir exactamente (incluyendo mayúsculas/minúsculas)

### Error: Valor inválido para campo
**Causa**: Tipo de dato incorrecto  
**Solución**:
- Verifica que los tipos de campo sean correctos:
  - Checkbox → boolean
  - Number → número
  - Single select → uno de los valores permitidos

## 📈 Monitoreo Continuo

### En Producción (Vercel)

1. **Revisa los logs de Vercel**:
   ```bash
   vercel logs
   ```

2. **Busca errores de Airtable**:
   - Busca por "Airtable error" en los logs
   - Verifica errores 401, 404, o 422

3. **Verifica en Airtable**:
   - Revisa que los registros se estén creando
   - Verifica que los campos se actualicen correctamente

## 🔄 Después de Hacer Cambios

Siempre ejecuta la verificación después de:

- ✅ Cambiar variables de entorno
- ✅ Modificar endpoints de API
- ✅ Cambiar nombres de campos
- ✅ Actualizar estructura de Airtable
- ✅ Deployar a producción

```bash
npm run verify-airtable
```

## 📞 Soporte

Si encuentras problemas:

1. Ejecuta `npm run verify-airtable` y comparte el output
2. Revisa los logs de Vercel para errores específicos
3. Verifica que todos los campos existan en Airtable
4. Compara los nombres de campos con los que se usan en el código

---

**Última actualización**: Después de cambios en el proyecto  
**Script de verificación**: `npm run verify-airtable`

