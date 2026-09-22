import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Loading, ErrorMessage } from '../components';
import {
  getOportunidades,
  getOrganizacoes,
  getPessoas,
  getInteresses,
  getCategorias,
} from '../services/api';
import '../styles/Dashboard.css';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const data = new Date(dateString);
  const diffMs = Date.now() - data.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Agora mesmo';
  if (diffMin < 60) return `Há ${diffMin} min`;
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `Há ${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias < 30) return `Há ${diffDias} dia${diffDias !== 1 ? 's' : ''}`;
  return data.toLocaleDateString('pt-BR');
}

const quickActions = [
  {
    icon: '➕',
    label: 'Nova Oportunidade',
    path: '/admin/oportunidades/nova',
    color: '#3b82f6',
    description: 'Cadastrar nova vaga',
  },
  {
    icon: '🏢',
    label: 'Nova Organização',
    path: '/admin/organizacoes/nova',
    color: '#10b981',
    description: 'Adicionar parceiro',
  },
  {
    icon: '🏷️',
    label: 'Categorias',
    path: '/admin/categorias',
    color: '#8b5cf6',
    description: 'Gerenciar categorias',
  },
  {
    icon: '👥',
    label: 'Pessoas',
    path: '/admin/pessoas',
    color: '#f59e0b',
    description: 'Ver pessoas cadastradas',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      setError(null);

      const [oportResp, orgResp, pessoasResp, interessesResp, categoriasResp] = await Promise.all([
        getOportunidades(),
        getOrganizacoes(),
        getPessoas(),
        getInteresses(),
        getCategorias(),
      ]);

      setDados({
        oportunidades: oportResp?.data || oportResp || [],
        organizacoes: orgResp?.data || orgResp || [],
        pessoas: pessoasResp?.data || pessoasResp || [],
        interesses: interessesResp?.data || interessesResp || [],
        categorias: categoriasResp?.data || categoriasResp || [],
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    if (!dados) return [];

    const oportunidadesAtivas = dados.oportunidades.filter((o) => o.status === 'ativa').length;
    const interessesPendentes = dados.interesses.filter((i) => i.status === 'pendente').length;

    return [
      {
        icon: '📋',
        label: 'Oportunidades',
        value: dados.oportunidades.length,
        color: '#3b82f6',
        description: `${oportunidadesAtivas} ativa${oportunidadesAtivas !== 1 ? 's' : ''}`,
      },
      {
        icon: '🏢',
        label: 'Organizações',
        value: dados.organizacoes.length,
        color: '#10b981',
        description: 'Parceiros cadastrados',
      },
      {
        icon: '👥',
        label: 'Pessoas',
        value: dados.pessoas.length,
        color: '#f59e0b',
        description: 'Usuários registrados',
      },
      {
        icon: '❤️',
        label: 'Interesses',
        value: dados.interesses.length,
        color: '#ef4444',
        description: `${interessesPendentes} pendente${interessesPendentes !== 1 ? 's' : ''}`,
      },
    ];
  }, [dados]);

  const insights = useMemo(() => {
    if (!dados) return [];

    const totalOportunidades = dados.oportunidades.length;
    const totalInteresses = dados.interesses.length;
    const aceitos = dados.interesses.filter((i) => i.status === 'aceito').length;

    const mediaInteressesPorOportunidade = totalOportunidades > 0
      ? (totalInteresses / totalOportunidades).toFixed(1)
      : '0';

    const taxaAceite = totalInteresses > 0
      ? `${Math.round((aceitos / totalInteresses) * 100)}%`
      : '—';

    return [
      {
        icon: '📈',
        title: 'Engajamento Médio',
        value: mediaInteressesPorOportunidade,
        description: 'Interesses por oportunidade',
        color: '#3b82f6',
      },
      {
        icon: '✅',
        title: 'Taxa de Aceite',
        value: taxaAceite,
        description: 'Interesses aceitos pelas organizações',
        color: '#10b981',
      },
      {
        icon: '🏷️',
        title: 'Categorias',
        value: dados.categorias.length,
        description: 'Categorias cadastradas',
        color: '#8b5cf6',
      },
    ];
  }, [dados]);

  const alerts = useMemo(() => {
    if (!dados) return [];

    const lista = [];
    const interessesPendentes = dados.interesses.filter((i) => i.status === 'pendente').length;

    if (interessesPendentes > 0) {
      lista.push({
        icon: '🔔',
        text: `${interessesPendentes} interesse${interessesPendentes !== 1 ? 's' : ''} pendente${interessesPendentes !== 1 ? 's' : ''} de análise`,
        type: 'info',
        action: 'Ver oportunidades',
        link: '/admin/oportunidades',
      });
    }

    const hoje = new Date();
    const em7Dias = new Date();
    em7Dias.setDate(hoje.getDate() + 7);
    const encerrandoEmBreve = dados.oportunidades.filter((o) => {
      if (o.status !== 'ativa' || !o.data_fim) return false;
      const dataFim = new Date(o.data_fim);
      return dataFim >= hoje && dataFim <= em7Dias;
    }).length;

    if (encerrandoEmBreve > 0) {
      lista.push({
        icon: '⚠️',
        text: `${encerrandoEmBreve} oportunidade${encerrandoEmBreve !== 1 ? 's' : ''} próxima${encerrandoEmBreve !== 1 ? 's' : ''} do prazo de encerramento`,
        type: 'warning',
        action: 'Revisar',
        link: '/admin/oportunidades',
      });
    }

    if (dados.categorias.length === 0) {
      lista.push({
        icon: '⚠️',
        text: 'Nenhuma categoria cadastrada ainda',
        type: 'warning',
        action: 'Cadastrar categoria',
        link: '/admin/categorias',
      });
    }

    if (dados.organizacoes.length === 0) {
      lista.push({
        icon: '⚠️',
        text: 'Nenhuma organização cadastrada ainda',
        type: 'warning',
        action: 'Cadastrar organização',
        link: '/admin/organizacoes',
      });
    }

    return lista;
  }, [dados]);

  const recentActivities = useMemo(() => {
    if (!dados) return [];

    const oportunidadesRecentes = dados.oportunidades.map((o) => ({
      icon: '📋',
      text: `Oportunidade "${o.titulo}" cadastrada`,
      data: o.created_at,
      color: '#3b82f6',
    }));

    const interessesRecentes = dados.interesses.map((i) => ({
      icon: '❤️',
      text: `Novo interesse em "${i.oportunidade_titulo}"`,
      data: i.created_at,
      color: '#ef4444',
    }));

    return [...oportunidadesRecentes, ...interessesRecentes]
      .filter((item) => item.data)
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 5);
  }, [dados]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content" id="main-content">
          <Loading fullscreen={false} text="Carregando dashboard..." size="lg" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content" id="main-content">
          <ErrorMessage
            title="Erro ao Carregar Dashboard"
            message={error.message || 'Não foi possível carregar os dados do dashboard.'}
            onRetry={carregarDados}
            showRetry={true}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-content" id="main-content">
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
          {recentActivities.length === 0 ? (
            <p className="activity-empty">Nenhuma atividade recente registrada.</p>
          ) : (
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
                      <span className="activity-time">{formatRelativeTime(activity.data)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
