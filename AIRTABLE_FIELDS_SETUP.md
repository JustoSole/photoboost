# 📊 Configuración de Campos en Airtable

Este documento lista todos los campos que deben existir en tu tabla de Airtable para que todos los endpoints funcionen correctamente.

## 📋 Tabla: `Demos` (o el nombre que configuraste)

> **✅ ACTUALIZACIÓN**: Esta documentación refleja la estructura real de tu tabla en Airtable.

### ✅ Campos Básicos (Requeridos)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `Nombre` | Text | ✅ Sí | Nombre del usuario |
| `Email` | Text (campo principal) | ✅ Sí | Email del usuario |
| `WhatsApp` | Text | ✅ Sí | WhatsApp del usuario |
| `Estado` | Single select | ✅ Sí | Estados: `procesando`, `completado`, `error`, `contactado` |
| `Beta` | Checkbox | ✅ Sí | Si está en la beta |
| `Foto_Original_URL` | Text | ✅ Sí | URL de la foto original |
| `Foto_Procesada_Base64` | Long text | ✅ Sí | Base64 de la foto procesada |
| `Procesado_At` | Date | ✅ Sí | Fecha de procesamiento |
| `Created_At` | Date (calculado) | ✅ Sí | Fecha de creación automática |

### ✅ Campos de Feedback (Ya Configurados Correctamente)

| Campo | Tipo | Requerido | Opciones/Valores | Descripción |
|-------|------|-----------|-----------------|-------------|
| `WTP` | Number (moneda) | No | - | "Willing to Pay" - Cuánto pagaría |
| `Error_Message` | Long text | No | - | Mensaje de error si falla el procesamiento |
| `Le_Gusto` | Single select | No | `😍 Me encantó`, `👍 Está bien`, `👎 No me convenció` | Si le gustó el resultado |
| `Pagaria` | Single select | No | `Sí`, `Tal vez`, `No`, `(vacío)` | Si pagaría por el servicio |
| `Comentario` | Long text | No | - | Comentario del usuario |

### 📝 Campos Opcionales

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `Empresa` | Text | No | Nombre de la empresa |
| `ID` | Number | No | Campo de identificación interno |
| `Foto_Procesada_URL` | Text | No | URL de la foto procesada (no usado actualmente por el código) |
| `Notas_Internas` | Long text | No | Notas internas para tu uso |

## 🔧 Cómo Agregar los Campos Faltantes

> **✅ NOTA**: Según la estructura que compartiste, **TODOS los campos ya existen** en tu tabla. Esta sección es solo informativa sobre los valores correctos.

### 1. Verificar estructura actual

Tu tabla ya tiene todos los campos necesarios. Solo asegúrate de que las opciones de los campos select sean exactamente:

### 2. Verificar opciones de campos select

#### Campo: `WTP`
- Tipo: **Number** (formato moneda)
- Formato: Decimal (2 decimales opcional)
- Descripción: Cuánto pagaría el usuario
- **Estado**: ✅ Ya existe en tu tabla

#### Campo: `Error_Message`
- Tipo: **Long text**
- Descripción: Mensaje de error si algo falla
- **Estado**: ✅ Ya existe en tu tabla

#### Campo: `Le_Gusto`
- Tipo: **Single select**
- Opciones:
  - `😍 Me encantó`
  - `👍 Está bien`
  - `👎 No me convenció`
- Descripción: Si al usuario le gustó el resultado
- **IMPORTANTE**: El frontend ya usa estos valores exactos con emojis

#### Campo: `Pagaria`
- Tipo: **Single select**
- Opciones:
  - `Sí`
  - `Tal vez`
  - `No`
  - `(vacío)` (opción por defecto)
- Descripción: Si el usuario pagaría por el servicio
- **IMPORTANTE**: El frontend ya usa estos valores exactos

#### Campo: `Comentario`
- Tipo: **Long text**
- Descripción: Comentarios adicionales del usuario
- **Estado**: ✅ Ya existe en tu tabla

### 3. Verificar que las opciones sean exactas

**IMPORTANTE**: Los nombres de los campos y sus valores son **case-sensitive** y deben ser exactos:

**Nombres de campos**:
- `Le_Gusto` (no `le_gusto` ni `Le_Gusto`)
- `Pagaria` (no `pagaria` ni `Pagaría`)
- `WTP` (todo mayúsculas)
- `Error_Message` (con guión bajo y mayúsculas)
- `Comentario` (primera letra mayúscula)

**Valores de `Le_Gusto`** (deben ser exactamente):
- `😍 Me encantó`
- `👍 Está bien`
- `👎 No me convenció`

**Valores de `Pagaria`** (deben ser exactamente):
- `Sí`
- `Tal vez`
- `No`
- `(vacío)` (opción por defecto)

**Valores de `Estado`**:
- `procesando`
- `completado`
- `error`
- `contactado`

## ✅ Verificación

Después de agregar los campos, ejecuta:

```bash
npm run verify-airtable
```

El script debería mostrar que todos los campos están presentes.

## 📊 Resumen de Endpoints y Campos

### `/api/register-beta`
**Crea campos**:
- `Nombre`
- `Email`
- `WhatsApp`
- `Beta` (true)
- `Empresa` (opcional)

### `/api/process-photo`
**Crea campos**:
- `Nombre`
- `Email`
- `WhatsApp`
- `Estado` ('procesando')
- `Foto_Original_URL`
- `WTP` (opcional)
- `Empresa` (opcional)

**Actualiza campos**:
- `Estado` ('completado' o 'error')
- `Foto_Procesada_Base64` (si la imagen es pequeña < 100KB)
- `Procesado_At` (fecha ISO)
- `Error_Message` (si hay error)

### `/api/update-feedback`
**Actualiza campos**:
- `Le_Gusto`
- `Pagaria`
- `WTP`
- `Comentario`
- `Beta`

## 🎯 Quick Setup Script

Si quieres, puedes crear los campos manualmente usando la interfaz de Airtable, o usar la API. El script de verificación te dirá cuáles faltan.

---

**Última verificación**: Ejecuta `npm run verify-airtable` para confirmar que todo está configurado correctamente.

