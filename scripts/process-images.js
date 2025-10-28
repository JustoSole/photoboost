import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const BEFORE_DIR = path.join(__dirname, '../public/demo-properties/before');
const AFTER_DIR = path.join(__dirname, '../public/demo-properties/after');
const LOG_DIR = path.join(__dirname, '../logs');
const MODEL = 'gemini-2.5-flash-image';  // Modelo estable de edición de imágenes
const MAX_IMAGE_SIZE = 7 * 1024 * 1024;  // 7MB límite máximo según documentación
const BATCH_SIZE = 3;  // Procesar en lotes para control de tasa
const RATE_LIMIT_DELAY = 2000;  // 2 segundos entre requests
const MAX_RETRIES = 3;  // Reintentos en caso de error temporal

// Prompt optimizado: CORE enhancement preservando dimensiones
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

// Función para calcular el aspect ratio más cercano soportado por Gemini
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
  
  // Encontrar el ratio más cercano
  let bestMatch = supportedRatios[0];
  let minDifference = Math.abs(imageRatio - bestMatch.value);
  
  for (const supported of supportedRatios) {
    const difference = Math.abs(imageRatio - supported.value);
    if (difference < minDifference) {
      minDifference = difference;
      bestMatch = supported;
    }
  }
  
  console.log(`   📐 Ratio original: ${(imageRatio).toFixed(3)} (${width}x${height}) -> Usando: ${bestMatch.ratio}`);
  return bestMatch.ratio;
}

async function processImage(imagePath, apiKey, retryCount = 0) {
  const startTime = Date.now();
  const fileName = path.basename(imagePath);
  
  try {
    console.log(`\n📸 Procesando: ${fileName}`);
    
    // Validar y convertir imagen a formato óptimo
    const { convertedBuffer, metadata } = await convertAndOptimizeImage(imagePath);
    
    // Validar tamaño después de conversión
    if (convertedBuffer.length > MAX_IMAGE_SIZE) {
      throw new Error(`Imagen demasiado grande: ${(convertedBuffer.length / 1024 / 1024).toFixed(2)}MB > 7MB`);
    }

    const base64Image = convertedBuffer.toString('base64');
    
    console.log(`   📊 Tamaño original: ${(metadata.originalSize / 1024).toFixed(2)} KB`);
    console.log(`   📊 Tamaño optimizado: ${(convertedBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`   📊 Dimensiones optimizadas: ${metadata.width}x${metadata.height}px (${metadata.aspectRatio})`);

    // Construir payload con estructura corregida según documentación Gemini 2.5
    const requestBody = {
      contents: [{
        parts: [
          { text: ENHANCEMENT_PROMPT },
          { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
        ]
      }],
      generationConfig: {
        responseModalities: ["IMAGE"],  // Array según documentación actualizada
        imageConfig: {
          aspectRatio: metadata.aspectRatio  // Usar el ratio optimizado directamente
        }
      }
    };

    // Endpoint REST de Gemini Image Generation con modelo estable
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    
    console.log(`   🔄 Enviando request a Gemini API...`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        'User-Agent': 'PhotoBoost-AI/1.0'
      },
      body: JSON.stringify(requestBody)
    });

    // Manejo robusto de errores HTTP
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      
      // Reintentar en errores temporales (429, 503, 500)
      if ([429, 500, 503].includes(response.status) && retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`   ⏱️  Error temporal ${response.status}, reintentando en ${delay/1000}s... (intento ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return processImage(imagePath, apiKey, retryCount + 1);
      }
      
      throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }

    const result = await response.json();
    
    // Validar estructura de respuesta
    if (!result.candidates || result.candidates.length === 0) {
      throw new Error('No se recibió respuesta válida del modelo');
    }
    
    if (result.candidates[0].finishReason && result.candidates[0].finishReason !== 'STOP') {
      throw new Error(`El modelo terminó inesperadamente: ${result.candidates[0].finishReason}`);
    }

    // Extraer imagen mejorada con manejo robusto
    const parts = result.candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      console.log('⚠️  Respuesta inesperada:', JSON.stringify(result, null, 2));
      throw new Error('No se encontraron partes en la respuesta');
    }

    // Buscar parte con imagen (soportar ambos formatos: camelCase y snake_case)
    const imagePart = parts.find(p => p.inlineData || p.inline_data);

    if (!imagePart) {
      console.log('⚠️  Parts recibidos:', JSON.stringify(parts.map(p => Object.keys(p)), null, 2));
      throw new Error('No se recibió imagen en la respuesta');
    }

    const imageDataField = imagePart.inlineData || imagePart.inline_data;
    if (!imageDataField || !imageDataField.data) {
      throw new Error('Datos de imagen vacíos en la respuesta');
    }
    
    // Validar que los datos son válidos base64
    if (!isValidBase64(imageDataField.data)) {
      throw new Error('Datos de imagen inválidos recibidos');
    }

    // Guardar imagen procesada
    const outputPath = path.join(AFTER_DIR, path.basename(imagePath));
    const imageData = Buffer.from(imageDataField.data, 'base64');
    
    // Crear directorio de salida si no existe
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, imageData);

    const processingTime = Date.now() - startTime;
    const outputSize = imageData.length;
    
    console.log(`✅ Guardada en: ${path.basename(outputPath)}`);
    console.log(`   📊 Tamaño final: ${(outputSize / 1024).toFixed(2)} KB`);
    console.log(`   ⏱️  Tiempo de procesamiento: ${(processingTime / 1000).toFixed(2)}s`);
    
    // Log de metadatos para análisis
    await logProcessingMetadata({
      fileName,
      originalSize: metadata.originalSize,
      optimizedSize: convertedBuffer.length,
      outputSize,
      width: metadata.width,
      height: metadata.height,
      processingTime,
      success: true,
      retryCount,
      timestamp: new Date().toISOString()
    });
    
    return {
      outputPath,
      metadata: {
        originalSize: metadata.originalSize,
        outputSize,
        processingTime,
        compressionRatio: (1 - outputSize / metadata.originalSize) * 100
      }
    };

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Error procesando ${fileName}:`, error.message);
    
    // Log del error para análisis
    await logProcessingMetadata({
      fileName,
      error: error.message,
      processingTime,
      success: false,
      retryCount,
      timestamp: new Date().toISOString()
    });
    
    return null;
  }
}

// Convertir y optimizar imagen ESPECÍFICAMENTE para Gemini's mejor rendimiento
async function convertAndOptimizeImage(imagePath) {
  try {
    const originalBuffer = fs.readFileSync(imagePath);
    const originalSize = originalBuffer.length;
    
    const sharpInstance = sharp(originalBuffer);
    const metadata = await sharpInstance.metadata();
    
    // FORMATO ÓPTIMO PARA GEMINI: Determinar mejor aspect ratio y resolución
    const originalRatio = metadata.width / metadata.height;
    let targetWidth, targetHeight, selectedRatio;
    
    // Real Estate optimal resolutions for Gemini
    if (originalRatio > 1.4) {
      // Wide image -> 16:9 (ideal for exteriors/landscapes)
      targetWidth = 1600;
      targetHeight = 900;
      selectedRatio = '16:9';
    } else if (originalRatio < 0.9) {
      // Tall image -> 3:4 (vertical/portrait)  
      targetWidth = 1200;
      targetHeight = 1600;
      selectedRatio = '3:4';
    } else {
      // Standard -> 4:3 (classic real estate format)
      targetWidth = 1600;
      targetHeight = 1200;
      selectedRatio = '4:3';
    }
    
    console.log(`   🎯 Optimizando para Gemini: ${metadata.width}x${metadata.height} → ${targetWidth}x${targetHeight} (${selectedRatio})`);
    
    // PROCESAMIENTO ÓPTIMO PARA GEMINI - PRESERVANDO DIMENSIONES ORIGINALES
    // Calcular tamaño que mantenga aspect ratio original
    const maxDimension = 1600;
    let finalWidth = metadata.width;
    let finalHeight = metadata.height;
    
    // Redimensionar SOLO si es necesario para mantener bajo 7MB, sin cambiar aspect ratio
    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      const scale = Math.min(maxDimension / metadata.width, maxDimension / metadata.height);
      finalWidth = Math.round(metadata.width * scale);
      finalHeight = Math.round(metadata.height * scale);
      console.log(`   📐 Redimensionando para mantener ratio: ${metadata.width}x${metadata.height} → ${finalWidth}x${finalHeight}`);
    }
    
    let processedImage = sharpInstance
      .resize(finalWidth, finalHeight, {
        withoutEnlargement: true,  // No agrandar si ya es pequeño
        fit: 'inside'  // Mantener aspect ratio original
      })
      .jpeg({ 
        quality: 92,  // Alta calidad para mejor input a Gemini
        progressive: true,
        mozjpeg: true,
        chromaSubsampling: '4:4:4'  // Mejor calidad de color
      });
    
    const convertedBuffer = await processedImage.toBuffer();
    
    // Validar tamaño final
    if (convertedBuffer.length > MAX_IMAGE_SIZE) {
      console.log(`   📉 Ajustando calidad para tamaño límite...`);
      processedImage = sharpInstance
        .resize(finalWidth, finalHeight, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ 
          quality: 80,
          progressive: true,
          mozjpeg: true
        });
      
      const finalBuffer = await processedImage.toBuffer();
      return {
        convertedBuffer: finalBuffer,
        metadata: {
          width: finalWidth,
          height: finalHeight,
          format: 'jpeg',
          originalSize,
          optimizedFor: 'gemini',
          aspectRatio: selectedRatio
        }
      };
    }
    
    return {
      convertedBuffer,
      metadata: {
        width: finalWidth,
        height: finalHeight,
        format: 'jpeg',
        originalSize,
        optimizedFor: 'gemini',
        aspectRatio: selectedRatio
      }
    };
    
  } catch (error) {
    throw new Error(`Error optimizando para Gemini: ${error.message}`);
  }
}

// Validar datos base64
function isValidBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch {
    // Fallback para Node.js
    try {
      return Buffer.from(str, 'base64').toString('base64') === str;
    } catch {
      return false;
    }
  }
}

// Sistema de logging de metadatos
async function logProcessingMetadata(data) {
  try {
    // Crear directorio de logs si no existe
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    
    const logFile = path.join(LOG_DIR, `processing-${new Date().toISOString().split('T')[0]}.json`);
    let logs = [];
    
    // Leer logs existentes
    if (fs.existsSync(logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      } catch {
        logs = [];
      }
    }
    
    // Agregar nuevo log
    logs.push(data);
    
    // Guardar logs actualizados
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    
  } catch (error) {
    console.warn('⚠️  No se pudo guardar log de metadatos:', error.message);
  }
}

async function processAllImages() {
  const startTime = Date.now();
  
  // Verificar API Key
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY no encontrada en .env');
    console.log('\n📝 Creá un archivo .env con:');
    console.log('   GEMINI_API_KEY=tu_api_key_aqui\n');
    process.exit(1);
  }

  // Verificar que exista la carpeta before
  if (!fs.existsSync(BEFORE_DIR)) {
    console.error(`❌ No existe la carpeta: ${BEFORE_DIR}`);
    process.exit(1);
  }

  // Leer todas las imágenes de la carpeta before
  const files = fs.readdirSync(BEFORE_DIR)
    .filter(file => /\.(jpg|jpeg|png|webp|gif|heic|heif|bmp|tiff)$/i.test(file))
    .sort(); // Ordenar para procesamiento consistente

  if (files.length === 0) {
    console.log('⚠️  No se encontraron imágenes en public/demo-properties/before/');
    console.log('📁 Cargá tus fotos ahí y volvé a ejecutar el script.\n');
    process.exit(0);
  }

  // Determinar modo de procesamiento
  const mode = process.env.PROCESSING_MODE || 'test';
  let filesToProcess;
  
  switch (mode) {
    case 'production':
      filesToProcess = files;
      break;
    case 'batch':
      const batchSize = parseInt(process.env.BATCH_SIZE) || BATCH_SIZE;
      filesToProcess = files.slice(0, batchSize);
      break;
    default: // test
      filesToProcess = files.slice(0, 1);
  }

  console.log(`\n🚀 Procesando ${filesToProcess.length} imagen(es) con Gemini ${MODEL}`);
  console.log(`📋 Modo: ${mode.toUpperCase()}`);
  console.log(`📸 Archivos: ${filesToProcess.join(', ')}\n`);
  console.log('⏳ Esto puede tomar unos minutos...\n');

  // Crear carpetas necesarias
  [AFTER_DIR, LOG_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Estadísticas de procesamiento
  let processed = 0;
  let failed = 0;
  let totalOriginalSize = 0;
  let totalOutputSize = 0;
  let totalProcessingTime = 0;

  // Procesar imágenes en lotes para mejor control de tasa
  for (let i = 0; i < filesToProcess.length; i += BATCH_SIZE) {
    const batch = filesToProcess.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Procesando lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(filesToProcess.length / BATCH_SIZE)}`);
    
    for (const file of batch) {
      const imagePath = path.join(BEFORE_DIR, file);
      const result = await processImage(imagePath, apiKey);
      
      if (result) {
        processed++;
        totalOriginalSize += result.metadata.originalSize;
        totalOutputSize += result.metadata.outputSize;
        totalProcessingTime += result.metadata.processingTime;
      } else {
        failed++;
      }

      // Control de tasa más inteligente
      if (i + batch.indexOf(file) < filesToProcess.length - 1) {
        console.log(`   ⏸️  Esperando ${RATE_LIMIT_DELAY/1000}s antes del siguiente request...`);
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }
  }

  const totalTime = Date.now() - startTime;
  
  // Resumen detallado
  console.log('\n' + '='.repeat(60));
  console.log(`✨ PROCESO COMPLETADO`);
  console.log('='.repeat(60));
  console.log(`📊 Estadísticas:`);
  console.log(`   ✅ Procesadas exitosamente: ${processed}`);
  if (failed > 0) {
    console.log(`   ❌ Fallos: ${failed}`);
  }
  console.log(`   📏 Tamaño original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📏 Tamaño final total: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📉 Reducción promedio: ${((1 - totalOutputSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`   ⏱️  Tiempo total: ${(totalTime / 1000 / 60).toFixed(2)} minutos`);
  console.log(`   ⏱️  Tiempo promedio por imagen: ${(totalProcessingTime / processed / 1000).toFixed(2)}s`);
  console.log(`\n📂 Resultados guardados en: ${AFTER_DIR}`);
  console.log(`📋 Logs detallados en: ${LOG_DIR}\n`);
  
  // Recomendaciones finales
  if (failed > 0) {
    console.log('💡 Recomendaciones:');
    console.log('   - Revisá los logs para detalles de errores');
    console.log('   - Verificá que las imágenes fallidas no estén corruptas');
    console.log('   - Considerá ajustar el RATE_LIMIT_DELAY si hay muchos errores 429\n');
  }
}

// Ejecutar
processAllImages();

