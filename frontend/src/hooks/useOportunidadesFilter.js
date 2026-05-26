import { useState, useMemo } from 'react';

/**
 * Hook customizado para filtrar oportunidades
 * 
 * @param {Array} oportunidades - Lista de oportunidades a serem filtradas
 * @returns {Object} Objeto com oportunidades filtradas e funções de controle
 * 
 * Retorna:
 * - filteredOportunidades: lista filtrada
 * - filters: estado atual dos filtros
 * - setSearchTerm: define busca por texto
 * - setCategoria: filtra por categoria
 * - setStatus: filtra por status
 * - setTipo: filtra por tipo
 * - setFormato: filtra por formato
 * - clearFilters: limpa todos os filtros
 * - hasActiveFilters: indica se há filtros ativos
 * 
 * Exemplo de uso:
 * ```js
 * const { 
 *   filteredOportunidades, 
 *   filters, 
 *   setSearchTerm,
 *   clearFilters,
 *   hasActiveFilters
 * } = useOportunidadesFilter(oportunidades);
 * ```
 */
export function useOportunidadesFilter(oportunidades = []) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    categoria: '',
    status: '',
    tipo: '',
    formato: ''
  });

  /**
   * Filtra oportunidades baseado em todos os critérios ativos
   * Usa useMemo para otimização de performance
   */
  const filteredOportunidades = useMemo(() => {
    let result = [...oportunidades];

    // Filtro por termo de busca (título, descrição, requisitos)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(op => 
        op.titulo?.toLowerCase().includes(searchLower) ||
        op.descricao?.toLowerCase().includes(searchLower) ||
        op.requisitos?.toLowerCase().includes(searchLower) ||
        op.organizacao_nome?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoria
    if (filters.categoria) {
      result = result.filter(op => 
        op.categoria_id === parseInt(filters.categoria) ||
        op.categoria_nome === filters.categoria
      );
    }

    // Filtro por status
    if (filters.status) {
      result = result.filter(op => op.status === filters.status);
    }

    // Filtro por tipo
    if (filters.tipo) {
      result = result.filter(op => op.tipo === filters.tipo);
    }

    // Filtro por formato
    if (filters.formato) {
      result = result.filter(op => op.formato === filters.formato);
    }

    return result;
  }, [oportunidades, filters]);

  /**
   * Verifica se há algum filtro ativo
   */
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  /**
   * Funções para atualizar filtros individuais
   */
  const setSearchTerm = (term) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const setCategoria = (categoria) => {
    setFilters(prev => ({ ...prev, categoria }));
  };

  const setStatus = (status) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const setTipo = (tipo) => {
    setFilters(prev => ({ ...prev, tipo }));
  };

  const setFormato = (formato) => {
    setFilters(prev => ({ ...prev, formato }));
  };

  /**
   * Limpa todos os filtros
   */
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      categoria: '',
      status: '',
      tipo: '',
      formato: ''
    });
  };

  /**
   * Obtém contagem de resultados por categoria
   */
  const getCategoryCounts = useMemo(() => {
    const counts = {};
    oportunidades.forEach(op => {
      const cat = op.categoria_nome || 'Sem categoria';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [oportunidades]);

  /**
   * Obtém contagem de resultados por status
   */
  const getStatusCounts = useMemo(() => {
    const counts = {};
    oportunidades.forEach(op => {
      const status = op.status || 'ativa';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [oportunidades]);

  return {
    filteredOportunidades,
    filters,
    setSearchTerm,
    setCategoria,
    setStatus,
    setTipo,
    setFormato,
    clearFilters,
    hasActiveFilters,
    getCategoryCounts,
    getStatusCounts,
    totalResults: filteredOportunidades.length,
    totalAvailable: oportunidades.length
  };
}
