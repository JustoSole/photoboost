import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiTrendingUp, FiEye, FiHome, FiClock } from 'react-icons/fi'
import './SalesBoost.css'

const benefits = [
  {
    icon: FiEye,
    title: '30% más vistas',
    description: 'Fotos profesionales destacan en los resultados de búsqueda y generan mayor interés'
  },
  {
    icon: FiHome,
    title: 'Más agendamientos',
    description: 'Imágenes atractivas generan confianza y convierten visitantes en citas concretas'
  },
  {
    icon: FiClock,
    title: 'Vendés más rápido',
    description: 'Listings con fotos de calidad reducen el tiempo de venta hasta en 40%'
  }
]

const portals = [
  'Zonaprop',
  'Argenprop',
  'MercadoLibre',
  'Idealista',
  'Avisos Clasificados'
]

const SalesBoost = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 })

  return (
    <section className="sales-boost" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <h2 className="section-title">
            Mejora tus ventas online en todos los portales
          </h2>
          <p className="section-subtitle">
            Fotos profesionales aumentan engagement, contactos y cierres. 
            No es solo estética, es estrategia de ventas.
          </p>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="benefit-card"
              >
                <div className="benefit-icon">
                  <IconComponent />
                </div>
                <FiTrendingUp className="trend-icon" />
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="portals-section"
        >
          <div className="portals-header">
            <h3>Optimiza tus publicaciones en:</h3>
            <p>Fotos profesionales que funcionan en todos los portales</p>
          </div>
          
          <div className="portals-grid">
            {portals.map((portal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="portal-badge"
              >
                {portal}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="why-it-works"
        >
          <h3>¿Por qué funciona?</h3>
          <div className="reasons-list">
            <div className="reason-item">
              <div className="reason-number">1</div>
              <div className="reason-content">
                <h4>Primera impresión cuenta</h4>
                <p>Los compradores juzgan una propiedad en los primeros 3 segundos. Fotos profesionales generan confianza instantánea.</p>
              </div>
            </div>
            <div className="reason-item">
              <div className="reason-number">2</div>
              <div className="reason-content">
                <h4>Más visibilidad en búsquedas</h4>
                <p>Los algoritmos de portales priorizan listings con mejores fotos. Mejor ranking = más vistas = más ventas.</p>
              </div>
            </div>
            <div className="reason-item">
              <div className="reason-number">3</div>
              <div className="reason-content">
                <h4>Competencia real</h4>
                <p>Mientras tus competidores usan fotos de WhatsApp o celular, vos destacás con calidad profesional. Diferencia ganadora.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SalesBoost

