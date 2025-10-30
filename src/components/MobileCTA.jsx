import { useState, useEffect } from 'react'
import { trackCTAClick } from '../utils/analytics'
import './MobileCTA.css'

const MobileCTA = () => {
  const [isVisible, setIsVisible] = useState(true)

  const handleCTAClick = () => {
    trackCTAClick('Probar ahora gratis', 'mobile_cta_fixed')
  }

  useEffect(() => {
    const handleScroll = () => {
      const photoDemo = document.getElementById('photo-demo')
      const betaSection = document.getElementById('beta')
      
      // Si estamos en la sección de demo o beta, ocultar el CTA
      if (photoDemo || betaSection) {
        const photoDemoPosition = photoDemo ? photoDemo.getBoundingClientRect().top : Infinity
        const betaPosition = betaSection ? betaSection.getBoundingClientRect().top : Infinity
        const windowHeight = window.innerHeight
        
        // Hide CTA when demo or beta sections are visible
        const isDemoVisible = photoDemo && photoDemoPosition < windowHeight && photoDemoPosition > -photoDemo.offsetHeight
        const isBetaVisible = betaSection && betaPosition < windowHeight && betaPosition > -betaSection.offsetHeight
        
        if (isDemoVisible || isBetaVisible) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`mobile-cta ${isVisible ? 'visible' : 'hidden'}`}>
      <a href="#photo-demo" className="btn btn-primary btn-block" onClick={handleCTAClick}>
        Probar ahora gratis
      </a>
    </div>
  )
}

export default MobileCTA

