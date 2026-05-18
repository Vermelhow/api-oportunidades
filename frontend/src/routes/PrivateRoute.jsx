import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de Rota Protegida
 * 
 * Verifica se o usuário está autenticado antes de permitir o acesso à rota.
 * Se não estiver autenticado, redireciona para a página de login.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autenticado
 * @returns {React.ReactElement} Componente filho ou redirecionamento para login
 */
export default function PrivateRoute({ children }) {
  const { signed, loading } = useAuth();

  // Aguarda o carregamento dos dados do localStorage
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza o componente filho
  return children;
}
