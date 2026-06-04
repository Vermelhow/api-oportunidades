import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, setUnauthorizedCallback } from '../services/api';
import {
  isTokenExpired,
  isValidTokenFormat,
  clearAuthStorage,
  saveAuthStorage,
  getAuthStorage,
} from '../utils/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Função para fazer logout (pode ser chamada de qualquer lugar)
   */
  const handleLogout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Configura callback de logout automático em caso de 401
   */
  useEffect(() => {
    setUnauthorizedCallback(() => {
      console.warn('Sessão expirada ou não autorizada. Fazendo logout automático...');
      handleLogout();
    });
  }, [handleLogout]);

  /**
   * Valida e carrega dados do localStorage ao iniciar
   */
  useEffect(() => {
    const { token: storedToken, user: storedUser } = getAuthStorage();

    // Verifica se existe token e usuário
    if (storedToken && storedUser) {
      // Valida formato do token
      if (!isValidTokenFormat(storedToken)) {
        console.warn('Token com formato inválido. Fazendo logout...');
        handleLogout();
        setLoading(false);
        return;
      }

      // Verifica se o token está expirado
      if (isTokenExpired(storedToken)) {
        console.warn('Token expirado. Fazendo logout...');
        handleLogout();
        setLoading(false);
        return;
      }

      // Token válido, carrega os dados
      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  }, [handleLogout]);

  /**
   * Realiza o login do usuário
   */
  async function login(email, senha) {
    try {
      const response = await loginUser({ email, senha });
      
      const { user: userData, token: userToken } = response.data;

      // Valida o token recebido
      if (!isValidTokenFormat(userToken)) {
        throw new Error('Token recebido é inválido');
      }

      // Salva no localStorage
      saveAuthStorage(userToken, userData);

      // Atualiza o estado
      setToken(userToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Trata erros da API (ApiError)
      if (error.isApiError) {
        return {
          success: false,
          error: error.message
        };
      }

      // Outros erros
      return {
        success: false,
        error: error.message || 'Erro ao fazer login. Tente novamente.'
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

      // Valida o token recebido
      if (!isValidTokenFormat(userToken)) {
        throw new Error('Token recebido é inválido');
      }

      // Salva no localStorage
      saveAuthStorage(userToken, userData);

      // Atualiza o estado
      setToken(userToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Trata erros da API (ApiError)
      if (error.isApiError) {
        return {
          success: false,
          error: error.message
        };
      }

      // Outros erros
      return {
        success: false,
        error: error.message || 'Erro ao fazer cadastro. Tente novamente.'
      };
    }
  }

  /**
   * Realiza o logout do usuário
   */
  function logout() {
    handleLogout();
  }

  /**
   * Atualiza os dados do usuário (útil após editar perfil)
   */
  function updateUser(updatedUserData) {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    saveAuthStorage(token, newUserData);
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
        updateUser,
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
