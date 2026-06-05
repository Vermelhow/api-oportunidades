import { useState, useEffect } from 'react';
import '../styles/SearchBar.css';

/**
 * Componente de busca com debounce e feedback visual
 * 
 * @param {string} value - Valor atual da busca
 * @param {function} onChange - Callback quando busca muda
 * @param {string} placeholder - Texto do placeholder
 * @param {number} debounceTime - Tempo de debounce em ms (padrão: 300)
 * @param {boolean} disabled - Desabilita o input
 * @param {number} resultCount - Número de resultados encontrados
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Buscar oportunidades...',
  debounceTime = 300,
  disabled = false,
  resultCount = null
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isSearching, setIsSearching] = useState(false);

  // Sincroniza valor local com prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce: só chama onChange após usuário parar de digitar
  useEffect(() => {
    if (localValue !== value) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
      setIsSearching(false);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [localValue, debounceTime, onChange, value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange('');
    }
  };

  const handleKeyDown = (e) => {
    // Esc para limpar
    if (e.key === 'Escape' && localValue) {
      handleClear();
    }
  };

  return (
    <div className="search-bar">
      <div className={`search-input-wrapper ${isSearching ? 'searching' : ''} ${localValue ? 'has-value' : ''}`}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Buscar oportunidades"
          autoComplete="off"
        />
        {localValue && (
          <button
            className="search-clear"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Limpar busca"
            title="Limpar busca (Esc)"
            type="button"
          >
            ✕
          </button>
        )}
        {isSearching && (
          <span className="search-loading">⏳</span>
        )}
      </div>
      
      {localValue && resultCount !== null && !isSearching && (
        <div className="search-feedback">
          {resultCount === 0 ? (
            <span className="search-no-results">
              ❌ Nenhum resultado para "<strong>{localValue}</strong>"
            </span>
          ) : (
            <span className="search-results-count">
              ✓ {resultCount} resultado{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
