import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import './VisualResults.css'

const results = [
  {
    id: 1,
    title: 'Sala de estar',
    before: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=50&blur=2',
    after: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=100&sat=5&sharp=10'
  },
  {
    id: 2,
    title: 'Cocina moderna',
    before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=50&blur=2',
    after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=100&sat=5&sharp=10'
  },
  {
    id: 3,
    title: 'Dormitorio principal',
    before: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop&q=50&blur=2',
    after: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop&q=100&sat=5&sharp=10'
  }
]

const VisualResults = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section className="visual-results" ref={ref}>
      <div className="container">
        <h2 className="section-title">Así se ve la diferencia con PhotoBoost</h2>
        <p className="section-subtitle">
          Mejoras reales en iluminación, nitidez y color. Sin perder la naturalidad de las fotos.
        </p>

        <div className="results-grid">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="result-card"
              onMouseEnter={() => setHoveredId(result.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="result-image-wrapper">
                <img 
                  src={result.before} 
                  alt={`${result.title} - Antes`}
                  className="result-image"
                />
                <img 
                  src={result.after} 
                  alt={`${result.title} - Después`}
                  className={`result-image result-image-after ${hoveredId === result.id ? 'visible' : ''}`}
                />
                <div className="result-overlay">
                  <span className="result-hint">
                    {hoveredId === result.id ? '✨ Después' : '👆 Hover para ver mejora'}
                  </span>
                </div>
              </div>
              <div className="result-footer">
                <h3>{result.title}</h3>
                <div className="result-labels">
                  <span className="label-tag">Antes</span>
                  <span className="arrow">→</span>
                  <span className="label-tag highlight">Después</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="results-cta"
        >
          <a href="#beta" className="btn btn-primary">
            📷 Quiero fotos así
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default VisualResults

