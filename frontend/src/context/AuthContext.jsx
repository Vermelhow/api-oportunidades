import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega os dados do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('@api-oportunidades:token');
    const storedUser = localStorage.getItem('@api-oportunidades:user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /**
   * Realiza o login do usuário
   */
  async function login(email, senha) {
    try {
      const response = await loginUser({ email, senha });
      
      const { user: userData, token: userToken } = response.data;

      // Salva no localStorage
      localStorage.setItem('@api-oportunidades:token', userToken);
      localStorage.setItem('@api-oportunidades:user', JSON.stringify(userData));

      // Atualiza o estado
      setToken(userToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  }

  /**
   * Realiza o cadastro de um novo usuário
   */
  async function register(nome, email, senha) {
    try {
      const response = await registerUser({ nome, email, senha });
      
      const { user: userData, token: userToken } = response.data;

      // Salva no localStorage
      localStorage.setItem('@api-oportunidades:token', userToken);
      localStorage.setItem('@api-oportunidades:user', JSON.stringify(userData));

      // Atualiza o estado
      setToken(userToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer cadastro'
      };
    }
  }

  /**
   * Realiza o logout do usuário
   */
  function logout() {
    // Remove do localStorage
    localStorage.removeItem('@api-oportunidades:token');
    localStorage.removeItem('@api-oportunidades:user');

    // Limpa o estado
    setToken(null);
    setUser(null);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  function isAuthenticated() {
    return !!token && !!user;
  }

  /**
   * Retorna o token de autenticação
   */
  function getToken() {
    return token;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        getToken,
        signed: isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

export default AuthContext;
