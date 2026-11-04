import { useId } from 'react';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const quickLinksHeadingId = useId();

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

          {/* Região de navegação nomeada pelo próprio título visível: distingue este
              <nav> da navegação do cabeçalho sem repetir texto para leitores de tela */}
          <nav className="footer-section footer-nav" aria-labelledby={quickLinksHeadingId}>
            <h4 className="footer-heading" id={quickLinksHeadingId}>Links Rápidos</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/oportunidades">Oportunidades</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </nav>

          <div className="footer-section">
            <h4 className="footer-heading">Contato</h4>
            <ul className="footer-links">
              <li><span aria-hidden="true">📧</span> contato@oportunidades.com</li>
              <li><span aria-hidden="true">📱</span> (11) 99999-9999</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} API Oportunidades. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
