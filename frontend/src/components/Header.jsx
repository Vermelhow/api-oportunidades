import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

export default function Header() {
  const { user, signed, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🌟</span>
          <span className="logo-text">Oportunidades</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/oportunidades" className="nav-link">Oportunidades</Link>
          {signed && (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions desktop-actions">
          {signed ? (
            <>
              <Link to="/perfil" className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">Olá, {user?.nome?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline">
                Sair
              </button>
            </>
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
      <nav className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
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
          <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
            <span className="mobile-link-icon">🏠</span>
            Home
          </Link>
          <Link to="/oportunidades" className="mobile-nav-link" onClick={closeMobileMenu}>
            <span className="mobile-link-icon">📋</span>
            Oportunidades
          </Link>
          {signed && (
            <>
              <Link to="/perfil" className="mobile-nav-link" onClick={closeMobileMenu}>
                <span className="mobile-link-icon">👤</span>
                Meu Perfil
              </Link>
              <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
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
