import React, { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import PainSection from './components/PainSection'
import HowItWorks from './components/HowItWorks'
import SalesBoost from './components/SalesBoost'
import Testimonials from './components/Testimonials'
import BetaOffer from './components/BetaOffer'
import PhotoDemo from './components/PhotoDemo'
import Footer from './components/Footer'
import MobileCTA from './components/MobileCTA'
import { initializeAutoTracking } from './utils/analytics'
import './App.css'

function App() {
  useEffect(() => {
    // Inicializar tracking automático de scroll y tiempo en página
    const cleanup = initializeAutoTracking()
    
    // Cleanup al desmontar
    return cleanup
  }, [])

  return (
    <div className="app">
      <Header />
      <Hero />
      <PainSection />
      <HowItWorks />
      <PhotoDemo />
      <SalesBoost />
      <Testimonials />
      <BetaOffer />
      <Footer />
      <MobileCTA />
    </div>
  )
}

export default App

