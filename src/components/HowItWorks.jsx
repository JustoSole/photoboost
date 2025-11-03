import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiUpload, FiZap, FiDownload } from 'react-icons/fi'
import './HowItWorks.css'

const steps = [
  {
    icon: FiUpload,
    title: 'Subí tus fotos',
    description: 'Arrastrá o seleccioná las imágenes que querés mejorar. Aceptamos JPG, PNG y HEIC.'
  },
  {
    icon: FiZap,
    title: 'IA mejora luz, color y nitidez',
    description: 'Nuestro sistema procesa cada imagen con algoritmos avanzados de IA.'
  },
  {
    icon: FiDownload,
    title: 'Recibí resultados en segundos',
    description: 'Descargá tus fotos mejoradas en alta resolución al instante.'
  }
]

const HowItWorks = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })

  return (
    <section className="how-it-works" id="how-it-works" ref={ref}>
      <div className="container">
        <h2 className="section-title">Cómo funciona</h2>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="step-card"
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-icon-wrapper">
                <step.icon className="step-icon" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="how-it-works-footer"
        >
          <p className="subtext">
            Resultados uniformes, profesionales y con tono coherente en toda la propiedad.
          </p>
          <div className="how-it-works-ctas">
            <a href="#photo-demo" className="btn btn-primary">
              Probar gratis
            </a>
            <a href="#pricing" className="btn btn-secondary">
              Ver planes
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks

