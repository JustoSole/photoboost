import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { FiUpload } from 'react-icons/fi'
import './BetaOffer.css'

const BetaOffer = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 })
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const sendToGoogleSheets = async () => {
    try {
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK
      
      if (!webhookUrl) {
        console.warn('Google Sheets webhook no configurado')
        return false
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          fileName: fileName || ''
        })
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Error enviando a Google Sheets:', error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      // Enviar a Google Sheets
      await sendToGoogleSheets()
      
      // Preparar mensaje de WhatsApp
      const message = encodeURIComponent(
        `¡Hola! Quiero unirme a la beta de PhotoBoost 🚀\n\n` +
        `Nombre: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `WhatsApp: ${formData.phone}\n\n` +
        `Quiero obtener mis 10 fotos gratis.`
      )
      
      // Enviar evento a Google Analytics
      if (window.gtag) {
        window.gtag('event', 'beta_signup', {
          event_category: 'engagement',
          event_label: 'Form Submitted'
        })
      }
      
      const whatsappNumber = '542944806519'
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
      
      setSubmitStatus('success')
      
      // Limpiar formulario después de enviar
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' })
        setFileName('')
        setSubmitStatus(null)
      }, 2000)
      
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
              <span className="beta-emoji">🎁</span>
              <h2 className="beta-title">
                Unite a la beta y obtené<br />
                <span className="text-gradient">10 fotos gratis</span>
              </h2>
              <p className="beta-subtitle">
                Cupos limitados a las primeras <strong>100 agencias</strong>
              </p>
            </div>

            <form className="beta-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@inmobiliaria.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">WhatsApp</label>
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

              <div className="form-group">
                <label className="file-upload-label">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="file-input"
                  />
                  <div className="file-upload-box">
                    <FiUpload className="upload-icon" />
                    <span className="upload-text">
                      {fileName || 'Subir foto de prueba (opcional)'}
                    </span>
                    {fileName && <span className="file-name">{fileName}</span>}
                  </div>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Enviando...' : '📩 Unirme y obtener mis 10 fotos gratis'}
              </button>

              {submitStatus === 'success' && (
                <p className="form-success">
                  ¡Éxito! Redirigiendo a WhatsApp... ✓
                </p>
              )}

              {submitStatus === 'error' && (
                <p className="form-error">
                  Hubo un problema. Intentá nuevamente.
                </p>
              )}

              <p className="form-disclaimer">
                Al registrarte, aceptás recibir información sobre PhotoBoost.
                <br />Sin spam, prometido. 🤝
              </p>
            </form>
          </div>

          <div className="beta-features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>10 fotos gratis para probar</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Acceso prioritario</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Sin tarjeta de crédito</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BetaOffer

