import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi'
import './PainSection.css'

const painPoints = [
  {
    icon: FiDollarSign,
    value: 'USD 250-400',
    description: 'Por sesión fotográfica profesional'
  },
  {
    icon: FiClock,
    value: '3-5 días',
    description: 'Desde coordinación hasta recibir fotos editadas'
  },
  {
    icon: FiCheckCircle,
    value: 'Coordinación compleja',
    description: 'Agendar horarios, trasladarse, esperar clima'
  }
]

const PainSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 })

  return (
    <section className="pain-section" ref={ref}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Las fotos venden. <br />
          Y ahora podés tener calidad profesional sin complejidades.
        </motion.h2>
        
        <div className="pain-cards">
          {painPoints.map((point, index) => {
            const IconComponent = point.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="pain-card"
              >
                <div className="pain-icon">
                  <IconComponent />
                </div>
                <h3>{point.value}</h3>
                <p>{point.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="solution-box"
        >
          <h3>Con PhotoBoost, todo es más simple.</h3>
          <p>
            Fotos profesionales en segundos, sin fotógrafos, sin coordinar horarios, sin pagar USD 300 por sesión. 
            Solo cargá tus imágenes y deja que la IA haga el trabajo.
          </p>
          <div className="solution-features">
            <div className="feature">Fotos profesionales en segundos</div>
            <div className="feature">IA desarrollada en Argentina</div>
            <div className="feature">Hasta 30% más vistas en tus publicaciones</div>
          </div>
          <a href="#beta" className="btn btn-primary">
            Probar ahora gratis
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default PainSection

