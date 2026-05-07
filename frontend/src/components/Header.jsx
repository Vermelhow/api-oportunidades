import { Link } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
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
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <button className="btn btn-primary">Cadastrar</button>
        </div>
      </div>
    </header>
  );
}
