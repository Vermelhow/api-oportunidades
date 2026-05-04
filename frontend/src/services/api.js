/**
 * Configuração base da API
 * 
 * Este arquivo contém a configuração central para comunicação com o backend.
 * Utilize este serviço para fazer requisições HTTP à API de Oportunidades.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_URL}/api`;

export const api = {
  baseURL: API_BASE_URL,
  
  /**
   * Método auxiliar para realizar requisições HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
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
};

// ============================================
// Funções específicas para cada recurso
// ============================================

/**
 * OPORTUNIDADES
 */
export async function getOportunidades() {
  const response = await fetch(`${API_URL}/api/oportunidades`);
  if (!response.ok) throw new Error('Erro ao buscar oportunidades');
  return response.json();
}

export async function getOportunidadeById(id) {
  const response = await fetch(`${API_URL}/api/oportunidades/${id}`);
  if (!response.ok) throw new Error('Erro ao buscar oportunidade');
  return response.json();
}

export async function createOportunidade(data) {
  const response = await fetch(`${API_URL}/api/oportunidades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao criar oportunidade');
  return response.json();
}

export async function updateOportunidade(id, data) {
  const response = await fetch(`${API_URL}/api/oportunidades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erro ao atualizar oportunidade');
  return response.json();
}

export async function deleteOportunidade(id) {
  const response = await fetch(`${API_URL}/api/oportunidades/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar oportunidade');
  return response.json();
}

/**
 * ORGANIZAÇÕES
 */
export async function getOrganizacoes() {
  const response = await fetch(`${API_URL}/api/organizacoes`);
  if (!response.ok) throw new Error('Erro ao buscar organizações');
  return response.json();
}

/**
 * PESSOAS
 */
export async function getPessoas() {
  const response = await fetch(`${API_URL}/api/pessoas`);
  if (!response.ok) throw new Error('Erro ao buscar pessoas');
  return response.json();
}

/**
 * CATEGORIAS
 */
export async function getCategorias() {
  const response = await fetch(`${API_URL}/api/categorias`);
  if (!response.ok) throw new Error('Erro ao buscar categorias');
  return response.json();
}

export default api;
