# 🔧 Configuración de Google Sheets para Capturar Leads

Este documento explica cómo configurar Google Sheets para recibir los datos del formulario automáticamente.

## Pasos de Configuración

### 1. Crear Google Sheet

1. Andá a [Google Sheets](https://sheets.google.com)
2. Creá un nuevo documento
3. En la primera fila, agregá estos encabezados:

```
Timestamp | Nombre | Email | WhatsApp | NombreArchivo
```

4. Renombrá el archivo como "PhotoBoost Leads"
5. Copiá la URL del documento (será algo como: `https://docs.google.com/spreadsheets/d/ABC123/edit`)

### 2. Obtener ID del Spreadsheet

De la URL copiada, extraé el ID entre `/d/` y `/edit`:
```
https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_ID]/edit
```

Ejemplo: Si tu URL es `https://docs.google.com/spreadsheets/d/1aBcD3eF4gH5iJ6kL7mN8oP9qRsTuVwX/edit`
Tu ID es: `1aBcD3eF4gH5iJ6kL7mN8oP9qRsTuVwX`

### 3. Configurar Google Apps Script

1. En tu Google Sheet, click en **Extensiones** → **Apps Script**
2. Se abrirá un editor de código
3. Reemplazá TODO el contenido con este código:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('TU_SPREADSHEET_ID_AQUI').getActiveSheet();
    
    // Verificar si los encabezados existen
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Nombre', 'Email', 'WhatsApp', 'NombreArchivo']);
    }
    
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Agregar timestamp
    const timestamp = new Date();
    
    // Agregar fila con los datos
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.fileName || ''
    ]);
    
    // Enviar confirmación
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Datos guardados correctamente' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('PhotoBoost Leads API está funcionando');
}
```

4. **Reemplazá** `'TU_SPREADSHEET_ID_AQUI'` con el ID que copiaste en el paso 2

### 4. Desplegar como Web App

1. En el editor de Apps Script, click en **Desplegar** → **Nueva implementación**
2. Configurá:
   - **Tipo**: Aplicación web
   - **Nombre**: `PhotoBoost Leads Webhook`
   - **Descripción**: `API para recibir leads de PhotoBoost`
   - **Ejecutar como**: Yo (tu email)
   - **Acceso**: Todos (incluidos usuarios no autenticados)
3. Click en **Desplegar**
4. **Copiá la URL del servicio web** que se genera

### 5. Actualizar Código de la App

1. Agregá la URL del webhook al archivo `.env.local`:
```bash
VITE_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/s/ABC.../exec
```

2. **⚠️ Importante**: Cada vez que hagas cambios en el script de Apps Script, necesitás crear una **nueva implementación** (no actualizar la existente) para que los cambios se apliquen.

### 6. Probar

1. Abrí la URL del webhook en tu navegador
2. Debería decir: "PhotoBoost Leads API está funcionando"
3. Llená el formulario en tu app y verificá que los datos aparezcan en Google Sheets

## Estructura de Datos

El formulario enviará estos campos:

```javascript
{
  name: "Juan Pérez",
  email: "juan@inmobiliaria.com",
  phone: "+54 9 11 1234-5678",
  fileName: "foto-propiedad.jpg"
}
```

## Troubleshooting

### Los datos no se guardan

- Verificá que la implementación del web app tenga acceso "Todos (incluidos usuarios no autenticados)"
- Confirmá que el Spreadsheet ID es correcto
- Revisá la consola del navegador para ver errores

### Error 403 Forbidden

- Asegurate de compartir el Google Sheet con permisos de lectura/escritura para "cualquier persona con el enlace"

### El script no se actualiza

- Tenés que crear una **nueva implementación** cada vez que modifiques el código del script

## Seguridad

- Por ahora es simple y funcional para validación beta
- Para producción, considerá agregar:
  - Validación de tokens
  - Rate limiting
  - Backup automático de datos

---

**¿Necesitás ayuda?** Revisá la consola del navegador o los logs de Apps Script en el Editor.

