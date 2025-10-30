/**
 * Vercel Serverless Function: Actualiza feedback del usuario en Airtable
 * Endpoint: /api/update-feedback
 * Method: POST
 */

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

/**
 * Actualizar registro en Airtable con feedback del usuario
 */
async function updateAirtableRecord(recordId, updates) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Demos';
  const apiKey = process.env.AIRTABLE_API_KEY;
  
  const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}/${recordId}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: updates })
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
    const { recordId, leGusto, pagaria, wtp, comentario, beta } = req.body;
    
    // Validar recordId requerido
    if (!recordId) {
      return res.status(400).json({ 
        error: 'recordId es requerido' 
      });
    }
    
    // Preparar campos para actualizar (solo los que se enviaron)
    const updates = {};
    
    if (leGusto !== undefined && leGusto !== null && leGusto !== '') {
      updates.Le_Gusto = leGusto;
    }
    
    if (pagaria !== undefined && pagaria !== null && pagaria !== '') {
      updates.Pagaria = pagaria;
    }
    
    if (wtp !== undefined && wtp !== null && wtp !== '') {
      // Convertir WTP a número si es string
      const wtpNumber = typeof wtp === 'string' ? parseFloat(wtp) : wtp;
      if (!isNaN(wtpNumber)) {
        updates.WTP = wtpNumber;
      }
    }
    
    if (comentario !== undefined && comentario !== null && comentario !== '') {
      updates.Comentario = comentario;
    }
    
    if (beta !== undefined && beta !== null) {
      // El campo Beta es boolean en Airtable
      updates.Beta = beta === true || beta === 'true' || beta === 1;
    }
    
    // Si no hay nada que actualizar
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: 'No se proporcionaron campos para actualizar' 
      });
    }
    
    console.log(`📝 Actualizando feedback para registro ${recordId}:`, updates);
    
    // Actualizar registro en Airtable
    const updatedRecord = await updateAirtableRecord(recordId, updates);
    
    console.log('✅ Feedback actualizado exitosamente');
    
    return res.status(200).json({
      success: true,
      recordId: recordId,
      updatedFields: Object.keys(updates),
      message: 'Feedback guardado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en update-feedback:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
}

