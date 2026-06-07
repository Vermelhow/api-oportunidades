import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { 
      icon: '📋', 
      label: 'Oportunidades', 
      value: '24', 
      change: '+12%',
      trend: 'up',
      color: '#3b82f6',
      description: 'Total de vagas ativas' 
    },
    { 
      icon: '🏢', 
      label: 'Organizações', 
      value: '15', 
      change: '+5',
      trend: 'up',
      color: '#10b981',
      description: 'Parceiros cadastrados' 
    },
    { 
      icon: '👥', 
      label: 'Candidatos', 
      value: '87', 
      change: '+23%',
      trend: 'up',
      color: '#f59e0b',
      description: 'Usuários registrados' 
    },
    { 
      icon: '❤️', 
      label: 'Interesses', 
      value: '156', 
      change: '+18%',
      trend: 'up',
      color: '#ef4444',
      description: 'Candidaturas realizadas' 
    },
  ];

  const insights = [
    { 
      icon: '📈', 
      title: 'Taxa de Conversão', 
      value: '34%', 
      description: 'Candidatos que se inscreveram',
      color: '#3b82f6',
      trend: 'positive'
    },
    { 
      icon: '⚡', 
      title: 'Tempo Médio', 
      value: '2.5 dias', 
      description: 'Para preencher uma vaga',
      color: '#10b981',
      trend: 'positive'
    },
    { 
      icon: '🎯', 
      title: 'Match Rate', 
      value: '78%', 
      description: 'Compatibilidade média',
      color: '#8b5cf6',
      trend: 'positive'
    },
  ];

  const quickActions = [
    { 
      icon: '➕', 
      label: 'Nova Oportunidade', 
      path: '/admin/oportunidades/nova', 
      color: '#3b82f6',
      description: 'Cadastrar nova vaga' 
    },
    { 
      icon: '🏢', 
      label: 'Nova Organização', 
      path: '/admin/organizacoes', 
      color: '#10b981',
      description: 'Adicionar parceiro' 
    },
    { 
      icon: '📊', 
      label: 'Ver Relatórios', 
      path: '/admin/oportunidades', 
      color: '#8b5cf6',
      description: 'Analytics e métricas' 
    },
    { 
      icon: '⚙️', 
      label: 'Configurações', 
      path: '/admin/categorias', 
      color: '#f59e0b',
      description: 'Sistema e categorias' 
    },
  ];

  const alerts = [
    { 
      icon: '🔔', 
      text: '5 novas candidaturas pendentes de análise', 
      type: 'info',
      action: 'Ver todas',
      link: '/admin/oportunidades'
    },
    { 
      icon: '⚠️', 
      text: '3 oportunidades próximas do prazo de encerramento', 
      type: 'warning',
      action: 'Revisar',
      link: '/admin/oportunidades'
    },
  ];

  const recentActivities = [
    { 
      icon: '📋', 
      text: 'Oportunidade "Voluntário em Educação" publicada', 
      time: 'Há 1 hora', 
      color: '#3b82f6',
      user: 'Sistema'
    },
    { 
      icon: '❤️', 
      text: 'Nova candidatura para "Projeto Social Comunitário"', 
      time: 'Há 2 horas', 
      color: '#ef4444',
      user: 'Maria Silva'
    },
    { 
      icon: '🏢', 
      text: 'Organização "Instituto Crescer" atualizada', 
      time: 'Há 5 horas', 
      color: '#10b981',
      user: 'Admin'
    },
    { 
      icon: '👥', 
      text: 'Novo usuário "João Santos" cadastrado', 
      time: 'Há 1 dia', 
      color: '#f59e0b',
      user: 'Sistema'
    },
    { 
      icon: '✅', 
      text: 'Candidatura aprovada para "Apoio a Idosos"', 
      time: 'Há 1 dia', 
      color: '#10b981',
      user: 'Coordenador'
    },
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
                <div className="stat-row">
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className={`stat-badge ${stat.trend}`}>
                    {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                  </span>
                </div>
                <p className="stat-description">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="section insights-section">
          <h2 className="section-title">💡 Insights e Métricas</h2>
          <div className="insights-grid">
            {insights.map((insight, idx) => (
              <div key={idx} className="insight-card" style={{ '--insight-color': insight.color }}>
                <div className="insight-header">
                  <span className="insight-icon">{insight.icon}</span>
                  <span className="insight-trend">{insight.trend === 'positive' ? '📈' : '📉'}</span>
                </div>
                <h3 className="insight-title">{insight.title}</h3>
                <div className="insight-value">{insight.value}</div>
                <p className="insight-description">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="section alerts-section">
            <h2 className="section-title">🔔 Alertas e Notificações</h2>
            <div className="alerts-container">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`alert-card alert-${alert.type}`}>
                  <span className="alert-icon">{alert.icon}</span>
                  <div className="alert-content">
                    <p className="alert-text">{alert.text}</p>
                    {alert.action && (
                      <Link to={alert.link} className="alert-action">
                        {alert.action} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                <div className="action-content">
                  <span className="action-label">{action.label}</span>
                  <span className="action-description">{action.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">🕒 Atividades Recentes</h2>
            <Link to="/admin/oportunidades" className="section-link">
              Ver todas →
            </Link>
          </div>
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
                  <div className="activity-meta">
                    <span className="activity-time">{activity.time}</span>
                    <span className="activity-separator">•</span>
                    <span className="activity-user">{activity.user}</span>
                  </div>
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
