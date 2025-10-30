import { useState, useEffect, useRef } from 'react'
import './SocialProof.css'

const SocialProof = () => {
  const [stats, setStats] = useState({
    photosProcessed: 500,
    betaUsers: 46,
    photosToday: 0,
    remainingSlots: 4
  })
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState('')
  const notificationIndexRef = useRef(0)

  useEffect(() => {
    // Función para mostrar notificación con stats fijos
    const showNextNotification = () => {
      const messages = [
        `Solo quedan 4 lugares para la beta con descuentos y acceso exclusivo`,
        `Unite a los 46 profesionales que ya usan PhotoBoost`,
        `Ya procesamos más de 500 fotos con IA`,
        `Acceso exclusivo - Oferta por tiempo limitado`
      ]
      
      const message = messages[notificationIndexRef.current % messages.length]
      setCurrentNotification(message)
      setShowNotification(true)
      
      // Ocultar después de 6 segundos
      setTimeout(() => {
        setShowNotification(false)
        // Cambiar al siguiente mensaje después de ocultar
        setTimeout(() => {
          notificationIndexRef.current = (notificationIndexRef.current + 1) % messages.length
        }, 3000)
      }, 6000)
    }
    
    // Mostrar primera notificación después de 10 segundos
    const firstNotificationTimer = setTimeout(() => {
      showNextNotification()
    }, 10000)
    
    // Rotar notificaciones cada 50 segundos
    const notificationInterval = setInterval(() => {
      if (!showNotification) {
        showNextNotification()
      }
    }, 50000)
    
    return () => {
      clearInterval(notificationInterval)
      clearTimeout(firstNotificationTimer)
    }
  }, [showNotification])

  return (
    <>
      {/* Notificación flotante discreta */}
      {showNotification && (
        <div className="social-proof-notification">
          <div className="notification-text">{currentNotification}</div>
        </div>
      )}

      {/* Banner principal con información clave */}
      <div className="social-proof-banner">
        <div className="social-proof-grid">
          <div className="social-proof-item">
            <div className="social-proof-content">
              <span className="social-proof-number">
                +{stats.photosProcessed}
              </span>
              <span className="social-proof-label">img procesadas</span>
            </div>
          </div>
          
          <div className="social-proof-item">
            <div className="social-proof-content">
              <span className="social-proof-number">
                {stats.betaUsers}
              </span>
              <span className="social-proof-label">profesionales registrados</span>
            </div>
          </div>
          
          <div className="social-proof-item">
            <div className="social-proof-content">
              <span className="social-proof-number">
                {stats.remainingSlots}
              </span>
              <span className="social-proof-label">lugares restantes</span>
            </div>
          </div>
        </div>
        
        {/* Mensaje de urgencia discreto */}
        <div className="urgency-message">
          <span>
            Solo quedan <strong>{stats.remainingSlots} lugares</strong> para la beta con descuentos y acceso exclusivo
          </span>
        </div>
      </div>
    </>
  )
}

export default SocialProof
