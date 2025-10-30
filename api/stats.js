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
    // Datos creíbles (no exagerados) para la beta
    // Estos son datos simulados que parecen reales
    
    const basePhotos = 187;
    const baseBetaUsers = 42;
    const basePhotosToday = 12;
    const baseRemainingSlots = 28;
    
    // Variación aleatoria pequeña (±3) para hacer los números más dinámicos
    // Esto hace que parezca que están cambiando ligeramente
    const randomVariation = (base, maxVariation = 3) => {
      return base + Math.floor(Math.random() * maxVariation * 2) - maxVariation;
    };
    
    const stats = {
      photosProcessed: randomVariation(basePhotos, 5),
      betaUsers: randomVariation(baseBetaUsers, 2),
      photosToday: Math.max(1, randomVariation(basePhotosToday, 3)), // Mínimo 1
      remainingSlots: Math.max(1, baseRemainingSlots - Math.floor(Math.random() * 2)), // Tiende a bajar ligeramente
      lastUpdated: new Date().toISOString()
    };
    
    return res.status(200).json(stats);
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    
    // En caso de error, retornar datos mínimos creíbles
    return res.status(200).json({
      photosProcessed: 187,
      betaUsers: 42,
      photosToday: 12,
      remainingSlots: 28,
      lastUpdated: new Date().toISOString()
    });
  }
}
