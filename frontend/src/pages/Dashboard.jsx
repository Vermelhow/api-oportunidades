import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, signed, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para login se não estiver autenticado
    if (!loading && !signed) {
      navigate('/login');
    }
  }, [signed, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!signed) {
    return null;
  }

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Bem-vindo de volta, {user?.nome}!</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3 className="card-title">Minhas Oportunidades</h3>
            <p className="card-description">
              Gerencie suas oportunidades de voluntariado
            </p>
            <button className="btn btn-primary">Ver todas</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">❤️</div>
            <h3 className="card-title">Interesses</h3>
            <p className="card-description">
              Acompanhe suas candidaturas e interesses
            </p>
            <button className="btn btn-primary">Ver interesses</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3 className="card-title">Perfil</h3>
            <p className="card-description">
              Atualize suas informações pessoais
            </p>
            <button className="btn btn-primary">Editar perfil</button>
          </div>
        </div>

        <div className="user-info-section">
          <h2 className="section-title">Suas Informações</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome:</span>
              <span className="info-value">{user?.nome}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
