import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import './TrustBadges.css'

const brands = [
  {
    name: 'Remax',
    logo: '/demo-properties/logo-remax-balloon.svg',
    alt: 'Remax Logo'
  },
  {
    name: 'Coldwell Banker',
    logo: '/demo-properties/coldwell_banker.png',
    alt: 'Coldwell Banker Logo'
  },
  {
    name: 'Century 21',
    logo: '/demo-properties/c21Arg.svg',
    alt: 'Century 21 Logo'
  },
  {
    name: 'Torribo Achaval',
    logo: '/demo-properties/TA_logo_svg.svg',
    alt: 'Torribo Achaval Logo'
  }
]

const TrustBadges = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })

  return (
    <section className="trust-badges" ref={ref}>
      <div className="container">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="trust-badges-text"
        >
          Agentes de estas inmobiliarias confían en nosotros
        </motion.p>
        <div className="trust-badges-list">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="trust-badge-item"
            >
              <img 
                src={brand.logo} 
                alt={brand.alt}
                className={`brand-logo ${brand.logo.includes('remax') ? 'remax-logo' : ''}`}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
