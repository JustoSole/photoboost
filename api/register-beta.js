/**
 * Vercel Serverless Function: Registro directo a la Beta en Airtable
 * Endpoint: /api/register-beta
 * Method: POST
 */

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

/**
 * Crear registro en Airtable para registro directo a Beta
 */
async function createBetaRecord(name, email, whatsapp, empresa) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Demos';
  const apiKey = process.env.AIRTABLE_API_KEY;
  
  const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}`;
  
  // Email es el campo principal en Airtable
  // Si no hay email, usar un placeholder único con el nombre y WhatsApp
  const emailToUse = (email && email.trim()) 
    ? email.trim() 
    : `${name.trim().replace(/\s+/g, '_').toLowerCase()}@placeholder.local`;
  
  const fields = {
    Nombre: name.trim(),
    Email: emailToUse,
    WhatsApp: whatsapp.trim(),
    Beta: true
  };
  
  // Agregar empresa si está presente
  if (empresa && empresa.trim()) {
    fields.Empresa = empresa.trim();
  }
  
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
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Validar variables de entorno
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error('Variables de entorno de Airtable no configuradas');
    }
    
    // Extraer datos del request
    const { name, email, whatsapp, empresa } = req.body;
    
    // Validar datos requeridos
    if (!name || !whatsapp) {
      return res.status(400).json({ 
        error: 'Nombre y WhatsApp son requeridos'
      });
    }
    
    // Validar formato de email si está presente
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }
    }
    
    console.log('📝 Creando registro beta en Airtable...');
    
    // Crear registro en Airtable
    const airtableRecord = await createBetaRecord(name, email, whatsapp, empresa);
    
    console.log(`✅ Registro beta creado: ${airtableRecord.id}`);
    
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
