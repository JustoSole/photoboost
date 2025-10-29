import { useState, useEffect } from 'react'
import './SocialProof.css'

const SocialProof = () => {
  const [registeredCount, setRegisteredCount] = useState(47)
  const [recentRegistrations, setRecentRegistrations] = useState([
    'Propiedades García',
    'Elite Inmobiliario',
    'Casas Premium',
  ])
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState('')

  useEffect(() => {
    // Simular registros recientes (actualizar con datos reales cuando tengas)
    const interval = setInterval(() => {
      // Esto es simulado - reemplazar con datos reales de tu backend/analytics
      const randomCompanies = [
        'Inmobiliaria Buenos Aires',
        'Propiedades Premium',
        'Real Estate Pro',
        'Casas & Departamentos',
        'Inversiones Inmobiliarias',
        'Estate Solutions',
      ]

      // Mostrar notificación cada 30-60 segundos (simulado)
      if (Math.random() > 0.7) {
        const randomCompany = randomCompanies[Math.floor(Math.random() * randomCompanies.length)]
        setCurrentNotification(`${randomCompany} se registró hace ${Math.floor(Math.random() * 10) + 1} minutos`)
        setShowNotification(true)
        setRegisteredCount(prev => prev + 1)

        // Ocultar después de 5 segundos
        setTimeout(() => {
          setShowNotification(false)
        }, 5000)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Fixed notification in top right */}
      {showNotification && (
        <div className="social-proof-notification">
          <div className="notification-icon">🔥</div>
          <div className="notification-text">{currentNotification}</div>
        </div>
      )}

      {/* Banner above form */}
      <div className="social-proof-banner">
        <div className="social-proof-item">
          <span className="social-proof-emoji">📊</span>
          <span className="social-proof-text">
            Ya hay <strong>{registeredCount}+</strong> profesionales en la beta
          </span>
        </div>
        <div className="social-proof-item">
          <span className="social-proof-emoji">⏰</span>
          <span className="social-proof-text">
            Último registro: hace menos de 1 hora
          </span>
        </div>
      </div>
    </>
  )
}

export default SocialProof

