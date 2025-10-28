import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import './VisualResults.css'

const imagePairs = [
  {
    id: 1,
    title: 'Casa con cielo gris mejorado',
    before: '/demo-properties/before/casa_cielo_gris_mala_calidad.webp',
    after: '/demo-properties/after/casa_cielo_gris_mala_calidad.webp'
  },
  {
    id: 2,
    title: 'Departamento moderno',
    before: '/demo-properties/before/AIEnhancement_depto.webp',
    after: '/demo-properties/after/AIEnhancement_depto.webp'
  },
  {
    id: 3,
    title: 'Departamento al anochecer',
    before: '/demo-properties/before/depto_anocheciendo.webp',
    after: '/demo-properties/after/depto_anocheciendo.webp'
  },
  {
    id: 4,
    title: 'Cielo gris saturado corregido',
    before: '/demo-properties/before/PHOTO5_CIELOGRIS_SATURADA.jpg',
    after: '/demo-properties/after/PHOTO5_CIELOGRIS_SATURADA.jpg'
  },
  {
    id: 5,
    title: 'Casa con calidad mejorada',
    before: '/demo-properties/before/casa_mala_img.webp',
    after: '/demo-properties/after/casa_mala_img.webp'
  }
]

const VisualResults = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef(null)
  const positionsRef = useRef({})

  // Precargar imágenes adyacentes
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image()
      img.src = src
    }

    // Precargar siguiente y anterior
    const nextIndex = (currentIndex + 1) % imagePairs.length
    const prevIndex = (currentIndex - 1 + imagePairs.length) % imagePairs.length

    preloadImage(imagePairs[nextIndex].before)
    preloadImage(imagePairs[nextIndex].after)
    preloadImage(imagePairs[prevIndex].before)
    preloadImage(imagePairs[prevIndex].after)
  }, [currentIndex])

  // Auto-change pairs every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const newIndex = (prev + 1) % imagePairs.length
        // Cargar la posición guardada de la nueva imagen
        setSliderPosition(positionsRef.current[newIndex] || 50)
        return newIndex
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const current = imagePairs[currentIndex]

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    
    const newPosition = Math.min(Math.max(percentage, 0), 100)
    setSliderPosition(newPosition)
    // Guardar posición para esta imagen específica
    positionsRef.current[currentIndex] = newPosition
  }

  const handleMouseDown = () => setIsDragging(true)

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleGlobalMouseMove)
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [isDragging, currentIndex])

  const changeImage = (newIndex) => {
    setIsLoading(true)
    
    // Pequeño delay para transición suave
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setSliderPosition(positionsRef.current[newIndex] || 50)
      setIsLoading(false)
    }, 150)
  }

  return (
    <section className="visual-results" id="examples" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Así se ve la diferencia con PhotoBoost</h2>
          <p className="section-subtitle">
            Desliza para ver la IA en acción
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="carousel"
        >
          {/* Navigation - Prev */}
          <button
            className="nav-btn nav-btn-prev"
            onClick={() => changeImage((currentIndex - 1 + imagePairs.length) % imagePairs.length)}
            aria-label="Imagen anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Interactive Comparison Slider */}
          <div className="comparison-container">
            <div 
              className={`comparison-slider ${isLoading ? 'loading' : ''}`}
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* Imagen DESPUÉS (fondo) */}
              <div className="comparison-image after-image">
                <img 
                  key={`after-${current.id}`}
                  src={current.after} 
                  alt="Después de PhotoBoost" 
                  draggable="false"
                  loading="eager"
                />
              </div>

              {/* Imagen ANTES (overlay con clip) */}
              <div 
                className="comparison-image before-image"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  key={`before-${current.id}`}
                  src={current.before} 
                  alt="Antes de PhotoBoost" 
                  draggable="false"
                  loading="eager"
                />
              </div>

              {/* Slider Handle */}
              <div 
                className="slider-handle"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
              >
                <div className="slider-line"></div>
                <div className="slider-button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
                <div className="slider-line"></div>
              </div>
            </div>
          </div>

          {/* Navigation - Next */}
          <button
            className="nav-btn nav-btn-next"
            onClick={() => changeImage((currentIndex + 1) % imagePairs.length)}
            aria-label="Siguiente imagen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </motion.div>

        {/* Dots */}
        <div className="carousel-footer">
          <div className="dots">
            {imagePairs.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => changeImage(idx)}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="cta"
        >
          <a href="#beta" className="btn btn-primary">
            Probar ahora gratis
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default VisualResults
