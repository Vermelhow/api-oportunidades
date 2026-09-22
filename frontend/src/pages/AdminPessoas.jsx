import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPessoas, deletePessoa } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Sidebar,
  Loading,
  ErrorMessage,
  EmptyState,
  ConfirmModal,
} from '../components';
import '../styles/AdminPessoas.css';

function AdminPessoas() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [pessoaSelecionada, setPessoaSelecionada] = useState(null);
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    try {
      setLoading(true);
      setError(null);
      const response = await getPessoas();
      setPessoas(response?.data || response || []);
    } catch (err) {
      setError(err);
      showError(err.message || 'Erro ao carregar pessoas');
    } finally {
      setLoading(false);
    }
  }

  const pessoasFiltradas = pessoas.filter((p) => {
    if (!searchTerm.trim()) return true;
    const termo = searchTerm.toLowerCase();
    return p.nome?.toLowerCase().includes(termo) || p.email?.toLowerCase().includes(termo);
  });

  async function confirmarExclusao() {
    if (!pessoaParaExcluir) return;

    try {
      setExcluindo(true);
      await deletePessoa(pessoaParaExcluir.id);
      showSuccess('Conta excluída com sucesso!');
      setPessoaParaExcluir(null);

      // Se o usuário excluiu a própria conta, encerra a sessão
      if (pessoaParaExcluir.id === user?.id) {
        logout();
        navigate('/');
        return;
      }

      setPessoas((prev) => prev.filter((p) => p.id !== pessoaParaExcluir.id));
    } catch (err) {
      showError(err.message || 'Erro ao excluir pessoa');
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content" id="main-content">
        <div className="admin-header">
          <div>
            <h1>👥 Gerenciar Pessoas</h1>
            <p>Visualize as pessoas cadastradas no sistema</p>
          </div>
        </div>

        <div className="search-bar-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <Loading fullscreen={false} text="Carregando pessoas..." size="lg" />}

        {!loading && error && (
          <ErrorMessage
            title="Erro ao Carregar Pessoas"
            message={error.message}
            onRetry={carregarPessoas}
            showRetry={true}
          />
        )}

        {!loading && !error && pessoasFiltradas.length === 0 && (
          <EmptyState
            icon="👥"
            title={searchTerm ? 'Nenhuma pessoa encontrada' : 'Nenhuma pessoa cadastrada'}
            message={searchTerm ? 'Tente ajustar os termos de busca.' : 'Ainda não há pessoas cadastradas no sistema.'}
          />
        )}

        {!loading && !error && pessoasFiltradas.length > 0 && (
          <div className="pessoas-grid">
            {pessoasFiltradas.map((pessoa) => {
              const isOwnAccount = pessoa.id === user?.id;
              return (
                <div key={pessoa.id} className="pessoa-card">
                  <div className="pessoa-card-header">
                    <h3>{pessoa.nome}</h3>
                    {isOwnAccount && <span className="pessoa-badge">Você</span>}
                  </div>
                  <p className="pessoa-email">{pessoa.email}</p>
                  <div className="pessoa-card-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => setPessoaSelecionada(pessoa)}>
                      👁️ Ver detalhes
                    </button>
                    {isOwnAccount ? (
                      <>
                        <Link to="/perfil" className="btn btn-sm btn-primary">
                          ✏️ Editar
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setPessoaParaExcluir(pessoa)}
                        >
                          🗑️ Excluir
                        </button>
                      </>
                    ) : (
                      <span className="pessoa-readonly-hint" title="Somente o próprio usuário pode editar ou excluir sua conta">
                        Somente visualização
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {pessoaSelecionada && (
        <div className="pessoa-modal-overlay" onClick={() => setPessoaSelecionada(null)}>
          <div className="pessoa-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{pessoaSelecionada.nome}</h2>
            <p className="pessoa-modal-email">{pessoaSelecionada.email}</p>
            {pessoaSelecionada.bio && <p className="pessoa-modal-bio">{pessoaSelecionada.bio}</p>}
            <div className="pessoa-modal-links">
              {pessoaSelecionada.linkedin_url && (
                <a href={pessoaSelecionada.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              )}
              {pessoaSelecionada.github_url && (
                <a href={pessoaSelecionada.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>
              )}
              {pessoaSelecionada.portfolio_url && (
                <a href={pessoaSelecionada.portfolio_url} target="_blank" rel="noopener noreferrer">Portfólio</a>
              )}
            </div>
            <button className="btn btn-outline btn-block" onClick={() => setPessoaSelecionada(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(pessoaParaExcluir)}
        onClose={() => setPessoaParaExcluir(null)}
        onConfirm={confirmarExclusao}
        title="Excluir Conta"
        message={`Tem certeza que deseja excluir a conta de "${pessoaParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
        loading={excluindo}
      />
    </div>
  );
}

export default AdminPessoas;
