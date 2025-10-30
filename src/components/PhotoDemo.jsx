import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  trackPhotoUpload, 
  trackPhotoProcessStart, 
  trackPhotoProcessComplete, 
  trackPhotoProcessError,
  trackPhotoDownload,
  trackTryAnotherPhoto,
  trackJoinBetaFromDemo,
  trackFeedbackSubmission
} from '../utils/analytics'
import './PhotoDemo.css'

const PhotoDemo = () => {
  // Estados del formulario
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [empresa, setEmpresa] = useState('')
  
  // Estados de la foto
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  
  // Estados del proceso
  const [status, setStatus] = useState('idle') // idle, uploading, processing, completed, error
  const [errorMessage, setErrorMessage] = useState('')
  const [recordId, setRecordId] = useState(null)
  
  // Estados del slider
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)
  
  // Estados de feedback
  const [leGusto, setLeGusto] = useState('')
  const [pagaria, setPagaria] = useState('')
  const [wtp, setWtp] = useState('')
  const [comentario, setComentario] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState('idle') // idle, saving, saved
  
  // Estados de beta
  const [joinedBeta, setJoinedBeta] = useState(false)
  const [joiningBeta, setJoiningBeta] = useState(false)
  
  // Estados para control de pruebas
  const [trialCount, setTrialCount] = useState(0)
  const [userDataEntered, setUserDataEntered] = useState(false)
  const [savedUserData, setSavedUserData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    empresa: ''
  })
  
  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Por favor, selecciona una imagen JPG, PNG o WEBP')
      return
    }
    
    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setErrorMessage('La imagen es demasiado grande. Máximo 10MB')
      return
    }
    
    // Crear preview y convertir a base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      setImagePreview(base64)
      setOriginalImage(base64)
      setErrorMessage('')
      // Trackear subida de foto
      trackPhotoUpload(file.type, file.size)
    }
    reader.readAsDataURL(file)
  }
  
  // Manejar drag & drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files[0]
    if (file && fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files
      handleFileSelect({ target: { files: [file] } })
    }
  }
  
  // Procesar foto
  const handleProcessPhoto = async () => {
    // Verificar límite de pruebas
    if (trialCount >= 3) {
      setErrorMessage('Has alcanzado el límite de 3 pruebas gratuitas. ¡Únete a la beta para más!')
      return
    }
    
    if (!originalImage) {
      setErrorMessage('Por favor, sube una foto')
      return
    }
    
    // Usar datos guardados o datos actuales
    const userData = userDataEntered ? savedUserData : {
      name,
      email,
      whatsapp,
      empresa
    }
    
    // Si es la primera vez, validar datos
    if (!userDataEntered) {
      if (!userData.name || !userData.whatsapp) {
        setErrorMessage('Por favor, completa tu nombre y WhatsApp')
        return
      }
      
      // Validar email si está presente
      if (userData.email && userData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          setErrorMessage('Por favor, ingresa un email válido')
          return
        }
      }
      
      // Guardar datos del usuario para futuras pruebas
      setSavedUserData(userData)
      setUserDataEntered(true)
    }
    
    setStatus('uploading')
    setErrorMessage('')
    
    // Trackear inicio de procesamiento
    trackPhotoProcessStart()
    const processStartTime = Date.now()
    
    try {
      // Preparar datos
      const imageData = originalImage.includes('data:') 
        ? originalImage 
        : `data:image/jpeg;base64,${originalImage}`
      
      const response = await fetch('/api/process-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          whatsapp: userData.whatsapp,
          email: userData.email || undefined,
          empresa: userData.empresa || undefined,
          image: imageData
        })
      })
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Error al procesar la foto')
      }
      
      // Guardar resultado
      setRecordId(data.recordId)
      setProcessedImage(data.processedImage)
      setStatus('completed')
      
      // Incrementar contador de pruebas
      setTrialCount(prev => prev + 1)
      
      // Trackear procesamiento exitoso
      const processingTime = Math.round((Date.now() - processStartTime) / 1000)
      trackPhotoProcessComplete(processingTime)
      
    } catch (error) {
      console.error('Error procesando foto:', error)
      setStatus('error')
      const errorMessage = error.message || 'Ocurrió un error al procesar tu foto. Por favor, intenta nuevamente.'
      setErrorMessage(errorMessage)
      
      // Trackear error de procesamiento
      trackPhotoProcessError(error.message)
    }
  }
  
  // Descargar foto procesada
  const handleDownload = () => {
    if (!processedImage) return
    
    // Trackear descarga
    trackPhotoDownload()
    
    const link = document.createElement('a')
    link.href = `data:image/jpeg;base64,${processedImage}`
    link.download = 'foto-mejorada-photoboost.jpg'
    link.click()
  }
  
  // Resetear para nueva foto
  const handleReset = () => {
    // Trackear intento de probar otra foto
    trackTryAnotherPhoto()
    
    setOriginalImage(null)
    setProcessedImage(null)
    setImagePreview(null)
    setStatus('idle')
    setRecordId(null)
    setErrorMessage('')
    setSliderPosition(50)
    setLeGusto('')
    setPagaria('')
    setWtp('')
    setComentario('')
    setFeedbackStatus('idle')
    setJoinedBeta(false)
    setJoiningBeta(false)
    
    // Solo resetear datos del usuario si no han sido guardados
    if (!userDataEntered) {
      setName('')
      setEmail('')
      setWhatsapp('')
      setEmpresa('')
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // Unirse a Beta
  const handleJoinBeta = async () => {
    if (!recordId) return
    
    setJoiningBeta(true)
    
    try {
      const response = await fetch('/api/update-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recordId,
          beta: true // Agregar el campo Beta como true
        })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al unirse a la beta')
      }
      
      setJoinedBeta(true)
      
      // Trackear unirse a beta desde demo
      trackJoinBetaFromDemo()
      
    } catch (error) {
      console.error('Error uniéndose a beta:', error)
      alert('Error al unirse a la beta. Por favor, intenta nuevamente.')
    } finally {
      setJoiningBeta(false)
    }
  }

  // Guardar feedback
  const handleSaveFeedback = async () => {
    if (!recordId) return
    
    setFeedbackStatus('saving')
    
    try {
      const response = await fetch('/api/update-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recordId,
          leGusto: leGusto || undefined,
          pagaria: pagaria || undefined,
          wtp: wtp || undefined,
          comentario: comentario || undefined
        })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar feedback')
      }
      
      setFeedbackStatus('saved')
      
      // Trackear envío de feedback
      if (leGusto) trackFeedbackSubmission('leGusto', leGusto)
      if (pagaria) trackFeedbackSubmission('pagaria', pagaria)
      if (wtp) trackFeedbackSubmission('wtp', wtp)
      if (comentario) trackFeedbackSubmission('comentario', 'provided')
      
      setTimeout(() => {
        setFeedbackStatus('idle')
      }, 3000)
      
    } catch (error) {
      console.error('Error guardando feedback:', error)
      setFeedbackStatus('idle')
      alert('Error al guardar tu feedback. Por favor, intenta nuevamente.')
    }
  }
  
  return (
    <section className="photo-demo" id="photo-demo">
      <div className="container">
        <div className="photo-demo-content">
          <h2 className="photo-demo-title">
            {userDataEntered ? `Prueba otra foto (${3 - trialCount} restantes)` : 'Prueba Gratis con Tu Foto'}
          </h2>
          <p className="photo-demo-subtitle">
            {userDataEntered 
              ? `Hola ${savedUserData.name}, sube otra foto y descubre cómo la mejoramos con IA`
              : 'Sube una foto de tu propiedad y descubre cómo la mejoramos con IA'
            }
          </p>
          
          {trialCount >= 3 && (
            <div className="trial-limit-message">
              <p>¡Has alcanzado el límite de 3 pruebas gratuitas!</p>
              <p>Únete a nuestra beta para procesar fotos ilimitadas:</p>
              <a href="#beta" className="btn-primary">
                🚀 Unirme a la Beta Gratis
              </a>
            </div>
          )}
          
          {/* Formulario de información */}
          {status === 'idle' && trialCount < 3 && (
            <motion.div 
              className="demo-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {!userDataEntered && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="whatsapp">WhatsApp *</label>
                    <input
                      type="tel"
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+54 9 11 1234-5678"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email (opcional)</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="empresa">Empresa (opcional)</label>
                      <input
                        type="text"
                        id="empresa"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Upload de foto */}
              <div className="upload-area">
                <div
                  className={`upload-box ${imagePreview ? 'has-image' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  
                  {imagePreview ? (
                    <div className="upload-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        className="btn-remove-image"
                        onClick={() => {
                          setImagePreview(null)
                          setOriginalImage(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <p>Arrastra tu foto aquí o haz clic para seleccionar</p>
                      <p className="upload-hint">JPG, PNG o WEBP - Máximo 10MB</p>
                      <button
                        className="btn-select-file"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Seleccionar Archivo
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              
              <button
                className="btn-primary btn-process"
                onClick={handleProcessPhoto}
                disabled={!originalImage || status === 'uploading'}
              >
                {status === 'uploading' ? 'Procesando...' : '✨ Mejorar con IA'}
              </button>
            </motion.div>
          )}

          {/* Estado de procesamiento */}
          {status === 'processing' && (
            <motion.div 
              className="processing-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="spinner"></div>
              <h3>Procesando con IA...</h3>
              <p>Esto puede tomar 10-20 segundos. ¡Estamos mejorando tu foto!</p>
            </motion.div>
          )}

          {/* Error */}
          {status === 'error' && (
            <motion.div 
              className="error-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="error-icon">⚠️</div>
              <h3>Error al procesar</h3>
              <p>{errorMessage}</p>
              <button className="btn-secondary" onClick={() => setStatus('idle')}>
                Intentar Nuevamente
              </button>
            </motion.div>
          )}

          {/* Resultado */}
          {status === 'completed' && originalImage && processedImage && (
            <motion.div 
              className="result-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="result-header">
                <h3>¡Tu foto está lista!</h3>
                <p>Desliza para comparar antes y después</p>
              </div>
              
              {/* Slider Before/After */}
              <div className="comparison-slider" ref={sliderRef}>
                <div className="image-after">
                  <img src={`data:image/jpeg;base64,${processedImage}`} alt="Después" />
                </div>
                <div className="image-before" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                  <img src={originalImage} alt="Antes" />
                </div>
                <div className="slider-line" style={{ left: `${sliderPosition}%` }}>
                  <div className="slider-button">
                    <div className="slider-arrows">↔</div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(e.target.value)}
                  className="slider-input"
                />
              </div>
              
              <div className="result-actions">
                <button className="btn-secondary" onClick={handleDownload}>
                  📥 Descargar Foto Mejorada
                </button>
                <button className="btn-secondary" onClick={handleReset}>
                  🔄 Probar Otra Foto
                </button>
              </div>
              
              {/* Oferta de Beta destacada después de ver el resultado */}
              {!joinedBeta ? (
                <div className="beta-conversion">
                  <div className="beta-conversion-content">
                    <h3>¿Te gustó el resultado?</h3>
                    <p>Unite a nuestra beta exclusiva y obtén:</p>
                    <ul>
                      <li>✓ Acceso anticipado a la plataforma</li>
                      <li>✓ Descuentos exclusivos al lanzamiento</li>
                      <li>✓ Soporte personalizado</li>
                      <li>✓ Nuevas funciones antes que nadie</li>
                    </ul>
                    <button 
                      className="btn-primary btn-join-beta"
                      onClick={handleJoinBeta}
                      disabled={joiningBeta}
                    >
                      {joiningBeta ? 'Uniéndote...' : '🚀 Sí, quiero unirme a la Beta Gratis'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="beta-success">
                  <div className="success-message">
                    <h3>✅ ¡Gracias por probarlo!</h3>
                    <p>Por favor ayúdanos respondiendo estas breves preguntas:</p>
                  </div>
                </div>
              )}
              
              {/* Feedback */}
              <div className="feedback-section">
                <h4>¿Qué te pareció?</h4>
                
                <div className="feedback-buttons">
                  <button
                    className={`feedback-btn ${leGusto === '😍 Me encantó' ? 'active' : ''}`}
                    onClick={() => {
                      setLeGusto('😍 Me encantó')
                      trackFeedbackSubmission('leGusto', '😍 Me encantó')
                    }}
                  >
                    😍 Me encantó
                  </button>
                  <button
                    className={`feedback-btn ${leGusto === '👍 Está bien' ? 'active' : ''}`}
                    onClick={() => {
                      setLeGusto('👍 Está bien')
                      trackFeedbackSubmission('leGusto', '👍 Está bien')
                    }}
                  >
                    👍 Está bien
                  </button>
                  <button
                    className={`feedback-btn ${leGusto === '👎 No me convenció' ? 'active' : ''}`}
                    onClick={() => {
                      setLeGusto('👎 No me convenció')
                      trackFeedbackSubmission('leGusto', '👎 No me convenció')
                    }}
                  >
                    👎 No me convenció
                  </button>
                </div>
                
                {/* Solo mostrar estas preguntas si le gustó el resultado */}
                {(leGusto === '😍 Me encantó' || leGusto === '👍 Está bien') && (
                  <div className="wtp-section">
                    <p className="wtp-question">¿Usarías esto para tus propiedades?</p>
                    <div className="wtp-buttons">
                      <button
                        className={`wtp-btn ${pagaria === 'Sí' ? 'active' : ''}`}
                        onClick={() => {
                          setPagaria('Sí')
                          trackFeedbackSubmission('pagaria', 'Sí')
                        }}
                      >
                        Sí
                      </button>
                      <button
                        className={`wtp-btn ${pagaria === 'Tal vez' ? 'active' : ''}`}
                        onClick={() => {
                          setPagaria('Tal vez')
                          trackFeedbackSubmission('pagaria', 'Tal vez')
                        }}
                      >
                        Tal vez
                      </button>
                      <button
                        className={`wtp-btn ${pagaria === 'No' ? 'active' : ''}`}
                        onClick={() => {
                          setPagaria('No')
                          trackFeedbackSubmission('pagaria', 'No')
                        }}
                      >
                        No
                      </button>
                    </div>
                    
                    {(pagaria === 'Sí' || pagaria === 'Tal vez') && (
                      <div className="wtp-amount">
                        <p>¿Cuánto pagarías por fotos de esta calidad?</p>
                        <div className="wtp-options">
                          {[5, 10, 15, 20].map(amount => (
                            <button
                              key={amount}
                              className={`wtp-option ${wtp === amount.toString() ? 'active' : ''}`}
                              onClick={() => {
                                setWtp(amount.toString())
                                trackFeedbackSubmission('wtp', `USD ${amount}`)
                              }}
                            >
                              USD {amount}
                            </button>
                          ))}
                          <input
                            type="number"
                            placeholder="Otro"
                            value={wtp && !['5', '10', '15', '20'].includes(wtp) ? wtp : ''}
                            onChange={(e) => {
                              setWtp(e.target.value)
                              if (e.target.value) {
                                trackFeedbackSubmission('wtp', `USD ${e.target.value}`)
                              }
                            }}
                            className="wtp-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="comment-section">
                  <label htmlFor="comentario">Comentario (opcional)</label>
                  <textarea
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="¿Algún comentario, sugerencia o pregunta?"
                    rows="4"
                  />
                </div>
                
                <div className="feedback-actions">
                  <button
                    className="btn-primary btn-save-feedback"
                    onClick={handleSaveFeedback}
                    disabled={feedbackStatus === 'saving' || feedbackStatus === 'saved'}
                  >
                    {feedbackStatus === 'saving' 
                      ? 'Guardando...' 
                      : feedbackStatus === 'saved' 
                      ? '✅ ¡Gracias!' 
                      : 'Enviar Comentario'}
                  </button>
                  
                  {feedbackStatus === 'saved' && !joinedBeta && (
                    <div className="post-feedback-message">
                      <p>¿Te gustó el resultado? ¡Unite a nuestra beta exclusiva!</p>
                      <a href="#beta" className="btn-secondary btn-beta-cta">
                        🚀 Ver Más Opciones Beta
                      </a>
                    </div>
                  )}
                  
                  {feedbackStatus === 'saved' && joinedBeta && (
                    <div className="post-feedback-message">
                      <p>¡Gracias por el feedback! Ya estás en nuestra beta.</p>
                      <p>Pronto nos contactaremos contigo. Cualquier consulta:</p>
                      <div className="contact-info">
                        <a href="https://wa.me/5491154854321" target="_blank" rel="noopener noreferrer" className="contact-link">
                          💬 WhatsApp
                        </a>
                        <a href="mailto:hello@photoboost.ai" className="contact-link">
                          📧 Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PhotoDemo
