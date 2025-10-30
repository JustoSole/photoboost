/**
 * Vercel Serverless Function: Registro directo a la Beta en Airtable
 * Endpoint: /api/register-beta
 * Method: POST
 */

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

/**
 * Crear registro en Airtable para registro directo a Beta
 */
async function createBetaRecord(name, email, whatsapp, empresa, beta = true) {
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
    Nombre: name.trim(),
    Email: emailToUse,
    WhatsApp: whatsapp.trim(), 
    Estado: 'beta_registrado',
    Beta: beta
  };
  
  // Agregar campos opcionales solo si están presentes
  if (empresa && empresa.trim()) fields.Empresa = empresa.trim();
  
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

export default async function handler(req, res) {
  // Logging inicial para debugging
  console.log('🟢 [register-beta] ===== REGISTRO BETA =====');
  console.log('📥 Request recibido:', {
    method: req.method,
    url: req.url,
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : null,
    timestamp: new Date().toISOString()
  });
  
  // Solo permitir POST
  if (req.method !== 'POST') {
    console.log('❌ [register-beta] Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      received: req.method,
      allowed: 'POST'
    });
  }
  
  try {
    console.log('✅ [register-beta] Validando variables de entorno...');
    console.log('🔍 [register-beta] Variables disponibles:', {
      hasAIRTABLE_API_KEY: !!process.env.AIRTABLE_API_KEY,
      hasAIRTABLE_BASE_ID: !!process.env.AIRTABLE_BASE_ID,
      hasAIRTABLE_TABLE_NAME: !!process.env.AIRTABLE_TABLE_NAME,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Validar variables de entorno
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      const missing = [];
      if (!process.env.AIRTABLE_API_KEY) missing.push('AIRTABLE_API_KEY');
      if (!process.env.AIRTABLE_BASE_ID) missing.push('AIRTABLE_BASE_ID');
      console.error('❌ [register-beta] Variables faltantes:', missing);
      throw new Error(`Variables de entorno de Airtable no configuradas: ${missing.join(', ')}`);
    }
    
    // Extraer datos del request
    const { name, email, whatsapp, empresa, beta } = req.body;
    
    console.log('📦 [register-beta] Datos recibidos:', {
      hasName: !!name,
      hasEmail: !!email,
      hasWhatsapp: !!whatsapp,
      hasEmpresa: !!empresa,
      beta: beta
    });
    
    // Validar datos requeridos
    if (!name || !whatsapp) {
      console.log('❌ [register-beta] Datos faltantes:', { hasName: !!name, hasWhatsapp: !!whatsapp });
      return res.status(400).json({ 
        error: 'Nombre y WhatsApp son requeridos'
      });
    }
    
    // Validar formato de email si está presente
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }
    }
    
    // Crear registro en Airtable
    console.log('📝 Creando registro beta en Airtable...');
    const airtableRecord = await createBetaRecord(name, email, whatsapp, empresa, beta);
    
    console.log(`✅ Registro beta creado: ${airtableRecord.id}`);
    
    // Devolver respuesta al frontend
    return res.status(200).json({
      success: true,
      recordId: airtableRecord.id,
      message: 'Registro en la beta exitoso'
    });
    
  } catch (error) {
    console.error('❌ Error en register-beta:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
}