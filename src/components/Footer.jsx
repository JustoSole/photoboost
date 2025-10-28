import { FiMail } from 'react-icons/fi'
import { RiWhatsappFill } from 'react-icons/ri'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>PhotoBoost</h3>
            <p>IA aplicada al real estate</p>
          </div>

          <div className="footer-links">
            <a href="#beta" className="footer-link">
              Beta gratuita
            </a>
            <a href="#pricing" className="footer-link">
              Precios
            </a>
            <a href="#how-it-works" className="footer-link">
              Cómo funciona
            </a>
          </div>

          <div className="footer-contact">
            <a 
              href="https://wa.me/542944806519" 
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiWhatsappFill className="contact-icon" />
              WhatsApp directo
            </a>
            <a 
              href="mailto:info@photoboost.ai" 
              className="contact-link"
            >
              <FiMail className="contact-icon" />
              info@photoboost.ai
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 PhotoBoost — IA aplicada al real estate.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacidad</a>
            <span>•</span>
            <a href="#terms">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

