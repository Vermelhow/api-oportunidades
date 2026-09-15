import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getInteressesByPessoa, deleteInteresse } from '../services/api';
import { Layout, Loading, ErrorMessage, EmptyState, ConfirmModal } from '../components';
import '../styles/MeusInteresses.css';

const statusInfo = {
  pendente: { label: 'Pendente', className: 'status-pendente' },
  aceito: { label: 'Aceito', className: 'status-aceito' },
  rejeitado: { label: 'Rejeitado', className: 'status-rejeitado' },
};

export default function MeusInteresses() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [interesses, setInteresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [interesseParaCancelar, setInteresseParaCancelar] = useState(null);

  useEffect(() => {
    if (user?.id) {
      carregarInteresses();
    }
  }, [user?.id]);

  async function carregarInteresses() {
    try {
      setLoading(true);
      setError(null);
      const response = await getInteressesByPessoa(user.id);
      setInteresses(response?.data || response || []);
    } catch (err) {
      setError(err);
      showError(err.message || 'Erro ao carregar seus interesses');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  async function handleConfirmarCancelamento() {
    if (!interesseParaCancelar) return;

    try {
      setCancelando(true);
      await deleteInteresse(interesseParaCancelar.id);
      setInteresses((prev) => prev.filter((i) => i.id !== interesseParaCancelar.id));
      showSuccess('Interesse cancelado com sucesso');
      setInteresseParaCancelar(null);
    } catch (err) {
      showError(err.message || 'Erro ao cancelar interesse');
    } finally {
      setCancelando(false);
    }
  }

  return (
    <Layout>
      <div className="meus-interesses-container">
        <div className="meus-interesses-header">
          <h1>Meus Interesses</h1>
          <p className="meus-interesses-subtitle">
            Acompanhe as oportunidades em que você demonstrou interesse
          </p>
        </div>

        {loading && <Loading variant="spinner" size="lg" text="Carregando seus interesses..." />}

        {!loading && error && (
          <ErrorMessage
            title="Erro ao Carregar Interesses"
            message={error.message || 'Não foi possível carregar seus interesses.'}
            onRetry={carregarInteresses}
            showRetry={true}
          />
        )}

        {!loading && !error && interesses.length === 0 && (
          <EmptyState
            icon="❤️"
            title="Você ainda não demonstrou interesse em nenhuma oportunidade"
            message="Explore as oportunidades disponíveis e registre seu interesse."
            actionText="🔍 Ver Oportunidades"
            onAction={() => navigate('/oportunidades')}
          />
        )}

        {!loading && !error && interesses.length > 0 && (
          <div className="interesses-list">
            {interesses.map((interesse) => {
              const status = statusInfo[interesse.status] || statusInfo.pendente;
              return (
                <div key={interesse.id} className="interesse-card">
                  <div className="interesse-card-info">
                    <Link
                      to={`/oportunidades/${interesse.oportunidade_id}`}
                      className="interesse-titulo"
                    >
                      {interesse.oportunidade_titulo}
                    </Link>
                    <span className={`interesse-status ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="interesse-data">
                      Registrado em {formatDate(interesse.created_at)}
                    </span>
                    {interesse.mensagem && (
                      <p className="interesse-mensagem">"{interesse.mensagem}"</p>
                    )}
                  </div>
                  <div className="interesse-card-actions">
                    <Link
                      to={`/oportunidades/${interesse.oportunidade_id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Ver oportunidade
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setInteresseParaCancelar(interesse)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(interesseParaCancelar)}
        onClose={() => setInteresseParaCancelar(null)}
        onConfirm={handleConfirmarCancelamento}
        title="Cancelar Interesse"
        message={`Deseja realmente cancelar seu interesse em "${interesseParaCancelar?.oportunidade_titulo}"?`}
        confirmText="Sim, Cancelar"
        cancelText="Voltar"
        type="danger"
        loading={cancelando}
      />
    </Layout>
  );
}
