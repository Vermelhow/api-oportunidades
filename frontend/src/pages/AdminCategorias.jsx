import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components';
import '../styles/AdminFuturo.css';

function AdminCategorias() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate('/dashboard');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content-futuro">
        <div className="futuro-container">
          <div className="futuro-icon">🏷️</div>
          <h1 className="futuro-title">Gerenciamento de Categorias</h1>
          <p className="futuro-subtitle">Melhoria Futura</p>
          <p className="futuro-description">
            Esta funcionalidade está planejada para uma versão futura do sistema.
            Em breve você poderá gerenciar categorias de oportunidades diretamente por aqui.
          </p>
          
          <div className="futuro-features">
            <h3>Recursos Planejados:</h3>
            <ul>
              <li>✨ Criar novas categorias</li>
              <li>✏️ Editar categorias existentes</li>
              <li>🗑️ Excluir categorias</li>
              <li>📊 Visualizar estatísticas por categoria</li>
              <li>🔄 Reorganizar ordem das categorias</li>
            </ul>
          </div>

          <button 
            className="btn-voltar-dashboard"
            onClick={handleVoltar}
          >
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminCategorias;
