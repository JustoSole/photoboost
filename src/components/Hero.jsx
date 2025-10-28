import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

const Hero = () => {
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value)
  }

  return (
    <section className="hero">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1 className="hero-title">
            Fotos profesionales,<br />
            <span className="text-gradient">sin fotógrafos.</span>
          </h1>
          <p className="hero-subtitle">
            Mejorá tus imágenes inmobiliarias con IA en segundos.<br />
            Sin estudio, sin edición manual, sin esperas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="comparison-slider-wrapper"
        >
          <div className="comparison-slider">
            <div className="comparison-container">
              <div className="image-before">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&q=60&auto=format" 
                  alt="Foto sin procesar"
                />
                <div className="image-label label-before">Antes</div>
              </div>
              <div 
                className="image-after"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&q=100&sat=10&auto=format&sharp=10" 
                  alt="Foto mejorada con IA"
                />
                <div className="image-label label-after">Después</div>
              </div>
              <div 
                className="slider-line"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="slider-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition}
                onChange={handleSliderChange}
                className="slider-input"
                aria-label="Deslizar para comparar antes y después"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hero-cta"
        >
          <a href="#beta" className="btn btn-primary btn-large">
            🚀 Probar ahora gratis
          </a>
          <p className="cta-subtext">10 fotos gratis • Sin tarjeta de crédito</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

