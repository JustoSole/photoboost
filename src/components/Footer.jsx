import { FiMail } from 'react-icons/fi'
import { SiWhatsapp } from 'react-icons/si'
import './Footer.css'

const Logo = () => (
  <svg width="240" height="45" viewBox="0 0 350 70" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
    <text x="0" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="50" fontWeight="500" fill="#FFF">Photo</text>
    <text x="160" y="50" fontFamily="Inter, system-ui, sans-serif" fontSize="50" fontWeight="700" fill="#FFF">Boost</text>
    <line x1="165" y1="58" x2="280" y2="58" stroke="#00C2FF" strokeWidth="4" strokeLinecap="round"/>
  </svg>
)

const Footer = () => {
  const whatsappNumber = '549294480651'
  const whatsappMessage = encodeURIComponent('Hola, me gustaría conocer más sobre PhotoBoost')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Logo />
            <p>© 2025 PhotoBoost — IA aplicada al real estate</p>
          </div>

          <div className="footer-developer">
            <p className="developer-label">Desarrollado por</p>
            <a 
              href="https://b3innovationgroup.com/" 
              className="developer-name-link"
              target="_blank"
              rel="noopener noreferrer"
              title="Visitar B3innovationgroup"
            >
              B3innovationgroup
            </a>
            <div className="developer-contact">
              <a 
                href="mailto:sales@b3innovationgroup.com" 
                className="developer-link"
                title="Contactar por email"
              >
                <FiMail className="contact-icon" />
                sales@b3innovationgroup.com
              </a>
              <a 
                href={whatsappLink}
                className="developer-link whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                title="Contactar por WhatsApp"
              >
                <SiWhatsapp className="contact-icon" />
                +54 9 2944 806519
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

