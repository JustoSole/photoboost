import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { trackFormSubmission } from '../utils/analytics'
import './BetaOffer.css'

const BetaOffer = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    businessSize: '',
    monthlyPhotos: '',
    currentProcess: '',
    mainChallenge: '',
    budget: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const sendToWeb3Forms = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('access_key', 'ee498ab6-6dec-43c0-b16b-a425c50b8602')
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('companyName', formData.companyName)
      formDataToSend.append('businessSize', formData.businessSize)
      formDataToSend.append('monthlyPhotos', formData.monthlyPhotos)
      formDataToSend.append('currentProcess', formData.currentProcess)
      formDataToSend.append('mainChallenge', formData.mainChallenge)
      formDataToSend.append('budget', formData.budget)
      formDataToSend.append('timestamp', new Date().toISOString())

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Error enviando a Web3Forms:', error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      // Enviar a Web3Forms
      await sendToWeb3Forms()
      
      // Enviar evento a Google Analytics
      trackFormSubmission({
        businessSize: formData.businessSize,
        monthlyPhotos: formData.monthlyPhotos
      })
      
      setShowThankYouModal(true)
      setSubmitStatus('success')
      
      // Limpiar formulario después de enviar
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          businessSize: '',
          monthlyPhotos: '',
          currentProcess: '',
          mainChallenge: '',
          budget: ''
        })
        setSubmitStatus(null)
        setShowThankYouModal(false)
      }, 4000)
      
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="beta-offer" id="beta" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="beta-box"
        >
          <div className="beta-content">
            <div className="beta-header">
              <h2 className="beta-title">
                Únete a nuestra beta exclusiva
              </h2>
              <p className="beta-subtitle">
                Nos gustaría conocer tu negocio. Cuéntanos sobre ti para ofrecerte una experiencia personalizada.
                Solo trabajamos con agencias y profesionales que se alineen con nuestro servicio.
              </p>
            </div>

            <form className="beta-form" onSubmit={handleSubmit}>
              {/* Row 1: Name and Email */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre completo (obligatorio)</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email (obligatorio)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@empresa.com"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone */}
              <div className="form-group">
                <label htmlFor="phone">WhatsApp / Teléfono (obligatorio)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+54 9 11 1234-5678"
                  required
                />
              </div>

              {/* Row 3: Company Name */}
              <div className="form-group">
                <label htmlFor="companyName">Nombre de la empresa (obligatorio)</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Mi Empresa S.A."
                  required
                />
              </div>

              {/* Row 4: Business Size */}
              <div className="form-group">
                <label htmlFor="businessSize">¿Cuál es el tamaño de tu empresa?</label>
                <select
                  id="businessSize"
                  name="businessSize"
                  value={formData.businessSize}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una opción...</option>
                  <option value="independiente">Independiente</option>
                  <option value="1-5">1 - 5 personas</option>
                  <option value="6-10">6 - 10 personas</option>
                  <option value="11-20">11 - 20 personas</option>
                  <option value="21-50">21 - 50 personas</option>
                  <option value="51-100">51 - 100 personas</option>
                  <option value="100+">100+ personas</option>
                </select>
              </div>

              {/* Row 5: Monthly Photos */}
              <div className="form-group">
                <label htmlFor="monthlyPhotos">¿Cuántas fotos necesitas procesar mensualmente?</label>
                <select
                  id="monthlyPhotos"
                  name="monthlyPhotos"
                  value={formData.monthlyPhotos}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una opción...</option>
                  <option value="menos-50">Menos de 50</option>
                  <option value="50-100">50 - 100</option>
                  <option value="100-150">100 - 150</option>
                  <option value="150-200">150 - 200</option>
                  <option value="200-250">200 - 250</option>
                  <option value="250-300">250 - 300</option>
                  <option value="300+">300+</option>
                </select>
              </div>

              {/* Row 6: Current Process */}
              <div className="form-group">
                <label htmlFor="currentProcess">¿Cómo procesan actualmente las fotos?</label>
                <select
                  id="currentProcess"
                  name="currentProcess"
                  value={formData.currentProcess}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una opción...</option>
                  <option value="manual">Manual (sin herramientas)</option>
                  <option value="adobe">Adobe (Photoshop, Lightroom)</option>
                  <option value="otras-herramientas">Otras herramientas automáticas</option>
                  <option value="agencia-externa">Contratan a una agencia externa</option>
                  <option value="freelancer">Contratan a un freelancer</option>
                </select>
              </div>

              {/* Row 7: Main Challenge */}
              <div className="form-group">
                <label htmlFor="mainChallenge">¿Cuál es tu mayor desafío actual?</label>
                <select
                  id="mainChallenge"
                  name="mainChallenge"
                  value={formData.mainChallenge}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una opción...</option>
                  <option value="tiempo">Falta de tiempo</option>
                  <option value="costo">Costo elevado</option>
                  <option value="calidad">Inconsistencia en calidad</option>
                  <option value="escalabilidad">Dificultad para escalar</option>
                  <option value="personal">No tengo personal capacitado</option>
                  <option value="consistencia-marca">Consistencia de marca</option>
                </select>
              </div>

              {/* Row 8: Budget */}
              <div className="form-group">
                <label htmlFor="budget">¿Cuál es tu presupuesto mensual para fotografía?</label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Ej: 500 USD"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mi información →'}
              </button>

              {submitStatus === 'error' && (
                <p className="form-error">
                  Hubo un problema. Intentá nuevamente.
                </p>
              )}

              <p className="form-disclaimer">
                Al registrarte, aceptás recibir información sobre PhotoBoost.
                <br />Sin spam, prometido.
              </p>
            </form>
          </div>

          <div className="beta-features">
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Consultoría personalizada</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Acceso exclusivo a la beta</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Descuentos especiales para early adopters</span>
            </div>
          </div>
        </motion.div>
      </div>

      {showThankYouModal && (
        <div className="modal-overlay">
          <motion.div
            className="thank-you-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="modal-content">
              <div className="success-checkmark">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  ✓
                </motion.div>
              </div>
              
              <h2 className="modal-title">¡Gracias por tu interés!</h2>
              
              <p className="modal-subtitle">
                Tu formulario fue enviado correctamente
              </p>
              
              <p className="modal-description">
                Pronto nos pondremos en contacto contigo para ofrecerte una experiencia personalizada.
              </p>

              <div className="modal-signature">
                <p className="signature-team">Equipo PhotoBoost</p>
                <p className="signature-emoji">🚀 IA aplicada al real estate</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}

export default BetaOffer

