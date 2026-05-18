import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Oportunidades</h3>
            <p className="footer-description">
              Conectando pessoas a ações sociais que transformam comunidades.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Links Rápidos</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/oportunidades">Oportunidades</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contato</h4>
            <ul className="footer-links">
              <li>📧 contato@oportunidades.com</li>
              <li>📱 (11) 99999-9999</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Redes Sociais</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} API Oportunidades. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
