/**
 * Componente reutilizável para campos de formulário
 * Reduz duplicação de código e padroniza a interface
 * 
 * @param {string} label - Texto do label
 * @param {string} name - Nome do campo (usado como id também)
 * @param {string} type - Tipo do input: 'text', 'email', 'number', 'date', 'url', 'textarea', 'select'
 * @param {string|number} value - Valor do campo
 * @param {function} onChange - Callback de mudança de valor
 * @param {string} error - Mensagem de erro (se houver)
 * @param {string} hint - Dica/ajuda para o campo
 * @param {boolean} required - Se o campo é obrigatório
 * @param {string} placeholder - Placeholder do campo
 * @param {array} options - Opções para select (array de {value, label})
 * @param {number} rows - Número de linhas para textarea
 * @param {object} inputProps - Props adicionais para o input
 * @param {string} width - Largura: 'full', 'half', 'third'
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  required = false,
  placeholder = '',
  options = [],
  rows = 3,
  inputProps = {},
  width = 'full'
}) {
  const inputId = name;

  const renderInput = () => {
    const baseClassName = error ? 'error' : '';

    // Textarea
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-textarea ${baseClassName}`}
          placeholder={placeholder}
          rows={rows}
          {...inputProps}
        />
      );
    }

    // Select
    if (type === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-select ${baseClassName}`}
          {...inputProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Input padrão
    return (
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-input ${baseClassName}`}
        placeholder={placeholder}
        {...inputProps}
      />
    );
  };

  return (
    <div className={`form-group ${width}`}>
      {label && (
        <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      {renderInput()}
      {!error && hint && <span className="field-hint">{hint}</span>}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

/**
 * Container para agrupar campos em linha
 */
export function FormRow({ children, className = '' }) {
  return (
    <div className={`form-row ${className}`}>
      {children}
    </div>
  );
}

/**
 * Seção do formulário com título
 */
export function FormSection({ title, icon, children, className = '' }) {
  return (
    <div className={`form-section ${className}`}>
      {title && (
        <h2 className="form-section-title">
          {icon && <span>{icon}</span>} {title}
        </h2>
      )}
      {children}
    </div>
  );
}

/**
 * Container de ações do formulário (botões)
 */
export function FormActions({ children, align = 'right', className = '' }) {
  return (
    <div className={`form-actions align-${align} ${className}`}>
      {children}
    </div>
  );
}
