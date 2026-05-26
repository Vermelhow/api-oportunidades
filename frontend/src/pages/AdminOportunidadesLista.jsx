import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { getOportunidades } from '../services/api';
import { useDeleteOportunidade } from '../hooks/useDeleteOportunidade';
import '../styles/AdminOportunidadesLista.css';

export default function AdminOportunidadesLista() {
  const navigate = useNavigate();
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

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

  const carregarOportunidades = async () => {
    try {
      setLoading(true);
      const response = await getOportunidades();
      setOportunidades(response?.data || []);
    } catch (err) {
      showToast('Erro ao carregar oportunidades.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'info' });
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
        showToast('Oportunidade excluída com sucesso!', 'success');
      },
      // onError
      (errorMessage) => {
        showToast(errorMessage, 'error');
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
      ativa: { class: 'status-ativa', text: '✓ Ativa', icon: '🟢' },
      encerrada: { class: 'status-encerrada', text: '✕ Encerrada', icon: '🔴' },
      pausada: { class: 'status-pausada', text: '⏸ Pausada', icon: '🟡' }
    };
    return badges[status] || badges.ativa;
  };

  const getTipoBadge = (tipo) => {
    const badges = {
      emprego: { class: 'tipo-emprego', text: '💼 Emprego' },
      estagio: { class: 'tipo-estagio', text: '🎓 Estágio' },
      voluntariado: { class: 'tipo-voluntariado', text: '❤️ Voluntariado' },
      freelancer: { class: 'tipo-freelancer', text: '💻 Freelancer' }
    };
    return badges[tipo] || badges.emprego;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando oportunidades...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <main className="admin-content">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title">📋 Gerenciar Oportunidades</h1>
            <p className="page-subtitle">Visualize, edite e exclua oportunidades cadastradas</p>
          </div>
          <Link to="/admin/oportunidades/nova" className="btn btn-primary">
            ➕ Nova Oportunidade
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
              🟢 Ativas ({oportunidades.filter(o => o.status === 'ativa').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'encerrada' ? 'active' : ''}`}
              onClick={() => setFilter('encerrada')}
            >
              🔴 Encerradas ({oportunidades.filter(o => o.status === 'encerrada').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'pausada' ? 'active' : ''}`}
              onClick={() => setFilter('pausada')}
            >
              🟡 Pausadas ({oportunidades.filter(o => o.status === 'pausada').length})
            </button>
          </div>
        </div>

        {/* Lista de Oportunidades */}
        <div className="opportunities-table-container">
          {oportunidadesFiltradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
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
                            🏢 {oportunidade.organizacao_nome}
                          </span>
                          <span className="meta-item">
                            🏷️ {oportunidade.categoria_nome}
                          </span>
                          <span className="meta-item">
                            📍 {oportunidade.localizacao || 'Não especificado'}
                          </span>
                        </div>
                      </div>

                      <div className="opportunity-badges">
                        <span className={`badge ${tipoBadge.class}`}>
                          {tipoBadge.text}
                        </span>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>

                    <div className="opportunity-actions">
                      <button
                        onClick={() => navigate(`/oportunidades/${oportunidade.id}`)}
                        className="btn-action btn-view"
                        title="Visualizar"
                      >
                        👁️ Ver
                      </button>
                      <button
                        onClick={() => handleEdit(oportunidade.id)}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(oportunidade.id, oportunidade.titulo)}
                        className="btn-action btn-delete"
                        title="Excluir"
                        disabled={isDeleting}
                      >
                        🗑️ Excluir
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

      {/* Toast de Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={closeToast}
        duration={3000}
      />
    </div>
  );
}
