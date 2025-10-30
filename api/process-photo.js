/**
 * Vercel Serverless Function: Procesa foto con Gemini y guarda en Airtable
 * Endpoint: /api/process-photo
 * Method: POST
 */

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const GEMINI_MODEL = 'gemini-2.5-flash-image';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_IMAGE_SIZE = 7 * 1024 * 1024; // 7MB

// Prompt optimizado (igual que el script local)
const ENHANCEMENT_PROMPT = `You are an expert professional photographer specializing in real estate photography.

Your mission: Transform this photo into a magazine-quality real estate image while keeping it realistic and natural-looking.

### CRITICAL RULES (NEVER BREAK):
- Keep the EXACT same dimensions, framing, and angle
- Do NOT crop, resize, or change perspective
- Do NOT add or remove any elements
- Make it look like it was taken by a professional photographer with perfect lighting

### MAIN IMPROVEMENTS:

**Lighting & Exposure:**
- Brighten dark areas to reveal hidden details
- Balance bright spots and shadows for natural look
- Create even, professional lighting throughout
- Fix overexposed or underexposed areas

**Sky (If visible):**
- Make the sky clear, bright blue, and realistic
- Remove gray or dull skies - make them pop naturally
- Keep it looking like a beautiful sunny day
- NEVER make the sky look fake or oversaturated

**Vegetation (If outdoors):**
- Enhance existing vegetation naturally based on what's already in the photo
- Make greens richer and more vibrant but realistic
- Improve grass, trees, bushes, and plants that are already visible
- Keep it natural - don't add vegetation that wasn't there
- Make landscaping look healthy and well-maintained

**Colors & Details:**
- Enhance colors to look vibrant but natural
- Boost warm tones on wood and surfaces
- Sharpen architectural details and textures
- Make the property look its absolute best

**Overall Look:**
- Interior shots: Warm, inviting, bright, and spacious feeling
- Exterior shots: Dramatic, clear sky, vibrant landscaping, professional real estate look
- Balance everything so it looks professionally shot, not artificially edited

### Remember:
This should look like a top-tier real estate photographer took this photo on the perfect day with perfect equipment. Natural, beautiful, and professional - not overprocessed or fake.`;

/**
 * Calcular aspect ratio más cercano soportado por Gemini
 */
function getBestAspectRatio(width, height) {
  const supportedRatios = [
    { ratio: '1:1', value: 1.0 },
    { ratio: '2:3', value: 2/3 },
    { ratio: '3:2', value: 3/2 },
    { ratio: '3:4', value: 3/4 },
    { ratio: '4:3', value: 4/3 },
    { ratio: '4:5', value: 4/5 },
    { ratio: '5:4', value: 5/4 },
    { ratio: '9:16', value: 9/16 },
    { ratio: '16:9', value: 16/9 },
    { ratio: '21:9', value: 21/9 }
  ];
  
  const imageRatio = width / height;
  let bestMatch = supportedRatios[0];
  let minDifference = Math.abs(imageRatio - bestMatch.value);
  
  for (const supported of supportedRatios) {
    const difference = Math.abs(imageRatio - supported.value);
    if (difference < minDifference) {
      minDifference = difference;
      bestMatch = supported;
    }
  }
  
  return bestMatch.ratio;
}

/**
 * Crear registro en Airtable
 */
async function createAirtableRecord(name, whatsapp, email, empresa, fotoOriginalURL, wtp) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Demos';
  const apiKey = process.env.AIRTABLE_API_KEY;
  
  const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}`;
  
  // Email es el campo principal en Airtable
  // Si no hay email, usar un placeholder con el nombre
  const emailToUse = (email && email.trim()) 
    ? email.trim() 
    : `${name.trim().replace(/\s+/g, '_').toLowerCase()}@placeholder.local`;
  
  const fields = {
    Nombre: name.trim(), // Campo nombre agregado
    Email: emailToUse, // Email es el campo principal
    WhatsApp: whatsapp.trim(),
    Estado: 'procesando'
  };
  
  if (empresa && empresa.trim()) fields.Empresa = empresa.trim();
  if (fotoOriginalURL) fields.Foto_Original_URL = fotoOriginalURL;
  if (wtp && wtp.trim()) fields.WTP = wtp.trim();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Airtable error: ${error.error?.message || 'Unknown error'}`);
  }
  
  return await response.json();
}

/**
 * Actualizar registro en Airtable
 */
async function updateAirtableRecord(recordId, updates) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Demos';
  const apiKey = process.env.AIRTABLE_API_KEY;
  
  const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}/${recordId}`;
  
  // Logging detallado para debugging
  console.log(`🔧 [updateAirtableRecord] Actualizando registro ${recordId}`);
  console.log(`📦 Campos a actualizar:`, Object.keys(updates));
  
  // Validar tamaño de campos antes de enviar (Airtable tiene límites)
  const filteredUpdates = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined) {
      console.log(`⏭️  Saltando campo ${key} (null/undefined)`);
      continue;
    }
    
    // Para campos de texto largo (como base64), validar tamaño
    // Airtable generalmente limita campos de texto a ~100k caracteres
    if (typeof value === 'string' && value.length > 100000) {
      console.log(`⚠️  Campo ${key} es muy grande (${(value.length / 1024).toFixed(2)}KB), omitiendo...`);
      filteredUpdates[key] = `[Datos demasiado grandes: ${(value.length / 1024 / 1024).toFixed(2)}MB - Omitido]`;
    } else {
      filteredUpdates[key] = value;
    }
  }
  
  console.log(`✅ Campos filtrados:`, Object.keys(filteredUpdates));
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: filteredUpdates })
  });
  
  if (!response.ok) {
    let errorMessage = 'Unknown error';
    let errorDetails = null;
    
    try {
      const errorData = await response.json();
      errorDetails = errorData;
      errorMessage = errorData.error?.message || errorData.error?.type || JSON.stringify(errorData);
      
      console.error(`❌ [updateAirtableRecord] Error detallado:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: url,
        fieldsAttempted: Object.keys(filteredUpdates),
        updatesPreview: Object.fromEntries(
          Object.entries(filteredUpdates).map(([k, v]) => [
            k, 
            typeof v === 'string' ? `${v.substring(0, 50)}...` : v
          ])
        )
      });
    } catch (parseError) {
      const errorText = await response.text();
      errorMessage = `HTTP ${response.status}: ${errorText || response.statusText}`;
      console.error(`❌ [updateAirtableRecord] Error sin JSON:`, errorMessage);
    }
    
    throw new Error(`Airtable error: ${errorMessage}`);
  }
  
  const result = await response.json();
  console.log(`✅ [updateAirtableRecord] Registro actualizado exitosamente`);
  return result;
}

/**
 * Procesar imagen con Gemini
 */
async function processWithGemini(imageBase64, mimeType) {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY o GEMINI_API_KEY no configurada');
  }
  
  // Decodificar base64 para obtener dimensiones aproximadas
  // Nota: En un caso real, podríamos leer metadata del buffer
  // Para MVP, usamos ratio estándar
  const aspectRatio = '4:3'; // Default, Gemini ajustará si es necesario
  
  const requestBody = {
    contents: [{
      parts: [
        { text: ENHANCEMENT_PROMPT },
        { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } }
      ]
    }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: aspectRatio
      }
    }
  };
  
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error?.message || errorText;
    } catch {
      errorMessage = errorText;
    }
    throw new Error(`Gemini API Error ${response.status}: ${errorMessage}`);
  }
  
  const result = await response.json();
  
  if (!result.candidates || result.candidates.length === 0) {
    throw new Error('No se recibió respuesta válida del modelo');
  }
  
  if (result.candidates[0].finishReason && result.candidates[0].finishReason !== 'STOP') {
    throw new Error(`El modelo terminó inesperadamente: ${result.candidates[0].finishReason}`);
  }
  
  const parts = result.candidates[0].content?.parts;
  if (!parts || parts.length === 0) {
    throw new Error('No se encontraron partes en la respuesta');
  }
  
  const imagePart = parts.find(p => p.inlineData || p.inline_data);
  if (!imagePart) {
    throw new Error('No se recibió imagen en la respuesta');
  }
  
  const imageDataField = imagePart.inlineData || imagePart.inline_data;
  if (!imageDataField || !imageDataField.data) {
    throw new Error('Datos de imagen vacíos en la respuesta');
  }
  
  return imageDataField.data; // Base64 de la imagen procesada
}

export default async function handler(req, res) {
  // Cargar variables de entorno en desarrollo local (si no están disponibles)
  if (process.env.NODE_ENV !== 'production' && !process.env.AIRTABLE_API_KEY) {
    try {
      const dotenv = await import('dotenv');
      const { fileURLToPath } = await import('url');
      const { dirname, join } = await import('path');
      const { existsSync } = await import('fs');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const envPath = join(__dirname, '..', '.env.local');
      
      if (existsSync(envPath)) {
        dotenv.config({ path: envPath });
        console.log('📝 [process-photo] Variables cargadas desde .env.local');
      }
    } catch (e) {
      console.log('⚠️ [process-photo] No se pudieron cargar variables desde .env.local:', e.message);
    }
  }
  
  // Logging inicial para debugging
  console.log('🔵 [process-photo] ===== FUNCIÓN EJECUTADA =====');
  console.log('📥 Request recibido:', {
    method: req.method,
    url: req.url,
    path: req.url,
    headers: {
      host: req.headers.host,
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      origin: req.headers.origin,
      referer: req.headers.referer
    },
    hasBody: !!req.body,
    bodyType: typeof req.body,
    bodyKeys: req.body ? Object.keys(req.body) : null,
    timestamp: new Date().toISOString()
  });
  
  // Solo permitir POST
  if (req.method !== 'POST') {
    console.log('❌ [process-photo] Method not allowed:', req.method);
    console.log('💡 Solo se permite POST, pero se recibió:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      received: req.method,
      allowed: 'POST'
    });
  }
  
  let recordId = null;
  
  try {
    console.log('✅ [process-photo] Validando variables de entorno...');
    console.log('🔍 [process-photo] Variables disponibles:', {
      hasAIRTABLE_API_KEY: !!process.env.AIRTABLE_API_KEY,
      hasAIRTABLE_BASE_ID: !!process.env.AIRTABLE_BASE_ID,
      hasAIRTABLE_TABLE_NAME: !!process.env.AIRTABLE_TABLE_NAME,
      hasGOOGLE_AI_API_KEY: !!process.env.GOOGLE_AI_API_KEY,
      hasGEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Validar variables de entorno
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      const missing = [];
      if (!process.env.AIRTABLE_API_KEY) missing.push('AIRTABLE_API_KEY');
      if (!process.env.AIRTABLE_BASE_ID) missing.push('AIRTABLE_BASE_ID');
      console.error('❌ [process-photo] Variables faltantes:', missing);
      throw new Error(`Variables de entorno de Airtable no configuradas: ${missing.join(', ')}`);
    }
    
    if (!process.env.GOOGLE_AI_API_KEY && !process.env.GEMINI_API_KEY) {
      throw new Error('API Key de Gemini no configurada');
    }
    
    // Extraer datos del request
    const { name, whatsapp, email, empresa, image, wtp } = req.body;
    
    console.log('📦 [process-photo] Datos recibidos:', {
      hasName: !!name,
      hasWhatsapp: !!whatsapp,
      hasEmail: !!email,
      hasEmpresa: !!empresa,
      hasImage: !!image,
      hasWtp: !!wtp,
      imageLength: image ? image.length : 0
    });
    
    // Validar datos requeridos
    if (!name || !whatsapp || !image) {
      console.log('❌ [process-photo] Datos faltantes:', { name: !name, whatsapp: !whatsapp, image: !image });
      return res.status(400).json({ 
        error: 'Nombre, WhatsApp e imagen son requeridos',
        required: { name: !name ? 'requerido' : 'ok', whatsapp: !whatsapp ? 'requerido' : 'ok', image: !image ? 'requerido' : 'ok' }
      });
    }
    
    // Validar formato de email si está presente
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }
    }
    
    // La imagen viene en base64, extraer data si viene con prefijo data:image/...
    let imageBase64 = image;
    let mimeType = 'image/jpeg';
    
    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        imageBase64 = matches[2];
      }
    }
    
    // Validar tamaño aproximado (base64 es ~33% más grande)
    const estimatedSize = (imageBase64.length * 3) / 4;
    if (estimatedSize > MAX_IMAGE_SIZE) {
      return res.status(400).json({ 
        error: `Imagen demasiado grande: ${(estimatedSize / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 7MB` 
      });
    }
    
    // Crear URL temporal (para guardar en Airtable)
    // En producción, podrías subir a un storage temporal aquí
    const fotoOriginalURL = `data:${mimeType};base64,${imageBase64}`.substring(0, 200) + '...';
    
    // PASO 1: Crear registro en Airtable con estado "procesando"
    console.log('📝 Creando registro en Airtable...');
    const airtableRecord = await createAirtableRecord(name, whatsapp, email, empresa, fotoOriginalURL, wtp);
    recordId = airtableRecord.id;
    
    console.log(`✅ Registro creado: ${recordId}`);
    
    // PASO 2: Procesar con Gemini
    console.log('🤖 Procesando con Gemini...');
    const processedImageBase64 = await processWithGemini(imageBase64, mimeType);
    
    console.log('✅ Imagen procesada exitosamente');
    
    // PASO 3: Actualizar registro en Airtable
    console.log('💾 Actualizando registro en Airtable...');
    console.log(`📏 Tamaño de imagen procesada: ${(processedImageBase64.length / 1024).toFixed(2)}KB de base64`);
    
    // Preparar campos para actualizar
    // NOTA: Airtable tiene límites en campos de texto (~100k chars)
    // Las imágenes base64 pueden exceder esto fácilmente
    const updateFields = {
      Estado: 'completado'
    };
    
    // Solo agregar base64 si es razonablemente pequeño (< 100KB de base64)
    if (processedImageBase64.length < 100000) {
      updateFields.Foto_Procesada_Base64 = processedImageBase64;
      console.log(`✅ Base64 agregado (${(processedImageBase64.length / 1024).toFixed(2)}KB)`);
    } else {
      console.log(`⚠️  Imagen procesada demasiado grande (${(processedImageBase64.length / 1024 / 1024).toFixed(2)}MB), omitiendo base64`);
      updateFields.Foto_Procesada_Base64 = `[Imagen procesada - ${(processedImageBase64.length / 1024 / 1024).toFixed(2)}MB - Base64 demasiado grande para almacenar]`;
    }
    
    // Procesado_At: intentar agregar, pero no fallar si el campo no existe
    // Muchos setup de Airtable no tienen Make_FIELD_NAME esto automáticamente
    try {
      updateFields.Procesado_At = new Date().toISOString();
    } catch (e) {
      console.log('⚠️  No se pudo agregar Procesado_At (ignorado):', e.message);
    }
    
    await updateAirtableRecord(recordId, updateFields);
    
    console.log('✅ Registro actualizado');
    
    // PASO 4: Devolver respuesta al frontend
    return res.status(200).json({
      success: true,
      recordId: recordId,
      processedImage: processedImageBase64,
      message: 'Foto procesada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en process-photo:', error);
    
    // Si ya creamos el registro, actualizarlo con error
    if (recordId) {
      try {
        await updateAirtableRecord(recordId, {
          Estado: 'error',
          Error_Message: error.message || 'Error desconocido'
        });
      } catch (updateError) {
        console.error('Error actualizando registro con error:', updateError);
      }
    }
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor',
      recordId: recordId // Para que el frontend pueda intentar actualizar el feedback
    });
  }
}

