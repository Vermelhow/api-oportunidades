import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components';

/**
 * Componente de Rota Protegida
 * 
 * Verifica se o usuário está autenticado antes de permitir o acesso à rota.
 * Se não estiver autenticado, salva a rota atual e redireciona para login.
 * Após o login, o usuário pode ser redirecionado de volta para esta rota.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autenticado
 * @returns {React.ReactElement} Componente filho ou redirecionamento para login
 */
export default function PrivateRoute({ children }) {
  const { signed, loading } = useAuth();
  const location = useLocation();

  // Aguarda o carregamento dos dados do localStorage
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem'
      }}>
        <Loading variant="spinner" size="large" />
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Verificando autenticação...
        </p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  // Salva a rota atual no state para redirecionar após login
  if (!signed) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location.pathname }}
      />
    );
  }

  // Se estiver autenticado, renderiza o componente filho
  return children;
}
