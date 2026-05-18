import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOportunidadeById } from '../services/api';
import Layout from '../components/Layout';
import '../styles/OportunidadeDetalhe.css';

export default function OportunidadeDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oportunidade, setOportunidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOportunidadeById(id)
      .then((response) => {
        setOportunidade(response.data || response);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Formata datas
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Formata salário
  const formatSalary = (value) => {
    if (!value) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Mapeia ícones para tipos
  const tipoIcons = {
    emprego: '💼',
    estagio: '🎓',
    curso: '📚',
    evento: '🎉',
    projeto: '🚀',
    voluntariado: '❤️'
  };

  // Mapeia ícones para formatos
  const formatoIcons = {
    presencial: '🏢',
    remoto: '💻',
    hibrido: '🔄'
  };

  // Mapeia classes CSS para status
  const statusClasses = {
    ativa: 'status-active',
    encerrada: 'status-closed',
    pausada: 'status-paused'
  };

  // Mapeia textos para status
  const statusTexts = {
    ativa: 'Ativa',
    encerrada: 'Encerrada',
    pausada: 'Pausada'
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Carregando detalhes...</h2>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <h2>❌ Erro ao carregar oportunidade</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/oportunidades')} className="btn btn-primary">
            Voltar para Oportunidades
          </button>
        </div>
      </Layout>
    );
  }

  if (!oportunidade) {
    return (
      <Layout>
        <div className="error-container">
          <h2>🔍 Oportunidade não encontrada</h2>
          <p>A oportunidade que você procura não existe ou foi removida.</p>
          <button onClick={() => navigate('/oportunidades')} className="btn btn-primary">
            Voltar para Oportunidades
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="oportunidade-detalhe-page">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">›</span>
          <Link to="/oportunidades">Oportunidades</Link>
          <span className="separator">›</span>
          <span className="current">{oportunidade.titulo}</span>
        </nav>

        {/* Header da Oportunidade */}
        <header className="oportunidade-header">
          <div className="header-badges">
            {oportunidade.status && (
              <span className={`badge badge-status ${statusClasses[oportunidade.status] || ''}`}>
                {statusTexts[oportunidade.status] || oportunidade.status}
              </span>
            )}
            {oportunidade.tipo && (
              <span className="badge badge-type">
                {tipoIcons[oportunidade.tipo] || '📌'} {oportunidade.tipo}
              </span>
            )}
          </div>

          <h1 className="oportunidade-title">{oportunidade.titulo}</h1>

          {oportunidade.categoria_nome && (
            <div className="oportunidade-category">
              <span className="category-icon">🏷️</span>
              <span className="category-name">{oportunidade.categoria_nome}</span>
            </div>
          )}
        </header>

        {/* Grid de Conteúdo */}
        <div className="content-grid">
          {/* Coluna Principal */}
          <main className="main-content">
            {/* Descrição */}
            <section className="content-section">
              <h2 className="section-title">📋 Sobre a Oportunidade</h2>
              <p className="description-text">{oportunidade.descricao}</p>
            </section>

            {/* Requisitos */}
            {oportunidade.requisitos && (
              <section className="content-section">
                <h2 className="section-title">✅ Requisitos</h2>
                <p className="section-text">{oportunidade.requisitos}</p>
              </section>
            )}

            {/* Benefícios */}
            {oportunidade.beneficios && (
              <section className="content-section">
                <h2 className="section-title">🎁 Benefícios</h2>
                <p className="section-text">{oportunidade.beneficios}</p>
              </section>
            )}

            {/* Salário */}
            {(oportunidade.salario_min || oportunidade.salario_max) && (
              <section className="content-section">
                <h2 className="section-title">💰 Remuneração</h2>
                <p className="salary-range">
                  {oportunidade.salario_min && formatSalary(oportunidade.salario_min)}
                  {oportunidade.salario_min && oportunidade.salario_max && ' - '}
                  {oportunidade.salario_max && formatSalary(oportunidade.salario_max)}
                </p>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Organização */}
            {oportunidade.organizacao_nome && (
              <div className="info-card">
                <h3 className="info-card-title">🏢 Organização</h3>
                <p className="info-card-value">{oportunidade.organizacao_nome}</p>
              </div>
            )}

            {/* Informações Principais */}
            <div className="info-card">
              <h3 className="info-card-title">📌 Informações</h3>
              <div className="info-list">
                {oportunidade.localizacao && (
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div className="info-content">
                      <span className="info-label">Localização</span>
                      <span className="info-value">{oportunidade.localizacao}</span>
                    </div>
                  </div>
                )}

                {oportunidade.formato && (
                  <div className="info-item">
                    <span className="info-icon">{formatoIcons[oportunidade.formato] || '📋'}</span>
                    <div className="info-content">
                      <span className="info-label">Formato</span>
                      <span className="info-value">{oportunidade.formato}</span>
                    </div>
                  </div>
                )}

                {oportunidade.vagas_disponiveis && (
                  <div className="info-item">
                    <span className="info-icon">👥</span>
                    <div className="info-content">
                      <span className="info-label">Vagas</span>
                      <span className="info-value">
                        {oportunidade.vagas_disponiveis} {oportunidade.vagas_disponiveis === 1 ? 'vaga' : 'vagas'}
                      </span>
                    </div>
                  </div>
                )}

                {(oportunidade.data_inicio || oportunidade.data_fim) && (
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <div className="info-content">
                      <span className="info-label">Período</span>
                      <span className="info-value">
                        {oportunidade.data_inicio && formatDate(oportunidade.data_inicio)}
                        {oportunidade.data_inicio && oportunidade.data_fim && ' até '}
                        {oportunidade.data_fim && formatDate(oportunidade.data_fim)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="actions-card">
              <button className="btn btn-primary btn-block">
                {oportunidade.link_inscricao ? 'Candidatar-se' : 'Demonstrar Interesse'}
              </button>
              {oportunidade.link_inscricao && (
                <a 
                  href={oportunidade.link_inscricao} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-block"
                >
                  Acessar Link Externo 🔗
                </a>
              )}
              <button 
                onClick={() => navigate('/oportunidades')} 
                className="btn btn-secondary btn-block"
              >
                ← Voltar
              </button>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
