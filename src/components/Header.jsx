import { useState, useEffect } from 'react'
import './Header.css'

const Logo = () => (
  <svg width="180" height="35" viewBox="0 0 350 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
    <text x="0" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="50" fontWeight="500" fill="#000">Photo</text>
    <text x="160" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="50" fontWeight="700" fill="#000">Boost</text>
    <line x1="165" y1="58" x2="280" y2="58" stroke="#00C2FF" strokeWidth="4" strokeLinecap="round"/>
  </svg>
)

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = (e) => {
    e.stopPropagation()
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Close mobile menu on outside click or window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.header')) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="#beneficios" className="nav-link">Beneficios</a>
            <a href="#how-it-works" className="nav-link">Cómo funciona</a>
            <a href="#testimonios" className="nav-link">Testimonios</a>
            <a href="#beta" className="nav-link">Beta</a>
          </nav>

          {/* Desktop CTA */}
          <div className="desktop-cta-wrapper">
            <a href="#photo-demo" className="btn btn-primary desktop-cta">
              Probar ahora gratis
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#beneficios" className="mobile-nav-link" onClick={handleNavClick}>Beneficios</a>
          <a href="#how-it-works" className="mobile-nav-link" onClick={handleNavClick}>Cómo funciona</a>
          <a href="#testimonios" className="mobile-nav-link" onClick={handleNavClick}>Testimonios</a>
          <a href="#beta" className="mobile-nav-link" onClick={handleNavClick}>Beta</a>
          <div className="mobile-nav-cta-wrapper">
            <a href="#photo-demo" className="btn btn-primary mobile-nav-cta" onClick={handleNavClick}>
              Probar ahora gratis
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header