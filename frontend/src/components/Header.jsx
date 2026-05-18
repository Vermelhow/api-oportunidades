import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

export default function Header() {
  const { user, signed, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🌟</span>
          <span className="logo-text">Oportunidades</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/oportunidades" className="nav-link">Oportunidades</Link>
          {signed && (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          )}
        </nav>

        <div className="header-actions">
          {signed ? (
            <>
              <div className="user-info">
                <span className="user-name">Olá, {user?.nome?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <button className="btn btn-primary">Cadastrar</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
