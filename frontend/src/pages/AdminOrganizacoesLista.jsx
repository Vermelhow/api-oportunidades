import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizacoes, deleteOrganizacao } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Sidebar, Loading, ConfirmModal } from '../components';
import '../styles/AdminOrganizacoesLista.css';

function AdminOrganizacoesLista() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [organizacoes, setOrganizacoes] = useState([]);
  const [filteredOrganizacoes, setFilteredOrganizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal de confirmação
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [organizacaoToDelete, setOrganizacaoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Buscar organizações ao carregar
  useEffect(() => {
    loadOrganizacoes();
  }, []);

  // Filtrar organizações quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrganizacoes(organizacoes);
    } else {
      const filtered = organizacoes.filter(org =>
        org.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrganizacoes(filtered);
    }
  }, [searchTerm, organizacoes]);

  async function loadOrganizacoes() {
    try {
      setLoading(true);
      const response = await getOrganizacoes();
      const data = response?.data || response || [];
      setOrganizacoes(data);
      setFilteredOrganizacoes(data);
    } catch (error) {
      console.error('Erro ao carregar organizações:', error);
      showError(error?.message || 'Erro ao carregar organizações');
    } finally {
      setLoading(false);
    }
  }

  function handleNova() {
    navigate('/admin/organizacoes/nova');
  }

  function handleEditar(id) {
    navigate(`/admin/organizacoes/${id}/editar`);
  }

  function handleVisualizarDetalhes(id) {
    navigate(`/admin/organizacoes/${id}/detalhes`);
  }

  function openDeleteConfirm(organizacao) {
    setOrganizacaoToDelete(organizacao);
    setShowConfirmModal(true);
  }

  function closeDeleteConfirm() {
    setShowConfirmModal(false);
    setOrganizacaoToDelete(null);
  }

  async function confirmDelete() {
    if (!organizacaoToDelete) return;

    try {
      setDeleting(true);
      await deleteOrganizacao(organizacaoToDelete.id);
      
      showSuccess('Organização excluída com sucesso!');
      
      // Atualizar lista removendo a organização excluída
      setOrganizacoes(prev => prev.filter(org => org.id !== organizacaoToDelete.id));
      setFilteredOrganizacoes(prev => prev.filter(org => org.id !== organizacaoToDelete.id));
      
      closeDeleteConfirm();
    } catch (error) {
      console.error('Erro ao excluir organização:', error);
      showError(error?.message || 'Erro ao excluir organização');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Loading fullscreen={false} text="Carregando organizações..." size="lg" />
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
            <h1>🏢 Gerenciar Organizações</h1>
            <p>Gerencie as organizações parceiras do sistema</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleNova}
          >
            ➕ Nova Organização
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="search-bar-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome, descrição ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Contador */}
        <div className="list-counter">
          <span>
            {filteredOrganizacoes.length === organizacoes.length 
              ? `${organizacoes.length} organização${organizacoes.length !== 1 ? 'ões' : ''} cadastrada${organizacoes.length !== 1 ? 's' : ''}`
              : `${filteredOrganizacoes.length} de ${organizacoes.length} organização${organizacoes.length !== 1 ? 'ões' : ''}`
            }
          </span>
        </div>

        {/* Lista de Organizações */}
        {filteredOrganizacoes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">🏢</p>
            <h3>{searchTerm ? 'Nenhuma organização encontrada' : 'Nenhuma organização cadastrada'}</h3>
            <p>{searchTerm ? 'Tente ajustar os termos de busca' : 'Comece cadastrando uma nova organização'}</p>
            {!searchTerm && (
              <button className="btn btn-primary" onClick={handleNova}>
                ➕ Cadastrar Primeira Organização
              </button>
            )}
          </div>
        ) : (
          <div className="organizacoes-grid">
            {filteredOrganizacoes.map((org) => (
              <div key={org.id} className="organizacao-card">
                <div className="organizacao-card-header">
                  <h3 className="organizacao-nome">{org.nome}</h3>
                </div>

                <div className="organizacao-card-body">
                  {org.descricao && (
                    <p className="organizacao-descricao">
                      {org.descricao.length > 150 
                        ? `${org.descricao.substring(0, 150)}...` 
                        : org.descricao
                      }
                    </p>
                  )}

                  <div className="organizacao-info">
                    {org.email && (
                      <div className="info-item">
                        <span className="info-icon">📧</span>
                        <span className="info-text">{org.email}</span>
                      </div>
                    )}
                    
                    {org.telefone && (
                      <div className="info-item">
                        <span className="info-icon">📱</span>
                        <span className="info-text">{org.telefone}</span>
                      </div>
                    )}
                    
                    {org.website && (
                      <div className="info-item">
                        <span className="info-icon">🌐</span>
                        <a 
                          href={org.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="info-link"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    
                    {org.endereco && (
                      <div className="info-item">
                        <span className="info-icon">📍</span>
                        <span className="info-text">{org.endereco}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="organizacao-card-footer">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleVisualizarDetalhes(org.id)}
                    title="Ver detalhes"
                  >
                    👁️ Ver
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditar(org.id)}
                    title="Editar organização"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => openDeleteConfirm(org)}
                    title="Excluir organização"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDelete}
          title="Excluir Organização"
          message={`Tem certeza que deseja excluir "${organizacaoToDelete?.nome}"?`}
          confirmText={deleting ? 'Excluindo...' : 'Sim, Excluir'}
          cancelText="Cancelar"
          type="danger"
          isLoading={deleting}
        />
      )}
    </div>
  );
}

export default AdminOrganizacoesLista;
