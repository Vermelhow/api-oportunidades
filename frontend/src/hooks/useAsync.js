import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar requisições assíncronas
 * Controla estados de loading, data e error automaticamente
 * 
 * @param {Function} asyncFunction - Função assíncrona a ser executada
 * @param {boolean} immediate - Se deve executar imediatamente (padrão: true)
 * @param {Array} dependencies - Dependências para re-executar
 * 
 * @returns {Object} { loading, data, error, execute, reset }
 * 
 * @example
 * const { loading, data, error, execute } = useAsync(
 *   () => getOportunidades(),
 *   true
 * );
 */
export function useAsync(asyncFunction, immediate = true, dependencies = []) {
  const [loading, setLoading] = useState(immediate);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setLoading(false);
    setData(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { loading, data, error, execute, reset };
}

/**
 * Hook para gerenciar estado de loading de forma simples
 * 
 * @returns {Object} { isLoading, startLoading, stopLoading, withLoading }
 * 
 * @example
 * const { isLoading, withLoading } = useLoading();
 * 
 * const handleSubmit = withLoading(async () => {
 *   await saveData();
 * });
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback((asyncFn) => {
    return async (...args) => {
      startLoading();
      try {
        const result = await asyncFn(...args);
        return result;
      } finally {
        stopLoading();
      }
    };
  }, [startLoading, stopLoading]);

  return { isLoading, startLoading, stopLoading, withLoading };
}

/**
 * Hook para tratar erros de API de forma padronizada
 * 
 * @returns {Function} Função para processar erros
 * 
 * @example
 * const handleApiError = useApiError();
 * 
 * try {
 *   await api.post('/data', data);
 * } catch (error) {
 *   const userMessage = handleApiError(error);
 *   showError(userMessage);
 * }
 */
export function useApiError() {
  return useCallback((error) => {
    // Erros de rede
    if (!error.response) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }

    // Erros HTTP
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        return message || 'Dados inválidos. Verifique as informações e tente novamente.';
      case 401:
        return 'Sessão expirada. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return message || 'Conflito de dados. Este recurso já existe.';
      case 422:
        return message || 'Dados inválidos. Verifique os campos obrigatórios.';
      case 500:
        return 'Erro no servidor. Tente novamente mais tarde.';
      case 503:
        return 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
      default:
        return message || 'Ocorreu um erro inesperado. Tente novamente.';
    }
  }, []);
}

/**
 * Hook para debounce em inputs
 * 
 * @param {any} value - Valor a ser "debounced"
 * @param {number} delay - Delay em ms (padrão: 300)
 * 
 * @returns {any} Valor após o delay
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     searchData(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para controlar timeouts
 * 
 * @returns {Object} { setTimeout, clearTimeout }
 * 
 * @example
 * const { setTimeout } = useTimeout();
 * 
 * setTimeout(() => {
 *   showMessage('Tempo esgotado!');
 * }, 5000);
 */
export function useTimeout() {
  const [timeoutId, setTimeoutId] = useState(null);

  const set = useCallback((callback, delay) => {
    clear();
    const id = window.setTimeout(callback, delay);
    setTimeoutId(id);
    return id;
  }, []);

  const clear = useCallback(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  return { setTimeout: set, clearTimeout: clear };
}
