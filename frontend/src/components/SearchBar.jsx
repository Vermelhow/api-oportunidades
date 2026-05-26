import { useState, useEffect } from 'react';
import '../styles/SearchBar.css';

/**
 * Componente de busca com debounce
 * 
 * @param {string} value - Valor atual da busca
 * @param {function} onChange - Callback quando busca muda
 * @param {string} placeholder - Texto do placeholder
 * @param {number} debounceTime - Tempo de debounce em ms (padrão: 300)
 * @param {boolean} disabled - Desabilita o input
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Buscar oportunidades...',
  debounceTime = 300,
  disabled = false
}) {
  const [localValue, setLocalValue] = useState(value);

  // Sincroniza valor local com prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce: só chama onChange após usuário parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
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

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          aria-label="Buscar oportunidades"
        />
        {localValue && (
          <button
            className="search-clear"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Limpar busca"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
