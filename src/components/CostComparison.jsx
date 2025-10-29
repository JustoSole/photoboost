import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiCheck, FiX } from 'react-icons/fi'
import './CostComparison.css'

const comparisons = [
  {
    service: 'Fotógrafo profesional',
    time: '3–5 días',
    cost: 'USD 50-300',
    delivery: 'Manual',
    highlight: false,
    cons: ['Requiere coordinación', 'Depende del clima', 'Costos por sesión']
  },
  {
    service: 'Estudio de edición',
    time: '2–3 días',
    cost: 'USD 100+',
    delivery: 'Manual',
    highlight: false,
    cons: ['Espera de días', 'Inconsistencias', 'Proceso manual']
  },
  {
    service: 'PhotoBoost (IA)',
    time: '⚡ Segundos',
    cost: 'Consultar',
    delivery: 'Automática',
    highlight: true,
    pros: ['Instantáneo', 'Resultados uniformes', 'Sin coordinación']
  }
]

const CostComparison = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })

  return (
    <section className="cost-comparison" ref={ref}>
      <div className="container">
        <h2 className="section-title">Comparativa de costos</h2>
        <p className="section-subtitle">
          Ahorrá tiempo y dinero sin sacrificar la calidad profesional
        </p>

        <div className="comparison-cards">
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`comparison-card ${item.highlight ? 'highlight' : ''}`}
            >
              {item.highlight && <div className="badge">Mejor opción</div>}
              
              <h3>{item.service}</h3>
              
              <div className="comparison-stats">
                <div className="stat">
                  <span className="stat-label">Tiempo</span>
                  <span className="stat-value">{item.time}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Costo</span>
                  <span className={`stat-value ${item.highlight ? 'price-highlight' : ''}`}>
                    {item.cost}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Entrega</span>
                  <span className="stat-value">{item.delivery}</span>
                </div>
              </div>

              {item.pros && (
                <ul className="features-list pros">
                  {item.pros.map((pro, i) => (
                    <li key={i}>
                      <FiCheck className="icon success" />
                      {pro}
                    </li>
                  ))}
                </ul>
              )}

              {item.cons && (
                <ul className="features-list cons">
                  {item.cons.map((con, i) => (
                    <li key={i}>
                      <FiX className="icon error" />
                      {con}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="comparison-footer"
        >
          <p className="footer-text">
            Pagá solo por lo que necesitás. <strong>Sin contratos, sin fotógrafos, sin demoras.</strong>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CostComparison

