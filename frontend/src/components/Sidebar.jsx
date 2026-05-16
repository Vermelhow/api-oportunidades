import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      logout();
    }
  };

  const menuItems = [
    {
      section: 'Principal',
      items: [
        { path: '/dashboard', icon: '🏠', label: 'Dashboard', description: 'Visão geral' },
        { path: '/oportunidades', icon: '🔍', label: 'Oportunidades', description: 'Explorar' },
      ]
    },
    {
      section: 'Gerenciamento',
      items: [
        { path: '/admin/oportunidades', icon: '📋', label: 'Oportunidades', description: 'Cadastrar e editar' },
        { path: '/admin/organizacoes', icon: '🏢', label: 'Organizações', description: 'Gerenciar organizações' },
        { path: '/admin/categorias', icon: '🏷️', label: 'Categorias', description: 'Gerenciar categorias' },
        { path: '/admin/pessoas', icon: '👥', label: 'Pessoas', description: 'Gerenciar usuários' },
      ]
    },
    {
      section: 'Pessoal',
      items: [
        { path: '/meus-interesses', icon: '❤️', label: 'Meus Interesses', description: 'Candidaturas' },
        { path: '/perfil', icon: '👤', label: 'Meu Perfil', description: 'Editar informações' },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {/* User Info */}
      <div className="sidebar-header">
        <div className="user-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="user-details">
          <h3 className="user-name">{user?.nome || 'Usuário'}</h3>
          <p className="user-role">Administrador</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((section, idx) => (
          <div key={idx} className="nav-section">
            <h4 className="nav-section-title">{section.section}</h4>
            <ul className="nav-list">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive(item.path)}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          <span className="logout-icon">🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
