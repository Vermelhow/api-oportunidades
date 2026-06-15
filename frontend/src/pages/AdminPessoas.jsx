import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components';
import '../styles/AdminFuturo.css';

function AdminPessoas() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate('/dashboard');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content-futuro">
        <div className="futuro-container">
          <div className="futuro-icon">👥</div>
          <h1 className="futuro-title">Gerenciamento de Pessoas</h1>
          <p className="futuro-subtitle">Melhoria Futura</p>
          <p className="futuro-description">
            Esta funcionalidade está planejada para uma versão futura do sistema.
            Em breve você poderá gerenciar usuários e permissões diretamente por aqui.
          </p>
          
          <div className="futuro-features">
            <h3>Recursos Planejados:</h3>
            <ul>
              <li>👤 Visualizar lista de usuários</li>
              <li>✏️ Editar perfis de usuários</li>
              <li>🔐 Gerenciar permissões e papéis</li>
              <li>📊 Estatísticas de usuários ativos</li>
              <li>🚫 Bloquear/desbloquear usuários</li>
              <li>📧 Enviar notificações em massa</li>
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

export default AdminPessoas;
