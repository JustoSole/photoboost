/**
 * Vercel Serverless Function: Estadísticas de la plataforma
 * Endpoint: /api/stats
 * Method: GET
 * 
 * Retorna estadísticas creíbles simuladas (no reales de Airtable)
 */

export default async function handler(req, res) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: 'GET'
    });
  }

  try {
    // Datos fijos según solicitud del usuario
    const stats = {
      photosProcessed: 500, // +500 img procesadas
      betaUsers: 46, // 46 profesionales registrados
      photosToday: 0, // Este campo ya no se usa
      remainingSlots: 4, // quedan 4 lugares
      lastUpdated: new Date().toISOString()
    };
    
    return res.status(200).json(stats);
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    
    // En caso de error, retornar los mismos datos fijos
    return res.status(200).json({
      photosProcessed: 500,
      betaUsers: 46,
      photosToday: 0,
      remainingSlots: 4,
      lastUpdated: new Date().toISOString()
    });
  }
}
