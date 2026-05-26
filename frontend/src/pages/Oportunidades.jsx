import { useEffect, useState } from "react";
import { getOportunidades, getCategorias } from "../services/api";
import Layout from '../components/Layout';
import OpportunityCard from '../components/OpportunityCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { useOportunidadesFilter } from '../hooks/useOportunidadesFilter';
import '../styles/Oportunidades.css';

export default function Oportunidades() {
  const [dados, setDados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook de filtros
  const {
    filteredOportunidades,
    filters,
    setSearchTerm,
    setCategoria,
    setStatus,
    setTipo,
    setFormato,
    clearFilters,
    hasActiveFilters,
    totalResults,
    totalAvailable
  } = useOportunidadesFilter(dados);

  useEffect(() => {
    // Carrega oportunidades e categorias em paralelo
    Promise.all([
      getOportunidades(),
      getCategorias()
    ])
      .then(([oportResponse, catResponse]) => {
        setDados(oportResponse.data || oportResponse);
        setCategorias(catResponse.data || catResponse);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Layout>
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Carregando oportunidades...</h2>
      </div>
    </Layout>
  );
  
  if (error) return (
    <Layout>
      <div className="error-container">
        <h2>❌ Erro ao carregar oportunidades</h2>
        <p>{error}</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="oportunidades-page">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Oportunidades de Voluntariado</h1>
            <p className="page-subtitle">
              Encontre a causa perfeita para você e faça a diferença na sua comunidade
            </p>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="filters-section">
          <SearchBar
            value={filters.searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por título, descrição, organização..."
          />

          <FilterBar
            filters={filters}
            categorias={categorias}
            onCategoriaChange={setCategoria}
            onStatusChange={setStatus}
            onTipoChange={setTipo}
            onFormatoChange={setFormato}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            totalResults={totalResults}
            totalAvailable={totalAvailable}
          />
        </div>

        {/* Resultados */}
        {filteredOportunidades.length === 0 ? (
          <div className="empty-state">
            {hasActiveFilters ? (
              <>
                <div className="empty-state-icon">🔍</div>
                <h2>Nenhum resultado encontrado</h2>
                <p>Tente ajustar seus filtros para ver mais oportunidades</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Limpar Filtros
                </button>
              </>
            ) : (
              <>
                <div className="empty-state-icon">📋</div>
                <h2>Nenhuma oportunidade disponível</h2>
                <p>No momento não há oportunidades cadastradas. Volte em breve!</p>
              </>
            )}
          </div>
        ) : (
          <div className="opportunities-grid">
            {filteredOportunidades.map((oportunidade) => (
              <OpportunityCard 
                key={oportunidade.id} 
                oportunidade={oportunidade} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
