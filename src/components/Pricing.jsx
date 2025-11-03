import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiCheck } from 'react-icons/fi'
import { trackPricingClick } from '../utils/analytics'
import './Pricing.css'

const plans = [
  {
    name: 'Pay as you go',
    credits: 1,
    totalPrice: 1,
    pricePerPhoto: 1.00,
    savings: null,
    idealFor: 'Usuarios ocasionales',
    highlight: false,
    badge: null,
    features: [
      'Mejora de luz, color, nitidez',
      'HDR automático',
      'Reemplazo de cielo',
      'Resultados en segundos',
      'Descarga en alta resolución',
      'Sin marca de agua',
      'Soporte por WhatsApp/email'
    ]
  },
  {
    name: 'Inicial',
    credits: 30,
    totalPrice: 24,
    pricePerPhoto: 0.80,
    savings: '20%',
    idealFor: 'Agentes con pocas propiedades',
    highlight: false,
    badge: 'Ahorra 20%',
    features: [
      'Mejora de luz, color, nitidez',
      'HDR automático',
      'Reemplazo de cielo',
      'Resultados en segundos',
      'Descarga en alta resolución',
      'Sin marca de agua',
      'Soporte por WhatsApp/email'
    ]
  },
  {
    name: 'Profesional',
    credits: 50,
    totalPrice: 35,
    pricePerPhoto: 0.70,
    savings: '30%',
    idealFor: 'Agencias medianas',
    highlight: true,
    badge: 'Más Popular',
    features: [
      'Mejora de luz, color, nitidez',
      'HDR automático',
      'Reemplazo de cielo',
      'Resultados en segundos',
      'Descarga en alta resolución',
      'Sin marca de agua',
      'Soporte por WhatsApp/email'
    ]
  },
  {
    name: 'Avanzado',
    credits: 100,
    totalPrice: 60,
    pricePerPhoto: 0.60,
    savings: '40%',
    idealFor: 'Fotógrafos/inmobiliarias alto volumen',
    highlight: false,
    badge: 'Mejor Valor',
    features: [
      'Mejora de luz, color, nitidez',
      'HDR automático',
      'Reemplazo de cielo',
      'Resultados en segundos',
      'Descarga en alta resolución',
      'Sin marca de agua',
      'Soporte por WhatsApp/email'
    ]
  },
  {
    name: 'Enterprise',
    credits: 'Personalizado',
    totalPrice: 'A medida',
    pricePerPhoto: '-',
    savings: null,
    idealFor: 'Grandes agencias/portales',
    highlight: false,
    badge: 'Contactar',
    isEnterprise: true,
    features: [
      'Más de 100 fotos/mes',
      'API access',
      'Soporte dedicado',
      'Planes personalizados',
      'Integraciones personalizadas',
      'SLA garantizado',
      'Sin marca de agua'
    ]
  }
]

const whatsappNumber = '5492944806519'

const getWhatsAppLink = (planName) => {
  const message = encodeURIComponent(`Quiero usar el plan ${planName}`)
  return `https://wa.me/${whatsappNumber}?text=${message}`
}

const whatsappMessage = encodeURIComponent('Hola, me interesa el plan Enterprise de PhotoBoost')
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

const Pricing = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })

  const handlePlanClick = (planName, price) => {
    trackPricingClick(planName, price)
  }

  const handleEnterpriseClick = () => {
    trackPricingClick('Enterprise', 'custom')
  }

  // Separar planes regulares de Enterprise
  const regularPlans = plans.filter(plan => !plan.isEnterprise)
  const enterprisePlan = plans.find(plan => plan.isEnterprise)

  return (
    <section className="pricing" id="pricing" ref={ref}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Planes simples y transparentes
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-subtitle"
        >
          Elegí el plan que mejor se adapte a tus necesidades. Sin permanencias ni costos ocultos.
        </motion.p>

        {/* Grid de planes regulares */}
        <div className="pricing-grid-main">
          {regularPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`pricing-card ${plan.highlight ? 'featured' : ''}`}
            >
              {plan.badge && (
                <div className={`pricing-badge ${plan.highlight ? 'badge-popular' : 'badge-savings'}`}>
                  {plan.badge}
                </div>
              )}
              
              <div className="pricing-card-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-ideal-for">{plan.idealFor}</p>
              </div>

              <div className="pricing-card-price">
                <div className="price-main">
                  <span className="currency">USD</span>
                  <span className="amount">{plan.totalPrice}</span>
                </div>
                <div className="price-details">
                  <span className="price-per-photo">USD {plan.pricePerPhoto.toFixed(2)} / foto</span>
                  <span className="credits-count">{plan.credits} créditos</span>
                </div>
                {plan.savings && (
                  <div className="savings-indicator">
                    Ahorra {plan.savings}
                  </div>
                )}
              </div>

              <div className="pricing-card-features">
                <ul className="features-list">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <FiCheck className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pricing-card-cta">
                <a
                  href={getWhatsAppLink(plan.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePlanClick(plan.name, plan.totalPrice)}
                >
                  Consulta ahora
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Plan Enterprise separado y destacado */}
        {enterprisePlan && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="enterprise-section"
          >
            <div className="pricing-card enterprise">
              <div className={`pricing-badge badge-enterprise`}>
                {enterprisePlan.badge}
              </div>
              
              <div className="pricing-card-header">
                <h3 className="plan-name">{enterprisePlan.name}</h3>
                <p className="plan-ideal-for">{enterprisePlan.idealFor}</p>
              </div>

              <div className="pricing-card-price enterprise-price-container">
                <div className="enterprise-price">
                  <span className="enterprise-label">Precio</span>
                  <span className="enterprise-value">Personalizado</span>
                </div>
              </div>

              <div className="pricing-card-features">
                <ul className="features-list">
                  {enterprisePlan.features.map((feature, i) => (
                    <li key={i}>
                      <FiCheck className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pricing-card-cta">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-enterprise"
                  onClick={handleEnterpriseClick}
                >
                  Solicitar presupuesto
                </a>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pricing-footer"
        >
          <p className="footer-note">
            Pagá solo por lo que usás. Cancelá cuando quieras. Los créditos no expiran.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
