import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: '📋', label: 'Oportunidades', value: '12', color: '#3b82f6' },
    { icon: '🏢', label: 'Organizações', value: '8', color: '#10b981' },
    { icon: '👥', label: 'Pessoas', value: '45', color: '#f59e0b' },
    { icon: '❤️', label: 'Interesses', value: '23', color: '#ef4444' },
  ];

  const quickActions = [
    { icon: '➕', label: 'Nova Oportunidade', path: '/admin/oportunidades', color: '#3b82f6' },
    { icon: '🏢', label: 'Nova Organização', path: '/admin/organizacoes', color: '#10b981' },
    { icon: '🏷️', label: 'Nova Categoria', path: '/admin/categorias', color: '#f59e0b' },
    { icon: '👤', label: 'Novo Usuário', path: '/admin/pessoas', color: '#8b5cf6' },
  ];

  const recentActivities = [
    { icon: '📋', text: 'Oportunidade "Voluntário em ONG" criada', time: 'Há 2 horas', color: '#3b82f6' },
    { icon: '🏢', text: 'Organização "Instituto ABC" atualizada', time: 'Há 5 horas', color: '#10b981' },
    { icon: '❤️', text: 'Novo interesse em "Projeto Social"', time: 'Há 1 dia', color: '#ef4444' },
    { icon: '👥', text: 'Usuário "João Silva" cadastrado', time: 'Há 2 dias', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Administrativo</h1>
            <p className="dashboard-subtitle">
              Bem-vindo de volta, <strong>{user?.nome}</strong>! 👋
            </p>
          </div>
          <div className="header-actions">
            <Link to="/oportunidades" className="btn btn-outline">
              🔍 Explorar Oportunidades
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card" style={{ '--stat-color': stat.color }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2 className="section-title">⚡ Ações Rápidas</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, idx) => (
              <Link 
                key={idx} 
                to={action.path} 
                className="quick-action-card"
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon">{action.icon}</div>
                <span className="action-label">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2 className="section-title">🕒 Atividades Recentes</h2>
          <div className="activity-list">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div 
                  className="activity-icon" 
                  style={{ backgroundColor: activity.color + '20', color: activity.color }}
                >
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="section">
          <h2 className="section-title">👤 Suas Informações</h2>
          <div className="user-info-card">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nome Completo</span>
                <span className="info-value">{user?.nome}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID do Usuário</span>
                <span className="info-value">#{user?.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Função</span>
                <span className="info-value">Administrador</span>
              </div>
            </div>
            <div className="info-actions">
              <Link to="/perfil" className="btn btn-primary">
                ✏️ Editar Perfil
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
