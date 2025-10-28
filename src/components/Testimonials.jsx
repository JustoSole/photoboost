import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiStar } from 'react-icons/fi'
import './Testimonials.css'

const testimonials = [
  {
    id: 1,
    name: 'Mariano García',
    company: 'Propiedades García & Asociados',
    role: 'Gerente de Operaciones',
    content: 'PhotoBoost nos permitió procesar 200+ fotos mensuales sin contratar a un fotógrafo. Los resultados son profesionales y consistentes. Nuestras publicaciones ahora generan 40% más consultas.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sofía Rodríguez',
    company: 'Elite Inmobiliario',
    role: 'Directora Comercial',
    content: 'Es increíble. Reducimos costos de fotografía en un 85% y ganamos velocidad. Lo que tardaba 5 días ahora lo hacemos en minutos. Ya es parte de nuestro workflow diario.',
    rating: 5
  }
]

const Testimonials = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 })

  return (
    <section className="testimonials" ref={ref}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          Lo que dicen las agencias
        </motion.h2>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="testimonial-card"
            >
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="star" />
                ))}
              </div>

              <p className="testimonial-content">
                "{testimonial.content}"
              </p>

              <div className="testimonial-author">
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                  <p className="author-company">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
