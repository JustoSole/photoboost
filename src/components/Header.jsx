import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Header.css'

const Logo = () => (
  <svg width="180" height="35" viewBox="0 0 350 70" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
    <text x="0" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="50" fontWeight="500" fill="#000">Photo</text>
    <text x="160" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="50" fontWeight="700" fill="#000">Boost</text>
    <line x1="165" y1="58" x2="280" y2="58" stroke="#00C2FF" strokeWidth="4" strokeLinecap="round"/>
  </svg>
)

const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="header-logo">
            <Logo />
          </div>

          <nav className="header-nav">
            <a href="#how-it-works" className="nav-link">Cómo funciona</a>
            <a href="#examples" className="nav-link">Ejemplos</a>
            <a href="#beta" className="nav-link">Beta exclusiva</a>
          </nav>

          <a href="#beta" className="btn btn-primary">
            Unirme a la beta
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
