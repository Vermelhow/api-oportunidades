import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Sync collapsed state with body class for layout adjustments
  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isCollapsed]);

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
        { path: '/admin/oportunidades', icon: '📋', label: 'Oportunidades', description: 'Listar e gerenciar' },
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
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        <span className="toggle-icon">{isCollapsed ? '▶' : '◀'}</span>
      </button>

      {/* User Info */}
      <div className="sidebar-header">
        <div className="user-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        {!isCollapsed && (
          <div className="user-details">
            <h3 className="user-name">{user?.nome || 'Usuário'}</h3>
            <p className="user-role">Administrador</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((section, idx) => (
          <div key={idx} className="nav-section">
            {!isCollapsed && (
              <h4 className="nav-section-title">{section.section}</h4>
            )}
            <ul className="nav-list">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive(item.path)}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout" title={isCollapsed ? 'Sair' : ''}>
          <span className="logout-icon">🚪</span>
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
