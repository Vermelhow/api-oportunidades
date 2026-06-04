/**
 * Configuração base da API
 * 
 * Este arquivo contém a configuração central para comunicação com o backend.
 * Inclui tratamento de erros amigável e timeout de requisições.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_URL}/api`;
const REQUEST_TIMEOUT = 30000; // 30 segundos

// Callback para logout em caso de 401 (será configurado pelo AuthContext)
let onUnauthorizedCallback = null;

/**
 * Configura callback para ser chamado em caso de erro 401
 * @param {Function} callback - Função a ser executada em caso de 401
 */
export function setUnauthorizedCallback(callback) {
  onUnauthorizedCallback = callback;
}

/**
 * Classe customizada de erro para API
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isApiError = true;
  }
}

/**
 * Traduz erros HTTP para mensagens amigáveis
 */
function getErrorMessage(status, responseData) {
  const serverMessage = responseData?.message || responseData?.erro;

  const statusMessages = {
    400: serverMessage || 'Dados inválidos. Verifique as informações e tente novamente.',
    401: 'Sessão expirada. Faça login novamente.',
    403: 'Você não tem permissão para realizar esta ação.',
    404: 'Recurso não encontrado.',
    409: serverMessage || 'Conflito de dados. Este recurso já existe.',
    422: serverMessage || 'Dados inválidos. Verifique os campos obrigatórios.',
    429: 'Muitas requisições. Aguarde um momento e tente novamente.',
    500: 'Erro no servidor. Tente novamente mais tarde.',
    502: 'Serviço temporariamente indisponível. Tente novamente.',
    503: 'Serviço em manutenção. Tente novamente em alguns instantes.',
  };

  return statusMessages[status] || serverMessage || 'Ocorreu um erro inesperado. Tente novamente.';
}

/**
 * Adiciona timeout às requisições
 */
function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: A requisição demorou muito.')), timeout)
    ),
  ]);
}

export const api = {
  baseURL: API_BASE_URL,
  
  /**
   * Método auxiliar para realizar requisições HTTP
   * Com tratamento de erros amigável e timeout
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Pegar token do localStorage
    const token = localStorage.getItem('@api-oportunidades:token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetchWithTimeout(url, config);
      
      // Status 204 (No Content) - Sucesso sem resposta
      if (response.status === 204) {
        return null;
      }
      
      // Tentar parsear resposta JSON
      let data = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }
      
      // Verificar se houve erro HTTP
      if (!response.ok) {
        const message = getErrorMessage(response.status, data);
        
        // Se for 401, chama o callback de logout (se configurado)
        if (response.status === 401 && onUnauthorizedCallback) {
          // Executa de forma assíncrona para não bloquear a resposta
          setTimeout(() => onUnauthorizedCallback(), 0);
        }
        
        throw new ApiError(message, response.status, data);
      }
      
      return data;
      
    } catch (error) {
      // Erro de rede/conexão
      if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
        throw new ApiError(
          'Erro de conexão. Verifique sua internet e tente novamente.',
          0,
          null
        );
      }
      
      // Erro de timeout
      if (error.message.includes('Timeout')) {
        throw new ApiError(
          'A requisição demorou muito. Verifique sua conexão e tente novamente.',
          0,
          null
        );
      }
      
      // Se já é ApiError, propagar
      if (error.isApiError) {
        throw error;
      }
      
      // Erro desconhecido
      console.error('Erro na requisição:', error);
      throw new ApiError(
        'Ocorreu um erro inesperado. Tente novamente.',
        0,
        null
      );
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Funções específicas para cada recurso
// ============================================

/**
 * OPORTUNIDADES
 */
export async function getOportunidades() {
  try {
    return await api.get('/oportunidades');
  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error);
    throw error;
  }
}

export async function getOportunidadeById(id) {
  try {
    return await api.get(`/oportunidades/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar oportunidade ${id}:`, error);
    throw error;
  }
}

export async function createOportunidade(data) {
  try {
    return await api.post('/oportunidades', data);
  } catch (error) {
    console.error('Erro ao criar oportunidade:', error);
    throw error;
  }
}

export async function updateOportunidade(id, data) {
  try {
    return await api.put(`/oportunidades/${id}`, data);
  } catch (error) {
    console.error(`Erro ao atualizar oportunidade ${id}:`, error);
    throw error;
  }
}

export async function deleteOportunidade(id) {
  try {
    return await api.delete(`/oportunidades/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar oportunidade ${id}:`, error);
    throw error;
  }
}

/**
 * ORGANIZAÇÕES
 */
export async function getOrganizacoes() {
  try {
    return await api.get('/organizacoes');
  } catch (error) {
    console.error('Erro ao buscar organizações:', error);
    throw error;
  }
}

export async function getOrganizacaoById(id) {
  try {
    return await api.get(`/organizacoes/${id}`);
  } catch (error) {
    console.error(`Erro ao buscar organização ${id}:`, error);
    throw error;
  }
}

export async function createOrganizacao(data) {
  try {
    return await api.post('/organizacoes', data);
  } catch (error) {
    console.error('Erro ao criar organização:', error);
    throw error;
  }
}

export async function updateOrganizacao(id, data) {
  try {
    return await api.put(`/organizacoes/${id}`, data);
  } catch (error) {
    console.error(`Erro ao atualizar organização ${id}:`, error);
    throw error;
  }
}

export async function deleteOrganizacao(id) {
  try {
    return await api.delete(`/organizacoes/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar organização ${id}:`, error);
    throw error;
  }
}

/**
 * PESSOAS
 */
export async function getPessoas() {
  try {
    return await api.get('/pessoas');
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    throw error;
  }
}

/**
 * CATEGORIAS
 */
export async function getCategorias() {
  try {
    return await api.get('/categorias');
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
}

/**
 * AUTENTICAÇÃO
 */
export async function loginUser(credentials) {
  try {
    return await api.post('/pessoas/login', credentials);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    return await api.post('/pessoas', userData);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
}

export default api;
