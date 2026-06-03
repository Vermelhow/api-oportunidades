import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, Loading } from '../components';
import '../styles/Perfil.css';

export default function Perfil() {
  const { user, loading, signed, logout } = useAuth();
  const navigate = useNavigate();

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !signed) {
      navigate('/login');
    }
  }, [loading, signed, navigate]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Exibe loading enquanto carrega os dados
  if (loading) {
    return (
      <Layout>
        <div className="perfil-loading">
          <Loading variant="spinner" size="large" />
          <p>Carregando perfil...</p>
        </div>
      </Layout>
    );
  }

  // Caso não existam dados do usuário
  if (!user) {
    return (
      <Layout>
        <div className="perfil-error">
          <div className="error-icon">⚠️</div>
          <h2>Dados do usuário não encontrados</h2>
          <p>Não foi possível carregar as informações do seu perfil.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Fazer Login
          </button>
        </div>
      </Layout>
    );
  }

  // Extrai as iniciais do nome para o avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <Layout>
      <div className="perfil-container">
        <div className="perfil-header">
          <h1>Meu Perfil</h1>
          <p className="perfil-subtitle">Gerencie suas informações pessoais</p>
        </div>

        <div className="perfil-card">
          {/* Avatar */}
          <div className="perfil-avatar-section">
            <div className="perfil-avatar">
              {getInitials(user.nome)}
            </div>
            <h2 className="perfil-nome">{user.nome}</h2>
            <p className="perfil-email">{user.email}</p>
          </div>

          {/* Informações */}
          <div className="perfil-info-section">
            <h3 className="section-title">Informações da Conta</h3>
            
            <div className="info-group">
              <div className="info-item">
                <span className="info-icon">👤</span>
                <div className="info-content">
                  <label className="info-label">Nome Completo</label>
                  <p className="info-value">{user.nome}</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📧</span>
                <div className="info-content">
                  <label className="info-label">E-mail</label>
                  <p className="info-value">{user.email}</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🆔</span>
                <div className="info-content">
                  <label className="info-label">ID de Usuário</label>
                  <p className="info-value">#{user.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="perfil-actions">
            <button 
              onClick={handleLogout} 
              className="btn btn-danger btn-logout"
            >
              🚪 Sair da Conta
            </button>
          </div>
        </div>

        {/* Card de Sugestões */}
        <div className="perfil-suggestions">
          <h3>💡 Melhorias Futuras</h3>
          <ul>
            <li>✏️ Editar informações do perfil</li>
            <li>🔒 Alterar senha</li>
            <li>📸 Upload de foto de perfil</li>
            <li>🔔 Configurações de notificações</li>
            <li>📊 Histórico de atividades</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
