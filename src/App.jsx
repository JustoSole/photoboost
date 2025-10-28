import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import PainSection from './components/PainSection'
import HowItWorks from './components/HowItWorks'
import SalesBoost from './components/SalesBoost'
import Testimonials from './components/Testimonials'
import BetaOffer from './components/BetaOffer'
import Footer from './components/Footer'
import MobileCTA from './components/MobileCTA'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <PainSection />
      <HowItWorks />
      <SalesBoost />
      <Testimonials />
      <BetaOffer />
      <Footer />
      <MobileCTA />
    </div>
  )
}

export default App

