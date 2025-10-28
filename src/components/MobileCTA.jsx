import { useState, useEffect } from 'react'
import { trackCTAClick } from '../utils/analytics'
import './MobileCTA.css'

const MobileCTA = () => {
  const [isVisible, setIsVisible] = useState(true)

  const handleCTAClick = () => {
    trackCTAClick('Mejorar mis fotos ahora', 'mobile_cta_fixed')
  }

  useEffect(() => {
    const handleScroll = () => {
      const betaSection = document.getElementById('beta')
      if (betaSection) {
        const betaPosition = betaSection.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        
        // Hide CTA when beta section is visible
        if (betaPosition < windowHeight && betaPosition > -betaSection.offsetHeight) {
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
      <a href="#beta" className="btn btn-primary btn-block" onClick={handleCTAClick}>
        Mejorar mis fotos ahora
      </a>
    </div>
  )
}

export default MobileCTA

