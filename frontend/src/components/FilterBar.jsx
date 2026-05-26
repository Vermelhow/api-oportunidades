import '../styles/FilterBar.css';

/**
 * Barra de filtros para oportunidades
 * 
 * @param {Object} filters - Estado atual dos filtros
 * @param {Array} categorias - Lista de categorias disponíveis
 * @param {function} onCategoriaChange - Callback para mudança de categoria
 * @param {function} onStatusChange - Callback para mudança de status
 * @param {function} onTipoChange - Callback para mudança de tipo
 * @param {function} onFormatoChange - Callback para mudança de formato
 * @param {function} onClearFilters - Callback para limpar filtros
 * @param {boolean} hasActiveFilters - Indica se há filtros ativos
 * @param {number} totalResults - Total de resultados após filtros
 * @param {number} totalAvailable - Total de oportunidades disponíveis
 */
export default function FilterBar({
  filters = {},
  categorias = [],
  onCategoriaChange,
  onStatusChange,
  onTipoChange,
  onFormatoChange,
  onClearFilters,
  hasActiveFilters = false,
  totalResults = 0,
  totalAvailable = 0
}) {
  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'ativa', label: '🟢 Ativas' },
    { value: 'pausada', label: '🟡 Pausadas' },
    { value: 'encerrada', label: '🔴 Encerradas' }
  ];

  const tipoOptions = [
    { value: '', label: 'Todos os Tipos' },
    { value: 'emprego', label: '💼 Emprego' },
    { value: 'estagio', label: '🎓 Estágio' },
    { value: 'voluntariado', label: '❤️ Voluntariado' },
    { value: 'freelancer', label: '💻 Freelancer' }
  ];

  const formatoOptions = [
    { value: '', label: 'Todos os Formatos' },
    { value: 'presencial', label: '🏢 Presencial' },
    { value: 'remoto', label: '💻 Remoto' },
    { value: 'hibrido', label: '🔄 Híbrido' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <div className="filter-results">
          <span className="filter-results-count">
            {totalResults === totalAvailable ? (
              <>
                <strong>{totalResults}</strong> oportunidade{totalResults !== 1 ? 's' : ''}
              </>
            ) : (
              <>
                <strong>{totalResults}</strong> de <strong>{totalAvailable}</strong> oportunidade{totalAvailable !== 1 ? 's' : ''}
              </>
            )}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="btn-clear-filters"
            type="button"
          >
            ✕ Limpar Filtros
          </button>
        )}
      </div>

      <div className="filter-bar-controls">
        {/* Filtro por Categoria */}
        <div className="filter-group">
          <label htmlFor="filter-categoria" className="filter-label">
            🏷️ Categoria
          </label>
          <select
            id="filter-categoria"
            className="filter-select"
            value={filters.categoria || ''}
            onChange={(e) => onCategoriaChange && onCategoriaChange(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Status */}
        <div className="filter-group">
          <label htmlFor="filter-status" className="filter-label">
            📊 Status
          </label>
          <select
            id="filter-status"
            className="filter-select"
            value={filters.status || ''}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tipo */}
        <div className="filter-group">
          <label htmlFor="filter-tipo" className="filter-label">
            💡 Tipo
          </label>
          <select
            id="filter-tipo"
            className="filter-select"
            value={filters.tipo || ''}
            onChange={(e) => onTipoChange && onTipoChange(e.target.value)}
          >
            {tipoOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Formato */}
        <div className="filter-group">
          <label htmlFor="filter-formato" className="filter-label">
            📍 Formato
          </label>
          <select
            id="filter-formato"
            className="filter-select"
            value={filters.formato || ''}
            onChange={(e) => onFormatoChange && onFormatoChange(e.target.value)}
          >
            {formatoOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags de filtros ativos */}
      {hasActiveFilters && (
        <div className="filter-tags">
          {filters.searchTerm && (
            <span className="filter-tag">
              🔍 "{filters.searchTerm}"
              <button
                onClick={() => onCategoriaChange && onCategoriaChange('')}
                className="filter-tag-remove"
                type="button"
                aria-label="Remover filtro"
              >
                ✕
              </button>
            </span>
          )}
          {filters.categoria && (
            <span className="filter-tag">
              🏷️ {categorias.find(c => c.id === parseInt(filters.categoria))?.nome || 'Categoria'}
              <button
                onClick={() => onCategoriaChange && onCategoriaChange('')}
                className="filter-tag-remove"
                type="button"
                aria-label="Remover filtro"
              >
                ✕
              </button>
            </span>
          )}
          {filters.status && (
            <span className="filter-tag">
              📊 {statusOptions.find(o => o.value === filters.status)?.label || filters.status}
              <button
                onClick={() => onStatusChange && onStatusChange('')}
                className="filter-tag-remove"
                type="button"
                aria-label="Remover filtro"
              >
                ✕
              </button>
            </span>
          )}
          {filters.tipo && (
            <span className="filter-tag">
              💡 {tipoOptions.find(o => o.value === filters.tipo)?.label || filters.tipo}
              <button
                onClick={() => onTipoChange && onTipoChange('')}
                className="filter-tag-remove"
                type="button"
                aria-label="Remover filtro"
              >
                ✕
              </button>
            </span>
          )}
          {filters.formato && (
            <span className="filter-tag">
              📍 {formatoOptions.find(o => o.value === filters.formato)?.label || filters.formato}
              <button
                onClick={() => onFormatoChange && onFormatoChange('')}
                className="filter-tag-remove"
                type="button"
                aria-label="Remover filtro"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
