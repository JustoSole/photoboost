import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiChevronDown } from 'react-icons/fi'
import './FAQ.css'

const faqs = [
  {
    question: '¿Qué formatos aceptan y cuál es el límite de tamaño?',
    answer: 'Aceptamos JPG, PNG, WEBP hasta 10 MB por imagen.'
  },
  {
    question: '¿Qué ocurre con mis créditos no usados?',
    answer: 'Los créditos no expiran y se acumulan en tu cuenta. Puedes usarlos cuando quieras.'
  },
  {
    question: '¿Puedo cancelar o cambiar de plan en cualquier momento?',
    answer: 'Sí, no hay contratos de permanencia. Puedes cambiar o cancelar tu plan en cualquier momento sin penalizaciones.'
  },
  {
    question: '¿Qué velocidad de entrega tienen?',
    answer: 'Procesamos tus fotos en segundos. El resultado está listo inmediatamente después de subir tu imagen.'
  },
  {
    question: '¿La imagen tiene marca de agua?',
    answer: 'No, todas las imágenes mejoradas se entregan sin marca de agua en alta resolución.'
  },
  {
    question: '¿Cómo se calcula el precio por foto?',
    answer: '1 crédito = 1 foto mejorada. Cada plan ofrece un precio por foto más económico según la cantidad de créditos que incluye.'
  },
  {
    question: '¿Funciona con fotos de exteriores e interiores?',
    answer: 'Sí, PhotoBoost mejora tanto fotos de exteriores como interiores, aplicando HDR, mejora de iluminación y corrección de color automáticamente.'
  },
  {
    question: '¿Necesito conocimientos técnicos para usar PhotoBoost?',
    answer: 'No, solo subes tu foto y obtienes el resultado mejorado en segundos. Es completamente automático.'
  }
]

const FAQ = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq" id="faq" ref={ref}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Preguntas Frecuentes
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-subtitle"
        >
          Resolvemos tus dudas más comunes sobre PhotoBoost
        </motion.p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <FiChevronDown className={`faq-icon ${openIndex === index ? 'open' : ''}`} />
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="faq-cta"
        >
          <p className="faq-cta-text">¿Listo para empezar?</p>
          <a href="#photo-demo" className="btn btn-primary">
            Probar gratis
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ

