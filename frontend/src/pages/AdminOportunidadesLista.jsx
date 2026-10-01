import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, ConfirmModal, Loading, ErrorMessage } from '../components';
import { getOportunidades } from '../services/api';
import { useDeleteOportunidade } from '../hooks/useDeleteOportunidade';
import { useNotification } from '../context/NotificationContext';
import '../styles/AdminOportunidadesLista.css';

export default function AdminOportunidadesLista() {
  const navigate = useNavigate();
  const location = useLocation();
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('todas');
  
  const { showSuccess, showError } = useNotification();

  // Hook customizado para gerenciar exclusão
  const { 
    deleteItem, 
    isDeleting, 
    confirmDelete, 
    openDeleteConfirm, 
    closeDeleteConfirm 
  } = useDeleteOportunidade();

  useEffect(() => {
    carregarOportunidades();
  }, []);

  // Recarregar quando voltar de criar/editar com sinal de refresh
  useEffect(() => {
    if (location.state?.refresh) {
      carregarOportunidades();
      // Limpar o estado para não recarregar novamente
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const carregarOportunidades = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOportunidades();
      const data = response?.data || [];
      setOportunidades(data);
      
      // Se veio de uma criação/edição bem-sucedida, mostrar notificação
      if (location.state?.created) {
        showSuccess('Oportunidade criada com sucesso!');
      } else if (location.state?.updated) {
        showSuccess('Oportunidade atualizada com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao carregar oportunidades:', err);
      setError(err);
      const errorMsg = err.message || 'Não foi possível carregar as oportunidades. Tente novamente.';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, titulo) => {
    openDeleteConfirm(id, titulo);
  };

  const handleDeleteConfirm = async () => {
    await deleteItem(
      confirmDelete.id,
      // onSuccess
      (deletedId) => {
        // Remove da lista local sem precisar recarregar
        setOportunidades(prev => prev.filter(op => op.id !== deletedId));
        showSuccess('Oportunidade excluída com sucesso!');
      },
      // onError
      (errorMessage) => {
        showError(`Erro ao excluir: ${errorMessage}`);
      }
    );
  };

  const handleEdit = (id) => {
    navigate(`/admin/oportunidades/${id}/editar`);
  };

  const oportunidadesFiltradas = oportunidades.filter(op => {
    if (filter === 'todas') return true;
    return op.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      ativa: { class: 'status-ativa', text: 'Ativa', icon: '🟢' },
      encerrada: { class: 'status-encerrada', text: 'Encerrada', icon: '🔴' },
      pausada: { class: 'status-pausada', text: 'Pausada', icon: '🟡' }
    };
    return badges[status] || badges.ativa;
  };

  const getTipoBadge = (tipo) => {
    const badges = {
      emprego: { class: 'tipo-emprego', text: 'Emprego', icon: '💼' },
      estagio: { class: 'tipo-estagio', text: 'Estágio', icon: '🎓' },
      voluntariado: { class: 'tipo-voluntariado', text: 'Voluntariado', icon: '❤️' },
      freelancer: { class: 'tipo-freelancer', text: 'Freelancer', icon: '💻' }
    };
    return badges[tipo] || badges.emprego;
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-content" id="main-content">
          <Loading 
            fullscreen={false} 
            text="Carregando oportunidades..." 
            size="lg"
          />
        </main>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-content" id="main-content">
          <ErrorMessage
            title="Erro ao Carregar Oportunidades"
            message={error.message || 'Não foi possível carregar as oportunidades'}
            onRetry={carregarOportunidades}
            showRetry={true}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <main className="admin-content" id="main-content">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title"><span aria-hidden="true">📋</span> Gerenciar Oportunidades</h1>
            <p className="page-subtitle">Visualize, edite e exclua oportunidades cadastradas</p>
          </div>
          <Link to="/admin/oportunidades/nova" className="btn btn-primary">
            <span aria-hidden="true">➕</span> Nova Oportunidade
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'todas' ? 'active' : ''}`}
              onClick={() => setFilter('todas')}
            >
              Todas ({oportunidades.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'ativa' ? 'active' : ''}`}
              onClick={() => setFilter('ativa')}
            >
              <span aria-hidden="true">🟢</span> Ativas ({oportunidades.filter(o => o.status === 'ativa').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'encerrada' ? 'active' : ''}`}
              onClick={() => setFilter('encerrada')}
            >
              <span aria-hidden="true">🔴</span> Encerradas ({oportunidades.filter(o => o.status === 'encerrada').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'pausada' ? 'active' : ''}`}
              onClick={() => setFilter('pausada')}
            >
              <span aria-hidden="true">🟡</span> Pausadas ({oportunidades.filter(o => o.status === 'pausada').length})
            </button>
          </div>
        </div>

        {/* Lista de Oportunidades */}
        <div className="opportunities-table-container">
          {oportunidadesFiltradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">📋</div>
              <h3>Nenhuma oportunidade encontrada</h3>
              <p>
                {filter === 'todas' 
                  ? 'Clique em "Nova Oportunidade" para cadastrar a primeira.'
                  : `Não há oportunidades com status "${filter}".`
                }
              </p>
            </div>
          ) : (
            <div className="opportunities-table">
              {oportunidadesFiltradas.map((oportunidade) => {
                const statusBadge = getStatusBadge(oportunidade.status);
                const tipoBadge = getTipoBadge(oportunidade.tipo);

                return (
                  <div key={oportunidade.id} className="opportunity-row">
                    <div className="opportunity-main">
                      <div className="opportunity-info">
                        <h3 className="opportunity-title">{oportunidade.titulo}</h3>
                        <div className="opportunity-meta">
                          <span className="meta-item">
                            <span aria-hidden="true">🏢</span> {oportunidade.organizacao_nome}
                          </span>
                          <span className="meta-item">
                            <span aria-hidden="true">🏷️</span> {oportunidade.categoria_nome}
                          </span>
                          <span className="meta-item">
                            <span aria-hidden="true">📍</span> {oportunidade.localizacao || 'Não especificado'}
                          </span>
                        </div>
                      </div>

                      <div className="opportunity-badges">
                        <span className={`badge ${tipoBadge.class}`}>
                          <span aria-hidden="true">{tipoBadge.icon}</span> {tipoBadge.text}
                        </span>
                        <span className={`badge ${statusBadge.class}`}>
                          <span aria-hidden="true">{statusBadge.icon}</span> {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    <div className="opportunity-actions">
                      <button
                        onClick={() => navigate(`/oportunidades/${oportunidade.id}`)}
                        className="btn-action btn-view"
                        title="Visualizar"
                      >
                        <span aria-hidden="true">👁️</span> Ver
                      </button>
                      <button
                        onClick={() => handleEdit(oportunidade.id)}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        <span aria-hidden="true">✏️</span> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(oportunidade.id, oportunidade.titulo)}
                        className="btn-action btn-delete"
                        title="Excluir"
                        disabled={isDeleting}
                      >
                        <span aria-hidden="true">🗑️</span> Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        title="Excluir Oportunidade"
        message={`Tem certeza que deseja excluir a oportunidade "${confirmDelete.titulo}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
        loading={isDeleting}
      />
    </div>
  );
}
