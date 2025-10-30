import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackCTAClick } from '../utils/analytics'
import './ExitIntentPopup.css'

const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup (localStorage)
    const popupShown = localStorage.getItem('exitIntentShown')
    if (popupShown) {
      setHasShown(true)
      return
    }

    // Detect exit intent (mouse leaving viewport towards top)
    const handleMouseLeave = (e) => {
      // Only trigger if mouse is moving towards top of page
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true)
        setHasShown(true)
        localStorage.setItem('exitIntentShown', 'true')
      }
    }

    // Mobile: detect scroll up (swipe to go back)
    let lastScrollTop = 0
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // If scrolling up very fast and near top, show popup
      if (scrollTop < lastScrollTop && scrollTop < 100 && !hasShown) {
        const scrollSpeed = lastScrollTop - scrollTop
        if (scrollSpeed > 50) {
          setShowPopup(true)
          setHasShown(true)
          localStorage.setItem('exitIntentShown', 'true')
        }
      }
      lastScrollTop = scrollTop
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShown])

  const handleCTAClick = () => {
    trackCTAClick('Probar ahora gratis', 'exit_intent_popup')
    setShowPopup(false)
  }

  const handleClose = () => {
    setShowPopup(false)
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="exit-popup-overlay"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="exit-popup"
          >
            <button 
              className="exit-popup-close"
              onClick={handleClose}
              aria-label="Cerrar"
            >
              ×
            </button>
            
            <div className="exit-popup-content">
              <div className="exit-popup-icon">🎁</div>
              <h2 className="exit-popup-title">
                ¡Esperá!
              </h2>
              <p className="exit-popup-subtitle">
                Prueba gratis y únete a la beta
              </p>
              <p className="exit-popup-description">
                Sin tarjeta. Sin compromiso. Solo necesitamos tu feedback.
              </p>
              
              <a 
                href="#photo-demo" 
                className="btn btn-primary btn-large btn-block"
                onClick={handleCTAClick}
              >
                Probar ahora gratis →
              </a>
              
              <p className="exit-popup-disclaimer">
                Cupos limitados en la beta
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExitIntentPopup

