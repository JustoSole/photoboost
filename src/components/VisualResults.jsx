import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import './VisualResults.css'

const imagePairs = [
  {
    id: 1,
    title: 'Patio exterior',
    before: '/demo-properties/before/PHOTO1_CONLOGO.webp',
    after: '/demo-properties/after/PHOTO1_CONLOGO.webp'
  },
  {
    id: 2,
    title: 'Departamento moderno',
    before: '/demo-properties/before/PHOTO2.webp',
    after: '/demo-properties/after/PHOTO2.webp'
  },
  {
    id: 3,
    title: 'Foto pixelada',
    before: '/demo-properties/before/PHOTO3_PIXELADA.webp',
    after: '/demo-properties/after/PHOTO3_PIXELADA.webp'
  },
  {
    id: 4,
    title: 'Ambiente oscuro',
    before: '/demo-properties/before/PHOTO4_OSCURA.webp',
    after: '/demo-properties/after/PHOTO4_OSCURA.webp'
  },
  {
    id: 5,
    title: 'Cielo gris saturado',
    before: '/demo-properties/before/PHOTO5_CIELOGRIS_SATURADA.jpg',
    after: '/demo-properties/after/PHOTO5_CIELOGRIS_SATURADA.jpg'
  }
]

const VisualResults = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-change pairs every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imagePairs.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const current = imagePairs[currentIndex]

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
            Mejoras reales en iluminación, nitidez y color. Sin perder la naturalidad de las fotos.
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
            className="nav-btn"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + imagePairs.length) % imagePairs.length)}
            aria-label="Imagen anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Images Grid */}
          <div className="images-grid">
            <div className="image-box before">
              <img src={current.before} alt="Antes" />
              <span className="label">Antes</span>
            </div>
            <div className="image-box after">
              <img src={current.after} alt="Después" />
            </div>
          </div>

          {/* Navigation - Next */}
          <button
            className="nav-btn"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % imagePairs.length)}
            aria-label="Siguiente imagen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </motion.div>

        {/* Dots and Title */}
        <div className="carousel-footer">
          <div className="dots">
            {imagePairs.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir a par ${idx + 1}`}
              />
            ))}
          </div>
          <h3 className="pair-title">{current.title}</h3>
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

