import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiCheck } from 'react-icons/fi'
import { trackPricingClick } from '../utils/analytics'
import './Pricing.css'

const plans = [
  {
    name: 'Starter',
    price: 5,
    period: 'una vez',
    features: [
      '5 fotos / propiedad',
      'Procesamiento instantáneo',
      'Descarga en alta resolución',
      'Mejora de luz y color',
      'Corrección de perspectiva'
    ],
    highlight: false,
    cta: 'Comenzar'
  },
  {
    name: 'Pro',
    price: 20,
    period: 'mes',
    features: [
      '25 fotos / mes',
      'Procesamiento prioritario',
      'Descarga en alta resolución',
      'Mejora avanzada de IA',
      'Corrección de perspectiva',
      'Soporte por email',
      'Historial ilimitado'
    ],
    highlight: true,
    cta: 'Comenzar prueba'
  },
  {
    name: 'Agencia',
    price: 60,
    period: 'mes',
    features: [
      '100 fotos / mes',
      'Procesamiento ultra rápido',
      'Descarga en alta resolución',
      'Mejora avanzada de IA',
      'Corrección de perspectiva',
      'Soporte prioritario 24/7',
      'Historial ilimitado',
      'API access',
      'Marca personalizada'
    ],
    highlight: false,
    cta: 'Contactar ventas'
  }
]

const Pricing = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })

  const handlePlanClick = (planName, price) => {
    trackPricingClick(planName, price)
  }

  return (
    <section className="pricing" id="pricing" ref={ref}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Planes simples
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-subtitle"
        >
          Elegí el plan que mejor se adapte a tus necesidades. Sin permanencias ni costos ocultos.
        </motion.p>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`pricing-card ${plan.highlight ? 'featured' : ''}`}
            >
              {plan.highlight && <div className="popular-badge">Más popular</div>}
              
              <div className="pricing-header">
                <h3>{plan.name}</h3>
              </div>

              <div className="pricing-price">
                <span className="currency">USD</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <FiCheck className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="#beta" 
                className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} btn-block`}
                onClick={() => handlePlanClick(plan.name, plan.price)}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pricing-footer"
        >
          <p className="footer-note">
            Pagá solo por lo que usás. Cancelá cuando quieras.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing

