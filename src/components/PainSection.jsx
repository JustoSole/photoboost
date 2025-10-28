import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import './PainSection.css'

const PainSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 })

  return (
    <section className="pain-section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="pain-content"
        >
          <h2 className="section-title">¿Cuánto te cuesta tener fotos realmente buenas?</h2>
          
          <div className="pain-cards">
            <div className="pain-card">
              <div className="pain-icon">💸</div>
              <h3>USD 250-400</h3>
              <p>Por sesión fotográfica con profesional</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">⏱️</div>
              <h3>3-5 días</h3>
              <p>Desde la coordinación hasta recibir las fotos editadas</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">📅</div>
              <h3>Coordinación compleja</h3>
              <p>Agendar, trasladarse, esperar clima ideal</p>
            </div>
          </div>

          <div className="solution-box">
            <h3>PhotoBoost lo hace diferente</h3>
            <p>
              Mejoramos tus fotos en <strong>segundos</strong>, con resultados consistentes y profesionales,
              sin coordinar nada ni pagar de más. Todo con el poder de la Inteligencia Artificial.
            </p>
            <a href="#beta" className="btn btn-secondary">
              💡 Mejorar mis fotos ahora
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PainSection

