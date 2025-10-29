import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { trackCTAClick, trackComparisonInteraction } from '../utils/analytics'
import './Hero.css'

const examples = [
  {
    id: 1,
    before: '/demo-properties/before/casa_cielo_gris_mala_calidad.webp',
    after: '/demo-properties/after/casa_cielo_gris_mala_calidad.webp',
    title: 'Casa con cielo gris mejorado'
  },
  {
    id: 2,
    before: '/demo-properties/before/AIEnhancement_depto.webp',
    after: '/demo-properties/after/AIEnhancement_depto.webp',
    title: 'Departamento moderno'
  },
  {
    id: 3,
    before: '/demo-properties/before/depto_anocheciendo.webp',
    after: '/demo-properties/after/depto_anocheciendo.webp',
    title: 'Departamento al anochecer'
  },
  {
    id: 4,
    before: '/demo-properties/before/PHOTO5_CIELOGRIS_SATURADA.jpg',
    after: '/demo-properties/after/PHOTO5_CIELOGRIS_SATURADA.jpg',
    title: 'Cielo gris saturado corregido'
  },
  {
    id: 5,
    before: '/demo-properties/before/casa_mala_img.webp',
    after: '/demo-properties/after/casa_mala_img.webp',
    title: 'Casa con calidad mejorada'
  }
]

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const positionsRef = useRef({})
  const sliderRef = useRef(null)

  // Precargar imágenes adyacentes
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image()
      img.src = src
    }

    // Precargar siguiente y anterior
    const nextIndex = (currentIndex + 1) % examples.length
    const prevIndex = (currentIndex - 1 + examples.length) % examples.length

    preloadImage(examples[nextIndex].before)
    preloadImage(examples[nextIndex].after)
    preloadImage(examples[prevIndex].before)
    preloadImage(examples[prevIndex].after)
  }, [currentIndex])

  const handleMove = (clientX) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    const newPosition = Math.max(0, Math.min(100, percentage))
    setSliderPosition(newPosition)
    // Guardar la posición de esta imagen
    positionsRef.current[currentIndex] = newPosition
  }

  const handleMouseMove = (e) => {
    handleMove(e.clientX)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    // NO resetear - mantener la posición donde quedó
  }

  // Manejar eventos globales de mouse y touch cuando está arrastrando
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleGlobalTouchMove = (e) => {
      if (isDragging && e.touches.length > 0) {
        // No usar preventDefault - touch-action CSS se encarga
        handleMove(e.touches[0].clientX)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, currentIndex])

  const nextExample = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % examples.length
      setCurrentIndex(newIndex)
      setSliderPosition(positionsRef.current[newIndex] || 50)
      setIsLoading(false)
      trackComparisonInteraction(newIndex + 1)
    }, 150)
  }

  const prevExample = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newIndex = (currentIndex - 1 + examples.length) % examples.length
      setCurrentIndex(newIndex)
      setSliderPosition(positionsRef.current[newIndex] || 50)
      setIsLoading(false)
      trackComparisonInteraction(newIndex + 1)
    }, 150)
  }

  const handleCTAClick = () => {
    trackCTAClick('Aplicar a la beta gratuita', 'hero_section')
  }

  const currentExample = examples[currentIndex]

  return (
    <section className="hero">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-content"
        >
          <h1 className="hero-title">
            Fotos profesionales sin fotógrafos ni esperas
          </h1>
          <p className="hero-subtitle">
            PhotoBoost mejora tus imágenes inmobiliarias con IA en minutos. No más fotos oscuras, pixeladas o de mala calidad. Probá gratis 10 fotos durante la beta.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-comparison"
        >
          <p className="comparison-hint">Desliza para ver la IA en acción</p>
          <div className="comparison-carousel">
            <button 
              className="carousel-btn carousel-btn-prev"
              onClick={prevExample}
              aria-label="Anterior"
            >
              <FiChevronLeft />
            </button>

            <div 
              ref={sliderRef}
              className={`comparison-slider ${isLoading ? 'loading' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
            >
              <div className="image-before">
                <img 
                  key={`before-${currentExample.id}`}
                  src={currentExample.before} 
                  alt={`${currentExample.title} - Antes`}
                  loading="eager"
                />
              </div>

              <div className="image-after" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img 
                  key={`after-${currentExample.id}`}
                  src={currentExample.after} 
                  alt={`${currentExample.title} - Después`}
                  loading="eager"
                />
              </div>

              <div className="slider-line" style={{ left: `${sliderPosition}%` }}>
                <div className="slider-button">
                  <div className="slider-arrows">
                    <span>‹</span>
                    <span>›</span>
                  </div>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(e.target.value)}
                className="slider-input"
              />
            </div>

            <button 
              className="carousel-btn carousel-btn-next"
              onClick={nextExample}
              aria-label="Siguiente"
            >
              <FiChevronRight />
            </button>
          </div>

          <div className="carousel-dots">
            {examples.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index)
                  setSliderPosition(positionsRef.current[index] || 50)
                }}
                aria-label={`Ver ejemplo ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="hero-cta"
        >
          <a href="#beta" className="btn btn-primary btn-large" onClick={handleCTAClick}>
            Aplicar a la beta gratuita →
          </a>
          <p className="cta-subtext">Sin tarjeta. Sin compromiso. Cupos limitados.</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

