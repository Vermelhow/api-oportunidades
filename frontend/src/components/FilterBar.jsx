import { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(true);

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

  // Conta quantos filtros estão ativos
  const activeFilterCount = [
    filters.categoria,
    filters.status,
    filters.tipo,
    filters.formato
  ].filter(Boolean).length;

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <div className="filter-results-info">
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
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} ativo{activeFilterCount !== 1 ? 's' : ''}</span>
          )}
        </div>

        <div className="filter-bar-actions">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="btn-clear-filters"
              type="button"
              title="Limpar todos os filtros"
            >
              ✕ Limpar Filtros
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-toggle-filters"
            type="button"
            aria-label={isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? '▲' : '▼'} Filtros
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filter-bar-controls">
          {/* Filtro por Categoria */}
          <div className="filter-group">
            <label htmlFor="filter-categoria" className="filter-label">
              <span className="filter-label-icon">🏷️</span>
              <span>Categoria</span>
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
              <span className="filter-label-icon">📊</span>
              <span>Status</span>
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
              <span className="filter-label-icon">💡</span>
              <span>Tipo</span>
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
              <span className="filter-label-icon">📍</span>
              <span>Formato</span>
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
      )}

      {/* Tags de filtros ativos */}
      {hasActiveFilters && isExpanded && (
        <div className="filter-tags">
          <span className="filter-tags-label">Filtros ativos:</span>
          
          {filters.categoria && (
            <button
              onClick={() => onCategoriaChange && onCategoriaChange('')}
              className="filter-tag"
              type="button"
              title="Remover filtro de categoria"
            >
              <span>🏷️ {categorias.find(c => c.id === parseInt(filters.categoria))?.nome || 'Categoria'}</span>
              <span className="filter-tag-remove">✕</span>
            </button>
          )}
          
          {filters.status && (
            <button
              onClick={() => onStatusChange && onStatusChange('')}
              className="filter-tag"
              type="button"
              title="Remover filtro de status"
            >
              <span>{statusOptions.find(o => o.value === filters.status)?.label || filters.status}</span>
              <span className="filter-tag-remove">✕</span>
            </button>
          )}
          
          {filters.tipo && (
            <button
              onClick={() => onTipoChange && onTipoChange('')}
              className="filter-tag"
              type="button"
              title="Remover filtro de tipo"
            >
              <span>{tipoOptions.find(o => o.value === filters.tipo)?.label || filters.tipo}</span>
              <span className="filter-tag-remove">✕</span>
            </button>
          )}
          
          {filters.formato && (
            <button
              onClick={() => onFormatoChange && onFormatoChange('')}
              className="filter-tag"
              type="button"
              title="Remover filtro de formato"
            >
              <span>{formatoOptions.find(o => o.value === filters.formato)?.label || filters.formato}</span>
              <span className="filter-tag-remove">✕</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
