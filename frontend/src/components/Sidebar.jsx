import { useState, useEffect, useId } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFocusTrap from '../hooks/useFocusTrap';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarId = useId();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Enquanto o menu mobile estiver aberto: move o foco para dentro,
  // prende Tab/Shift+Tab, fecha com Escape e devolve o foco ao botão que abriu
  const sidebarRef = useFocusTrap(isMobileMenuOpen, closeMobileMenu);

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

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button" 
        onClick={toggleMobileMenu}
        aria-label="Abrir menu"
        title="Abrir menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls={sidebarId}
      >
        <span className="menu-icon">☰</span>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside
        id={sidebarId}
        ref={sidebarRef}
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      >
      {/* Toggle Button */}
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        aria-expanded={!isCollapsed}
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
                    aria-current={location.pathname === item.path ? 'page' : undefined}
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
    </>
  );
}
