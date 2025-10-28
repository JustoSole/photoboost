import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Hero.css'

const examples = [
  {
    id: 1,
    before: '/demo-properties/before/PHOTO1_CONLOGO.webp',
    after: '/demo-properties/after/PHOTO1_CONLOGO.webp',
    title: 'Sala de estar con logo'
  },
  {
    id: 2,
    before: '/demo-properties/before/PHOTO2.webp',
    after: '/demo-properties/after/PHOTO2.webp',
    title: 'Dormitorio principal'
  },
  {
    id: 3,
    before: '/demo-properties/before/PHOTO3_PIXELADA.webp',
    after: '/demo-properties/after/PHOTO3_PIXELADA.webp',
    title: 'Cocina moderna'
  },
  {
    id: 4,
    before: '/demo-properties/before/PHOTO4_OSCURA.webp',
    after: '/demo-properties/after/PHOTO4_OSCURA.webp',
    title: 'Sala de estar amplia'
  },
  {
    id: 5,
    before: '/demo-properties/before/PHOTO5_CIELOGRIS_SATURADA.jpg',
    after: '/demo-properties/after/PHOTO5_CIELOGRIS_SATURADA.jpg',
    title: 'Patio exterior'
  }
]

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleMouseLeave = () => {
    setSliderPosition(50)
  }

  const nextExample = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length)
    setSliderPosition(50)
  }

  const prevExample = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length)
    setSliderPosition(50)
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
            Estamos seleccionando las próximas 10 agencias para nuestra beta privada.
          </h1>
          <p className="hero-subtitle">
            PhotoBoost mejora tus fotos inmobiliarias con IA. Obtené imágenes profesionales sin fotógrafos ni esperas. Probá gratis 10 fotos y formá parte del lanzamiento.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-comparison"
        >
          <div className="comparison-carousel">
            <button 
              className="carousel-btn carousel-btn-prev"
              onClick={prevExample}
              aria-label="Anterior"
            >
              <FiChevronLeft />
            </button>

            <div 
              className="comparison-slider"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="image-before">
                <div className="image-label label-before">Antes</div>
                <img 
                  src={currentExample.before} 
                  alt={`${currentExample.title} - Antes`}
                  loading="eager"
                />
              </div>

              <div className="image-after" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <div className="image-label label-after">Después</div>
                <img 
                  src={currentExample.after} 
                  alt={`${currentExample.title} - Después`}
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
                  setSliderPosition(50)
                }}
                aria-label={`Ver ejemplo ${index + 1}`}
              />
            ))}
          </div>

          <p className="carousel-title">{currentExample.title}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="hero-cta"
        >
          <a href="#beta" className="btn btn-primary btn-large">
            Aplicar a la beta gratuita →
          </a>
          <p className="cta-subtext">Sin tarjeta. Sin compromiso. Cupos limitados.</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

