import { useEffect, useState } from "react";
import { getOportunidades, getCategorias } from "../services/api";
import Layout from '../components/Layout';
import OpportunityCard from '../components/OpportunityCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { Loading, ErrorMessage, EmptyState, SkeletonCard } from '../components';
import { useOportunidadesFilter } from '../hooks/useOportunidadesFilter';
import { useNotification } from '../context/NotificationContext';
import '../styles/Oportunidades.css';

export default function Oportunidades() {
  const [dados, setDados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { showError } = useNotification();

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
        console.error('Erro ao carregar dados:', err);
        setError(err);
        setLoading(false);
        showError(err.message || 'Erro ao carregar oportunidades');
      });
  }, [showError]);

  // Loading com skeleton
  if (loading) {
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

          <div className="filters-section">
            <div className="skeleton" style={{ height: '48px', borderRadius: '12px' }}></div>
            <div className="skeleton" style={{ height: '120px', borderRadius: '12px', marginTop: '1rem' }}></div>
          </div>

          <div className="opportunities-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  // Erro com opção de retry
  if (error) {
    return (
      <Layout>
        <div className="oportunidades-page">
          <ErrorMessage
            title="Erro ao Carregar Oportunidades"
            message={error.message || 'Não foi possível carregar as oportunidades. Por favor, tente novamente.'}
            onRetry={() => window.location.reload()}
            showRetry={true}
          />
        </div>
      </Layout>
    );
  }

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
          hasActiveFilters ? (
            <EmptyState
              icon="🔍"
              title="Nenhum resultado encontrado"
              message="Tente ajustar seus filtros para ver mais oportunidades"
              action={clearFilters}
              actionLabel="Limpar Filtros"
            />
          ) : (
            <EmptyState
              icon="📋"
              title="Nenhuma oportunidade disponível"
              message="No momento não há oportunidades cadastradas. Volte em breve!"
            />
          )
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
