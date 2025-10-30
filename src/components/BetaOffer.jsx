import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { trackFormSubmission } from '../utils/analytics'
import SocialProof from './SocialProof'
import './BetaOffer.css'

const BetaOffer = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const sendToAirtable = async () => {
    try {
      const response = await fetch('/api/register-beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.phone,
          beta: true // Registro directo a beta
        })
      })

      // Intentar parsear la respuesta como JSON
      let result;
      try {
        result = await response.json()
      } catch (jsonError) {
        // Si falla el parseo JSON (raro), lanzar error genérico
        console.error('Error parseando respuesta JSON:', jsonError)
        throw new Error(`Error del servidor (${response.status}): ${response.statusText}`)
      }
      
      if (!response.ok) {
        console.error('Error en respuesta del servidor:', {
          status: response.status,
          error: result.error || result
        })
        const errorMsg = result.error || result.message || `Error del servidor (${response.status})`
        throw new Error(errorMsg)
      }
      
      if (result.success !== true) {
        throw new Error(result.error || 'No se pudo completar el registro')
      }
      
      return true
    } catch (error) {
      console.error('Error enviando a Airtable:', error)
      // Re-lanzar el error para que handleSubmit pueda manejarlo
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')
    
    try {
      // Enviar a Airtable
      await sendToAirtable()
      
      // Enviar evento a Google Analytics
      trackFormSubmission({
        source: 'direct_beta_registration'
      })
      
      setShowThankYouModal(true)
      setSubmitStatus('success')
      setErrorMessage('')
      
      // Limpiar formulario después de enviar
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: ''
        })
        setSubmitStatus(null)
        setShowThankYouModal(false)
      }, 4000)
      
    } catch (error) {
      console.error('Error en handleSubmit:', error)
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Hubo un problema al registrar. Por favor intentá nuevamente.')
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
              Unite a la beta gratuita de PhotoBoost
            </h2>
            <p className="beta-subtitle">
              Acceso anticipado a nuestra herramienta de IA para fotos inmobiliarias. Unite ahora y obtén descuentos exclusivos cuando lancemos.
              Solo necesitamos algunos datos básicos para comenzar.
            </p>
            <div className="demo-cta-notice">
              <p>💡 <strong>¿Querés ver PhotoBoost en acción primero?</strong> <a href="#photo-demo" className="demo-link">Probá nuestra demo gratuita</a> arriba y experimentá cómo mejoramos tus fotos con IA.</p>
            </div>
          </div>

            <SocialProof />

            <form className="beta-form" onSubmit={handleSubmit}>
              {/* Row 1: Name and WhatsApp */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre completo *</label>
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
                  <label htmlFor="phone">WhatsApp *</label>
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
              </div>

              {/* Row 2: Email */}
              <div className="form-group">
                <label htmlFor="email">Email (opcional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="juan@empresa.com"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Unirme a la Beta Gratis →'}
              </button>

              {submitStatus === 'error' && (
                <p className="form-error">
                  {errorMessage || 'Hubo un problema. Intentá nuevamente.'}
                </p>
              )}

              <p className="form-disclaimer">
                Al unirte a la beta, recibirás acceso gratuito y actualizaciones por email.
                <br />Podés darte de baja cuando quieras.
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

