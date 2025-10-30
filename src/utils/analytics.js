// Google Analytics Event Tracking Utilities

/**
 * Envía un evento a Google Analytics
 * @param {string} eventName - Nombre del evento
 * @param {object} params - Parámetros adicionales del evento
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
    console.log('📊 Analytics Event:', eventName, params)
  }
}

/**
 * Trackea clicks en CTAs
 * @param {string} ctaName - Nombre del CTA
 * @param {string} location - Ubicación del CTA en la página
 */
export const trackCTAClick = (ctaName, location) => {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
    cta_location: location
  })
}

/**
 * Trackea views de secciones importantes
 * @param {string} sectionName - Nombre de la sección
 */
export const trackSectionView = (sectionName) => {
  trackEvent('section_view', {
    event_category: 'engagement',
    event_label: sectionName
  })
}

/**
 * Trackea interacciones con el slider de comparación
 * @param {number} imageIndex - Índice de la imagen vista
 */
export const trackComparisonInteraction = (imageIndex) => {
  trackEvent('comparison_interaction', {
    event_category: 'engagement',
    event_label: 'image_slider',
    image_index: imageIndex
  })
}

/**
 * Trackea la profundidad de scroll
 * @param {number} percentage - Porcentaje de scroll (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage) => {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    event_label: `${percentage}%`,
    value: percentage
  })
}

/**
 * Trackea clicks en planes de pricing
 * @param {string} planName - Nombre del plan
 * @param {number} price - Precio del plan
 */
export const trackPricingClick = (planName, price) => {
  trackEvent('pricing_plan_click', {
    event_category: 'conversion',
    event_label: planName,
    value: price
  })
}

/**
 * Trackea el envío exitoso del formulario
 * @param {object} formData - Datos del formulario (sin info sensible)
 */
export const trackFormSubmission = (formData = {}) => {
  trackEvent('form_submission', {
    event_category: 'conversion',
    event_label: 'beta_signup',
    business_size: formData.businessSize || 'not_specified',
    monthly_photos: formData.monthlyPhotos || 'not_specified'
  })
}

/**
 * Trackea tiempo de permanencia en la página
 * @param {number} seconds - Segundos en la página
 */
export const trackTimeOnPage = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  trackEvent('time_on_page', {
    event_category: 'engagement',
    event_label: `${minutes} minutes`,
    value: seconds
  })
}

/**
 * Trackea cuando el usuario sube una foto para probar
 * @param {string} fileType - Tipo de archivo (image/jpeg, etc.)
 * @param {number} fileSize - Tamaño del archivo en bytes
 */
export const trackPhotoUpload = (fileType, fileSize) => {
  trackEvent('photo_upload', {
    event_category: 'free_trial',
    event_label: 'photo_uploaded',
    file_type: fileType,
    file_size_kb: Math.round(fileSize / 1024)
  })
}

/**
 * Trackea cuando el usuario inicia el procesamiento de una foto
 */
export const trackPhotoProcessStart = () => {
  trackEvent('photo_process_start', {
    event_category: 'free_trial',
    event_label: 'processing_initiated'
  })
}

/**
 * Trackea cuando el procesamiento de la foto se completa exitosamente
 * @param {number} processingTime - Tiempo de procesamiento en segundos
 */
export const trackPhotoProcessComplete = (processingTime) => {
  trackEvent('photo_process_complete', {
    event_category: 'conversion',
    event_label: 'free_trial_success',
    value: processingTime
  })
}

/**
 * Trackea cuando hay un error procesando la foto
 * @param {string} errorType - Tipo de error
 */
export const trackPhotoProcessError = (errorType) => {
  trackEvent('photo_process_error', {
    event_category: 'free_trial',
    event_label: errorType
  })
}

/**
 * Trackea cuando el usuario descarga la foto mejorada
 */
export const trackPhotoDownload = () => {
  trackEvent('photo_download', {
    event_category: 'conversion',
    event_label: 'photo_downloaded'
  })
}

/**
 * Trackea cuando el usuario decide probar otra foto (reset)
 */
export const trackTryAnotherPhoto = () => {
  trackEvent('try_another_photo', {
    event_category: 'free_trial',
    event_label: 'reset_to_upload'
  })
}

/**
 * Trackea cuando el usuario se une a la beta desde PhotoDemo
 */
export const trackJoinBetaFromDemo = () => {
  trackEvent('join_beta_from_demo', {
    event_category: 'conversion',
    event_label: 'beta_signup_after_trial'
  })
}

/**
 * Trackea cuando el usuario envía feedback después de probar la foto
 * @param {string} feedbackType - Tipo de feedback (leGusto, pagaria, etc.)
 * @param {string} value - Valor del feedback
 */
export const trackFeedbackSubmission = (feedbackType, value) => {
  trackEvent('feedback_submission', {
    event_category: 'free_trial',
    event_label: feedbackType,
    feedback_value: value
  })
}

/**
 * Inicializa los trackers automáticos de scroll y tiempo
 */
export const initializeAutoTracking = () => {
  // Track scroll depth
  let scrollMilestones = { 25: false, 50: false, 75: false, 100: false }
  
  const handleScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    
    Object.keys(scrollMilestones).forEach(milestone => {
      if (scrollPercentage >= milestone && !scrollMilestones[milestone]) {
        scrollMilestones[milestone] = true
        trackScrollDepth(parseInt(milestone))
      }
    })
  }

  // Track time on page (cada 30 segundos)
  let timeOnPage = 0
  const timeInterval = setInterval(() => {
    timeOnPage += 30
    trackTimeOnPage(timeOnPage)
  }, 30000)

  // Agregar event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll)
    clearInterval(timeInterval)
  }
}

