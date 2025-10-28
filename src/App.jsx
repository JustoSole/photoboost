import React from 'react'
import Hero from './components/Hero'
import PainSection from './components/PainSection'
import HowItWorks from './components/HowItWorks'
import VisualResults from './components/VisualResults'
import CostComparison from './components/CostComparison'
import Pricing from './components/Pricing'
import BetaOffer from './components/BetaOffer'
import Footer from './components/Footer'
import MobileCTA from './components/MobileCTA'
import './App.css'

function App() {
  return (
    <div className="app">
      <Hero />
      <PainSection />
      <HowItWorks />
      <VisualResults />
      <CostComparison />
      <Pricing />
      <BetaOffer />
      <Footer />
      <MobileCTA />
    </div>
  )
}

export default App

