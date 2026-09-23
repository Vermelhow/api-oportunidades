import { useId, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFocusTrap from '../hooks/useFocusTrap';
import '../styles/Header.css';

export default function Header() {
  const { user, signed, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuId = useId();
  const mobileMenuId = useId();

  // Enquanto abertos: move o foco para dentro, prende Tab/Shift+Tab,
  // fecha com Escape e devolve o foco ao botão que abriu o menu
  const userMenuRef = useFocusTrap(userMenuOpen, closeUserMenu);
  const mobileMenuRef = useFocusTrap(mobileMenuOpen, closeMobileMenu);

  function currentPage(path) {
    return location.pathname === path ? 'page' : undefined;
  }

  function handleLogout() {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function toggleUserMenu() {
    setUserMenuOpen(!userMenuOpen);
  }

  function closeUserMenu() {
    setUserMenuOpen(false);
  }

  function handleLogoutDesktop() {
    logout();
    navigate('/');
    closeUserMenu();
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🌟</span>
          <span className="logo-text">Oportunidades</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className="nav-link" aria-current={currentPage('/')}>Home</Link>
          <Link to="/oportunidades" className="nav-link" aria-current={currentPage('/oportunidades')}>Oportunidades</Link>
          {signed && (
            <Link to="/dashboard" className="nav-link" aria-current={currentPage('/dashboard')}>Dashboard</Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions desktop-actions">
          {signed ? (
            <div className="user-menu-wrapper">
              <button
                onClick={toggleUserMenu}
                className="user-menu-trigger"
                aria-expanded={userMenuOpen}
                aria-controls={userMenuId}
              >
                <span className="user-avatar">👤</span>
                <span className="user-name">Olá, {user?.nome?.split(' ')[0]}</span>
                <span className="dropdown-arrow" aria-hidden="true">{userMenuOpen ? '▲' : '▼'}</span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="user-menu-overlay" onClick={closeUserMenu}></div>
                  <div className="user-menu-dropdown" id={userMenuId} ref={userMenuRef}>
                    <Link to="/perfil" className="dropdown-item" onClick={closeUserMenu} aria-current={currentPage('/perfil')}>
                      <span className="dropdown-icon">👤</span>
                      Meu Perfil
                    </Link>
                    <Link to="/dashboard" className="dropdown-item" onClick={closeUserMenu} aria-current={currentPage('/dashboard')}>
                      <span className="dropdown-icon">📊</span>
                      Dashboard
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogoutDesktop} className="dropdown-item dropdown-logout">
                      <span className="dropdown-icon">🚪</span>
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/cadastro" className="btn btn-primary">Cadastrar</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-button ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls={mobileMenuId}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu */}
      <nav
        id={mobileMenuId}
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        ref={mobileMenuRef}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-menu-header">
          {signed && user && (
            <div className="mobile-user-info">
              <span className="mobile-user-avatar">👤</span>
              <div>
                <p className="mobile-user-name">{user.nome}</p>
                <p className="mobile-user-email">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mobile-menu-links">
          <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu} aria-current={currentPage('/')}>
            <span className="mobile-link-icon">🏠</span>
            Home
          </Link>
          <Link to="/oportunidades" className="mobile-nav-link" onClick={closeMobileMenu} aria-current={currentPage('/oportunidades')}>
            <span className="mobile-link-icon">📋</span>
            Oportunidades
          </Link>
          {signed && (
            <>
              <Link to="/perfil" className="mobile-nav-link" onClick={closeMobileMenu} aria-current={currentPage('/perfil')}>
                <span className="mobile-link-icon">👤</span>
                Meu Perfil
              </Link>
              <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu} aria-current={currentPage('/dashboard')}>
                <span className="mobile-link-icon">📊</span>
                Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="mobile-menu-actions">
          {signed ? (
            <button onClick={handleLogout} className="btn btn-outline btn-block">
              🚪 Sair
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-block" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/cadastro" className="btn btn-primary btn-block" onClick={closeMobileMenu}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
