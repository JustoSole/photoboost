// Función de prueba para verificar que Vercel detecta las funciones
export default function handler(req, res) {
  console.log('🔵 [test] Función recibida:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
  
  res.status(200).json({ 
    message: 'Function is working!',
    method: req.method,
    path: req.url,
    timestamp: new Date().toISOString()
  });
}

