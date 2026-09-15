import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getOrganizacaoById, getOportunidadesByOrganizacao } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Sidebar, Loading, ErrorMessage } from '../components';
import '../styles/OrganizacaoDetalhe.css';

export default function OrganizacaoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useNotification();

  const [organizacao, setOrganizacao] = useState(null);
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setLoading(true);
      setError(null);

      const orgResponse = await getOrganizacaoById(id);
      setOrganizacao(orgResponse?.data || orgResponse);

      try {
        const oportResponse = await getOportunidadesByOrganizacao(id);
        setOportunidades(oportResponse?.data || oportResponse || []);
      } catch {
        // Se não houver oportunidades vinculadas, apenas mantém lista vazia
        setOportunidades([]);
      }
    } catch (err) {
      setError(err);
      showError(err?.message || 'Erro ao carregar organização');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Loading fullscreen={false} text="Carregando organização..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !organizacao) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <ErrorMessage
            title="Erro ao Carregar Organização"
            message={error?.message || 'Organização não encontrada.'}
            onRetry={carregarDados}
            showRetry={true}
          />
          <button onClick={() => navigate('/admin/organizacoes')} className="btn btn-outline" style={{ marginTop: '1rem' }}>
            ← Voltar para Organizações
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>🏢 {organizacao.nome}</h1>
            <p>Detalhes da organização parceira</p>
          </div>
          <div className="organizacao-detalhe-actions">
            <button onClick={() => navigate('/admin/organizacoes')} className="btn btn-outline">
              ← Voltar
            </button>
            <button onClick={() => navigate(`/admin/organizacoes/${id}/editar`)} className="btn btn-primary">
              ✏️ Editar
            </button>
          </div>
        </div>

        <div className="organizacao-detalhe-card">
          {organizacao.descricao && (
            <p className="organizacao-detalhe-descricao">{organizacao.descricao}</p>
          )}

          <div className="organizacao-detalhe-info-grid">
            {organizacao.email && (
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>{organizacao.email}</span>
              </div>
            )}
            {organizacao.telefone && (
              <div className="info-item">
                <span className="info-icon">📱</span>
                <span>{organizacao.telefone}</span>
              </div>
            )}
            {organizacao.website && (
              <div className="info-item">
                <span className="info-icon">🌐</span>
                <a href={organizacao.website} target="_blank" rel="noopener noreferrer">
                  {organizacao.website}
                </a>
              </div>
            )}
            {organizacao.endereco && (
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>{organizacao.endereco}</span>
              </div>
            )}
          </div>
        </div>

        <div className="organizacao-detalhe-oportunidades">
          <h2>📋 Oportunidades desta organização</h2>
          {oportunidades.length === 0 ? (
            <p className="organizacao-detalhe-vazio">
              Nenhuma oportunidade cadastrada para esta organização ainda.
            </p>
          ) : (
            <ul className="organizacao-detalhe-lista">
              {oportunidades.map((op) => (
                <li key={op.id}>
                  <Link to={`/oportunidades/${op.id}`}>{op.titulo}</Link>
                  <span className={`badge badge-status status-${op.status}`}>{op.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
